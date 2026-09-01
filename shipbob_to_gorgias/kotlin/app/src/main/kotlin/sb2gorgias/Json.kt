@file:OptIn(ExperimentalSerializationApi::class)

package sb2gorgias

import kotlinx.serialization.ExperimentalSerializationApi
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonNamingStrategy
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.longOrNull

/**
 * The JSON codec both clients share. These settings are what let the ShipBob shapes in
 * `ShipBob.kt` stay small.
 */
val json: Json = Json {
    // Both APIs send far more than this integration reads, and add fields over time.
    ignoreUnknownKeys = true
    // ShipBob uses a missing key and an explicit null interchangeably — an OnHold
    // shipment sends `"tracking": null` where another topic simply omits the key.
    // Coercing turns both into the property's declared default.
    coerceInputValues = true
    // Both APIs speak snake_case; the data classes stay camelCase, as Kotlin does.
    namingStrategy = JsonNamingStrategy.SnakeCase
}

// --- reading JSON this integration does not model -----------------------------
//
// These accessors all take a *nullable* receiver, so reading into a raw order needs no
// `?.` and no intermediate checks: `order["recipient"]["address"]["city"].string`. A
// missing key, a JSON `null`, and a value of the wrong shape all answer `null`.

/** The value at [key], or `null` unless this really is an object with that key. */
operator fun JsonElement?.get(key: String): JsonElement? = (this as? JsonObject)?.get(key)

/** The value as a string, or `null` if it is absent or is not a JSON string. */
val JsonElement?.string: String?
    get() = (this as? JsonPrimitive)?.takeIf { it.isString }?.content

/** The value as a whole number, or `null` if it is absent or is not one. */
val JsonElement?.long: Long?
    get() = (this as? JsonPrimitive)?.longOrNull

/** The value as an object, or `null` if it is absent or is not one. */
val JsonElement?.obj: JsonObject?
    get() = this as? JsonObject

/** The value's elements, or nothing at all if it is absent or is not an array. */
val JsonElement?.list: List<JsonElement>
    get() = (this as? JsonArray).orEmpty()
