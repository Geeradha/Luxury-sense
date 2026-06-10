SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'customer',
  `is_admin` tinyint(1) NOT NULL DEFAULT '0',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`name`, `email`, `password`, `role`, `is_admin`, `email_verified_at`, `created_at`, `updated_at`) VALUES
('Luxury Sense Admin', 'admin@luxurysense.test', '$2y$12$2B1/trx889TEpcYwcu6gx.oKeLzYJsusgurE2R/xUQIZB6AjQF.dm', 'admin', 1, '2026-06-10 06:24:00', '2026-06-10 06:24:00', '2026-06-10 06:24:00');

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) VALUES (1, 'Perfumes', '2026-06-10 06:24:00', '2026-06-10 06:24:00');
INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) VALUES (2, 'Shoes', '2026-06-10 06:24:00', '2026-06-10 06:24:00');
INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) VALUES (3, 'Bags', '2026-06-10 06:24:00', '2026-06-10 06:24:00');

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock_level` int(10) unsigned NOT NULL DEFAULT '0',
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `products_category_id_foreign` (`category_id`),
  CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `products` (`category_id`, `name`, `description`, `price`, `stock_level`, `image_path`, `created_at`, `updated_at`) VALUES
(1, 'Oud Noir Extrait', 'A deeply sensual extrait de parfum where smoked oud, black incense, and velvety amber unfold like a private evening salon. Crafted with a couture concentration and a lingering, polished warmth, it leaves an unforgettable trail of dark elegance.', 380, 12, 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80', '2026-06-10 06:24:00', '2026-06-10 06:24:00');
INSERT INTO `products` (`category_id`, `name`, `description`, `price`, `stock_level`, `image_path`, `created_at`, `updated_at`) VALUES
(1, 'Maison Santal Noire', 'Silken sandalwood, velvet iris, and a hint of cardamom create a refined composition that feels quietly opulent. Its heritage-inspired depth and creamy finish evoke bespoke tailoring, polished wood, and the calm of an intimate atelier.', 520, 8, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80', '2026-06-10 06:24:00', '2026-06-10 06:24:00');
INSERT INTO `products` (`category_id`, `name`, `description`, `price`, `stock_level`, `image_path`, `created_at`, `updated_at`) VALUES
(2, 'Milano Leather Loafer', 'Hand-finished in supple full-grain leather, this loafer balances Milanese sharpness with understated comfort. Every curve is deliberate, every stitch precise, delivering a graceful silhouette that moves effortlessly from private appointments to candlelit dinners.', 750, 10, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80', '2026-06-10 06:24:00', '2026-06-10 06:24:00');
INSERT INTO `products` (`category_id`, `name`, `description`, `price`, `stock_level`, `image_path`, `created_at`, `updated_at`) VALUES
(2, 'Atelier Suede Monk Strap', 'Rich suede, burnished hardware, and a sculpted profile give this monk strap a quietly commanding presence. Built with meticulous craftsmanship and a heritage shoemaking sensibility, it delivers soft structure, depth, and enduring refinement.', 895, 6, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80', '2026-06-10 06:24:00', '2026-06-10 06:24:00');
INSERT INTO `products` (`category_id`, `name`, `description`, `price`, `stock_level`, `image_path`, `created_at`, `updated_at`) VALUES
(3, 'The Signature Envelope Clutch', 'A slender envelope silhouette rendered in smooth leather with a polished, architectural finish. Designed to feel as coveted as a handwritten invitation, it offers modern poise, tactile richness, and an exquisitely minimal profile.', 650, 9, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80', '2026-06-10 06:24:00', '2026-06-10 06:24:00');
INSERT INTO `products` (`category_id`, `name`, `description`, `price`, `stock_level`, `image_path`, `created_at`, `updated_at`) VALUES
(3, 'Grand Voyage Top-Handle Bag', 'Structured yet fluid, this top-handle bag is cut from premium leather and finished with discreet hardware for a refined, travel-ready presence. It channels old-world sophistication with a modern edge, making every departure feel deliberate and elevated.', 1450, 4, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80', '2026-06-10 06:24:00', '2026-06-10 06:24:00');

SET FOREIGN_KEY_CHECKS=1;