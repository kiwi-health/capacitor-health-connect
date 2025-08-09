
package com.ubiehealth.capacitor.healthconnect

import androidx.health.connect.client.changes.Change
import androidx.health.connect.client.changes.DeletionChange
import androidx.health.connect.client.changes.UpsertionChange
import androidx.health.connect.client.impl.converters.datatype.RECORDS_CLASS_NAME_MAP
import androidx.health.connect.client.records.*
import androidx.health.connect.client.records.BodyTemperatureMeasurementLocation.MEASUREMENT_LOCATION_INT_TO_STRING_MAP
import androidx.health.connect.client.records.BodyTemperatureMeasurementLocation.MEASUREMENT_LOCATION_STRING_TO_INT_MAP
import androidx.health.connect.client.records.metadata.DataOrigin
import androidx.health.connect.client.records.metadata.Metadata
import androidx.health.connect.client.time.TimeRangeFilter
import androidx.health.connect.client.units.*
import com.getcapacitor.JSObject
import org.json.JSONArray
import org.json.JSONObject
import java.lang.RuntimeException
import java.time.Instant
import java.time.ZoneOffset

internal fun <T> JSONArray.toList(): List<T> = (0 until this.length()).map { @Suppress("UNCHECKED_CAST") this.get(it) as T }
internal fun <T> List<T>.toJSONArray(): JSONArray = JSONArray(this)

