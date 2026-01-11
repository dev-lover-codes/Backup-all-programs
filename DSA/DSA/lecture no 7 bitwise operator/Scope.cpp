//understand of local and global variables
#include <iostream>
using namespace std;
// Global variable
int number = 100;

void display() {
    // Local variable with the same name as global variable
    int number = 50;
    // they are only accessable indside the {} outer access not possible

    cout << "Local number: " << number << std::endl;  // refers to local variable
    cout << "Global number: " << ::number << std::endl; // ::number refers to global variable
}

int main() {
    display();

    cout << "Global number in main: " << number << std::endl; // refers to global variable
    // they accessable in whiole code 

    return 0;
}
