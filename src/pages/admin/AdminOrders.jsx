import { useEffect, useMemo, useState, Fragment } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ChevronDown, 
  ChevronUp, 
  Package, 
  MapPin, 
  Phone, 
  CheckCircle, 
  Truck,
  Filter,
  Calendar,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomDropdown from '../../components/admin/CustomDropdown';
import CustomDatePicker from '../../components/admin/CustomDatePicker';

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

  return 'Unable to load orders.';
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

const statusOptions = ['confirmed', 'rejected', 'completed'];

const statusStyles = {
  confirmed: 'border-amber-200 bg-amber-50 text-amber-700',
  rejected: 'border-rose-200 bg-rose-50 text-rose-700',
  completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  cancelled: 'border-stone-200 bg-stone-100 text-stone-500',
  pending: 'border-stone-200 bg-stone-50 text-stone-500',
};

function normalizeStatus(status) {
  const normalized = String(status || 'pending').trim().toLowerCase();

  if (statusOptions.includes(normalized)) {
    return normalized;
  }

  return 'pending';
}

function getCustomerName(order) {
  return order?.user?.name || order?.customer_name || 'Unknown Customer';
}

function getCustomerEmail(order) {
  return order?.user?.email || order?.email || '-';
}

function getCustomerPhone(order) {
  return order?.phone || '-';
}

