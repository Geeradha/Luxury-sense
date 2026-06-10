<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Status Update</title>
</head>
<body style="margin:0;padding:0;background:#faf7f2;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <div style="max-width:640px;margin:0 auto;padding:40px 20px;">
        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:20px;padding:32px;box-shadow:0 18px 45px rgba(15,23,42,0.06);">
            <p style="margin:0 0 12px;text-transform:uppercase;letter-spacing:0.24em;font-size:12px;color:#6b7280;">Luxury Sense</p>
            <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;">Your order status has changed</h1>
            <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#374151;">
                Hello {{ $order->customer_name }}, your order #{{ $order->id }} is now <strong>{{ ucfirst($order->status) }}</strong>.
            </p>
            <p style="margin:0;font-size:15px;line-height:1.7;color:#4b5563;">
                Total: RS. {{ number_format((float) $order->total_amount, 2) }}
            </p>
        </div>
    </div>
</body>
</html>