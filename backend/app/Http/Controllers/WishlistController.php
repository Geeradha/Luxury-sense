<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class WishlistController extends Controller
{
    /**
     * Display a listing of the user's wishlisted products.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $wishlistedProducts = $user->wishlistProducts()
            ->with(['images', 'category', 'brand', 'variations'])
            ->latest('wishlists.created_at')
            ->get();

        return response()->json([
            'data' => $wishlistedProducts,
        ]);
    }

    /**
     * Toggle a product in the user's wishlist.
     */
    public function toggle(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
        ]);

        $user = $request->user();
        $productId = $validated['product_id'];

        $isAttached = $user->wishlistProducts()->toggle($productId);

        $isWishlisted = count($isAttached['attached']) > 0;

        return response()->json([
            'message' => $isWishlisted ? 'Product added to wishlist.' : 'Product removed from wishlist.',
            'is_wishlisted' => $isWishlisted,
        ]);
    }
}
