<?php

namespace App\Http\Controllers;

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
        $tenants = Tenant::withCount(['layanans', 'lokets'])->with('users')->get();

        return Inertia::render('SuperAdmin/Index', [
            'tenants' => $tenants,
        ]);
    }

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
}
