<?php

namespace App\Http\Controllers;

use App\Http\Requests\LeaveRequestRequest;
use App\Services\LeaveService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaveController extends Controller
{
    public function __construct(
        private LeaveService $leaveService
    ) {}

    public function index(Request $request): Response
    {
        $requests = $this->leaveService->getUserRequests($request->user()->id);

        return Inertia::render('leave/index', [
            'leaveRequests' => $requests,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('leave/request');
    }

    public function store(LeaveRequestRequest $request): \Illuminate\Http\RedirectResponse
    {
        try {
            $this->leaveService->submitRequest(
                $request->user()->id,
                $request->start_date,
                $request->end_date,
                $request->reason,
                $request->file('attachment')?->store('attachments', 'public')
            );

            return redirect()->route('leave.index')
                ->with('success', 'Leave request submitted.');
        } catch (\RuntimeException $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
