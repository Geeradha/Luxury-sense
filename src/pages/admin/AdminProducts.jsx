import { useEffect, useMemo, useState } from 'react';
import apiClient from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';
import ProductForm from '../../components/admin/ProductForm';
import { AnimatePresence, motion } from 'framer-motion';

const initialFormState = {
  name: '',
  description: '',
  price: '',
  stock_level: '',
  category_id: '',
  brand_id: '',
  gender_category: 'unisex',
  images: [], // Changed from image: ''
  specs: [],
};

function extractItems(response) {
  if (Array.isArray(response?.data?.data)) return response.data.data;
  
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function getApiErrorMessage(error) {
  const validationErrors = error?.response?.data?.errors;
  if (validationErrors) return Object.values(validationErrors).flat().join(', ');
  if (error?.response?.data?.message) return error.response.data.message;
  return 'Something went wrong while saving the product.';
}

function buildImageUrl(imagePath) {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  const apiOrigin = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '');
  return `${apiOrigin}/storage/${imagePath}`;
}

export default function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(initialFormState);
  
  // Custom Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    }),
    [token]
  );

  const fetchProductsCategoriesAndBrands = async () => {
    setLoading(true);
    setError('');

    try {
      const [productsResponse, categoriesResponse, brandsResponse] = await Promise.all([
        apiClient.get('/products', { headers: authHeaders }),
        apiClient.get('/categories', { headers: authHeaders }),
        apiClient.get('/brands', { headers: authHeaders }),
      ]);

      setProducts(extractItems(productsResponse));
      setCategories(extractItems(categoriesResponse));
      setBrands(extractItems(brandsResponse));
    } catch (fetchError) {
      setError(getApiErrorMessage(fetchError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsCategoriesAndBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm(initialFormState);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price ?? '',
      stock_level: product.stock_level ?? '',
      category_id: product.category_id ? String(product.category_id) : '',
      brand_id: product.brand_id ? String(product.brand_id) : '',
      gender_category: product.gender_category || 'unisex',
      images: (product.images || []).map(img => buildImageUrl(img.image_path)),
      specs: product.specs ? Object.entries(product.specs).map(([key, value]) => ({ key, value })) : [],
      variations: (product.variations || []).map(v => ({
        id: v.id,
        size_label: v.size_label,
        price: v.price,
        stock_quantity: v.stock_quantity,
      })),
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setForm(initialFormState);
    setFormError('');
  };

  const setFormField = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError('');

    // Convert specs array [{key, value}] to object {key: value}
    const specsObject = {};
    (form.specs || []).forEach(spec => {
      if (spec.key.trim() !== '') {
        specsObject[spec.key.trim()] = spec.value;
      }
    });

    // Construct JSON payload instead of FormData
    const payload = {
      name: form.name,
      description: form.description,
      category_id: form.category_id,
      brand_id: form.brand_id,
      gender_category: form.gender_category,
      images: (form.images || []).filter(url => url.trim() !== ''),
      specs: specsObject,
      variations: (form.variations || []).map(v => ({
        id: v.id,
        size_label: v.size_label,
        price: v.price,
        stock_quantity: v.stock_quantity,
      })),
    };

    // If no variations exist, use top-level price/stock
    if (!payload.variations.length) {
      payload.price = form.price || 0;
      payload.stock_level = form.stock_level || 0;
    }

    try {
      const url = editingProduct 
        ? `/admin/products/${editingProduct.id}` 
        : '/admin/products';
      
      if (editingProduct) {
        await apiClient.put(url, payload, { headers: authHeaders });
      } else {
        await apiClient.post(url, payload, { headers: authHeaders });
      }

      await fetchProductsCategoriesAndBrands();
      closeModal();
    } catch (saveError) {
      setFormError(getApiErrorMessage(saveError));
    } finally {
      setSubmitting(false);
    }
  };

  const tableRows = useMemo(() => {
    if (loading) {
      return (
        <tr>
          <td colSpan="7" className="px-4 py-8 text-center text-sm text-stone-500">Loading products...</td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan="7" className="px-4 py-8 text-center text-sm text-stone-500">{error}</td>
        </tr>
      );
    }

    if (!products.length) {
      return (
        <tr>
          <td colSpan="7" className="px-4 py-8 text-center text-sm text-stone-500">No products found.</td>
        </tr>
      );
    }

    return products.map((product) => {
      const categoryName = categories.find((category) => String(category.id) === String(product.category_id))?.name || 'Uncategorized';

      return (
        <tr key={product.id} className="border-t border-stone-100">
          <td className="px-4 py-4 align-top">
            <div className="flex min-w-[220px] items-center gap-3">
              {product.image_path ? (
                <img
                  src={buildImageUrl(product.image_path)}
                  alt={product.name}
                  className="h-12 w-12 rounded-2xl border border-stone-200 object-cover bg-stone-50"
                />
              ) : (
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-dashed border-stone-300 bg-stone-50 text-[11px] text-stone-400">
                  No image
                </div>
              )}
              <span className="font-medium text-stone-950">{product.name}</span>
            </div>
          </td>
          <td className="px-4 py-4 align-top text-sm text-stone-700">{categoryName}</td>
          <td className="px-4 py-4 align-top text-sm leading-6 text-stone-600">{product.description}</td>
          <td className="px-4 py-4 align-top text-sm font-medium text-stone-950">RS. {Number(product.price).toFixed(2)}</td>
          <td className="px-4 py-4 align-top text-sm text-stone-600">{Number(product.stock_level ?? 0)}</td>
          <td className="px-4 py-4 align-top text-sm text-stone-600">{product.image_path || 'No file uploaded'}</td>
          <td className="px-4 py-4 align-top">
            <button
              type="button"
              onClick={() => openEditModal(product)}
              className="rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
            >
              Edit
            </button>
          </td>
        </tr>
      );
    });
  }, [categories, error, loading, products]);

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const executeDelete = async () => {
    if (!productToDelete) return;

    setError('');
    setIsDeleteModalOpen(false);

    try {
      await apiClient.delete(`/admin/products/${productToDelete.id}`, {
        headers: authHeaders,
      });
      await fetchProductsCategoriesAndBrands();
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError));
    } finally {
      setProductToDelete(null);
    }
  };

  return (
    <section className="grid gap-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold/90">Inventory Control</p>
          <h1 className="mt-4 font-serif text-5xl tracking-tight text-white sm:text-6xl">Boutique Products</h1>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center rounded-full border border-luxury-gold bg-luxury-gold px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-luxury-dark transition-all duration-700 hover:bg-transparent hover:text-luxury-gold shadow-gold-glow"
        >
          Add Piece
        </button>
      </div>

      <div className="overflow-hidden rounded-[32px] border border-white/5 bg-luxury-charcoal shadow-luxury-md">
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <table className="min-w-full border-collapse text-left">
            <thead className="bg-white/2 text-[9px] font-bold uppercase tracking-[0.3em] text-stone-500 border-b border-white/5">
              <tr>
                <th className="px-8 py-6 min-w-[300px]">Product</th>
                <th className="px-8 py-6">Category</th>
                <th className="px-8 py-6">Price</th>
                <th className="px-8 py-6">Stock</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-luxury-gold border-t-transparent"></div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center text-stone-500 italic">No pieces found in the collection.</td>
                </tr>
              ) : products.map((product) => {
                 const categoryName = categories.find((c) => String(c.id) === String(product.category_id))?.name || 'Exclusive';
                 
                 const displayPrice = product.variations?.length > 0 
                   ? product.variations[0].price 
                   : product.price;

                 const displayStock = product.variations?.length > 0 
                   ? product.variations.reduce((acc, curr) => acc + Number(curr.stock_quantity), 0) 
                   : product.stock_level;

                 return (
                  <tr key={product.id} className="group hover:bg-white/2 transition-colors duration-500">
                    <td className="px-8 py-6 min-w-[300px]">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/5 bg-luxury-black">
                          <img src={buildImageUrl(product.image_path)} alt="" className="h-full w-full object-cover" />
                        </div>
                        <span className="font-serif text-lg text-white break-words">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-stone-400 whitespace-nowrap">{categoryName}</td>
                    <td className="px-8 py-6 text-sm font-medium text-luxury-gold whitespace-nowrap">RS. {Number(displayPrice).toFixed(2)}</td>
                    <td className="px-8 py-6 text-sm text-white whitespace-nowrap">{displayStock ?? 0}</td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className={`rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] border ${
                        Number(displayStock) > 0 ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500' : 'border-rose-500/20 bg-rose-500/5 text-rose-500'
                      }`}>
                        {Number(displayStock) > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right whitespace-nowrap space-x-6">
                      <button
                        onClick={() => openEditModal(product)}
                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 hover:text-white transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(product)}
                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500 hover:text-rose-400 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                 )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-luxury-black/90 px-4 py-10 backdrop-blur-xl transition-all duration-500" onClick={closeModal} role="presentation">
          <div
            className="max-h-full w-full max-w-5xl overflow-y-auto rounded-[40px] border border-white/5 bg-luxury-charcoal p-8 shadow-2xl custom-scrollbar sm:p-12"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="mb-12 flex items-start justify-between gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-luxury-gold/90">{editingProduct ? 'Refinement' : 'New Exhibition'}</p>
                <h2 className="mt-4 font-serif text-4xl tracking-tight text-white sm:text-5xl">
                  {editingProduct ? 'Update Piece' : 'Add to Collection'}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-white transition-all duration-300 hover:border-luxury-gold hover:text-luxury-gold"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <ProductForm
              form={form}
              categories={categories}
              brands={brands}
              onFieldChange={setFormField}
              onCancel={closeModal}
              onSubmit={handleSubmit}
              submitting={submitting}
              error={formError}
              submitLabel={editingProduct ? 'Save Changes' : 'Publish Piece'}
            />
          </div>
        </div>
      ) : null}

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && productToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={cancelDelete}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#121212] p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-serif text-2xl text-white mb-4">Remove Product?</h3>
              <p className="text-sm text-stone-400 leading-relaxed mb-8">
                Are you sure you want to permanently delete <span className="text-white font-medium">{productToDelete.name}</span>? This action cannot be undone.
              </p>
              
              <div className="flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={cancelDelete}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 hover:text-white transition-colors px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeDelete}
                  className="rounded-full border border-red-500/30 px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-red-400 transition-all hover:bg-red-500/10"
                >
                  Confirm Removal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
