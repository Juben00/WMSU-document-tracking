<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        if (Auth::user()->role === 'admin') {
            return Inertia::render('dashboard');
        }
        return Inertia::render('user/dashboard');
    })->name('dashboard');

    Route::get('documents', function () {
        if (Auth::user()->role === 'admin') {
            return Inertia::render('documents');
        }
        return Inertia::render('user/documents');
    })->name('documents');

    Route::get('/documents/create', function () {
        return Inertia::render('user/documents-create');
    })->name('documents.create');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
