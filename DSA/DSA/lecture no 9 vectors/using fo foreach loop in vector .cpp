/*
for (type iterator_name : vector_name) {
// code to execute for each element
| Feature            | Traditional `for` loop                          | Range-based `for` loop (`for-each`)           |
| ------------------ | ----------------------------------------------- | --------------------------------------------- |
| **Initialization** | You manually create a loop counter: `int i = 0` | Automatically starts at the first element     |
| **Condition**      | You set a condition like `i < vec.size()`       | Automatically ends at the last element        |
| **Increment**      | You manually increment with `i++`               | Internally moves to next element              |
| **Accessing data** | You use index: `vec[i]`                         | Access directly with element variable (`num`) |

Range-based for loop:-

for (char num : v) {
    cout << num << " ";
}

No need to write initialization, condition, or increment.
It automatically:
Starts at the first element
Stops at the last
Iterates through each value and gives it to num
}
*/
#include <iostream>
#include <vector>
using namespace std;
int main() {
    vector<char> v = {'a', 'b', 'c', 'd', 'e'};
    cout << "Iterating through vector: \n";
    for (char num : v) {
        cout << num << " \n";
    }
    return 0;
}