#include <iostream>
using namespace std;

// Function 1: Binary to Decimal using a FOR loop
int binaryToDecimalByFor(int binaryNum) {
    int ans = 0;
    int pow = 1;

    for (; binaryNum > 0; binaryNum = binaryNum / 10) {
        int digit = binaryNum % 10;
        ans = ans + (digit * pow);
        pow = pow * 2;
    }

    return ans;
}

// Function 2: Binary to Decimal using a WHILE loop
int binaryToDecimalByWhile(int binaryNum) {
    int ans = 0;
    int pow = 1;

    while (binaryNum > 0) {
        int digit = binaryNum % 10;
        ans = ans + (digit * pow);
        pow = pow * 2;
        binaryNum = binaryNum / 10;
    }

    return ans;
}

int main() {
    // Test: Convert binary numbers (in decimal form) 1 to 1010
    for (int i = 1; i <= 10; i++) {
        int binary = i;  // Treat i as a binary number written in decimal
        cout << "Binary: " << binary << " -> Decimal (for):   " << binaryToDecimalByFor(binary) << endl;
        cout << "Binary: " << binary << " -> Decimal (while): " << binaryToDecimalByWhile(binary) << endl;
        cout << "------------------------------------------" << endl;
    }

    return 0;
}
