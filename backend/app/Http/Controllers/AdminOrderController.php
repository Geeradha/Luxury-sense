<?php

namespace App\Http\Controllers;

use App\Mail\OrderStatusMail;
use App\Models\Product;
use App\Models\Order;
use App\Models\User;
use App\Http\Resources\OrderResource;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class AdminOrderController extends Controller
{
    public function getDashboardStats(): JsonResponse
    {
        return response()->json([
            'data' => [
                'total_revenue' => Order::query()
                    ->where('status', '!=', 'rejected')
                    ->sum('total_amount'),
                'total_orders' => Order::query()->count(),
                'pending_orders' => Order::query()->where('status', 'pending')->count(),
                'total_customers' => User::query()->where('role', 'customer')->count(),
            ],
        ]);
    }

    public function index(): JsonResponse
    {
        $orders = Order::with(['user', 'orderItems.product'])
            ->latest()
            ->get();

        return response()->json([
            'data' => OrderResource::collection($orders),
        ]);
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:confirmed,rejected,completed'],
        ]);

        try {
            $updatedOrder = $this->performStatusUpdate($order, $validated['status']);
            return response()->json([
                'message' => 'Order status updated successfully.',
                'data' => new OrderResource($updatedOrder),
            ]);
        } catch (HttpResponseException $e) {
            throw $e;
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while updating the order status: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function bulkUpdateStatus(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:orders,id'],
            'status' => ['required', 'in:confirmed,rejected,completed'],
        ]);

        $updatedCount = 0;
        $errors = [];

        foreach ($validated['ids'] as $id) {
            try {
                $order = Order::findOrFail($id);
                $this->performStatusUpdate($order, $validated['status']);
                $updatedCount++;
            } catch (\Exception $e) {
                $errors[] = "Order #{$id}: " . $e->getMessage();
            }
        }

        return response()->json([
            'message' => "Successfully updated {$updatedCount} orders.",
            'errors' => $errors,
        ]);
    }

    private function performStatusUpdate(Order $order, string $status): Order
    {
        if ($order->status === 'completed' && $status !== 'completed') {
            throw new HttpResponseException(response()->json([
                'message' => "Order #{$order->id} is already completed and cannot be changed.",
            ], 422));
        }

        $updatedOrder = DB::transaction(function () use ($order, $status): Order {
            $order->refresh();

            if ($order->status !== 'completed' && $status === 'completed') {
                $order->loadMissing('orderItems.product');

                foreach ($order->orderItems as $orderItem) {
                    $product = Product::query()->lockForUpdate()->find($orderItem->product_id);

                    if (! $product) {
                        throw new HttpResponseException(response()->json([
                            'message' => 'One of the ordered products could not be found.',
                        ], 422));
                    }

                    if ($product->stock_level < $orderItem->quantity) {
                        throw new HttpResponseException(response()->json([
                            'message' => 'Insufficient stock for ' . $product->name . '.',
                        ], 422));
                    }
                }

                foreach ($order->orderItems as $orderItem) {
                    $product = Product::query()->lockForUpdate()->find($orderItem->product_id);
                    $product->decrement('stock_level', $orderItem->quantity);
                }
            }

            $order->update([
                'status' => $status,
            ]);

            return $order->fresh(['user', 'orderItems.product']);
        });

        Mail::to($order->email)->queue(new OrderStatusMail($updatedOrder));

        return $updatedOrder;
    }
}
