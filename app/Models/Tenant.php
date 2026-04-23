<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tenant extends Model
{
    protected $fillable = [
        'nama_instansi',
        'slug',
        'logo',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function layanans(): HasMany
    {
        return $this->hasMany(Layanan::class);
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
