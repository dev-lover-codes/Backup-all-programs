#include <iostream>
using namespace std;

// Convert decimal to binary using a for loop (acting like a while loop)
int decbinarybyforloop(int decbyforloop) {
    int ans = 0;
    int pow = 1;

    for (; decbyforloop > 0; decbyforloop = decbyforloop / 2) {
        int rem = decbyforloop % 2;
        ans = ans + (rem * pow);
        pow = pow * 10;
    }
    

    return ans; // return the binary result
}
/*
logic behind the decimal to binary is present into the pdf here just understand the code 
first create a function return_type function_name(parameter1_type parameter1_name) which is
int decbinarybyforloop(int decbyforloop) then first two important first is ans , which is starting 
with zero and 2nd is power which is start with 1 (these two build the base ) then sertup the for 
loop , first initilisation which is initilise in first line in parameter name in function but if 
wnat to initilise here it is also fine like     for ( decbyforloop; decbyforloop > 0; decbyforloop = decbyforloop / 2)
then finding remender using rem = decbyforloop % 2; and store it into ans , ans = ans + (rem * pow)
ans contain rem which is store rem , and pow in the starting of the loop power is given 1  and in the 
last of the loop pow = pow * 10; it in initially pow is 1 so in here power is :- 1*10 so here pow is 10 now , 
then increment which is provide in for loop which is decbyforloop / 2 , using int for it means it is 
automatically convert into a integer value . then in 2nd time loop checking confdition decbyforloop > 0
and start loop again in this time calculating remender again then this remender will be store in ans , and ans
in this time not equal to zero it must contain prevous value in which calculate in prevous loop , and the power in this 
time also 10 (cause expalin above) then incremet in power again which is pow=pow*10 , prevously 
pow=10 , so at this pow =10*10 =100 this 100 pow used in 3rd loop and after this incremt in value 
decbyforloop / 2; and this complete 2nd itration . and soon  return ans it means which 
value finals gives to the main finction after calling the decbinarybyforloop in int main function is the retun value 
which is ans means it will give the value of ans 
*/
// Convert decimal to binary using while loop
int decToBinary(int decNum) {
    int ans = 0, pow = 1;

    while (decNum > 0) {
        int rem = decNum % 2;
        decNum /= 2;
        ans += (rem * pow);
        pow *= 10;
    }

    return ans;  // returns binary as integer
}
/*
all thigs are same just change in while (decNum > 0)  this is condition ,decNum /= 2; updation , then ans 
which is same logic build then pow which also do same function here in the end , return ans it means which 
value finals gives to the main finction after calling the decToBinary in int main function is the retun value 
which is ans means it will give the value of ans 



*/

int main() {
    int n ;
    cout<<"enter the number :- ";
    cin>> n;
    // Print binary of numbers from 1 to 10
    for (int i = 1; i <= n; i++) {
        cout << "Decimal: " << i << " -> Binary (while): " << decToBinary(i) << endl;
        cout << "Decimal: " << i << " -> Binary (for):   " << decbinarybyforloop(i) << endl;
        cout << "------------------------------" << endl;
    }

    return 0;
}
