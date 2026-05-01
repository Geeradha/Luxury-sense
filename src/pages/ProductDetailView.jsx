import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import apiClient from '../api/axios';
import luxuryProducts from '../data/luxuryProducts.json';

export default function ProductDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await apiClient.get(`/products/${id}`);
        const data = response.data?.data || response.data;
        setProduct(data);
      } catch (fetchError) {
        // Fallback to local JSON data
        const localProduct = luxuryProducts.find(
          (p) => p.id === parseInt(id, 10)
        );

        if (localProduct) {
          setProduct(localProduct);
        } else {
          setError('Unable to load product details. Please try again.');
          console.error('Product fetch error:', fetchError);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading product...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">{error || 'Product not found.'}</p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-2 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image_path: product.image_path || product.image,
        quantity,
      });
      // Optionally show a success message
      alert(`Added ${quantity} item(s) to cart!`);
    }
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'specs', label: 'Specs' },
    { id: 'qa', label: 'Q&A' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              {product.description || 'No description available.'}
            </p>
            <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Key Features</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Handcrafted with premium materials</li>
              <li>Sustainably sourced</li>
              <li>Limited edition design</li>
              <li>Perfect for discerning collectors</li>
            </ul>
          </div>
        );

      case 'specs':
        return (
          <div className="space-y-4">
            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span className="font-semibold text-gray-900">Material</span>
              <span className="text-gray-700">Premium Grade</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span className="font-semibold text-gray-900">Origin</span>
              <span className="text-gray-700">Artisan Crafted</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span className="font-semibold text-gray-900">Care</span>
              <span className="text-gray-700">Hand care recommended</span>
            </div>
            <div className="flex justify-between pb-3">
              <span className="font-semibold text-gray-900">Warranty</span>
              <span className="text-gray-700">1 Year</span>
            </div>
          </div>
        );

      case 'qa':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Q: Is this item available for international shipping?</h4>
              <p className="text-gray-700">A: Yes, we offer international shipping. Shipping costs and times vary by location.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Q: Can I return or exchange this product?</h4>
              <p className="text-gray-700">A: We offer a 30-day return policy for unused items in original condition.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Q: How is this product packaged?</h4>
              <p className="text-gray-700">A: All items are carefully packaged in luxury gift boxes with protective padding.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const imageSrc = product.image_path || product.image || '';

  return (
    <main className="min-h-screen bg-white py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb / Back Link */}
        <button
          onClick={() => navigate('/shop')}
          className="text-sm text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          ← Back to Shop
        </button>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Image */}
          <div className="flex items-start justify-center">
            <div className="w-full bg-gray-50 rounded-lg overflow-hidden shadow-sm">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={product.name}
                  className="w-full h-auto object-cover aspect-square"
                />
              ) : (
                <div className="w-full aspect-square flex items-center justify-center bg-gray-100 text-gray-400">
                  Image Coming Soon
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="flex flex-col">
            {/* Brand/Partner */}
            <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-2">
              Luxury Collection
            </p>

            {/* Product Name */}
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <p className="text-3xl font-bold text-gray-900 mb-6">
              ${Number(product.price || 0).toFixed(2)}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-2">
              <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={decreaseQuantity}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold transition-colors"
                >
                  −
                </button>
                <span className="w-12 h-10 flex items-center justify-center text-lg font-semibold text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Stock Warning */}
            <p className="text-xs text-purple-600 mb-6 font-medium">
              Last 2 remaining in stock
            </p>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-gray-900 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-3 mb-8"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Add to Cart
            </button>

            {/* Tab Navigation */}
            <div className="flex gap-6 border-b border-gray-200 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-1 text-sm font-semibold uppercase tracking-wide transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900 rounded-t-full"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 text-gray-700">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
