<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Luxury Sense')</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #0a0a0a;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #ffffff;
            line-height: 1.6;
        }
        .wrapper {
            width: 100%;
            background-color: #0a0a0a;
            padding: 40px 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #1a1a1a;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .header {
            padding: 40px 20px;
            text-align: center;
            background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
            border-bottom: 1px solid #d4af37;
        }
        .logo {
            font-family: 'Georgia', serif;
            font-size: 28px;
            color: #d4af37;
            text-transform: uppercase;
            letter-spacing: 4px;
            margin: 0;
            font-weight: normal;
        }
        .content {
            padding: 40px 30px;
        }
        .footer {
            padding: 30px;
            text-align: center;
            font-size: 12px;
            color: #ffffff;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        h1, h2, h3 {
            font-family: 'Georgia', serif;
            color: #ffffff;
            margin-top: 0;
        }
        .button {
            display: inline-block;
            padding: 14px 30px;
            background-color: #d4af37;
            color: #000000;
            text-decoration: none;
            font-weight: bold;
            border-radius: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 20px 0;
        }
        .order-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .order-table th {
            text-align: left;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 10px 0;
            color: #d4af37;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 1px;
        }
        .order-table td {
            padding: 12px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            font-size: 14px;
        }
        .total-row td {
            border-top: 2px solid #d4af37;
            font-weight: bold;
            color: #ffffff;
            font-size: 16px;
        }
        .text-gold { color: #d4af37; }
        .text-white { color: #ffffff; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <h1 class="logo">Luxury Sense</h1>
            </div>
            <div class="content" style="color: #ffffff;">
                @yield('content')
            </div>
            <div class="footer" style="color: #ffffff;">
                <span style="color: #ffffff;">&copy; {{ date('Y') }} Luxury Sense. All Rights Reserved.</span><br>
                <span style="color: #ffffff;">Excellence in every detail.</span>
            </div>
        </div>
    </div>
</body>
</html>
