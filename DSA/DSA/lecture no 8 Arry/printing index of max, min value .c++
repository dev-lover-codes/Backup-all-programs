#include <iostream>
#include <climits>  // For INT_MIN and INT_MAX

using namespace std;

int main() {
    int next[] = {32, 1, 32, 0, -1, -23, 2};
    int size = sizeof(next) / sizeof(next[0]);
/*
sizeof(next) gives the total number of bytes used by the array.
sizeof(next[0]) gives the size of one element (the first one).
Dividing them gives you the number of elements in the array.
example :- 
int next[] = {32, 1, 32, 0, -1, -23, 2};
sizeof(next) = 7 elements × 4 bytes each = 28 bytes
sizeof(next[0]) = 4 bytes
size = 28 / 4 = 7
*/
    int smallest = INT_MAX;
    int largest = INT_MIN;
    int smallestIndex = -1;
    int largestIndex = -1;
    /*
    Why initialize smallestIndex and largestIndex with -1?
    Initially, you haven’t checked any elements.
By setting smallestIndex = -1, you create a clearly invalid index that shows "nothing found yet."
After the first comparison, it will be updated to a valid index.
after first comparison it will be updated to a valid index which is -1+1=0
so smallestIndex and largestIndex will be 0 after first comparison
    */

    for (int i = 0; i < size; i++) {
        if (next[i] > largest) {
            largest = next[i];
            largestIndex = i;
        }
        if (next[i] < smallest) {
            smallest = next[i];
            smallestIndex = i;
        }
    }

    cout << "Index of largest value: " << largestIndex << endl;
    cout << "Index of smallest value: " << smallestIndex << endl;
}
