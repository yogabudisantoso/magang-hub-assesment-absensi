<?php

namespace App\Services;

use App\Models\Attendance;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class ReportService
{
    public function getAttendanceReport(
        string $startDate,
        string $endDate,
        array $filters = []
    ): Collection {
        $query = Attendance::with(['user', 'dailyLog'])
            ->whereBetween('date', [$startDate, $endDate]);

        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderBy('date', 'desc')
            ->orderBy('check_in_time', 'desc')
            ->get();
    }

    public function exportToCsv(Collection $data): string
    {
        $headers = [
            'Date',
            'Intern Name',
            'Email',
            'Check In',
            'Check Out',
            'Status',
            'Work Hours',
            'Task Summary',
        ];

        $callback = function () use ($data, $headers) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $headers);

            foreach ($data as $row) {
                fputcsv($file, [
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

            fclose($file);
        };

        return $callback();
    }
}