internal fun JSONObject.toRecord(): Record {
    return when (val type = this.get("type")) {
        "ActiveCaloriesBurned" -> ActiveCaloriesBurnedRecord(
            startTime = getInstant("startTime"),
            startZoneOffset = getZoneOffsetOrNull("startZoneOffset"),
            endTime = getInstant("endTime"),
            endZoneOffset = getZoneOffsetOrNull("endZoneOffset"),
            energy = getEnergy("energy"),
        )
        "BasalBodyTemperature" -> BasalBodyTemperatureRecord(
            time = getInstant("time"),
            zoneOffset = getZoneOffsetOrNull("zoneOffset"),
            temperature = getTemperature("temperature"),
            measurementLocation = getBodyTemperatureMeasurementLocationInt("measurementLocation"),
        )
        "BasalMetabolicRate" -> BasalMetabolicRateRecord(
            time = getInstant("time"),
            zoneOffset = getZoneOffsetOrNull("zoneOffset"),
            basalMetabolicRate = getPower("basalMetabolicRate"),
        )
        "BloodGlucose" -> BloodGlucoseRecord(
            time = getInstant("time"),
            zoneOffset = getZoneOffsetOrNull("zoneOffset"),
            level = getBloodGlucose("level"),
            specimenSource = BloodGlucoseRecord.SPECIMEN_SOURCE_STRING_TO_INT_MAP
                .getOrDefault(getString("specimenSource"), BloodGlucoseRecord.SPECIMEN_SOURCE_UNKNOWN),
            mealType = MealType.MEAL_TYPE_STRING_TO_INT_MAP
                .getOrDefault(getString("mealType"), MealType.MEAL_TYPE_UNKNOWN),
            relationToMeal = BloodGlucoseRecord.RELATION_TO_MEAL_STRING_TO_INT_MAP
                .getOrDefault(getString("relationToMeal"), BloodGlucoseRecord.RELATION_TO_MEAL_UNKNOWN),
        )
        "BloodPressure" -> BloodPressureRecord(
            time = getInstant("time"),
            zoneOffset = getZoneOffsetOrNull("zoneOffset"),
            systolic = getPressure("systolic"),
            diastolic = getPressure("diastolic"),
            bodyPosition = BloodPressureRecord.BODY_POSITION_STRING_TO_INT_MAP
                .getOrDefault(getString("bodyPosition"), BloodPressureRecord.BODY_POSITION_UNKNOWN),
            measurementLocation = BloodPressureRecord.MEASUREMENT_LOCATION_STRING_TO_INT_MAP
                .getOrDefault(getString("measurementLocation"), BloodPressureRecord.MEASUREMENT_LOCATION_UNKNOWN),
        )
        "BodyFat" -> BodyFatRecord(
            time = getInstant("time"),
            zoneOffset = getZoneOffsetOrNull("zoneOffset"),
            percentage = getPercentage("percentage"),
        )
        "BodyTemperature" -> BodyTemperatureRecord(
            time = getInstant("time"),
            zoneOffset = getZoneOffsetOrNull("zoneOffset"),
            temperature = getTemperature("temperature"),
            measurementLocation = getBodyTemperatureMeasurementLocationInt("measurementLocation"),
        )
        "BodyWaterMass" -> BodyWaterMassRecord(
            time = getInstant("time"),
            zoneOffset = getZoneOffsetOrNull("zoneOffset"),
            mass = getMass("mass"),
        )
        "BoneMass" -> BoneMassRecord(
            time = getInstant("time"),
            zoneOffset = getZoneOffsetOrNull("zoneOffset"),
            mass = getMass("mass"),
        )
        "CervicalMucus" -> CervicalMucusRecord(
            time = getInstant("time"),
            zoneOffset = getZoneOffsetOrNull("zoneOffset"),
            appearance = getString("appearance"),
            sensation = getString("sensation"),
        )
        "Distance" -> DistanceRecord(
            startTime = getInstant("startTime"),
            startZoneOffset = getZoneOffsetOrNull("startZoneOffset"),
            endTime = getInstant("endTime"),
            endZoneOffset = getZoneOffsetOrNull("endZoneOffset"),
            distance = getLength("distance")
        )
        "ElevationGained" -> ElevationGainedRecord(
            startTime = getInstant("startTime"),
            startZoneOffset = getZoneOffsetOrNull("startZoneOffset"),
            endTime = getInstant("endTime"),
            endZoneOffset = getZoneOffsetOrNull("endZoneOffset"),
            elevation = getLength("elevation")
        )
        "ExerciseSession" -> ExerciseSessionRecord(
            startTime = getInstant("startTime"),
            startZoneOffset = getZoneOffsetOrNull("startZoneOffset"),
            endTime = getInstant("endTime"),
            endZoneOffset = getZoneOffsetOrNull("endZoneOffset"),
            title = optString("title", null),
            notes = optString("notes", null),
            exerciseType = getInt("exerciseType")
        )
        "FloorsClimbed" -> FloorsClimbedRecord(
            startTime = getInstant("startTime"),
            startZoneOffset = getZoneOffsetOrNull("startZoneOffset"),
            endTime = getInstant("endTime"),
            endZoneOffset = getZoneOffsetOrNull("endZoneOffset"),
            floors = getDouble("floors")
        )
        "HeartRateSeries" -> HeartRateRecord(
            startTime = getInstant("startTime"),
            startZoneOffset = getZoneOffsetOrNull("startZoneOffset"),
            endTime = getInstant("endTime"),
            endZoneOffset = getZoneOffsetOrNull("endZoneOffset"),
            samples = getHeartRateRecordSamplesList("samples")
        )
        "Height" -> HeightRecord(
            time = getInstant("time"),
            zoneOffset = getZoneOffsetOrNull("zoneOffset"),
            height = getLength("height"),
        )
        "Hydration" -> HydrationRecord(
            startTime = getInstant("startTime"),
            startZoneOffset = getZoneOffsetOrNull("startZoneOffset"),
            endTime = getInstant("endTime"),
            endZoneOffset = getZoneOffsetOrNull("endZoneOffset"),
            volume = getVolume("volume")
        )
        "IntermenstrualBleeding" -> IntermenstrualBleedingRecord(
            time = getInstant("time"),
            zoneOffset = getZoneOffsetOrNull("zoneOffset"),
        )
        "LeanBodyMass" -> LeanBodyMassRecord(
            time = getInstant("time"),
            zoneOffset = getZoneOffsetOrNull("zoneOffset"),
            mass = getMass("mass"),
        )
        "MenstruationPeriod" -> MenstruationPeriodRecord(
            startTime = getInstant("startTime"),
            startZoneOffset = getZoneOffsetOrNull("startZoneOffset"),
            endTime = getInstant("endTime"),
            endZoneOffset = getZoneOffsetOrNull("endZoneOffset")
        )
        "MenstruationFlow" -> MenstruationFlowRecord(
            time = getInstant("time"),
            zoneOffset = getZoneOffsetOrNull("zoneOffset"),
            flow = MenstruationFlowRecord.FLOW_STRING_TO_INT_MAP.getOrDefault(getString("flow"), MenstruationFlowRecord.FLOW_UNKNOWN)
        )
        "Nutrition" -> NutritionRecord(
            startTime = getInstant("startTime"),
            startZoneOffset = getZoneOffsetOrNull("startZoneOffset"),
            endTime = getInstant("endTime"),
            endZoneOffset = getZoneOffsetOrNull("endZoneOffset"),
            energy = optJSONObject("energy")?.let { getEnergy("energy") },
            water = optJSONObject("water")?.let { getVolume("water") },
            protein = optJSONObject("protein")?.let { getMass("protein") },
            // other nutrients can be added similarly
        )
        "OvulationTest" -> OvulationTestRecord(
            time = getInstant("time"),
            zoneOffset = getZoneOffsetOrNull("zoneOffset"),
            result = getString("result")
        )
        "OxygenSaturation" -> OxygenSaturationRecord(
            time = getInstant("time"),
            zoneOffset = getZoneOffsetOrNull("zoneOffset"),
            percentage = getPercentage("percentage"),
        )
        "PlannedExerciseSession" -> PlannedExerciseSessionRecord(
            startTime = getInstant("startTime"),
            startZoneOffset = getZoneOffsetOrNull("startZoneOffset"),
            endTime = getInstant("endTime"),
            endZoneOffset = getZoneOffsetOrNull("endZoneOffset"),
            title = optString("title", null),
            notes = optString("notes", null)
        )
        "Power" -> PowerRecord(
            time = getInstant("time"),
            zoneOffset = getZoneOffsetOrNull("zoneOffset"),
            power = getPower("power")
        )
        "RespiratoryRate" -> RespiratoryRateRecord(
            time = getInstant("time"),
            zoneOffset = getZoneOffsetOrNull("zoneOffset"),
            rate = getDouble("rate"),
        )
        "RestingHeartRate" -> RestingHeartRateRecord(
            time = getInstant("time"),
            zoneOffset = getZoneOffsetOrNull("zoneOffset"),
            beatsPerMinute = getLong("beatsPerMinute"),
        )
        "SexualActivity" -> SexualActivityRecord(
            time = getInstant("time"),
            zoneOffset = getZoneOffsetOrNull("zoneOffset"),
            protectionUsed = if (has("protected")) {
                if (getBoolean("protected")) SexualActivityRecord.PROTECTION_USED_YES else SexualActivityRecord.PROTECTION_USED_NO
            } else SexualActivityRecord.PROTECTION_USED_UNKNOWN
        )
        "SleepSession" -> SleepSessionRecord(
            startTime = getInstant("startTime"),
            startZoneOffset = getZoneOffsetOrNull("startZoneOffset"),
            endTime = getInstant("endTime"),
            endZoneOffset = getZoneOffsetOrNull("endZoneOffset"),
            title = optString("title", null),
            notes = optString("notes", null)
        )
        "SleepStage" -> SleepStageRecord(
            startTime = getInstant("startTime"),
            startZoneOffset = getZoneOffsetOrNull("startZoneOffset"),
            endTime = getInstant("endTime"),
            endZoneOffset = getZoneOffsetOrNull("endZoneOffset"),
            stage = getInt("stage")
        )
        "SkinTemperature" -> SkinTemperatureRecord(
            time = getInstant("time"),
            zoneOffset = getZoneOffsetOrNull("zoneOffset"),
            temperature = getTemperature("temperature")
        )
        "Speed" -> SpeedRecord(
            startTime = getInstant("startTime"),
            startZoneOffset = getZoneOffsetOrNull("startZoneOffset"),
            endTime = getInstant("endTime"),
            endZoneOffset = getZoneOffsetOrNull("endZoneOffset"),
            samples = getSpeedSamples("samples")
        )
        "Steps" -> StepsRecord(
            startTime = getInstant("startTime"),
            startZoneOffset = getZoneOffsetOrNull("startZoneOffset"),
            endTime = getInstant("endTime"),
            endZoneOffset = getZoneOffsetOrNull("endZoneOffset"),
            count = getLong("count"),
        )
        "StepsCadence" -> StepsCadenceRecord(
            startTime = getInstant("startTime"),
            startZoneOffset = getZoneOffsetOrNull("startZoneOffset"),
            endTime = getInstant("endTime"),
            endZoneOffset = getZoneOffsetOrNull("endZoneOffset"),
            samples = getStepsCadenceSamples("samples")
        )
        "TotalCaloriesBurned" -> TotalCaloriesBurnedRecord(
            startTime = getInstant("startTime"),
            startZoneOffset = getZoneOffsetOrNull("startZoneOffset"),
            endTime = getInstant("endTime"),
            endZoneOffset = getZoneOffsetOrNull("endZoneOffset"),
            energy = getEnergy("energy")
        )
        "Vo2Max" -> Vo2MaxRecord(
            time = getInstant("time"),
            zoneOffset = getZoneOffsetOrNull("zoneOffset"),
            vo2MillilitersPerMinuteKilogram = getDouble("vo2")
        )
        "Weight" -> WeightRecord(
            time = getInstant("time"),
            zoneOffset = getZoneOffsetOrNull("zoneOffset"),
            weight = getMass("weight"),
        )
        "WheelchairPushes" -> WheelchairPushesRecord(
            startTime = getInstant("startTime"),
            startZoneOffset = getZoneOffsetOrNull("startZoneOffset"),
            endTime = getInstant("endTime"),
            endZoneOffset = getZoneOffsetOrNull("endZoneOffset"),
            count = getLong("count")
        )
        "CyclingPedalingCadence" -> CyclingPedalingCadenceRecord(
            startTime = getInstant("startTime"),
            startZoneOffset = getZoneOffsetOrNull("startZoneOffset"),
            endTime = getInstant("endTime"),
            endZoneOffset = getZoneOffsetOrNull("endZoneOffset"),
            samples = getCyclingCadenceSamples("samples")
        )
        else -> throw IllegalArgumentException("Unexpected record type: $type")
    }
}

