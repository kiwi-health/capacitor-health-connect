package com.ubiehealth.capacitor.healthconnect

import androidx.health.connect.client.records.*
import kotlin.reflect.KClass

object RecordTypeRegistry {
    // String -> Record-Klasse (nur öffentliche Record-APIs)
    val NAME_TO_CLASS: Map<String, KClass<out Record>> = mapOf(
        "ActiveCaloriesBurned" to ActiveCaloriesBurnedRecord::class,
        "BasalBodyTemperature" to BasalBodyTemperatureRecord::class,
        "BasalMetabolicRate" to BasalMetabolicRateRecord::class,
        "BloodGlucose" to BloodGlucoseRecord::class,
        "BloodPressure" to BloodPressureRecord::class,
        "BodyFat" to BodyFatRecord::class,
        "BodyTemperature" to BodyTemperatureRecord::class,
        "BodyWaterMass" to BodyWaterMassRecord::class,
        "BoneMass" to BoneMassRecord::class,
        "CervicalMucus" to CervicalMucusRecord::class,
        "CyclingPedalingCadence" to CyclingPedalingCadenceRecord::class,
        "Distance" to DistanceRecord::class,
        "ElevationGained" to ElevationGainedRecord::class,
        "ExerciseSession" to ExerciseSessionRecord::class,
        "FloorsClimbed" to FloorsClimbedRecord::class,
        "HeartRateSeries" to HeartRateRecord::class,
        "Height" to HeightRecord::class,
        "Hydration" to HydrationRecord::class,
        "IntermenstrualBleeding" to IntermenstrualBleedingRecord::class,
        "LeanBodyMass" to LeanBodyMassRecord::class,
        // "Menstruation" to MenstruationRecord::class,               // falls deine Version Period/Flow trennt, s.u.
        "MenstruationFlow" to MenstruationFlowRecord::class,       // 1.2.0 alpha: vorhanden
        "MenstruationPeriod" to MenstruationPeriodRecord::class,   // 1.2.0 alpha: vorhanden
        "Nutrition" to NutritionRecord::class,
        "OvulationTest" to OvulationTestRecord::class,
        "OxygenSaturation" to OxygenSaturationRecord::class,
        // "PlannedExercise" to PlannedExerciseRecord::class,         // falls du PlannedExerciseSessionRecord nutzt, ggf. anpassen
        "PlannedExerciseSession" to PlannedExerciseSessionRecord::class,
        "Power" to PowerRecord::class,
        "RespiratoryRate" to RespiratoryRateRecord::class,
        "RestingHeartRate" to RestingHeartRateRecord::class,
        "SexualActivity" to SexualActivityRecord::class,
        "SleepSession" to SleepSessionRecord::class,
        // "SleepStage" to SleepStageRecord::class,
        "SkinTemperature" to SkinTemperatureRecord::class,
        "Speed" to SpeedRecord::class,
        "Steps" to StepsRecord::class,
        "StepsCadence" to StepsCadenceRecord::class,
        "TotalCaloriesBurned" to TotalCaloriesBurnedRecord::class,
        "Vo2Max" to Vo2MaxRecord::class,
        "Weight" to WeightRecord::class,
        "WheelchairPushes" to WheelchairPushesRecord::class,
    )

    // (Optional) Inverse Map, falls du sie brauchst
    val CLASS_TO_NAME: Map<KClass<out Record>, String> =
        NAME_TO_CLASS.entries.associate { it.value to it.key }

    fun requireClass(typeName: String): KClass<out Record> =
        NAME_TO_CLASS[typeName]
            ?: throw IllegalArgumentException("Unexpected RecordType: $typeName")
}
