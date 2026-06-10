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
}