internal fun Record.toJSONObject(): JSONObject {
    return JSONObject().also { obj ->
        obj.put("type", RECORDS_CLASS_NAME_MAP[this::class])
        obj.put("metadata", this.metadata.toJSONObject())

        when (this) {
            is ActiveCaloriesBurnedRecord -> {
                obj.put("startTime", startTime); obj.put("startZoneOffset", startZoneOffset?.toJSONValue())
                obj.put("endTime", endTime); obj.put("endZoneOffset", endZoneOffset?.toJSONValue())
                obj.put("energy", energy.toJSONObject())
            }
            is BasalBodyTemperatureRecord -> {
                obj.put("time", time); obj.put("zoneOffset", zoneOffset?.toJSONValue())
                obj.put("temperature", temperature.toJSONObject())
                obj.put("measurementLocation", measurementLocation.toBodyTemperatureMeasurementLocationString())
            }
            is BasalMetabolicRateRecord -> {
                obj.put("time", time); obj.put("zoneOffset", zoneOffset?.toJSONValue())
                obj.put("basalMetabolicRate", basalMetabolicRate.toJSONObject())
            }
            is BloodGlucoseRecord -> {
                obj.put("time", time); obj.put("zoneOffset", zoneOffset?.toJSONValue())
                obj.put("level", level.toJSONObject())
                obj.put("specimenSource", BloodGlucoseRecord.SPECIMEN_SOURCE_INT_TO_STRING_MAP.getOrDefault(specimenSource, "unknown"))
                obj.put("mealType", MealType.MEAL_TYPE_INT_TO_STRING_MAP.getOrDefault(mealType, "unknown"))
                obj.put("relationToMeal", BloodGlucoseRecord.RELATION_TO_MEAL_INT_TO_STRING_MAP.getOrDefault(relationToMeal, "unknown"))
            }
            is BloodPressureRecord -> {
                obj.put("time", time); obj.put("zoneOffset", zoneOffset?.toJSONValue())
                obj.put("systolic", systolic.toJSONObject()); obj.put("diastolic", diastolic.toJSONObject())
                obj.put("bodyPosition", BloodPressureRecord.BODY_POSITION_INT_TO_STRING_MAP.getOrDefault(bodyPosition, "unknown"))
                obj.put("measurementLocation", BloodPressureRecord.MEASUREMENT_LOCATION_INT_TO_STRING_MAP.getOrDefault(measurementLocation, "unknown"))
            }
            is BodyFatRecord -> {
                obj.put("time", time); obj.put("zoneOffset", zoneOffset?.toJSONValue())
                obj.put("percentage", percentage.toJSONObject())
            }
            is BodyTemperatureRecord -> {
                obj.put("time", time); obj.put("zoneOffset", zoneOffset?.toJSONValue())
                obj.put("temperature", temperature.toJSONObject())
                obj.put("measurementLocation", measurementLocation.toBodyTemperatureMeasurementLocationString())
            }
            is BodyWaterMassRecord -> {
                obj.put("time", time); obj.put("zoneOffset", zoneOffset?.toJSONValue())
                obj.put("mass", mass.toJSONObject())
            }
            is BoneMassRecord -> {
                obj.put("time", time); obj.put("zoneOffset", zoneOffset?.toJSONValue())
                obj.put("mass", mass.toJSONObject())
            }
            is CervicalMucusRecord -> {
                obj.put("time", time); obj.put("zoneOffset", zoneOffset?.toJSONValue())
                obj.put("appearance", appearance); obj.put("sensation", sensation)
            }
            is DistanceRecord -> {
                obj.put("startTime", startTime); obj.put("startZoneOffset", startZoneOffset?.toJSONValue())
                obj.put("endTime", endTime); obj.put("endZoneOffset", endZoneOffset?.toJSONValue())
                obj.put("distance", distance.toJSONObject())
            }
            is ElevationGainedRecord -> {
                obj.put("startTime", startTime); obj.put("startZoneOffset", startZoneOffset?.toJSONValue())
                obj.put("endTime", endTime); obj.put("endZoneOffset", endZoneOffset?.toJSONValue())
                obj.put("elevation", elevation.toJSONObject())
            }
            is ExerciseSessionRecord -> {
                obj.put("startTime", startTime); obj.put("startZoneOffset", startZoneOffset?.toJSONValue())
                obj.put("endTime", endTime); obj.put("endZoneOffset", endZoneOffset?.toJSONValue())
                obj.put("title", title); obj.put("notes", notes); obj.put("exerciseType", exerciseType)
            }
            is FloorsClimbedRecord -> {
                obj.put("startTime", startTime); obj.put("startZoneOffset", startZoneOffset?.toJSONValue())
                obj.put("endTime", endTime); obj.put("endZoneOffset", endZoneOffset?.toJSONValue())
                obj.put("floors", floors)
            }
            is HeartRateRecord -> {
                obj.put("startTime", startTime); obj.put("startZoneOffset", startZoneOffset?.toJSONValue())
                obj.put("endTime", endTime); obj.put("endZoneOffset", endZoneOffset?.toJSONValue())
                obj.put("samples", samples.toHeartRateRecordSamplesJSONArray())
            }
            is HeightRecord -> {
                obj.put("time", time); obj.put("zoneOffset", zoneOffset?.toJSONValue())
                obj.put("height", height.toJSONObject())
            }
            is HydrationRecord -> {
                obj.put("startTime", startTime); obj.put("startZoneOffset", startZoneOffset?.toJSONValue())
                obj.put("endTime", endTime); obj.put("endZoneOffset", endZoneOffset?.toJSONValue())
                obj.put("volume", volume.toJSONObject())
            }
            is IntermenstrualBleedingRecord -> {
                obj.put("time", time); obj.put("zoneOffset", zoneOffset?.toJSONValue())
            }
            is LeanBodyMassRecord -> {
                obj.put("time", time); obj.put("zoneOffset", zoneOffset?.toJSONValue())
                obj.put("mass", mass.toJSONObject())
            }
            is MenstruationPeriodRecord -> {
                obj.put("startTime", startTime); obj.put("startZoneOffset", startZoneOffset?.toJSONValue())
                obj.put("endTime", endTime); obj.put("endZoneOffset", endZoneOffset?.toJSONValue())
            }
            is MenstruationFlowRecord -> {
                obj.put("time", time); obj.put("zoneOffset", zoneOffset?.toJSONValue())
                obj.put("flow", MenstruationFlowRecord.FLOW_INT_TO_STRING_MAP.getOrDefault(flow, "unknown"))
            }
            is NutritionRecord -> {
                obj.put("startTime", startTime); obj.put("startZoneOffset", startZoneOffset?.toJSONValue())
                obj.put("endTime", endTime); obj.put("endZoneOffset", endZoneOffset?.toJSONValue())
                energy?.let { obj.put("energy", it.toJSONObject()) }
                water?.let { obj.put("water", it.toJSONObject()) }
                protein?.let { obj.put("protein", it.toJSONObject()) }
            }
            is OvulationTestRecord -> {
                obj.put("time", time); obj.put("zoneOffset", zoneOffset?.toJSONValue()); obj.put("result", result)
            }
            is OxygenSaturationRecord -> {
                obj.put("time", time); obj.put("zoneOffset", zoneOffset?.toJSONValue()); obj.put("percentage", percentage.toJSONObject())
            }
            is PlannedExerciseSessionRecord -> {
                obj.put("startTime", startTime); obj.put("startZoneOffset", startZoneOffset?.toJSONValue())
                obj.put("endTime", endTime); obj.put("endZoneOffset", endZoneOffset?.toJSONValue())
                obj.put("title", title); obj.put("notes", notes)
            }
            is PowerRecord -> {
                obj.put("time", time); obj.put("zoneOffset", zoneOffset?.toJSONValue()); obj.put("power", power.toJSONObject())
            }
            is RespiratoryRateRecord -> {
                obj.put("time", time); obj.put("zoneOffset", zoneOffset?.toJSONValue()); obj.put("rate", rate)
            }
            is RestingHeartRateRecord -> {
                obj.put("time", time); obj.put("zoneOffset", zoneOffset?.toJSONValue()); obj.put("beatsPerMinute", beatsPerMinute)
            }
            is SexualActivityRecord -> {
                obj.put("time", time); obj.put("zoneOffset", zoneOffset?.toJSONValue())
                obj.put("protected", protectionUsed == SexualActivityRecord.PROTECTION_USED_YES)
            }
            is SleepSessionRecord -> {
                obj.put("startTime", startTime); obj.put("startZoneOffset", startZoneOffset?.toJSONValue())
                obj.put("endTime", endTime); obj.put("endZoneOffset", endZoneOffset?.toJSONValue())
                obj.put("title", title); obj.put("notes", notes)
            }
            is SleepStageRecord -> {
                obj.put("startTime", startTime); obj.put("startZoneOffset", startZoneOffset?.toJSONValue())
                obj.put("endTime", endTime); obj.put("endZoneOffset", endZoneOffset?.toJSONValue())
                obj.put("stage", stage)
            }
            is SkinTemperatureRecord -> {
                obj.put("time", time); obj.put("zoneOffset", zoneOffset?.toJSONValue()); obj.put("temperature", temperature.toJSONObject())
            }
            is SpeedRecord -> {
                obj.put("startTime", startTime); obj.put("startZoneOffset", startZoneOffset?.toJSONValue())
                obj.put("endTime", endTime); obj.put("endZoneOffset", endZoneOffset?.toJSONValue())
                obj.put("samples", samples.toSpeedSamplesJSONArray())
            }
            is StepsRecord -> {
                obj.put("startTime", startTime); obj.put("startZoneOffset", startZoneOffset?.toJSONValue())
                obj.put("endTime", endTime); obj.put("endZoneOffset", endZoneOffset?.toJSONValue())
                obj.put("count", count)
            }
            is StepsCadenceRecord -> {
                obj.put("startTime", startTime); obj.put("startZoneOffset", startZoneOffset?.toJSONValue())
                obj.put("endTime", endTime); obj.put("endZoneOffset", endZoneOffset?.toJSONValue())
                obj.put("samples", samples.toStepsCadenceSamplesJSONArray())
            }
            is TotalCaloriesBurnedRecord -> {
                obj.put("startTime", startTime); obj.put("startZoneOffset", startZoneOffset?.toJSONValue())
                obj.put("endTime", endTime); obj.put("endZoneOffset", endZoneOffset?.toJSONValue())
                obj.put("energy", energy.toJSONObject())
            }
            is Vo2MaxRecord -> {
                obj.put("time", time); obj.put("zoneOffset", zoneOffset?.toJSONValue()); obj.put("vo2", vo2MillilitersPerMinuteKilogram)
            }
            is WeightRecord -> {
                obj.put("time", time); obj.put("zoneOffset", zoneOffset?.toJSONValue()); obj.put("weight", weight.toJSONObject())
            }
            is WheelchairPushesRecord -> {
                obj.put("startTime", startTime); obj.put("startZoneOffset", startZoneOffset?.toJSONValue())
                obj.put("endTime", endTime); obj.put("endZoneOffset", endZoneOffset?.toJSONValue())
                obj.put("count", count)
            }
            is CyclingPedalingCadenceRecord -> {
                obj.put("startTime", startTime); obj.put("startZoneOffset", startZoneOffset?.toJSONValue())
                obj.put("endTime", endTime); obj.put("endZoneOffset", endZoneOffset?.toJSONValue())
                obj.put("samples", samples.toCyclingCadenceSamplesJSONArray())
            }
            else -> throw IllegalArgumentException("Unexpected record class: ${this::class.qualifiedName}")
        }
    }
}

