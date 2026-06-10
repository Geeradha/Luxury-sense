import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import LogoutButton from '../components/LogoutButton';
import { useAuth } from '../contexts/AuthContext';

function extractOrders(response) {
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

  return 'Unable to load your orders.';
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

function formatMoney(value) {
  return `RS. ${Number(value || 0).toFixed(2)}`;
}

const statusStyles = {
  pending: 'border-amber-200 bg-amber-50 text-amber-700',
  confirmed: 'border-sky-200 bg-sky-50 text-sky-700',
  completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  rejected: 'border-rose-200 bg-rose-50 text-rose-700',
  cancelled: 'border-stone-200 bg-stone-100 text-stone-500',
};

function normalizeStatus(status) {
  return String(status || 'pending').trim().toLowerCase();
}

export default function MyOrders() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelingId, setCancelingId] = useState(null);

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    }),
    [token]
  );

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    let isActive = true;

    const loadOrders = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get('/api/orders', { headers: authHeaders });

        if (isActive) {
          setOrders(extractOrders(response));
        }
      } catch (fetchError) {
        if (isActive) {
          setError(getApiErrorMessage(fetchError));
          setOrders([]);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isActive = false;
    };
  }, [authHeaders, navigate, token]);

  const handleCancel = async (orderId) => {
    const confirmed = window.confirm('Cancel this pending order?');

    if (!confirmed) {
      return;
    }

    setCancelingId(orderId);
    setError('');

    try {
      const response = await axios.delete(`/api/orders/${orderId}`, { headers: authHeaders });
      const updatedOrder = response.data?.order;

      if (updatedOrder) {
        setOrders((currentOrders) =>
          currentOrders.map((order) => (order.id === orderId ? updatedOrder : order))
        );
      } else {
        setOrders((currentOrders) =>
          currentOrders.map((order) =>
            order.id === orderId ? { ...order, status: 'cancelled' } : order
          )
        );
      }

      toast.success('Order cancelled successfully.');
    } catch (cancelError) {
      const message = getApiErrorMessage(cancelError);
      setError(message);
      toast.error(message);
    } finally {
      setCancelingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-luxury-black py-20 px-6 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold/90">Order History</p>
            <h1 className="mt-4 font-serif text-5xl tracking-tight text-white sm:text-6xl">My Orders</h1>
          </div>
          <div className="flex gap-4">
            <Link to="/profile" className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 hover:text-white transition-colors">
              Profile
            </Link>
            <LogoutButton className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500 hover:text-rose-400 transition-colors" />
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-luxury-gold border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="rounded-[32px] border border-rose-500/20 bg-rose-500/5 p-8 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-rose-500">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-[32px] border border-white/5 bg-luxury-charcoal p-20 text-center shadow-luxury-lg">
            <p className="text-lg text-stone-500 mb-8">You haven't placed any orders yet.</p>
            <Link
              to="/shop"
              className="inline-block rounded-full border border-luxury-gold bg-luxury-gold px-10 py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-luxury-dark transition-all duration-700 hover:bg-transparent hover:text-luxury-gold shadow-gold-glow"
            >
              Start Exploring
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const normalizedStatus = normalizeStatus(order.status);
              const canCancel = normalizedStatus === 'pending';

              return (
                <article
                  key={order.id}
                  className="group overflow-hidden rounded-[32px] border border-white/5 bg-luxury-charcoal shadow-luxury-md transition-all duration-700 hover:border-luxury-gold/20"
                >
                  <div className="border-b border-white/5 bg-white/2 px-8 py-6 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex gap-10">
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-500">Reference</p>
                        <p className="text-sm font-medium text-white">#LS-{order.id}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-500">Date</p>
                        <p className="text-sm font-medium text-white">{formatDate(order.created_at)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-500">Total</p>
                        <p className="text-sm font-medium text-luxury-gold">{formatMoney(order.total_amount)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <span className={`rounded-full px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] border ${
                        statusStyles[normalizedStatus] || 'border-stone-700 bg-stone-800 text-stone-400'
                      }`}>
                        {normalizedStatus}
                      </span>
                      
                      {canCancel && (
                        <button
                          onClick={() => handleCancel(order.id)}
                          disabled={cancelingId === order.id}
                          className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500 hover:text-rose-400 transition-colors disabled:opacity-50"
                        >
                          {cancelingId === order.id ? 'Wait...' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="px-8 py-8 space-y-6">
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-6">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/5 bg-luxury-black">
                          <img
                            src={item.product?.image_path ? (item.product.image_path.startsWith('http') ? item.product.image_path : `${(import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '')}/storage/${item.product.image_path}`) : ''}
                            alt={item.product?.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-white truncate">{item.product?.name || 'Bespoke Item'}</h4>
                          <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-1">Quantity: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-white">{formatMoney(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}