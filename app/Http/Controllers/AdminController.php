<?php

namespace App\Http\Controllers;

use App\Models\Antrian;
use App\Models\Loket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function index()
    {
        // 1. Ambil semua antrian HARI INI untuk tenant yang sedang aktif
        $todayQueues = Antrian::whereDate('created_at', Carbon::today())->get();

        // 2. Hitung Metrik Utama
        $totalAntrian = $todayQueues->count();
        $totalSelesai = $todayQueues->where('status', 'done')->count();
        $totalMenunggu = $todayQueues->where('status', 'waiting')->count();

        // 3. Hitung Rata-rata Waktu Tunggu (dalam menit)
        $queuesWithWaitTime = $todayQueues->filter(function ($queue) {
            return $queue->waktu_panggil !== null;
        });

        $averageWaitTime = 0;
        if ($queuesWithWaitTime->count() > 0) {
            $totalMinutes = $queuesWithWaitTime->reduce(function ($carry, $queue) {
                $created = Carbon::parse($queue->created_at);
                $called = Carbon::parse($queue->waktu_panggil);
                return $carry + $created->diffInMinutes($called);
            }, 0);
            
            $averageWaitTime = round($totalMinutes / $queuesWithWaitTime->count());
        }

        // 4. Ambil Data Loket & Kinerjanya Hari Ini
        // Kita hitung jumlah antrian yang dilayani oleh masing-masing loket
        $lokets = Loket::with('layanan')->get()->map(function ($loket) use ($todayQueues) {
            $dilayani = $todayQueues->where('loket_id', $loket->id)
                                    ->whereIn('status', ['calling', 'serving', 'done'])
                                    ->count();
            return [
                'id' => $loket->id,
                'nomor_loket' => $loket->nomor_loket,
                'status' => $loket->status,
                'nama_layanan' => $loket->layanan ? $loket->layanan->nama_layanan : '-',
                'jumlah_dilayani' => $dilayani
            ];
        });

        return Inertia::render('Admin/Dashboard', [
            'metrics' => [
                'total_hari_ini' => $totalAntrian,
                'total_selesai' => $totalSelesai,
                'sisa_menunggu' => $totalMenunggu,
                'avg_wait_time' => $averageWaitTime,
            ],
            'lokets' => $lokets
        ]);
    }
}
