/*

pattern is :-
A
B B 
C C C 
D D D D 
*/

#include <iostream>
using namespace std;
int main(){
    int n ; //using int because all rows and colums are int type and i & j also
    cout<< "enter for which sequence you want :- ";
    cin>> n ;
    char chr = 'A';//initiliation 

    for ( int i = 0 ; i <n ; i++ ){  // outer loop
               
        for ( int j = 0 ; j < i+1 ; j++ ){ // inner loop --> condition for chr
            cout << chr <<" ";
        }
        chr += 1; //incremet in character value --> increment for chr

        cout<<endl;
    }
}
//for reading the code go with line by line 