# Health Connect – Beispiel-Requests

## 1) Permissions anfordern
```json
{
  "read": [
    "Steps",
    "Weight",
    "HeartRate",
    "BloodPressure",
    "Nutrition",
    "SleepSession",
    "Speed",
    "StepsCadence",
    "CyclingPedalingCadence",
    "SkinTemperature",
    "Menstruation",
    "MenstruationFlow",
    "MenstruationPeriod"
  ],
  "write": [
    "Weight",
    "Hydration",
    "Nutrition"
  ]
}
```

## 2) checkHealthPermissions
```json
{
  "read": [
    "Steps",
    "Weight",
    "HeartRate"
  ],
  "write": [
    "Weight"
  ]
}
```

## 3) readRecords
```json
{
  "type": "Steps",
  "timeRangeFilter": {
    "type": "between",
    "startTime": "2025-08-09T08:00:00+00:00",
    "endTime": "2025-08-09T09:00:00+00:00"
  },
  "ascendingOrder": true,
  "pageSize": 1000
}
```

## 4) readRecord
```json
{
  "type": "Weight",
  "recordId": "<RECORD_ID_AUS_READRECORDS>"
}
```

## 5) insertRecords
Die `records`-Payload kann mehrere Datensätze mit verschiedenen `type` enthalten. Beispiel (komplette Beispiel-Liste siehe JSON-Datei unten):
```json
{
  "records": [
    {
      "type": "ActiveCaloriesBurned",
      "startTime": "2025-08-09T08:00:00+00:00",
      "startZoneOffset": "+00:00",
      "endTime": "2025-08-09T09:00:00+00:00",
      "endZoneOffset": "+00:00",
      "energy": {
        "unit": "kilocalories",
        "value": 120
      }
    },
    {
      "type": "BasalBodyTemperature",
      "time": "2025-08-09T09:00:00+00:00",
      "zoneOffset": "+00:00",
      "temperature": {
        "unit": "celsius",
        "value": 36.6
      },
      "measurementLocation": "oral"
    },
    {
      "type": "BasalMetabolicRate",
      "time": "2025-08-09T09:00:00+00:00",
      "zoneOffset": "+00:00",
      "basalMetabolicRate": {
        "unit": "kilocaloriesPerDay",
        "value": 1650
      }
    }
  ]
}
```

👉 **Komplette Beispiel-Payload mit allen Datentypen:**
- [healthconnect_beispiel_records.json]