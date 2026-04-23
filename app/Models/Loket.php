<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Loket extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'layanan_id',
        'nomor_loket',
        'status',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function layanan(): BelongsTo
    {
        return $this->belongsTo(Layanan::class);
    }

    public function antrians(): HasMany
    {
        return $this->hasMany(Antrian::class);
    }
}
