import { useId, useRef, useState } from 'react';

export default function ProductForm({
  form,
  categories = [],
  onFieldChange,
  onImageSelect,
  onCancel,
  onSubmit,
  submitting = false,
  error = '',
  imagePreview = '',
  existingImageUrl = '',
  submitLabel = 'Publish',
}) {
  const categoryId = useId();
  const nameId = useId();
  const priceId = useId();
  const descriptionId = useId();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const activePreview = imagePreview || existingImageUrl;

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] ?? null;

    if (selectedFile) {
      onImageSelect(selectedFile);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const selectedFile = event.dataTransfer.files?.[0] ?? null;

    if (selectedFile) {
      onImageSelect(selectedFile);
    }
  };

  return (
    <form onSubmit={onSubmit} style={styles.form}>
      <div style={styles.grid}>
        <div style={styles.leftColumn}>
          <label htmlFor={nameId} style={styles.label}>
            Product Name
            <input
              id={nameId}
              type="text"
              value={form.name}
              onChange={(event) => onFieldChange('name', event.target.value)}
              placeholder="Enter product name"
              required
              style={styles.input}
            />
          </label>

          <div style={styles.dualRow}>
            <label htmlFor={priceId} style={styles.label}>
              Price
              <input
                id={priceId}
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(event) => onFieldChange('price', event.target.value)}
                placeholder="0.00"
                required
                style={styles.input}
              />
            </label>

            <label htmlFor={categoryId} style={styles.label}>
              Category
              <select
                id={categoryId}
                value={form.category_id}
                onChange={(event) => onFieldChange('category_id', event.target.value)}
                required
                style={styles.input}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label htmlFor={descriptionId} style={styles.label}>
            Product Description
            <textarea
              id={descriptionId}
              value={form.description}
              onChange={(event) => onFieldChange('description', event.target.value)}
              placeholder="Write a short description of the product"
              rows="8"
              required
              style={styles.textarea}
            />
          </label>
        </div>

        <div style={styles.rightColumn}>
          <div
            role="button"
            tabIndex={0}
            onClick={openFilePicker}
            onDragEnter={() => setIsDragging(true)}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openFilePicker();
              }
            }}
            style={{
              ...styles.dropzone,
              ...(isDragging ? styles.dropzoneActive : null),
            }}
          >
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={styles.hiddenInput} />

            {activePreview ? (
              <div style={styles.previewShell}>
                <img src={activePreview} alt="Product preview" style={styles.previewImage} />
                <div style={styles.previewTextBlock}>
                  <strong style={styles.previewTitle}>Image ready</strong>
                  <span style={styles.previewText}>Click to replace the image or drop a new file here.</span>
                </div>
              </div>
            ) : (
              <div style={styles.dropzoneCopy}>
                <div style={styles.dropzoneBadge}>Drag and Drop</div>
                <h3 style={styles.dropzoneTitle}>Upload the product image</h3>
                <p style={styles.dropzoneText}>
                  Drop a file here or click to browse. JPG, PNG, and WebP images work best.
                </p>
                <span style={styles.browseButton}>Choose Image</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {error ? <p style={styles.error}>{error}</p> : null}

      <div style={styles.actions}>
        <button type="button" onClick={onCancel} style={styles.cancelButton}>
          Cancel
        </button>
        <button type="submit" disabled={submitting} style={styles.primaryButton}>
          {submitting ? 'Publishing...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

const styles = {
  form: {
    width: '100%',
    display: 'grid',
    gap: '24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.45fr) minmax(320px, 0.95fr)',
    gap: '22px',
    alignItems: 'start',
  },
  leftColumn: {
    display: 'grid',
    gap: '18px',
    padding: '26px',
    borderRadius: '24px',
    background: '#ffffff',
    border: '1px solid #e5e7eb',
  },
  rightColumn: {
    minHeight: '100%',
  },
  label: {
    display: 'grid',
    gap: '10px',
    color: '#111827',
    fontSize: '14px',
    fontWeight: 600,
  },
  dualRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '14px',
  },
  input: {
    width: '100%',
    minHeight: '52px',
    padding: '14px 16px',
    borderRadius: '14px',
    border: '1px solid #d1d5db',
    background: '#ffffff',
    color: '#111827',
    outline: 'none',
    transition: 'border-color 160ms ease, box-shadow 160ms ease',
  },
  textarea: {
    width: '100%',
    minHeight: '212px',
    padding: '16px',
    borderRadius: '18px',
    border: '1px solid #d1d5db',
    background: '#ffffff',
    color: '#111827',
    resize: 'vertical',
    outline: 'none',
    lineHeight: 1.7,
    transition: 'border-color 160ms ease, box-shadow 160ms ease',
  },
  dropzone: {
    minHeight: '100%',
    borderRadius: '28px',
    border: '2px dashed #cbd5e1',
    background: '#ffffff',
    padding: '26px',
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer',
    transition: 'border-color 160ms ease, background-color 160ms ease, transform 160ms ease',
  },
  dropzoneActive: {
    borderColor: '#111827',
    background: '#f8fafc',
    transform: 'translateY(-2px)',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
    pointerEvents: 'none',
  },
  dropzoneCopy: {
    display: 'grid',
    gap: '14px',
    placeItems: 'center',
    textAlign: 'center',
    padding: '10px',
  },
  dropzoneBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 14px',
    borderRadius: '999px',
    background: '#111827',
    color: '#ffffff',
    fontSize: '12px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
  },
  dropzoneTitle: {
    margin: 0,
    fontSize: '26px',
    lineHeight: 1.1,
    color: '#111827',
  },
  dropzoneText: {
    margin: 0,
    color: '#6b7280',
    lineHeight: 1.65,
    maxWidth: '32ch',
  },
  browseButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 18px',
    borderRadius: '999px',
    border: '1px solid #111827',
    color: '#111827',
    fontWeight: 700,
    background: '#ffffff',
  },
  previewShell: {
    width: '100%',
    display: 'grid',
    gap: '16px',
    placeItems: 'center',
  },
  previewImage: {
    width: '100%',
    maxHeight: '360px',
    objectFit: 'cover',
    borderRadius: '22px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 18px 35px rgba(15, 23, 42, 0.08)',
  },
  previewTextBlock: {
    display: 'grid',
    gap: '6px',
    textAlign: 'center',
  },
  previewTitle: {
    color: '#111827',
  },
  previewText: {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: 1.6,
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
    padding: '0 6px',
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
    padding: '14px 24px',
    background: '#111827',
    color: '#ffffff',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 12px 24px rgba(17, 24, 39, 0.18)',
  },
};