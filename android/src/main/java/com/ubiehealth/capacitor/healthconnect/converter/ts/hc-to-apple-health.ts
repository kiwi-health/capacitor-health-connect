/**
 * Health Connect JSON -> Apple Health XML converter – v3.4 (TypeScript)
 * CHANGE: Every <Record> has ONLY: type, sourceName, startDate, endDate, value, unit.
 * Category values use Apple HKCategoryValue* strings (e.g., SleepAnalysisInBed).
 */

type ISO = string;

// ---------- Apple Health Identifiers ----------
const APPLE_TYPES = {
  Steps: "HKQuantityTypeIdentifierStepCount",
  HeartRate: "HKQuantityTypeIdentifierHeartRate",
  RestingHeartRate: "HKQuantityTypeIdentifierRestingHeartRate",
  ActiveCaloriesBurned: "HKQuantityTypeIdentifierActiveEnergyBurned",
  BasalEnergyBurned: "HKQuantityTypeIdentifierBasalEnergyBurned",
  BodyMass: "HKQuantityTypeIdentifierBodyMass",
  Height: "HKQuantityTypeIdentifierHeight",
  OxygenSaturation: "HKQuantityTypeIdentifierOxygenSaturation",
  BodyTemperature: "HKQuantityTypeIdentifierBodyTemperature",
  BasalBodyTemperature: "HKQuantityTypeIdentifierBasalBodyTemperature",
  RespiratoryRate: "HKQuantityTypeIdentifierRespiratoryRate",
  VO2Max: "HKQuantityTypeIdentifierVO2Max",
  BloodPressureSystolic: "HKQuantityTypeIdentifierBloodPressureSystolic",
  BloodPressureDiastolic: "HKQuantityTypeIdentifierBloodPressureDiastolic",
  BloodGlucose: "HKQuantityTypeIdentifierBloodGlucose",
  DistanceWalkingRunning: "HKQuantityTypeIdentifierDistanceWalkingRunning",
  DietaryWater: "HKQuantityTypeIdentifierDietaryWater",
  SleepAnalysis: "HKCategoryTypeIdentifierSleepAnalysis",
  SexualActivity: "HKCategoryTypeIdentifierSexualActivity",
  MenstrualFlow: "HKCategoryTypeIdentifierMenstrualFlow",
  OvulationTestResult: "HKCategoryTypeIdentifierOvulationTestResult",
  AppleSleepingWristTemperature: "HKQuantityTypeIdentifierAppleSleepingWristTemperature",
  PushCount: "HKQuantityTypeIdentifierPushCount",

  // Cadence & Speed
  CyclingCadence: "HKQuantityTypeIdentifierCyclingCadence",
  WalkingSpeed: "HKQuantityTypeIdentifierWalkingSpeed",
  RunningSpeed: "HKQuantityTypeIdentifierRunningSpeed",
  CyclingSpeed: "HKQuantityTypeIdentifierCyclingSpeed",
  RunningCadence: "HKQuantityTypeIdentifierRunningCadence",

  // Nutrition
  DietaryEnergy: "HKQuantityTypeIdentifierDietaryEnergyConsumed",
  DietaryFatTotal: "HKQuantityTypeIdentifierDietaryFatTotal",
  DietaryFatSaturated: "HKQuantityTypeIdentifierDietaryFatSaturated",
  DietaryFatPolyunsaturated: "HKQuantityTypeIdentifierDietaryFatPolyunsaturated",
  DietaryFatMonounsaturated: "HKQuantityTypeIdentifierDietaryFatMonounsaturated",
  DietaryCarbohydrates: "HKQuantityTypeIdentifierDietaryCarbohydrates",
  DietarySugar: "HKQuantityTypeIdentifierDietarySugar",
  DietaryFiber: "HKQuantityTypeIdentifierDietaryFiber",
  DietaryProtein: "HKQuantityTypeIdentifierDietaryProtein",
  DietarySodium: "HKQuantityTypeIdentifierDietarySodium",
  DietaryPotassium: "HKQuantityTypeIdentifierDietaryPotassium",
  DietaryCholesterol: "HKQuantityTypeIdentifierDietaryCholesterol",
  DietaryCalcium: "HKQuantityTypeIdentifierDietaryCalcium",
  DietaryIron: "HKQuantityTypeIdentifierDietaryIron",
  DietaryMagnesium: "HKQuantityTypeIdentifierDietaryMagnesium",
  DietaryZinc: "HKQuantityTypeIdentifierDietaryZinc",
  DietarySelenium: "HKQuantityTypeIdentifierDietarySelenium",
  DietaryCopper: "HKQuantityTypeIdentifierDietaryCopper",
  DietaryManganese: "HKQuantityTypeIdentifierDietaryManganese",
  DietaryPhosphorus: "HKQuantityTypeIdentifierDietaryPhosphorus",
  DietaryIodine: "HKQuantityTypeIdentifierDietaryIodine",
  DietaryMolybdenum: "HKQuantityTypeIdentifierDietaryMolybdenum",
  DietaryChromium: "HKQuantityTypeIdentifierDietaryChromium",
  DietaryChloride: "HKQuantityTypeIdentifierDietaryChloride",
  DietaryCaffeine: "HKQuantityTypeIdentifierDietaryCaffeine",
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
} as const;

