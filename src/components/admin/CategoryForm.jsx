import { useId } from 'react';

export default function CategoryForm({
  value,
  onChange,
  onCancel,
  onSubmit,
  submitting = false,
  error = '',
  submitLabel = 'Save Category',
  title = 'Category Details',
  description = 'Add a clear category name to keep the catalog organized.',
}) {
  const inputId = useId();

  return (
    <form onSubmit={onSubmit} style={styles.card}>
      <div style={styles.header}>
        <div>
          <p style={styles.kicker}>Category</p>
          <h2 style={styles.title}>{title}</h2>
          <p style={styles.description}>{description}</p>
        </div>
      </div>

      <label htmlFor={inputId} style={styles.label}>
        Category Name
        <input
          id={inputId}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="e.g. Evening Wear"
          required
          style={styles.input}
        />
      </label>

      {error ? <p style={styles.error}>{error}</p> : null}

      <div style={styles.actions}>
        <button type="button" onClick={onCancel} style={styles.cancelButton}>
          Cancel
        </button>
        <button type="submit" disabled={submitting} style={styles.primaryButton}>
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

const styles = {
  card: {
    width: 'min(100%, 560px)',
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '24px',
    padding: '28px',
    boxShadow: '0 18px 45px rgba(15, 23, 42, 0.06)',
    display: 'grid',
    gap: '22px',
  },
  header: {
    display: 'grid',
    gap: '8px',
  },
  kicker: {
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    fontSize: '12px',
    color: '#6b7280',
  },
  title: {
    margin: 0,
    fontSize: '28px',
    lineHeight: 1.1,
    color: '#111827',
  },
  description: {
    margin: 0,
    color: '#6b7280',
    lineHeight: 1.6,
  },
  label: {
    display: 'grid',
    gap: '10px',
    color: '#111827',
    fontSize: '14px',
    fontWeight: 600,
  },
  input: {
    width: '100%',
    minHeight: '52px',
    padding: '14px 16px',
    borderRadius: '14px',
    border: '1px solid #e5e7eb',
    background: '#ffffff',
    color: '#111827',
    outline: 'none',
    transition: 'border-color 160ms ease, box-shadow 160ms ease',
  },
  error: {
    margin: 0,
    color: '#b91c1c',
    fontSize: '14px',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
  },
  cancelButton: {
    border: 'none',
    background: 'transparent',
    color: '#111827',
    padding: 0,
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
  },
  primaryButton: {
    border: 'none',
    borderRadius: '14px',
    padding: '14px 22px',
    background: '#111827',
    color: '#ffffff',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 12px 24px rgba(17, 24, 39, 0.18)',
  },
};