<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\InquiryReceivedMail;

class ContactController extends Controller
{
    /**
     * Store a new contact message (Public).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        $message = ContactMessage::create($validated);

        // Send automated response to customer
        try {
            Mail::to($message->email)->send(new InquiryReceivedMail($message));
        } catch (\Exception $e) {
            // Log the error but don't fail the request
            \Log::error('Failed to send contact inquiry email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Your inquiry has been received. Please check your inbox for confirmation.',
            'data' => $message
        ], 201);
    }

    /**
     * List all contact messages (Admin).
     */
    public function index()
    {
        $messages = ContactMessage::latest()->get();
        return response()->json($messages);
    }

    /**
     * Toggle read status (Admin).
     */
    public function update(Request $request, ContactMessage $contactMessage)
    {
        $contactMessage->update([
            'is_read' => $request->boolean('is_read')
        ]);

        return response()->json($contactMessage);
    }

    /**
     * Delete message (Admin).
     */
    public function destroy(ContactMessage $contactMessage)
    {
        $contactMessage->delete();
        return response()->json(null, 204);
    }
}
