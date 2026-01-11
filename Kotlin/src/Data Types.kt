fun main() {
    val myInt = 10
    val myDouble = 3.14
    val myString = "Hello, World!"
    val myBoolean = true
    val myFloat = 3.14f
    val myLong = 10000000000L
    val myShort: Short = 20
    val myByte: Byte = 1
    val myChar = 'A'
    val myArray = arrayOf(1, 2, 3)
    val myList = listOf("a", "b", "c")
    val myMap = mapOf("a" to 1, "b" to 2)

    println("Variable 'myInt' is of type: ${myInt::class.simpleName} and value: $myInt")
    println("Variable 'myDouble' is of type: ${myDouble::class.simpleName} and value: $myDouble")
    println("Variable 'myString' is of type: ${myString::class.simpleName} and value: $myString")
    println("Variable 'myBoolean' is of type: ${myBoolean::class.simpleName} and value: $myBoolean")
    println("Variable 'myFloat' is of type: ${myFloat::class.simpleName} and value: $myFloat")
    println("Variable 'myLong' is of type: ${myLong::class.simpleName} and value: $myLong")
    println("Variable 'myShort' is of type: ${myShort::class.simpleName} and value: $myShort")
    println("Variable 'myByte' is of type: ${myByte::class.simpleName} and value: $myByte")
    println("Variable 'myChar' is of type: ${myChar::class.simpleName} and value: $myChar")
    println("Variable 'myArray' is of type: ${myArray::class.simpleName} and value: ${myArray.joinToString()}")
    println("Variable 'myList' is of type: ${myList::class.simpleName} and value: $myList")
    println("Variable 'myMap' is of type: ${myMap::class.simpleName} and value: $myMap")
}