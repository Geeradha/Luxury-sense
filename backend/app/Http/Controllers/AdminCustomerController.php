<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminCustomerController extends Controller
{
    public function index(): JsonResponse
    {
        $customers = User::query()
            ->where('role', 'customer')
            ->latest()
            ->get(['id', 'name', 'email', 'phone_number', 'address', 'created_at']);

        return response()->json([
            'data' => $customers,
        ]);
    }

    public function destroy(User $customer): JsonResponse
    {
        // Ensure we are deleting a customer and not another admin
        if ($customer->role !== 'customer') {
            return response()->json([
                'message' => 'Unauthorized. Only customer accounts can be deleted through this endpoint.',
            ], 403);
        }

        $customer->delete();

        return response()->json([
            'message' => 'Customer deleted successfully.',
        ]);
    }
}
