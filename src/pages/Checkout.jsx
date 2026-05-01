import { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  address: '',
};

function getApiErrorMessage(error) {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  const validationErrors = error?.response?.data?.errors;

  if (validationErrors) {
    return Object.values(validationErrors).flat().join(' ');
  }

  return 'Unable to place your order right now.';
}

export default function Checkout() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { items, cartTotal, clearCart } = useCart();
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const authHeaders = useMemo(
    () => ({
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    [token]
  );

  const updateField = (field) => (event) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!items.length) {
      setError('Your cart is empty. Please add items before checking out.');
      return;
    }

    setLoading(true);
    setError('');

    const payload = {
      customer_name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      total_amount: cartTotal,
      items: items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      order_items: items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      await axios.post('/api/orders', payload, { headers: authHeaders });
      clearCart();
      setForm(initialFormState);
      setSuccess(true);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    } finally {
      setLoading(false);
    }
  };

  // --- 1. PROPERLY CLOSED SUCCESS STATE ---
  if (success) {
    return (
      <main style={styles.successPage}>
        <section style={styles.successCard}>
          <div className={`checkout-actions ${isMobile ? 'checkout-actions--fixed' : ''}`} style={styles.actions}>
            <button type="button" onClick={() => navigate('/cart')} style={styles.secondaryButton}>
              Back to Cart
            </button>
            <button type="submit" disabled={loading || !items.length} style={loading || !items.length ? styles.primaryButtonDisabled : styles.primaryButton}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </section>
      </main>
    );
  }

  // --- 2. MAIN CHECKOUT FORM ---
  return (
    <main>
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ fontFamily: 'MillerDisplay, serif', fontSize: 28, marginBottom: 24 }}>Checkout</h1>
        
        <form onSubmit={handleSubmit}>
          
          {/* Shipping Details */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 18, color: '#111827', marginBottom: 16 }}>Shipping Details</h3>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full name</label>
              <input style={styles.input} type="text" value={form.name} onChange={updateField('name')} required />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input style={styles.input} type="email" value={form.email} onChange={updateField('email')} required />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number</label>
              <input style={styles.input} type="tel" value={form.phone} onChange={updateField('phone')} required />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Shipping Address</label>
              <input style={styles.input} type="text" value={form.address} onChange={updateField('address')} required />
            </div>
          </div>

          {/* Order Summary */}
          <h2 style={styles.sectionTitle}>Order Summary</h2>
          <div style={styles.itemsList}>
            {items.length ? (
              items.map((item) => (
                <div key={item.id} style={styles.summaryItem}>
                  <span>{item.name}</span>
                  <span>
                    {item.quantity} x ${Number(item.price || 0).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <p style={styles.emptyText}>Your cart is empty.</p>
            )}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 18, fontWeight: 700 }}>
            <div>Total Amount</div>
            <div>${Number(cartTotal || 0).toFixed(2)}</div>
          </div>

          {/* Error Message Display */}
          {error ? <p style={styles.error}>{error}</p> : null}

          {/* Actions */}
          <div style={styles.actions}>
            <button type="button" onClick={() => navigate('/cart')} style={styles.secondaryButton}>
              Back to Cart
            </button>
            <button type="submit" disabled={loading || !items.length} style={loading || !items.length ? styles.primaryButtonDisabled : styles.primaryButton}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>

        </form>
      </section>
    </main>
  );
}

const styles = {
  page: {
    padding: '48px 24px',
    background: '#f9fafb',
    minHeight: 'calc(100vh - 76px)',
  },
  card: {
    width: 'min(1100px, 100%)',
    margin: '0 auto',
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '24px',
    padding: '28px',
    boxShadow: '0 18px 45px rgba(15, 23, 42, 0.06)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: '24px',
  },
  kicker: {
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    fontSize: '12px',
    color: '#6b7280',
  },
  title: {
    margin: '8px 0 0',
    fontSize: '34px',
    lineHeight: 1.1,
  },
  subtitle: {
    margin: '10px 0 0',
    color: '#6b7280',
    maxWidth: '64ch',
  },
  summaryBox: {
    minWidth: '240px',
    padding: '18px',
    borderRadius: '18px',
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    display: 'grid',
    gap: '4px',
  },
  summaryLabel: {
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontSize: '12px',
  },
  summaryTotal: {
    fontSize: '30px',
    lineHeight: 1.1,
  },
  summaryMeta: {
    color: '#6b7280',
  },
  form: {
    display: 'grid',
    gap: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '16px',
  },
  label: {
    display: 'grid',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#111827',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '12px',
    border: '1px solid #d1d5db',
    background: '#fff',
  },
  textarea: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '12px',
    border: '1px solid #d1d5db',
    resize: 'vertical',
    background: '#fff',
  },
  itemsCard: {
    padding: '18px',
    borderRadius: '18px',
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
  },
  sectionTitle: {
    margin: '0 0 14px',
    fontSize: '18px',
  },
  itemsList: {
    display: 'grid',
    gap: '10px',
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '12px 0',
    borderBottom: '1px solid #e5e7eb',
  },
  emptyText: {
    margin: 0,
    color: '#6b7280',
  },
  error: {
    margin: 0,
    color: '#b91c1c',
    fontWeight: 600,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    flexWrap: 'wrap',
  },
  secondaryButton: {
    border: '1px solid #d1d5db',
    borderRadius: '12px',
    padding: '14px 20px',
    background: '#fff',
    color: '#111827',
    fontWeight: 700,
    cursor: 'pointer',
  },
  primaryButton: {
    border: 'none',
    borderRadius: '12px',
    padding: '14px 20px',
    background: '#111827',
    color: '#fff',
    fontWeight: 800,
    cursor: 'pointer',
  },
  primaryButtonDisabled: {
    border: 'none',
    borderRadius: '12px',
    padding: '14px 20px',
    background: '#9ca3af',
    color: '#fff',
    fontWeight: 800,
    cursor: 'not-allowed',
  },
  successPage: {
    minHeight: 'calc(100vh - 76px)',
    display: 'grid',
    placeItems: 'center',
    padding: '48px 24px',
    background: '#f9fafb',
  },
  successCard: {
    width: 'min(720px, 100%)',
    padding: '40px',
    borderRadius: '24px',
    background: '#fff',
    border: '1px solid #e5e7eb',
    boxShadow: '0 18px 45px rgba(15, 23, 42, 0.06)',
    textAlign: 'center',
  },
  successTitle: {
    margin: '12px 0 0',
    fontSize: '36px',
    lineHeight: 1.1,
  },
  successCopy: {
    margin: '16px auto 0',
    maxWidth: '52ch',
    color: '#6b7280',
    lineHeight: 1.7,
  },
};