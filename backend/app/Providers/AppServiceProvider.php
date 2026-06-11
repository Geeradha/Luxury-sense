<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind the public path to the base path for root-level hosting (e.g., InfinityFree)
        if (env('IS_INFINITYFREE', false)) {
            $this->app->bind('path.public', function() {
                return base_path();
            });
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
