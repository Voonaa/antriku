<?php

namespace App\Http\Controllers;

use App\Models\Antrian;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class PublicQueueController extends Controller
{
    public function track($token)
    {
        // Temukan tiket berdasarkan token tanpa scope tenant (karena ini public)
        // Kita temporarily nonaktifkan TenantScope
        $ticket = Antrian::withoutGlobalScopes()->with(['layanan', 'tenant', 'loket'])
            ->where('token_qr', $token)
            ->firstOrFail();

        $tenantId = $ticket->tenant_id;
        $layananId = $ticket->layanan_id;

        // Hitung sisa antrian di depan (yang statusnya waiting dan dibuat sebelum tiket ini)
        $sisaAntrian = Antrian::withoutGlobalScopes()
            ->where('tenant_id', $tenantId)
            ->where('layanan_id', $layananId)
            ->where('status', 'waiting')
            ->where('created_at', '<', $ticket->created_at)
            ->whereDate('created_at', Carbon::today())
            ->count();

        // Ambil info antrian yang sedang dipanggil saat ini di layanan tersebut
        $currentServing = Antrian::withoutGlobalScopes()
            ->with('loket')
            ->where('tenant_id', $tenantId)
            ->where('layanan_id', $layananId)
            ->whereIn('status', ['calling', 'serving'])
            ->whereDate('created_at', Carbon::today())
            ->orderBy('waktu_panggil', 'desc')
            ->first();

        return Inertia::render('Public/Track', [
            'ticket' => $ticket,
            'sisaAntrian' => $sisaAntrian,
            'currentServing' => $currentServing,
            'tenant' => $ticket->tenant
        ]);
    }
}
