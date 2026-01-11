/*
sequence is :-
1
2 1
3 2 1 
4 3 2 1 
5 4 3 2 1 
*/

#include <iostream>
using namespace std;
int main(){
    int n ; //using int because all rows and colums are int type and i & j also
    cout<< "enter for which sequence you want :- ";
    cin>> n ;
    for ( int i = 0 ; i <n ; i++ ){  // outer loop
               int num = n;
        for ( int j = 0 ; j < i+1 ; j++  ){ // inner loop --> condition for chr
            cout << num <<" ";
            num -= 1;
        }

        cout<<endl;
    }
}