export default function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  
  const [selectedIds, setSelectedIds] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    }),
    [token]
  );

  const fetchOrders = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get('/api/admin/orders', { headers: authHeaders });
      setOrders(extractOrders(response));
    } catch (fetchError) {
      setError(getApiErrorMessage(fetchError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const handleStatusChange = async (orderId, status) => {
    const label = status.charAt(0).toUpperCase() + status.slice(1);

    const toastId = toast(`Change status to ${label}?`, {
      action: {
        label: 'Confirm',
        onClick: async () => {
          setSavingId(orderId);
          setError('');

          try {
            const response = await axios.put(
              `/api/admin/orders/${orderId}/status`,
              { status },
              { headers: authHeaders }
            );

            const updatedOrder = response.data?.data;

            setOrders((currentOrders) =>
              currentOrders.map((order) => (order.id === orderId ? updatedOrder : order))
            );

            toast.success('Order status updated and customer notified.');
          } catch (updateError) {
            const message = getApiErrorMessage(updateError);
            setError(message);
            toast.error(message);
          } finally {
            setSavingId(null);
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {
          toast.dismiss(toastId);
        },
      },
    });
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedIds.length === 0) return;

    const label = status === 'completed' ? 'Fulfilled' : 'Confirmed';
    
    toast(`Mark ${selectedIds.length} orders as ${label}?`, {
      action: {
        label: 'Confirm',
        onClick: async () => {
          setIsBulkUpdating(true);
          try {
            await axios.put('/api/admin/orders/bulk-status', {
              ids: selectedIds,
              status: status
            }, { headers: authHeaders });
            
            toast.success(`Successfully updated ${selectedIds.length} orders.`);
            setSelectedIds([]);
            fetchOrders(); 
          } catch (err) {
            toast.error(getApiErrorMessage(err));
          } finally {
            setIsBulkUpdating(false);
          }
        }
      }
    });
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const normalizedStatus = normalizeStatus(order.status);
      const matchesStatus = statusFilter === 'all' || normalizedStatus === statusFilter;

      const orderDate = order.created_at ? new Date(order.created_at).toISOString().slice(0, 10) : '';
      const matchesDate = !dateFilter || orderDate === dateFilter;

      return matchesStatus && matchesDate;
    });
  }, [dateFilter, orders, statusFilter]);

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredOrders.map(o => o.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectOrder = (e, orderId) => {
    e.stopPropagation();
    if (e.target.checked) {
      setSelectedIds(prev => [...prev, orderId]);
    } else {
      setSelectedIds(prev => prev.filter(id => id !== orderId));
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All States' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Fulfilled' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const tableStatusOptions = [
    { value: 'pending', label: 'Pending', disabled: true },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <section className="grid gap-6 w-full px-1 py-6 sm:gap-10 sm:px-2 sm:py-8">
      {/* Header with Bulk Actions */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold/90">Boutique Logistics</p>
          <h1 className="font-serif text-4xl tracking-tight text-white sm:text-6xl">Customer Orders</h1>
        </div>
        
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="flex items-center gap-4 rounded-2xl border border-luxury-gold/20 bg-luxury-gold/5 p-4 backdrop-blur-md self-start lg:self-auto"
            >
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gold">
                  {selectedIds.length} Selected
                </span>
                <span className="text-[8px] text-stone-500 uppercase tracking-widest">Bulk Actions</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex gap-2">
                <button
                  disabled={isBulkUpdating}
                  onClick={() => handleBulkStatusUpdate('confirmed')}
                  className="flex items-center gap-2 rounded-full bg-luxury-gold px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-dark hover:shadow-gold-glow transition-all disabled:opacity-50"
                >
                  <CheckCircle size={12} />
                  Confirm
                </button>
                <button
                  disabled={isBulkUpdating}
                  onClick={() => handleBulkStatusUpdate('completed')}
                  className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-white/20 transition-all disabled:opacity-50"
                >
                  <Truck size={12} />
                  Ship
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filters Grid */}
      <div className="grid gap-6 rounded-[32px] border border-white/5 bg-luxury-black/40 p-6 shadow-luxury-md sm:grid-cols-2">
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 pl-1">
            <Filter size={12} className="text-luxury-gold" />
            Status Filter
          </label>
          <CustomDropdown 
            value={statusFilter}
            onChange={setStatusFilter}
            options={filterOptions}
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 pl-1">
            <Calendar size={12} className="text-luxury-gold" />
            Date Selection
          </label>
          <CustomDatePicker 
            value={dateFilter}
            onChange={setDateFilter}
            placeholder="Select Boutique Date"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full overflow-hidden rounded-[32px] border border-white/5 bg-luxury-charcoal shadow-luxury-md">
        {/* Hide scrollbar track but allow horizontal scrolling */}
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <table className="min-w-full border-collapse text-left">
            <thead className="bg-white/2 text-[9px] font-bold uppercase tracking-[0.3em] text-stone-500 border-b border-white/5">
              <tr>
                <th className="px-6 py-6 w-10">
                  <div className="flex justify-center">
                    <input
                      type="checkbox"
                      className="appearance-none h-4 w-4 border border-white/20 checked:bg-[#d4af37] checked:border-[#d4af37] rounded-sm cursor-pointer transition-all relative after:content-['✓'] after:absolute after:hidden checked:after:block after:text-luxury-dark after:text-[10px] after:left-0.5 after:top-0"
                      checked={selectedIds.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </div>
                </th>
                <th className="px-6 py-6">Reference</th>
                <th className="px-6 py-6">Placed On</th>
                <th className="px-6 py-6">Patron</th>
                <th className="px-6 py-6">Investment</th>
                <th className="px-6 py-6">Current Status</th>
                <th className="px-6 py-6 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-8 py-20 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-luxury-gold border-t-transparent"></div>
                    <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">Recuperating records...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="px-8 py-20 text-center">
                    <div className="text-rose-500 font-bold uppercase tracking-widest text-xs">{error}</div>
                    <button onClick={fetchOrders} className="mt-4 text-[9px] text-luxury-gold hover:underline uppercase tracking-widest font-bold">Try again</button>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-8 py-20 text-center text-stone-500 italic uppercase tracking-widest text-xs">No matching orders discovered.</td>
                </tr>
              ) : filteredOrders.map((order) => {
                const normalizedStatus = normalizeStatus(order.status);
                const isPending = normalizedStatus === 'pending';
                const isExpanded = expandedId === order.id;

                return (
                  <Fragment key={order.id}>
                    <tr 
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      className={`group cursor-pointer hover:bg-white/2 transition-colors duration-500 ${isPending ? 'bg-luxury-gold/5' : ''} ${isExpanded ? 'bg-white/5' : ''}`}
                    >
                      <td className="px-6 py-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            className="appearance-none h-4 w-4 border border-white/20 checked:bg-[#d4af37] checked:border-[#d4af37] rounded-sm cursor-pointer transition-all relative after:content-['✓'] after:absolute after:hidden checked:after:block after:text-luxury-dark after:text-[10px] after:left-0.5 after:top-0"
                            checked={selectedIds.includes(order.id)}
                            onChange={(e) => toggleSelectOrder(e, order.id)}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-white text-sm">#LS-{order.id}</span>
                          {isExpanded ? (
                            <ChevronUp size={14} className="text-luxury-gold" />
                          ) : (
                            <ChevronDown size={14} className="text-stone-600 group-hover:text-stone-400 transition-colors" />
                          )}
                          {isPending && (
                            <span className="h-1.5 w-1.5 rounded-full bg-luxury-gold shadow-[0_0_8px_rgba(212,175,158,0.6)] animate-pulse" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-xs text-stone-400 font-medium whitespace-nowrap">{formatDate(order.created_at)}</td>
                      <td className="px-6 py-6">
                        <div className="font-bold text-white text-sm">{getCustomerName(order)}</div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-[10px] text-stone-500 uppercase tracking-widest flex items-center gap-1">
                            <Mail size={10} /> {getCustomerEmail(order)}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-stone-700 hidden sm:block" />
                          <span className="text-[10px] text-stone-500 tracking-widest flex items-center gap-1">
                            <Phone size={10} /> {getCustomerPhone(order)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-sm font-bold text-luxury-gold whitespace-nowrap">{formatMoney(order.total_amount)}</td>
                      <td className="px-6 py-6">
                        <span className={`rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] border ${
                          statusStyles[normalizedStatus] || 'border-stone-700 bg-stone-800 text-stone-400'
                        }`}>
                          {normalizedStatus}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                        {normalizedStatus === 'cancelled' ? (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-600">Revoked</span>
                        ) : (
                          <CustomDropdown 
                            value={normalizedStatus}
                            onChange={(nextStatus) => handleStatusChange(order.id, nextStatus)}
                            options={tableStatusOptions}
                            disabled={savingId === order.id}
                            align="right"
                            className="!py-2 !px-4 !rounded-full !text-[10px] font-bold uppercase tracking-[0.2em]"
                          />
                        )}
                      </td>
                    </tr>
                    
                    {/* Expandable Panel */}
                    <AnimatePresence>
                      {isExpanded && (
                        <tr>
                          <td colSpan="7" className="p-0 border-none">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className="overflow-hidden bg-white/2"
                            >
                              <div className="p-6 sm:p-8 grid gap-6 md:grid-cols-2 bg-white/5 rounded-b-[32px] mx-4 mb-4 border border-white/5">
                                {/* Shipping Address */}
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 text-luxury-gold">
                                    <MapPin size={16} />
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">Shipping Destination</h4>
                                  </div>
                                  <div className="rounded-2xl bg-luxury-black/40 p-5 border border-white/5">
                                    <p className="text-sm text-stone-300 leading-relaxed italic">
                                      {order.address || 'No shipping address provided.'}
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Order Items */}
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 text-luxury-gold">
                                    <Package size={16} />
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">Acquired Pieces</h4>
                                  </div>
                                  <div className="rounded-2xl bg-luxury-black/40 border border-white/5 divide-y divide-white/5 max-h-[300px] overflow-y-auto custom-scrollbar">
                                    {order.order_items?.map((item) => (
                                      <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                          <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-luxury-gold shrink-0">
                                            <Package size={20} />
                                          </div>
                                          <div>
                                            <div className="text-sm font-medium text-white line-clamp-1">{item.product?.name || 'Unknown Piece'}</div>
                                            <div className="text-[10px] text-stone-500 uppercase tracking-widest">Qty: {item.quantity} × {formatMoney(item.price)}</div>
                                          </div>
                                        </div>
                                        <div className="text-sm font-bold text-luxury-gold whitespace-nowrap">{formatMoney(item.price * item.quantity)}</div>
                                      </div>
                                    ))}
                                    {(!order.order_items || order.order_items.length === 0) && (
                                      <div className="p-6 text-xs text-stone-500 italic text-center uppercase tracking-widest">No pieces discovered.</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
