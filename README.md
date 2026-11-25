# SortVisualLearn

Aplikasi web interaktif untuk belajar algoritma sorting secara visual. Dibuat supaya konsep seperti *pivot*, *max-heap*, atau kenapa `O(n log n)` jauh lebih cepat daripada `O(n²)` bisa langsung kelihatan di layar—bukan cuma dibayangkan dari rumus atau potongan kode statis.

Seluruh materi, narasi langkah, dan antarmuka ditulis dalam bahasa Indonesia yang santai dan mudah diikuti.

---

## Apa saja yang bisa dicoba?

### 1. Mode Visualisasi & Materi
- **6 algoritma sorting**: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, dan Heap Sort.
- **Narasi langsung tiap langkah**: Setiap kali dua angka dibandingkan atau ditukar, ada penjelasan singkat di atas panggung tentang apa yang sedang terjadi dan kenapa.
- **Pelacak pseudocode**: Baris pseudocode yang sedang dieksekusi ikut tersorot secara real-time mengikuti langkah animasi.
- **Kontrol penuh**: Putar otomatis (0.5x sampai 4x), jeda, maju/mundur satu langkah pakai tombol atau panah keyboard, serta *timeline scrubber* untuk menggeser ke langkah mana saja.
- **Data fleksibel**: Bisa pakai preset (*Acak*, *Hampir Urut*, *Terbalik*, *Banyak Kembar*), atur jumlah bar (6–22), atau masukkan angka sendiri (4–24 angka antara 5–100).
- **Analogi & kompleksitas**: Tiap algoritma dilengkapi analogi sehari-hari, langkah kerja, kapan sebaiknya dipakai, kelebihan/kekurangan, serta tabel Best/Average/Worst/Space complexity.
- **Efek suara ringan (opsional)**: Nada Web Audio API yang berubah sesuai nilai bar saat membandingkan atau menukar elemen, plus tombol mute di header.

### 2. Mode Duel Algoritma
Pilih dua algoritma berbeda—misalnya Bubble Sort melawan Quick Sort—lalu jalankan keduanya pada susunan angka yang persis sama. Jumlah perbandingan, pertukaran, dan total langkah langsung terlihat berdampingan sampai pemenangnya keluar.

### 3. Mode Kuis Interaktif
Kumpulan soal singkat untuk menguji pemahaman konsep tiap algoritma, lengkap dengan *streak counter* dan penjelasan langsung setelah memilih jawaban.

---

## Teknologi yang Dipakai

- **React 19 + TypeScript** untuk struktur komponen dan generator langkah yang deterministik.
- **Vite** untuk development server dan production build.
- **Tailwind CSS v4** (`@tailwindcss/vite`) untuk styling.
- **GSAP** untuk animasi bar saat dibandingkan, ditukar, serta efek *cascade* ketika array selesai terurut.
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

## Shortcut Keyboard (di Mode Visualisasi)

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
│   └── generators.ts       # Generator langkah deterministik untuk 6 algoritma
├── components/
│   ├── AlgorithmSelector.tsx
│   ├── ControlBar.tsx      # Kontrol playback, kecepatan, ukuran data, & input kustom
│   ├── LearningPanel.tsx   # Pelacak pseudocode & kartu materi/kompleksitas
│   ├── Navbar.tsx          # Navigasi mode & toggle suara
│   ├── QuizMode.tsx        # Kuis interaktif dengan streak
│   ├── RaceMode.tsx        # Mode duel dua algoritma berdampingan
│   └── SortingStage.tsx    # Panggung visualisasi bar dengan animasi GSAP
├── data/
│   └── algorithms.ts       # Materi, analogi, pseudocode, & bank soal kuis
├── types/
│   └── sorting.ts          # Definisi tipe TypeScript
├── utils/
│   └── sound.ts            # Synthesizer Web Audio API
├── App.tsx
├── index.css
└── main.tsx
```

---

## Lisensi

Menggunakan lisensi yang tercantum pada berkas [LICENSE](LICENSE).
