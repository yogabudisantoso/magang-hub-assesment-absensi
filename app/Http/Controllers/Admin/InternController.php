<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class InternController extends Controller
{
    public function index(): Response
    {
        $interns = User::whereHas('role', fn ($q) => $q->where('slug', 'intern'))
            ->withCount('attendances')
            ->latest()
            ->get();

        return Inertia::render('admin/interns/index', [
            'interns' => $interns,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/interns/create');
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $internRole = Role::where('slug', 'intern')->first();

        User::create([
            ...$validated,
            'password' => Hash::make($validated['password']),
            'role_id' => $internRole->id,
        ]);

        return redirect()->route('admin.interns.index')
            ->with('success', 'Intern created.');
    }

    public function edit(User $intern): Response
    {
        return Inertia::render('admin/interns/edit', [
            'intern' => $intern,
        ]);
    }

    public function update(Request $request, User $intern): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => "required|email|unique:users,email,{$intern->id}",
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $intern->update($validated);

        return redirect()->route('admin.interns.index')
            ->with('success', 'Intern updated.');
    }

    public function destroy(User $intern): \Illuminate\Http\RedirectResponse
    {
        $intern->delete();

        return redirect()->route('admin.interns.index')
            ->with('success', 'Intern deleted.');
    }
}
