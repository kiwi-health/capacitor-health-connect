// hc-to-apple-health.ts
type HCEnergy = { unit: string; value: number };
type HCMass = { unit: string; value: number };
type HCQuantity = { unit: string; value: number };
type HCRecord = any;

export interface ConvertInput { records: HCRecord[]; sourceName?: string; }

const APPLE_TYPES = {
  BodyMass: "HKQuantityTypeIdentifierBodyMass",
  Height: "HKQuantityTypeIdentifierHeight",
  BodyFatPercentage: "HKQuantityTypeIdentifierBodyFatPercentage",
  BodyTemperature: "HKQuantityTypeIdentifierBodyTemperature",
  HeartRate: "HKQuantityTypeIdentifierHeartRate",
  RestingHeartRate: "HKQuantityTypeIdentifierRestingHeartRate",
  RespiratoryRate: "HKQuantityTypeIdentifierRespiratoryRate",
  OxygenSaturation: "HKQuantityTypeIdentifierOxygenSaturation",
  BloodGlucose: "HKQuantityTypeIdentifierBloodGlucose",
  VO2Max: "HKQuantityTypeIdentifierVO2Max",
  StepCount: "HKQuantityTypeIdentifierStepCount",
  DistanceWalkingRunning: "HKQuantityTypeIdentifierDistanceWalkingRunning",
  FlightsClimbed: "HKQuantityTypeIdentifierFlightsClimbed",
  BasalEnergyBurned: "HKQuantityTypeIdentifierBasalEnergyBurned",
  ActiveEnergyBurned: "HKQuantityTypeIdentifierActiveEnergyBurned",
  DietaryEnergyConsumed: "HKQuantityTypeIdentifierDietaryEnergyConsumed",
  DietaryWater: "HKQuantityTypeIdentifierDietaryWater",
  DietaryProtein: "HKQuantityTypeIdentifierDietaryProtein",
  DietaryFatTotal: "HKQuantityTypeIdentifierDietaryFatTotal",
  DietaryFatSaturated: "HKQuantityTypeIdentifierDietaryFatSaturated",
  DietaryFatMonounsaturated: "HKQuantityTypeIdentifierDietaryFatMonounsaturated",
  DietaryFatPolyunsaturated: "HKQuantityTypeIdentifierDietaryFatPolyunsaturated",
  DietaryCholesterol: "HKQuantityTypeIdentifierDietaryCholesterol",
  DietarySodium: "HKQuantityTypeIdentifierDietarySodium",
  DietaryPotassium: "HKQuantityTypeIdentifierDietaryPotassium",
  DietaryCarbohydrates: "HKQuantityTypeIdentifierDietaryCarbohydrates",
  DietaryFiber: "HKQuantityTypeIdentifierDietaryFiber",
  DietarySugar: "HKQuantityTypeIdentifierDietarySugar",
  DietaryVitaminA: "HKQuantityTypeIdentifierDietaryVitaminA",
  DietaryVitaminC: "HKQuantityTypeIdentifierDietaryVitaminC",
  DietaryVitaminD: "HKQuantityTypeIdentifierDietaryVitaminD",
  DietaryVitaminE: "HKQuantityTypeIdentifierDietaryVitaminE",
  DietaryVitaminK: "HKQuantityTypeIdentifierDietaryVitaminK",
  DietaryThiamin: "HKQuantityTypeIdentifierDietaryThiamin",
  DietaryRiboflavin: "HKQuantityTypeIdentifierDietaryRiboflavin",
  DietaryNiacin: "HKQuantityTypeIdentifierDietaryNiacin",
  DietaryVitaminB6: "HKQuantityTypeIdentifierDietaryVitaminB6",
  DietaryVitaminB12: "HKQuantityTypeIdentifierDietaryVitaminB12",
  DietaryFolate: "HKQuantityTypeIdentifierDietaryFolate",
  DietaryBiotin: "HKQuantityTypeIdentifierDietaryBiotin",
  DietaryPantothenicAcid: "HKQuantityTypeIdentifierDietaryPantothenicAcid",
  DietaryCalcium: "HKQuantityTypeIdentifierDietaryCalcium",
  DietaryIron: "HKQuantityTypeIdentifierDietaryIron",
  DietaryMagnesium: "HKQuantityTypeIdentifierDietaryMagnesium",
  DietaryPhosphorus: "HKQuantityTypeIdentifierDietaryPhosphorus",
  DietaryZinc: "HKQuantityTypeIdentifierDietaryZinc",
  DietaryCopper: "HKQuantityTypeIdentifierDietaryCopper",
  DietaryManganese: "HKQuantityTypeIdentifierDietaryManganese",
  DietarySelenium: "HKQuantityTypeIdentifierDietarySelenium",
  DietaryIodine: "HKQuantityTypeIdentifierDietaryIodine",
  RunningCadence: "HKQuantityTypeIdentifierRunningCadence",
  CyclingCadence: "HKQuantityTypeIdentifierCyclingCadence",
  WalkingSpeed: "HKQuantityTypeIdentifierWalkingSpeed",
  RunningSpeed: "HKQuantityTypeIdentifierRunningSpeed",
  CyclingSpeed: "HKQuantityTypeIdentifierCyclingSpeed",
  SleepAnalysis: "HKCategoryTypeIdentifierSleepAnalysis",
  MenstrualFlow: "HKCategoryTypeIdentifierMenstrualFlow",
  IntermenstrualBleeding: "HKCategoryTypeIdentifierIntermenstrualBleeding",
  CervicalMucusQuality: "HKCategoryTypeIdentifierCervicalMucusQuality",
  OvulationTestResult: "HKCategoryTypeIdentifierOvulationTestResult",
  SexualActivity: "HKCategoryTypeIdentifierSexualActivity"
} as const;

