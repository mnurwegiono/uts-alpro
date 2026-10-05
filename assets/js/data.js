/**
 * Initial sample dataset for Studi Kasus Algoritma dan Pemrograman C++
 */
const initialCaseStudies = [
    {
        id: "cs-01",
        title: "Sistem Kasir Restoran Sederhana",
        category: "Studi Kasus Nyata",
        difficulty: "Mudah",
        tags: ["Percabangan", "Perulangan", "Array", "Struct"],
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
        date: "2026-10-01",
        summary: "Program kasir interaktif untuk menghitung total belanja, diskon bertingkat, dan cetak struk pembayaran.",
        problemStatement: `Sebuah restoran ingin membuat sistem kasir otomatis berbasis konsol.
Sistem harus mampu:
1. Menampilkan daftar menu makanan & minuman beserta harganya.
2. Memungkinkan pelanggan memesan lebih dari satu item beserta jumlah porsinya.
3. Memberikan diskon 10% jika total transaksi melebihi Rp 100.000.
4. Menghitung uang kembali berdasarkan uang pembayaran yang dimasukkan.
5. Mencetak struk belanja terperinci.`,
        inputExample: `Menu: 1 (Nasi Goreng Spesial @ Rp 25.000, Qty: 3)
Menu: 3 (Es Teh Manis @ Rp 5.000, Qty: 3)
Bayar: Rp 100.000`,
        outputExample: `================ STRUK RESTORAN ================
1. Nasi Goreng Spesial x3 = Rp 75.000
2. Es Teh Manis        x3 = Rp 15.000
------------------------------------------------
Subtotal : Rp 90.000
Diskon   : Rp 0
Total    : Rp 90.000
Bayar    : Rp 100.000
Kembali  : Rp 10.000
================================================`,
        code: `#include <iostream>
#include <vector>
#include <iomanip>
#include <string>

using namespace std;

struct MenuItem {
    int id;
    string name;
    double price;
};

struct OrderItem {
    MenuItem item;
    int quantity;
    double subtotal;
};

int main() {
    vector<MenuItem> menu = {
        {1, "Nasi Goreng Spesial", 25000},
        {2, "Ayam Bakar Madu", 30000},
        {3, "Es Teh Manis", 5000},
        {4, "Jus Alpukat", 12000}
    };

    vector<OrderItem> orders;
    int choice, qty;
    char lanjut;

    cout << "=========================================\\n";
    cout << "       SELAMAT DATANG DI RESTO ALPRO     \\n";
    cout << "=========================================\\n";

    do {
        cout << "\\nDAFTAR MENU:\\n";
        for (const auto &m : menu) {
            cout << m.id << ". " << left << setw(22) << m.name 
                 << " Rp " << fixed << setprecision(0) << m.price << "\\n";
        }

        cout << "\\nPilih ID Menu (1-4): ";
        cin >> choice;

        if (choice < 1 || choice > 4) {
            cout << "Pilihan tidak valid!\\n";
            continue;
        }

        cout << "Masukkan Jumlah: ";
        cin >> qty;

        MenuItem selected = menu[choice - 1];
        OrderItem order = {selected, qty, selected.price * qty};
        orders.push_back(order);

        cout << "Tambah pesanan lain? (y/n): ";
        cin >> lanjut;
    } while (lanjut == 'y' || lanjut == 'Y');

    // Hitung Total
    double total = 0;
    for (const auto &ord : orders) {
        total += ord.subtotal;
    }

    double diskon = 0;
    if (total >= 100000) {
        diskon = total * 0.10; // Diskon 10%
    }

    double grandTotal = total - diskon;
    double bayar, kembali;

    cout << "\\nTotal Belanja: Rp " << fixed << setprecision(0) << total << "\\n";
    cout << "Diskon       : Rp " << diskon << "\\n";
    cout << "Grand Total  : Rp " << grandTotal << "\\n";

    do {
        cout << "Uang Bayar   : Rp ";
        cin >> bayar;
        if (bayar < grandTotal) {
            cout << "Uang tidak cukup! Silakan masukkan nominal yang sesuai.\\n";
        }
    } while (bayar < grandTotal);

    kembali = bayar - grandTotal;

    // Cetak Struk
    cout << "\\n=========================================\\n";
    cout << "             STRUK PEMBAYARAN            \\n";
    cout << "=========================================\\n";
    for (const auto &ord : orders) {
        cout << left << setw(20) << ord.item.name 
             << " x" << ord.quantity 
             << " = Rp " << ord.subtotal << "\\n";
    }
    cout << "-----------------------------------------\\n";
    cout << "Subtotal    : Rp " << total << "\\n";
    cout << "Diskon      : Rp " << diskon << "\\n";
    cout << "Grand Total : Rp " << grandTotal << "\\n";
    cout << "Tunai       : Rp " << bayar << "\\n";
    cout << "Kembalian   : Rp " << kembali << "\\n";
    cout << "=========================================\\n";
    cout << "   Terima kasih atas kunjungan Anda!    \\n";

    return 0;
}`,
        explanation: `1. **Struct MenuItem & OrderItem**: Digunakan untuk mengelompokkan data menu makanan (id, nama, harga) serta item pesanan yang mencatat kuantitas dan subtotal.
2. **Perulangan `do-while`**: Memungkinkan kasir menginput pesanan secara fleksibel berulang kali sampai memilih selesai ('n').
3. **Percabangan `if-else`**: Menghitung syarat diskon apabila total belanja memenuhi ambang batas (>= Rp 100.000) dan memvalidasi uang pembayaran.`
    },
    {
        id: "cs-02",
        title: "Pengurutan Data Nilai Siswa (Quick Sort vs Bubble Sort)",
        category: "Sorting & Searching",
        difficulty: "Sedang",
        tags: ["Divide and Conquer", "QuickSort", "BubbleSort", "Benchmark"],
        timeComplexity: "O(n log n) average",
        spaceComplexity: "O(log n)",
        date: "2026-10-02",
        summary: "Perbandingan performa algoritma pengurutan Quick Sort dan Bubble Sort untuk mengurutkan nilai akademik siswa.",
        problemStatement: `Terdapat sekumpulan data nilai ujian akhir mahasiswa yang belum terurut.
Buatlah implementasi algoritma Quick Sort secara rekursif (Lomuto partition scheme) dan bandingkan dengan Bubble Sort. Program harus menampilkan array sebelum dan sesudah diurutkan secara Ascending & Descending.`,
        inputExample: `Data Awal Nilai: [85, 45, 90, 78, 60, 95, 70, 88]`,
        outputExample: `Data Awal       : 85 45 90 78 60 95 70 88
QuickSort (Asc) : 45 60 70 78 85 88 90 95
QuickSort (Desc): 95 90 88 85 78 70 60 45`,
        code: `#include <iostream>
#include <vector>

using namespace std;

// Fungsi Swap
void tukar(int &a, int &b) {
    int temp = a;
    a = b;
    b = temp;
}

// Partition Lomuto untuk Ascending
int partitionAsc(vector<int> &arr, int low, int high) {
    int pivot = arr[high]; // Pivot di akhir
    int i = low - 1;

    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            tukar(arr[i], arr[j]);
        }
    }
    tukar(arr[i + 1], arr[high]);
    return i + 1;
}

// Rekursi Quick Sort Ascending
void quickSortAsc(vector<int> &arr, int low, int high) {
    if (low < high) {
        int pi = partitionAsc(arr, low, high);
        quickSortAsc(arr, low, pi - 1);
        quickSortAsc(arr, pi + 1, high);
    }
}

// Cetak Array
void printArray(const vector<int> &arr) {
    for (int x : arr) {
        cout << x << " ";
    }
    cout << "\\n";
}

int main() {
    vector<int> nilai = {85, 45, 90, 78, 60, 95, 70, 88};

    cout << "=== PROGRAM PENGURUTAN NILAI (QUICK SORT) ===\\n\\n";
    cout << "Data Sebelum Diurutkan: ";
    printArray(nilai);

    vector<int> sortedAsc = nilai;
    quickSortAsc(sortedAsc, 0, sortedAsc.size() - 1);

    cout << "Hasil Quick Sort (Ascending): ";
    printArray(sortedAsc);

    return 0;
}`,
        explanation: `1. **Prinsip Divide and Conquer**: Quick Sort memilih sebuah elemen sebagai *pivot*, lalu mempartisi array ke dalam dua sub-array: elemen yang lebih kecil dari pivot dan elemen yang lebih besar dari pivot.
2. **Efisiensi**: Quick Sort memiliki kompleksitas rata-rata $O(n \\log n)$, jauh lebih cepat dibandingkan Bubble Sort yang berordo $O(n^2)$ pada dataset besar.`
    },
    {
        id: "cs-03",
        title: "Pencarian Biner (Binary Search) Data Induk Mahasiswa",
        category: "Sorting & Searching",
        difficulty: "Mudah",
        tags: ["Binary Search", "Searching", "Divide and Conquer"],
        timeComplexity: "O(log n)",
        spaceComplexity: "O(1)",
        date: "2026-10-03",
        summary: "Mencari data mahasiswa berdasarkan NIM dengan efisiensi tinggi menggunakan Binary Search.",
        problemStatement: `Diberikan daftar NIM mahasiswa yang sudah terurut. Implementasikan algoritma Binary Search secara iteratif untuk menemukan posisi mahasiswa yang dicari. Jika ditemukan, tampilkan nama dan indeksnya. Jika tidak ditemukan, berikan pesan pemberitahuan.`,
        inputExample: `Cari NIM: 104`,
        outputExample: `NIM 104 ditemukan pada indeks ke-3.
Nama Mahasiswa: Citra Lestari`,
        code: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

struct Mahasiswa {
    int nim;
    string nama;
    string jurusan;
};

int binarySearch(const vector<Mahasiswa> &data, int targetNIM) {
    int left = 0;
    int right = data.size() - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (data[mid].nim == targetNIM) {
            return mid; // Ditemukan
        }
        if (data[mid].nim < targetNIM) {
            left = mid + 1; // Cari di separuh kanan
        } else {
            right = mid - 1; // Cari di separuh kiri
        }
    }
    return -1; // Tidak ditemukan
}

int main() {
    // Data harus terurut berdasarkan NIM
    vector<Mahasiswa> daftar = {
        {101, "Aditya Pratama", "Informatika"},
        {102, "Budi Santoso", "Sistem Informasi"},
        {103, "Cynthia Dewi", "Teknik Komputer"},
        {104, "Citra Lestari", "Informatika"},
        {105, "Doni Firmansyah", "Informatika"}
    };

    cout << "=== PENCARIAN DATA MAHASISWA (BINARY SEARCH) ===\\n\\n";
    int cariNIM = 104;
    cout << "Mencari NIM: " << cariNIM << "\\n";

    int index = binarySearch(daftar, cariNIM);

    if (index != -1) {
        cout << "\\n[STATUS: DITEMUKAN]\\n";
        cout << "Indeks : " << index << "\\n";
        cout << "NIM    : " << daftar[index].nim << "\\n";
        cout << "Nama   : " << daftar[index].nama << "\\n";
        cout << "Prodi  : " << daftar[index].jurusan << "\\n";
    } else {
        cout << "\\n[STATUS: TIDAK DITEMUKAN]\\n";
        cout << "NIM " << cariNIM << " tidak terdaftar dalam database.\\n";
    }

    return 0;
}`,
        explanation: `1. **Syarat Utama**: Data array/vektor harus sudah dalam keadaan terurut (*sorted*).
2. **Langkah Kerja**: Bandingkan elemen tengah (\`mid\`) dengan target. Jika nilai tengah lebih kecil, persempit rentang ke kanan (\`left = mid + 1\`), jika lebih besar, persempit ke kiri (\`right = mid - 1\`).
3. **Kompleksitas Waktu**: $O(\\log n)$, sangat efisien untuk jutaan data.`
    },
    {
        id: "cs-04",
        title: "0/1 Knapsack Problem Menggunakan Dynamic Programming",
        category: "Rekursi & DP",
        difficulty: "Sulit",
        tags: ["Dynamic Programming", "Optimization", "Memoization"],
        timeComplexity: "O(n * W)",
        spaceComplexity: "O(n * W)",
        date: "2026-10-04",
        summary: "Penyelesaian optimasi pemilihan barang muatan ransel dengan nilai keuntungan maksimum berbasis tabel DP.",
        problemStatement: `Seorang petualang memiliki tas ransel dengan kapasitas berat maksimum W = 50 kg. Terdapat N barang dengan masing-masing bobot (weight) dan nilai (value). Tentukan kombinasi barang yang dapat dibawa agar diperoleh total nilai (profit) sebesar mungkin tanpa melebihi kapasitas tas.`,
        inputExample: `Kapasitas Tas: 50 kg
Barang:
1. Berat: 10 kg, Nilai: 60
2. Berat: 20 kg, Nilai: 100
3. Berat: 30 kg, Nilai: 120`,
        outputExample: `Nilai Maksimum yang dapat dibawa: 220
Barang yang dipilih: Barang 2 & Barang 3 (Total Berat: 50 kg)`,
        code: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

struct Item {
    string nama;
    int berat;
    int nilai;
};

int knapsackDP(int W, const vector<Item> &items, vector<int> &pickedItems) {
    int n = items.size();
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));

    // Mengisi tabel DP
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            if (items[i - 1].berat <= w) {
                dp[i][w] = max(items[i - 1].nilai + dp[i - 1][w - items[i - 1].berat], 
                               dp[i - 1][w]);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    // Melacak barang yang dipilih (Backtracking)
    int res = dp[n][W];
    int w = W;
    for (int i = n; i > 0 && res > 0; i--) {
        if (res != dp[i - 1][w]) {
            pickedItems.push_back(i - 1);
            res -= items[i - 1].nilai;
            w -= items[i - 1].berat;
        }
    }

    return dp[n][W];
}

int main() {
    int W = 50; // Kapasitas ransel
    vector<Item> items = {
        {"Barang A", 10, 60},
        {"Barang B", 20, 100},
        {"Barang C", 30, 120}
    };

    vector<int> picked;
    int maxVal = knapsackDP(W, items, picked);

    cout << "=== 0/1 KNAPSACK PROBLEM DENGAN DYNAMIC PROGRAMMING ===\\n\\n";
    cout << "Kapasitas Ransel : " << W << " kg\\n\\n";
    cout << "Daftar Barang:\\n";
    for (const auto &item : items) {
        cout << "- " << item.nama << " | Berat: " << item.berat << " kg | Nilai: " << item.nilai << "\\n";
    }

    cout << "\\nNilai Maksimum yang Didapat: " << maxVal << "\\n";
    cout << "Barang yang Dibawa:\\n";
    int totalBeban = 0;
    for (int idx : picked) {
        cout << "-> " << items[idx].nama << " (Berat: " << items[idx].berat << ", Nilai: " << items[idx].nilai << ")\\n";
        totalBeban += items[idx].berat;
    }
    cout << "Total Beban: " << totalBeban << " / " << W << " kg\\n";

    return 0;
}`,
        explanation: `1. **Tabel Sub-Problem (\`dp[i][w]\`)**: Menyimpan nilai maksimum yang dapat dicapai menggunakan $i$ item pertama dengan batas kapasitas ransel $w$.
2. **Prinsip Optimalitas**: Pada setiap item $i$, ada 2 pilihan: menyertakan item (\`nilai + dp[i-1][w-berat]\`) atau melewatkannya (\`dp[i-1][w]\`).
3. **Backtracking**: Menelusuri kembali tabel untuk mengetahui daftar item yang berkontribusi pada solusi optimal.`
    },
    {
        id: "cs-05",
        title: "Perkalian Matriks & Transformasi 2D",
        category: "Array & Matrix",
        difficulty: "Sedang",
        tags: ["2D Array", "Matrix Multiplication", "Linear Algebra"],
        timeComplexity: "O(n^3)",
        spaceComplexity: "O(n^2)",
        date: "2026-10-05",
        summary: "Operasi aritmatika matriks dua dimensi dengan validasi dimensi perkalian ordo M x K dan K x N.",
        problemStatement: `Buatlah program C++ untuk mengalikan dua buah matriks A dan B.
Program harus memvalidasi apakah jumlah kolom matriks A sama dengan jumlah baris matriks B. Jika valid, lakukan perhitungan perkalian matriks menggunakan nested loops dan tampilkan hasilnya secara rapi.`,
        inputExample: `Matriks A (2x3):
[1, 2, 3]
[4, 5, 6]

Matriks B (3x2):
[7, 8]
[9, 1]
[2, 3]`,
        outputExample: `Hasil Perkalian Matriks C (2x2):
[31, 19]
[85, 55]`,
        code: `#include <iostream>
#include <vector>
#include <iomanip>

using namespace std;

void tampilMatriks(const vector<vector<int>> &mat, const string &label) {
    cout << label << ":\\n";
    for (const auto &baris : mat) {
        cout << "[ ";
        for (int val : baris) {
            cout << setw(4) << val << " ";
        }
        cout << "]\\n";
    }
    cout << "\\n";
}

int main() {
    // Matriks A berordo 2x3
    vector<vector<int>> A = {
        {1, 2, 3},
        {4, 5, 6}
    };

    // Matriks B berordo 3x2
    vector<vector<int>> B = {
        {7, 8},
        {9, 1},
        {2, 3}
    };

    int r1 = A.size();
    int c1 = A[0].size();
    int r2 = B.size();
    int c2 = B[0].size();

    cout << "=== PERKALIAN DUA BUAH MATRIKS ===\\n\\n";

    if (c1 != r2) {
        cout << "Error: Matriks tidak dapat dikalikan! Kolom A (" << c1 
             << ") harus sama dengan Baris B (" << r2 << ").\\n";
        return 1;
    }

    // Inisialisasi Matriks Hasil C dengan ukuran r1 x c2 bernilai 0
    vector<vector<int>> C(r1, vector<int>(c2, 0));

    // Proses Perkalian Matriks (O(r1 * c1 * c2))
    for (int i = 0; i < r1; i++) {
        for (int j = 0; j < c2; j++) {
            for (int k = 0; k < c1; k++) {
                C[i][j] += A[i][k] * B[k][j];
            }
        }
    }

    tampilMatriks(A, "Matriks A (2x3)");
    tampilMatriks(B, "Matriks B (3x2)");
    tampilMatriks(C, "Hasil Matriks C (2x2)");

    return 0;
}`,
        explanation: `1. **Validasi Dimensi**: Syarat perkalian matriks $A_{m \\times k} \\times B_{k \\times n} = C_{m \\times n}$ adalah kolom matriks pertama harus sama dengan baris matriks kedua ($k$).
2. **Algoritma 3 Lapisan Loop**: 
   - Loop $i$ mengiterasi baris matriks A.
   - Loop $j$ mengiterasi kolom matriks B.
   - Loop $k$ menjumlahkan hasil kali elemen baris A dan kolom B (\`C[i][j] += A[i][k] * B[k][j]\`).`
    },
    {
        id: "cs-06",
        title: "Penyelesaian Menara Hanoi Menggunakan Rekursi",
        category: "Rekursi & DP",
        difficulty: "Sedang",
        tags: ["Rekursi", "Tower of Hanoi", "Call Stack"],
        timeComplexity: "O(2^n)",
        spaceComplexity: "O(n)",
        date: "2026-10-05",
        summary: "Simulasi pemindahan cakram pada teka-teki klasik Menara Hanoi secara rekursif langkah demi langkah.",
        problemStatement: `Terdapat 3 tiang (A: Asal, B: Bantu, C: Tujuan) dan N buah cakram dengan ukuran berbeda.
Pindahkan semua cakram dari tiang A ke tiang C dengan aturan:
1. Hanya 1 cakram yang boleh dipindahkan dalam satu waktu.
2. Cakram yang lebih besar tidak boleh diletakkan di atas cakram yang lebih kecil.`,
        inputExample: `Jumlah Cakram N = 3`,
        outputExample: `Langkah 1: Pindahkan cakram 1 dari Tiang A ke Tiang C
Langkah 2: Pindahkan cakram 2 dari Tiang A ke Tiang B
Langkah 3: Pindahkan cakram 1 dari Tiang C ke Tiang B
Langkah 4: Pindahkan cakram 3 dari Tiang A ke Tiang C
Langkah 5: Pindahkan cakram 1 dari Tiang B ke Tiang A
Langkah 6: Pindahkan cakram 2 dari Tiang B ke Tiang C
Langkah 7: Pindahkan cakram 1 dari Tiang A ke Tiang C
Total Langkah: 7`,
        code: `#include <iostream>

using namespace std;

int langkahCounter = 0;

void towerOfHanoi(int n, char asal, char tujuan, char bantu) {
    if (n == 0) {
        return; // Base Case
    }

    // 1. Pindahkan n-1 cakram dari asal ke bantu
    towerOfHanoi(n - 1, asal, bantu, tujuan);

    // 2. Pindahkan cakram ke-n dari asal ke tujuan
    langkahCounter++;
    cout << "Langkah " << langkahCounter << ": Pindahkan cakram " 
         << n << " dari Tiang " << asal << " ke Tiang " << tujuan << "\\n";

    // 3. Pindahkan n-1 cakram dari bantu ke tujuan
    towerOfHanoi(n - 1, bantu, tujuan, asal);
}

int main() {
    int n = 3; // Jumlah cakram

    cout << "=== SIMULASI MENARA HANOI (TOWER OF HANOI) ===\\n\\n";
    cout << "Jumlah Cakram: " << n << "\\n\\n";

    towerOfHanoi(n, 'A', 'C', 'B');

    cout << "\\nTotal langkah yang dibutuhkan: " << langkahCounter << " (Formula: 2^n - 1)\\n";

    return 0;
}`,
        explanation: `1. **Base Case**: Jika $N = 0$, fungsi langsung kembali (*return*).
2. **Tiga Tahapan Rekursi**:
   - Pindahkan $N-1$ cakram dari tiang *Asal* ke tiang *Bantu* dengan bantuan tiang *Tujuan*.
   - Pindahkan cakram terbesar ($N$) langsung dari *Asal* ke *Tujuan*.
   - Pindahkan $N-1$ cakram dari tiang *Bantu* ke tiang *Tujuan* dengan memanfaatkan tiang *Asal*.
3. **Jumlah Langkah Optimal**: Rumus total langkah adalah $2^n - 1$.`
    }
];
