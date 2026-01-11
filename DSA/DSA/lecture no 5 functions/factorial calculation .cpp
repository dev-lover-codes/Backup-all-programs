#include <iostream>
using namespace std;
// Function to calculate sum of first n natural numbers
long sum( int n) {
    long factorial = 1;
    for (long i=1; i<=n ; i ++ ){
      factorial *=i;
    }
    return factorial ;
}
int main() {
    cout << "Enter the value of factorial number: ";
    int x;
    cin >> x;

    long result = sum(x);  // Call the function and store the result
    cout << "The factorial is: " << result << endl;  // Print the result
    return 0;
}