internal fun Metadata.toJSONObject(): JSONObject = JSONObject().also { obj ->
    obj.put("id", id)
    obj.put("clientRecordId", clientRecordId)
    obj.put("clientRecordVersion", clientRecordVersion)
    obj.put("lastModifiedTime", lastModifiedTime)
    obj.put("dataOrigin", dataOrigin.packageName)
}

internal fun Change.toJSObject(): JSObject = JSObject().also { obj ->
    when (this) {
        is UpsertionChange -> { obj.put("type", "Upsert"); obj.put("record", record.toJSONObject()) }
        is DeletionChange -> { obj.put("type", "Delete"); obj.put("recordId", recordId) }
    }
}

internal fun JSONObject.getInstant(name: String): Instant = Instant.parse(getString(name))
internal fun JSONObject.getZoneOffsetOrNull(name: String): ZoneOffset? = if (has(name)) ZoneOffset.of(getString(name)) else null
internal fun ZoneOffset.toJSONValue(): String = id

internal fun JSONObject.getLength(name: String): Length {
    val obj = requireNotNull(getJSONObject(name)); val unit = obj.getString("unit"); val value = obj.getDouble("value")
    return when (unit) {
        "meter" -> Length.meters(value)
        "kilometer" -> Length.kilometers(value)
        "mile" -> Length.miles(value)
        "inch" -> Length.inches(value)
        "feet" -> Length.feet(value)
        else -> throw IllegalArgumentException("Unexpected length unit: $unit")
    }
}
internal fun Length.toJSONObject(): JSONObject = JSONObject().also { it.put("unit", "meter"); it.put("value", inMeters) }

