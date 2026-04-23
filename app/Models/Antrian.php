<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class Antrian extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'layanan_id',
        'loket_id',
        'token_qr',
        'nomor_urut',
        'nomor_lengkap',
        'status',
        'waktu_panggil',
        'waktu_selesai',
    ];

    protected $casts = [
        'waktu_panggil' => 'datetime',
        'waktu_selesai' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (Antrian $antrian) {
            // Generate Unique Token QR
            $antrian->token_qr = Str::uuid()->toString();

            // Auto-generate nomor_urut and nomor_lengkap if not provided
            if (!$antrian->nomor_urut) {
                $today = Carbon::today();

                $lastAntrian = self::where('tenant_id', $antrian->tenant_id)
                    ->where('layanan_id', $antrian->layanan_id)
                    ->whereDate('created_at', $today)
                    ->orderBy('nomor_urut', 'desc')
                    ->first();

                $antrian->nomor_urut = $lastAntrian ? $lastAntrian->nomor_urut + 1 : 1;

                // Load layanan if not loaded to get kode_huruf
                $layanan = Layanan::find($antrian->layanan_id);
                $kodeHuruf = $layanan ? $layanan->kode_huruf : 'Q';

                $antrian->nomor_lengkap = $kodeHuruf . '-' . str_pad($antrian->nomor_urut, 3, '0', STR_PAD_LEFT);
            }
        });
    }

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function layanan(): BelongsTo
    {
        return $this->belongsTo(Layanan::class);
    }

    public function loket(): BelongsTo
    {
        return $this->belongsTo(Loket::class);
    }
}
