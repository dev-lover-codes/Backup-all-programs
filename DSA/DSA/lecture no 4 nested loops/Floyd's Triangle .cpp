/*
pattern like 
1
1 2
1 2 3 
1 2 3 4
*/ 
#include <iostream>
using namespace std;
int main(){
    int n ; //using int because all rows and colums are int type and i & j also
    cout<< "enter for which sequence you want :- ";
    cin>> n ;
    int num = 1;

    for ( int i = 0 ; i <n ; i++ ){  // outer loop
        for ( int j = 0 ; j < i+1 ; j++  ){ // inner loop --> condition for chr
            cout << num <<" ";
            num += 1;
        }

        cout<<endl;
    }
}
