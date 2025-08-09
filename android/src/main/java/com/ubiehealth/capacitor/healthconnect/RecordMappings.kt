
package com.ubiehealth.capacitor.healthconnect

import androidx.health.connect.client.records.Record
import org.json.JSONObject

object RecordMappings {
    val SUPPORTED_TYPES: Set<String> = setOf(
        "ActiveCaloriesBurned","BasalBodyTemperature","BasalMetabolicRate","BloodGlucose","BloodPressure",
        "BodyFat","BodyTemperature","BodyWaterMass","BoneMass","CervicalMucus","Distance","ElevationGained",
        "ExerciseSession","FloorsClimbed","HeartRateSeries","Height","Hydration","IntermenstrualBleeding",
        "LeanBodyMass","MenstruationPeriod","MenstruationFlow","Nutrition","OvulationTest","OxygenSaturation",
        "PlannedExerciseSession","Power","RespiratoryRate","RestingHeartRate","SexualActivity","SleepSession",
        "SleepStage","SkinTemperature","Speed","Steps","StepsCadence","TotalCaloriesBurned","Vo2Max","Weight",
        "WheelchairPushes","CyclingPedalingCadence"
    )

    fun isSupported(type: String) = SUPPORTED_TYPES.contains(type)

    fun validateType(type: String) {
        if (!isSupported(type)) throw IllegalArgumentException("Unsupported RecordType: $type")
    }

    fun validateTypes(types: Collection<String>) { types.forEach { validateType(it) } }

    fun fromJson(type: String, json: JSONObject): Record {
        validateType(type)
        val obj = JSONObject(json.toString())
        obj.put("type", type)
        return obj.toRecord()
    }

    fun toJson(record: Record) = record.toJSONObject()
}
