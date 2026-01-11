#include <iostream>
#include <climits>  // For INT_MIN and INT_MAX

using namespace std;

int main() {
    int next[] = {32, 1, 32, 0, -1, -23, 2};
    int start = 7;  // You should iterate over all 7 elements in the array
    int smallest = INT_MAX;  // Correct constant for maximum integer value
    int largest = INT_MIN;   // Correct constant for minimum integer value

    for (int i = 0; i < start; i++) {
        largest = max(next[i], largest);
        smallest = min(next[i], smallest);
    }

    cout << "Largest is: " << largest << endl;   // Corrected typo
    cout << "Smallest is: " << smallest << endl;
}
