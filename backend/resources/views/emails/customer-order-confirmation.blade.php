@extends('emails.layouts.master')

@section('title', 'Order Confirmation & Invoice')

@section('content')
    <h2 class="text-white" style="color: #ffffff;">Thank You for Your Order</h2>
    <p style="color: #ffffff;">Dear {{ $order->customer_name }},</p>
    <p style="color: #ffffff;">Your order <strong class="text-gold" style="color: #d4af37;">#{{ $order->id }}</strong> has been successfully placed. We are currently processing your selection and will notify you once it's ready for shipment.</p>

    <div style="background-color: rgba(212, 175, 55, 0.05); padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid rgba(212, 175, 55, 0.1);">
        <h3 class="text-gold" style="margin-bottom: 10px; color: #d4af37;">Delivery Details</h3>
        <p style="margin: 5px 0; color: #ffffff;"><strong class="text-white" style="color: #ffffff;">Name:</strong> {{ $order->customer_name }}</p>
        <p style="margin: 5px 0; color: #ffffff;"><strong class="text-white" style="color: #ffffff;">Phone:</strong> {{ $order->phone }}</p>
        <p style="margin: 5px 0; color: #ffffff;"><strong class="text-white" style="color: #ffffff;">Address:</strong> {{ $order->address }}</p>
    </div>

    <h3 class="text-gold" style="color: #d4af37; margin-top: 30px;">Order Summary (Invoice)</h3>
    <table class="order-table" style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr>
                <th style="color: #d4af37; text-align: left; padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">Product</th>
                <th style="color: #d4af37; text-align: center; padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">Qty</th>
                <th style="color: #d4af37; text-align: right; padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">Price</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->orderItems as $item)
                <tr>
                    <td style="color: #ffffff; padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">{{ $item->product->name }}</td>
                    <td style="color: #ffffff; text-align: center; padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">{{ $item->quantity }}</td>
                    <td style="color: #ffffff; text-align: right; padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">RS. {{ number_format($item->price, 2) }}</td>
                </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="2" style="color: #ffffff; padding: 12px 0; font-weight: bold; border-top: 2px solid #d4af37;">Total Amount</td>
                <td style="color: #ffffff; text-align: right; padding: 12px 0; font-weight: bold; border-top: 2px solid #d4af37;">RS. {{ number_format($order->total_amount, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <div style="text-align: center; margin-top: 40px;">
        <p style="color: #ffffff; font-style: italic;">Thank you for your investment in excellence.</p>
        <a href="{{ config('app.url') }}/my-orders" class="button" style="color: #000000; background-color: #d4af37; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View My Orders</a>
    </div>
@endsection
