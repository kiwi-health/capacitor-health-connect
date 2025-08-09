package com.ubiehealth.capacitor.healthconnect

import androidx.health.connect.client.records.*
import org.json.JSONObject

object RecordMappings {

    val SUPPORTED_TYPES: Set<String> = setOf(
        "ActiveCaloriesBurned",
        "BasalBodyTemperature",
        "BasalMetabolicRate",
        "BloodGlucose",
        "BloodPressure",
        "BodyFat",
        "BodyTemperature",
        "BodyWaterMass",
        "BoneMass",
        "CervicalMucus",
        "Distance",
        "ElevationGained",
        "ExerciseSession",
        "FloorsClimbed",
        "HeartRate",
        "HeartRateSeries",
        "HeartRateVariabilityRmssd",
        "Height",
        "Hydration",
        "IntermenstrualBleeding",
        "LeanBodyMass",
        "Menstruation",
        "MenstruationFlow",
        "MenstruationPeriod",
        "Nutrition",
        "OvulationTest",
        "OxygenSaturation",
        "PlannedExerciseSession",
        "Power",
        "RespiratoryRate",
        "RestingHeartRate",
        "SexualActivity",
        "SkinTemperature",
        "SleepSession",
        "Speed",
        "Steps",
        "StepsCadence",
        "TotalCaloriesBurned",
        "Vo2Max",
        "Weight",
        "WheelchairPushes",
        "CyclingPedalingCadence"
    )

