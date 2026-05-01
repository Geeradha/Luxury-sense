import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

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
  return `$${Number(value || 0).toFixed(2)}`;
}

function normalizeStatus(status) {
  if (!status) {
    return 'Pending';
  }

  const normalized = String(status).trim().toLowerCase();

  if (normalized === 'fulfilled' || normalized === 'completed') {
    return 'Fulfilled';
  }

  return 'Pending';
}

export default function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const openDetails = (order) => setSelectedOrder(order);
  const closeDetails = () => setSelectedOrder(null);

  const markAsFulfilled = () => {
    if (!selectedOrder) {
      return;
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === selectedOrder.id
          ? {
              ...order,
              status: 'fulfilled',
            }
          : order
      )
    );

    setSelectedOrder((currentOrder) =>
      currentOrder
        ? {
            ...currentOrder,
            status: 'fulfilled',
          }
        : null
    );
  };

  const selectedOrderStatus = normalizeStatus(selectedOrder?.status);

  const tableBody = useMemo(() => {
    if (loading) {
      return (
        <tr>
          <td colSpan="6" style={styles.emptyCell}>
            Loading orders...
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan="6" style={styles.emptyCell}>
            {error}
          </td>
        </tr>
      );
    }

    if (!orders.length) {
      return (
        <tr>
          <td colSpan="6" style={styles.emptyCell}>
            No orders found.
          </td>
        </tr>
      );
    }

    return orders.map((order) => (
      <tr key={order.id}>
        <td style={styles.cell}>#{order.id}</td>
        <td style={styles.cell}>{formatDate(order.created_at)}</td>
        <td style={styles.cell}>{order.customer_name}</td>
        <td style={styles.cell}>{formatMoney(order.total_amount)}</td>
        <td style={styles.cell}>
          <span
            style={{
              ...styles.statusPill,
              ...(normalizeStatus(order.status) === 'Fulfilled' ? styles.statusPillFulfilled : styles.statusPillPending),
            }}
          >
            {normalizeStatus(order.status)}
          </span>
        </td>
        <td style={styles.cell}>
          <button type="button" onClick={() => openDetails(order)} style={styles.actionLink}>
            View Details
          </button>
        </td>
      </tr>
    ));
  }, [error, loading, orders]);

  return (
    <section style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.kicker}>Order Management</p>
          <h1 style={styles.title}>Admin Orders</h1>
          <p style={styles.subtitle}>Review every order, customer shipping address, and the purchased items.</p>
        </div>
      </div>

      <div style={styles.tableCard}>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Order ID</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Customer Name</th>
                <th style={styles.th}>Total Amount</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>{tableBody}</tbody>
          </table>
        </div>
      </div>

      {selectedOrder ? (
        <div style={styles.modalOverlay} onClick={closeDetails} role="presentation">
          <aside style={styles.drawer} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
            <div style={styles.modalHeader}>
              <div>
                <p style={styles.kicker}>Order Details</p>
                <h2 style={styles.modalTitle}>Order #{selectedOrder.id}</h2>
              </div>
              <button type="button" onClick={closeDetails} style={styles.iconButton} aria-label="Close modal">
                ×
              </button>
            </div>

            <section style={styles.detailsCard}>
              <h3 style={styles.sectionTitle}>Shipping Address</h3>
              <p style={styles.bodyText}>{selectedOrder.address || 'No address provided.'}</p>
            </section>

            <section style={styles.detailsCard}>
              <h3 style={styles.sectionTitle}>Contact</h3>
              <dl style={styles.definitionList}>
                <div style={styles.definitionRow}>
                  <dt style={styles.definitionTerm}>Customer</dt>
                  <dd style={styles.definitionValue}>{selectedOrder.customer_name}</dd>
                </div>
                <div style={styles.definitionRow}>
                  <dt style={styles.definitionTerm}>Email</dt>
                  <dd style={styles.definitionValue}>{selectedOrder.email || '-'}</dd>
                </div>
                <div style={styles.definitionRow}>
                  <dt style={styles.definitionTerm}>Phone</dt>
                  <dd style={styles.definitionValue}>{selectedOrder.phone || '-'}</dd>
                </div>
                <div style={styles.definitionRow}>
                  <dt style={styles.definitionTerm}>Status</dt>
                  <dd style={styles.definitionValue}>{selectedOrderStatus}</dd>
                </div>
              </dl>
            </section>

            <section style={styles.itemsSection}>
              <h3 style={styles.sectionTitle}>Line Items</h3>
              <div style={styles.itemsTableWrap}>
                <table style={styles.itemsTable}>
                  <thead>
                    <tr>
                      <th style={styles.itemsTh}>Product</th>
                      <th style={styles.itemsTh}>Quantity</th>
                      <th style={styles.itemsTh}>Price</th>
                      <th style={styles.itemsTh}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.order_items?.length ? (
                      selectedOrder.order_items.map((item) => {
                        const itemSubtotal = Number(item.price || 0) * Number(item.quantity || 0);

                        return (
                          <tr key={item.id}>
                            <td style={styles.itemsCell}>{item.product?.name || `Product #${item.product_id}`}</td>
                            <td style={styles.itemsCell}>{item.quantity}</td>
                            <td style={styles.itemsCell}>{formatMoney(item.price)}</td>
                            <td style={styles.itemsCell}>{formatMoney(itemSubtotal)}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" style={styles.emptyCell}>
                          No order items available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <footer style={styles.drawerFooter}>
              <div>
                <p style={styles.totalLabel}>Total Price</p>
                <p style={styles.totalValue}>{formatMoney(selectedOrder.total_amount)}</p>
              </div>
              <button
                type="button"
                onClick={markAsFulfilled}
                disabled={selectedOrderStatus === 'Fulfilled'}
                style={{
                  ...styles.fulfillButton,
                  ...(selectedOrderStatus === 'Fulfilled' ? styles.fulfillButtonDisabled : null),
                }}
              >
                {selectedOrderStatus === 'Fulfilled' ? 'Fulfilled' : 'Mark as Fulfilled'}
              </button>
            </footer>
          </aside>
        </div>
      ) : null}
    </section>
  );
}

const styles = {
  page: {
    display: 'grid',
    gap: '24px',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
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
    maxWidth: '68ch',
  },
  tableCard: {
    background: '#ffffff',
    border: '1px solid #edf0f4',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 14px 30px rgba(15, 23, 42, 0.05)',
  },
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '14px 18px',
    textAlign: 'left',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#9ca3af',
    background: '#ffffff',
    borderBottom: '1px solid #edf0f4',
    whiteSpace: 'nowrap',
    fontWeight: 600,
  },
  cell: {
    padding: '18px',
    borderBottom: '1px solid #f1f4f8',
    color: '#111827',
    verticalAlign: 'top',
  },
  emptyCell: {
    padding: '28px 16px',
    textAlign: 'center',
    color: '#6b7280',
  },
  statusPill: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '90px',
    padding: '7px 12px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.02em',
  },
  statusPillPending: {
    background: '#f3f4f6',
    color: '#4b5563',
  },
  statusPillFulfilled: {
    background: '#e7f8ec',
    color: '#166534',
  },
  actionLink: {
    border: 'none',
    background: 'transparent',
    color: '#4b5563',
    fontWeight: 600,
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.24)',
    display: 'flex',
    justifyContent: 'flex-end',
    zIndex: 50,
  },
  drawer: {
    width: 'min(560px, 100vw)',
    height: '100vh',
    background: '#ffffff',
    borderLeft: '1px solid #edf0f4',
    padding: '28px',
    boxShadow: '-20px 0 42px rgba(15, 23, 42, 0.12)',
    overflowY: 'auto',
    display: 'grid',
    gap: '18px',
    alignContent: 'start',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
  },
  modalTitle: {
    margin: '8px 0 0',
    fontSize: '32px',
    lineHeight: 1.1,
  },
  iconButton: {
    width: '40px',
    height: '40px',
    borderRadius: '999px',
    border: '1px solid #e5e7eb',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '24px',
    lineHeight: 1,
  },
  detailsCard: {
    padding: '18px 20px',
    borderRadius: '18px',
    border: '1px solid #edf0f4',
    background: '#fbfcfd',
  },
  sectionTitle: {
    margin: '0 0 14px',
    fontSize: '17px',
    color: '#111827',
  },
  bodyText: {
    margin: 0,
    color: '#1f2937',
    lineHeight: 1.65,
  },
  definitionList: {
    display: 'grid',
    gap: '12px',
    margin: 0,
  },
  definitionRow: {
    display: 'grid',
    gap: '4px',
  },
  definitionTerm: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#6b7280',
  },
  definitionValue: {
    margin: 0,
    color: '#111827',
    lineHeight: 1.5,
  },
  itemsSection: {
    display: 'grid',
    gap: '12px',
  },
  itemsTableWrap: {
    overflow: 'hidden',
    border: '1px solid #edf0f4',
    borderRadius: '16px',
    background: '#fff',
  },
  itemsTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  itemsTh: {
    padding: '12px 14px',
    textAlign: 'left',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#9ca3af',
    background: '#ffffff',
    borderBottom: '1px solid #edf0f4',
    whiteSpace: 'nowrap',
  },
  itemsCell: {
    padding: '14px',
    borderBottom: '1px solid #f1f4f8',
    color: '#111827',
    verticalAlign: 'top',
  },
  drawerFooter: {
    marginTop: '6px',
    paddingTop: '16px',
    borderTop: '1px solid #edf0f4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
  },
  totalLabel: {
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontSize: '11px',
    color: '#9ca3af',
  },
  totalValue: {
    margin: '6px 0 0',
    fontSize: '28px',
    lineHeight: 1.1,
    color: '#111827',
    fontWeight: 700,
  },
  fulfillButton: {
    border: 'none',
    borderRadius: '14px',
    padding: '13px 18px',
    background: '#111827',
    color: '#ffffff',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 12px 24px rgba(17, 24, 39, 0.18)',
  },
  fulfillButtonDisabled: {
    background: '#d1d5db',
    boxShadow: 'none',
    cursor: 'not-allowed',
  },
};