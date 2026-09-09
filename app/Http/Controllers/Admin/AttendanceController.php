<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function __construct(
        private ReportService $reportService
    ) {}

    public function index(Request $request): Response
    {
        $startDate = $request->get('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->get('end_date', now()->format('Y-m-d'));

        $report = $this->reportService->getAttendanceReport($startDate, $endDate, [
            'user_id' => $request->get('user_id'),
            'status' => $request->get('status'),
        ]);

        return Inertia::render('admin/attendances/index', [
            'report' => $report,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'user_id' => $request->get('user_id'),
                'status' => $request->get('status'),
            ],
        ]);
    }

    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $startDate = $request->get('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->get('end_date', now()->format('Y-m-d'));

        $report = $this->reportService->getAttendanceReport($startDate, $endDate, [
            'user_id' => $request->get('user_id'),
            'status' => $request->get('status'),
        ]);

        $filename = "attendance_report_{$startDate}_{$endDate}.csv";

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        return response()->stream(function () use ($report) {
            echo "Date,Name,Email,Check In,Check Out,Status,Work Hours,Task Summary\n";

            foreach ($report as $row) {
                fputcsv(fopen('php://output', 'w'), [
                    $row->date->format('Y-m-d'),
                    $row->user->name,
                    $row->user->email,
                    $row->check_in_time,
                    $row->check_out_time ?? '-',
                    ucfirst($row->status),
                    $row->work_hours ?? '-',
                    $row->dailyLog?->task_summary ?? '-',
                ]);
            }
        }, 200, $headers);
    }
}
