#include <iostream>
using namespace std;
class Student {
public:
    int roll;
    string name;
    // Default constructor (no parameters)
    Student() {
        roll = 101;          // internally assigning values
        name = "DefaultName"; // internally assigning values
        cout << "Default Constructor called!" << endl;
    }

    void display() {
        cout << "Roll: " << roll << ", Name: " << name << endl;
    }
};
int main() {
    Student s; // no parameters passed
    s.display();
    return 0;
}
/*
default constructor:- these do not pass any parameters from outside when creating the object. 
You don’t pass any parameters to a default constructor. or not your create.
But the constructor can still assign its own default values to the object’s members.
*/
