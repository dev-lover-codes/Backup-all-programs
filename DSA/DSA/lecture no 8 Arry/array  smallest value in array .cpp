#include <iostream>
using namespace std;

int main() {
   int next[] = {32, 1, 32, 0, -1, -23, 2};
   int start = 5;
   int smallest = __INT_MAX__;

   for (int i = 0; i< start ; i++){
   //smallest = min (next[i],smallest);it can be used instead of if
     if (next[i] < smallest){
       /*
       logic behind __INT_MAX__: is to assign infinity value 
       to the smallest variable , condition is next[i] < smallest
       so every number present in the array will be smaller than
       infinity so if condition is true then smallest will be
       smallest = next[i]; means smallest will be the value of 
       next[i] and this value compare to the other and if the 
       smallest variable is lesser than to the next[i] varible
       then the smallest variable will be same because if condition false */
     }
   }cout << smallest<< endl;
}
