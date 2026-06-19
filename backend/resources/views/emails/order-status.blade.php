@extends('emails.layouts.master')

@section('title', 'Order Status Update')

@section('content')
    <h2 class="text-white" style="color: #ffffff;">Order Status Updated</h2>
    <p style="color: #ffffff;">Dear {{ $order->customer_name }},</p>
    <p style="color: #ffffff;">We are writing to inform you that the status of your order <strong class="text-gold" style="color: #d4af37;">#{{ $order->id }}</strong> has been updated to:</p>

    <div style="text-align: center; margin: 30px 0;">
        <span style="background-color: #d4af37; color: #000000; padding: 10px 25px; border-radius: 50px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
            {{ strtoupper($order->status) }}
        </span>
    </div>

    @if($order->status === 'confirmed')
        <p style="color: #ffffff;">Your order has been confirmed and is now being prepared for shipment. You will receive another notification once it has been dispatched.</p>
    @elseif($order->status === 'completed')
        <p style="color: #ffffff;">Excellence delivered. Your order has been marked as completed. We hope you enjoy your luxury selection.</p>
    @elseif($order->status === 'rejected')
        <p style="color: #ffffff;">We regret to inform you that your order could not be processed at this time. If you have already made a payment, a refund will be initiated shortly.</p>
    @endif

    <div style="border-top: 1px solid rgba(255, 255, 255, 0.05); margin-top: 30px; pt: 30px;">
        <h3 class="text-gold" style="color: #d4af37;">Order Summary</h3>
        <table class="order-table" style="width: 100%; border-collapse: collapse;">
            <tbody>
                @foreach($order->orderItems as $item)
                    <tr>
                        <td style="color: #ffffff; padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">{{ $item->product->name }} (x{{ $item->quantity }})</td>
                        <td style="text-align: right; color: #ffffff; padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">RS. {{ number_format($item->price * $item->quantity, 2) }}</td>
                    </tr>
                @endforeach
                <tr class="total-row">
                    <td style="color: #ffffff; padding: 12px 0; font-weight: bold;">Total</td>
                    <td style="text-align: right; color: #ffffff; padding: 12px 0; font-weight: bold;">RS. {{ number_format($order->total_amount, 2) }}</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div style="text-align: center; margin-top: 40px;">
        <p style="color: #ffffff;">Thank you for choosing Luxury Sense.</p>
        <a href="{{ config('app.url') }}/my-orders" class="button" style="color: #000000;">View Order Details</a>
    </div>
@endsection
