<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\LeaveService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaveController extends Controller
{
    public function __construct(
        private LeaveService $leaveService
    ) {}

    public function index(): Response
    {
        $pendingRequests = $this->leaveService->getPendingRequests();

        return Inertia::render('admin/leave-requests/index', [
            'pendingRequests' => $pendingRequests,
        ]);
    }

    public function approve(int $id): \Illuminate\Http\RedirectResponse
    {
        try {
            $this->leaveService->approveRequest($id, auth()->id());

            return redirect()->back()->with('success', 'Leave request approved.');
        } catch (\RuntimeException $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function reject(int $id): \Illuminate\Http\RedirectResponse
    {
        try {
            $this->leaveService->rejectRequest($id, auth()->id());

            return redirect()->back()->with('success', 'Leave request rejected.');
        } catch (\RuntimeException $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
