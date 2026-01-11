#include <iostream>     // For input and output (cout, endl)
#include <vector>       // For using the vector container
using namespace std;    // Avoids the need to prefix std:: before standard names

// Function to display the contents of a vector,
// along with its size and capacity.
// It takes a constant reference to avoid copying the vector.
void printVectorInfo(const vector<char>& v) {
    cout << "Vector elements: ";
    
    // Range-based for loop to print each character in the vector
    for (char ch : v) {
        cout << ch << " ";
    }
    cout << endl;

    // Display number of elements currently in the vector
    cout << "Size of vector: " << v.size() << endl;

    // Display capacity: how many elements it can hold before reallocating
    cout << "Capacity of vector: " << v.capacity() << endl;
}

int main() {
    // Step 1: Initialize the vector with 5 characters
    vector<char> v = {'a', 'b', 'c', 'd', 'e'};
    
    // Step 2: Print initial state of the vector
    cout << "Initial vector state:\n";
    printVectorInfo(v);

    // Step 3: Add a new element 'f' to the end of the vector
    v.push_back('f');
    cout << "\nAfter push_back('f'):\n";
    printVectorInfo(v);  // Vector should now contain 6 elements

    // Step 4: Remove the last element using pop_back()
    v.pop_back();
    cout << "\nAfter pop_back():\n";
    printVectorInfo(v);  // Vector should be back to 5 elements

    // Step 5: Clear the entire vector (removes all elements)
    v.clear();
    cout << "\nAfter clear():\n";
    printVectorInfo(v);  // Vector size becomes 0, capacity remains

    return 0;  // Indicate successful program termination
}   
/*🔹 size()
Returns the number of elements currently in the vector.
🔹 capacity()
Returns the number of elements the vector can hold before needing to allocate more memory.

Notes: doubling strategy
Initially, when you initialize the vector with 5 elements, size == capacity == 5.
If you add elements using v.push_back(), the vector may increase its capacity in to double own capacity, often doubling it to minimize reallocations.

| Push Back Count | Size | Capacity |
| --------------- | ---- | -------- |
| 0               | 0    | 0        |
| 1               | 1    | 1        |
| 2               | 2    | 2        |
| 3               | 3    | 4        |
| 5               | 5    | 8        |
| 9               | 9    | 16       |
This doubling strategy helps optimize performance by reducing the number of memory allocations needed as the vector grows.
*/
