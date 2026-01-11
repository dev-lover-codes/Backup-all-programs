#include <iostream>
using namespace std;
// Function that returns the sum of two numbers
int add(int a, int b) {
    return a + b;  // This returns the result (an int)
}

int main() {
    cout<<"enter the value of a :- \n";
    int a;
    cin>>a;
    cout<<"enter the value of b :- \n";
    int b ;
    cin>>b;

    int result = add(a, b);  // Call the function and store the returned value
    cout << "The sum is: " << result <<endl;  // Print the result
    return 0;
}
/*
Why do I need to define int a and int b again in 
main() when I already defined them in the add function?
Short Answer:
Because variables defined inside a function are local to that function. That means:
The a and b inside main() are different from the a and b inside add().
Each function has its own scope (its own workspace for variables).
You must declare variables in the function where you want to use them
These a and b are completely separate from the ones in add() — they 
just happen to have the same names.
means if i change the values a and b from user input to x and y so 
it will be function well and same as they work.
    cout<<"enter the value of a :- \n";
    int x;
    cin>>x;
    cout<<"enter the value of b :- \n";
    int y ;
    cin>>y;

    int result = add(x, y);  
*/