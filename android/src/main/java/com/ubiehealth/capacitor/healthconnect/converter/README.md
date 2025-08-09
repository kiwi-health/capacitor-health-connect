# HealthConnect → Apple HealthKit Converter
Dieses Paket enthält die final abgestimmten **TypeScript**- und **JavaScript**-Versionen des Converters,
der Health Connect JSON-Daten in Apple HealthKit-kompatibles XML umwandelt.

## Inhalt
- TypeScript: `ts/hc-to-apple-health.ts`
- JavaScript: `js/hc-to-apple-health.js`
- `README.md` (diese Datei)

## Merkmale
- Ausgabe pro `<Record>`-Element nur mit folgenden Attributen:
  - `type`
  - `sourceName`
  - `startDate`
  - `endDate`
  - `value`
  - `unit`
- Alle `type`- und `value`-Strings Apple-HealthKit-konform
- Vollständige Einheitennormalisierung (inkl. Speed, Cadence, Nutrition etc.)
- Unterstützung aller Datentypen aus deinem Health Connect Kotlin-Export
- Gleiche Logik in TS und JS für identische Ergebnisse

## Verwendung
### TypeScript
```typescript
import { convertHealthConnectJsonToAppleXml } from "./hc-to-apple-health";

const xml = convertHealthConnectJsonToAppleXml(healthConnectJson, {
  locale: "de_DE",
  application: { name: "KIWI HEALTH", version: "1.0.2025.MMDD" },
  sleepCategory: "Asleep",
  unsupportedPolicy: "skip"
});
```

### JavaScript
```javascript
const { convertHealthConnectJsonToAppleXml } = require("./hc-to-apple-health.ts");

const xml = convertHealthConnectJsonToAppleXml(healthConnectJson, {
  locale: "de_DE",
  application: { name: "KIWI HEALTH", version: "1.0.2025.MMDD" },
  sleepCategory: "Asleep",
  unsupportedPolicy: "skip"
});
```

## Hinweis
Beide Versionen (TS & JS) sind funktionsgleich und können je nach Projektbedarf eingesetzt werden.
