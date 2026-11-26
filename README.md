# SortVisualLearn

Aplikasi web interaktif untuk belajar algoritma **Sorting** dan **Searching** secara visual. Dibuat supaya konsep seperti *pivot*, pemangkasan ruang pencarian di *Binary Search*, pembagian sub-array di *Merge Sort*, atau kenapa `O(n log n)` jauh lebih cepat daripada `O(n²)` bisa langsung kelihatan di layar—bukan cuma dibayangkan dari rumus atau potongan kode statis.

Seluruh materi, narasi langkah, dan antarmuka ditulis dalam bahasa Indonesia yang santai dan mudah diikuti, lengkap dengan **Dark Mode** dan **efek suara ringan**.

---

## Dua Topik Pembelajaran

Di bagian header tersedia tombol switcher terpisah untuk berpindah antara topik **Sorting** dan **Searching**, masing-masing memiliki tiga mode: **Visualisasi & Materi**, **Duel Algoritma**, dan **Kuis Interaktif**.

### 1. Sorting (7 Algoritma)
Mencakup **Bubble Sort**, **Selection Sort**, **Insertion Sort**, **Shell Sort**, **Merge Sort**, **Quick Sort**, dan **Heap Sort**.
- **Animasi pertukaran fisik (GSAP FLIP)**: Bar benar-benar meluncur bertukar tempat setelah dibandingkan, bukan berubah tinggi di tempat.
- **Visualisasi lompatan jarak (Gap) di Shell Sort & Divide/Merge di Merge Sort**: Pada Shell Sort terlihat pasangan elemen berjarak `gap` yang dibandingkan dan meluncur bertukar tempat; pada Merge Sort rentang kiri dan kanan dibatasi kotak warna berbeda dengan garis pemisah saat dipecah, lalu menyatu saat digabungkan kembali.
- **Data fleksibel**: Bisa pakai preset (*Acak*, *Hampir Urut*, *Terbalik*, *Banyak Kembar*), atur jumlah data (6–22), atau masukkan angka sendiri (4–24 angka antara 5–100).

### 2. Searching (6 Algoritma)
Mencakup **Linear Search**, **Binary Search**, **Jump Search**, **Interpolation Search**, **Exponential Search**, dan **Ternary Search**.
- **Kartu indeks interaktif**: Klik angka mana saja langsung di panggung untuk menjadikannya target pencarian, atau gunakan input target serta tombol cepat *Target Ada* / *Target Tidak Ada*.
- **Visualisasi pemangkasan area**: Elemen yang sudah tidak mungkin mengandung target otomatis meredup agar cara kerja *Binary*, *Jump*, *Interpolation*, *Exponential* (pelipatgandaan `bound` 1, 2, 4, 8...), dan *Ternary Search* (pembagian 3 wilayah dengan `mid1` & `mid2`) mudah dipahami.
- **Pengaturan data**: Atur jumlah data (6–20) dan ubah antara data acak atau terurut pada Linear Search.

---

## Fitur Pendukung di Kedua Topik

- **Pelacak kode multi-bahasa**: Baris kode yang sedang dieksekusi tersorot real-time mengikuti animasi. Bahasa bisa diganti kapan saja antara **Pseudocode**, **Python**, **JavaScript**, **Dart**, **Java**, dan **C++**.
- **Narasi langsung tiap langkah**: Penjelasan singkat di atas panggung tentang apa yang sedang dibandingkan, ditukar, atau dipangkas.
- **Kontrol playback lengkap**: Putar otomatis (0.5x sampai 4x), jeda, maju/mundur satu langkah, dan *timeline scrubber*.
- **Materi analogi & kompleksitas**: Analogi sehari-hari, langkah kerja utama, kapan sebaiknya dipakai, kelebihan/kekurangan, serta kompleksitas Best/Average/Worst/Space.
- **Mode Duel Algoritma**: Adu dua algoritma secara berdampingan pada data yang sama persis—bisa atur jumlah data dan pola datanya—lalu lihat perbandingan jumlah langkah atau pengecekannya.
- **Mode Kuis Interaktif**: Bank soal terpisah untuk Sorting dan Searching, lengkap dengan *streak counter* dan penjelasan langsung.
- **Dark Mode & Audio Feedback**: Toggle tema terang/gelap di header (tersimpan di `localStorage`) serta nada Web Audio API opsional yang mengikuti nilai elemen.

---

## Teknologi yang Dipakai

- **React 19 + TypeScript** untuk struktur komponen dan generator langkah deterministik.
- **Vite** untuk development server dan production build.
- **Tailwind CSS v4** (`@tailwindcss/vite`) untuk styling dan dukungan dark mode.
- **GSAP** untuk animasi pertukaran fisik (FLIP), highlight kartu pencarian, dan efek *cascade* saat selesai.
- **Lucide React** untuk ikon antarmuka.
- **Web Audio API** bawaan browser (tanpa file audio eksternal).

---

## Menjalankan Secara Lokal

Pastikan Node.js sudah terpasang, lalu jalankan perintah berikut di folder proyek:

```bash
# 1. Pasang dependensi
npm install

# 2. Jalankan server development
npm run dev
```

Buka URL yang muncul di terminal (biasanya `http://localhost:5173`).

Untuk membuat build produksi dan mengecek TypeScript:

```bash
npm run build
npm run preview
```

---

## Shortcut Keyboard (di Mode Visualisasi & Materi)

| Tombol | Fungsi |
| :--- | :--- |
| `Spasi` | Mulai / Jeda animasi |
| `→` (Panah Kanan) | Maju satu langkah |
| `←` (Panah Kiri) | Mundur satu langkah |
| `R` | Acak data baru |

---

## Struktur Proyek

```text
src/
├── algorithms/
│   ├── generators.ts            # Generator langkah untuk 7 algoritma sorting
│   └── searchGenerators.ts      # Generator langkah untuk 6 algoritma searching
├── components/
│   ├── AlgorithmSelector.tsx    # Pemilih algoritma sorting
│   ├── ControlBar.tsx           # Kontrol playback, kecepatan, jumlah data, & input kustom (sort)
│   ├── LearningPanel.tsx        # Pelacak kode multi-bahasa & materi (sort)
│   ├── Navbar.tsx               # Switcher Sorting/Searching, mode, tema, & suara
│   ├── QuizMode.tsx             # Kuis interaktif sorting
│   ├── RaceMode.tsx             # Mode duel dua algoritma sorting
│   ├── SearchLearningPanel.tsx  # Pelacak kode multi-bahasa & materi (search)
│   ├── SearchQuizMode.tsx       # Kuis interaktif searching
│   ├── SearchRaceMode.tsx       # Mode duel dua algoritma searching
│   ├── SearchStage.tsx          # Panggung kartu interaktif untuk searching
│   ├── SearchWorkspace.tsx      # Workspace utama topik searching
│   └── SortingStage.tsx         # Panggung bar animasi GSAP FLIP untuk sorting
├── data/
│   ├── algorithms.ts            # Materi, snippet 6 bahasa, & kuis sorting
│   └── searchAlgorithms.ts      # Materi, snippet 6 bahasa, & kuis searching
├── types/
│   ├── searching.ts             # Definisi tipe modul searching
│   └── sorting.ts               # Definisi tipe modul sorting & global
├── utils/
│   └── sound.ts                 # Synthesizer Web Audio API
├── App.tsx
├── index.css
├── main.tsx
└── vite-env.d.ts
```

---

## Lisensi

Menggunakan lisensi yang tercantum pada berkas [LICENSE](LICENSE).
