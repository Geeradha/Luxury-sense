import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import CategoryForm from '../../components/admin/CategoryForm';

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

  return 'Something went wrong while saving the category.';
}

export default function AdminCategories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    }),
    [token]
  );

  const fetchCategories = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get('/api/admin/categories', { headers: authHeaders });
      setCategories(extractItems(response));
    } catch (fetchError) {
      setError(getApiErrorMessage(fetchError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const openCreateForm = () => {
    setEditingCategory(null);
    setCategoryName('');
    setFormError('');
  };

  const openEditForm = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name || '');
    setFormError('');
  };

  const handleCancel = () => {
    openCreateForm();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFormError('');

    try {
      if (editingCategory) {
        await axios.put(
          `/api/admin/categories/${editingCategory.id}`,
          { name: categoryName },
          { headers: authHeaders }
        );
      } else {
        await axios.post('/api/admin/categories', { name: categoryName }, { headers: authHeaders });
      }

      await fetchCategories();
      openCreateForm();
    } catch (saveError) {
      setFormError(getApiErrorMessage(saveError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.kicker}>Catalog Management</p>
          <h1 style={styles.title}>Admin Categories</h1>
          <p style={styles.subtitle}>Create and update the category structure that powers the product catalog.</p>
        </div>
      </div>

      <div style={styles.layout}>
        <CategoryForm
          value={categoryName}
          onChange={setCategoryName}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={formError}
          submitLabel="Save Category"
          title={editingCategory ? 'Edit Category' : 'New Category'}
          description={editingCategory ? 'Update the category name and save your changes.' : 'Add a category for a new product grouping.'}
        />

        <div style={styles.listCard}>
          <div style={styles.listHeader}>
            <div>
              <p style={styles.kicker}>Existing Categories</p>
              <h2 style={styles.listTitle}>Category Index</h2>
            </div>
          </div>

          {loading ? (
            <p style={styles.stateText}>Loading categories...</p>
          ) : error ? (
            <p style={styles.stateText}>{error}</p>
          ) : categories.length ? (
            <div style={styles.categoryList}>
              {categories.map((category) => (
                <div key={category.id} style={styles.categoryRow}>
                  <div>
                    <p style={styles.categoryName}>{category.name}</p>
                    <span style={styles.categoryMeta}>Category ID {category.id}</span>
                  </div>
                  <button type="button" onClick={() => openEditForm(category)} style={styles.editButton}>
                    Edit
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.stateText}>No categories found.</p>
          )}
        </div>
      </div>
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
  layout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 560px) minmax(0, 1fr)',
    gap: '24px',
    alignItems: 'start',
  },
  listCard: {
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '24px',
    padding: '28px',
    boxShadow: '0 18px 45px rgba(15, 23, 42, 0.06)',
    display: 'grid',
    gap: '18px',
  },
  listHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
  },
  listTitle: {
    margin: '8px 0 0',
    fontSize: '26px',
    lineHeight: 1.1,
  },
  categoryList: {
    display: 'grid',
    gap: '12px',
  },
  categoryRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '16px',
    borderRadius: '18px',
    border: '1px solid #e5e7eb',
    background: '#f9fafb',
  },
  categoryName: {
    margin: 0,
    fontWeight: 700,
    color: '#111827',
  },
  categoryMeta: {
    display: 'block',
    marginTop: '4px',
    color: '#6b7280',
    fontSize: '13px',
  },
  editButton: {
    border: '1px solid #d1d5db',
    borderRadius: '999px',
    padding: '10px 16px',
    background: '#ffffff',
    color: '#111827',
    fontWeight: 700,
    cursor: 'pointer',
  },
  stateText: {
    margin: 0,
    color: '#6b7280',
    lineHeight: 1.6,
  },
};