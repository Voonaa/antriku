<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('tenant.{tenant_id}', function ($user, $tenant_id) {
    // Hanya user (petugas/admin) yang tergabung di tenant ini yang berhak listen,
    // ATAU jika user adalah super-admin.
    return (int) $user->tenant_id === (int) $tenant_id || $user->role === 'super-admin';
});