    fun fromJson(type: String, json: JSONObject): Record {
        return when (type) {
            "ActiveCaloriesBurned" -> ActiveCaloriesBurnedRecord(
                startTime = json.getInstant("startTime"),
                startZoneOffset = json.getZoneOffsetOrNull("startZoneOffset"),
                endTime = json.getInstant("endTime"),
                endZoneOffset = json.getZoneOffsetOrNull("endZoneOffset"),
                energy = json.getEnergy("energy")
            )
            "BasalBodyTemperature" -> BasalBodyTemperatureRecord(
                time = json.getInstant("time"),
                zoneOffset = json.getZoneOffsetOrNull("zoneOffset"),
                temperature = json.getTemperature("temperature"),
                measurementLocation = json.getBodyTemperatureMeasurementLocationInt("measurementLocation")
            )
            "BasalMetabolicRate" -> BasalMetabolicRateRecord(
                time = json.getInstant("time"),
                zoneOffset = json.getZoneOffsetOrNull("zoneOffset"),
                basalMetabolicRate = json.getPower("basalMetabolicRate")
            )
            "BloodGlucose" -> BloodGlucoseRecord(
                time = json.getInstant("time"),
                zoneOffset = json.getZoneOffsetOrNull("zoneOffset"),
                level = json.getBloodGlucose("level"),
                specimenSource = BloodGlucoseRecord.SPECIMEN_SOURCE_STRING_TO_INT_MAP
                    .getOrDefault(json.getString("specimenSource"), BloodGlucoseRecord.SPECIMEN_SOURCE_UNKNOWN),
                mealType = MealType.MEAL_TYPE_STRING_TO_INT_MAP
                    .getOrDefault(json.getString("mealType"), MealType.MEAL_TYPE_UNKNOWN),
                relationToMeal = BloodGlucoseRecord.RELATION_TO_MEAL_STRING_TO_INT_MAP
                    .getOrDefault(json.getString("relationToMeal"), BloodGlucoseRecord.RELATION_TO_MEAL_UNKNOWN)
            )
            "BloodPressure" -> BloodPressureRecord(
                time = json.getInstant("time"),
                zoneOffset = json.getZoneOffsetOrNull("zoneOffset"),
                systolic = json.getPressure("systolic"),
                diastolic = json.getPressure("diastolic"),
                bodyPosition = BloodPressureRecord.BODY_POSITION_STRING_TO_INT_MAP
                    .getOrDefault(json.getString("bodyPosition"), BloodPressureRecord.BODY_POSITION_UNKNOWN),
                measurementLocation = BloodPressureRecord.MEASUREMENT_LOCATION_STRING_TO_INT_MAP
                    .getOrDefault(json.getString("measurementLocation"), BloodPressureRecord.MEASUREMENT_LOCATION_UNKNOWN)
            )
            "BodyFat" -> BodyFatRecord(
                time = json.getInstant("time"),
                zoneOffset = json.getZoneOffsetOrNull("zoneOffset"),
                percentage = json.getPercentage("percentage")
            )
            "BodyTemperature" -> BodyTemperatureRecord(
                time = json.getInstant("time"),
                zoneOffset = json.getZoneOffsetOrNull("zoneOffset"),
                temperature = json.getTemperature("temperature"),
                measurementLocation = json.getBodyTemperatureMeasurementLocationInt("measurementLocation")
            )
            "BodyWaterMass" -> BodyWaterMassRecord(
                time = json.getInstant("time"),
                zoneOffset = json.getZoneOffsetOrNull("zoneOffset"),
                mass = json.getMass("mass")
            )
            "BoneMass" -> BoneMassRecord(
                time = json.getInstant("time"),
                zoneOffset = json.getZoneOffsetOrNull("zoneOffset"),
                mass = json.getMass("mass")
            )
            "CervicalMucus" -> CervicalMucusRecord(
                time = json.getInstant("time"),
                zoneOffset = json.getZoneOffsetOrNull("zoneOffset"),
                appearance = json.getString("appearance"),
                sensation = json.getString("sensation")
            )
            "Distance" -> DistanceRecord(
                startTime = json.getInstant("startTime"),
                startZoneOffset = json.getZoneOffsetOrNull("startZoneOffset"),
                endTime = json.getInstant("endTime"),
                endZoneOffset = json.getZoneOffsetOrNull("endZoneOffset"),
                distance = json.getLength("distance")
            )
            "ElevationGained" -> ElevationGainedRecord(
                startTime = json.getInstant("startTime"),
                startZoneOffset = json.getZoneOffsetOrNull("startZoneOffset"),
                endTime = json.getInstant("endTime"),
                endZoneOffset = json.getZoneOffsetOrNull("endZoneOffset"),
                elevation = json.getLength("elevation")
            )
            "ExerciseSession" -> ExerciseSessionRecord(
                startTime = json.getInstant("startTime"),
                startZoneOffset = json.getZoneOffsetOrNull("startZoneOffset"),
                endTime = json.getInstant("endTime"),
                endZoneOffset = json.getZoneOffsetOrNull("endZoneOffset"),
                title = json.optString("title"),
                notes = json.optString("notes"),
                exerciseType = json.optInt("exerciseType")
            )
            "FloorsClimbed" -> FloorsClimbedRecord(
                startTime = json.getInstant("startTime"),
                startZoneOffset = json.getZoneOffsetOrNull("startZoneOffset"),
                endTime = json.getInstant("endTime"),
                endZoneOffset = json.getZoneOffsetOrNull("endZoneOffset"),
                floors = json.getDouble("floors")
            )
            "HeartRate", "HeartRateSeries" -> HeartRateRecord(
                startTime = json.getInstant("startTime"),
                startZoneOffset = json.getZoneOffsetOrNull("startZoneOffset"),
                endTime = json.getInstant("endTime"),
                endZoneOffset = json.getZoneOffsetOrNull("endZoneOffset"),
                samples = json.getHeartRateRecordSamplesList("samples")
            )
            "HeartRateVariabilityRmssd" -> HeartRateVariabilityRmssdRecord(
                time = json.getInstant("time"),
                zoneOffset = json.getZoneOffsetOrNull("zoneOffset"),
                heartRateVariabilityMillis = json.getDouble("heartRateVariabilityMillis")
            )
            "Height" -> HeightRecord(
                time = json.getInstant("time"),
                zoneOffset = json.getZoneOffsetOrNull("zoneOffset"),
                height = json.getLength("height")
            )
            "Hydration" -> HydrationRecord(
                startTime = json.getInstant("startTime"),
                startZoneOffset = json.getZoneOffsetOrNull("startZoneOffset"),
                endTime = json.getInstant("endTime"),
                endZoneOffset = json.getZoneOffsetOrNull("endZoneOffset"),
                volume = json.getVolume("volume")
            )
            "IntermenstrualBleeding" -> IntermenstrualBleedingRecord(
                time = json.getInstant("time"),
                zoneOffset = json.getZoneOffsetOrNull("zoneOffset")
            )
            "LeanBodyMass" -> LeanBodyMassRecord(
                time = json.getInstant("time"),
                zoneOffset = json.getZoneOffsetOrNull("zoneOffset"),
                mass = json.getMass("mass")
            )
            "Menstruation" -> MenstruationRecord(
                startTime = json.getInstant("startTime"),
                startZoneOffset = json.getZoneOffsetOrNull("startZoneOffset"),
                endTime = json.getInstant("endTime"),
                endZoneOffset = json.getZoneOffsetOrNull("endZoneOffset")
            )
            "MenstruationFlow" -> MenstruationFlowRecord(
                time = json.getInstant("time"),
                zoneOffset = json.getZoneOffsetOrNull("zoneOffset"),
                flow = json.getString("flow")
            )
            "MenstruationPeriod" -> MenstruationPeriodRecord(
                startTime = json.getInstant("startTime"),
                startZoneOffset = json.getZoneOffsetOrNull("startZoneOffset"),
                endTime = json.getInstant("endTime"),
                endZoneOffset = json.getZoneOffsetOrNull("endZoneOffset")
            )
            "Nutrition" -> NutritionRecord(
                startTime = json.getInstant("startTime"),
                startZoneOffset = json.getZoneOffsetOrNull("startZoneOffset"),
                endTime = json.getInstant("endTime"),
                endZoneOffset = json.getZoneOffsetOrNull("endZoneOffset"),
                energy = if (json.has("energy")) json.getEnergy("energy") else null
            )
            "OvulationTest" -> OvulationTestRecord(
                time = json.getInstant("time"),
                zoneOffset = json.getZoneOffsetOrNull("zoneOffset"),
                result = json.getString("result")
            )
            "OxygenSaturation" -> OxygenSaturationRecord(
                time = json.getInstant("time"),
                zoneOffset = json.getZoneOffsetOrNull("zoneOffset"),
                percentage = json.getPercentage("percentage")
            )
            "PlannedExerciseSession" -> PlannedExerciseSessionRecord(
                startTime = json.getInstant("startTime"),
                startZoneOffset = json.getZoneOffsetOrNull("startZoneOffset"),
                endTime = json.getInstant("endTime"),
                endZoneOffset = json.getZoneOffsetOrNull("endZoneOffset"),
                title = json.optString("title"),
                notes = json.optString("notes")
            )
            "Power" -> PowerRecord(
                time = json.getInstant("time"),
                zoneOffset = json.getZoneOffsetOrNull("zoneOffset"),
                power = json.getPower("power")
            )
            "RespiratoryRate" -> RespiratoryRateRecord(
                time = json.getInstant("time"),
                zoneOffset = json.getZoneOffsetOrNull("zoneOffset"),
                rate = json.getDouble("rate")
            )
            "RestingHeartRate" -> RestingHeartRateRecord(
                time = json.getInstant("time"),
                zoneOffset = json.getZoneOffsetOrNull("zoneOffset"),
                beatsPerMinute = json.getLong("beatsPerMinute")
            )
            "SexualActivity" -> SexualActivityRecord(
                time = json.getInstant("time"),
                zoneOffset = json.getZoneOffsetOrNull("zoneOffset"),
                protected = json.getBoolean("protected")
            )
            "SkinTemperature" -> SkinTemperatureRecord(
                startTime = json.getInstant("startTime"),
                startZoneOffset = json.getZoneOffsetOrNull("startZoneOffset"),
                endTime = json.getInstant("endTime"),
                endZoneOffset = json.getZoneOffsetOrNull("endZoneOffset"),
                // Skin temp records are deltas or absolute? We'll pass as temperatureDeltaCelsius when given.
                temperatureDeltaCelsius = json.optDouble("temperatureDeltaCelsius")
            )
            "SleepSession" -> SleepSessionRecord(
                startTime = json.getInstant("startTime"),
                startZoneOffset = json.getZoneOffsetOrNull("startZoneOffset"),
                endTime = json.getInstant("endTime"),
                endZoneOffset = json.getZoneOffsetOrNull("endZoneOffset"),
                title = json.optString("title"),
                notes = json.optString("notes")
            )
            "Speed" -> SpeedRecord(
                startTime = json.getInstant("startTime"),
                startZoneOffset = json.getZoneOffsetOrNull("startZoneOffset"),
                endTime = json.getInstant("endTime"),
                endZoneOffset = json.getZoneOffsetOrNull("endZoneOffset"),
                samples = json.getSpeedSamples("samples")
            )
            "Steps" -> StepsRecord(
                startTime = json.getInstant("startTime"),
                startZoneOffset = json.getZoneOffsetOrNull("startZoneOffset"),
                endTime = json.getInstant("endTime"),
                endZoneOffset = json.getZoneOffsetOrNull("endZoneOffset"),
                count = json.getLong("count")
            )
            "StepsCadence" -> StepsCadenceRecord(
                startTime = json.getInstant("startTime"),
                startZoneOffset = json.getZoneOffsetOrNull("startZoneOffset"),
                endTime = json.getInstant("endTime"),
                endZoneOffset = json.getZoneOffsetOrNull("endZoneOffset"),
                samples = json.getStepsCadenceSamples("samples")
            )
            "TotalCaloriesBurned" -> TotalCaloriesBurnedRecord(
                startTime = json.getInstant("startTime"),
                startZoneOffset = json.getZoneOffsetOrNull("startZoneOffset"),
                endTime = json.getInstant("endTime"),
                endZoneOffset = json.getZoneOffsetOrNull("endZoneOffset"),
                energy = json.getEnergy("energy")
            )
            "Vo2Max" -> Vo2MaxRecord(
                time = json.getInstant("time"),
                zoneOffset = json.getZoneOffsetOrNull("zoneOffset"),
                vo2MillilitersPerMinuteKilogram = json.getDouble("vo2MillilitersPerMinuteKilogram")
            )
            "Weight" -> WeightRecord(
                time = json.getInstant("time"),
                zoneOffset = json.getZoneOffsetOrNull("zoneOffset"),
                weight = json.getMass("weight")
            )
            "WheelchairPushes" -> WheelchairPushesRecord(
                startTime = json.getInstant("startTime"),
                startZoneOffset = json.getZoneOffsetOrNull("startZoneOffset"),
                endTime = json.getInstant("endTime"),
                endZoneOffset = json.getZoneOffsetOrNull("endZoneOffset"),
                count = json.getLong("count")
            )
            "CyclingPedalingCadence" -> CyclingPedalingCadenceRecord(
                startTime = json.getInstant("startTime"),
                startZoneOffset = json.getZoneOffsetOrNull("startZoneOffset"),
                endTime = json.getInstant("endTime"),
                endZoneOffset = json.getZoneOffsetOrNull("endZoneOffset"),
                samples = json.getCyclingCadenceSamples("samples")
            )
            else -> error("Record type \"$type\" is not supported.")
        }
    }

