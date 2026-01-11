#include <iostream>
using namespace std;

// Class creation: A class is a user-defined data type that can contain
// variables (called data members) and functions (called member functions).
class student { 
    public :
        // These are DATA MEMBERS (also called attributes or properties)
        // They represent the characteristics of a student object.
        int roll;          // Data member to store the student's roll number
        string name;       // Data member to store the student's name
        char group;        // Data member to store the group or section
        double percentage; // Data member to store the student's percentage

        /* Note: In this example, there are NO MEMBER FUNCTIONS defined inside
        the class. A member function would be a function that performs an
        operation on the data members (for example, to display or modify them).        
        Example (not in this code):
        void display() {
             cout << name << " " << roll << endl;
         } */
};

// The main function is the starting point of the program
int main (){
    // OBJECT CREATION:
    // 's1' is an object of class 'student'.
    // When you create an object, memory is allocated for all the data members
    // of that class, and you can access them using the dot (.) operator.
    student s1;  

    // Here we assign values to the data members of the object 's1'
    s1.name = "papa";
    s1.roll = 23;
    s1.group = 'A';
    s1.percentage = 90;

    // Accessing and printing data members using the dot operator
    cout << s1.name << "\n" 
         << s1.roll << "\n" 
         << s1.group << "\n" 
         << s1.percentage << "\n" << endl;

    return 0;    
}

// Explanation summary:
// 1. Class: A blueprint for creating objects.
// 2. Object: A specific instance of a class (e.g., 's1').
// 3. Data members: Variables inside the class that store data (roll, name, group, percentage).
// 4. Member functions: Functions inside the class that operate on data members (none used here).
