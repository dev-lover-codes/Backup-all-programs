/*
#include<iostream>
using namespace std;
int main(){
    int n , sum ;
    cout<<"enter the value of n :- ";
    cin>> n ;
    for ( int i = 0 ; i <= n ; i++ ){
     sum += i;
    }
    cout<<"sum is :- "<< sum <<endl;
}

output:-
enter the value of n :- 4
sum is :- 779647085
becuase in here initiliation of sum not mention 
so it will take value of sum by memory 
*/
#include<iostream>
using namespace std;
int main(){
    int n, sum = 0;
    cout << "Enter the value of n: ";
    cin >> n;
    for (int i = 0; i <= n; i++) {
        sum += i;
/*      can also be used formula 
        sum = sum = n * (n + 1) / 2
*/
    }
    cout << "Sum is: " << sum << endl;
    return 0;
}
