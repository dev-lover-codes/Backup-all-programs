#include <iostream>
using namespace std;

int main() {
    signed int a = -5;          // signed int can hold negative numbers
    unsigned int b = 5;         // unsigned int can only hold zero or positive numbers

    cout << "Signed a: " << a << endl;       // Output: -5
    cout << "Unsigned b: " << b << endl;     // Output: 5

    // Assigning a negative value to unsigned int causes wrap-around
    unsigned int c = -10;
    cout << "Unsigned c (assigned -10): " << c << endl; 

    return 0;
}

/*
| Aspect                | Signed Variable                                                                                  | Unsigned Variable                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| **Definition**        | Can hold **both positive and negative** values (including zero)                                  | Can hold **only non-negative** values (zero and positive)                     |
| **Range**             | Typically ranges from `-(2^(n-1))` to `2^(n-1) - 1` (where n is number of bits)                  | Typically ranges from `0` to `2^n - 1`                                        |
| **Default behavior**  | Most integer types like `int` are signed by default                                              | Must be explicitly declared using `unsigned` keyword (e.g., `unsigned int`)   |
| **Use case**          | When you need to represent negative numbers as well                                              | When you know the value will never be negative (e.g., counts, sizes, indexes) |
| **Example**           | `int a = -10;`                                                                                   | `unsigned int b = 10;`                                                        |
| **Overflow behavior** | Overflowing beyond max positive or min negative causes undefined behavior (usually wraps around) | Values wrap around from max back to 0 when exceeding the range                |

*/