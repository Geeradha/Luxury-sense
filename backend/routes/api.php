<?php

use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminCustomerController;
use App\Http\Controllers\AdminOrderController;
use App\Http\Controllers\AdminCategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AdminProductQuestionController;
use App\Http\Controllers\ProductQuestionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/orders', [OrderController::class, 'index']);
Route::middleware('auth:sanctum')->post('/orders', [OrderController::class, 'store']);
Route::middleware('auth:sanctum')->delete('/orders/{order}', [OrderController::class, 'destroy']);
Route::middleware('auth:sanctum')->post('/products/{product}/questions', [ProductQuestionController::class, 'store']);
Route::middleware('auth:sanctum')->get('/profile', [ProfileController::class, 'show']);
Route::middleware('auth:sanctum')->put('/profile', [ProfileController::class, 'update']);
Route::middleware('auth:sanctum')->get('/wishlist', [WishlistController::class, 'index']);
Route::middleware('auth:sanctum')->post('/wishlist/toggle', [WishlistController::class, 'toggle']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/categories', [AdminCategoryController::class, 'index']);
Route::get('/brands', [BrandController::class, 'index']);
Route::get('/brands/{slug}', [BrandController::class, 'show']);
Route::post('/contact', [ContactController::class, 'store']);

Route::prefix('admin')->middleware(['auth:sanctum', 'isAdmin'])->group(function (): void {
    Route::get('dashboard-stats', [AdminOrderController::class, 'getDashboardStats']);
    Route::put('orders/bulk-status', [AdminOrderController::class, 'bulkUpdateStatus']);
    Route::get('orders', [AdminOrderController::class, 'index']);
    Route::get('customers', [AdminCustomerController::class, 'index']);
    Route::delete('customers/{customer}', [AdminCustomerController::class, 'destroy']);
    Route::get('product-questions', [AdminProductQuestionController::class, 'index']);
    Route::get('contact-messages', [ContactController::class, 'index']);
    Route::put('contact-messages/{contactMessage}', [ContactController::class, 'update']);
    Route::delete('contact-messages/{contactMessage}', [ContactController::class, 'destroy']);
    
    // Admin User Management
    Route::get('users', [AdminUserController::class, 'index']);
    
    Route::middleware('isSuperAdmin')->group(function () {
        Route::post('users', [AdminUserController::class, 'store']);
        Route::put('users/{admin_user}', [AdminUserController::class, 'update']);
        Route::delete('users/{admin_user}', [AdminUserController::class, 'destroy']);
    });
    
    Route::apiResource('brands', BrandController::class)->except(['index', 'show']);
    
    Route::post('categories', [AdminCategoryController::class, 'store']);

    Route::put('categories/{category}', [AdminCategoryController::class, 'update']);
    Route::patch('categories/{category}', [AdminCategoryController::class, 'update']);
    Route::delete('categories/{category}', [AdminCategoryController::class, 'destroy']);
    Route::post('products', [ProductController::class, 'store']);
    Route::put('products/{product}', [ProductController::class, 'update']);
    Route::patch('products/{product}', [ProductController::class, 'update']);
    Route::delete('products/{product}', [ProductController::class, 'destroy']);
    Route::put('orders/{order}/status', [AdminOrderController::class, 'updateStatus']);
    Route::put('product-questions/{productQuestion}', [AdminProductQuestionController::class, 'update']);
});
