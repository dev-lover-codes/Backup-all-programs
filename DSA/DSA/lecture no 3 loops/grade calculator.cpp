// This line includes the iostream library, which allows for input and output operations.
#include <iostream>
// This line allows us to use names for objects and variables from the standard library.
using namespace std;

// This is the main function where the program execution begins.
int main() {
    // These lines declare integer variables to store the marks of 5 subjects.
    int a,b,c,d,e;
    cout<<"english marks:- ";
    cin>>a;
    cout<<"hindi marks:- ";
    cin>>b;
    cout<<"maths marks :- ";
    cin>>c;
    cout<<"science marks :- ";
    cin>>d;
    cout<<"social marks :- ";
    cin>>e;
    int f=a+b+c+d+e;
    // This line calculates the percentage from the total marks.
    double percentage =(f/500.0)*100;
    // This line prints the calculated percentage.
    cout<<"percentage is :- "<<percentage<<"%"<<endl;
    /* 
    This if statement has incorrect logic. 
    It will only check the last variable 'e' if it is less than or equal to 100.
    To check all variables, you should use the '&&' (AND) or '||' (OR) operators.
    For example: if (a > 100 || b > 100 || c > 100 || d > 100 || e > 100)
    */
    /*( a,b,c,d,e <= 100) only evaluates the last expression (e <= 100). So it doesn’t validate all 5 subjects.*/
    if (a > 100 || b > 100 || c > 100 || d > 100 || e > 100) {//doubel || shows and 
        cout << "Invalid marks entered. Each subject should be ≤ 100." << endl;
           return 0;
    }
    // This if-else statement checks if the student has passed or failed.
    if (percentage >= 40){
        cout<<"Result: Pass"<<endl;
    }
    else{
        cout<<"Result: Fail"<<endl;
    }

    // This if-else if ladder assigns a grade based on the percentage.
    if (percentage >= 90){
        cout<<"Grade is A+";
    }
    else if (percentage >= 80)
    {
        cout<<"Grade is A";
    
    }
    else if (percentage >= 70){
        cout<<"Grade is B";
    }
    else if (percentage >= 60){
        cout<<"Grade is C";
    }
    else if (percentage >= 40){
        cout<<"Grade is D";
    }
    else {
        cout<<"Grade is E";
    }
    // This line indicates that the program has executed successfully.
    return 0;
}
