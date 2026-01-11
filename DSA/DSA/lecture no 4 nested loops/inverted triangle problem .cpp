/*
pattern is 
1 1 1 1 
  2 2 2
    3 3
      4
*/
#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "Enter the number of rows: ";
    cin >> n;

    for (int i = 1; i <= n; i++) {// Outer loop for rows
        // Print leading spaces
        for (int space = 1; space < i; space++) {
            cout << "  ";// two spaces for alignment
        }

        // Print numbers
        for (int j = n; j >= i; j--) {
            cout << i << " ";
        }

        cout << endl;// Move to next line
    }

    return 0;
}
