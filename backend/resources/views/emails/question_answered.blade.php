<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Question Was Answered</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
    <div style="max-width:640px;margin:0 auto;padding:40px 20px;">
        <div style="background:#1a1a1a;border:1px solid rgba(255,255,255,0.05);border-radius:20px;padding:32px;box-shadow:0 18px 45px rgba(0,0,0,0.5);">
            <p style="margin:0 0 12px;text-transform:uppercase;letter-spacing:0.24em;font-size:12px;color:#d4af37;">Luxury Sense</p>
            <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;color:#ffffff;">Your question has been answered</h1>

            <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#ffffff;">
                Hello {{ $question->user->name ?? 'there' }}, our team has replied to your question about <strong>{{ $product->name ?? 'this product' }}</strong>.
            </p>

            <div style="margin:0 0 20px;padding:20px;border-radius:16px;background:#0a0a0a;border:1px solid rgba(255,255,255,0.05);">
                <p style="margin:0 0 10px;font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#d4af37;">Your question</p>
                <p style="margin:0;font-size:15px;line-height:1.7;color:#ffffff;">{{ $question->question }}</p>
            </div>

            <div style="margin:0 0 24px;padding:20px;border-radius:16px;background:#1a1a1a;border:1px solid rgba(255,255,255,0.1);">
                <p style="margin:0 0 10px;font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#d4af37;">Our answer</p>
                <p style="margin:0;font-size:15px;line-height:1.7;color:#ffffff;">{{ $answer }}</p>
            </div>

            <p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:#ffffff;">
                You can view the product page for more details and continue shopping anytime.
            </p>

            <a href="{{ url('/product/' . $product->id) }}" style="display:inline-block;padding:12px 22px;border-radius:999px;background:#d4af37;color:#000000;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">
                View Product
            </a>
        </div>
    </div>
</body>
</html>