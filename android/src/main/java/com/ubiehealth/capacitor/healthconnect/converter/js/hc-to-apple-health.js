// hc-to-apple-health.js
function isoToApple(i){ if(!i) return undefined; const d=new Date(i);
  const pad=n=>String(n).padStart(2,"0"); const off=-d.getTimezoneOffset(); const sign=off>=0?"+":"-";
  const hh=pad(Math.floor(Math.abs(off)/60)); const mm=pad(Math.abs(off)%60);
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${sign}${hh}${mm}`;
}
const esc=s=>String(s??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

const APPLE_TYPES = {
  BodyMass:"HKQuantityTypeIdentifierBodyMass",
  Height:"HKQuantityTypeIdentifierHeight",
  BodyFatPercentage:"HKQuantityTypeIdentifierBodyFatPercentage",
  BodyTemperature:"HKQuantityTypeIdentifierBodyTemperature",
  HeartRate:"HKQuantityTypeIdentifierHeartRate",
  RestingHeartRate:"HKQuantityTypeIdentifierRestingHeartRate",
  RespiratoryRate:"HKQuantityTypeIdentifierRespiratoryRate",
  OxygenSaturation:"HKQuantityTypeIdentifierOxygenSaturation",
  BloodGlucose:"HKQuantityTypeIdentifierBloodGlucose",
  VO2Max:"HKQuantityTypeIdentifierVO2Max",
  StepCount:"HKQuantityTypeIdentifierStepCount",
  DistanceWalkingRunning:"HKQuantityTypeIdentifierDistanceWalkingRunning",
  FlightsClimbed:"HKQuantityTypeIdentifierFlightsClimbed",
  BasalEnergyBurned:"HKQuantityTypeIdentifierBasalEnergyBurned",
  ActiveEnergyBurned:"HKQuantityTypeIdentifierActiveEnergyBurned",
  DietaryEnergyConsumed:"HKQuantityTypeIdentifierDietaryEnergyConsumed",
  DietaryWater:"HKQuantityTypeIdentifierDietaryWater",
  DietaryProtein:"HKQuantityTypeIdentifierDietaryProtein",
  DietaryFatTotal:"HKQuantityTypeIdentifierDietaryFatTotal",
  DietaryFatSaturated:"HKQuantityTypeIdentifierDietaryFatSaturated",
  DietaryFatMonounsaturated:"HKQuantityTypeIdentifierDietaryFatMonounsaturated",
  DietaryFatPolyunsaturated:"HKQuantityTypeIdentifierDietaryFatPolyunsaturated",
  DietaryCholesterol:"HKQuantityTypeIdentifierDietaryCholesterol",
  DietarySodium:"HKQuantityTypeIdentifierDietarySodium",
  DietaryPotassium:"HKQuantityTypeIdentifierDietaryPotassium",
  DietaryCarbohydrates:"HKQuantityTypeIdentifierDietaryCarbohydrates",
  DietaryFiber:"HKQuantityTypeIdentifierDietaryFiber",
  DietarySugar:"HKQuantityTypeIdentifierDietarySugar",
  DietaryVitaminA:"HKQuantityTypeIdentifierDietaryVitaminA",
  DietaryVitaminC:"HKQuantityTypeIdentifierDietaryVitaminC",
  DietaryVitaminD:"HKQuantityTypeIdentifierDietaryVitaminD",
  DietaryVitaminE:"HKQuantityTypeIdentifierDietaryVitaminE",
  DietaryVitaminK:"HKQuantityTypeIdentifierDietaryVitaminK",
  DietaryThiamin:"HKQuantityTypeIdentifierDietaryThiamin",
  DietaryRiboflavin:"HKQuantityTypeIdentifierDietaryRiboflavin",
  DietaryNiacin:"HKQuantityTypeIdentifierDietaryNiacin",
  DietaryVitaminB6:"HKQuantityTypeIdentifierDietaryVitaminB6",
  DietaryVitaminB12:"HKQuantityTypeIdentifierDietaryVitaminB12",
  DietaryFolate:"HKQuantityTypeIdentifierDietaryFolate",
  DietaryBiotin:"HKQuantityTypeIdentifierDietaryBiotin",
  DietaryPantothenicAcid:"HKQuantityTypeIdentifierDietaryPantothenicAcid",
  DietaryCalcium:"HKQuantityTypeIdentifierDietaryCalcium",
  DietaryIron:"HKQuantityTypeIdentifierDietaryIron",
  DietaryMagnesium:"HKQuantityTypeIdentifierDietaryMagnesium",
  DietaryPhosphorus:"HKQuantityTypeIdentifierDietaryPhosphorus",
  DietaryZinc:"HKQuantityTypeIdentifierDietaryZinc",
  DietaryCopper:"HKQuantityTypeIdentifierDietaryCopper",
  DietaryManganese:"HKQuantityTypeIdentifierDietaryManganese",
  DietarySelenium:"HKQuantityTypeIdentifierDietarySelenium",
  DietaryIodine:"HKQuantityTypeIdentifierDietaryIodine",
  RunningCadence:"HKQuantityTypeIdentifierRunningCadence",
  CyclingCadence:"HKQuantityTypeIdentifierCyclingCadence",
  WalkingSpeed:"HKQuantityTypeIdentifierWalkingSpeed",
  RunningSpeed:"HKQuantityTypeIdentifierRunningSpeed",
  CyclingSpeed:"HKQuantityTypeIdentifierCyclingSpeed",
  SleepAnalysis:"HKCategoryTypeIdentifierSleepAnalysis",
  MenstrualFlow:"HKCategoryTypeIdentifierMenstrualFlow",
  IntermenstrualBleeding:"HKCategoryTypeIdentifierIntermenstrualBleeding",
  CervicalMucusQuality:"HKCategoryTypeIdentifierCervicalMucusQuality",
  OvulationTestResult:"HKCategoryTypeIdentifierOvulationTestResult",
  SexualActivity:"HKCategoryTypeIdentifierSexualActivity"
};

const SUPPORTED_INPUT_TYPES = new Set([
  "ActiveCaloriesBurned","BasalBodyTemperature","BasalMetabolicRate","BloodGlucose","BloodPressure",
  "BodyFat","BodyTemperature","BodyWaterMass","BoneMass","CervicalMucus","Distance","ElevationGained",
  "ExerciseSession","FloorsClimbed","HeartRateSeries","Height","Hydration","IntermenstrualBleeding",
  "LeanBodyMass","Menstruation","MenstruationFlow","Nutrition","OvulationTest","OxygenSaturation",
  "PlannedExercise","Power","RespiratoryRate","RestingHeartRate","SexualActivity","SleepSession",
  "SleepStage","SkinTemperature","Speed","Steps","StepsCadence","TotalCaloriesBurned","Vo2Max","Weight",
  "WheelchairPushes","CyclingPedalingCadence"
]);

const getSourceName = (rec, fb) => {
  const meta = (rec && rec.metadata) || {};
  const pkg = meta.dataOrigin || meta.packageName || meta.appPackageName || meta.sourcePackage;
  return (pkg && String(pkg).trim().length>0) ? String(pkg) : fb;
};
const energyToKCal = e => { if(!e) return undefined; const u=(e.unit||"").toLowerCase(); if(u.includes("kilocal")) return e.value; if(u.includes("cal")) return e.value/1000; if(u.includes("joule")) return e.value/4184; return e.value; };
const tempToC = t => { if(!t) return undefined; const u=(t.unit||"").toLowerCase(); return u.includes("f")?(t.value-32)/1.8:t.value; };
const massToKg = m => { if(!m) return undefined; const u=(m.unit||"").toLowerCase(); if(u.startsWith("kilo")) return m.value; if(u.startsWith("gram")) return m.value/1000; if(u.startsWith("pound")) return m.value*0.45359237; return m.value; };
const lengthToMeters = l => { if(!l) return undefined; const u=(l.unit||"").toLowerCase(); if(u.includes("kilo")) return l.value*1000; if(u.includes("mile")) return l.value*1609.344; if(u.includes("feet")||u.includes("foot")) return l.value*0.3048; if(u.includes("inch")) return l.value*0.0254; return l.value; };
const speedToMS = s => { if(!s) return undefined; const u=(s.unit||"").toLowerCase(); if(u.includes("km/h")) return s.value/3.6; if(u.includes("mph")) return s.value*0.44704; return s.value; };

const emitRecord = a =>
  `<Record type="${esc(a.type)}" sourceName="${esc(a.sourceName)}" startDate="${esc(a.startDate)}" endDate="${esc(a.endDate)}" value="${esc(a.value)}" unit="${esc(a.unit)}"/>`;

function convertHealthConnectJsonToAppleXML(input){
  const defaultSource = input.sourceName || "HealthConnect";
  const parts = [];

  const all = Array.isArray(input.records)? input.records : [];
  const byType = all.reduce((m,r)=>{ (m[r?.type]||(m[r.type]=[])).push(r); return m; }, {});

  for (const rec of all) {
    if(!rec || !SUPPORTED_INPUT_TYPES.has(rec.type)) continue;
    const start = isoToApple(rec.startTime || rec.time);
    const end = isoToApple(rec.endTime || rec.time);
    if(!start || !end) continue;
    const base = { sourceName: getSourceName(rec, defaultSource), startDate: start, endDate: end };

    switch(rec.type){
      case "Weight": parts.push(emitRecord({ ...base, type: APPLE_TYPES.BodyMass, unit: "kg", value: massToKg(rec.weight) ?? "" })); break;
      case "Height": parts.push(emitRecord({ ...base, type: APPLE_TYPES.Height, unit: "m", value: lengthToMeters(rec.height) ?? "" })); break;
      case "BodyFat": parts.push(emitRecord({ ...base, type: APPLE_TYPES.BodyFatPercentage, unit: "%", value: rec.percentage?.value ?? "" })); break;
      case "BodyTemperature":
      case "BasalBodyTemperature":
      case "SkinTemperature":
        parts.push(emitRecord({ ...base, type: APPLE_TYPES.BodyTemperature, unit: "degC", value: tempToC(rec.temperature) ?? "" })); break;
      case "RestingHeartRate": parts.push(emitRecord({ ...base, type: APPLE_TYPES.RestingHeartRate, unit: "count/min", value: rec.beatsPerMinute ?? "" })); break;
      case "HeartRateSeries":
        if (Array.isArray(rec.samples)) for(const s of rec.samples){ const t=isoToApple(s.time); if(!t) continue; parts.push(emitRecord({ type: APPLE_TYPES.HeartRate, sourceName: getSourceName(rec, defaultSource), startDate: t, endDate: t, value: s.beatsPerMinute ?? "", unit: "count/min" })); }
        break;
      case "RespiratoryRate": parts.push(emitRecord({ ...base, type: APPLE_TYPES.RespiratoryRate, unit: "count/min", value: rec.rate ?? "" })); break;
      case "OxygenSaturation": parts.push(emitRecord({ ...base, type: APPLE_TYPES.OxygenSaturation, unit: "%", value: rec.percentage?.value ?? "" })); break;
      case "BloodGlucose": parts.push(emitRecord({ ...base, type: APPLE_TYPES.BloodGlucose, unit: "mg/dL", value: rec.level?.unit?.toLowerCase?.().includes("mmol") ? (rec.level.value*18.0182) : (rec.level?.value ?? "") })); break;
      case "BloodPressure":
        parts.push(emitRecord({ ...base, type: "HKQuantityTypeIdentifierBloodPressureSystolic", unit: "mmHg", value: rec.systolic?.value ?? "" }));
        parts.push(emitRecord({ ...base, type: "HKQuantityTypeIdentifierBloodPressureDiastolic", unit: "mmHg", value: rec.diastolic?.value ?? "" }));
        break;
      case "Steps": parts.push(emitRecord({ ...base, type: APPLE_TYPES.StepCount, unit: "count", value: rec.count ?? "" })); break;
      case "WheelchairPushes": parts.push(emitRecord({ ...base, type: "HKQuantityTypeIdentifierWheelchairPushes", unit: "count", value: rec.count ?? "" })); break;
      case "Distance": parts.push(emitRecord({ ...base, type: APPLE_TYPES.DistanceWalkingRunning, unit: "km", value: ((lengthToMeters(rec.distance)||0)/1000) })); break;
      case "FloorsClimbed": parts.push(emitRecord({ ...base, type: APPLE_TYPES.FlightsClimbed, unit: "count", value: rec.floors ?? "" })); break;
      case "ActiveCaloriesBurned": parts.push(emitRecord({ ...base, type: APPLE_TYPES.ActiveEnergyBurned, unit: "kcal", value: energyToKCal(rec.energy) ?? "" })); break;
      case "BasalMetabolicRate": parts.push(emitRecord({ ...base, type: APPLE_TYPES.BasalEnergyBurned, unit: "kcal", value: rec.basalMetabolicRate ? energyToKCal(rec.basalMetabolicRate) : "" })); break;
      case "TotalCaloriesBurned": parts.push(emitRecord({ ...base, type: APPLE_TYPES.ActiveEnergyBurned, unit: "kcal", value: energyToKCal(rec.energy) ?? "" })); break;
      case "CyclingPedalingCadence": {
        const v = (rec.samples?.[0]?.revolutionsPerMinute ?? rec.rpm ?? rec.value ?? "");
        parts.push(emitRecord({ ...base, type: APPLE_TYPES.CyclingCadence, unit: "count/min", value: v })); break;
      }
      case "Speed": {
        const sp = rec.samples?.[0]?.speed || rec.speed;
        const v = speedToMS(sp);
        const hint = String(rec.exerciseTypeName || rec.activityTypeName || rec.activityType || rec.title || "").toLowerCase();
        if (hint.includes("run")) parts.push(emitRecord({ ...base, type: APPLE_TYPES.RunningSpeed, unit: "m/s", value: v ?? "" }));
        else if (hint.includes("cycl")||hint.includes("bike")) parts.push(emitRecord({ ...base, type: APPLE_TYPES.CyclingSpeed, unit: "m/s", value: v ?? "" }));
        else if (hint.includes("walk")) parts.push(emitRecord({ ...base, type: APPLE_TYPES.WalkingSpeed, unit: "m/s", value: v ?? "" }));
        break;
      }
      case "StepsCadence": {
        const name = String(rec.exerciseTypeName || rec.activityTypeName || rec.activityType || rec.title || "").toLowerCase();
        const v = rec.samples?.[0]?.rate ?? rec.rate ?? rec.value ?? "";
        if (name.includes("run")) parts.push(emitRecord({ ...base, type: "HKQuantityTypeIdentifierRunningCadence", unit: "count/min", value: v }));
        break;
      }
      case "Vo2Max": parts.push(emitRecord({ ...base, type: APPLE_TYPES.VO2Max, unit: "mL/min·kg", value: (rec.vo2MillilitersPerMinuteKilogram ?? rec.vo2 ?? rec.vo2Max ?? rec.vo2mlPerMinPerKg ?? "") })); break;
      case "Nutrition":
        if (rec.energy) parts.push(emitRecord({ ...base, type: APPLE_TYPES.DietaryEnergyConsumed, unit: "kcal", value: energyToKCal(rec.energy) ?? "" }));
        if (rec.water) parts.push(emitRecord({ ...base, type: APPLE_TYPES.DietaryWater, unit: "mL", value: ((rec.water.unit||"").toLowerCase().includes("l")? rec.water.value*1000 : rec.water.value) ?? "" }));
        if (rec.protein) parts.push(emitRecord({ ...base, type: APPLE_TYPES.DietaryProtein, unit: "g", value: (((rec.protein.unit||"").toLowerCase().startsWith("kilo"))? rec.protein.value*1000 : rec.protein.value) ?? "" }));
        break;
      ​:contentReference[oaicite:0]{index=0}​