internal fun JSONObject.getMass(name: String): Mass {
    val obj = requireNotNull(getJSONObject(name)); val unit = obj.getString("unit"); val value = obj.getDouble("value")
    return when (unit) {
        "gram" -> Mass.grams(value)
        "kilogram" -> Mass.kilograms(value)
        "milligram" -> Mass.milligrams(value)
        "microgram" -> Mass.micrograms(value)
        "ounce" -> Mass.ounces(value)
        "pound" -> Mass.pounds(value)
        else -> throw IllegalArgumentException("Unexpected mass unit: $unit")
    }
}
internal fun Mass.toJSONObject(): JSONObject = JSONObject().also { it.put("unit", "gram"); it.put("value", inGrams) }

internal fun BloodGlucose.toJSONObject(): JSONObject = JSONObject().also { it.put("unit", "milligramsPerDeciliter"); it.put("value", inMilligramsPerDeciliter) }
internal fun JSONObject.getBloodGlucose(name: String): BloodGlucose {
    val obj = requireNotNull(getJSONObject(name)); val value = obj.getDouble("value")
    return when (val unit = obj.getString("unit")) {
        "milligramsPerDeciliter" -> BloodGlucose.milligramsPerDeciliter(value)
        "millimolesPerLiter" -> BloodGlucose.millimolesPerLiter(value)
        else -> throw RuntimeException("Invalid BloodGlucose unit: $unit")
    }
}

