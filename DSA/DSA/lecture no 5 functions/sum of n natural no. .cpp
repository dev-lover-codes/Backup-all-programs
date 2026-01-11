#include <iostream>
#include <utility> // for std::pair for holding three values
// #include <tuple>    // for std::tuple and std::make_tuple

/*
The header <utility> defines std::pair, std::make_pair, etc.
But many other headers like <iostream>, <string>, or <vector> 
may already include it indirectly.
| Question                          | Answer                         |
| --------------------------------- | ------------------------------ |
| Is `#include <utility>` required? | ❌ Not always — but...          |
| Should I include it anyway?       | ✅ Yes — for clarity and safety |

*/
using namespace std;

pair<int, int> sum(int n) { //using of two int pair is done to return two values
/*
| Code               | Meaning                          |
| ------------------ | -------------------------------- |
| `pair<int, int>`   | A container for two `int` values |
| `.first`           | Access the first value           |
| `.second`          | Access the second value          |
| `make_pair(5, 10)` | Create a pair with 5 and 10      |

*/
    int formulaSum = n * (n + 1) / 2;
    int loopSum = 0;
    for (int i = 0; i <= n; i++) {
        loopSum += i;
    }
    return make_pair(formulaSum, loopSum);//for returning two values
    // for returning three values use make_tuple
}

int main() {
    cout << "Enter the value of n: ";
    int x;
    cin >> x;

    pair<int, int> result = sum(x); //pair<int , int > result for result.first and result.second
    // for thiple values use tie
    cout << "Formula-based sum: " << result.first << endl;
    cout << "Loop-based sum: " << result.second << endl;

    return 0;
}


    /*
    construction:- of this is first we define a function which is int sum
    then we defining a parameter1_type parameter1_name which is ( int , n)
    then we make a another variable which is int total , this total contain 
    the formula of calculating the sum of numbers and in last return value,
    it means which value will be return when calling a funcion.
    defining a another varibale x in int main function and in final int result 
    and calling fnnction which is sum ( ) any value present in this bracktes 
    will be passed to the function value which is n.
    working :- when user give input in x it will be go to the caling function 
    varible which is n , this n perform task which defined in the body of 
    function in final which value is return to the int main after calling function
    is decided by return , here retun is total varible it means function return the 
    value of total after calling a function , this value replace the calling replace 
    calling function which is sum (x) and return which value is total is .
    */