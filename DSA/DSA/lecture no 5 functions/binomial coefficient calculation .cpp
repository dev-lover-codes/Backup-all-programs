#include <stdio.h>

// Function to calculate factorial
int factorial(int n) {
    int fact = 1;
    for (int i = 1; i <= n; i++) {
        fact *= i;
    }
    return fact;
}

// Function to calculate nCr (binomial coefficient)
int nCr(int n, int r) {
    if (r > n) return 0; // Invalid case
    int fact_n = factorial(n);
    int fact_r = factorial(r);
    int fact_n_r = factorial(n - r);

    return fact_n / (fact_r * fact_n_r);
}

// Main function
int main() {
    int n, r;

    // Take input from the user
    printf("Enter n: ");
    scanf("%d", &n);

    printf("Enter r: ");
    scanf("%d", &r);

    // Validate input
    if (r > n || n < 0 || r < 0) {
        printf("Invalid input! Make sure that 0 <= r <= n.\n");
        return 1;
    }

    int result = nCr(n, r);
    printf("nCr(%d, %d) = %d\n", n, r, result);

    return 0;
}
