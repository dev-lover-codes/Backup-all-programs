#include<iostream>
using namespace std;

class H {
private:
    int a;
protected:
    int b;
public:
    int c;

    void setdata(int a1, int b1, int c1) {
        a = a1;
        b = b1;
        c = c1;
    }

    void getdata() {
        cout << "The value of a is: " << a << endl;
        cout << "The value of b is: " << b << endl;
        cout << "The value of c is: " << c << endl;
    }

    int sum() {        // <-- New function that RETURNS something
        return a + b + c;
    }
};
int main() {
    H obj;
    obj.setdata(10, 20, 30);
    obj.getdata();

    int result = obj.sum();   // Call the function and store the return value
    cout << "The sum of a, b, and c is: " << result << endl;

    return 0;
}


/*
| Access Specifier | Variable | Meaning                                                                                              |
| ---------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `private:`       | `int a;` | Can **only** be accessed inside the class. Not visible to `main()` or derived classes.               |
| `protected:`     | `int b;` | Can be accessed **inside the class** and by **derived classes**, but **not** directly from `main()`. |
| `public:`        | `int c;` | Can be accessed **anywhere** (from outside the class, in `main()`, etc.)                             |

(a) Setter function:- 
void setdata(int a1, int b1, int c1) 
    a = a1;
    b = b1;
    c = c1;
This function sets values for the private, protected, and public members:
Even though a and b are not accessible outside the class, they can be modified inside it.
So setdata() provides a safe way to set their values.
(b) Getter function:-
void getdata() {
    cout << "The value of a is: " << a << endl;
    cout << "The value of b is: " << b << endl;
    cout << "The value of c is: " << c << endl;
}
A getter is a function that gets or retrieves the value of private/protected variables of the class. which are setted by the setter function.
It can access private and protected members since it is part of the class.
The main() function:- 
int main() {
    H obj;
    // obj.a = 10; // Error: 'a' is private
    // obj.b = 20; // Error: 'b' is protected
    obj.c = 30;   // Allowed: 'c' is public
    obj.setdata(10, 20, 30); // Setting values using setter function
    obj.getdata(); // Getting values using getter function
    return 0;
}
/* Explanation:-
H obj;
Creates an object obj of class H.

obj.a = 10; and obj.b = 20;
These lines are commented out because they would cause errors —
you cannot access private or protected members directly.

obj.c = 30;
This is allowed, since c is public.

obj.setdata(10, 20, 30);
Calls the setter function to assign: a = 10, b = 20, c = 30.

NOTE concepts:- 
1.  Why the function is void?
void means :- “This function does not return any value. OR it does not give any value back to the calling code
(like main() in this case)
in this code :- 
void getdata() {
    cout << "The value of a is: " << a << endl;
    cout << "The value of b is: " << b << endl;
    cout << "The value of c is: " << c << endl;
}
A getter is a function that gets or retrieves the value of private/protected variables of
the class. which are setted by the setter function.Since it doesn’t need to give a value 
back to the caller (main()), we make it void.
2.  but in here:- 
  int sum() {        // <-- New function that RETURNS something
        return a + b + c;
    }
we want to return the sum of a, b, and c. to the caller(main()). so we declare it as int, 
and use return to send the value back.
3.   Why we didn’t write the cout statements directly in main()?
like this :- cout << obj.a << obj.b << obj.c;
a and b are private and protected members, so main() can’t access them directly.

Only functions inside the class (like getdata()) are allowed to see and use a and b.
That’s part of encapsulation, one of the main principles of Object-Oriented Programming (OOP).
So we create a public function (getdata()) that can access those members from inside the class
and print them for us.

4.   return a + b + c; works because it’s written inside the class —
all member functions have access to all data members of their class.

❌ But if you tried to use a or b directly from main(), it would fail —
because main() is outside the class. like this cout << obj.a+obj.b+obj>c; // Error!
because a is private and b is protected.and only c is public.
5.“Can I make it so that I print in main(), not in getdata()?”
🧱 Option 1 — Return each value individually like this 
 void setdata(int a1, int b1, int c1) {
        a = a1;
        b = b1;
        c = c1;
    }

    int getA() { return a; }   // returns private variable
    int getB() { return b; }   // returns protected variable
    int getC() { return c; }   // returns public variable
};
//and all them individually 
int main() {
    H obj;
    obj.setdata(10, 20, 30);

    // Now we print values here in main()
    cout << "The value of a is: " << obj.getA() << endl;
    cout << "The value of b is: " << obj.getB() << endl;
    cout << "The value of c is: " << obj.getC() << endl;

    return 0;
}
🧱 Option 2 — Return all values together (struct or tuple-style)
If you wanted to return all values at once, you can use a structure or pair.
#include<iostream>
#include<tuple> // for tuple
using namespace std;

class H {
private:
    int a;
protected:
    int b;
public:
    int c;

    void setdata(int a1, int b1, int c1) {
        a = a1;
        b = b1;
        c = c1;
    }

    tuple<int,int,int> getdata() {   // return multiple values as a tuple(for three values )
        return make_tuple(a, b, c);
    }
};

int main() {
    H obj;
    obj.setdata(10, 20, 30);

    int x, y, z;
    tie(x, y, z) = obj.getdata();   // unpack the returned tuple

    cout << "The value of a is: " << x << endl;
    cout << "The value of b is: " << y << endl;
    cout << "The value of c is: " << z << endl;

    return 0;
}



*/