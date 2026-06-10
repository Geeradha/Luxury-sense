import { useId } from 'react';

export default function CategoryForm({
  value,
  descriptionValue,
  imagePreview,
  onChange,
  onImageChange,
  onCancel,
  onSubmit,
  submitting = false,
  error = '',
  submitLabel = 'Save Category',
  title = 'Category Details',
  description = 'Add a clear category name to keep the catalog organized.',
}) {
  const inputId = useId();

  const inputClasses = "w-full h-12 rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 text-sm text-white placeholder-white/40 outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all duration-500";
  const labelClasses = "block text-[10px] font-bold uppercase tracking-[0.25em] text-white/60 mb-2 pl-1";

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold/90">Category</p>
        <h2 className="font-serif text-2xl text-white sm:text-3xl">{title}</h2>
        <p className="text-sm leading-7 text-stone-500">{description}</p>
      </div>

      <div className="grid gap-6">
        <div>
          <label htmlFor={inputId} className={labelClasses}>Category Name</label>
          <input
            id={inputId}
            type="text"
            value={value}
            onChange={(event) => onChange('name', event.target.value)}
            placeholder="e.g. Evening Wear"
            required
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor={`${inputId}-description`} className={labelClasses}>Description</label>
          <textarea
            id={`${inputId}-description`}
            value={descriptionValue}
            onChange={(event) => onChange('description', event.target.value)}
            placeholder="Curate a brief description for this collection..."
            rows={4}
            className="w-full resize-none rounded-[24px] border border-white/10 bg-[#1a1a1a] px-6 py-5 text-sm text-white placeholder-white/40 outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all duration-500"
          />
        </div>

        <div>
          <label htmlFor={`${inputId}-image`} className={labelClasses}>Image URL</label>
          <input
            id={`${inputId}-image`}
            type="url"
            value={imagePreview}
            onChange={(event) => onImageChange(event.target.value)}
            placeholder="https://images.unsplash.com/..."
            className={inputClasses}
          />
        </div>

        {imagePreview ? (
          <div className="group relative overflow-hidden rounded-[32px] border border-white/5 bg-luxury-black shadow-luxury-sm">
            <img src={imagePreview} alt="" className="h-48 w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/40 via-transparent to-transparent" />
          </div>
        ) : null}

        {error ? <p className="text-center text-xs font-bold text-rose-500 tracking-wide uppercase">{error}</p> : null}

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
            className="rounded-full border border-luxury-gold bg-luxury-gold px-10 py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-luxury-dark transition-all duration-700 hover:bg-transparent hover:text-luxury-gold shadow-gold-glow disabled:opacity-50"
          >
            {submitting ? 'Saving...' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
