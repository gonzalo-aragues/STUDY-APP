#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (int i = 1; i <= n; i++) {
        cin >> v[i];
    }
    int suma;
    for (int i = 0; i < n; i++) {
        suma = suma + v[i];
    }
    double media = suma / n;
    cout << "Media: " << media << endl;
    return 0;
}
