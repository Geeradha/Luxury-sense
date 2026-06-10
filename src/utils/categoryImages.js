const CATEGORY_FALLBACKS = [
  { keywords: ['men', 'man', 'mens'], image: '/men_category.jfif' },
  { keywords: ['women', 'woman', 'womens', 'ladies'], image: '/women_category.jfif' },
  { keywords: ['accessor'], image: '/accessories_category.jfif' },
  { keywords: ['perfume', 'fragrance', 'scent'], image: '/perfume_category.jfif' },
  { keywords: ['new arrival', 'arrival', 'latest'], image: '/new_arrivals_category.jfif' },
];

export function getCategoryFallbackImage(categoryName = '') {
  const normalized = categoryName.toLowerCase().trim();

  const match = CATEGORY_FALLBACKS.find(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword))
  );

  return match?.image || '/new_arrivals_category.jfif';
}
