import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function ProductCard({ product, editorial = false }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // 1. SAFE VARIATION ACCESS & STATE SYNC
  const variations = useMemo(() => product?.variations || [], [product?.variations]);
  const [selectedVariation, setSelectedVariation] = useState(() => variations[0] || null);

  // Sync selected variation when variations change or on initial load
  useEffect(() => {
    if (variations.length > 0) {
      // Keep current selection if it still exists, otherwise default to first
      const stillExists = variations.find(v => v.id === selectedVariation?.id);
      if (!stillExists) {
        setSelectedVariation(variations[0]);
      }
    } else {
      setSelectedVariation(null);
    }
  }, [variations, selectedVariation?.id]);

  const handleQuickAdd = (event) => {
    event.stopPropagation();
    event.preventDefault();
    
    // Add specific variation if selected, else add generic product
    const itemToAdd = selectedVariation ? {
      id: product.id,
      variation_id: selectedVariation.id,
      name: `${product.name} (${selectedVariation.size_label})`,
      price: selectedVariation.price,
      image_path: product.image_path || product.image || product.imageUrl,
      quantity: 1,
    } : {
      id: product.id,
      name: product.name,
      price: product.price,
      image_path: product.image_path || product.image || product.imageUrl,
      quantity: 1,
    };

    addToCart(itemToAdd);
    toast.success(`Added ${product.name} to your collection.`);
  };

  // Helper to ensure correct image URL formatting
  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const apiOrigin = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '');
    return `${apiOrigin}/storage/${path}`;
  };

  const rawImage = product?.image_path || product?.image || product?.imageUrl || '';
  const imageSrc = getImageUrl(rawImage);
  const displayPrice = selectedVariation ? Number(selectedVariation.price) : Number(product?.price || 0);
  const currentStock = selectedVariation ? Number(selectedVariation.stock_quantity) : Number(product?.stock_level ?? product?.stock_quantity ?? 0);
  const isOutOfStock = currentStock <= 0;

  return (
    <motion.article
      onClick={() => navigate(`/product/${product.id}`)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative cursor-pointer overflow-hidden rounded-[32px] border border-white/5 bg-luxury-charcoal shadow-luxury-sm transition-all duration-700 hover:border-luxury-gold/30 hover:shadow-gold-glow ${
        editorial ? 'aspect-[4/5]' : 'aspect-square'
      }`}
    >
      <div className="h-full w-full overflow-hidden bg-luxury-black">
        {imageSrc ? (
          <motion.img
            src={imageSrc}
            alt={product?.name}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-luxury-charcoal text-stone-600 font-bold uppercase tracking-widest text-[10px]">
            Image Coming Soon
          </div>
        )}
      </div>

      {/* Luxury Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/95 via-luxury-black/40 to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-90" />

      {/* Wishlist Heart Toggle */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className={`absolute top-5 right-5 z-10 p-2 transition-all duration-200 active:scale-90 ${
          isInWishlist(product.id)
            ? 'text-luxury-gold drop-shadow-[0_0_8px_rgba(212,175,158,0.5)]'
            : 'text-white/50 hover:text-white drop-shadow-md'
        }`}
        aria-label="Toggle Wishlist"
      >
        <Heart 
          size={22} 
          className={isInWishlist(product.id) ? 'fill-luxury-gold text-luxury-gold' : 'fill-transparent'} 
          strokeWidth={1.5}
        />
      </button>

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
        <div className="flex flex-col gap-1.5">
          <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-luxury-gold/90">
            {product?.category?.name || 'Exclusive'}
          </p>
          <h3 className="font-serif text-2xl tracking-tight text-white">
            {product?.name}
          </h3>

          <div className="flex items-center justify-between mt-1">
            <p className="font-medium text-white/90 text-lg">
              RS. {displayPrice.toFixed(2)}
            </p>
            {currentStock < 5 && currentStock > 0 && (
              <span className="text-[9px] font-bold uppercase tracking-widest text-amber-500 animate-pulse">Low Stock</span>
            )}
          </div>
        </div>

        {/* VARIATION SELECTOR (PILLS) */}
        {variations.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2 transition-all duration-500 opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0">
            {variations.map((v) => {
              const active = selectedVariation?.id === v.id;
              const outOfStock = v.stock_quantity <= 0;
              return (
                <button
                  key={v.id}
                  disabled={outOfStock}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariation(v);
                  }}
                  className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all duration-300 ${
                    active 
                      ? 'bg-luxury-gold border-luxury-gold text-luxury-dark' 
                      : outOfStock 
                        ? 'border-white/5 bg-transparent text-stone-700 line-through cursor-not-allowed opacity-40' 
                        : 'border-white/10 bg-white/5 text-stone-400 hover:border-luxury-gold/50 hover:text-white'
                  }`}
                >
                  {v.size_label}
                </button>
              );
            })}
          </div>
        )}

        {/* Sliding Quick Add Button */}
        <div className="mt-6 overflow-hidden">
          <motion.button
            type="button"
            disabled={isOutOfStock}
            onClick={handleQuickAdd}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full rounded-full border border-luxury-gold bg-luxury-gold py-3.5 text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-dark transition-all duration-500 opacity-100 translate-y-0 md:opacity-0 md:translate-y-12 md:group-hover:opacity-100 md:group-hover:translate-y-0 hover:bg-transparent hover:text-luxury-gold disabled:cursor-not-allowed disabled:border-stone-700 disabled:bg-stone-800 disabled:text-stone-500`}
          >
            {isOutOfStock ? 'Out of Stock' : 'Quick Add'}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}