#include <iostream>
using namespace std;
// this whole is the linear search method
int linearSearch(int arr[], int sz, int target) {
    for (int i = 0; i < sz; i++) {
        if (arr[i] == target) { // FOUND
            return i;// if any condition true so this value give 
        }
    }
    return -1; // NOT FOUND
}

int main() {
    int arr[] = {4, 2, 7, 8, 1, 2, 5};
    int sz = 7;
    int target = 8;

    cout << linearSearch(arr, sz, target) << endl;
    // all arr, sz,target are already defined in the main function
    // so we can call the linearSearch function in the main function
     return 0;
}
