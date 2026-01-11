/*
question is make a square in which n collums are 
present with n no of columns are n and each column start 
with A and go to n 
n=4
A B C D 
A B C D 
A B C D 
A B C D 

*/

#include <iostream>
using namespace std;
int main(){
    int n ; //using int because all rows and colums are int type and i & j also
    cout<< "enter the value of n :- ";
    cin>> n ;
    for ( int i = 0 ; i <n ; i++ ){  // outer loop
          char chr = 'A';       //initiliation 
        for ( int j = 0 ; j < n ; j++ ){ // inner loop --> condition for chr
            cout << chr <<" ";
            chr += 1; //incremet in character value --> increment for chr
        }
        cout<<endl;
    }
}
//this is like a loop also in char chr here is
//  initilation in for loop condition and in last increment 