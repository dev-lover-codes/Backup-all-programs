#include <iostream>
using namespace std;

void reverseArray(int arr[], int size) {
    int left = 0;
    int right = size - 1;
// approach :- using 2 pointer approach in this approach starting element 
// moving towards end and end element moving towards starting

    while (left < right) {
        // Swap elements at left and right
        int temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;

        // Move pointers
        left++;
        right--;
    }
}

int main() {
    int arr[] = {10, 20, 30, 40, 50};
    int size = sizeof(arr) / sizeof(arr[0]);

    cout << "Original array: ";
    for (int i = 0; i < size; i++) {
        cout << arr[i] << " ";
    }

    reverseArray(arr, size);

    cout << "\nReversed array: ";
    for (int i = 0; i < size; i++) {
        cout << arr[i] << " ";
    }

    return 0;
}