internal fun Energy.toJSONObject(): JSONObject = JSONObject().also { it.put("unit", "calories"); it.put("value", inCalories) }
internal fun JSONObject.getEnergy(name: String): Energy {
    val obj = requireNotNull(getJSONObject(name)); val value = obj.getDouble("value")
    return when (val unit = obj.getString("unit")) {
        "calories" -> Energy.calories(value)
        "kilocalories" -> Energy.kilocalories(value)
        "joules" -> Energy.joules(value)
        "kilojoules" -> Energy.kilojoules(value)
        else -> throw RuntimeException("Invalid Energy unit: $unit")
    }
}

internal fun Temperature.toJSONObject(): JSONObject = JSONObject().also { it.put("unit", "celsius"); it.put("value", inCelsius) }
internal fun JSONObject.getTemperature(name: String): Temperature {
    val obj = requireNotNull(getJSONObject(name)); val value = obj.getDouble("value")
    return when (val unit = obj.getString("unit")) {
        "celsius" -> Temperature.celsius(value)
        "fahrenheit" -> Temperature.fahrenheit(value)
        else -> throw RuntimeException("Invalid Temperature unit: $unit")
    }
}

internal fun Int.toBodyTemperatureMeasurementLocationString(): String = MEASUREMENT_LOCATION_INT_TO_STRING_MAP.getOrDefault(this, "unknown")
internal fun JSONObject.getBodyTemperatureMeasurementLocationInt(name: String): Int {
    val str = requireNotNull(getString(name))
    return MEASUREMENT_LOCATION_STRING_TO_INT_MAP.getOrDefault(str, BodyTemperatureMeasurementLocation.MEASUREMENT_LOCATION_UNKNOWN)
}

