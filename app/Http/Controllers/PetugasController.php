<?php

namespace App\Http\Controllers;

use App\Events\QueueCalled;
use App\Models\Antrian;
use App\Models\Layanan;
use App\Models\Loket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PetugasController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        $layanans = Layanan::where('tenant_id', $user->tenant_id)->get();
        $lokets   = Loket::where('tenant_id', $user->tenant_id)->get();

        // Ambil sisa antrian (waiting)
        $waitingQueues = Antrian::with('layanan')
            ->where('tenant_id', $user->tenant_id)
            ->where('status', 'waiting')
            ->orderBy('created_at', 'asc')
            ->get();

        // Ambil antrian yang sedang dipanggil (calling/serving)
        $activeQueues = Antrian::with(['layanan', 'loket'])
            ->where('tenant_id', $user->tenant_id)
            ->whereIn('status', ['calling', 'serving'])
            ->orderBy('updated_at', 'desc')
            ->get();

        return Inertia::render('Petugas/Index', [
            'layanans'     => $layanans,
            'lokets'       => $lokets,
            'waitingQueues'=> $waitingQueues,
            'activeQueues' => $activeQueues,
        ]);
    }

    public function callNext(Request $request)
    {
        $request->validate([
            'layanan_id' => 'required|exists:layanans,id',
            'loket_id'   => 'required|exists:lokets,id',
        ]);

        $antrian = Antrian::where('layanan_id', $request->layanan_id)
            ->where('status', 'waiting')
            ->orderBy('created_at', 'asc')
            ->first();

        if (!$antrian) {
            return redirect()->back()->with('error', 'Tidak ada antrian untuk layanan ini.');
        }

        $antrian->update([
            'status'       => 'calling',
            'waktu_panggil'=> now(),
            'loket_id'     => $request->loket_id,
        ]);

        QueueCalled::dispatch($antrian);

        return redirect()->back()->with('success', 'Antrian ' . $antrian->nomor_lengkap . ' berhasil dipanggil.');
    }

    public function markAsDone($id)
    {
        $antrian = Antrian::findOrFail($id);

        $antrian->update([
            'status'      => 'done',
            'waktu_selesai'=> now(),
        ]);

        return redirect()->back()->with('success', 'Antrian selesai.');
    }

    public function skipQueue($id)
    {
        $antrian = Antrian::findOrFail($id);

        $antrian->update(['status' => 'skipped']);

        return redirect()->back()->with('success', 'Antrian dilewati.');
    }

    /**
     * Panggil ulang antrian yang sudah dipanggil (tanpa ubah status di database).
     * Berguna jika warga tidak mendengar panggilan pertama.
     */
    public function recall($id)
    {
        $antrian = Antrian::with(['layanan', 'loket'])->findOrFail($id);

        // Broadcast ulang event ke TV dan HP warga
        QueueCalled::dispatch($antrian);

        return redirect()->back()->with('success', 'Panggilan ulang untuk ' . $antrian->nomor_lengkap . ' berhasil dikirim.');
    }

    /**
     * Toggle status loket petugas: Buka ↔ Tutup (istirahat sementara).
     */
    public function toggleBreak(Request $request)
    {
        $request->validate([
            'loket_id' => 'required|exists:lokets,id',
        ]);

        $loket = Loket::findOrFail($request->loket_id);

        // Toggle: jika sedang buka (true) → tutup (false), dan sebaliknya
        $loket->update(['status' => !$loket->status]);

        $statusText = $loket->status ? 'dibuka kembali' : 'istirahat';

        return redirect()->back()->with('success', "Loket {$loket->nomor_loket} berhasil {$statusText}.");
    }
}
