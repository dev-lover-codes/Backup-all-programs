#include <iostream>
using namespace std;
void changeX(int x) {
    x = 2 * x;  // This changes the local copy of x
    cout << "Inside changeX: x = " << x << endl;
}

int main() {
    int x = 5;  // This is the original x in main()
    changeX(x); // Pass x to the function changeX
    cout << "In main: x = " << x << endl;  // This will still be 5
    return 0;
}
/*
1.Passing Variables to Functions (Pass-by-Value):
When we call the function changeX(x), we're giving the
 value of x from main() to changeX().
Important: The function gets a copy of x, not the actual 
variable from main(). So any changes made inside the function
 won't affect x in main().

2.Inside the Function:
The function changeX() gets a copy of x (which is 5) and 
changes it by multiplying it by 2.
But since the function only has a copy, this change 
does not affect the x in main().
*/