const SUPPORTED_INPUT_TYPES = new Set<string>([
  "ActiveCaloriesBurned","BasalBodyTemperature","BasalMetabolicRate","BloodGlucose","BloodPressure",
  "BodyFat","BodyTemperature","BodyWaterMass","BoneMass","CervicalMucus","Distance","ElevationGained",
  "ExerciseSession","FloorsClimbed","HeartRateSeries","Height","Hydration","IntermenstrualBleeding",
  "LeanBodyMass","Menstruation","MenstruationFlow","Nutrition","OvulationTest","OxygenSaturation",
  "PlannedExercise","Power","RespiratoryRate","RestingHeartRate","SexualActivity","SleepSession",
  "SleepStage","SkinTemperature","Speed","Steps","StepsCadence","TotalCaloriesBurned","Vo2Max","Weight",
  "WheelchairPushes","CyclingPedalingCadence"
]);

function isoToApple(i?: string){ if(!i) return undefined; const d=new Date(i);
  const pad=(n:number)=>String(n).padStart(2,"0"); const off=-d.getTimezoneOffset(); const sign=off>=0?"+":"-";
  const hh=pad(Math.floor(Math.abs(off)/60)); const mm=pad(Math.abs(off)%60);
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${sign}${hh}${mm}`;
}
const esc=(s:any)=>String(s??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

function getSourceName(rec:any, fallback:string){
  const meta = (rec && rec.metadata) || {};
  const pkg = meta.dataOrigin || meta.packageName || meta.appPackageName || meta.sourcePackage;
  return (pkg && String(pkg).trim().length>0) ? String(pkg) : fallback;
}

function energyToKCal(e?: HCEnergy){ if(!e) return undefined; const u=e.unit?.toLowerCase?.()||""; if(u.includes("kilocal")) return e.value; if(u.includes("cal")) return e.value/1000; if(u.includes("joule")) return e.value/4184; return e.value; }
function tempToC(t?: HCQuantity){ if(!t) return undefined; const u=t.unit?.toLowerCase?.()||""; return u.includes("f")?(t.value-32)/1.8:t.value; }
function massToKg(m?: HCMass){ if(!m) return undefined; const u=m.unit?.toLowerCase?.()||""; if(u.startsWith("kilo")) return m.value; if(u.startsWith("gram")) return m.value/1000; if(u.startsWith("pound")) return m.value*0.45359237; return m.value; }
function massToG(m?: HCMass){ if(!m) return undefined; const u=m.unit?.toLowerCase?.()||""; if(u.startsWith("kilo")) return m.value*1000; if(u.startsWith("gram")) return m.value; if(u.startsWith("pound")) return m.value*453.59237; return m.value; }
function massToMg(m?: HCMass){ const g=massToG(m); return g===undefined?undefined:g*1000; }
function massToMicrog(m?: HCMass){ const g=massToG(m); return g===undefined?undefined:g*1e6; }
function lengthToMeters(l?: HCQuantity){ if(!l) return undefined; const u=l.unit?.toLowerCase?.()||""; if(u.includes("kilo")) return l.value*1000; if(u.includes("mile")) return l.value*1609.344; if(u.includes("feet")||u.includes("foot")) return l.value*0.3048; if(u.includes("inch")) return l.value*0.0254; return l.value; }
function volumeToMl(v?: HCQuantity){ if(!v) return undefined; const u=v.unit?.toLowerCase?.()||""; return (u==="l"||u.includes("liter"))?v.value*1000:v.value; }
function speedToMS(s?: HCQuantity){ if(!s) return undefined; const u=s.unit?.toLowerCase?.()||""; if(u.includes("km/h")) return s.value/3.6; if(u.includes("mph")) return s.value*0.44704; return s.value; }

const emitRecord = (a:{type:string,sourceName:string,startDate:string,endDate:string,value:any,unit:string}) =>
  `<Record type="${esc(a.type)}" sourceName="${esc(a.sourceName)}" startDate="${esc(a.startDate)}" endDate="${esc(a.endDate)}" value="${esc(a.value)}" unit="${esc(a.unit)}"/>`;

function emitWorkout(w:{ workoutActivityType:string; duration:number; durationUnit:string; sourceName:string; creationDate?:string; startDate:string; endDate:string; metadata?:{key:string;value:any}[]; stats?:{type:string;startDate:string;endDate:string;sum:any;unit:string}[] }){
  const m = (w.metadata||[]).map(x=>`  <MetadataEntry key="${esc(x.key)}" value="${esc(x.value)}"/>`).join("\n");
  const s = (w.stats||[]).map(x=>`  <WorkoutStatistics type="${esc(x.type)}" startDate="${esc(x.startDate)}" endDate="${esc(x.endDate)}" sum="${esc(x.sum)}" unit="${esc(x.unit)}"/>`).join("\n");
  return `<Workout workoutActivityType="${esc(w.workoutActivityType)}" duration="${esc(w.duration)}" durationUnit="${esc(w.durationUnit)}" sourceName="${esc(w.sourceName)}"${w.creationDate?` creationDate="${esc(w.creationDate)}"`:""} startDate="${esc(w.startDate)}" endDate="${esc(w.endDate)}">
${m}${m&&s?"\n":""}${s}
</Workout>`;
}

export function convertHealthConnectJsonToAppleXML(input: ConvertInput): string {
  const defaultSource = input.sourceName || "HealthConnect";
  const parts: string[] = [];

  const all = Array.isArray(input.records)? input.records : [];
  const byType:any = all.reduce((m:any,r:any)=>{ (m[r?.type]||(m[r.type]=[])).push(r); return m; }, {});

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
        if (rec.water) parts.push(emitRecord({ ...base, type: APPLE_TYPES.DietaryWater, unit: "mL", value: (rec.water.unit?.toLowerCase?.().includes("l")? rec.water.value*1000 : rec.water.value) ?? "" }));
        if (rec.protein) parts.push(emitRecord({ ...base, type: APPLE_TYPES.DietaryProtein, unit: "g", value: (rec.protein.unit?.toLowerCase?.().startsWith("kilo")? rec.protein.value*1000 : rec.protein.value) ?? "" }));
        break;
      case "SleepSession":
        parts.push(emitRecord({ ...base, type: APPLE_TYPES.SleepAnalysis, unit: "", value: "HKCategoryValueSleepAnalysisInBed" })); break;
      case "SleepStage": {
        const awake="HKCategoryValueSleepAnalysisAwake", core="HKCategoryValueSleepAnalysisAsleepCore", deep="HKCategoryValueSleepAnalysisAsleepDeep", rem="HKCategoryValueSleepAnalysisAsleepREM";
        const st=Number(rec.stage); let value=core; if(st===0) value=awake; else if(st===2) value=deep; else if(st===3) value=rem;
        parts.push(emitRecord({ ...base, type: APPLE_TYPES.SleepAnalysis, unit: "", value })); break;
      }
      case "Menstruation":
        parts.push(emitRecord({ ...base, type: APPLE_TYPES.MenstrualFlow, unit: "", value: "HKCategoryValueMenstrualFlowUnspecified" })); break;
      case "MenstruationFlow": {
        const flow = String(rec.flow || rec.level || rec.value || "").toLowerCase();
        let value = "HKCategoryValueMenstrualFlowUnspecified";
        if (flow.includes("light")) value = "HKCategoryValueMenstrualFlowLight";
        else if (flow.includes("medium") || flow.includes("moderate")) value = "HKCategoryValueMenstrualFlowMedium";
        else if (flow.includes("heavy")) value = "HKCategoryValueMenstrualFlowHeavy";
        parts.push(emitRecord({ ...base, type: APPLE_TYPES.MenstrualFlow, unit: "", value })); break;
      }
      case "IntermenstrualBleeding":
        parts.push(emitRecord({ ...base, type: APPLE_TYPES.IntermenstrualBleeding, unit: "", value: "HKCategoryValueNotApplicable" })); break;
      case "CervicalMucus": {
        const app = String(rec.appearance||"").toLowerCase();
        let value = "HKCategoryValueCervicalMucusQualityDry";
        if (app.includes("sticky")) value = "HKCategoryValueCervicalMucusQualitySticky";
        else if (app.includes("creamy")) value = "HKCategoryValueCervicalMucusQualityCreamy";
        else if (app.includes("watery")) value = "HKCategoryValueCervicalMucusQualityWatery";
        else if (app.includes("egg")) value = "HKCategoryValueCervicalMucusQualityEggWhite";
        parts.push(emitRecord({ ...base, type: APPLE_TYPES.CervicalMucusQuality, unit: "", value })); break;
      }
      case "OvulationTest": {
        const r = String(rec.result||rec.value||"").toLowerCase();
        let value = "HKCategoryValueOvulationTestResultIndeterminate";
        if (r.includes("positive")) value = "HKCategoryValueOvulationTestResultPositive";
        else if (r.includes("negative")) value = "HKCategoryValueOvulationTestResultNegative";
        else if (r.includes("estrogen")) value = "HKCategoryValueOvulationTestResultEstrogenSurge";
        parts.push(emitRecord({ ...base, type: APPLE_TYPES.OvulationTestResult, unit: "", value })); break;
      }
      case "SexualActivity": {
        const value = rec.protected ? "HKCategoryValueSexualActivityProtectionUsed" : "HKCategoryValueSexualActivityProtectionNotUsed";
        parts.push(emitRecord({ ...base, type: APPLE_TYPES.SexualActivity, unit: "", value })); break;
      }
      case "ExerciseSession": {
        const startDate = start, endDate = end;
        const sD = new Date(rec.startTime), eD = new Date(rec.endTime);
        const durationMin = (eD.getTime() - sD.getTime())/60000;
        let distMeters = 0;
        for (const d of (byType["Distance"]||[])) {
          const sd = new Date(d.startTime||d.time), ed = new Date(d.endTime||d.time);
          if (sd<=eD && sD<=ed) distMeters += (typeof d.distance?.value==="number"? d.distance.value : 0);
        }
        const speeds:number[] = [];
        for (const sp of (byType["Speed"]||[])) {
          const sd = new Date(sp.startTime||sp.time), ed = new Date(sp.endTime||sp.time);
          if (!(sd<=eD && sD<=ed)) continue;
          if (Array.isArray(sp.samples) && sp.samples.length){
            for (const smp of sp.samples){ const v = speedToMS(smp.speed||sp.speed); if (typeof v === "number") speeds.push(v); }
          } else { const v = speedToMS(sp.speed); if (typeof v === "number") speeds.push(v); }
        }
        const avgSpeed = speeds.length ? (speeds.reduce((a,b)=>a+b,0)/speeds.length) : (distMeters ? (distMeters/((eD.getTime()-sD.getTime())/1000)) : undefined);
        const maxSpeed = speeds.length ? Math.max(...speeds) : undefined;
        let elevAsc = 0; for (const el of (byType["ElevationGained"]||[])) {
          const sd = new Date(el.startTime||el.time), ed = new Date(el.endTime||el.time);
          if (sd<=eD && sD<=ed) elevAsc += (typeof el.elevation?.value==="number"? el.elevation.value : 0);
        }
        const metadata:any[] = [];
        if (avgSpeed !== undefined) metadata.push({ key:"HKAverageSpeed", value: `${avgSpeed} m/s` });
        if (maxSpeed !== undefined) metadata.push({ key:"HKMaximumSpeed", value: `${maxSpeed} m/s` });
        if (elevAsc) metadata.push({ key:"HKElevationAscended", value: `${elevAsc} m` });
        if (typeof rec.isIndoor === "boolean") metadata.push({ key:"HKIndoorWorkout", value: rec.isIndoor ? "1":"0" });
        const stats:any[] = [];
        if (distMeters) stats.push({ type: APPLE_TYPES.DistanceWalkingRunning, startDate, endDate, sum: (distMeters/1000), unit: "km" });
        let activeKCal = 0; for (const a of (byType["ActiveCaloriesBurned"]||[])){
          const sd = new Date(a.startTime||a.time), ed = new Date(a.endTime||a.time);
          if (sd<=eD && sD<=ed) { const ek = energyToKCal(a.energy); if (typeof ek === "number") activeKCal += ek; }
        }
        if (activeKCal) stats.push({ type: APPLE_TYPES.ActiveEnergyBurned, startDate, endDate, sum: activeKCal, unit: "kcal" });
        const workoutXml = `<Workout workoutActivityType="HKWorkoutActivityTypeOther" duration="${durationMin}" durationUnit="min" sourceName="${esc(getSourceName(rec, defaultSource))}" creationDate="${startDate}" startDate="${startDate}" endDate="${endDate}">
${metadata.map(x=>`  <MetadataEntry key="${esc(x.key)}" value="${esc(x.value)}"/>`).join("\n")}
${stats.map(x=>`  <WorkoutStatistics type="${esc(x.type)}" startDate="${esc(x.startDate)}" endDate="${esc(x.endDate)}" sum="${esc(x.sum)}" unit="${esc(x.unit)}"/>`).join("\n")}
</Workout>`;
        parts.push(workoutXml);
        break;
      }
      default: break;
    }
  }
  const header = '<?xml version="1.0" encoding="UTF-8"?>\n<HealthData locale="en_US">';
  const footer = '</HealthData>';
  return [header, ...parts, footer].join('\n');
}
