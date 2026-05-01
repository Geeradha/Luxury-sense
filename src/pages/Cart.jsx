import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

function formatCurrency(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

export default function Cart() {
  const navigate = useNavigate();
  const { items, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.header}>
          <div>
            <p style={styles.kicker}>Your Cart</p>
            <h1 style={styles.title}>Review your selected items</h1>
            <p style={styles.subtitle}>Update quantities, remove items, and continue to checkout when you’re ready.</p>
          </div>

          {items.length ? (
            <button type="button" onClick={clearCart} style={styles.secondaryButton}>
              Clear Cart
            </button>
          ) : null}
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Subtotal</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length ? (
                items.map((item) => (
                  <tr key={item.id}>
                    <td style={styles.td}>
                      <div style={styles.productCell}>
                        {item.image_path ? (
                          <img src={`/storage/${item.image_path}`} alt={item.name} style={styles.thumbnail} />
                        ) : (
                          <div style={styles.thumbnailPlaceholder}>No image</div>
                        )}
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td style={styles.td}>{formatCurrency(item.price)}</td>
                    <td style={styles.td}>
                      <div style={styles.quantityControl}>
                        <button type="button" onClick={() => updateQuantity(item.id, -1)} style={styles.quantityButton}>
                          −
                        </button>
                        <span style={styles.quantityValue}>{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, 1)} style={styles.quantityButton}>
                          +
                        </button>
                      </div>
                    </td>
                    <td style={styles.td}>{formatCurrency(item.price * item.quantity)}</td>
                    <td style={styles.td}>
                      <button type="button" onClick={() => removeFromCart(item.id)} style={styles.secondaryButton}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={styles.emptyState}>
                    Your cart is empty. <Link to="/shop">Continue shopping</Link>.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={styles.footer}>
          <div>
            <p style={styles.footerLabel}>Cart Total</p>
            <p style={styles.total}>{formatCurrency(cartTotal)}</p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/checkout')}
            disabled={!items.length}
            style={items.length ? styles.primaryButton : styles.primaryButtonDisabled}
          >
            Proceed to Checkout
          </button>
        </div>
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
    width: 'min(1200px, 100%)',
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
    marginBottom: '24px',
    flexWrap: 'wrap',
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
  tableWrap: {
    overflowX: 'auto',
    border: '1px solid #e5e7eb',
    borderRadius: '18px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '16px',
    textAlign: 'left',
    background: '#f9fafb',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontSize: '12px',
    borderBottom: '1px solid #e5e7eb',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '16px',
    borderBottom: '1px solid #f3f4f6',
    verticalAlign: 'top',
  },
  productCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minWidth: '220px',
  },
  thumbnail: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    objectFit: 'cover',
    border: '1px solid #e5e7eb',
    background: '#f9fafb',
  },
  thumbnailPlaceholder: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    border: '1px dashed #cbd5e1',
    background: '#f8fafc',
    display: 'grid',
    placeItems: 'center',
    color: '#6b7280',
    fontSize: '11px',
    textAlign: 'center',
  },
  quantityControl: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px',
    border: '1px solid #e5e7eb',
    borderRadius: '999px',
  },
  quantityButton: {
    width: '32px',
    height: '32px',
    borderRadius: '999px',
    border: 'none',
    background: '#111827',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '18px',
    lineHeight: 1,
  },
  quantityValue: {
    minWidth: '20px',
    textAlign: 'center',
    fontWeight: 700,
  },
  secondaryButton: {
    border: '1px solid #d1d5db',
    borderRadius: '12px',
    padding: '10px 14px',
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
  emptyState: {
    padding: '28px 16px',
    textAlign: 'center',
    color: '#6b7280',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    marginTop: '24px',
    flexWrap: 'wrap',
  },
  footerLabel: {
    margin: 0,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontSize: '12px',
  },
  total: {
    margin: '8px 0 0',
    fontSize: '32px',
    fontWeight: 800,
  },
};