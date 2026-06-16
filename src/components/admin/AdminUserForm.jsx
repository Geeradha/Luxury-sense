import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminUserForm({
  initialData = {},
  onSubmit,
  onCancel,
  submitting = false,
  backendErrors = null,
  isEdit = false,
}) {
  const inputId = useId();
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    role: initialData.role || 'admin',
    status: initialData.status || 'active',
    password: '',
    password_confirmation: '',
  });

  const [clientErrors, setClientErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (clientErrors[field]) {
      setClientErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!isEdit && !formData.password) errors.password = 'Password is required';
    if (formData.password && formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = 'Passwords do not match';
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setClientErrors(errors);
      return;
    }
    onSubmit(formData);
  };

  const inputClasses = "w-full h-12 rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 text-sm text-white placeholder-white/40 outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all duration-500";
  const labelClasses = "block text-[10px] font-bold uppercase tracking-[0.25em] text-white/60 mb-2 pl-1";
  const errorClasses = "mt-1 text-[10px] font-bold text-rose-500 uppercase tracking-wider";

  const getError = (field) => clientErrors[field] || (backendErrors && backendErrors[field] && backendErrors[field][0]);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold/90">
          {isEdit ? 'Update Profile' : 'New Access'}
        </p>
        <h2 className="font-serif text-2xl text-white sm:text-3xl">
          {isEdit ? 'Edit Admin' : 'Create Administrator'}
        </h2>
        <p className="text-sm leading-7 text-stone-500">
          {isEdit 
            ? 'Modify administrative credentials and access levels.' 
            : 'Grant administrative privileges to a new member of the collective.'}
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor={`${inputId}-name`} className={labelClasses}>Full Name</label>
            <input
              id={`${inputId}-name`}
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Alexander McQueen"
              className={`${inputClasses} ${getError('name') ? 'border-rose-500/50' : ''}`}
            />
            {getError('name') && <p className={errorClasses}>{getError('name')}</p>}
          </div>

          <div>
            <label htmlFor={`${inputId}-email`} className={labelClasses}>Email Address</label>
            <input
              id={`${inputId}-email`}
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="admin@luxurysense.com"
              className={`${inputClasses} ${getError('email') ? 'border-rose-500/50' : ''}`}
            />
            {getError('email') && <p className={errorClasses}>{getError('email')}</p>}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor={`${inputId}-role`} className={labelClasses}>Administrative Role</label>
            <select
              id={`${inputId}-role`}
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className={inputClasses}
            >
              <option value="admin">Administrator</option>
              <option value="super-admin">Super Admin</option>
              <option value="editor">Editor</option>
            </select>
          </div>

          <div>
            <label htmlFor={`${inputId}-status`} className={labelClasses}>Account Status</label>
            <select
              id={`${inputId}-status`}
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className={inputClasses}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor={`${inputId}-password`} className={labelClasses}>
              {isEdit ? 'New Password (Optional)' : 'Access Password'}
            </label>
            <div className="relative">
              <input
                id={`${inputId}-password`}
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="••••••••"
                className={`${inputClasses} ${getError('password') ? 'border-rose-500/50' : ''} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {getError('password') && <p className={errorClasses}>{getError('password')}</p>}
          </div>

          <div>
            <label htmlFor={`${inputId}-confirm`} className={labelClasses}>Confirm Password</label>
            <div className="relative">
              <input
                id={`${inputId}-confirm`}
                type={showConfirmPassword ? "text" : "password"}
                value={formData.password_confirmation}
                onChange={(e) => handleChange('password_confirmation', e.target.value)}
                placeholder="••••••••"
                className={`${inputClasses} ${getError('password_confirmation') ? 'border-rose-500/50' : ''} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {getError('password_confirmation') && <p className={errorClasses}>{getError('password_confirmation')}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full border border-luxury-gold bg-luxury-gold px-10 py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-luxury-dark transition-all duration-700 hover:bg-transparent hover:text-luxury-gold shadow-gold-glow disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-luxury-dark border-t-transparent" />
                Processing...
              </>
            ) : (
              isEdit ? 'Update Administrator' : 'Create Access'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
