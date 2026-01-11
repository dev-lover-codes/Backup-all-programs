/*You have an array of integers (nums).
Every element appears twice, except for one unique element 
that appears only once.
Your task is to find that single unique element.*/
#include <iostream>
#include <vector>
using namespace std;

int singleNumber(const vector<int>& nums) {
    int result = 0;
    for (int num : nums) {
        result ^= num;  // XOR each element
    }
    return result;  // result holds the single unique number
}

int main() {
    vector<int> nums1 = {2, 2, 1};
    cout << "Single number in nums1: " << singleNumber(nums1) << endl;

    vector<int> nums2 = {4, 1, 2, 1, 2};
    cout << "Single number in nums2: " << singleNumber(nums2) << endl;

    return 0;
}
/*
We can use the XOR bitwise operator (^) for this problem because:
XOR of a number with itself is 0: x ^ x = 0 and x ^ 0 ^ 1 = x .
XOR of a number with 0 is the number itself: x ^ 0 = x
XOR is commutative and associative, meaning order doesn't matter.
So, if we XOR all numbers in the array, pairs of duplicate numbers
will cancel out (because x ^ x = 0), and only the unique number will remain.

*/