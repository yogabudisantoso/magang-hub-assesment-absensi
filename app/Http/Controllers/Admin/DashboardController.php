<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LogbookReport;
use App\Services\AttendanceService;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private AttendanceService $attendanceService
    ) {}

    public function index(): Response
    {
        $stats = $this->attendanceService->getAdminDashboardStats();

        $todayReports = LogbookReport::with(['user', 'photos'])
            ->where('date', Carbon::today())
            ->latest()
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'todayReports' => $todayReports,
        ]);
    }
}
