<?php

namespace App\Http\Controllers;

use App\Models\LogbookReport;
use App\Services\AttendanceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private AttendanceService $attendanceService
    ) {}

    public function index(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->route('intern.dashboard');
    }

    public function intern(Request $request): Response
    {
        $user = $request->user();
        $todayAttendance = $this->attendanceService->getTodayAttendance($user->id);
        $stats = $this->attendanceService->getInternStats($user->id);

        $todayReport = LogbookReport::with('photos')
            ->where('user_id', $user->id)
            ->where('date', now()->toDateString())
            ->first();

        $recentReports = LogbookReport::with('photos')
            ->where('user_id', $user->id)
            ->latest('date')
            ->limit(5)
            ->get();

        return Inertia::render('dashboard', [
            'todayAttendance' => $todayAttendance,
            'stats' => $stats,
            'todayReport' => $todayReport,
            'recentReports' => $recentReports,
        ]);
    }
}
