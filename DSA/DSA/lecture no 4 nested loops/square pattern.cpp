/*
question is make a square in which n collums are 
present with n no of columns and each column start with 
1 to n example:- 
n=4
1 2 3 4 
1 2 3 4 
1 2 3 4 
1 2 3 4 
*/

#include <iostream>
using namespace std;
int main(){
    int n ;
    cout<< "enter the value of n :- ";
    cin>> n ;
    for ( int i = 1 ; i <=n ; i++ ){  // outer loop
        for ( int j = 1 ; j <= n ; j++ ){ // inner loop 
            cout << "*" <<" ";
        }
        cout<<endl;
    }
}
/*
logic behind this is first outer loop will run on first time if the for 
loop executed so in body  section inner loop is
 present and this is execute every time when the condition of first loop
  is satisfy , after completion of body we write cout outside the inner loop 
  but inside the outer loop which is endl it will be change second line in 
  everytime of loop execution but first body is complete 
which is inner loop . the execution of program will be do from top to buttom approach 
*/