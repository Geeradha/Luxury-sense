import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
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

function normalizeOrderItems(order) {
  return order.order_items || order.orderItems || [];
}

function normalizeOrders(payload) {
  if (Array.isArray(payload?.orders)) {
    return payload.orders;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  return [];
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get('/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        setOrders(normalizeOrders(response.data));
      } catch (dashboardError) {
        setError(dashboardError?.response?.data?.message || 'Unable to load admin dashboard orders.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
      setOrders([]);
    }
  }, [token]);

  const totalOrders = orders.length;

  const totalRevenue = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0),
    [orders]
  );

  return (
    <section style={styles.page}>
      <header style={styles.header}>
        <p style={styles.eyebrow}>Luxury Sense Admin</p>
        <h1 style={styles.title}>Orders Command Center</h1>
        <p style={styles.subtitle}>Curated visibility into every incoming order and customer delivery detail.</p>
      </header>

      <section style={styles.summaryGrid}>
        <article style={styles.summaryCard}>
          <p style={styles.metricLabel}>Total Orders</p>
          <p style={styles.metricValue}>{loading ? '...' : totalOrders.toLocaleString()}</p>
        </article>

        <article style={styles.summaryCardDark}>
          <p style={styles.metricLabelDark}>Total Revenue</p>
          <p style={styles.metricValueDark}>{loading ? '...' : formatMoney(totalRevenue)}</p>
        </article>
      </section>

      <section style={styles.tableCard}>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Order</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Shipping Address</th>
                <th style={styles.th}>Items</th>
                <th style={styles.th}>Total</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={styles.emptyCell}>
                    Loading orders...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" style={styles.emptyCell}>
                    {error}
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={styles.emptyCell}>
                    No orders yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const items = normalizeOrderItems(order);

                  return (
                    <tr key={order.id}>
                      <td style={styles.cell}>#{order.id}</td>
                      <td style={styles.cell}>{formatDate(order.created_at)}</td>
                      <td style={styles.cell}>{order.customer_name || '-'}</td>
                      <td style={styles.cell}>{order.email || '-'}</td>
                      <td style={styles.cellAddress}>{order.address || '-'}</td>
                      <td style={styles.cell}>
                        <div style={styles.itemList}>
                          {items.length ? (
                            items.map((item) => (
                              <div key={item.id || `${order.id}-${item.product_id}`} style={styles.itemRow}>
                                <span>{item.product?.name || `Product #${item.product_id}`}</span>
                                <span>x{item.quantity}</span>
                                <span>{formatMoney(item.price)}</span>
                              </div>
                            ))
                          ) : (
                            <span style={styles.itemMuted}>No items</span>
                          )}
                        </div>
                      </td>
                      <td style={styles.cellTotal}>{formatMoney(order.total_amount)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

const styles = {
  page: {
    display: 'grid',
    gap: '24px',
    background: 'linear-gradient(175deg, #fdfdfd 0%, #f7f7f7 60%, #f4f4f4 100%)',
    padding: '4px',
  },
  header: {
    border: '1px solid #e9e9e9',
    borderRadius: '24px',
    padding: '24px 22px',
    background: 'radial-gradient(circle at top right, rgba(0, 0, 0, 0.04), transparent 34%), #ffffff',
  },
  eyebrow: {
    margin: 0,
    fontFamily: 'Inter, Lato, sans-serif',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    color: '#8b8b8b',
  },
  title: {
    margin: '10px 0 0',
    fontFamily: 'Playfair Display, Georgia, serif',
    fontSize: 'clamp(2rem, 4.2vw, 3.4rem)',
    fontWeight: 600,
    lineHeight: 1,
    letterSpacing: '0.01em',
    color: '#101010',
  },
  subtitle: {
    margin: '12px 0 0',
    maxWidth: '70ch',
    color: '#4a4a4a',
    fontFamily: 'Inter, Lato, sans-serif',
    lineHeight: 1.7,
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: '16px',
  },
  summaryCard: {
    border: '1px solid #ececec',
    borderRadius: '20px',
    background: '#ffffff',
    padding: '20px',
    boxShadow: '0 14px 34px rgba(0, 0, 0, 0.04)',
  },
  summaryCardDark: {
    border: '1px solid #111111',
    borderRadius: '20px',
    background: 'linear-gradient(130deg, #111111 0%, #1f1f1f 100%)',
    padding: '20px',
    boxShadow: '0 20px 38px rgba(0, 0, 0, 0.2)',
  },
  metricLabel: {
    margin: 0,
    fontFamily: 'Inter, Lato, sans-serif',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    color: '#7b7b7b',
  },
  metricValue: {
    margin: '9px 0 0',
    fontFamily: 'Playfair Display, Georgia, serif',
    fontSize: 'clamp(1.9rem, 4vw, 2.7rem)',
    lineHeight: 1,
    color: '#101010',
  },
  metricLabelDark: {
    margin: 0,
    fontFamily: 'Inter, Lato, sans-serif',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  metricValueDark: {
    margin: '9px 0 0',
    fontFamily: 'Playfair Display, Georgia, serif',
    fontSize: 'clamp(1.9rem, 4vw, 2.7rem)',
    lineHeight: 1,
    color: '#ffffff',
  },
  tableCard: {
    border: '1px solid #e8e8e8',
    borderRadius: '22px',
    background: '#ffffff',
    overflow: 'hidden',
    boxShadow: '0 16px 36px rgba(17, 17, 17, 0.05)',
  },
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '980px',
  },
  th: {
    padding: '14px 16px',
    borderBottom: '1px solid #ececec',
    textAlign: 'left',
    fontFamily: 'Inter, Lato, sans-serif',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.11em',
    color: '#858585',
    background: '#fafafa',
    whiteSpace: 'nowrap',
  },
  cell: {
    padding: '16px',
    borderBottom: '1px solid #f2f2f2',
    color: '#181818',
    fontFamily: 'Inter, Lato, sans-serif',
    fontSize: '14px',
    verticalAlign: 'top',
  },
  cellAddress: {
    padding: '16px',
    borderBottom: '1px solid #f2f2f2',
    color: '#303030',
    fontFamily: 'Inter, Lato, sans-serif',
    fontSize: '14px',
    lineHeight: 1.5,
    verticalAlign: 'top',
    maxWidth: '320px',
  },
  cellTotal: {
    padding: '16px',
    borderBottom: '1px solid #f2f2f2',
    color: '#181818',
    fontFamily: 'Playfair Display, Georgia, serif',
    fontWeight: 600,
    fontSize: '18px',
    verticalAlign: 'top',
    whiteSpace: 'nowrap',
  },
  itemList: {
    display: 'grid',
    gap: '8px',
  },
  itemRow: {
    display: 'grid',
    gridTemplateColumns: '1fr auto auto',
    gap: '10px',
    alignItems: 'start',
    fontSize: '13px',
    color: '#2e2e2e',
  },
  itemMuted: {
    color: '#8a8a8a',
    fontSize: '13px',
  },
  emptyCell: {
    padding: '34px 16px',
    textAlign: 'center',
    color: '#6f6f6f',
    fontFamily: 'Inter, Lato, sans-serif',
  },
};