# BAB IV: IMPLEMENTASI DAN PENGUJIAN SISTEM (DATA WEB)
**Proyek:** Learning Management System (LMS) SMP Islam Raudlatul Hikmah
**Deskripsi:** Dokumen ini memuat seluruh data teknis, arsitektur, struktur database, hak akses, dan fungsionalitas sistem yang telah diimplementasikan dalam aplikasi LMS. Data ini disusun khusus untuk mempermudah penulisan **Bab 4 Skripsi**.

---

## 1. Arsitektur dan Teknologi Sistem (Tech Stack)
Sistem ini dibangun menggunakan arsitektur *Monolithic* yang ringan dan performa tinggi dengan teknologi berikut:
- **Bahasa Pemrograman:** PHP 8.3.16
- **Framework Backend:** Laravel 12.58.0 (Versi terbaru)
- **Framework Frontend/Styling:** Tailwind CSS v4 (Sistem Desain Modern & Islami: Emerald & Gold)
- **Interaktivitas Frontend:** Alpine.js v3.15 (Lightweight JavaScript framework untuk modal, dropdown, dan interaksi asinkron tanpa React/Vue)
- **Database:** MySQL
- **Kecerdasan Buatan (AI):** API Google Gemini-1.5-Flash (Untuk fitur *Auto-Generate* Materi dan Kuis oleh Guru)

---

## 2. Hak Akses & Aktor Sistem (Role-Based Access Control)
Sistem menerapkan konsep **Context-Aware Security**, di mana data siswa terisolasi secara ketat berdasarkan tingkat dan kelasnya.
Terdapat 3 aktor utama dalam sistem:

1. **Admin (Administrator):**
   - Mengelola master data (Konfigurasi sistem, Import User secara massal).
   - Memiliki akses pendaftaran (Tidak ada registrasi publik, akun hanya dibuat oleh Admin).
   - Memantau dasbor analitik global.

2. **Guru:**
   - Diberikan hak akses untuk mengelola pembelajaran.
   - Dapat membuat materi, tugas, dan kuis (secara manual, via *Import CSV*, atau dibantu dengan *Generate AI Gemini*).
   - Memantau progres nilai dan capaian tugas siswa.

3. **Siswa:**
   - Terikat pada entitas `kelas_id` tertentu secara sistematis.
   - Hanya dapat melihat materi, tugas, kuis, dan forum diskusi teman sekelas (Context-Aware).
   - Memiliki fitur Gamifikasi (Poin, *Daily Streak*, dan *Leaderboard* Teman Sekelas).

---

## 3. Struktur Database (Entity Relationship)
Berikut adalah daftar tabel (entitas) beserta atribut utamanya:

### Tabel Master
*   `users`: Menyimpan semua data pengguna.
    *(Kolom: id, nama, username, password, role, kelas_id, point_gamifikasi, streak_saat_ini, login_terakhir)*
*   `kelas`: Referensi tingkatan dan nama kelas (Contoh: 7A, 8B).
    *(Kolom: id, nama_kelas, tingkat)*
*   `mata_pelajaran`: Referensi kurikulum (Contoh: Matematika, PAI).
    *(Kolom: id, nama_mapel)*

### Tabel Pembelajaran Terpandu (Guru -> Siswa)
*   `materi`: Modul ajar yang dibuat oleh guru.
    *(Kolom: id, judul, konten, kelas_id, mata_pelajaran_id, guru_id)*
*   `kuis`: Bank evaluasi.
    *(Kolom: id, judul, deskripsi, materi_id, mata_pelajaran_id, kelas_id, guru_id)*
*   `soal_kuis`: Soal pilihan ganda turunan dari Kuis.
    *(Kolom: id, kuis_id, pertanyaan, opsi_a, opsi_b, opsi_c, opsi_d, jawaban_benar, bobot)*
*   `tugas`: Penugasan berbasis berkas/deskripsi.
    *(Kolom: id, judul, deskripsi, kelas_id, mata_pelajaran_id, guru_id, tenggat_waktu, file_lampiran)*

### Tabel Transaksi Siswa
*   `hasil_kuis`: Rekaman nilai kuis siswa.
    *(Kolom: id, kuis_id, user_id, nilai)*
*   `pengumpulan_tugas`: Rekaman file jawaban dari siswa.
    *(Kolom: id, tugas_id, user_id, file_jawaban)*
