<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\Admin\StoreAdminUserRequest;
use App\Http\Requests\Admin\UpdateAdminUserRequest;

class AdminUserController extends Controller
{
    /**
     * Display a listing of the admin users.
     */
    public function index()
    {
        $admins = User::where('is_admin', true)
            ->orWhereIn('role', ['admin', 'super-admin', 'editor'])
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $admins
        ]);
    }

    /**
     * Store a newly created admin user in storage.
     */
    public function store(StoreAdminUserRequest $request)
    {
        $validated = $request->validated();
        
        $admin = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
            'is_admin' => true,
            'status' => $validated['status'] ?? 'active',
            'email_verified_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Admin user created successfully',
            'data' => $admin
        ], 201);
    }

    /**
     * Update the specified admin user in storage.
     */
    public function update(UpdateAdminUserRequest $request, $id)
    {
        $admin = User::findOrFail($id);
        $validated = $request->validated();

        $updateData = [
            'name' => $validated['name'] ?? $admin->name,
            'email' => $validated['email'] ?? $admin->email,
            'role' => $validated['role'] ?? $admin->role,
            'status' => $validated['status'] ?? $admin->status,
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $admin->update($updateData);

        return response()->json([
            'status' => 'success',
            'message' => 'Admin user updated successfully',
            'data' => $admin
        ]);
    }

    /**
     * Remove the specified admin user from storage.
     */
    public function destroy($id)
    {
        $admin = User::findOrFail($id);
        
        // Prevent deleting the last super-admin or yourself if needed
        // For now, just delete
        $admin->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Admin user deleted successfully'
        ]);
    }
}
