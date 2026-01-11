console.log("lecture 2 js all type of operators");
let a=10 ,b=20;
console.log("a=",a);
console.log("b=",b);1
console.log("artihmatic operators");
console.log("a+b=",a+b);//artihmatic operators
console.log("a-b=",a-b);
console.log("a*b=",a*b);
console.log("a/b=",a/b);
console.log("a%b=",a%b);
console.log("a**b=",a**b);
console.log("increment and decrement operators");
console.log("a++=",a++);
console.log("++a=",++a);
console.log("a--=",a--);
console.log("--a=",--a);
console.log("assignment operators");
console.log("a==b=",a==b);
console.log("a!=b=",a!=b);
console.log("a>b=",a>b);
console.log("a<b=",a<b);
console.log("a>=b=",a>=b);
console.log("a<=b=",a<=b);
console.log("logical operators");
//comparison operators they are give true and false value
console.log("a&&b=",a&&b);
console.log("a||b=",a||b);
console.log("!a=",!a);
console.log("!b=",!b);
console.log("bitwise operators");
console.log("a&b and operator=",a&b);
console.log("a|b= OR operator",a|b);
console.log("a^b= XOR operator",a^b);
console.log("~a= NOT operator",~a);
console.log("a<<b= left shift operator",a<<b);
console.log("a>>b= right shift operator",a>>b);
console.log("a>>>b= zero fill right shift operator",a>>>b);
console.log("typeof operator");
console.log("typeof a=",typeof a);
console.log("typeof b=",typeof b);
console.log("typeof 'hello'=",typeof 'hello');
console.log("typeof true=",typeof true);
console.log("typeof undefined=",typeof undefined);
console.log("typeof null=",typeof null);
console.log("typeof NaN=",typeof NaN);
console.log("typeof {}=",typeof {});
console.log("typeof []=",typeof []);
console.log("typeof function(){}=",typeof function(){});
console.log("typeof Symbol()=",typeof Symbol());
console.log("typeof new Date()=",typeof new Date());
console.log("typeof new Error()=",typeof new Error());
console.log("typeof new RegExp()=",typeof new RegExp());
console.log("typeof new Set()=",typeof new Set());
console.log("typeof new Map()=",typeof new Map());
console.log("typeof new WeakSet()=",typeof new WeakSet());
console.log("typeof new WeakMap()=",typeof new WeakMap());
console.log("typeof new Promise()=",typeof new Promise());

console.log("conditional (ternary) operator");
let c = (a > b) ? "a is greater" : "b is greater";
console.log(c);
console.log("comma operator");
let d = (a = 5, b = 10, a + b);
console.log(d); // Output: 15
console.log("void operator");
function myFunction() {
    return "Hello";
}
console.log(void myFunction()); // Output: undefined
console.log("delete operator");
let obj = { name: "John", age: 30 };
console.log(delete obj.age); // Output: true
console.log(obj); // Output: { name: "John" }   
console.log("in operator");
console.log("name" in obj); // Output: true
console.log("age" in obj); // Output: false
console.log("instanceof operator");
let date = new Date();
console.log(date instanceof Date); // Output: true
console.log(date instanceof Object); // Output: true
console.log(date instanceof Array); // Output: false
console.log("new operator");
function Person(name, age) {
    this.name = name;
    this.age = age;
}
let person = new Person("John", 30);
console.log(person); // Output: Person { name: 'John', age: 30 }
console.log("spread operator");
let arr1 = [1, 2, 3];
let arr2 = [...arr1, 4, 5, 6];
console.log(arr2); // Output: [1, 2, 3, 4, 5, 6]
console.log("rest operator");
function sum(...numbers) {
    return numbers.reduce((acc, curr) => acc + curr, 0);
}
console.log(sum(1, 2, 3, 4, 5)); // Output: 15
console.log("optional chaining operator");
let user = {
    name: "John",
    address: {
        city: "New York",
        state: "NY"
    }
};
console.log(user?.address?.state); // Output: "NY"
console.log(user?.contact?.phone); // Output: undefined
console.log("nullish coalescing operator");
let foo = null ?? "default value";
console.log(foo); // Output: "default value"
let bar = "hello" ?? "default value";
console.log(bar); // Output: "hello"  
console.log("exponentiation operator");
let base = 2;
let exponent = 3;
let result = base ** exponent;
console.log(result); // Output: 8
console.log("bigint operator");
let bigIntNum = 9007199254741991n + 10n;
console.log(bigIntNum); // Output: 9007199254742001n
console.log("globalThis operator");
console.log(globalThis === window); // Output: true (in browser environment)
console.log(globalThis === global); // Output: true (in Node.js environment)