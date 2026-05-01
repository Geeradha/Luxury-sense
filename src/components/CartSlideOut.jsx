import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

function formatCurrency(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

export default function CartSlideOut({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { items, cartTotal, updateQuantity } = useCart();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateMobileState = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateMobileState();
    window.addEventListener('resize', updateMobileState);

    return () => {
      window.removeEventListener('resize', updateMobileState);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close shopping tote overlay"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(17, 17, 17, 0.36)',
          border: 'none',
          padding: 0,
          zIndex: 90,
          cursor: 'default',
        }}
      />

      <aside
        aria-label="Your Shopping Tote"
        style={{
          position: 'fixed',
          top: isMobile ? 'auto' : 0,
          right: 0,
          left: isMobile ? 0 : 'auto',
          bottom: isMobile ? 0 : 'auto',
          zIndex: 100,
          width: isMobile ? '100%' : 'min(100%, 440px)',
          height: isMobile ? 'min(88vh, 720px)' : '100vh',
          background: '#ffffff',
          boxShadow: isMobile ? '0 -18px 36px rgba(17, 17, 17, 0.18)' : '-24px 0 48px rgba(17, 17, 17, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: isMobile ? 'none' : '1px solid #ece8e1',
          borderTop: isMobile ? '1px solid #ece8e1' : 'none',
          borderTopLeftRadius: isMobile ? '22px' : 0,
          borderTopRightRadius: isMobile ? '22px' : 0,
        }}
      >
        <div
          style={{
            padding: '1.5rem 1.5rem 1rem',
            borderBottom: '1px solid #f1ece6',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontFamily: 'Inter, Lato, sans-serif',
                fontSize: '0.72rem',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#8f8a84',
              }}
            >
              Your Shopping Tote
            </p>
            <h2
              style={{
                margin: '0.45rem 0 0',
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '1.9rem',
                lineHeight: 1.1,
                fontWeight: 600,
                color: '#111111',
              }}
            >
              Selected Pieces
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping tote"
            style={{
              border: 'none',
              background: 'transparent',
              color: '#111111',
              fontFamily: 'Inter, Lato, sans-serif',
              fontSize: '1.1rem',
              cursor: 'pointer',
              padding: '0.2rem 0.3rem',
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem 1.5rem 1rem',
          }}
        >
          {items.length ? (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '84px 1fr',
                    gap: '1rem',
                    alignItems: 'start',
                  }}
                >
                  <div
                    style={{
                      width: '84px',
                      aspectRatio: '4 / 5',
                      overflow: 'hidden',
                      background: '#f6f2ec',
                    }}
                  >
                    {item.image_path ? (
                      <img
                        src={item.image_path.startsWith('http') ? item.image_path : `/storage/${item.image_path}`}
                        alt={item.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    ) : null}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <h3
                      style={{
                        margin: 0,
                        fontFamily: 'Playfair Display, Georgia, serif',
                        fontSize: '1.05rem',
                        lineHeight: 1.2,
                        fontWeight: 600,
                        color: '#111111',
                      }}
                    >
                      {item.name}
                    </h3>

                    <p
                      style={{
                        margin: '0.4rem 0 0',
                        fontFamily: 'Inter, Lato, sans-serif',
                        color: '#8b8b8b',
                        fontSize: '0.92rem',
                      }}
                    >
                      {formatCurrency(item.price)}
                    </p>

                    <div
                      style={{
                        marginTop: '0.95rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.7rem',
                          fontFamily: 'Inter, Lato, sans-serif',
                          color: '#111111',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          fontSize: '0.72rem',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: '#111111',
                            cursor: 'pointer',
                            padding: 0,
                            fontSize: '1.2rem',
                            lineHeight: 1,
                            opacity: 0.85,
                          }}
                        >
                          −
                        </button>

                        <span style={{ minWidth: '1.1rem', textAlign: 'center' }}>{item.quantity}</span>

                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: '#111111',
                            cursor: 'pointer',
                            padding: 0,
                            fontSize: '1.05rem',
                            lineHeight: 1,
                            opacity: 0.85,
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                height: '100%',
                minHeight: '220px',
                display: 'grid',
                placeItems: 'center',
                textAlign: 'center',
                color: '#8b8b8b',
                padding: '2rem 0',
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'Playfair Display, Georgia, serif',
                    fontSize: '1.25rem',
                    color: '#111111',
                  }}
                >
                  Your tote is empty.
                </p>
                <p style={{ margin: '0.5rem 0 0', fontFamily: 'Inter, Lato, sans-serif' }}>
                  Add a few pieces to begin your edit.
                </p>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            padding: '1.25rem 1.5rem 1.5rem',
            borderTop: '1px solid #f1ece6',
            background: '#ffffff',
            position: isMobile ? 'sticky' : 'static',
            bottom: isMobile ? 0 : 'auto',
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            <span
              style={{
                fontFamily: 'Inter, Lato, sans-serif',
                fontSize: '0.72rem',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: '#8f8a84',
              }}
            >
              Total
            </span>
            <strong
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '1.45rem',
                color: '#111111',
              }}
            >
              {formatCurrency(cartTotal)}
            </strong>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose?.();
              navigate('/checkout');
            }}
            disabled={!items.length}
            style={{
              width: '100%',
              border: 'none',
              background: items.length ? '#111111' : '#8f8f8f',
              color: '#ffffff',
              fontFamily: 'Inter, Lato, sans-serif',
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '1rem 1.1rem',
              cursor: items.length ? 'pointer' : 'not-allowed',
              transition: 'background-color 260ms ease, transform 260ms ease',
            }}
          >
            Proceed to Secure Checkout
          </button>
        </div>
      </aside>
    </>
  );
}