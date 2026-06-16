<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsSuperAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Check if user exists and has the 'super-admin' role
        if (! $user || $user->role !== 'super-admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Access denied. Only Super Admins can manage administrative accounts.',
            ], 403);
        }

        return $next($request);
    }
}
