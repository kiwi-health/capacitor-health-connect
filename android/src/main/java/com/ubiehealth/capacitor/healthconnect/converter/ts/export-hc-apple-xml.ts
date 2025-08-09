// export-hc-apple-xml.ts
import { registerPlugin } from "@capacitor/core";
import { convertHealthConnectJsonToAppleXML } from "./hc-to-apple-health";

type HCPlugin = { readRecords: (args: any) => Promise<{ records: any[]; pageToken?: string | null }>; };
const HealthConnect = registerPlugin<HCPlugin>("HealthConnect");

const SUPPORTED_TYPES = [
  "ActiveCaloriesBurned","BasalBodyTemperature","BasalMetabolicRate","BloodGlucose","BloodPressure",
  "BodyFat","BodyTemperature","BodyWaterMass","BoneMass","CervicalMucus","Distance","ElevationGained",
  "ExerciseSession","FloorsClimbed","HeartRateSeries","Height","Hydration","IntermenstrualBleeding",
  "LeanBodyMass","Menstruation","MenstruationFlow","Nutrition","OvulationTest","OxygenSaturation",
  "PlannedExercise","Power","RespiratoryRate","RestingHeartRate","SexualActivity","SleepSession",
  "SleepStage","SkinTemperature","Speed","Steps","StepsCadence","TotalCaloriesBurned","Vo2Max","Weight",
  "WheelchairPushes","CyclingPedalingCadence"
] as const;

export type ExportOptions = { sourceName?: string; since?: string };

async function readAllOfType(type: string, sinceIso: string): Promise<any[]> {
  const out: any[] = []; let pageToken: string | undefined = undefined;
  const filter = { type: "after", time: sinceIso };
  try {
    do {
      const res = await HealthConnect.readRecords({ type, timeRangeFilter: filter, pageSize: 1000, pageToken } as any);
      out.push(...(res.records || []));
      pageToken = (res as any).pageToken || undefined;
    } while (pageToken);
  } catch {}
  return out;
}

export async function exportHealthConnectToAppleXml(options: ExportOptions = {}): Promise<string> {
  const sourceName = options.sourceName ?? "HealthConnect";
  const since = options.since ?? "1970-01-01T00:00:00Z";
  const all: any[] = [];
  for (const type of SUPPORTED_TYPES) { all.push(...await readAllOfType(type, since)); }
  return convertHealthConnectJsonToAppleXML({ records: all, sourceName });
}
