<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class LuxuryProductsSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Perfumes',
            'Shoes',
            'Bags',
        ];

        foreach ($categories as $categoryName) {
            Category::firstOrCreate([
                'name' => $categoryName,
            ]);
        }

        $products = [
            [
                'name' => 'Oud Noir Extrait',
                'category' => 'Perfumes',
                'description' => 'A deeply sensual extrait de parfum where smoked oud, black incense, and velvety amber unfold like a private evening salon. Crafted with a couture concentration and a lingering, polished warmth, it leaves an unforgettable trail of dark elegance.',
                'price' => 380.00,
                'image_path' => 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'name' => 'Maison Santal Noire',
                'category' => 'Perfumes',
                'description' => 'Silken sandalwood, velvet iris, and a hint of cardamom create a refined composition that feels quietly opulent. Its heritage-inspired depth and creamy finish evoke bespoke tailoring, polished wood, and the calm of an intimate atelier.',
                'price' => 520.00,
                'image_path' => 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'name' => 'Milano Leather Loafer',
                'category' => 'Shoes',
                'description' => 'Hand-finished in supple full-grain leather, this loafer balances Milanese sharpness with understated comfort. Every curve is deliberate, every stitch precise, delivering a graceful silhouette that moves effortlessly from private appointments to candlelit dinners.',
                'price' => 750.00,
                'image_path' => 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'name' => 'Atelier Suede Monk Strap',
                'category' => 'Shoes',
                'description' => 'Rich suede, burnished hardware, and a sculpted profile give this monk strap a quietly commanding presence. Built with meticulous craftsmanship and a heritage shoemaking sensibility, it delivers soft structure, depth, and enduring refinement.',
                'price' => 895.00,
                'image_path' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'name' => 'The Signature Envelope Clutch',
                'category' => 'Bags',
                'description' => 'A slender envelope silhouette rendered in smooth leather with a polished, architectural finish. Designed to feel as coveted as a handwritten invitation, it offers modern poise, tactile richness, and an exquisitely minimal profile.',
                'price' => 650.00,
                'image_path' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'name' => 'Grand Voyage Top-Handle Bag',
                'category' => 'Bags',
                'description' => 'Structured yet fluid, this top-handle bag is cut from premium leather and finished with discreet hardware for a refined, travel-ready presence. It channels old-world sophistication with a modern edge, making every departure feel deliberate and elevated.',
                'price' => 1450.00,
                'image_path' => 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
            ],
        ];

        foreach ($products as $productData) {
            $category = Category::query()->where('name', $productData['category'])->first();

            if (! $category) {
                continue;
            }

            Product::updateOrCreate(
                ['name' => $productData['name']],
                [
                    'category_id' => $category->id,
                    'description' => $productData['description'],
                    'price' => $productData['price'],
                    'image_path' => $productData['image_path'],
                ]
            );
        }
    }
}
