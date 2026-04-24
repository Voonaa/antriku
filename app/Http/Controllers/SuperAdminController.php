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
}
