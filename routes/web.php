<?php

use App\Http\Controllers\KioskController;
use App\Http\Controllers\PetugasController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $tenants = \App\Models\Tenant::all();
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'tenants' => $tenants,
    ]);
});

Route::get('/terms', function () {
    return Inertia::render('Static/Terms');
})->name('terms');

Route::get('/privacy', function () {
    return Inertia::render('Static/Privacy');
})->name('privacy');

Route::get('/status', function () {
    return Inertia::render('Static/Status');
})->name('status');

Route::get('/support', function () {
    return Inertia::render('Static/Support');
})->name('support');
Route::get('/dashboard', function () {
    $role = auth()->user()->role;
    if ($role === 'super-admin') return redirect()->route('super-admin.dashboard');
    if ($role === 'admin-instansi') return redirect()->route('admin.dashboard');
    if ($role === 'petugas') return redirect()->route('petugas.dashboard');
    abort(403);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/settings', function () {
        return Inertia::render('Settings');
    })->name('settings');
});
// Kiosk Routes (Public)
Route::prefix('kiosk')->group(function () {
    Route::get('/{slug}', [KioskController::class, 'showInstansi'])->name('kiosk.show');
    Route::post('/ticket', [KioskController::class, 'takeTicket'])->middleware('throttle:3,1')->name('kiosk.ticket');
});

// Public Live Tracking
Route::get('/track/{token}', [\App\Http\Controllers\PublicQueueController::class, 'track'])->name('track.show');

// TV Display Route (Protected by Auth)
Route::middleware(['auth'])->group(function () {
    Route::get('/tv/{slug}', [KioskController::class, 'showTvDisplay'])->name('tv.show');
});

// Super Admin Routes (Protected)
Route::middleware(['auth'])->prefix('super-admin')->name('super-admin.')->group(function () {
    Route::get('/dashboard',                   [\App\Http\Controllers\SuperAdminController::class, 'index'])->name('dashboard');
    // Tenant CRUD
    Route::post('/tenants',                    [\App\Http\Controllers\SuperAdminController::class, 'store'])->name('tenants.store');
    Route::put('/tenants/{id}',                [\App\Http\Controllers\SuperAdminController::class, 'updateTenant'])->name('tenants.update');
    Route::delete('/tenants/{id}',             [\App\Http\Controllers\SuperAdminController::class, 'destroyTenant'])->name('tenants.destroy');
    // Admin management
    Route::post('/tenants/{id}/admins',        [\App\Http\Controllers\SuperAdminController::class, 'storeAdmin'])->name('tenants.admins.store');
    Route::put('/admins/{userId}/reset-pass',  [\App\Http\Controllers\SuperAdminController::class, 'resetPassword'])->name('admins.reset-password');
    Route::delete('/admins/{userId}',          [\App\Http\Controllers\SuperAdminController::class, 'destroyAdmin'])->name('admins.destroy');
    // Tools
    Route::post('/tenants/{id}/reset-antrian', [\App\Http\Controllers\SuperAdminController::class, 'resetAntrian'])->name('tenants.reset-antrian');
    // Analytics & Pages
    Route::get('/analytics', [\App\Http\Controllers\SuperAdminController::class, 'analytics'])->name('analytics');
    Route::get('/queues',    [\App\Http\Controllers\SuperAdminController::class, 'allQueues'])->name('queues');
    Route::get('/tenants',   [\App\Http\Controllers\SuperAdminController::class, 'allTenants'])->name('tenants');
    
    // User Management
    Route::resource('users', \App\Http\Controllers\SuperAdminUserController::class)->except(['create', 'show', 'edit']);
});

// Admin Routes (Protected)
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\AdminController::class, 'index'])->name('dashboard');
    Route::post('/layanans', [\App\Http\Controllers\AdminController::class, 'storeLayanan'])->name('layanans.store');
    Route::put('/layanans/{id}', [\App\Http\Controllers\AdminController::class, 'updateLayanan'])->name('layanans.update');
    Route::delete('/layanans/{id}', [\App\Http\Controllers\AdminController::class, 'destroyLayanan'])->name('layanans.destroy');
    Route::post('/lokets', [\App\Http\Controllers\AdminController::class, 'storeLoket'])->name('lokets.store');
    Route::put('/lokets/{id}', [\App\Http\Controllers\AdminController::class, 'updateLoket'])->name('lokets.update');
    Route::delete('/lokets/{id}', [\App\Http\Controllers\AdminController::class, 'destroyLoket'])->name('lokets.destroy');
    Route::post('/staff', [\App\Http\Controllers\AdminController::class, 'storeStaff'])->name('staff.store');
    Route::post('/logo', [\App\Http\Controllers\AdminController::class, 'uploadLogo'])->name('logo.upload');
    Route::post('/youtube', [\App\Http\Controllers\AdminController::class, 'updateYoutubeUrl'])->name('youtube.update');
    // Analytics, Queues & Export
    Route::get('/analytics', [\App\Http\Controllers\AdminController::class, 'analytics'])->name('analytics');
    Route::get('/queues',    [\App\Http\Controllers\AdminController::class, 'queues'])->name('queues');
    Route::get('/laporan',   [\App\Http\Controllers\AdminController::class, 'downloadLaporan'])->name('laporan.download');
});

// Petugas Routes (Protected)
Route::middleware(['auth'])->prefix('petugas')->name('petugas.')->group(function () {
    Route::get('/dashboard', [PetugasController::class, 'index'])->name('dashboard');
    Route::post('/call', [PetugasController::class, 'callNext'])->name('call');
    Route::put('/done/{id}', [PetugasController::class, 'markAsDone'])->name('done');
    Route::put('/skip/{id}', [PetugasController::class, 'skipQueue'])->name('skip');
    Route::put('/recall/{id}', [PetugasController::class, 'recall'])->name('recall');
    Route::post('/toggle-break', [PetugasController::class, 'toggleBreak'])->name('toggle-break');
});

require __DIR__.'/auth.php';
