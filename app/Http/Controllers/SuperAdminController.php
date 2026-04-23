<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuperAdminController extends Controller
{
    public function index()
    {
        // Ambil semua tenant beserta jumlah layanan dan loketnya
        $tenants = Tenant::withCount(['layanans', 'lokets'])->get();

        return Inertia::render('SuperAdmin/Index', [
            'tenants' => $tenants,
        ]);
    }
}
