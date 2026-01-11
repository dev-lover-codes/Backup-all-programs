#include<iostream>
using namespace std;
int main(){
    char ch;
    cout<<"enter the letter:- ";
    cin>>ch;
    if (ch >= 'A' && ch <= 'Z'){
        /* it can also make using ASCIl numbers like 
        if (ch >= 65 && ch <= 90) this is done by using implisit cinversion
        */
        cout<<"letter is uppercase\n";
    }
    else {
        cout<<"letter is lowercase\n";
    }
}
/*
in chr only one letter can store this letter
is store in ASCIL letters or in binary letters
so by comparing the values of ASCIL letters can 
we check they are small or not . 
| Type           | Character Range | ASCII Range |
| -------------- | --------------- | ----------- |
| Capital letter | 'A' to 'Z'      | 65 to 90    |
| Small letter   | 'a' to 'z'      | 97 to 122   |

*/