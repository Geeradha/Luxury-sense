<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\JsonResponse;

class AdminOrderController extends Controller
{
    public function index(): JsonResponse
    {
        $orders = Order::query()
            ->select([
                'id',
                'customer_name',
                'email',
                'phone',
                'address',
                'total_amount',
                'status',
                'created_at',
            ])
            ->with([
                'orderItems' => function ($query): void {
                    $query
                        ->select('id', 'order_id', 'product_id', 'quantity', 'price')
                        ->with('product:id,name,price');
                },
            ])
            ->latest()
            ->get();

        return response()->json([
            'orders' => $orders,
        ]);
    }
}
