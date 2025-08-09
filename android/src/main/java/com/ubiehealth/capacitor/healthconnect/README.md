# Health Connect → Apple HealthKit Converter – v5.1 FULL

Dieses Bundle enthält alle notwendigen Dateien, um **sämtliche von Google Health Connect freigegebenen Daten** auszulesen und in ein **Apple HealthKit-konformes XML** zu konvertieren.

## Inhalt

### Kotlin (Android)
- **HealthConnectPlugin.kt**  
  Plugin-Integration für Capacitor / Android, um Health Connect Records auszulesen.
- **RecordMappings.kt**  
  Enthält die Whitelist aller unterstützten Record-Typen (Google Health Connect)  
  inkl. Validierungs-Methoden (`validateType`, `validateTypes`).
- **Serializer.kt**  
  Vollständige JSON↔Record Konvertierung aller unterstützten Typen  
  inkl. spezieller Records:
  - `CyclingPedalingCadenceRecord`
  - `MenstruationFlowRecord`
  - `MenstruationPeriodRecord`
  - `NutritionRecord`
  - `PlannedExerciseSessionRecord`
  - `SkinTemperatureRecord`
  - `SpeedRecord`
  - `StepsCadenceRecord`
  - … sowie alle übrigen Health Connect Datentypen

### TypeScript
- **hc-to-apple-health.ts**  
  Konverter für Health Connect JSON → Apple HealthKit XML `<Record>` & `<Workout>`  
  inkl. Apple-HealthKit-konformen `type`-Bezeichnern & Einheiten.
- **export-hc-apple-xml.ts**  
  Hilfsfunktion `exportAllHealthDataAsAppleXML()`  
  → Ruft alle verfügbaren & freigegebenen Health Connect Daten ab, konvertiert sie in Apple XML und gibt den String zurück.

### JavaScript
- **hc-to-apple-health.js**  
  JS-Pendant zum TypeScript-Konverter.
- **export-hc-apple-xml.js**  
  JS-Pendant zur TypeScript-Exportfunktion.

### Sonstige Dateien
- **SAMPLE.xml**  
  Beispiel-HealthKit-XML (leer, zum Testen).
- **README.md**  
  Diese Datei.

---

## Nutzung

### 1. Android-Seite
- Health Connect Berechtigungen im `AndroidManifest.xml` setzen (inkl. `READ_HEALTH_DATA` und alle benötigten spezifischen Typen).
- `HealthConnectPlugin.kt`, `RecordMappings.kt`, `Serializer.kt` in dein Android/Capacitor-Projekt einfügen.

### 2. Web-/App-Seite

#### TypeScript:
~~~typescript
import { exportAllHealthDataAsAppleXML } from './export-hc-apple-xml';

async function runExport() {
  const xmlString = await exportAllHealthDataAsAppleXML();
  console.log(xmlString);
}
~~~

#### JavaScript:
~~~javascript
const { exportAllHealthDataAsAppleXML } = require('./export-hc-apple-xml.js');

async function runExport() {
  const xmlString = await exportAllHealthDataAsAppleXML();
  console.log(xmlString);
}
~~~