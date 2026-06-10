<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Inquiry Received - Luxury Sense</title>
</head>
<body style="background-color: #121212; color: #f5f5f5; font-family: 'serif', 'Times New Roman', serif; margin: 0; padding: 0;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #121212; border-collapse: collapse; margin-top: 50px; margin-bottom: 50px; border: 1px solid #1a1a1a;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <h1 style="color: #d4af37; font-size: 24px; text-transform: uppercase; letter-spacing: 0.5em; margin: 0; font-weight: 300;">Luxury Sense</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px; background-color: #1a1a1a;">
                <p style="font-size: 18px; margin-bottom: 25px; color: #ffffff;">Dear {{ $contactMessage->name }},</p>
                
                <p style="font-size: 14px; line-height: 1.8; color: #a1a1a1; margin-bottom: 30px;">
                    We have received your digital inquiry. Our dedicated concierge team is currently reviewing your message and will provide a personalized response within the next 24 business hours.
                </p>

                <div style="padding: 25px; border-left: 2px solid #d4af37; background-color: #121212; margin-bottom: 35px;">
                    <h4 style="text-transform: uppercase; font-size: 10px; letter-spacing: 0.2em; color: #d4af37; margin-top: 0;">Your Inquiry Details</h4>
                    <p style="font-size: 13px; line-height: 1.6; color: #ffffff; font-style: italic; margin-bottom: 0;">
                        "{{ $contactMessage->message }}"
                    </p>
                </div>

                <p style="font-size: 14px; color: #a1a1a1; margin-bottom: 40px;">
                    Thank you for choosing Luxury Sense. We look forward to curating your experience.
                </p>

                <p style="font-size: 14px; color: #ffffff; margin-bottom: 5px; font-weight: bold;">Warm regards,</p>
                <p style="font-size: 12px; color: #d4af37; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0;">The Luxury Sense Team</p>
            </td>
        </tr>
        <tr>
            <td align="center" style="padding: 30px; border-top: 1px solid #1a1a1a; background-color: #121212;">
                <p style="font-size: 10px; color: #555555; text-transform: uppercase; letter-spacing: 0.2em; margin: 0;">
                    &copy; {{ date('Y') }} Luxury Sense Boutique. All rights reserved.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
