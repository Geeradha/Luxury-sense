import { useId } from 'react';

export default function BrandForm({
  form,
  onFieldChange,
  onCancel,
  onSubmit,
  submitting = false,
  error = '',
  submitLabel = 'Save Brand',
}) {
  const nameId = useId();
  const descriptionId = useId();
  const imageUrlId = useId();

  const inputClasses = "w-full h-12 rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 text-sm text-white placeholder-white/40 outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all duration-500";
  const labelClasses = "block text-[10px] font-bold uppercase tracking-[0.25em] text-white/60 mb-2 pl-1";

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <div className="grid gap-6 rounded-[40px] border border-white/5 bg-luxury-black/40 p-6 sm:p-10 shadow-luxury-md">
        <div>
          <label htmlFor={nameId} className={labelClasses}>Brand Name</label>
          <input
            id={nameId}
            type="text"
            value={form.name}
            onChange={(event) => onFieldChange('name', event.target.value)}
            placeholder="e.g. Chanel"
            required
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor={imageUrlId} className={labelClasses}>Logo / Image URL</label>
          <input
            id={imageUrlId}
            type="url"
            value={form.image_url}
            onChange={(event) => onFieldChange('image_url', event.target.value)}
            placeholder="https://..."
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor={descriptionId} className={labelClasses}>Description</label>
          <textarea
            id={descriptionId}
            value={form.description}
            onChange={(event) => onFieldChange('description', event.target.value)}
            placeholder="Brand story and heritage..."
            rows={6}
            className="w-full resize-none rounded-[24px] border border-white/10 bg-[#1a1a1a] px-6 py-5 text-sm text-white placeholder-white/40 outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all duration-500"
          />
        </div>
      </div>

      {error ? <p className="text-center text-xs font-bold text-rose-500 tracking-wide uppercase">{error}</p> : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-4">
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
          {submitting ? 'Processing...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