internal fun Power.toJSONObject(): JSONObject = JSONObject().also { it.put("unit", "kilocaloriesPerDay"); it.put("value", inKilocaloriesPerDay) }
internal fun JSONObject.getPower(name: String): Power {
    val obj = requireNotNull(getJSONObject(name)); val value = obj.getDouble("value")
    return when (val unit = obj.getString("unit")) {
        "kilocaloriesPerDay" -> Power.kilocaloriesPerDay(value)
        "watts" -> Power.watts(value)
        else -> throw RuntimeException("Invalid Power unit: $unit")
    }
}

internal fun Pressure.toJSONObject(): JSONObject = JSONObject().also { it.put("unit", "millimetersOfMercury"); it.put("value", inMillimetersOfMercury) }
internal fun JSONObject.getPressure(name: String): Pressure {
    val obj = requireNotNull(getJSONObject(name)); val value = obj.getDouble("value")
    return when (val unit = obj.getString("unit")) {
        "millimetersOfMercury" -> Pressure.millimetersOfMercury(value)
        else -> throw RuntimeException("Invalid Pressure unit: $unit")
    }
}

internal fun Volume.toJSONObject(): JSONObject = JSONObject().also { it.put("unit", "liter"); it.put("value", inLiters) }
internal fun JSONObject.getVolume(name: String): Volume {
    val obj = requireNotNull(getJSONObject(name)); val value = obj.getDouble("value")
    return when (val unit = obj.getString("unit")) {
        "milliliter" -> Volume.milliliters(value)
        "liter" -> Volume.liters(value)
        else -> throw RuntimeException("Invalid Volume unit: $unit")
    }
}

