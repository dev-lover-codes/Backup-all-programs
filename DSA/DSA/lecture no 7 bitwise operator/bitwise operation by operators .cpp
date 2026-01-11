#include <iostream>
using namespace std;

int main() {
    int a, b;

    // Taking input
    cout << "Enter first integer (a): ";
    cin >> a;
    cout << "Enter second integer (b): ";
    cin >> b;

    cout << "\n--- Bitwise Operations ---\n";

    // first of all convert both numbers into binary then do all

    // Bitwise AND
    // Compares each bit of a and b.
    // If both bits are 1, result is 1; else 0.
    cout << "a & b = " << (a & b) << "   // Bitwise AND\n";

    // Bitwise OR
    // Compares each bit of a and b.
    // If at least one bit is 1, result is 1; else 0.
    cout << "a | b = " << (a | b) << "   // Bitwise OR\n";

    // Bitwise XOR
    // Compares each bit of a and b.
    // If bits are different, result is 1; if same, result is 0.
    cout << "a ^ b = " << (a ^ b) << "   // Bitwise XOR\n";

    // Bitwise NOT (1's complement)
    // Flips all the bits: 0 becomes 1, 1 becomes 0.
    // Note: Also changes sign in signed integers (due to 2's complement).
    cout << "~a = " << (~a) << "         // Bitwise NOT of a\n";
    cout << "~b = " << (~b) << "         // Bitwise NOT of b\n";

    // Left Shift
    // Shifts all bits of a one position to the left.
    // Equivalent to multiplying by 2.
    cout << "a << 1 = " << (a << 1) << "    // Left shift a by 1 bit (a * 2)\n";
    cout << "b << 1 = " << (b << 1) << "    // Left shift b by 1 bit (b * 2)\n";

    // Right Shift
    // Shifts all bits of a one position to the right.
    // Equivalent to dividing by 2 (for positive numbers).
    cout << "a >> 1 = " << (a >> 1) << "    // Right shift a by 1 bit (a / 2)\n";
    cout << "b >> 1 = " << (b >> 1) << "    // Right shift b by 1 bit (b / 2)\n";

    return 0;
}
/*
| Operator    | Name | Symbol                   |
| ----------- | ---- | ------------------------ |
| Left Shift  | `<<` | Shifts bits to the left  |
| Right Shift | `>>` | Shifts bits to the right |

1. Left Shift (<<)
Each left shift by 1 position is equivalent to multiplying by 2.
explanation :-
Original:  00000101   (5) shifting 1 to left side and add zero at the place it
Shifted:   00001010   (10)

2. Right Shift (>>)
Each right shift by 1 is equivalent to dividing by 2 (for positive numbers).
int a = 8;     // Binary: 00001000
int result = a >> 1;  // Binary: 00000100 (which is 4)


*/