# 📋 PROJECT BRIEF: INTERNSHIP ATTENDANCE SYSTEM

Sistem manajemen presensi dan produktivitas harian peserta magang berbasis web (*lightweight & responsive*). Proyek ini dirancang untuk pencatatan absensi yang terverifikasi, pelaporan kerja harian, serta pengawasan terintegrasi untuk Admin/HR.

---

## 🎯 OBJECTIVE & ROLES

### 1. Intern (Peserta Magang)
* **Check-In & Check-Out Harian:** Melakukan presensi masuk dan pulang secara *real-time*.
* **Daily Task Log:** Wajib mengisi ringkasan laporan pekerjaan harian saat *check-out*.
* **Leave/Sick Request:** Mengajukan izin atau sakit dengan lampiran dokumen pendukung.
* **Personal Dashboard:** Memantau statistik kehadiran, total jam kerja, dan sisa masa magang.

### 2. Admin / HR / Mentor
* **Intern Management:** Mengelola data akun peserta magang (CRUD, periode magang, divisi).
* **Attendance Monitoring:** Melihat daftar peserta dan rekapitulasi laporan presensi secara *real-time*.
* **Approval System:** Meninjau dan menyetujui/menolak pengajuan izin atau sakit.
* **Daily Log Review:** Membaca dan mengevaluasi ringkasan pekerjaan harian peserta magang.
* **Report Exporting:** Mengunduh rekap laporan kehadiran dalam format Excel (.xlsx) atau PDF.

---

## ⚡ CORE FEATURES & IMPROVEMENTS

### A. Core Attendance Features (Fitur Utama)
1. **Pencatatan Presensi Harian (Check-In & Check-Out):**
   * Presensi berbasis *timestamp* otomatis (lokal server/WIB).
   * **Validation Rules:** Mencegah *double check-in* pada hari yang sama dan melarang *check-out* tanpa *check-in*.
   * Kalkulasi jam kerja harian & penentuan status keterlambatan jika melewati *grace period* (misal: > 08.00 WIB).

2. **Admin Dashboard & Attendance Reporting:**
   * Listing peserta magang beserta status *real-time* hari ini (*Present, Late, Absent, On Leave*).
   * Laporan terfilter berdasarkan rentang tanggal, status, atau nama peserta magang.

### B. Feature Improvements (Fitur Plus / Value-Adds)
1. **Anti-Fraud & Verification:**
   * **Geofencing Check:** Memvalidasi koordinat lokasi (*Latitude/Longitude*) perangkat dengan radius kantor (maks. 100 meter).
   * **Selfie / Photo Proof:** Mengambil foto *live* dari kamera saat *check-in* untuk mencegah kecurangan (titip absen).

2. **Productivity & HR Tools:**
   * **Daily Activity Log (Jurnal Harian):** Form input ringkasan pekerjaan sebelum tombol *check-out* aktif.
   * **Leave Request System:** Modul pengajuan izin/sakit beserta unggah bukti (surat dokter/surat izin).

3. **Analytics & UX Enhancements:**
   * **Bento Analytics Dashboard:** Visualisasi data ringkas (Total Intern, % Kehadiran, Jumlah Terlambat).
   * **One-Click Export:** Ekspor laporan presensi dan jurnal harian ke Excel/PDF.

---

## 🛠️ DATABASE SCHEMA

```sql
-- 1. Table: Users
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'intern') DEFAULT 'intern',
    start_date DATE NULL,
    end_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table: Attendances
CREATE TABLE attendances (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    date DATE NOT NULL,
    check_in_time TIME NOT NULL,
    check_out_time TIME NULL,
    status ENUM('present', 'late', 'absent', 'on_leave') DEFAULT 'present',
    latitude DECIMAL(10, 8) NULL,
    longitude DECIMAL(11, 8) NULL,
    photo_path VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Table: Daily Logs
CREATE TABLE daily_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    attendance_id BIGINT NOT NULL,
    task_summary TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (attendance_id) REFERENCES attendances(id) ON DELETE CASCADE
);

-- 4. Table: Leave Requests
CREATE TABLE leave_requests (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    attachment_path VARCHAR(255) NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🏗️ TECHNICAL ARCHITECTURE & AI PROMPTING RULES

Bila Anda meminta AI untuk mengimplementasikan kode dari README ini, instruksikan aturan berikut:

1. **Modular Architecture:** Gunakan pemisahan layer yang jelas (Controller / Service / Repository).
2. **Clean Code Policy:** Maksimal **~200 baris kode per file**. Split file jika mulai terlalu panjang untuk menjaga maintainability.
3. **UI/UX Style:** Layout bergaya **Bento Grid Layout**, modern, bersih, dan menggunakan skema warna teratur (*muted accents*).
4. **Security & Validation:**
   * Wajib implementasi **Role-Based Access Control (RBAC)** middleware (`admin` vs `intern`).
   * Password disimpan menggunakan enkripsi aman (`Bcrypt` / `Argon2`).
   * Terapkan sanitasi input untuk mencegah SQL Injection & XSS.

---

## 🚀 GETTING STARTED INSTRUCTIONS FOR AI

> *"Generate the full application structure, database migrations, authentication system, and API endpoints or views based on the specs defined in this README.md file."*