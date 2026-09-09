<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\LogbookService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LogbookController extends Controller
{
    public function __construct(
        private LogbookService $logbookService
    ) {}

    public function index(Request $request): \Inertia\Response
    {
        $reports = $this->logbookService->getAllReports(
            $request->get('start_date'),
            $request->get('end_date')
        );

        return Inertia::render('admin/logbook/index', [
            'reports' => $reports,
            'filters' => [
                'start_date' => $request->get('start_date'),
                'end_date' => $request->get('end_date'),
            ],
        ]);
    }

    public function export(Request $request): \Illuminate\Http\Response
    {
        $reports = $this->logbookService->getAllReports(
            $request->get('start_date'),
            $request->get('end_date')
        );

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment;filename=logbook_reports_' . now()->format('Y-m-d') . '.csv',
        ];

        $callback = function () use ($reports) {
            $file = fopen('php://output', 'w');

            fputcsv($file, ['Date', 'Intern Name', 'Email', 'Description', 'Photo Count']);

            foreach ($reports as $report) {
                fputcsv($file, [
                    $report->date->format('Y-m-d'),
                    $report->user->name,
                    $report->user->email,
                    $report->description,
                    $report->photos->count(),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
