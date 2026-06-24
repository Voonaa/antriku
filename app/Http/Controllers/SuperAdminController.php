<?php

namespace App\Http\Controllers;

use App\Models\Antrian;
use App\Models\Layanan;
use App\Models\Loket;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SuperAdminController extends Controller
{
    public function index()
    {
        $tenants = Tenant::withCount(['layanans', 'lokets'])
            ->with(['users' => fn($q) => $q->where('role', 'admin-instansi')])
            ->get();

        // Platform-wide statistics
        $stats = [
            'total_tenants'  => Tenant::count(),
            'total_users'    => User::where('role', '!=', 'super-admin')->count(),
            'total_antrian'  => Antrian::count(),
            'antrian_hari_ini' => Antrian::whereDate('created_at', today())->count(),
            'antrian_selesai'  => Antrian::whereDate('created_at', today())->where('status', 'done')->count(),
            'total_layanans' => Layanan::count(),
            'total_lokets'   => Loket::count(),
        ];

        return Inertia::render('SuperAdmin/Index', [
            'tenants' => $tenants,
            'stats'   => $stats,
        ]);
    }

    /** Tambah Tenant baru */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_instansi' => 'required|string|max:255',
            'slug'          => 'required|string|max:100|unique:tenants,slug|regex:/^[a-z0-9\-]+$/',
        ]);

        Tenant::create($validated);

        return redirect()->route('super-admin.dashboard')
            ->with('success', 'Instansi berhasil ditambahkan.');
    }

    /** Edit data Tenant */
    public function updateTenant(Request $request, $id)
    {
        $tenant = Tenant::findOrFail($id);

        $request->validate([
            'nama_instansi' => 'required|string|max:255',
            'slug'          => 'required|string|max:100|unique:tenants,slug,' . $id . '|regex:/^[a-z0-9\-]+$/',
        ]);

        $tenant->update($request->only('nama_instansi', 'slug'));

        return redirect()->route('super-admin.dashboard')
            ->with('success', 'Data instansi berhasil diperbarui.');
    }

    /** Hapus Tenant (cascade ke semua datanya) */
    public function destroyTenant($id)
    {
        $tenant = Tenant::findOrFail($id);
        $nama   = $tenant->nama_instansi;
        $tenant->delete();

        return redirect()->route('super-admin.dashboard')
            ->with('success', "Instansi \"{$nama}\" beserta semua datanya berhasil dihapus.");
    }

    /** Tambah Admin ke Tenant */
    public function storeAdmin(Request $request, $tenantId)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:8',
        ]);

        $tenant = Tenant::findOrFail($tenantId);

        User::create([
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'role'      => 'admin-instansi',
            'tenant_id' => $tenant->id,
        ]);

        return redirect()->route('super-admin.dashboard')
            ->with('success', 'Admin Instansi berhasil didaftarkan.');
    }

    /** Reset password Admin */
    public function resetPassword(Request $request, $userId)
    {
        $request->validate([
            'password' => 'required|min:8|confirmed',
        ]);

        $user = User::findOrFail($userId);
        $user->update(['password' => Hash::make($request->password)]);

        return redirect()->route('super-admin.dashboard')
            ->with('success', "Password {$user->name} berhasil direset.");
    }

    /** Hapus user Admin */
    public function destroyAdmin($userId)
    {
        $user = User::findOrFail($userId);
        $name = $user->name;
        $user->delete();

        return redirect()->route('super-admin.dashboard')
            ->with('success', "Akun {$name} berhasil dihapus.");
    }

    /** Reset semua antrian tenant hari ini */
    public function resetAntrian($tenantId)
    {
        $tenant = Tenant::findOrFail($tenantId);

        $count = Antrian::where('tenant_id', $tenant->id)
            ->whereDate('created_at', today())
            ->count();

        Antrian::where('tenant_id', $tenant->id)
            ->whereDate('created_at', today())
            ->delete();

        // Reset loket status ke buka
        Loket::where('tenant_id', $tenant->id)
            ->update(['status' => true]);

        return redirect()->route('super-admin.dashboard')
            ->with('success', "{$count} antrian hari ini untuk {$tenant->nama_instansi} berhasil direset.");
    }

    /** Analytics – statistik platform keseluruhan */
    public function analytics()
    {
        // Antrian per hari 7 hari terakhir
        $weeklyData = collect(range(6, 0))->map(function ($daysAgo) {
            $date = now()->subDays($daysAgo)->toDateString();
            return [
                'tanggal'  => now()->subDays($daysAgo)->format('d/m'),
                'total'    => Antrian::whereDate('created_at', $date)->count(),
                'selesai'  => Antrian::whereDate('created_at', $date)->where('status', 'done')->count(),
                'menunggu' => Antrian::whereDate('created_at', $date)->where('status', 'waiting')->count(),
            ];
        });

        // Antrian per instansi hari ini
        $byTenant = Tenant::withCount([
            'antrians as antrian_hari_ini' => fn($q) => $q->whereDate('created_at', today()),
            'antrians as antrian_selesai'  => fn($q) => $q->whereDate('created_at', today())->where('status', 'done'),
        ])->get()->map(fn($t) => [
            'nama'    => $t->nama_instansi,
            'total'   => $t->antrian_hari_ini,
            'selesai' => $t->antrian_selesai,
        ]);

        $stats = [
            'total_antrian_hari_ini' => Antrian::whereDate('created_at', today())->count(),
            'total_selesai'          => Antrian::whereDate('created_at', today())->where('status', 'done')->count(),
            'total_menunggu'         => Antrian::whereDate('created_at', today())->where('status', 'waiting')->count(),
            'total_tenants'          => Tenant::count(),
        ];

        return Inertia::render('SuperAdmin/Analytics', [
            'weeklyData' => $weeklyData,
            'byTenant'   => $byTenant,
            'stats'      => $stats,
        ]);
    }

    /** Halaman Antrian – semua antrian aktif hari ini */
    public function allQueues()
    {
        $antrians = Antrian::with(['layanan', 'loket', 'tenant'])
            ->whereDate('created_at', today())
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($a) => [
                'id'             => $a->id,
                'nomor_lengkap'  => $a->nomor_lengkap,
                'tenant'         => $a->tenant->nama_instansi ?? '-',
                'layanan'        => $a->layanan->nama_layanan ?? '-',
                'loket'          => $a->loket ? 'Loket ' . $a->loket->nomor_loket : '-',
                'status'         => $a->status,
                'waktu'          => $a->created_at->format('H:i'),
            ]);

        return Inertia::render('SuperAdmin/Queues', [
            'antrians' => $antrians,
            'stats' => [
                'total'    => $antrians->count(),
                'waiting'  => $antrians->where('status', 'waiting')->count(),
                'done'     => $antrians->where('status', 'done')->count(),
                'calling'  => $antrians->whereIn('status', ['calling', 'serving'])->count(),
            ],
        ]);
    }

    /** Halaman Instansi – detail semua instansi */
    public function allTenants()
    {
        $tenants = Tenant::withCount(['layanans', 'lokets', 'antrians'])
            ->with(['users' => fn($q) => $q->where('role', 'admin-instansi')])
            ->get()->map(fn($t) => [
                'id'             => $t->id,
                'nama_instansi'  => $t->nama_instansi,
                'slug'           => $t->slug,
                'layanans_count' => $t->layanans_count,
                'lokets_count'   => $t->lokets_count,
                'antrians_count' => $t->antrians_count,
                'admins'         => $t->users->map(fn($u) => ['name' => $u->name, 'email' => $u->email]),
                'antrian_hari_ini' => Antrian::where('tenant_id', $t->id)->whereDate('created_at', today())->count(),
            ]);

        return Inertia::render('SuperAdmin/Tenants', [
            'tenants' => $tenants,
        ]);
    }
}