// ---------- Date / helpers ----------
function pad(n: number) { return n < 10 ? "0"+n : ""+n; }
function formatAppleDate(iso: string): string {
  const d = new Date(iso);
  const offMin = -(d.getTimezoneOffset());
  const sign = offMin >= 0 ? "+" : "-";
  const abs = Math.abs(offMin);
  const hh = pad(Math.floor(abs / 60));
  const mm = pad(abs % 60);
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${sign}${hh}:${mm}`;
}

const esc = (s: any) => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

function emitRecord(attrs: {type: string; sourceName: string; startDate: string; endDate: string; value?: string|number; unit?: string}) {
  const allowed = ["type","sourceName","startDate","endDate","value","unit"] as const;
  const body = allowed.map(k => (attrs as any)[k] !== undefined ? `${k}="${esc((attrs as any)[k])}"` : null).filter(Boolean).join(" ");
  return `<Record ${body}></Record>`;
}

function baseAttrs(rec: any, startISO: string, endISO?: string) {
  return {
    type: "",
    sourceName: rec?.metadata?.dataOrigin || "Health Connect",
    startDate: formatAppleDate(startISO),
    endDate: formatAppleDate(endISO ?? startISO),
    value: undefined as string | number | undefined,
    unit: undefined as string | undefined,
  };
}

// ---------- Unit converters ----------
type Mass = { unit: string; value: number };
type Length = { unit: string; value: number };
type Energy = { unit: string; value: number };
type Temperature = { unit: string; value: number };
type Pressure = { unit: string; value: number };
type Volume = { unit: string; value: number };
type NutritionField = { unit: string; value: number };

const inGrams = (m: Mass) => {
  const u = m.unit?.toLowerCase();
  if (u === "gram" || u === "g") return m.value;
  if (u === "kilogram" || u === "kg") return m.value * 1000;
  if (u === "pound" || u === "lb" || u === "lbs") return m.value * 453.59237;
  throw new Error("Unsupported mass: " + m.unit);
};
const lengthToMeters = (l: Length) => {
  const u = l.unit?.toLowerCase();
  if (u === "meter" || u === "m") return l.value;
  if (u === "kilometer" || u === "km") return l.value * 1000;
  if (u === "mile" || u === "mi") return l.value * 1609.344;
  if (u === "inch" || u === "in") return l.value * 0.0254;
  if (u === "feet" || u === "foot" || u === "ft") return l.value * 0.3048;
  throw new Error("Unsupported length: " + l.unit);
};
const energyToKCal = (e: Energy) => {
  const u = e.unit?.toLowerCase();
  if (u === "kilocalories" || u === "kcal" || u === "calories") return e.value;
  if (u === "joules" || u === "j") return e.value / 4184;
  if (u === "kilojoules" || u === "kj") return e.value / 4.184;
  throw new Error("Unsupported energy: " + e.unit);
};
const pressureToMmHg = (p: Pressure) => {
  const u = p.unit?.toLowerCase();
  if (u?.includes("millimetersofmercury") || u === "mmhg") return p.value;
  throw new Error("Unsupported pressure: " + p.unit);
};
const tempToC = (t: Temperature) => {
  const u = t.unit?.toLowerCase();
  if (u === "celsius" || u === "°c" || u === "c") return t.value;
  if (u === "fahrenheit" || u === "°f" || u === "f") return (t.value - 32) * 5/9;
  throw new Error("Unsupported temperature: " + t.unit);
};
const glucoseToMgdl = (g: {unit: string; value: number}) => {
  const u = g.unit?.toLowerCase();
  if (u === "milligramsperdeciliter" || u === "mg/dl" || u === "mgdl") return g.value;
  if (u === "millimolesperliter" || u === "mmol/l" || u === "mmoll") return g.value * 18.0182;
  throw new Error("Unsupported glucose unit: " + g.unit);
};
const volumeToML = (v: Volume) => {
  const u = v.unit?.toLowerCase();
  if (u === "milliliters" || u === "milliliter" || u === "ml") return v.value;
  if (u === "liters" || u === "liter" || u === "l") return v.value * 1000;
  if (u === "fluidouncesus" || u === "fl_oz_us") return v.value * 29.5735;
  throw new Error("Unsupported volume: " + v.unit);
};

const normalizeUnit = (u: string) => (u || "").toLowerCase().replace("µ","u");
const gramsVal = (x: NutritionField) => {
  const u = normalizeUnit(x.unit);
  if (u === "g" || u === "gram") return x.value;
  if (u === "mg" || u === "milligram") return x.value / 1000;
  if (u === "mcg" || u === "ug" || u === "microgram") return x.value / 1_000_000;
  return x.value;
};
const mgVal = (x: NutritionField) => {
  const u = normalizeUnit(x.unit);
  if (u === "mg" || u === "milligram") return x.value;
  if (u === "g" || u === "gram") return x.value * 1000;
  if (u === "mcg" || u === "ug" || u === "microgram") return x.value / 1000;
  return x.value;
};
const mcgVal = (x: NutritionField) => {
  const u = normalizeUnit(x.unit);
  if (u === "mcg" || u === "ug" || u === "microgram") return x.value;
  if (u === "mg" || u === "milligram") return x.value * 1000;
  if (u === "g" || u === "gram") return x.value * 1_000_000;
  return x.value;
};

function resolveSpeedIdentifier(rec: any): string | undefined {
  const act = String(rec.activityType || rec.activity || rec.metadata?.activityType || "").toLowerCase();
  if (act.includes("cycl")) return APPLE_TYPES.CyclingSpeed;
  if (act.includes("run")) return APPLE_TYPES.RunningSpeed;
  if (act.includes("walk")) return APPLE_TYPES.WalkingSpeed;
  return undefined;
}

// ---------- Category value helpers ----------
function sleepValueString(kind: "Asleep"|"InBed"|"Awake"): string {
  const map: Record<string,string> = {
    Asleep: "HKCategoryValueSleepAnalysisAsleep",
    InBed: "HKCategoryValueSleepAnalysisInBed",
    Awake: "HKCategoryValueSleepAnalysisAwake",
  };
  return map[kind] || "HKCategoryValueSleepAnalysisAsleep";
}
function menstrualFlowValueString(flow: string): string {
  const v = String(flow || "").toLowerCase();
  const map: Record<string,string> = {
    light: "HKCategoryValueMenstrualFlowLight",
    medium: "HKCategoryValueMenstrualFlowMedium",
    heavy: "HKCategoryValueMenstrualFlowHeavy",
    none: "HKCategoryValueMenstrualFlowNone",
  };
  return map[v] || "HKCategoryValueMenstrualFlowMedium";
}
function ovulationTestValueString(result: string): string {
  const v = String(result || "").toLowerCase();
  const map: Record<string,string> = {
    positive: "HKCategoryValueOvulationTestResultPositive",
    negative: "HKCategoryValueOvulationTestResultNegative",
    indeterminate: "HKCategoryValueOvulationTestResultIndeterminate",
  };
  return map[v] || "HKCategoryValueOvulationTestResultIndeterminate";
}

// ---------- Nutrition ----------
function mapNutrition(rec: any): string[] {
  const out: string[] = [];
  const a = baseAttrs(rec, rec.startTime, rec.endTime);

  if (rec.energy) out.push(emitRecord({ ...a, type: APPLE_TYPES.DietaryEnergy, unit: "kcal", value: energyToKCal(rec.energy) }));
  const gramQ = (t: string, f?: NutritionField) => { if (f) out.push(emitRecord({ ...a, type: t, unit: "g", value: gramsVal(f) })); };
  const mgQ = (t: string, f?: NutritionField) => { if (f) out.push(emitRecord({ ...a, type: t, unit: "mg", value: mgVal(f) })); };
  const mcgQ = (t: string, f?: NutritionField) => { if (f) out.push(emitRecord({ ...a, type: t, unit: "mcg", value: mcgVal(f) })); };

  // Macros
  gramQ(APPLE_TYPES.DietaryFatTotal, rec.fatTotal);
  gramQ(APPLE_TYPES.DietaryFatSaturated, rec.fatSaturated);
  gramQ(APPLE_TYPES.DietaryFatPolyunsaturated, rec.fatPolyunsaturated);
  gramQ(APPLE_TYPES.DietaryFatMonounsaturated, rec.fatMonounsaturated);
  gramQ(APPLE_TYPES.DietaryCarbohydrates, rec.carbs);
  gramQ(APPLE_TYPES.DietarySugar, rec.sugar);
  gramQ(APPLE_TYPES.DietaryFiber, rec.fiber);
  gramQ(APPLE_TYPES.DietaryProtein, rec.protein);
  mgQ(APPLE_TYPES.DietarySodium, rec.sodium);
  mgQ(APPLE_TYPES.DietaryPotassium, rec.potassium);
  mgQ(APPLE_TYPES.DietaryCholesterol, rec.cholesterol);

  // Minerals
  mgQ(APPLE_TYPES.DietaryCalcium, rec.calcium);
  mgQ(APPLE_TYPES.DietaryIron, rec.iron);
  mgQ(APPLE_TYPES.DietaryMagnesium, rec.magnesium);
  mgQ(APPLE_TYPES.DietaryZinc, rec.zinc);
  mcgQ(APPLE_TYPES.DietarySelenium, rec.selenium);
  mgQ(APPLE_TYPES.DietaryCopper, rec.copper);
  mgQ(APPLE_TYPES.DietaryManganese, rec.manganese);
  mgQ(APPLE_TYPES.DietaryPhosphorus, rec.phosphorus);
  mcgQ(APPLE_TYPES.DietaryIodine, rec.iodine);
  mcgQ(APPLE_TYPES.DietaryMolybdenum, rec.molybdenum);
  mcgQ(APPLE_TYPES.DietaryChromium, rec.chromium);
  mgQ(APPLE_TYPES.DietaryChloride, rec.chloride);
  mgQ(APPLE_TYPES.DietaryCaffeine, rec.caffeine);

  // Vitamins
  mcgQ(APPLE_TYPES.DietaryVitaminA, rec.vitaminA);
  mgQ(APPLE_TYPES.DietaryVitaminC, rec.vitaminC);
  mcgQ(APPLE_TYPES.DietaryVitaminD, rec.vitaminD);
  mgQ(APPLE_TYPES.DietaryVitaminE, rec.vitaminE);
  mcgQ(APPLE_TYPES.DietaryVitaminK, rec.vitaminK);
  mgQ(APPLE_TYPES.DietaryThiamin, rec.thiamin);
  mgQ(APPLE_TYPES.DietaryRiboflavin, rec.riboflavin);
  mgQ(APPLE_TYPES.DietaryNiacin, rec.niacin);
  mgQ(APPLE_TYPES.DietaryVitaminB6, rec.vitaminB6);
  mcgQ(APPLE_TYPES.DietaryVitaminB12, rec.vitaminB12);
  mcgQ(APPLE_TYPES.DietaryFolate, rec.folate);
  mcgQ(APPLE_TYPES.DietaryBiotin, rec.biotin);
  mgQ(APPLE_TYPES.DietaryPantothenicAcid, rec.pantothenicAcid);

  return out;
}

// ---------- Public API ----------
export interface ConvertOptions {
  locale?: string;
  exportDate?: Date;
  application?: { name: string; version: string };
  sleepCategory?: "Asleep" | "InBed" | "Awake"; // default: Asleep
  unsupportedPolicy?: "skip" | "strict";
}

export function convertHealthConnectJsonToAppleXml(input: { records: any[] }, opts: ConvertOptions = {}): string {
  const locale = opts.locale || "de_DE";
  const exportDate = opts.exportDate || new Date();
  const sleepCat = opts.sleepCategory || "Asleep";
  const unsupportedPolicy = opts.unsupportedPolicy || "skip";

  const header = `<?xml version="1.0" encoding="UTF-8"?>`
    + `\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">`;
  const open = `<HealthData locale="${locale}" exportDate="${formatAppleDate(exportDate.toISOString())}" sourceName="${(opts.application?.name || "KIWI HEALTH Export").replace(/"/g,'&quot;')}" sourceVersion="${(opts.application?.version || "1.0").replace(/"/g,'&quot;')}">`;

  const parts: string[] = [];
  parts.push(header);
  parts.push(open);

  for (const rec of input.records || []) {
    const start = rec.startTime ?? rec.time;
    const end = rec.endTime ?? rec.time;
    const a = baseAttrs(rec, start, end);

    try {
      switch (String(rec.type)) {
        case "Steps":
          parts.push(emitRecord({ ...a, type: APPLE_TYPES.Steps, unit: "count", value: rec.count }));
          break;
        case "HeartRate":
          for (const s of (rec.samples || [])) {
            const aa = baseAttrs(rec, s.time, s.time);
            parts.push(emitRecord({ ...aa, type: APPLE_TYPES.HeartRate, unit: "count/min", value: s.beatsPerMinute }));
          }
          break;
        case "RestingHeartRate":
          parts.push(emitRecord({ ...a, type: APPLE_TYPES.RestingHeartRate, unit: "count/min", value: rec.beatsPerMinute }));
          break;
        case "ActiveCaloriesBurned":
          parts.push(emitRecord({ ...a, type: APPLE_TYPES.ActiveCaloriesBurned, unit: "kcal", value: energyToKCal(rec.energy) }));
          break;
        case "TotalCaloriesBurned":
          parts.push(emitRecord({ ...a, type: APPLE_TYPES.BasalEnergyBurned, unit: "kcal", value: energyToKCal(rec.energy) }));
          break;
        case "Weight":
          parts.push(emitRecord({ ...a, type: APPLE_TYPES.BodyMass, unit: "kg", value: inGrams(rec.weight)/1000 }));
          break;
        case "Height":
          parts.push(emitRecord({ ...a, type: APPLE_TYPES.Height, unit: "cm", value: lengthToMeters(rec.height)*100 }));
          break;
        case "OxygenSaturation":
          parts.push(emitRecord({ ...a, type: APPLE_TYPES.OxygenSaturation, unit: "%", value: rec.percentage?.value }));
          break;
        case "BodyTemperature":
          parts.push(emitRecord({ ...a, type: APPLE_TYPES.BodyTemperature, unit: "degC", value: tempToC(rec.temperature) }));
          break;
        case "BasalBodyTemperature":
          parts.push(emitRecord({ ...a, type: APPLE_TYPES.BasalBodyTemperature, unit: "degC", value: tempToC(rec.temperature) }));
          break;
        case "RespiratoryRate":
          parts.push(emitRecord({ ...a, type: APPLE_TYPES.RespiratoryRate, unit: "count/min", value: rec.rate }));
          break;
        case "Vo2Max":
        case "VO2Max":
          parts.push(emitRecord({ ...a, type: APPLE_TYPES.VO2Max, unit: "mL/min·kg", value: rec.vo2MillilitersPerMinuteKilogram }));
          break;
        case "BloodPressure":
          parts.push(emitRecord({ ...a, type: APPLE_TYPES.BloodPressureSystolic, unit: "mmHg", value: pressureToMmHg(rec.systolic) }));
          parts.push(emitRecord({ ...a, type: APPLE_TYPES.BloodPressureDiastolic, unit: "mmHg", value: pressureToMmHg(rec.diastolic) }));
          break;
        case "BloodGlucose":
          parts.push(emitRecord({ ...a, type: APPLE_TYPES.BloodGlucose, unit: "mg/dL", value: glucoseToMgdl(rec.level) }));
          break;
        case "Distance":
          parts.push(emitRecord({ ...a, type: APPLE_TYPES.DistanceWalkingRunning, unit: "m", value: lengthToMeters(rec.distance) }));
          break;
        case "Hydration":
          parts.push(emitRecord({ ...a, type: APPLE_TYPES.DietaryWater, unit: "mL", value: volumeToML(rec.volume) }));
          break;
        case "SleepSession": {
          const v = sleepValueString(sleepCat);
          parts.push(emitRecord({ ...a, type: APPLE_TYPES.SleepAnalysis, value: v }));
          break;
        }
        case "SexualActivity":
          parts.push(emitRecord({ ...a, type: APPLE_TYPES.SexualActivity, value: 1 }));
          break;
        case "Menstruation":
        case "MenstruationPeriod":
          parts.push(emitRecord({ ...a, type: APPLE_TYPES.MenstrualFlow, value: menstrualFlowValueString("medium") }));
          break;
        case "MenstruationFlow": {
          const aa = baseAttrs(rec, rec.time, rec.time);
          parts.push(emitRecord({ ...aa, type: APPLE_TYPES.MenstrualFlow, value: menstrualFlowValueString(rec.flow) }));
          break;
        }
        case "OvulationTest": {
          const aa = baseAttrs(rec, rec.time, rec.time);
          parts.push(emitRecord({ ...aa, type: APPLE_TYPES.OvulationTestResult, value: ovulationTestValueString(rec.result) }));
          break;
        }
        case "SkinTemperature":
          parts.push(emitRecord({ ...a, type: APPLE_TYPES.AppleSleepingWristTemperature, unit: "degC", value: (typeof rec.temperatureDeltaCelsius === 'number' ? rec.temperatureDeltaCelsius : 0) }));
          break;
        case "WheelchairPushes":
          parts.push(emitRecord({ ...a, type: APPLE_TYPES.PushCount, unit: "count", value: rec.count }));
          break;

        // ---- Cadence & Speed ----
        case "CyclingPedalingCadence": {
          if (Array.isArray(rec.samples) && rec.samples.length) {
            for (const s of rec.samples) {
              const aa = baseAttrs(rec, s.time, s.time);
              const rpm = (s.revolutionsPerMinute ?? s.rpm ?? s.rate);
              if (typeof rpm === "number") parts.push(emitRecord({ ...aa, type: APPLE_TYPES.CyclingCadence, unit: "count/min", value: rpm }));
            }
          } else {
            const rpm = (rec.revolutionsPerMinute ?? rec.rpm ?? rec.rate);
            if (typeof rpm === "number") parts.push(emitRecord({ ...a, type: APPLE_TYPES.CyclingCadence, unit: "count/min", value: rpm }));
            else if (unsupportedPolicy === "strict") throw new Error("CyclingPedalingCadence without numeric value");
          }
          break;
        }
        case "Speed": {
          const id = resolveSpeedIdentifier(rec);
          if (!id) { if (unsupportedPolicy === "strict") throw new Error("Speed requires activityType (walking/running/cycling)"); break; }
          const emit = (timeISO: string, v: number) => {
            const aa = baseAttrs(rec, timeISO, timeISO);
            parts.push(emitRecord({ ...aa, type: id, unit: "m/s", value: v }));
          };
          if (Array.isArray(rec.samples) && rec.samples.length) {
            for (const s of rec.samples) {
              const v = (s.metersPerSecond ?? s.mps ?? s.speed);
              if (typeof v === "number" && s.time) emit(s.time, v);
            }
          } else {
            const v = (rec.metersPerSecond ?? rec.mps ?? rec.speed);
            if (typeof v === "number") emit(start, v);
            else if (unsupportedPolicy === "strict") throw new Error("Speed missing numeric value");
          }
          break;
        }
        case "CyclingSpeed": {
          const emit = (timeISO: string, v: number) => {
            const aa = baseAttrs(rec, timeISO, timeISO);
            parts.push(emitRecord({ ...aa, type: APPLE_TYPES.CyclingSpeed, unit: "m/s", value: v }));
          };
          if (Array.isArray(rec.samples) && rec.samples.length) {
            for (const s of rec.samples) {
              const v = (s.metersPerSecond ?? s.mps ?? s.speed);
              if (typeof v === "number" && s.time) emit(s.time, v);
            }
          } else {
            const v = (rec.metersPerSecond ?? rec.mps ?? rec.speed);
            if (typeof v === "number") emit(start, v);
            else if (unsupportedPolicy === "strict") throw new Error("CyclingSpeed without numeric m/s");
          }
          break;
        }
        case "StepsCadence": {
          const act = String(rec.activityType || rec.activity || rec.metadata?.activityType || "").toLowerCase();
          if (!act.includes("run")) { if (unsupportedPolicy === "strict") throw new Error("StepsCadence not running; no generic type"); break; }
          const emit = (timeISO: string, spm: number) => {
            const aa = baseAttrs(rec, timeISO, timeISO);
            parts.push(emitRecord({ ...aa, type: APPLE_TYPES.RunningCadence, unit: "count/min", value: spm }));
          };
          if (Array.isArray(rec.samples) && rec.samples.length) {
            for (const s of rec.samples) {
              const spm = (s.stepsPerMinute ?? s.spm ?? s.rate);
              if (typeof spm === "number" && s.time) emit(s.time, spm);
            }
          } else {
            const spm = (rec.stepsPerMinute ?? rec.spm ?? rec.rate);
            if (typeof spm === "number") emit(start, spm);
            else if (unsupportedPolicy === "strict") throw new Error("StepsCadence without numeric steps/min");
          }
          break;
        }

        case "Nutrition":
          parts.push(...mapNutrition(rec));
          break;

        default:
          if (unsupportedPolicy === "strict") throw new Error(`Unsupported type: ${rec.type}`);
      }
    } catch (e) {
      if (unsupportedPolicy === "strict") throw e;
      // else skip broken/unsupported
    }
  }

  parts.push("</HealthData>");
  return parts.join("\n");
}

export { convertHealthConnectJsonToAppleXml, APPLE_TYPES };
