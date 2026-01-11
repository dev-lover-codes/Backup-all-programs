#include <iostream>  // For input and output using cout and endl
#include <vector>    // To use the vector container from the C++ Standard Library

using namespace std; // So we don't have to prefix std:: before standard objects like cout and vector

int main() {
    // Create a vector of integers with 5 elements, all initialized to 0
    vector<int> vec(5, 0); 
    vector<int> vec2{1, 2, 3, 4, 5}; // Create and initialize vec2 with values 1 to 5

    // Output each element of the vector on a new line
    cout << vec[0] << endl; // Prints 0 (first element)
    cout << vec[1] << endl; // Prints 0 (second element)
    cout << vec[2] << endl; // Prints 0 (third element)
    cout << vec[3] << endl; // Prints 0 (fourth element)
    cout << vec[4] << endl; // Prints 0 (fifth element)
    cout <<"for second vector \n" << vec2[0] << endl; // Prints 1 (first element of vec2)
    cout << vec2[1] << endl; // Prints 2 (second element of vec2)
    cout << vec2[2] << endl; // Prints 3 (third element of vec2)
    cout << vec2[3] << endl; // Prints 4 (fourth element of vec2)
    cout << vec2[4] << endl; // Prints 5 (fifth element of vec2)

    return 0; // Indicate that the program ended successfully
}
