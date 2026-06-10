<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['category', 'brand', 'variations', 'images'])->latest();

        if ($search = trim((string) $request->query('search', ''))) {
            $query->where(function ($builder) use ($search): void {
                $builder
                    ->where('name', 'like', '%' . $search . '%')
                    ->orWhere('description', 'like', '%' . $search . '%')
                    ->orWhereHas('category', function ($categoryQuery) use ($search): void {
                        $categoryQuery->where('name', 'like', '%' . $search . '%');
                    })
                    ->orWhereHas('brand', function ($brandQuery) use ($search): void {
                        $brandQuery->where('name', 'like', '%' . $search . '%');
                    });
            });
        }

        return response()->json([
            'data' => $query->get(),
        ]);
    }

    public function show(Product $product): JsonResponse
    {
        $product->load([
            'category',
            'brand',
            'variations',
            'images',
            'questions' => function ($query): void {
                $query->where('is_approved', true)
                    ->with('user')
                    ->latest();
            },
        ]);

        $relatedProducts = Product::with(['category', 'brand', 'variations', 'images'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->limit(8)
            ->get();

        return response()->json([
            'data' => $product,
            'related' => $relatedProducts,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'brand_id' => ['required', 'integer', 'exists:brands,id'],
            'gender_category' => ['required', 'string', 'in:men,women,unisex'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'stock_level' => ['nullable', 'integer', 'min:0'],
            'images' => ['nullable', 'array'],
            'images.*' => ['string', 'url'],
            'specs' => ['nullable', 'array'],
            'variations' => ['nullable', 'array'],
            'variations.*.size_label' => ['required_with:variations', 'string', 'max:255'],
            'variations.*.price' => ['required_with:variations', 'numeric', 'min:0'],
            'variations.*.stock_quantity' => ['required_with:variations', 'integer', 'min:0'],
        ]);

        $variations = $validated['variations'] ?? [];
        $price = $validated['price'] ?? 0;
        $stockLevel = $validated['stock_level'] ?? 0;

        if (!empty($variations)) {
            $price = $variations[0]['price'];
            $stockLevel = collect($variations)->sum('stock_quantity');
        }

        $product = Product::create([
            'category_id' => $validated['category_id'],
            'brand_id' => $validated['brand_id'],
            'gender_category' => $validated['gender_category'],
            'name' => $validated['name'],
            'description' => $validated['description'],
            'price' => $price,
            'stock_level' => $stockLevel,
            'specs' => $validated['specs'] ?? null,
        ]);

        if (!empty($validated['images'])) {
            foreach ($validated['images'] as $index => $imageUrl) {
                if (!empty($imageUrl)) {
                    $product->images()->create([
                        'image_path' => $imageUrl,
                        'is_primary' => $index === 0,
                    ]);
                }
            }
            
            $primaryImage = $product->images()->where('is_primary', true)->first();
            if ($primaryImage) {
                 $product->update(['image_path' => $primaryImage->image_path]);
            }
        }

        if (!empty($validated['variations'])) {
            foreach ($validated['variations'] as $variation) {
                $product->variations()->create($variation);
            }
        }

        return response()->json([
            'message' => 'Product created successfully.',
            'data' => $product->load(['category', 'brand', 'variations', 'images']),
        ], 201);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'brand_id' => ['required', 'integer', 'exists:brands,id'],
            'gender_category' => ['required', 'string', 'in:men,women,unisex'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'stock_level' => ['nullable', 'integer', 'min:0'],
            'images' => ['nullable', 'array'],
            'images.*' => ['string', 'url'],
            'specs' => ['nullable', 'array'],
            'variations' => ['nullable', 'array'],
            'variations.*.id' => ['nullable', 'integer', 'exists:product_variations,id'],
            'variations.*.size_label' => ['required_with:variations', 'string', 'max:255'],
            'variations.*.price' => ['required_with:variations', 'numeric', 'min:0'],
            'variations.*.stock_quantity' => ['required_with:variations', 'integer', 'min:0'],
        ]);

        $variations = $validated['variations'] ?? null;
        $price = $validated['price'] ?? $product->price;
        $stockLevel = $validated['stock_level'] ?? $product->stock_level;

        if (!empty($variations)) {
            $price = $variations[0]['price'];
            $stockLevel = collect($variations)->sum('stock_quantity');
        }

        $product->update([
            'category_id' => $validated['category_id'],
            'brand_id' => $validated['brand_id'],
            'gender_category' => $validated['gender_category'],
            'name' => $validated['name'],
            'description' => $validated['description'],
            'price' => $price,
            'stock_level' => $stockLevel,
            'specs' => isset($validated['specs']) ? $validated['specs'] : $product->specs,
        ]);

        if (isset($validated['images'])) {
            // Remove old images
            $product->images()->delete();

            foreach ($validated['images'] as $index => $imageUrl) {
                if (!empty($imageUrl)) {
                     $product->images()->create([
                        'image_path' => $imageUrl,
                        'is_primary' => $index === 0,
                    ]);
                }
            }
            
            $primaryImage = $product->images()->where('is_primary', true)->first();
            if ($primaryImage) {
                 $product->update(['image_path' => $primaryImage->image_path]);
            } else {
                 $product->update(['image_path' => null]);
            }
        }

        if (isset($validated['variations'])) {
            $existingIds = collect($validated['variations'])->pluck('id')->filter()->toArray();
            $product->variations()->whereNotIn('id', $existingIds)->delete();

            foreach ($validated['variations'] as $variationData) {
                if (isset($variationData['id'])) {
                    $product->variations()->where('id', $variationData['id'])->update([
                        'size_label' => $variationData['size_label'],
                        'price' => $variationData['price'],
                        'stock_quantity' => $variationData['stock_quantity'],
                    ]);
                } else {
                    $product->variations()->create($variationData);
                }
            }
        }

        return response()->json([
            'message' => 'Product updated successfully.',
            'data' => $product->fresh()->load(['category', 'brand', 'variations', 'images']),
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully.',
        ]);
    }
}
