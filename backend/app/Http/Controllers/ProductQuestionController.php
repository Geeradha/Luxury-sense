<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductQuestionController extends Controller
{
    public function store(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'question' => ['required', 'string', 'max:2000'],
        ]);

        $productQuestion = $request->user()->productQuestions()->create([
            'product_id' => $product->id,
            'user_id' => $request->user()->id,
            'question' => $validated['question'],
            'answer' => null,
            'is_approved' => false,
        ]);

        return response()->json([
            'message' => 'Your question has been submitted successfully.',
            'data' => $productQuestion->load('user'),
        ], 201);
    }
}
