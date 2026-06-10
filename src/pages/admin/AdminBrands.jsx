import { useEffect, useMemo, useState } from 'react';
import apiClient from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';
import BrandForm from '../../components/admin/BrandForm';
import { motion, AnimatePresence } from 'framer-motion';

const initialFormState = {
  name: '',
  description: '',
  image_url: '',
};

function extractItems(response) {
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function buildImageUrl(imagePath) {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  const apiOrigin = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '');
  return `${apiOrigin}/storage/${imagePath}`;
}

export default function AdminBrands() {
  const { token } = useAuth();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [form, setForm] = useState(initialFormState);
  
  // Custom Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);

  const authHeaders = useMemo(() => ({
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  }), [token]);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/brands', { headers: authHeaders });
      setBrands(extractItems(res));
    } catch (err) {
      setError('Unable to load brands.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreateModal = () => {
    setEditingBrand(null);
    setForm(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (brand) => {
    setEditingBrand(brand);
    setForm({
      name: brand.name,
      description: brand.description || '',
      image_url: brand.image_url || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingBrand) {
        await apiClient.put(`/admin/brands/${editingBrand.id}`, form, { headers: authHeaders });
      } else {
        await apiClient.post('/admin/brands', form, { headers: authHeaders });
      }
      fetchBrands();
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save brand.');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (brand) => {
    setBrandToDelete(brand);
    setIsDeleteModalOpen(true);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setBrandToDelete(null);
  };

  const executeDelete = async () => {
    if (!brandToDelete) return;

    setError('');
    setIsDeleteModalOpen(false);

    try {
      await apiClient.delete(`/admin/brands/${brandToDelete.id}`, { headers: authHeaders });
      fetchBrands();
    } catch (err) {
      alert('Failed to delete brand.');
    } finally {
      setBrandToDelete(null);
    }
  };

  return (
    <section className="grid gap-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          
          <h1 className="font-serif text-5xl tracking-tight text-white sm:text-6xl">Brands</h1>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center rounded-full border border-luxury-gold bg-luxury-gold px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-luxury-dark transition-all duration-700 hover:bg-transparent hover:text-luxury-gold shadow-gold-glow"
        >
          Add Maison
        </button>
      </div>

      <div className="overflow-hidden rounded-[40px] border border-white/5 bg-luxury-charcoal shadow-luxury-md">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead className="bg-white/2 text-[9px] font-bold uppercase tracking-[0.3em] text-stone-500">
              <tr>
                <th className="px-8 py-6">Maison</th>
                <th className="px-8 py-6">Slug</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="3" className="px-8 py-20 text-center"><div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-luxury-gold border-t-transparent" /></td></tr>
              ) : brands.map(brand => (
                <tr key={brand.id} className="group hover:bg-white/2 transition-colors duration-500">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      {brand.image_url ? (
                        <img src={buildImageUrl(brand.image_url)} className="h-10 w-10 rounded-full object-cover bg-stone-900 border border-white/10" alt="" />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-800 border border-white/5 text-[11px] font-bold uppercase text-stone-500">
                          {brand.name.charAt(0)}
                        </div>
                      )}
                      <span className="font-serif text-xl text-white">{brand.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-stone-500">{brand.slug}</td>
                  <td className="px-8 py-6 text-right space-x-6">
                    <button onClick={() => openEditModal(brand)} className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 hover:text-white transition-colors">Edit</button>
                    <button onClick={() => confirmDelete(brand)} className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500 hover:text-rose-400 transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-luxury-black/90 px-4 py-10 backdrop-blur-xl transition-all duration-500" onClick={() => setIsModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-2xl max-h-full overflow-y-auto rounded-[40px] border border-white/5 bg-luxury-charcoal p-8 shadow-2xl custom-scrollbar sm:p-12"
              onClick={e => e.stopPropagation()}
            >
              <div className="mb-12 flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-luxury-gold/90">{editingBrand ? 'Refinement' : 'New Maison'}</p>
                  <h2 className="mt-4 font-serif text-4xl text-white tracking-tight sm:text-5xl">{editingBrand ? 'Update Brand' : 'Create Brand'}</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-white transition-all duration-300 hover:border-luxury-gold hover:text-luxury-gold">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
              <BrandForm
                form={form}
                onFieldChange={(f, v) => setForm(c => ({ ...c, [f]: v }))}
                onCancel={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                submitting={submitting}
                submitLabel={editingBrand ? 'Save Changes' : 'Create Brand'}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && brandToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={cancelDelete}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#121212] p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-serif text-2xl text-white mb-4">Remove Maison?</h3>
              <p className="text-sm text-stone-400 leading-relaxed mb-8">
                Are you sure you want to permanently delete <span className="text-white font-medium">{brandToDelete.name}</span>? This action cannot be undone.
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
