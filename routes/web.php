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
});

// Admin Routes (Protected)
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\AdminController::class, 'index'])->name('dashboard');
    Route::post('/layanans', [\App\Http\Controllers\AdminController::class, 'storeLayanan'])->name('layanans.store');
    Route::delete('/layanans/{id}', [\App\Http\Controllers\AdminController::class, 'destroyLayanan'])->name('layanans.destroy');
    Route::post('/lokets', [\App\Http\Controllers\AdminController::class, 'storeLoket'])->name('lokets.store');
    Route::delete('/lokets/{id}', [\App\Http\Controllers\AdminController::class, 'destroyLoket'])->name('lokets.destroy');
    Route::post('/staff', [\App\Http\Controllers\AdminController::class, 'storeStaff'])->name('staff.store');
    Route::post('/logo', [\App\Http\Controllers\AdminController::class, 'uploadLogo'])->name('logo.upload');
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
