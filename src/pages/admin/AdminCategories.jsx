import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../api/axios';
import CategoryForm from '../../components/admin/CategoryForm';
import { motion, AnimatePresence } from 'framer-motion';

function extractItems(response) {
  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  return [];
}

function getApiErrorMessage(error) {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  const validationErrors = error?.response?.data?.errors;

  if (validationErrors) {
    return Object.values(validationErrors).flat().join(' ');
  }

  return 'Something went wrong while saving the category.';
}

function normalizeCategory(category) {
  return {
    ...category,
    description: category?.description ?? '',
    image: category?.image ?? null,
  };
}

const apiOrigin = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '');

function resolveImageUrl(path) {
  if (!path) {
    return '';
  }

  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) {
    return path;
  }

  return `${apiOrigin}/storage/${path}`;
}

export default function AdminCategories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', image: '' });
  const [imagePreview, setImagePreview] = useState('');
  
  // Custom Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const fetchCategories = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.get('/categories', { headers: authHeaders });
      setCategories(extractItems(response).map(normalizeCategory));
    } catch (fetchError) {
      setError(getApiErrorMessage(fetchError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreateForm = () => {
    setEditingCategory(null);
    setForm({ name: '', description: '', image: '' });
    setImagePreview('');
    setFormError('');
  };

  const openEditForm = (category) => {
    setEditingCategory(category);
    setForm({
      name: category.name || '',
      description: category.description || '',
      image: category.image || '',
    });
    setImagePreview(resolveImageUrl(category.image));
    setFormError('');
  };

  const handleCancel = () => {
    openCreateForm();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError('');

    const payload = {
      name: form.name,
      description: form.description,
      image: form.image || null,
    };

    try {
      if (editingCategory) {
        await apiClient.put(`/admin/categories/${editingCategory.id}`, payload, {
          headers: authHeaders,
        });
      } else {
        await apiClient.post('/admin/categories', payload, {
          headers: authHeaders,
        });
      }

      await fetchCategories();
      openCreateForm();
    } catch (saveError) {
      setFormError(getApiErrorMessage(saveError));
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const executeDelete = async () => {
    if (!categoryToDelete) return;

    setError('');
    setIsDeleteModalOpen(false);

    try {
      await apiClient.delete(`/admin/categories/${categoryToDelete.id}`, {
        headers: authHeaders,
      });

      if (editingCategory?.id === categoryToDelete.id) {
        openCreateForm();
      }

      await fetchCategories();
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError));
    } finally {
      setCategoryToDelete(null);
    }
  };

  return (
    <section className="grid gap-10">
      <div className="flex flex-col gap-6">
        
        <h1 className="font-serif text-5xl tracking-tight text-white sm:text-6xl">Boutique Categories</h1>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,480px)_1fr] lg:items-start">
        <div className="rounded-[40px] border border-white/5 bg-luxury-black/40 p-8 shadow-luxury-md">
          <CategoryForm
            value={form.name}
            descriptionValue={form.description}
            imagePreview={imagePreview}
            onChange={(field, value) => setForm((current) => ({ ...current, [field]: value }))}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            submitting={submitting}
            error={formError}
            submitLabel="Save Collection"
            title={editingCategory ? 'Refine Collection' : 'New Collection'}
            description={editingCategory ? 'Update the details of this collection.' : 'Create a new category for a group of artisanal goods.'}
            onImageChange={(file) => {
              setForm((current) => ({ ...current, image: file }));
              setImagePreview(file);
            }}
          />
        </div>

        <div className="rounded-[40px] border border-white/5 bg-luxury-charcoal p-8 shadow-luxury-md">
          <div className="flex items-start justify-between gap-6 border-b border-white/5 pb-8 mb-8">
            <div>
              
              <h2 className="mt-2 font-serif text-3xl tracking-tight text-white">Active Categories</h2>
            </div>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="py-20 text-center">
                <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-luxury-gold border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="rounded-[32px] border border-rose-500/20 bg-rose-500/5 p-8 text-center text-rose-500 font-bold uppercase tracking-widest text-xs">
                {error}
              </div>
            ) : categories.length ? (
              <div className="grid gap-6">
                {categories.map((category) => (
                  <div key={category.id} className="group flex flex-col gap-6 rounded-[32px] border border-white/5 bg-luxury-black/40 p-6 transition-all duration-700 hover:border-luxury-gold/20 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-6">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-white/5 bg-luxury-black shadow-luxury-sm transition-transform duration-700 group-hover:scale-105">
                        {category.image ? (
                          <img
                            src={resolveImageUrl(category.image)}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-[9px] font-bold uppercase tracking-widest text-stone-700">No Image</div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="font-serif text-xl text-white truncate">{category.name}</p>
                        <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-gold/70">
                          Ref: #{category.id}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <button
                        type="button"
                        onClick={() => openEditForm(category)}
                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 hover:text-white transition-colors"
                      >
                        Refine
                      </button>
                      <button
                        type="button"
                        onClick={() => confirmDelete(category)}
                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500 hover:text-rose-400 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-20 text-center text-sm text-stone-500 italic uppercase tracking-widest">No categories discovered yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && categoryToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={cancelDelete}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#121212] p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent clicking inside modal from closing it
            >
              <h3 className="font-serif text-2xl text-white mb-4">Remove Category?</h3>
              <p className="text-sm text-stone-400 leading-relaxed mb-8">
                Are you sure you want to permanently delete <span className="text-white font-medium">{categoryToDelete.name}</span>? This action cannot be undone.
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
