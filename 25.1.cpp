// reading a text file
#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <bit>
#include <bitset>
using namespace std;

#define width 139
#define height 137

template <int size>
inline bitset<size> rotLeft(bitset<size> bits) {
    return bits << 1 | bits >> (size - 1);
}

template <int size>
inline bitset<size> rotRight(bitset<size> bits) {
    return bits >> 1 | bits << (size - 1);
}

template <int w, int h>
bool update(vector<bitset<w>> &rows, const vector<bitset<h>> &cols) {
    bool moved = false;
    for (int row = 0; row < rows.size(); row++) {
        bitset<w> blocked;
        for (int col = 0; col < cols.size(); col++) {
            blocked[col] = cols[col][row];
        }

        blocked = (blocked | rows[row]);
        const auto a = rotLeft(rows[row]);
        const auto b = a & (~blocked);
        const auto c = rotRight(b);
        bitset<w> result = rows[row] ^ b ^ c;

        if (result != rows[row]) {
            moved = true;
        }
        rows[row] = result;
    }

    return moved;
}

template <int w, int h>
void print(const vector<bitset<w>> &rows, const vector<bitset<h>> &cols) {
    for (int row = 0; row < height; row++) {
        for (int col = 0; col < width; col++) {
            if (rows[row][col]) {
                cout << '>';
            } else if (cols[col][row]) {
                cout << 'v';
            } else {
                cout << '.';
            }
        }
        cout << '\n';
    }

    cout << '\n' << endl;
}

int main () {
    string line;
    ifstream myfile ("input25.txt");

    vector<bitset<width>> rows(height);
    vector<bitset<height>> cols(width);

    int line_n = 0;
    while (getline (myfile, line)) {
        for (int i = 0; i < line.size(); i++) {
            const char c = line[i];

            if (c == '>') rows[line_n][i] = true;
            if (c == 'v') cols[i][line_n] = true;
        }

        line_n++;
    }

    bool moved = true;
    int runs = 0;
    while (moved) {
        moved = false;
        moved |= update(rows, cols);
        moved |= update(cols, rows);

        runs++;
        if (false) {
            cout << "After " << runs << " steps\n";
            print(rows, cols);
        }
    }

    print(rows, cols);
    cout << runs << endl;

    return 0;
}