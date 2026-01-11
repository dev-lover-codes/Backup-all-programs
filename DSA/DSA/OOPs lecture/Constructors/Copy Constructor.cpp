/*
A copy constructor makes one object exactly the same as another.
It is called when:
1. You create an object from another (e.g., Student s2 = s1;)
2. You pass an object by value to a function.
It ensures that the new object gets its own copy of the data.
*/
#include <iostream>
using namespace std;

class Student {
public:
    int roll;
    string name;

    // Parameterized constructor
    Student(int r, string n) {
        roll = r;
        name = n;
        cout << "Parameterized Constructor called!" << endl;
    }

    // Copy constructor
    Student(const Student &obj) {
        roll = obj.roll;
        name = obj.name;
        cout << "Copy Constructor called!" << endl;
    }

    void display() {
        cout << "Roll: " << roll << ", Name: " << name << endl;
    }
};

int main() {
    Student s1(10, "Bob");   // Calls parameterized constructor
    Student s2 = s1;         // Calls copy constructor

    cout << "\nDisplaying s1 details:" << endl;
    s1.display();

    cout << "\nDisplaying s2 details:" << endl;
    s2.display();

    return 0;
}


/*
In main():

Student s1(10, "Bob");   // Calls parameterized constructor
Student s2 = s1;         // Calls copy constructor
s2.display();            // Displays copied data

s1 is created using the parameterized constructor.
s2 is created as a copy of s1, so the copy constructor runs.
Then it displays s2’s details (which are the same as s1).
// Copy constructor
Student(const Student &obj) {
    roll = obj.roll;
    name = obj.name;
    cout << "Copy Constructor called!" << endl;
}

This constructor creates a new object (s2) as a copy of another object (s1).
obj is a reference to the existing object (s1)
The statement roll = obj.roll copies the roll number
The statement name = obj.name copies the name

*/