    fun toJson(record: Record): JSONObject {
        val obj = JSONObject()
        when (record) {
            is ActiveCaloriesBurnedRecord -> obj.apply {
                put("startTime", record.startTime)
                put("startZoneOffset", record.startZoneOffset?.toJSONValue())
                put("endTime", record.endTime)
                put("endZoneOffset", record.endZoneOffset?.toJSONValue())
                put("energy", record.energy.toJSONObject())
            }
            is BasalBodyTemperatureRecord -> obj.apply {
                put("time", record.time)
                put("zoneOffset", record.zoneOffset?.toJSONValue())
                put("temperature", record.temperature.toJSONObject())
                put("measurementLocation", record.measurementLocation.toBodyTemperatureMeasurementLocationString())
            }
            is BasalMetabolicRateRecord -> obj.apply {
                put("time", record.time)
                put("zoneOffset", record.zoneOffset?.toJSONValue())
                put("basalMetabolicRate", record.basalMetabolicRate.toJSONObject())
            }
            is BloodGlucoseRecord -> obj.apply {
                put("time", record.time)
                put("zoneOffset", record.zoneOffset?.toJSONValue())
                put("level", record.level.toJSONObject())
                put("specimenSource", BloodGlucoseRecord.SPECIMEN_SOURCE_INT_TO_STRING_MAP.getOrDefault(record.specimenSource, "unknown"))
                put("mealType", MealType.MEAL_TYPE_INT_TO_STRING_MAP.getOrDefault(record.mealType, "unknown"))
                put("relationToMeal", BloodGlucoseRecord.RELATION_TO_MEAL_INT_TO_STRING_MAP.getOrDefault(record.relationToMeal, "unknown"))
            }
            is BloodPressureRecord -> obj.apply {
                put("time", record.time)
                put("zoneOffset", record.zoneOffset?.toJSONValue())
                put("systolic", record.systolic.toJSONObject())
                put("diastolic", record.diastolic.toJSONObject())
                put("bodyPosition", BloodPressureRecord.BODY_POSITION_INT_TO_STRING_MAP.getOrDefault(record.bodyPosition, "unknown"))
                put("measurementLocation", BloodPressureRecord.MEASUREMENT_LOCATION_INT_TO_STRING_MAP.getOrDefault(record.measurementLocation, "unknown"))
            }
            is BodyFatRecord -> obj.apply {
                put("time", record.time)
                put("zoneOffset", record.zoneOffset?.toJSONValue())
                put("percentage", record.percentage.toJSONObject())
            }
            is BodyTemperatureRecord -> obj.apply {
                put("time", record.time)
                put("zoneOffset", record.zoneOffset?.toJSONValue())
                put("temperature", record.temperature.toJSONObject())
                put("measurementLocation", record.measurementLocation.toBodyTemperatureMeasurementLocationString())
            }
            is BodyWaterMassRecord -> obj.apply {
                put("time", record.time)
                put("zoneOffset", record.zoneOffset?.toJSONValue())
                put("mass", record.mass.toJSONObject())
            }
            is BoneMassRecord -> obj.apply {
                put("time", record.time)
                put("zoneOffset", record.zoneOffset?.toJSONValue())
                put("mass", record.mass.toJSONObject())
            }
            is CervicalMucusRecord -> obj.apply {
                put("time", record.time)
                put("zoneOffset", record.zoneOffset?.toJSONValue())
                put("appearance", record.appearance)
                put("sensation", record.sensation)
            }
            is DistanceRecord -> obj.apply {
                put("startTime", record.startTime)
                put("startZoneOffset", record.startZoneOffset?.toJSONValue())
                put("endTime", record.endTime)
                put("endZoneOffset", record.endZoneOffset?.toJSONValue())
                put("distance", record.distance.toJSONObject())
            }
            is ElevationGainedRecord -> obj.apply {
                put("startTime", record.startTime)
                put("startZoneOffset", record.startZoneOffset?.toJSONValue())
                put("endTime", record.endTime)
                put("endZoneOffset", record.endZoneOffset?.toJSONValue())
                put("elevation", record.elevation.toJSONObject())
            }
            is ExerciseSessionRecord -> obj.apply {
                put("startTime", record.startTime)
                put("startZoneOffset", record.startZoneOffset?.toJSONValue())
                put("endTime", record.endTime)
                put("endZoneOffset", record.endZoneOffset?.toJSONValue())
                put("title", record.title)
                put("notes", record.notes)
                put("exerciseType", record.exerciseType)
            }
            is FloorsClimbedRecord -> obj.apply {
                put("startTime", record.startTime)
                put("startZoneOffset", record.startZoneOffset?.toJSONValue())
                put("endTime", record.endTime)
                put("endZoneOffset", record.endZoneOffset?.toJSONValue())
                put("floors", record.floors)
            }
            is HeartRateRecord -> obj.apply {
                put("startTime", record.startTime)
                put("startZoneOffset", record.startZoneOffset?.toJSONValue())
                put("endTime", record.endTime)
                put("endZoneOffset", record.endZoneOffset?.toJSONValue())
                put("samples", record.samples.toHeartRateRecordSamplesJSONArray())
            }
            is HeartRateVariabilityRmssdRecord -> obj.apply {
                put("time", record.time)
                put("zoneOffset", record.zoneOffset?.toJSONValue())
                put("heartRateVariabilityMillis", record.heartRateVariabilityMillis)
            }
            is HeightRecord -> obj.apply {
                put("time", record.time)
                put("zoneOffset", record.zoneOffset?.toJSONValue())
                put("height", record.height.toJSONObject())
            }
            is HydrationRecord -> obj.apply {
                put("startTime", record.startTime)
                put("startZoneOffset", record.startZoneOffset?.toJSONValue())
                put("endTime", record.endTime)
                put("endZoneOffset", record.endZoneOffset?.toJSONValue())
                put("volume", record.volume.toJSONObject())
            }
            is IntermenstrualBleedingRecord -> obj.apply {
                put("time", record.time)
                put("zoneOffset", record.zoneOffset?.toJSONValue())
            }
            is LeanBodyMassRecord -> obj.apply {
                put("time", record.time)
                put("zoneOffset", record.zoneOffset?.toJSONValue())
                put("mass", record.mass.toJSONObject())
            }
            is MenstruationRecord -> obj.apply {
                put("startTime", record.startTime)
                put("startZoneOffset", record.startZoneOffset?.toJSONValue())
                put("endTime", record.endTime)
                put("endZoneOffset", record.endZoneOffset?.toJSONValue())
            }
            is MenstruationFlowRecord -> obj.apply {
                put("time", record.time)
                put("zoneOffset", record.zoneOffset?.toJSONValue())
                put("flow", record.flow)
            }
            is MenstruationPeriodRecord -> obj.apply {
                put("startTime", record.startTime)
                put("startZoneOffset", record.startZoneOffset?.toJSONValue())
                put("endTime", record.endTime)
                put("endZoneOffset", record.endZoneOffset?.toJSONValue())
            }
            is NutritionRecord -> obj.apply {
                put("startTime", record.startTime)
                put("startZoneOffset", record.startZoneOffset?.toJSONValue())
                put("endTime", record.endTime)
                put("endZoneOffset", record.endZoneOffset?.toJSONValue())
                if (record.energy != null) put("energy", record.energy.toJSONObject())
            }
            is OvulationTestRecord -> obj.apply {
                put("time", record.time)
                put("zoneOffset", record.zoneOffset?.toJSONValue())
                put("result", record.result)
            }
            is OxygenSaturationRecord -> obj.apply {
                put("time", record.time)
                put("zoneOffset", record.zoneOffset?.toJSONValue())
                put("percentage", record.percentage.toJSONObject())
            }
            is PlannedExerciseSessionRecord -> obj.apply {
                put("startTime", record.startTime)
                put("startZoneOffset", record.startZoneOffset?.toJSONValue())
                put("endTime", record.endTime)
                put("endZoneOffset", record.endZoneOffset?.toJSONValue())
                put("title", record.title)
                put("notes", record.notes)
            }
            is PowerRecord -> obj.apply {
                put("time", record.time)
                put("zoneOffset", record.zoneOffset?.toJSONValue())
                put("power", record.power.toJSONObject())
            }
            is RespiratoryRateRecord -> obj.apply {
                put("time", record.time)
                put("zoneOffset", record.zoneOffset?.toJSONValue())
                put("rate", record.rate)
            }
            is RestingHeartRateRecord -> obj.apply {
                put("time", record.time)
                put("zoneOffset", record.zoneOffset?.toJSONValue())
                put("beatsPerMinute", record.beatsPerMinute)
            }
            is SexualActivityRecord -> obj.apply {
                put("time", record.time)
                put("zoneOffset", record.zoneOffset?.toJSONValue())
                put("protected", record.protected)
            }
            is SkinTemperatureRecord -> obj.apply {
                put("startTime", record.startTime)
                put("startZoneOffset", record.startZoneOffset?.toJSONValue())
                put("endTime", record.endTime)
                put("endZoneOffset", record.endZoneOffset?.toJSONValue())
                put("temperatureDeltaCelsius", record.temperatureDeltaCelsius)
            }
            is SleepSessionRecord -> obj.apply {
                put("startTime", record.startTime)
                put("startZoneOffset", record.startZoneOffset?.toJSONValue())
                put("endTime", record.endTime)
                put("endZoneOffset", record.endZoneOffset?.toJSONValue())
                put("title", record.title)
                put("notes", record.notes)
            }
            is SpeedRecord -> obj.apply {
                put("startTime", record.startTime)
                put("startZoneOffset", record.startZoneOffset?.toJSONValue())
                put("endTime", record.endTime)
                put("endZoneOffset", record.endZoneOffset?.toJSONValue())
                put("samples", record.samples.toSpeedSamplesJSONArray())
            }
            is StepsRecord -> obj.apply {
                put("startTime", record.startTime)
                put("startZoneOffset", record.startZoneOffset?.toJSONValue())
                put("endTime", record.endTime)
                put("endZoneOffset", record.endZoneOffset?.toJSONValue())
                put("count", record.count)
            }
            is StepsCadenceRecord -> obj.apply {
                put("startTime", record.startTime)
                put("startZoneOffset", record.startZoneOffset?.toJSONValue())
                put("endTime", record.endTime)
                put("endZoneOffset", record.endZoneOffset?.toJSONValue())
                put("samples", record.samples.toStepsCadenceJSONArray())
            }
            is TotalCaloriesBurnedRecord -> obj.apply {
                put("startTime", record.startTime)
                put("startZoneOffset", record.startZoneOffset?.toJSONValue())
                put("endTime", record.endTime)
                put("endZoneOffset", record.endZoneOffset?.toJSONValue())
                put("energy", record.energy.toJSONObject())
            }
            is Vo2MaxRecord -> obj.apply {
                put("time", record.time)
                put("zoneOffset", record.zoneOffset?.toJSONValue())
                put("vo2MillilitersPerMinuteKilogram", record.vo2MillilitersPerMinuteKilogram)
            }
            is WeightRecord -> obj.apply {
                put("time", record.time)
                put("zoneOffset", record.zoneOffset?.toJSONValue())
                put("weight", record.weight.toJSONObject())
            }
            is WheelchairPushesRecord -> obj.apply {
                put("startTime", record.startTime)
                put("startZoneOffset", record.startZoneOffset?.toJSONValue())
                put("endTime", record.endTime)
                put("endZoneOffset", record.endZoneOffset?.toJSONValue())
                put("count", record.count)
            }
            is CyclingPedalingCadenceRecord -> obj.apply {
                put("startTime", record.startTime)
                put("startZoneOffset", record.startZoneOffset?.toJSONValue())
                put("endTime", record.endTime)
                put("endZoneOffset", record.endZoneOffset?.toJSONValue())
                put("samples", record.samples.toCyclingCadenceJSONArray())
            }
            else -> {
                // Fallback: leave empty; caller will still include type & metadata.
            }
        }
        return obj
    }
}
