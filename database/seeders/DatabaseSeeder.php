<?php

namespace Database\Seeders;

use App\Models\Layanan;
use App\Models\Loket;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $defaultPassword = Hash::make('password');

        // 1. Buat Super Admin (Tanpa Tenant)
        User::create([
            'name' => 'Super Administrator',
            'email' => 'superadmin@antriku.com',
            'password' => $defaultPassword,
            'role' => 'super-admin',
            'tenant_id' => null,
        ]);

        // 2. Buat Data Tenant 1: Dinas Kependudukan
        $tenant1 = Tenant::create([
            'nama_instansi' => 'Dinas Kependudukan',
            'slug' => Str::slug('Dinas Kependudukan'),
        ]);

        // -- User Tenant 1
        User::create([
            'name' => 'Admin Dukcapil',
            'email' => 'admin@dukcapil.com',
            'password' => $defaultPassword,
            'role' => 'admin-instansi',
            'tenant_id' => $tenant1->id,
        ]);

        User::create([
            'name' => 'Petugas Dukcapil 1',
            'email' => 'petugas1@dukcapil.com',
            'password' => $defaultPassword,
            'role' => 'petugas',
            'tenant_id' => $tenant1->id,
        ]);

        User::create([
            'name' => 'Petugas Dukcapil 2',
            'email' => 'petugas2@dukcapil.com',
            'password' => $defaultPassword,
            'role' => 'petugas',
            'tenant_id' => $tenant1->id,
        ]);

        // -- Layanan Tenant 1
        $layananKTP = Layanan::create([
            'tenant_id' => $tenant1->id,
            'nama_layanan' => 'Pembuatan KTP',
            'kode_huruf' => 'A',
            'estimasi_menit' => 15,
        ]);

        $layananKK = Layanan::create([
            'tenant_id' => $tenant1->id,
            'nama_layanan' => 'Kartu Keluarga',
            'kode_huruf' => 'B',
            'estimasi_menit' => 20,
        ]);

        // -- Loket Tenant 1
        Loket::create([
            'tenant_id' => $tenant1->id,
            'layanan_id' => $layananKTP->id,
            'nomor_loket' => 'Loket 1',
            'status' => true,
        ]);

        Loket::create([
            'tenant_id' => $tenant1->id,
            'layanan_id' => $layananKK->id,
            'nomor_loket' => 'Loket 2',
            'status' => true,
        ]);


        // 3. Buat Data Tenant 2: Dinas Perizinan
        $tenant2 = Tenant::create([
            'nama_instansi' => 'Dinas Perizinan',
            'slug' => Str::slug('Dinas Perizinan'),
        ]);

        // -- User Tenant 2
        User::create([
            'name' => 'Admin Perizinan',
            'email' => 'admin@perizinan.com',
            'password' => $defaultPassword,
            'role' => 'admin-instansi',
            'tenant_id' => $tenant2->id,
        ]);

        User::create([
            'name' => 'Petugas Perizinan 1',
            'email' => 'petugas1@perizinan.com',
            'password' => $defaultPassword,
            'role' => 'petugas',
            'tenant_id' => $tenant2->id,
        ]);

        User::create([
            'name' => 'Petugas Perizinan 2',
            'email' => 'petugas2@perizinan.com',
            'password' => $defaultPassword,
            'role' => 'petugas',
            'tenant_id' => $tenant2->id,
        ]);

        // -- Layanan Tenant 2
        $layananIzinUsaha = Layanan::create([
            'tenant_id' => $tenant2->id,
            'nama_layanan' => 'Izin Usaha',
            'kode_huruf' => 'C',
            'estimasi_menit' => 30,
        ]);

        $layananIzinBangunan = Layanan::create([
            'tenant_id' => $tenant2->id,
            'nama_layanan' => 'Izin Bangunan',
            'kode_huruf' => 'D',
            'estimasi_menit' => 45,
        ]);

        // -- Loket Tenant 2
        Loket::create([
            'tenant_id' => $tenant2->id,
            'layanan_id' => $layananIzinUsaha->id,
            'nomor_loket' => 'Loket 1',
            'status' => true,
        ]);

        Loket::create([
            'tenant_id' => $tenant2->id,
            'layanan_id' => $layananIzinBangunan->id,
            'nomor_loket' => 'Loket 2',
            'status' => true,
        ]);
    }
}
