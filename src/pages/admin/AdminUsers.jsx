import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';
import { Edit2, Trash2, UserPlus, Shield } from 'lucide-react';
import { toast } from 'sonner';
import AdminUserForm from '../../components/admin/AdminUserForm';

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function AdminUsers() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const isSuperAdmin = role === 'super-admin';

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [backendErrors, setBackendErrors] = useState(null);

  useEffect(() => {
    // Redirect non-super-admins back to dashboard
    if (role && !isSuperAdmin) {
      toast.error('Access Denied: Super Admin privileges required.');
      navigate('/admin/dashboard');
    }
  }, [role, isSuperAdmin, navigate]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/admin/users');
      setUsers(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load administrative users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      loadUsers();
    }
  }, [isSuperAdmin]);

  const handleCreate = () => {
    if (!isSuperAdmin) return;
    setSelectedUser(null);
    setBackendErrors(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (user) => {
    if (!isSuperAdmin) return;
    setSelectedUser(user);
    setBackendErrors(null);
    setIsFormModalOpen(true);
  };

  const handleDelete = (user) => {
    if (!isSuperAdmin) return;
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const onFormSubmit = async (formData) => {
    if (!isSuperAdmin) return;
    setSubmitting(true);
    setBackendErrors(null);
    try {
      if (selectedUser) {
        await apiClient.put(`/admin/users/${selectedUser.id}`, formData);
        toast.success('Administrator updated successfully');
      } else {
        await apiClient.post('/admin/users', formData);
        toast.success('New administrator created successfully');
      }
      setIsFormModalOpen(false);
      loadUsers();
    } catch (err) {
      if (err.response?.status === 422) {
        setBackendErrors(err.response.data.errors);
      } else {
        toast.error(err.response?.data?.message || 'An error occurred');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!isSuperAdmin) return;
    setSubmitting(true);
    try {
      await apiClient.delete(`/admin/users/${selectedUser.id}`);
      toast.success('Administrator removed successfully');
      setIsDeleteModalOpen(false);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove administrator');
    } finally {
      setSubmitting(false);
    }
  };

  if (role && !isSuperAdmin) return null;

  return (
    <section className="grid gap-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold/90">Staff Governance</p>
          <h1 className="mt-4 font-serif text-5xl tracking-tight text-white sm:text-6xl">Admins</h1>
        </div>
        {isSuperAdmin && (
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-3 rounded-full bg-white/5 border border-white/10 px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-all duration-500"
          >
            <UserPlus size={16} className="text-luxury-gold" />
            Add Administrator
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-[40px] border border-white/5 bg-luxury-charcoal shadow-luxury-md">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead className="bg-white/2 text-[9px] font-bold uppercase tracking-[0.3em] text-stone-500">
              <tr>
                <th className="px-8 py-6">Identity</th>
                <th className="px-8 py-6">Email Address</th>
                <th className="px-8 py-6">Access Level</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Created</th>
                {isSuperAdmin && <th className="px-8 py-6 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={isSuperAdmin ? "6" : "5"} className="px-8 py-20 text-center">
                    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-luxury-gold border-t-transparent"></div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={isSuperAdmin ? "6" : "5"} className="px-8 py-20 text-center text-rose-500 font-bold uppercase tracking-widest text-xs">{error}</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={isSuperAdmin ? "6" : "5"} className="px-8 py-20 text-center text-stone-500 italic uppercase tracking-widest text-xs">No administrators found.</td>
                </tr>
              ) : users.map((user) => (
                <tr key={user.id} className="group hover:bg-white/2 transition-colors duration-500">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-luxury-gold/10 text-luxury-gold">
                        <Shield size={18} />
                      </div>
                      <span className="font-serif text-lg text-white">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-stone-400">{user.email}</td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-widest ${
                      user.role === 'super-admin' 
                        ? 'bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20' 
                        : 'bg-white/5 text-stone-400 border border-white/10'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${
                      user.status === 'active' ? 'text-emerald-500' : 'text-stone-600'
                    }`}>
                      <div className={`h-1.5 w-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-stone-700'}`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                    {formatDate(user.created_at)}
                  </td>
                  {isSuperAdmin && (
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/5 text-stone-500 transition-all hover:border-luxury-gold/30 hover:bg-luxury-gold/10 hover:text-luxury-gold"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/5 text-stone-500 transition-all hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-10 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-[40px] border border-white/10 bg-luxury-charcoal p-8 shadow-2xl sm:p-12">
            <AdminUserForm
              isEdit={!!selectedUser}
              initialData={selectedUser || {}}
              onSubmit={onFormSubmit}
              onCancel={() => setIsFormModalOpen(false)}
              submitting={submitting}
              backendErrors={backendErrors}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setIsDeleteModalOpen(false)}>
          <div 
            className="w-full max-w-md rounded-[32px] bg-luxury-charcoal p-8 border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-serif text-2xl text-white mb-4">Revoke Access?</h3>
            <p className="text-stone-400 text-sm leading-relaxed mb-8">
              Are you sure you want to permanently remove <span className="text-white font-medium">{selectedUser.name}</span> from the administrative collective? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-6 py-4 rounded-2xl bg-white/5 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={submitting}
                className="flex-1 px-6 py-4 rounded-2xl bg-rose-500 text-white text-xs font-bold uppercase tracking-widest hover:bg-rose-600 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  'Revoke Access'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
