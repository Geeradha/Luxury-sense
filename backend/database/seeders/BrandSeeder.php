<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            [
                'name' => 'Acqua di Parma',
                'description' => 'A symbol of Italian savoir-faire and refinement, Acqua di Parma embodies a lifestyle of discrete luxury.',
                'image_url' => 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'name' => 'Byredo',
                'description' => 'A European luxury brand founded in Stockholm in 2006, with an ambition to translate memories and emotions into products and experiences.',
                'image_url' => 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'name' => 'Creed',
                'description' => 'Established in 1760, the House of Creed is an authentic, luxury perfume house dedicated to the creation of highly original, artisan fragrances.',
                'image_url' => 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'name' => 'Diptyque',
                'description' => 'A pioneer of the olfactory journey, Diptyque creates unique fragrances and decorative objects that tell a story.',
                'image_url' => 'https://images.unsplash.com/photo-1557170334-a7c3a4e2ef38?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'name' => 'Hermès',
                'description' => 'A French luxury design house established in 1837, specializing in leather goods, lifestyle accessories, home furnishings, perfumery, jewelry, watches and ready-to-wear.',
                'image_url' => 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80',
            ],
            [
                'name' => 'Louis Vuitton',
                'description' => 'Founded in 1854, Louis Vuitton is a symbol of elegance and style, known for its iconic monogram and craftsmanship.',
                'image_url' => 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
            ],
        ];

        foreach ($brands as $brandData) {
            Brand::updateOrCreate(
                ['name' => $brandData['name']],
                [
                    'description' => $brandData['description'],
                    'image_url' => $brandData['image_url'],
                    'slug' => Str::slug($brandData['name']),
                ]
            );
        }
    }
}
