<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\User;
use App\Mail\AdminOrderNotificationMail;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $orders = $request->user()
            ->orders()
            ->with(['user', 'orderItems.product'])
            ->latest()
            ->get();

        return response()->json([
            'data' => OrderResource::collection($orders),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user || $user->phone_number === null || $user->address === null) {
            return response()->json([
                'message' => 'Please complete your profile details (phone and address) to place an order.',
            ], 403);
        }

        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'address' => ['required', 'string'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'order_items' => ['required', 'array', 'min:1'],
            'order_items.*.product_id' => ['required', 'integer'],
            'order_items.*.quantity' => ['required', 'integer', 'min:1'],
            'order_items.*.price' => ['required', 'numeric', 'min:0'],
        ]);

        $order = DB::transaction(function () use ($validated, $user): Order {
            $order = Order::create([
                'user_id' => $user->id,
                'customer_name' => $validated['customer_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'total_amount' => $validated['total_amount'],
                'status' => 'pending',
            ]);

            $order->orderItems()->createMany($validated['order_items']);

            return $order->load(['orderItems.product']);
        });

        // Send notification to Admin(s)
        try {
            $admins = User::where('is_admin', true)->get();
            if ($admins->isNotEmpty()) {
                Mail::to($admins)->send(new AdminOrderNotificationMail($order));
            }
        } catch (\Exception $e) {
            \Log::error('Failed to send admin order notification: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Order placed successfully.',
            'order' => $order,
        ], 201);
    }

    public function destroy(Request $request, Order $order): JsonResponse
    {
        if ($order->user_id !== $request->user()?->id) {
            throw new AuthorizationException('You are not allowed to modify this order.');
        }

        if ($order->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending orders can be cancelled.',
            ], 422);
        }

        $order->update([
            'status' => 'cancelled',
        ]);

        return response()->json([
            'message' => 'Order cancelled successfully.',
            'order' => new OrderResource($order->fresh(['user', 'orderItems.product'])),
        ]);
    }
}