*   `log_aktivitas`: Pencatatan aktivitas siswa untuk perhitungan poin dan analitik AI.
    *(Kolom: id, user_id, jenis_aktivitas, item_id)*

### Tabel Interaksi Sosial (Forum)
*   `forum_threads`: Topik diskusi berdasarkan kelas dan mapel.
    *(Kolom: id, user_id, kelas_id, mata_pelajaran_id, judul, konten)*
*   `forum_replies`: Komentar/balasan dari topik diskusi.
    *(Kolom: id, thread_id, user_id, konten)*

---

## 4. Fungsionalitas Lengkap Web (Use Case per Aktor)

### Fungsionalitas Admin
*   **Dasbor Admin:** Menampilkan total user, guru, siswa, kelas, mapel, materi, dan tugas dalam ringkasan metrik.
*   **Manajemen User (CRUD):** Tambah user manual, Hapus User, dan fitur *Upload/Import Bulk User via CSV*.
*   **Pengaturan Sistem:** Menambahkan referensi data Kelas dan Mata Pelajaran baru.

### Fungsionalitas Guru
*   **Dasbor Guru:** Metrik cepat mengenai materi yang diunggah dan tombol pintasan aksi.
*   **Kelola Materi (CRUD):** Tambah manual, Buka (Detail), Edit, Hapus, *Import CSV*, dan **Generate AI Gemini** (Aplikasi otomatis menyusun materi sesuai permintaan berdasarkan mapel dan tingkatan kelas).
*   **Kelola Kuis (CRUD):** Tambah kuis manual, Edit judul/deskripsi, Hapus, Tambah Soal Manual, *Import Soal via CSV*, dan **Generate AI Gemini** (Membuat bank soal beserta kunci jawaban dalam hitungan detik).
*   **Kelola Tugas (CRUD):** Mempublikasikan tugas dengan deskripsi dan lampiran, menentukan tenggat waktu, dan melihat daftar siswa yang sudah mengumpulkan.

### Fungsionalitas Siswa
*   **Dasbor Siswa (Gamifikasi):** Menampilkan sapaan personal, info progres level, *Daily Streak* (Login berturut-turut), dan *Leaderboard* (Peringkat poin di kelasnya saja).
*   **Akses Materi (Read):** Menampilkan dan membaca materi khusus kelasnya. Setiap pembacaan tercatat pada `log_aktivitas` dan memberi poin gamifikasi.
*   **Akses Kuis (Read & Submit):** Mengerjakan kuis interaktif secara *real-time* dan mendapatkan skor langsung saat *submit*.
*   **Akses Tugas (Read & Submit):** Melihat detail tugas dari guru dan mengunggah berkas (`file_jawaban`) penyelesaian tugas.
*   **Akses Forum Diskusi (CRUD):** Membuat topik diskusi, saling menanggapi pertanyaan (replies) antar teman sekelas, dan fitur *Like/Upvote*.

### Fungsionalitas Umum (Semua User)
*   **Autentikasi Aman:** *Login* & *Logout* dengan pengelolaan Session.
*   **Manajemen Profil:** Menu *Settings* untuk mengubah Nama dan Password personal (Proteksi Hash Bcrypt).

---

## 5. Rangkuman Integrasi Cerdas (Untuk Nilai Tambah Skripsi)
1. **Generative AI Integration:** Tidak seperti LMS konvensional, web ini menghemat waktu tenaga pendidik melalui API *Google Gemini Flash* yang dipanggil pada *Backend* (`GeminiService.php`) untuk menuliskan rancangan materi dan soal Kuis yang relevan dengan kurikulum seketika.
2. **Context-Aware Privacy:** Pendekatan arsitektur di mana Query database (`where('kelas_id', $user->kelas_id)`) diterapkan di tingkat fundamental *Controller*. Siswa dari kelas 7A mustahil melihat data diskusi, nilai, materi, maupun *leaderboard* siswa kelas 8B.
3. **Behavioral Gamification:** Sistem secara aktif "menonton" tindakan siswa (lewat *Log Aktivitas*) seperti *Login* harian, membuka modul pembelajaran, hingga mengirim komentar di forum untuk diterjemahkan menjadi poin (`point_gamifikasi`), yang dirancang untuk mengatasi masalah motivasi belajar *e-learning*.

---
*(Dokumen ini merupakan kerangka lengkap untuk dipindahkan ke dalam narasi Bab 4 Skripsi Anda. Jika membutuhkan *screenshot* kodenya, Anda bisa langsung merujuk pada controller yang bersangkutan.)*
