<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Order */
class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var \App\Models\Order $order */
        $order = $this->resource;

        $user = $order->relationLoaded('user') ? $order->user : null;

        return [
            'id' => $order->id,
            'user' => $user ? [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ] : null,
            'customer_name' => $order->customer_name,
            'email' => $order->email,
            'phone' => $order->phone,
            'address' => $order->address,
            'total_amount' => $order->total_amount,
            'status' => $order->status,
            'order_items' => $order->relationLoaded('orderItems')
                ? OrderItemResource::collection($order->orderItems)
                : [],
            'created_at' => $order->created_at,
            'updated_at' => $order->updated_at,
        ];
    }
}
