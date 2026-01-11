#include<iostream>
using namespace std;
int main (){
    int a , sum , oddsum ;
    sum = 0 ;
    oddsum = 0;
    cout << "enter the no:- ";
    cin >> a ;
    for ( int i = 0; i <= a ; i++ ){
        if (i % 2 ==0 ){
            sum += i;
        }else if (i % 2 != 0){
                oddsum += i;
// think to be remember is else if must be written after if } .                
        }
        }
cout<<"sum of even numbers:- "<<sum<<endl<<"sun of odd numbers:- "<< oddsum<<endl;
return 0;

}

