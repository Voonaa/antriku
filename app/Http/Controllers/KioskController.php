<?php

namespace App\Http\Controllers;

use App\Models\Antrian;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KioskController extends Controller
{
    public function showInstansi($slug)
    {
        $tenant = Tenant::with('layanans')->where('slug', $slug)->firstOrFail();

        return Inertia::render('Kiosk/Index', [
            'tenant' => $tenant
        ]);
    }

    public function showTvDisplay($slug)
    {
        $tenant = Tenant::where('slug', $slug)->firstOrFail();

        return Inertia::render('TV/Display', [
            'tenant' => $tenant
        ]);
    }

    public function takeTicket(Request $request)
    {
        $request->validate([
            'tenant_id' => 'required|exists:tenants,id',
            'layanan_id' => 'required|exists:layanans,id',
        ]);

        $antrian = Antrian::create([
            'tenant_id' => $request->tenant_id,
            'layanan_id' => $request->layanan_id,
            'status' => 'waiting',
        ]);

        return response()->json([
            'success' => true,
            'ticket' => $antrian,
        ]);
    }
}
