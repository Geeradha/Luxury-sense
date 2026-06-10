import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

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

  const rows = useMemo(() => {
    if (loading) {
      return (
        <tr>
          <td colSpan="5" className="px-4 py-8 text-center text-sm text-stone-500">Loading customers...</td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan="5" className="px-4 py-8 text-center text-sm text-rose-700">{error}</td>
        </tr>
      );
    }

    if (!customers.length) {
      return (
        <tr>
          <td colSpan="5" className="px-4 py-8 text-center text-sm text-stone-500">No customers found.</td>
        </tr>
      );
    }

    return customers.map((customer) => (
      <tr key={customer.id} className="border-t border-stone-100">
        <td className="px-4 py-4 font-medium text-stone-950">{customer.name}</td>
        <td className="px-4 py-4 text-sm text-stone-600">{customer.email}</td>
        <td className="px-4 py-4 text-sm text-stone-600">{customer.phone_number || '-'}</td>
        <td className="px-4 py-4 text-sm text-stone-600">{customer.address || '-'}</td>
        <td className="px-4 py-4 text-sm text-stone-600">{formatDate(customer.created_at)}</td>
      </tr>
    ));
  }, [customers, error, loading]);

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
                <th className="px-8 py-6 text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-luxury-gold border-t-transparent"></div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-rose-500 font-bold uppercase tracking-widest text-xs">{error}</td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-stone-500 italic uppercase tracking-widest text-xs">No patrons registered yet.</td>
                </tr>
              ) : customers.map((customer) => (
                <tr key={customer.id} className="group hover:bg-white/2 transition-colors duration-500">
                  <td className="px-8 py-6">
                    <span className="font-serif text-lg text-white">{customer.name}</span>
                  </td>
                  <td className="px-8 py-6 text-sm text-stone-400">{customer.email}</td>
                  <td className="px-8 py-6 text-sm text-stone-400">{customer.phone_number || '—'}</td>
                  <td className="px-8 py-6 text-sm text-stone-400 max-w-xs truncate">{customer.address || '—'}</td>
                  <td className="px-8 py-6 text-right text-[10px] font-bold uppercase tracking-widest text-stone-500">
                    {formatDate(customer.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
