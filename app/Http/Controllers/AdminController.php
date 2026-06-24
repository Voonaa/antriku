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
                    'layanan_id'     => $loket->layanan_id,
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

    public function updateLayanan(Request $request, $id)
    {
        $request->validate([
            'nama_layanan'   => 'required|string|max:255',
            'kode_huruf'     => ['required', 'string', 'max:5', 'regex:/^[A-Za-z]+$/'],
            'estimasi_menit' => 'required|integer|min:1',
        ]);

        $layanan = Layanan::withoutGlobalScopes()->findOrFail($id);

        if ($layanan->tenant_id !== auth()->user()->tenant_id) {
            abort(403, 'Akses ditolak.');
        }

        $layanan->update([
            'nama_layanan'   => $request->nama_layanan,
            'kode_huruf'     => strtoupper($request->kode_huruf),
            'estimasi_menit' => $request->estimasi_menit,
        ]);

        return redirect()->route('admin.dashboard')
            ->with('success', 'Layanan berhasil diperbarui.');
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

    public function updateLoket(Request $request, $id)
    {
        $request->validate([
            'nomor_loket' => 'required|string|max:20',
            'layanan_id'  => 'required|exists:layanans,id',
        ]);

        $loket = Loket::withoutGlobalScopes()->findOrFail($id);

        if ($loket->tenant_id !== auth()->user()->tenant_id) {
            abort(403, 'Akses ditolak.');
        }

        $loket->update([
            'layanan_id'  => $request->layanan_id,
            'nomor_loket' => $request->nomor_loket,
        ]);

        return redirect()->route('admin.dashboard')
            ->with('success', 'Loket berhasil diperbarui.');
    }

    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|file|mimes:png,jpg,jpeg,svg,webp|max:2048',
        ]);

        $tenant = Tenant::findOrFail(auth()->user()->tenant_id);

        if ($tenant->logo) {
            $oldPath = str_replace('/storage/', '', parse_url($tenant->logo, PHP_URL_PATH));
            Storage::disk('public')->delete($oldPath);
        }

        $path = $request->file('logo')->store('logos', 'public');
        $tenant->update(['logo' => Storage::url($path)]);

        return redirect()->route('admin.dashboard')
            ->with('success', 'Logo instansi berhasil diperbarui.');
    }

    public function updateYoutubeUrl(Request $request)
    {
        $request->validate([
            'youtube_url' => 'nullable|url|max:500',
        ]);

        $tenant = Tenant::findOrFail(auth()->user()->tenant_id);
        $tenant->update(['youtube_url' => $request->youtube_url]);

        return redirect()->route('admin.dashboard')
            ->with('success', 'URL Video YouTube berhasil disimpan.');
    }

    public function analytics()
    {
        $tenantId = auth()->user()->tenant_id;

        $weeklyData = collect(range(6, 0))->map(function ($daysAgo) use ($tenantId) {
            $date = now()->subDays($daysAgo)->toDateString();
            $antrians = Antrian::where('tenant_id', $tenantId)->whereDate('created_at', $date);
            return [
                'tanggal'  => now()->subDays($daysAgo)->format('d/m'),
                'total'    => (clone $antrians)->count(),
                'selesai'  => (clone $antrians)->where('status', 'done')->count(),
                'menunggu' => (clone $antrians)->where('status', 'waiting')->count(),
            ];
        });

        $byLayanan = Layanan::where('tenant_id', $tenantId)->get()->map(function ($l) use ($tenantId) {
            return [
                'nama'  => $l->nama_layanan,
                'total' => Antrian::where('tenant_id', $tenantId)
                    ->where('layanan_id', $l->id)
                    ->whereDate('created_at', today())
                    ->count(),
            ];
        });

        $stats = [
            'total_hari_ini' => Antrian::where('tenant_id', $tenantId)->whereDate('created_at', today())->count(),
            'total_selesai'  => Antrian::where('tenant_id', $tenantId)->whereDate('created_at', today())->where('status', 'done')->count(),
            'total_menunggu' => Antrian::where('tenant_id', $tenantId)->whereDate('created_at', today())->where('status', 'waiting')->count(),
            'total_layanan'  => Layanan::where('tenant_id', $tenantId)->count(),
        ];

        return Inertia::render('Admin/Analytics', [
            'weeklyData' => $weeklyData,
            'byLayanan'  => $byLayanan,
            'stats'      => $stats,
        ]);
    }

    public function queues()
    {
        $tenantId = auth()->user()->tenant_id;

        $antrians = Antrian::with(['layanan', 'loket'])
            ->where('tenant_id', $tenantId)
            ->whereDate('created_at', today())
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($a) => [
                'id'            => $a->id,
                'nomor_lengkap' => $a->nomor_lengkap,
                'layanan'       => $a->layanan->nama_layanan ?? '-',
                'loket'         => $a->loket ? 'Loket ' . $a->loket->nomor_loket : '-',
                'status'        => $a->status,
                'waktu'         => $a->created_at->format('H:i'),
                'waktu_panggil' => $a->waktu_panggil ? \Carbon\Carbon::parse($a->waktu_panggil)->format('H:i') : '-',
            ]);

        return Inertia::render('Admin/Queues', [
            'antrians' => $antrians,
            'stats' => [
                'total'   => $antrians->count(),
                'waiting' => $antrians->where('status', 'waiting')->count(),
                'done'    => $antrians->where('status', 'done')->count(),
                'calling' => $antrians->whereIn('status', ['calling', 'serving'])->count(),
            ],
        ]);
    }

    public function downloadLaporan(Request $request)
    {
        $tenantId = auth()->user()->tenant_id;
        $tanggal  = $request->get('tanggal', today()->toDateString());
        $filename = 'laporan-antrian-' . $tanggal . '.xlsx';

        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\AntrianExport($tenantId, $tanggal),
            $filename
        );
    }
}
