import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api/axios';
import luxuryProducts from '../data/luxuryProducts.json';
import { toast } from 'sonner';
import RelatedProducts from '../components/RelatedProducts';

export default function ProductDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  // 1. ALL STATE DECLARATIONS AT THE TOP
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  // 2. MISSING Q&A STATES ADDED
  const [questionText, setQuestionText] = useState('');
  const [questionError, setQuestionError] = useState('');
  const [questionMessage, setQuestionMessage] = useState('');
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [pendingQuestions, setPendingQuestions] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await apiClient.get(`/products/${id}`);
        const data = response.data?.data;
        const related = response.data?.related || [];
        
        setProduct(data);
        setRelatedProducts(related);
        
        // Initialize main image
        const initialImage = data.images?.find(img => img.is_primary)?.image_path 
          || data.images?.[0]?.image_path 
          || data.image_path 
          || data.image
          || data.imageUrl;
        if (initialImage) {
          setMainImage(initialImage);
        }

        if (data.variations?.length > 0) {
          setSelectedVariation(data.variations[0]);
        }
      } catch (fetchError) {
        // Fallback to local JSON data
        const localProduct = luxuryProducts.find(
          (p) => p.id === parseInt(id, 10)
        );

        if (localProduct) {
          setProduct(localProduct);
          setRelatedProducts([]); // No local related products fallback for now
          if (localProduct.variations?.length > 0) {
            setSelectedVariation(localProduct.variations[0]);
          }
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
      window.scrollTo(0, 0); // Reset scroll on product change
    }
  }, [id]);

  // 3. SAFE VARIATION ACCESS & STATE SYNC
  const variations = useMemo(() => product?.variations || [], [product?.variations]);

  // Sync selected variation when variations change or on initial load
  useEffect(() => {
    if (variations.length > 0) {
      const stillExists = variations.find(v => v.id === selectedVariation?.id);
      if (!stillExists) {
        setSelectedVariation(variations[0]);
      }
    } else {
      setSelectedVariation(null);
    }
  }, [variations, selectedVariation?.id]);

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      // Add specific variation if selected, else add generic product
      const itemToAdd = selectedVariation ? {
        id: product.id,
        variation_id: selectedVariation.id,
        name: `${product.name} (${selectedVariation.size_label})`,
        price: selectedVariation.price,
        image_path: product.image_path || product.image || product.imageUrl,
        quantity,
      } : {
        id: product.id,
        name: product.name,
        price: product.price,
        image_path: product.image_path || product.image || product.imageUrl,
        quantity,
      };

      addToCart(itemToAdd);
      toast.success(`Added to your collection.`);
    }
  };

  const handleQuestionSubmit = async (event) => {
    event.preventDefault();
    setQuestionError('');
    setQuestionMessage('');

    if (!isAuthenticated) {
      setQuestionError('Please sign in to ask a question about this product.');
      return;
    }

    const trimmedQuestion = questionText.trim();

    if (!trimmedQuestion) {
      setQuestionError('Please enter your question before submitting.');
      return;
    }

    setIsSubmittingQuestion(true);

    try {
      const response = await apiClient.post(`/products/${id}/questions`, {
        question: trimmedQuestion,
      });

      const submittedQuestion = response.data?.data ?? {
        id: `pending-${Date.now()}`,
        question: trimmedQuestion,
        answer: null,
        is_approved: false,
        user: { name: user?.name || 'You' },
      };

      setPendingQuestions((current) => [submittedQuestion, ...current]);
      setQuestionText('');
      setQuestionMessage('Your question has been submitted and is awaiting approval.');
      toast.success('Question submitted successfully!');
    } catch (submitError) {
      setQuestionError(
        submitError?.response?.data?.message || 'Unable to submit your question right now.'
      );
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-luxury-black text-luxury-gold">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-current border-t-transparent" />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-luxury-black">
        <div className="text-center">
          <p className="text-stone-500 text-lg mb-8 font-serif italic">{error || 'This piece is no longer in our collection.'}</p>
          <button
            onClick={() => navigate('/shop')}
            className="rounded-full border border-luxury-gold bg-luxury-gold px-8 py-3 text-[11px] font-bold uppercase tracking-widest text-luxury-dark transition-all duration-500 hover:bg-transparent hover:text-luxury-gold"
          >
            Back to Boutique
          </button>
        </div>
      </main>
    );
  }

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'specs', label: 'Specs' },
    { id: 'qa', label: 'Q&A' },
  ];

  const approvedQuestions = Array.isArray(product.questions) ? product.questions : [];
  const allQuestions = [...pendingQuestions, ...approvedQuestions];

  const stockQuantity = selectedVariation 
    ? Number(selectedVariation.stock_quantity) 
    : Number(product.stock_level ?? product.stock_quantity ?? 0);
  const isOutOfStock = stockQuantity <= 0;

  // Helper to ensure correct image URL formatting
  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const apiOrigin = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '');
    return `${apiOrigin}/storage/${path}`;
  };

  const currentDisplayImage = mainImage ? getImageUrl(mainImage) : '';

  const renderSpecs = () => {
    const specs = product.specs;

    if (!specs || typeof specs !== 'object' || Array.isArray(specs)) {
      return <p className="text-stone-500 text-sm italic">No product specifications available.</p>;
    }

    const entries = Object.entries(specs).filter(([, value]) => value !== null && value !== undefined && value !== '');

    if (entries.length === 0) {
      return <p className="text-stone-500 text-sm italic">No product specifications available.</p>;
    }

    return (
      <div className="space-y-4">
        {entries.map(([key, value]) => (
          <div key={key} className="flex justify-between border-b border-white/5 pb-4 gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
              {key}
            </span>
            <span className="text-sm font-medium text-white text-right">
              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="prose prose-sm max-w-none">
            <p className="text-stone-400 leading-relaxed mb-4">
              {product.description || 'No description available.'}
            </p>
            <h4 className="text-lg font-semibold text-white mt-6 mb-3">Key Features</h4>
            <ul className="list-disc list-inside space-y-2 text-stone-400">
              <li>Handcrafted with premium materials</li>
              <li>Sustainably sourced</li>
              <li>Limited edition design</li>
              <li>Perfect for discerning collectors</li>
            </ul>
          </div>
        );

      case 'specs':
        return renderSpecs();

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-luxury-black py-16 px-6 sm:px-8 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb / Back Link */}
        <button
          onClick={() => navigate('/shop')}
          className="mb-12 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500 transition-colors hover:text-luxury-gold"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Boutique
        </button>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Column: Image & Gallery */}
          <div className="lg:col-span-7">
            <div className="sticky top-32">
              <div className="overflow-hidden rounded-[32px] border border-white/5 bg-luxury-charcoal shadow-luxury-lg mb-6">
                {currentDisplayImage ? (
                  <img
                    src={currentDisplayImage}
                    alt={product.name}
                    className="w-full h-auto object-cover aspect-[4/5] transition-opacity duration-500"
                  />
                ) : (
                  <div className="w-full aspect-[4/5] flex items-center justify-center bg-luxury-charcoal text-stone-600">
                    Image Coming Soon
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-4">
                  {product.images.map((img) => {
                    const isSelected = mainImage === img.image_path;
                    return (
                      <button
                        key={img.id}
                        onClick={() => setMainImage(img.image_path)}
                        className={`shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                          isSelected
                            ? 'border-luxury-gold opacity-100 shadow-gold-glow'
                            : 'border-transparent opacity-50 hover:opacity-100 hover:border-white/20'
                        }`}
                      >
                        <img
                          src={getImageUrl(img.image_path)}
                          alt={`${product.name} thumbnail`}
                          className="h-20 w-20 object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-5 flex flex-col pt-4">
            {/* Brand/Partner */}
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.45em] text-luxury-gold">
              {product.category?.name || 'Luxury Collection'}
            </p>

            {/* Product Name */}
            <h1 className="mb-6 font-serif text-5xl font-medium leading-tight text-white sm:text-6xl">
              {product.name}
            </h1>

            {/* Price */}
            <p className="mb-10 text-3xl font-medium text-white/90">
              RS. {selectedVariation ? Number(selectedVariation.price).toFixed(2) : Number(product.price || 0).toFixed(2)}
            </p>

            {/* VARIATION SELECTOR */}
            {product.variations?.length > 0 && (
              <div className="mb-12">
                <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">Select Size</p>
                <div className="flex flex-wrap gap-4">
                  {product.variations.map((v) => {
                    const active = selectedVariation?.id === v.id;
                    const outOfStock = v.stock_quantity <= 0;
                    return (
                      <button
                        key={v.id}
                        disabled={outOfStock}
                        onClick={() => setSelectedVariation(v)}
                        className={`px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest border transition-all duration-500 ${
                          active 
                            ? 'bg-luxury-gold border-luxury-gold text-luxury-dark shadow-gold-glow' 
                            : outOfStock 
                              ? 'border-white/5 bg-transparent text-stone-700 line-through cursor-not-allowed opacity-40' 
                              : 'border-white/10 bg-white/2 text-stone-400 hover:border-luxury-gold hover:text-white'
                        }`}
                      >
                        {v.size_label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mb-10 space-y-8">
              {/* Quantity Selector */}
              <div className="flex items-center gap-8">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">Quantity</span>
                <div className="flex items-center rounded-full border border-white/10 bg-white/5 px-2">
                  <button
                    onClick={decreaseQuantity}
                    className="w-10 h-10 flex items-center justify-center text-stone-400 hover:text-white transition-colors"
                  >
                    −
                  </button>
                  <span className="w-10 h-10 flex items-center justify-center text-sm font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="w-10 h-10 flex items-center justify-center text-stone-400 hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-5 px-8 rounded-full font-bold text-[11px] uppercase tracking-[0.3em] transition-all duration-700 flex items-center justify-center gap-4 ${
                  isOutOfStock
                    ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                    : 'bg-luxury-gold text-luxury-dark hover:bg-transparent hover:text-luxury-gold border border-luxury-gold shadow-gold-glow'
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
                </svg>
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>

              {/* Stock Warning */}
              {!isOutOfStock && stockQuantity < 10 && (
                <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gold animate-pulse">
                  Only {stockQuantity} pieces remaining
                </p>
              )}
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-10 border-b border-white/5 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 relative ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-stone-500 hover:text-stone-300'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-luxury-gold rounded-full shadow-gold-glow"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 text-stone-400 leading-relaxed">
              {activeTab === 'qa' ? (
                <div className="space-y-8">
                  <div className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-xl">
                    <h4 className="text-sm font-bold uppercase tracking-[0.3em] text-white mb-4">Inquiry</h4>
                    {questionError ? (
                      <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        {questionError}
                      </div>
                    ) : null}

                    {questionMessage ? (
                      <div className="mb-4 rounded-lg border border-luxury-gold/20 bg-luxury-gold/10 px-4 py-3 text-sm text-luxury-gold">
                        {questionMessage}
                      </div>
                    ) : null}

                    {isAuthenticated ? (
                      <form onSubmit={handleQuestionSubmit} className="space-y-4">
                        <textarea
                          value={questionText}
                          onChange={(event) => setQuestionText(event.target.value)}
                          rows={4}
                          placeholder="Your question..."
                          className="w-full rounded-2xl border border-white/10 bg-luxury-black/50 px-5 py-4 text-sm text-white outline-none focus:border-luxury-gold/50"
                        />
                        <button
                          type="submit"
                          disabled={isSubmittingQuestion}
                          className="rounded-full border border-luxury-gold bg-luxury-gold px-6 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-luxury-dark transition-all duration-500 hover:bg-transparent hover:text-luxury-gold"
                        >
                          {isSubmittingQuestion ? 'Submitting...' : 'Submit Inquiry'}
                        </button>
                      </form>
                    ) : (
                      <button
                        onClick={() => navigate('/login')}
                        className="w-full rounded-full border border-white/10 bg-white/5 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white hover:bg-white/10"
                      >
                        Sign in to ask
                      </button>
                    )}
                  </div>
                  
                  {/* Questions List */}
                  <div className="space-y-4">
                    {allQuestions.length > 0 ? (
                      <div className="space-y-4">
                        {allQuestions.map((question) => {
                          const questionId = question.id ?? `${question.question}-${question.answer ?? ''}`;
                          const hasAnswer = Boolean(question.answer);
                          const isApproved = question.is_approved !== false;

                          return (
                            <article key={questionId} className="rounded-2xl border border-white/5 bg-white/5 p-5 shadow-sm">
                              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                                <p className="text-[10px] uppercase tracking-[0.22em] text-stone-500">
                                  {question.user?.name || 'Customer'}
                                </p>
                                {!isApproved ? (
                                  <span className="rounded-full bg-stone-800 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-stone-400">
                                    Pending approval
                                  </span>
                                ) : null}
                              </div>

                              <p className="text-sm text-white">Q: {question.question}</p>

                              {hasAnswer ? (
                                <p className="mt-3 text-sm text-stone-400">
                                  <span className="text-white">A:</span> {question.answer}
                                </p>
                              ) : (
                                <p className="mt-3 text-sm text-stone-600">Awaiting answer.</p>
                              )}
                            </article>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-stone-500">No questions have been asked about this piece yet.</p>
                    )}
                  </div>
                </div>
              ) : renderTabContent()}
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS CAROUSEL */}
        <RelatedProducts products={relatedProducts} />
      </div>
    </main>
  );
}