<?php

namespace App\Services;

use App\Models\LogbookReport;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class LogbookService
{
    public function submitReport(int $userId, string $description, array $photos = []): LogbookReport
    {
        $today = Carbon::today();
        $existing = LogbookReport::where('user_id', $userId)->where('date', $today)->first();

        if ($existing) {
            throw new \RuntimeException('You have already submitted a report for today.');
        }

        return DB::transaction(function () use ($userId, $description, $photos, $today) {
            $report = LogbookReport::create([
                'user_id' => $userId,
                'date' => $today,
                'description' => $description,
            ]);

            foreach ($photos as $photo) {
                $report->photos()->create([
                    'photo_path' => $photo->store('logbook-reports', 'public'),
                ]);
            }

            return $report->fresh('photos');
        });
    }

    public function getTodayReport(int $userId): ?LogbookReport
    {
        return LogbookReport::where('user_id', $userId)
            ->where('date', Carbon::today())
            ->with('photos')
            ->first();
    }

    public function getUserReports(int $userId): Collection
    {
        return LogbookReport::where('user_id', $userId)
            ->with('photos')
            ->latest('date')
            ->get();
    }

    public function getAllReports(?string $startDate = null, ?string $endDate = null): Collection
    {
        $query = LogbookReport::with(['user', 'photos']);

        if ($startDate) {
            $query->where('date', '>=', $startDate);
        }

        if ($endDate) {
            $query->where('date', '<=', $endDate);
        }

        return $query->latest('date')->get();
    }
}
