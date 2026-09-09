<?php

use App\Http\Controllers\Admin\AttendanceController as AdminAttendanceController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\InternController;
use App\Http\Controllers\Admin\LeaveController as AdminLeaveController;
use App\Http\Controllers\Admin\LogbookController as AdminLogbookController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LogbookController;
use App\Http\Controllers\LeaveController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('intern')
        ->middleware('role:intern')
        ->name('intern.')
        ->group(function () {
            Route::get('dashboard', [DashboardController::class, 'intern'])->name('dashboard');

            Route::prefix('attendance')->name('attendance.')->group(function () {
                Route::get('/', [AttendanceController::class, 'todayStatus'])->name('status');
                Route::get('check-in', [AttendanceController::class, 'checkInPage'])->name('check-in');
                Route::post('check-in', [AttendanceController::class, 'checkIn']);
                Route::get('check-out', [AttendanceController::class, 'checkOutPage'])->name('check-out');
                Route::post('check-out', [AttendanceController::class, 'checkOut']);
            });

            Route::prefix('leave')->name('leave.')->group(function () {
                Route::get('/', [LeaveController::class, 'index'])->name('index');
                Route::get('create', [LeaveController::class, 'create'])->name('create');
                Route::post('/', [LeaveController::class, 'store'])->name('store');
            });

            Route::prefix('logbook')->name('logbook.')->group(function () {
                Route::get('/', [LogbookController::class, 'index'])->name('index');
                Route::get('create', [LogbookController::class, 'create'])->name('create');
                Route::post('/', [LogbookController::class, 'store'])->name('store');
            });
        });

    Route::prefix('admin')
        ->middleware('role:admin')
        ->name('admin.')
        ->group(function () {
            Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
            Route::get('interns', [InternController::class, 'index'])->name('interns.index');
            Route::get('interns/create', [InternController::class, 'create'])->name('interns.create');
            Route::post('interns', [InternController::class, 'store'])->name('interns.store');
            Route::get('interns/{intern}/edit', [InternController::class, 'edit'])->name('interns.edit');
            Route::put('interns/{intern}', [InternController::class, 'update'])->name('interns.update');
            Route::delete('interns/{intern}', [InternController::class, 'destroy'])->name('interns.destroy');

            Route::get('attendances', [AdminAttendanceController::class, 'index'])->name('attendances.index');
            Route::get('attendances/export', [AdminAttendanceController::class, 'export'])->name('attendances.export');

            Route::get('leave-requests', [AdminLeaveController::class, 'index'])->name('leave-requests.index');
            Route::post('leave-requests/{id}/approve', [AdminLeaveController::class, 'approve'])->name('leave-requests.approve');
            Route::post('leave-requests/{id}/reject', [AdminLeaveController::class, 'reject'])->name('leave-requests.reject');

            Route::get('logbook', [AdminLogbookController::class, 'index'])->name('logbook.index');
            Route::get('logbook/export', [AdminLogbookController::class, 'export'])->name('logbook.export');
        });
});

require __DIR__.'/settings.php';
