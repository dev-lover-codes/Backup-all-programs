#include <iostream>
using namespace std;
class bankai {
    public :
    string name;
    private:
    int age;
    protected:
    float salary;
};
int main() {
    bankai b;
    b.name = "Ichigo Kurosaki";
    b.salary= 700000;
    b.age = 21;
     // Allowed: name is public
    // b.age = 17; // Not Allowed: age is private
    // b.salary = 50000.0; // Not Allowed: salary is protected
    cout << "Name: " << b.name << endl;
    return 0;
}
