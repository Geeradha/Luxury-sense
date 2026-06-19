@extends('emails.layouts.master')

@section('title', 'Verification Code')

@section('content')
    <h2 class="text-white text-center">Verify Your Identity</h2>
    <p class="text-center">Thank you for joining <strong class="text-gold">Luxury Sense</strong>. To proceed with your request, please use the following verification code:</p>

    <div style="text-align: center; margin: 40px 0;">
        <div style="background-color: rgba(212, 175, 55, 0.1); border: 2px dashed #d4af37; padding: 25px; border-radius: 12px; display: inline-block;">
            <span style="font-size: 42px; font-weight: bold; letter-spacing: 12px; color: #d4af37; font-family: 'Courier New', Courier, monospace;">
                {{ $otpCode }}
            </span>
        </div>
    </div>

    <p class="text-center" style="font-size: 14px; color: #ffffff;">
        This code is valid for a limited time. If you did not request this verification, please ignore this message or contact our support team.
    </p>

    <div style="text-align: center; margin-top: 40px; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 30px;">
        <p style="font-style: italic;">"Crafting experiences, delivering elegance."</p>
    </div>
@endsection
