<?php

namespace App\Http\Controllers;

use App\Models\Antrian;
use App\Models\Layanan;
use App\Models\Loket;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function index()
    {
        // 1. Ambil semua antrian HARI INI untuk tenant yang sedang aktif
        $todayQueues = Antrian::whereDate('created_at', Carbon::today())->get();

        // 2. Hitung Metrik Utama
        $totalAntrian  = $todayQueues->count();
        $totalSelesai  = $todayQueues->where('status', 'done')->count();
        $totalMenunggu = $todayQueues->where('status', 'waiting')->count();

        // 3. Hitung Rata-rata Waktu Tunggu (dalam menit)
        $queuesWithWaitTime = $todayQueues->filter(fn($q) => $q->waktu_panggil !== null);

        $averageWaitTime = 0;
        if ($queuesWithWaitTime->count() > 0) {
            $totalMinutes = $queuesWithWaitTime->reduce(function ($carry, $queue) {
                return $carry + Carbon::parse($queue->created_at)->diffInMinutes(Carbon::parse($queue->waktu_panggil));
            }, 0);
            $averageWaitTime = round($totalMinutes / $queuesWithWaitTime->count());
        }

        // 4. Ambil Data Loket & Kinerjanya Hari Ini
        $tenantId = auth()->user()->tenant_id;

        $lokets = Loket::with('layanan')
            ->where('tenant_id', $tenantId)
            ->get()
            ->map(function ($loket) use ($todayQueues) {
                $dilayani = $todayQueues->where('loket_id', $loket->id)
                    ->whereIn('status', ['calling', 'serving', 'done'])
                    ->count();
                return [
                    'id'             => $loket->id,
                    'nomor_loket'    => $loket->nomor_loket,
                    'status'         => $loket->status, // boolean: true=buka, false=istirahat/tutup
                    'nama_layanan'   => $loket->layanan ? $loket->layanan->nama_layanan : '-',
                    'kode_huruf'     => $loket->layanan ? $loket->layanan->kode_huruf : '-',
                    'jumlah_dilayani'=> $dilayani,
                ];
            });

        // 5. Daftar Layanan (filtered by TenantScope via BelongsToTenant trait)
        $layanans = Layanan::all();

        // 6. Daftar Petugas untuk tenant ini
        $staff = User::where('role', 'petugas')
            ->where('tenant_id', auth()->user()->tenant_id)
            ->get(['id', 'name', 'email']);

        return Inertia::render('Admin/Index', [
            'metrics' => [
                'total_hari_ini' => $totalAntrian,
                'total_selesai'  => $totalSelesai,
                'sisa_menunggu'  => $totalMenunggu,
                'avg_wait_time'  => $averageWaitTime,
            ],
            'lokets'   => $lokets,
            'layanans' => $layanans,
            'staff'    => $staff,
            'tenant'   => Tenant::find(auth()->user()->tenant_id),
        ]);
    }

    public function storeLayanan(Request $request)
    {
        $request->validate([
            'nama_layanan'   => 'required|string|max:255',
            'kode_huruf'     => ['required', 'string', 'max:5', 'regex:/^[A-Za-z]+$/'],
            'estimasi_menit' => 'required|integer|min:1',
        ]);

        Layanan::create([
            'tenant_id'      => auth()->user()->tenant_id,
            'nama_layanan'   => $request->nama_layanan,
            'kode_huruf'     => strtoupper($request->kode_huruf),
            'estimasi_menit' => $request->estimasi_menit,
        ]);

        return redirect()->route('admin.dashboard')
            ->with('success', 'Layanan berhasil ditambahkan.');
    }

    public function destroyLayanan($id)
    {
        $layanan = Layanan::withoutGlobalScopes()->findOrFail($id);

        // Pastikan layanan milik tenant admin yang sedang login
        if ($layanan->tenant_id !== auth()->user()->tenant_id) {
            abort(403, 'Akses ditolak.');
        }

        $layanan->delete();

        return redirect()->route('admin.dashboard')
            ->with('success', 'Layanan berhasil dihapus.');
    }

    public function storeStaff(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:8',
        ]);

        User::create([
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'role'      => 'petugas',
            'tenant_id' => auth()->user()->tenant_id,
        ]);

        return redirect()->route('admin.dashboard')
            ->with('success', 'Petugas berhasil didaftarkan.');
    }

    public function storeLoket(Request $request)
    {
        $request->validate([
            'nomor_loket' => 'required|string|max:20',
            'layanan_id'  => 'required|exists:layanans,id',
        ]);

        Loket::create([
            'tenant_id'   => auth()->user()->tenant_id,
            'layanan_id'  => $request->layanan_id,
            'nomor_loket' => $request->nomor_loket,
            'status'      => true, // default: buka
        ]);

        return redirect()->route('admin.dashboard')
            ->with('success', 'Loket berhasil ditambahkan.');
    }

    public function destroyLoket($id)
    {
        $loket = Loket::withoutGlobalScopes()->findOrFail($id);

        if ($loket->tenant_id !== auth()->user()->tenant_id) {
            abort(403, 'Akses ditolak.');
        }

        $loket->delete();

        return redirect()->route('admin.dashboard')
            ->with('success', 'Loket berhasil dihapus.');
    }

    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|file|mimes:png,jpg,jpeg,svg,webp|max:2048',
        ]);

        $tenant = Tenant::findOrFail(auth()->user()->tenant_id);

        // Hapus logo lama jika ada
        if ($tenant->logo) {
            $oldPath = str_replace('/storage/', '', parse_url($tenant->logo, PHP_URL_PATH));
            Storage::disk('public')->delete($oldPath);
        }

        // Simpan logo baru ke storage/app/public/logos/
        $path = $request->file('logo')->store('logos', 'public');

        // Simpan URL publik ke database
        $tenant->update(['logo' => Storage::url($path)]);

        return redirect()->route('admin.dashboard')
            ->with('success', 'Logo instansi berhasil diperbarui.');
    }
}
