<?php

namespace App\Services;

use App\Models\LeaveRequest;
use Illuminate\Support\Collection;

class LeaveService
{
    public function submitRequest(
        int $userId,
        string $startDate,
        string $endDate,
        string $reason,
        ?string $attachmentPath = null
    ): LeaveRequest {
        $existing = LeaveRequest::where('user_id', $userId)
            ->where('status', 'pending')
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_date', [$startDate, $endDate])
                    ->orWhereBetween('end_date', [$startDate, $endDate])
                    ->orWhere(function ($q) use ($startDate, $endDate) {
                        $q->where('start_date', '<=', $startDate)
                            ->where('end_date', '>=', $endDate);
                    });
            })
            ->first();

        if ($existing) {
            throw new \RuntimeException('Overlapping leave request already exists.');
        }

        return LeaveRequest::create([
            'user_id' => $userId,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'reason' => $reason,
            'attachment_path' => $attachmentPath,
        ]);
    }

    public function approveRequest(int $requestId, int $adminId): LeaveRequest
    {
        $request = LeaveRequest::findOrFail($requestId);

        if (!$request->isPending()) {
            throw new \RuntimeException('Request already processed.');
        }

        $request->approve();

        return $request->fresh();
    }

    public function rejectRequest(int $requestId, int $adminId): LeaveRequest
    {
        $request = LeaveRequest::findOrFail($requestId);

        if (!$request->isPending()) {
            throw new \RuntimeException('Request already processed.');
        }

        $request->reject();

        return $request->fresh();
    }

    public function getPendingRequests(): Collection
    {
        return LeaveRequest::with('user')
            ->where('status', 'pending')
            ->latest()
            ->get();
    }

    public function getUserRequests(int $userId): Collection
    {
        return LeaveRequest::where('user_id', $userId)
            ->latest()
            ->get();
    }
}
