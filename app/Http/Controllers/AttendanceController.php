<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckInRequest;
use App\Http\Requests\CheckOutRequest;
use App\Services\AttendanceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function __construct(
        private AttendanceService $attendanceService
    ) {}

    public function todayStatus(Request $request): Response
    {
        $attendance = $this->attendanceService->getTodayAttendance($request->user()->id);

        return Inertia::render('attendance/status', [
            'attendance' => $attendance,
        ]);
    }

    public function checkInPage(): Response
    {
        return Inertia::render('attendance/check-in');
    }

    public function checkIn(CheckInRequest $request): RedirectResponse
    {
        try {
            $this->attendanceService->checkIn(
                $request->user()->id,
                $request->latitude,
                $request->longitude,
                $request->file('photo')?->store('photos', 'public')
            );

            return redirect()->route('intern.dashboard')->with('success', 'Check-in successful.');
        } catch (\RuntimeException $e) {
            return back()->withErrors(['message' => $e->getMessage()]);
        }
    }

    public function checkOutPage(): Response
    {
        return Inertia::render('attendance/check-out');
    }

    public function checkOut(CheckOutRequest $request): RedirectResponse
    {
        try {
            $this->attendanceService->checkOut(
                $request->user()->id,
                $request->task_summary
            );

            return redirect()->route('intern.dashboard')->with('success', 'Check-out successful.');
        } catch (\RuntimeException $e) {
            return back()->withErrors(['message' => $e->getMessage()]);
        }
    }
}
