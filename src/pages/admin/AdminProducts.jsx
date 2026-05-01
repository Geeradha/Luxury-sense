import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import ProductForm from '../../components/admin/ProductForm';

const initialFormState = {
  name: '',
  description: '',
  price: '',
  category_id: '',
  image: null,
};

function extractItems(response) {
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

  return 'Something went wrong while saving the product.';
}

function buildImageUrl(imagePath) {
  if (!imagePath) {
    return '';
  }

  return `/storage/${imagePath}`;
}

export default function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(initialFormState);

  const selectedFilePreview = useMemo(() => {
    if (!form.image) {
      return '';
    }

    return URL.createObjectURL(form.image);
  }, [form.image]);

  useEffect(() => {
    return () => {
      if (selectedFilePreview) {
        URL.revokeObjectURL(selectedFilePreview);
      }
    };
  }, [selectedFilePreview]);

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    }),
    [token]
  );

  const fetchProductsAndCategories = async () => {
    setLoading(true);
    setError('');

    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        axios.get('/api/admin/products', { headers: authHeaders }),
        axios.get('/api/admin/categories', { headers: authHeaders }),
      ]);

      setProducts(extractItems(productsResponse));
      setCategories(extractItems(categoriesResponse));
    } catch (fetchError) {
      setError(getApiErrorMessage(fetchError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm(initialFormState);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price ?? '',
      category_id: product.category_id ? String(product.category_id) : '',
      image: null,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setForm(initialFormState);
    setFormError('');
  };

  const setFormField = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleImageSelect = (file) => {
    setFormField('image', file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError('');

    const payload = new FormData();
    payload.append('name', form.name);
    payload.append('description', form.description);
    payload.append('price', form.price);
    payload.append('category_id', form.category_id);

    if (form.image) {
      payload.append('image', form.image);
    }

    try {
      if (editingProduct) {
        if (form.image) {
          payload.append('_method', 'PUT');

          await axios.post(`/api/admin/products/${editingProduct.id}`, payload, {
            headers: {
              ...authHeaders,
            },
          });
        } else {
          await axios.put(
            `/api/admin/products/${editingProduct.id}`,
            {
              name: form.name,
              description: form.description,
              price: form.price,
              category_id: form.category_id,
            },
            {
              headers: authHeaders,
            }
          );
        }
      } else {
        await axios.post('/api/admin/products', payload, {
          headers: {
            ...authHeaders,
          },
        });
      }

      await fetchProductsAndCategories();
      closeModal();
    } catch (saveError) {
      setFormError(getApiErrorMessage(saveError));
    } finally {
      setSubmitting(false);
    }
  };

  const tableBody = useMemo(() => {
    if (loading) {
      return (
        <tr>
          <td colSpan="6" style={styles.emptyCell}>
            Loading products...
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

    if (!products.length) {
      return (
        <tr>
          <td colSpan="6" style={styles.emptyCell}>
            No products found.
          </td>
        </tr>
      );
    }

    return products.map((product) => {
      const categoryName = categories.find((category) => String(category.id) === String(product.category_id))?.name || 'Uncategorized';

      return (
        <tr key={product.id}>
          <td style={styles.cell}>
            <div style={styles.productNameCell}>
              {product.image_path ? (
                <img
                  src={buildImageUrl(product.image_path)}
                  alt={product.name}
                  style={styles.thumbnail}
                />
              ) : (
                <div style={styles.thumbnailPlaceholder}>No image</div>
              )}
              <span>{product.name}</span>
            </div>
          </td>
          <td style={styles.cell}>{categoryName}</td>
          <td style={styles.cell}>{product.description}</td>
          <td style={styles.cell}>${Number(product.price).toFixed(2)}</td>
          <td style={styles.cell}>{product.image_path || 'No file uploaded'}</td>
          <td style={styles.cell}>
            <button type="button" onClick={() => openEditModal(product)} style={styles.secondaryButton}>
              Edit
            </button>
          </td>
        </tr>
      );
    });
  }, [categories, error, loading, products]);

  return (
    <section style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.kicker}>Catalog Management</p>
          <h1 style={styles.title}>Admin Products</h1>
          <p style={styles.subtitle}>Fetch, create, and update your product inventory from the Laravel API.</p>
        </div>

        <button type="button" onClick={openCreateModal} style={styles.primaryButton}>
          Add New Product
        </button>
      </div>

      <div style={styles.tableCard}>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Image</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>{tableBody}</tbody>
          </table>
        </div>
      </div>

      {isModalOpen ? (
        <div style={styles.modalOverlay} onClick={closeModal} role="presentation">
          <div style={styles.modalCard} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
            <div style={styles.modalHeader}>
              <div>
                <p style={styles.kicker}>{editingProduct ? 'Edit Product' : 'New Product'}</p>
                <h2 style={styles.modalTitle}>{editingProduct ? 'Update product details' : 'Create a new product'}</h2>
              </div>
              <button type="button" onClick={closeModal} style={styles.iconButton} aria-label="Close modal">
                ×
              </button>
            </div>

            <ProductForm
              form={form}
              categories={categories}
              onFieldChange={setFormField}
              onImageSelect={handleImageSelect}
              onCancel={closeModal}
              onSubmit={handleSubmit}
              submitting={submitting}
              error={formError}
              imagePreview={selectedFilePreview}
              existingImageUrl={editingProduct?.image_path ? buildImageUrl(editingProduct.image_path) : ''}
              submitLabel="Publish"
            />
          </div>
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
    maxWidth: '64ch',
  },
  tableCard: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 18px 45px rgba(15, 23, 42, 0.06)',
  },
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '16px',
    textAlign: 'left',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#6b7280',
    background: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
    whiteSpace: 'nowrap',
  },
  cell: {
    padding: '16px',
    borderBottom: '1px solid #f3f4f6',
    verticalAlign: 'top',
    color: '#111827',
  },
  emptyCell: {
    padding: '28px 16px',
    textAlign: 'center',
    color: '#6b7280',
  },
  productNameCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minWidth: '220px',
  },
  thumbnail: {
    width: '44px',
    height: '44px',
    objectFit: 'cover',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    background: '#f9fafb',
  },
  thumbnailPlaceholder: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    border: '1px dashed #cbd5e1',
    color: '#6b7280',
    display: 'grid',
    placeItems: 'center',
    fontSize: '11px',
    textAlign: 'center',
    background: '#f8fafc',
  },
  primaryButton: {
    border: 'none',
    borderRadius: '12px',
    padding: '12px 18px',
    background: '#111827',
    color: '#ffffff',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 12px 24px rgba(17, 24, 39, 0.18)',
  },
  secondaryButton: {
    border: '1px solid #d1d5db',
    borderRadius: '12px',
    padding: '12px 18px',
    background: '#ffffff',
    color: '#111827',
    fontWeight: 700,
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.58)',
    display: 'grid',
    placeItems: 'center',
    padding: '20px',
    zIndex: 50,
  },
  modalCard: {
    width: 'min(760px, 100%)',
    background: '#ffffff',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 32px 80px rgba(15, 23, 42, 0.26)',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '20px',
  },
  modalTitle: {
    margin: '8px 0 0',
    fontSize: '28px',
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
  form: {
    display: 'grid',
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
  fileInput: {
    width: '100%',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '16px',
  },
  previewBlock: {
    display: 'grid',
    gap: '10px',
    padding: '14px',
    borderRadius: '16px',
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
  },
  previewLabel: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: '#6b7280',
  },
  previewImage: {
    width: '100%',
    maxWidth: '220px',
    aspectRatio: '1 / 1',
    objectFit: 'cover',
    borderRadius: '16px',
    border: '1px solid #e5e7eb',
    background: '#fff',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: '4px',
  },
  formError: {
    margin: 0,
    color: '#b91c1c',
    fontWeight: 600,
  },
};