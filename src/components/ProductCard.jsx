import { useState } from 'react';
import { Link } from 'react-router-dom';
import Toast from './Toast';

export default function ProductCard({
  product,
  onQuickAdd,
  className = '',
  editorial = false,
}) {
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [showToast, setShowToast] = useState(false);

  if (!product) {
    return null;
  }

  const handleQuickAdd = (prod) => {
    onQuickAdd?.(prod);
    setShowToast(true);
  }

  const imageSrc = product.image || product.image_path || product.imageUrl || '';
  const productName = product.name || '';
  const productPrice = product.price ?? '';

  return (
    <Link to={`/product/${product.id}`} className="block">
      <article
        className={`flex flex-col border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow ${className}`}
      >
        {/* Image Container - ADDED 'relative' HERE */}
        <div
          className="relative w-full overflow-hidden bg-gray-100 rounded-t-lg"
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={productName}
              className="w-full aspect-square object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-semibold uppercase tracking-widest">
              Image Coming Soon
            </div>
          )}

          {/* Top Choices Badge */}
          <div className="absolute top-0 right-0 m-3 px-3 py-1.5 bg-yellow-300 rounded-sm">
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Top Choices
            </span>
          </div>

          {/* Quick Add Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleQuickAdd(product);
            }}
            className={`absolute bottom-4 left-4 text-sm font-semibold uppercase tracking-wider transition-all duration-280 ${
              isImageHovered
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-1.5 pointer-events-none'
            } ${editorial ? 'text-gray-900' : 'text-white'}`}
            style={{
              textShadow: editorial ? 'none' : '0 1px 4px rgba(0, 0, 0, 0.35)',
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.color = '#d4af9e';
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.color = editorial ? '#111111' : '#ffffff';
            }}
          >
            Quick Add
          </button>
        </div>

        {/* Text Content */}
        <div className="p-4">
          <h3 className="text-gray-800 font-semibold text-lg leading-tight truncate font-serif">
            {productName}
          </h3>
          <p className="mt-2 text-gray-700 font-bold text-lg">
            {typeof productPrice === 'number'
              ? `RS. ${productPrice.toFixed(2)}`
              : `RS. ${productPrice}`}
          </p>
        </div>
      </article>
      <Toast 
        message="Added to cart!" 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </Link>
  );
}