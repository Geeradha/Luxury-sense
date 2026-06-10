import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

function formatMoney(value) {
  return `RS. ${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getApiErrorMessage(error) {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  return 'Unable to load analytics.';
}

const statCards = [
  { key: 'total_revenue', label: 'Total Revenue', format: formatMoney },
  { key: 'total_orders', label: 'Total Orders', format: (value) => Number(value || 0).toLocaleString() },
  { key: 'pending_orders', label: 'Pending Orders', format: (value) => Number(value || 0).toLocaleString() },
  { key: 'total_customers', label: 'Total Customers', format: (value) => Number(value || 0).toLocaleString() },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_orders: 0,
    pending_orders: 0,
    total_customers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const adminName = user?.name || 'Administrator';

  const summaryText = useMemo(
    () => `${adminName} can review revenue, order volume, and customer growth from one place.`,
    [adminName]
  );

  useEffect(() => {
    let isActive = true;

    const loadStats = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get('/api/admin/dashboard-stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
            Accept: 'application/json',
          },
        });

        if (isActive) {
          setStats(response.data?.data || {});
        }
      } catch (fetchError) {
        if (isActive) {
          setError(getApiErrorMessage(fetchError));
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section className="grid gap-10">
      <header className="overflow-hidden rounded-[40px] border border-white/5 bg-luxury-black/40 p-8 lg:p-12">
        
        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-serif text-5xl tracking-tight text-white sm:text-6xl lg:text-7xl">Dashboard</h1>
            <p className="mt-6 max-w-2xl text-sm leading-8 text-stone-500 sm:text-base sm:leading-9">{summaryText}</p>
          </div>

          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400">
            System Live
          </div>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-luxury-gold border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="col-span-full rounded-[32px] border border-rose-500/20 bg-rose-500/5 p-8 text-center text-rose-500">
            <p className="text-sm font-bold uppercase tracking-widest">{error}</p>
          </div>
        ) : (
          statCards.map((card) => (
            <article key={card.key} className="group rounded-[32px] border border-white/5 bg-luxury-charcoal p-8 shadow-luxury-md transition-all duration-700 hover:border-luxury-gold/20 hover:shadow-luxury-lg">
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-500 group-hover:text-luxury-gold transition-colors">{card.label}</p>
              <h2 className="mt-6 font-serif text-4xl tracking-tight text-white group-hover:scale-105 transition-transform duration-700 origin-left">
                {card.format(stats[card.key])}
              </h2>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
