<?php

namespace App\Http\Controllers;

use App\Events\QueueCalled;
use App\Models\Antrian;
use Illuminate\Http\Request;

class PetugasController extends Controller
{
    public function callNext(Request $request)
    {
        $request->validate([
            'layanan_id' => 'required|exists:layanans,id',
            'loket_id' => 'required|exists:lokets,id',
        ]);

        // Cari antrian terlama yang masih waiting untuk layanan ini
        $antrian = Antrian::where('layanan_id', $request->layanan_id)
            ->where('status', 'waiting')
            ->orderBy('created_at', 'asc')
            ->first();

        if (!$antrian) {
            return response()->json(['message' => 'Tidak ada antrian.'], 404);
        }

        $antrian->update([
            'status' => 'calling',
            'waktu_panggil' => now(),
            'loket_id' => $request->loket_id,
        ]);

        // Dispatch Event Broadcasting Reverb
        QueueCalled::dispatch($antrian);

        return response()->json([
            'success' => true,
            'message' => 'Antrian dipanggil',
            'data' => $antrian,
        ]);
    }

    public function markAsDone($id)
    {
        $antrian = Antrian::findOrFail($id);
        
        $antrian->update([
            'status' => 'done',
            'waktu_selesai' => now(),
        ]);

        return response()->json(['success' => true]);
    }

    public function skipQueue($id)
    {
        $antrian = Antrian::findOrFail($id);

        $antrian->update([
            'status' => 'skipped',
        ]);

        return response()->json(['success' => true]);
    }
}
