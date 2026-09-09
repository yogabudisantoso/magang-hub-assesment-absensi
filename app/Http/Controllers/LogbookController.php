<?php

namespace App\Http\Controllers;

use App\Services\LogbookService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LogbookController extends Controller
{
    public function __construct(
        private LogbookService $logbookService
    ) {}

    public function index(Request $request): Response
    {
        $reports = $this->logbookService->getUserReports($request->user()->id);

        return Inertia::render('intern/logbook/index', [
            'reports' => $reports,
        ]);
    }

    public function create(): Response
    {
        $todayReport = $this->logbookService->getTodayReport(auth()->id());

        return Inertia::render('intern/logbook/create', [
            'todayReport' => $todayReport,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'description' => 'required|string|min:10|max:2000',
            'photos' => 'required|array|min:1|max:5',
            'photos.*' => 'image|mimes:jpg,jpeg,png|max:5120',
        ]);

        try {
            $this->logbookService->submitReport(
                $request->user()->id,
                $validated['description'],
                $request->file('photos') ?? []
            );

            return redirect()->route('intern.logbook.index')
                ->with('success', 'Logbook submitted successfully.');
        } catch (\RuntimeException $e) {
            return back()->withErrors(['message' => $e->getMessage()]);
        }
    }
}
