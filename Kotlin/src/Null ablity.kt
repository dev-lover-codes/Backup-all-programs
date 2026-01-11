fun main() {
    // Ask the user for input
    println("Please enter a number:")

    // Read user input as a String
    val input = readln()

    // Convert input to an integer safely using `toIntOrNull()`
    // `toIntOrNull()` tries to convert the string to an Int.
    // If the conversion fails (e.g., input = "abc"), it returns null instead of crashing.
    //
    // Then we use the safe-call operator `?.` to avoid NullPointerException.
    // It calls the next function only if the value is NOT null.
    //
    // Step by step:
    // 1. input.toIntOrNull() -> converts input to Int? (nullable Int)
    // 2. ?.rem(2) -> calls the remainder function (modulus) only if not null
    // 3. ?.equals(0) -> checks if the remainder is equal to 0 (even number) only if not null
    // 4. ?: false -> if any of the previous steps result in null, use false as the default
    //
    // So, if input is invalid (null) or any step fails, the result is false.
    val inputAsInteger = input.toIntOrNull()?.rem(2)?.equals(0) ?: false

    // Print whether the number is even
    println("Is even? $inputAsInteger")
}