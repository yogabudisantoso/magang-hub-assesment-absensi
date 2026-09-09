<?php

namespace Database\Seeders;

use App\Models\LogbookReport;
use App\Models\LogbookReportPhoto;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(RoleSeeder::class);

        $adminRole = Role::where('slug', 'admin')->first();
        $internRole = Role::where('slug', 'intern')->first();

        User::create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('password'),
            'role_id' => $adminRole->id,
            'email_verified_at' => now(),
        ]);

        $interns = [
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@detik.com',
                'start_date' => '2026-09-01',
                'end_date' => '2026-12-31',
            ],
            [
                'name' => 'Siti Rahayu',
                'email' => 'siti@detik.com',
                'start_date' => '2026-09-01',
                'end_date' => '2026-12-31',
            ],
            [
                'name' => 'Andi Wijaya',
                'email' => 'andi@detik.com',
                'start_date' => '2026-09-01',
                'end_date' => '2026-12-31',
            ],
        ];

        foreach ($interns as $intern) {
            User::create([
                ...$intern,
                'password' => Hash::make('password'),
                'role_id' => $internRole->id,
                'email_verified_at' => now(),
            ]);
        }

        $reportData = [
            ['intern' => 'budi@detik.com', 'date' => '2026-09-01', 'desc' => 'Hari pertama orientasi. Mengenal lingkungan kantor, tim developer, dan tools yang digunakan. Setup development environment (PHP, Composer, Node.js, VS Code).'],
            ['intern' => 'budi@detik.com', 'date' => '2026-09-02', 'desc' => 'Mempelajari codebase project absensi. Membaca dokumentasi API dan struktur database. Mulai familiar dengan Laravel dan React.'],
            ['intern' => 'budi@detik.com', 'date' => '2026-09-03', 'desc' => 'Membuat migration pertama untuk tabel users. Belajar tentang Eloquent ORM dan relationship di Laravel.'],
            ['intern' => 'siti@detik.com', 'date' => '2026-09-01', 'desc' => 'Orientasi hari pertama. Setup akun email dan akses ke repository GitHub. Install dependencies yang diperlukan.'],
            ['intern' => 'siti@detik.com', 'date' => '2026-09-02', 'desc' => 'Mempelajari desain UI/UX menggunakan Figma. Membuat wireframe untuk halaman dashboard admin.'],
            ['intern' => 'siti@detik.com', 'date' => '2026-09-03', 'desc' => 'Implementasi komponen UI menggunakan React dan Tailwind CSS. Membuat button, card, dan form components.'],
            ['intern' => 'andi@detik.com', 'date' => '2026-09-01', 'desc' => 'Hari pertama magang. Kenalan dengan tim dan mentor. Setup laptop dengan environment yang sesuai.'],
            ['intern' => 'andi@detik.com', 'date' => '2026-09-02', 'desc' => 'Belajar testing menggunakan PHPUnit. Menulis unit test untuk validasi form login dan registrasi.'],
            ['intern' => 'andi@detik.com', 'date' => '2026-09-03', 'desc' => 'Membuat API endpoint untuk CRUD data intern. Implementasi middleware autentikasi dan autorisasi.'],
        ];

        foreach ($reportData as $data) {
            $user = User::where('email', $data['intern'])->first();
            if ($user) {
                LogbookReport::create([
                    'user_id' => $user->id,
                    'date' => $data['date'],
                    'description' => $data['desc'],
                ]);
            }
        }
    }
}
