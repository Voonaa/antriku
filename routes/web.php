<?php

use App\Http\Controllers\KioskController;
use App\Http\Controllers\PetugasController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Kiosk Routes (Public)
Route::prefix('kiosk')->group(function () {
    Route::get('/{slug}', [KioskController::class, 'showInstansi'])->name('kiosk.show');
    Route::post('/ticket', [KioskController::class, 'takeTicket'])->name('kiosk.ticket');
});

// TV Display Route (Protected by Auth)
Route::middleware(['auth'])->group(function () {
    Route::get('/tv/{slug}', [KioskController::class, 'showTvDisplay'])->name('tv.show');
});

// Admin Routes (Protected)
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\AdminController::class, 'index'])->name('dashboard');
});

// Petugas Routes (Protected)
Route::middleware(['auth'])->prefix('petugas')->name('petugas.')->group(function () {
    Route::get('/dashboard', [PetugasController::class, 'index'])->name('dashboard');
    Route::post('/call', [PetugasController::class, 'callNext'])->name('call');
    Route::put('/done/{id}', [PetugasController::class, 'markAsDone'])->name('done');
    Route::put('/skip/{id}', [PetugasController::class, 'skipQueue'])->name('skip');
});

require __DIR__.'/auth.php';
