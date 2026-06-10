<?php

namespace App\Http\Controllers;

use App\Mail\QuestionAnsweredMail;
use App\Models\ProductQuestion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class AdminProductQuestionController extends Controller
{
    public function index(): JsonResponse
    {
        $questions = ProductQuestion::with(['product', 'user'])
            ->latest()
            ->get();

        return response()->json([
            'data' => $questions,
        ]);
    }

    public function update(Request $request, ProductQuestion $productQuestion): JsonResponse
    {
        $validated = $request->validate([
            'answer' => ['required', 'string', 'max:5000'],
        ]);

        $productQuestion->update([
            'answer' => $validated['answer'],
            'is_approved' => true,
        ]);

        $answeredQuestion = $productQuestion->fresh(['product', 'user']);

        if ($answeredQuestion?->user?->email) {
            Mail::to($answeredQuestion->user->email)->send(new QuestionAnsweredMail($answeredQuestion));
        }

        return response()->json([
            'message' => 'Question answered successfully.',
            'data' => $answeredQuestion,
        ]);
    }
}
