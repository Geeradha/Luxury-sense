<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Order Received - Luxury Sense</title>
</head>
<body style="background-color: #121212; color: #f5f5f5; font-family: 'serif', 'Times New Roman', serif; margin: 0; padding: 0;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #121212; border-collapse: collapse; margin-top: 50px; margin-bottom: 50px; border: 1px solid #1a1a1a;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <h1 style="color: #d4af37; font-size: 24px; text-transform: uppercase; letter-spacing: 0.5em; margin: 0; font-weight: 300;">Luxury Sense</h1>
                <p style="color: #ffffff; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 10px;">Admin Notification</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px; background-color: #1a1a1a;">
                <h2 style="color: #d4af37; font-size: 20px; margin-bottom: 25px; font-weight: 400; border-bottom: 1px solid #333; padding-bottom: 15px;">New Order #{{ $order->id }}</h2>
                
                <p style="font-size: 14px; line-height: 1.8; color: #a1a1a1; margin-bottom: 20px;">
                    A new order has been placed in the boutique. Below are the curated details:
                </p>

                <div style="margin-bottom: 30px;">
                    <h4 style="text-transform: uppercase; font-size: 10px; letter-spacing: 0.2em; color: #d4af37; margin-bottom: 10px;">Customer Information</h4>
                    <p style="font-size: 13px; color: #ffffff; margin: 5px 0;"><strong>Name:</strong> {{ $order->customer_name }}</p>
                    <p style="font-size: 13px; color: #ffffff; margin: 5px 0;"><strong>Email:</strong> {{ $order->email }}</p>
                    <p style="font-size: 13px; color: #ffffff; margin: 5px 0;"><strong>Phone:</strong> {{ $order->phone }}</p>
                    <p style="font-size: 13px; color: #ffffff; margin: 5px 0;"><strong>Address:</strong> {{ $order->address }}</p>
                </div>

                <div style="margin-bottom: 30px;">
                    <h4 style="text-transform: uppercase; font-size: 10px; letter-spacing: 0.2em; color: #d4af37; margin-bottom: 10px;">Order Summary</h4>
                    <table width="100%" style="border-collapse: collapse;">
                        <thead>
                            <tr style="border-bottom: 1px solid #333;">
                                <th align="left" style="padding: 10px 0; font-size: 11px; color: #555; text-transform: uppercase;">Product</th>
                                <th align="center" style="padding: 10px 0; font-size: 11px; color: #555; text-transform: uppercase;">Qty</th>
                                <th align="right" style="padding: 10px 0; font-size: 11px; color: #555; text-transform: uppercase;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($order->orderItems as $item)
                            <tr style="border-bottom: 1px solid #222;">
                                <td style="padding: 10px 0; color: #ffffff; font-size: 13px;">{{ $item->product->name ?? 'Product #' . $item->product_id }}</td>
                                <td align="center" style="padding: 10px 0; color: #ffffff; font-size: 13px;">{{ $item->quantity }}</td>
                                <td align="right" style="padding: 10px 0; color: #ffffff; font-size: 13px;">RS. {{ number_format($item->price, 2) }}</td>
                            </tr>
                            @endforeach
                            <tr>
                                <td colspan="2" align="right" style="padding: 20px 10px 0 0; font-size: 12px; color: #d4af37; text-transform: uppercase; letter-spacing: 0.1em;">Total Amount</td>
                                <td align="right" style="padding: 20px 0 0 0; font-size: 16px; color: #ffffff; font-weight: bold;">RS. {{ number_format($order->total_amount, 2) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style="text-align: center; margin-top: 40px;">
                    <a href="{{ config('app.url') }}/admin/orders" style="display: inline-block; padding: 15px 30px; background-color: #d4af37; color: #121212; text-decoration: none; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.2em; border-radius: 2px;">Review Order in Dashboard</a>
                </div>
            </td>
        </tr>
        <tr>
            <td align="center" style="padding: 30px; border-top: 1px solid #1a1a1a; background-color: #121212;">
                <p style="font-size: 10px; color: #555555; text-transform: uppercase; letter-spacing: 0.2em; margin: 0;">
                    Automated Administrative Alert | Luxury Sense Boutique
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
