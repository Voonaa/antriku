<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Layanan extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'nama_layanan',
        'kode_huruf',
        'estimasi_menit',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function lokets(): HasMany
    {
        return $this->hasMany(Loket::class);
    }

    public function antrians(): HasMany
    {
        return $this->hasMany(Antrian::class);
    }
}
