<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\DailyLog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AttendanceService
{
    private const GRACE_PERIOD_MINUTES = 60;

    public function checkIn(int $userId, float $latitude, float $longitude, ?string $photoPath = null): Attendance
    {
        $today = Carbon::today();
        $existing = Attendance::where('user_id', $userId)->where('date', $today)->first();

        if ($existing) {
            throw new \RuntimeException('Already checked in today.');
        }

        $now = Carbon::now();
        $checkInDeadline = Carbon::today()->addHours(8)->addMinutes(self::GRACE_PERIOD_MINUTES);
        $status = $now->gt($checkInDeadline) ? 'late' : 'present';

        return Attendance::create([
            'user_id' => $userId,
            'date' => $today,
            'check_in_time' => $now->format('H:i:s'),
            'status' => $status,
            'latitude' => $latitude,
            'longitude' => $longitude,
            'photo_path' => $photoPath,
        ]);
    }

    public function checkOut(int $userId, string $taskSummary): Attendance
    {
        $today = Carbon::today();
        $attendance = Attendance::where('user_id', $userId)
            ->where('date', $today)
            ->first();

        if (!$attendance) {
            throw new \RuntimeException('No check-in found for today.');
        }

        if ($attendance->check_out_time) {
            throw new \RuntimeException('Already checked out today.');
        }

        return DB::transaction(function () use ($attendance, $taskSummary) {
            $attendance->update([
                'check_out_time' => Carbon::now()->format('H:i:s'),
            ]);

            DailyLog::create([
                'attendance_id' => $attendance->id,
                'task_summary' => $taskSummary,
            ]);

            return $attendance->fresh();
        });
    }

    public function getTodayAttendance(int $userId): ?Attendance
    {
        return Attendance::where('user_id', $userId)
            ->where('date', Carbon::today())
            ->with('dailyLog')
            ->first();
    }

    public function getInternStats(int $userId): array
    {
        $user = User::findOrFail($userId);
        $totalDays = $user->attendances()->count();
        $presentDays = $user->attendances()->where('status', 'present')->count();
        $lateDays = $user->attendances()->where('status', 'late')->count();
        $totalHours = $user->attendances()->sum(
            DB::raw('TIMESTAMPDIFF(MINUTE, check_in_time, COALESCE(check_out_time, check_in_time))')
        ) / 60;

        $internshipDays = 0;
        if ($user->start_date && $user->end_date) {
            $internshipDays = Carbon::parse($user->start_date)->diffInDays(Carbon::parse($user->end_date));
        }

        $daysPassed = 0;
        if ($user->start_date) {
            $daysPassed = Carbon::parse($user->start_date)->diffInDays(now());
        }

        return [
            'total_days' => $totalDays,
            'present_days' => $presentDays,
            'late_days' => $lateDays,
            'total_hours' => round($totalHours, 1),
            'attendance_rate' => $totalDays > 0 ? round(($presentDays / $totalDays) * 100, 1) : 0,
            'internship_days' => $internshipDays,
            'days_passed' => $daysPassed,
            'remaining_days' => max(0, $internshipDays - $daysPassed),
        ];
    }

    public function getAdminDashboardStats(): array
    {
        $totalInterns = User::whereHas('role', fn ($q) => $q->where('slug', 'intern'))->count();
        $presentToday = Attendance::whereDate('date', Carbon::today())
            ->where('status', 'present')
            ->count();
        $lateToday = Attendance::whereDate('date', Carbon::today())
            ->where('status', 'late')
            ->count();
        $onLeave = Attendance::whereDate('date', Carbon::today())
            ->where('status', 'on_leave')
            ->count();
        $absentToday = $totalInterns - $presentToday - $lateToday - $onLeave;

        $recentActivity = Attendance::with('user')
            ->whereDate('date', Carbon::today())
            ->latest('check_in_time')
            ->limit(10)
            ->get();

        return [
            'total_interns' => $totalInterns,
            'present_today' => $presentToday,
            'late_today' => $lateToday,
            'absent_today' => max(0, $absentToday),
            'on_leave_today' => $onLeave,
            'attendance_rate' => $totalInterns > 0
                ? round(($presentToday + $lateToday) / $totalInterns * 100, 1)
                : 0,
            'recent_activity' => $recentActivity,
        ];
    }

    private function calculateDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $earthRadius = 6371000;
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2)
            + cos(deg2rad($lat1)) * cos(deg2rad($lat2))
            * sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}
