import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

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

  return 'Unable to load customers.';
}

function formatDate(value) {
  if (!value) {
    return '-';
  }

  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function AdminCustomers() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Custom Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    }),
    [token]
  );

  useEffect(() => {
    let isActive = true;

    const loadCustomers = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get('/api/admin/customers', { headers: authHeaders });
        if (isActive) {
          setCustomers(extractItems(response));
        }
      } catch (fetchError) {
        if (isActive) {
          setError(getApiErrorMessage(fetchError));
          setCustomers([]);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadCustomers();

    return () => {
      isActive = false;
    };
  }, [authHeaders]);

  const confirmDelete = (customer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setCustomerToDelete(null);
  };

  const executeDelete = async () => {
    if (!customerToDelete) return;

    setDeleting(true);
    try {
      await axios.delete(`/api/admin/customers/${customerToDelete.id}`, { headers: authHeaders });
      setCustomers((prev) => prev.filter((c) => c.id !== customerToDelete.id));
      toast.success('Customer removed successfully');
      setIsDeleteModalOpen(false);
      setCustomerToDelete(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove customer');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="grid gap-10">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold/90">Patron Directory</p>
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-white sm:text-6xl">Customers</h1>
      </div>

      <div className="overflow-hidden rounded-[40px] border border-white/5 bg-luxury-charcoal shadow-luxury-md">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead className="bg-white/2 text-[9px] font-bold uppercase tracking-[0.3em] text-stone-500">
              <tr>
                <th className="px-8 py-6">Patron</th>
                <th className="px-8 py-6">Email</th>
                <th className="px-8 py-6">Phone</th>
                <th className="px-8 py-6">Address</th>
                <th className="px-8 py-6">Joined</th>
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
              ) : error ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center text-rose-500 font-bold uppercase tracking-widest text-xs">{error}</td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center text-stone-500 italic uppercase tracking-widest text-xs">No patrons registered yet.</td>
                </tr>
              ) : customers.map((customer) => (
                <tr key={customer.id} className="group hover:bg-white/2 transition-colors duration-500">
                  <td className="px-8 py-6">
                    <span className="font-serif text-lg text-white">{customer.name}</span>
                  </td>
                  <td className="px-8 py-6 text-sm text-stone-400">{customer.email}</td>
                  <td className="px-8 py-6 text-sm text-stone-400">{customer.phone_number || '—'}</td>
                  <td className="px-8 py-6 text-sm text-stone-400 max-w-xs truncate">{customer.address || '—'}</td>
                  <td className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                    {formatDate(customer.created_at)}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => confirmDelete(customer)}
                      className="inline-flex items-center justify-center rounded-full p-2 text-stone-500 transition-all hover:bg-rose-500/10 hover:text-rose-500"
                      title="Remove Customer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {isDeleteModalOpen && customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={cancelDelete}>
          <div 
            className="w-full max-w-md rounded-[32px] bg-luxury-charcoal p-8 border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-2xl text-white mb-4">Remove Patron?</h3>
            <p className="text-stone-400 text-sm leading-relaxed mb-8">
              Are you sure you want to permanently remove <span className="text-white font-medium">{customerToDelete.name}</span>? This action will delete their profile and cannot be undone.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={cancelDelete}
                className="flex-1 px-6 py-4 rounded-2xl bg-white/5 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete}
                disabled={deleting}
                className="flex-1 px-6 py-4 rounded-2xl bg-rose-500 text-white text-xs font-bold uppercase tracking-widest hover:bg-rose-600 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  'Confirm Removal'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
