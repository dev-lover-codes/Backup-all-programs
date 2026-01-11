// calculating the sum of digits of a number using a function.

#include <iostream>
using namespace std;

int sumOfDigits(int num) {
    int digSum = 0;

    for (num; num > 0; num /= 10) { //initilation here is not declear because 
        //num value is fixed from user or initilise by user
        int lastDig = num % 10;
        digSum += lastDig;
    }

    return digSum;
}

int main() {
    int userInput;
    cout << "Enter a number: ";
    cin >> userInput;

    cout << "Sum of digits = " << sumOfDigits(userInput) << endl;

    return 0;
}