internal fun Velocity.toJSONObject(): JSONObject = JSONObject().also { it.put("unit", "metersPerSecond"); it.put("value", inMetersPerSecond) }
internal fun JSONObject.getVelocity(name: String): Velocity {
    val obj = requireNotNull(getJSONObject(name)); val value = obj.getDouble("value")
    return when (val unit = obj.getString("unit")) {
        "metersPerSecond" -> Velocity.metersPerSecond(value)
        else -> throw RuntimeException("Invalid Velocity unit: $unit")
    }
}

internal fun JSONObject.getTimeRangeFilter(name: String): TimeRangeFilter {
    val obj = requireNotNull(getJSONObject(name))
    return when (val type = obj.getString("type")) {
        "before" -> TimeRangeFilter.before(obj.getInstant("time"))
        "after" -> TimeRangeFilter.after(obj.getInstant("time"))
        "between" -> TimeRangeFilter.between(obj.getInstant("startTime"), obj.getInstant("endTime"))
        else -> throw IllegalArgumentException("Unexpected TimeRange type: $type")
    }
}

internal fun JSObject.getDataOriginFilter(name: String): Set<DataOrigin> =
    this.optJSONArray(name)?.toList<String>()?.map { DataOrigin(it) }?.toSet() ?: emptySet()

internal fun HeartRateRecord.Sample.toJSONObject(): JSONObject = JSONObject().also { o ->
    o.put("time", time); o.put("beatsPerMinute", beatsPerMinute)
}
internal fun List<HeartRateRecord.Sample>.toHeartRateRecordSamplesJSONArray(): JSONArray =
    JSONArray().also { j -> this.forEach { j.put(it.toJSONObject()) } }
internal fun JSONObject.getHeartRateRecordSamplesList(name: String): List<HeartRateRecord.Sample> =
    getJSONArray(name).toList<JSONObject>().map { HeartRateRecord.Sample(time = it.getInstant("time"), beatsPerMinute = it.getLong("beatsPerMinute")) }

// Speed samples
internal fun SpeedRecord.Sample.toJSONObject(): JSONObject = JSONObject().also { o ->
    o.put("time", time); o.put("speed", speed.toJSONObject())
}
internal fun List<SpeedRecord.Sample>.toSpeedSamplesJSONArray(): JSONArray =
    JSONArray().also { j -> this.forEach { j.put(it.toJSONObject()) } }
internal fun JSONObject.getSpeedSamples(name: String): List<SpeedRecord.Sample> =
    getJSONArray(name).toList<JSONObject>().map {
        SpeedRecord.Sample(time = it.getInstant("time"), speed = it.getVelocity("speed"))
    }

// Steps cadence samples (rate per minute)
internal fun StepsCadenceRecord.Sample.toJSONObject(): JSONObject = JSONObject().also { o ->
    o.put("time", time); o.put("rate", ratePerMinute)
}
internal fun List<StepsCadenceRecord.Sample>.toStepsCadenceSamplesJSONArray(): JSONArray =
    JSONArray().also { j -> this.forEach { j.put(it.toJSONObject()) } }
internal fun JSONObject.getStepsCadenceSamples(name: String): List<StepsCadenceRecord.Sample> =
    getJSONArray(name).toList<JSONObject>().map {
        StepsCadenceRecord.Sample(time = it.getInstant("time"), ratePerMinute = it.getDouble("rate"))
    }

// Cycling cadence samples (rpm)
internal fun CyclingPedalingCadenceRecord.Sample.toJSONObject(): JSONObject = JSONObject().also { o ->
    o.put("time", time); o.put("revolutionsPerMinute", revolutionsPerMinute)
}
internal fun List<CyclingPedalingCadenceRecord.Sample>.toCyclingCadenceSamplesJSONArray(): JSONArray =
    JSONArray().also { j -> this.forEach { j.put(it.toJSONObject()) } }
internal fun JSONObject.getCyclingCadenceSamples(name: String): List<CyclingPedalingCadenceRecord.Sample> =
    getJSONArray(name).toList<JSONObject>().map {
        CyclingPedalingCadenceRecord.Sample(time = it.getInstant("time"), revolutionsPerMinute = it.getDouble("revolutionsPerMinute"))
    }

internal fun Percentage.toJSONObject(): JSONObject = JSONObject().also { it.put("value", value) }
internal fun JSONObject.getPercentage(name: String): Percentage { val obj = requireNotNull(getJSONObject(name)); return Percentage(obj.getDouble("value")) }
