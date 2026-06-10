<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Question Was Answered</title>
</head>
<body style="margin:0;padding:0;background:#faf7f2;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <div style="max-width:640px;margin:0 auto;padding:40px 20px;">
        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:20px;padding:32px;box-shadow:0 18px 45px rgba(15,23,42,0.06);">
            <p style="margin:0 0 12px;text-transform:uppercase;letter-spacing:0.24em;font-size:12px;color:#6b7280;">Luxury Sense</p>
            <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;">Your question has been answered</h1>

            <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#374151;">
                Hello {{ $question->user->name ?? 'there' }}, our team has replied to your question about <strong>{{ $product->name ?? 'this product' }}</strong>.
            </p>

            <div style="margin:0 0 20px;padding:20px;border-radius:16px;background:#faf7f2;border:1px solid #e7ddd2;">
                <p style="margin:0 0 10px;font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#6b7280;">Your question</p>
                <p style="margin:0;font-size:15px;line-height:1.7;color:#111827;">{{ $question->question }}</p>
            </div>

            <div style="margin:0 0 24px;padding:20px;border-radius:16px;background:#ffffff;border:1px solid #e5e7eb;">
                <p style="margin:0 0 10px;font-size:12px;text-transform:uppercase;letter-spacing:0.2em;color:#6b7280;">Our answer</p>
                <p style="margin:0;font-size:15px;line-height:1.7;color:#374151;">{{ $answer }}</p>
            </div>

            <p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:#4b5563;">
                You can view the product page for more details and continue shopping anytime.
            </p>

            <a href="{{ url('/product/' . $product->id) }}" style="display:inline-block;padding:12px 22px;border-radius:999px;background:#111827;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">
                View Product
            </a>
        </div>
    </div>
</body>
</html>