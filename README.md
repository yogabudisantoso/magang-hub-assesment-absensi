# Absensi Detikcom

Sistem Absensi Magang untuk PT Detikcom - Built with Laravel 13 + React (Inertia v3, TypeScript, shadcn/ui)

## Tech Stack

- **Backend:** Laravel 13, PHP 8.4
- **Frontend:** React 19, TypeScript, Inertia v3, Tailwind CSS v4, shadcn/ui
- **Database:** MySQL 8.0
- **Build Tool:** Vite 8 (via vite-plus)
- **Container:** Docker

## Requirements

- PHP 8.4+
- Node.js 20+
- pnpm
- MySQL 8.0+
- Composer

## Installation (Local / Tanpa Docker)

### 1. Clone Repository

```bash
git clone https://github.com/username/absensi-detikcom.git
cd absensi-detikcom
```

### 2. Install Dependencies

```bash
composer install
pnpm install
```

### 3. Setup Environment

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` sesuai konfigurasi database Anda:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=absensi_detikcom
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Buat Database di phpMyAdmin

1. Buka phpMyAdmin di browser: `http://localhost/phpmyadmin`
2. Klik tab **Databases**
3. Masukkan nama database: `absensi_detikcom`
4. Klik **Create**

### 5. Jalankan Migrations & Seeders

```bash
php artisan migrate --seed
```

### 6. Buat Storage Link

```bash
php artisan storage:link
```

### 7. Jalankan Development Server

```bash
php artisan dev
```

Buka browser: `http://localhost:8000`

---

## Installation (Docker)

### 1. Clone Repository

```bash
git clone https://github.com/username/absensi-detikcom.git
cd absensi-detikcom
```

### 2. Build & Jalankan Container

```bash
docker build -t absensi-detikcom .
docker run -d --name absensi-detikcom -p 8000:8000 absensi-detikcom
```

### 3. Setup di Dalam Container

```bash
docker exec -it absensi-detikcom bash
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
pnpm install
pnpm vp build
```

### 4. Buka Browser

`http://localhost:8000`

---

## Akun Default

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@admin.com | password |
| Intern | budi@detik.com | password |
| Intern | siti@detik.com | password |
| Intern | andi@detik.com | password |

---

## Fitur

### Intern (`/intern/*`)

| URL | Fitur |
|-----|-------|
| `/intern/dashboard` | Dashboard dengan stats, status hari ini, logbook |
| `/intern/attendance/check-in` | Check in (geolocation) |
| `/intern/attendance/check-out` | Check out + daily log |
| `/intern/logbook` | Riwayat logbook |
| `/intern/logbook/create` | Submit logbook baru + upload foto |
| `/intern/leave` | Riwayat pengajuan izin |
| `/intern/leave/create` | Ajukan izin |

### Admin (`/admin/*`)

| URL | Fitur |
|-----|-------|
| `/admin/dashboard` | Dashboard overview + today's logbooks |
| `/admin/interns` | Manajemen data intern |
| `/admin/interns/create` | Tambah intern baru |
| `/admin/attendances` | Laporan kehadiran + filter |
| `/admin/attendances/export` | Export CSV kehadiran |
| `/admin/leave-requests` | Approval izin intern |
| `/admin/logbook` | Lihat semua logbook intern |
| `/admin/logbook/export` | Export CSV logbook |

---

## Database Structure

| Table | Deskripsi |
|-------|-----------|
| `roles` | Role system (admin, intern) |
| `users` | Data user dengan `role_id` FK |
| `attendances` | Data check-in/check-out |
| `daily_logs` | Ringkasan pekerjaan saat check-out |
| `leave_requests` | Pengajuan izin |
| `logbook_reports` | Logbook harian intern |
| `logbook_report_photos` | Foto bukti logbook |

---

## Development

### Build Frontend

```bash
pnpm vp build
```

### Run Migrations Fresh

```bash
php artisan migrate:fresh --seed
```

### Clear Cache

```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

---

## License

MIT License
