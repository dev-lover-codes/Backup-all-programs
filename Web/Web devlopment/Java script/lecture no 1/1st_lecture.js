// java script is also dynamic typed language
console.log("not your type of js");
console.log("js is dynamic typed language");

let age = 25;
age = "twenty-five";
my=null;
y=undefined;
floatNum=5.67;
console.log(age);
console.log(age);   // no error will be shown because js is dynamic typed language

// but in typescript it will show error
// let ageTS: number = 25;
// ageTS = "twenty-five";  // error will be shown because typescript is static typed language
/*
| Value       | Meaning                                            | Type                                         |
| ----------- | -------------------------------------------------- | -------------------------------------------- |
| `undefined` | A variable **declared but not assigned** any value | `"undefined"`                                |
| `null`      | A variable **explicitly set to have no value**     | `"object"` (this is a historical bug in JS!) |
*/
// for creating object 
// key : value 
const student = {
  fullName: "Rahul Kumar",
  age: 20,
  cgpa: 8.2,
  isPass: true
};
console.log(student);
console.log(typeof student); // this is used for finding the type of variable
console.log(student.fullName);// accessing the property of object
console.log(student["age"]); // another way to access the property of object
// changing of const object key value
student.cgpa = 8.5;
console.log(student.cgpa);
// adding new key to const object
student.section = "A";
console.log(student.section);