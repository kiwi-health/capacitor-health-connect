// export-hc-apple-xml.js
'use strict';

// ⚙️ Capacitor-Plugin anbinden
const { registerPlugin } = require('@capacitor/core');
const { convertHealthConnectJsonToAppleXML } = require('./hc-to-apple-health');

const HealthConnect = registerPlugin('HealthConnect');

// ✅ Exakt die gleichen unterstützten Typen wie in der TS-Version
const SUPPORTED_TYPES = [
  'ActiveCaloriesBurned','BasalBodyTemperature','BasalMetabolicRate','BloodGlucose','BloodPressure',
  'BodyFat','BodyTemperature','BodyWaterMass','BoneMass','CervicalMucus','Distance','ElevationGained',
  'ExerciseSession','FloorsClimbed','HeartRateSeries','Height','Hydration','IntermenstrualBleeding',
  'LeanBodyMass','Menstruation','MenstruationFlow','Nutrition','OvulationTest','OxygenSaturation',
  'PlannedExercise','Power','RespiratoryRate','RestingHeartRate','SexualActivity','SleepSession',
  'SleepStage','SkinTemperature','Speed','Steps','StepsCadence','TotalCaloriesBurned','Vo2Max','Weight',
  'WheelchairPushes','CyclingPedalingCadence'
];

// Liest für einen Record-Typ alle Seiten seit "sinceIso"
async function readAllOfType(type, sinceIso) {
  const out = [];
  let pageToken = undefined;
  const filter = { type: 'after', time: sinceIso };

  try {
    do {
      const res = await HealthConnect.readRecords({
        type,
        timeRangeFilter: filter,
        pageSize: 1000,
        pageToken
      });
      out.push(...(res.records || []));
      pageToken = res.pageToken || undefined;
    } while (pageToken);
  } catch (err) {
    // bewusst still wie in TS; bei Bedarf:
    // console.warn(`readAllOfType(${type}) failed:`, err);
  }
  return out;
}

/**
 * Exportiert alle verfügbaren & freigegebenen Health-Connect-Daten als Apple-Health-XML (String).
 * Optionen:
 *  - sourceName?: string  (Default "HealthConnect")
 *  - since?: string (ISO, Default 1970-01-01T00:00:00Z)
 */
async function exportHealthConnectToAppleXml(options = {}) {
  const sourceName = options.sourceName || 'HealthConnect';
  const since = options.since || '1970-01-01T00:00:00Z';

  const all = [];
  for (const type of SUPPORTED_TYPES) {
    const recs = await readAllOfType(type, since);
    all.push(...recs);
  }

  // In Apple-Health-XML umwandeln
  return convertHealthConnectJsonToAppleXML({ records: all, sourceName });
}

// Für Rückwärtskompatibilität zusätzlich unter dem alten Namen exportieren
module.exports = {
  exportHealthConnectToAppleXml,
  exportAllHealthDataAsAppleXML: exportHealthConnectToAppleXml
};
