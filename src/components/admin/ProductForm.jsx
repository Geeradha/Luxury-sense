import { useId } from 'react';
import CustomDropdown from './CustomDropdown';
import { X, Image as ImageIcon } from 'lucide-react';

export default function ProductForm({
  form,
  categories = [],
  brands = [],
  onFieldChange,
  onCancel,
  onSubmit,
  submitting = false,
  error = '',
  submitLabel = 'Publish',
}) {
  const nameId = useId();
  const descriptionId = useId();

  const inputClasses = "w-full h-12 rounded-2xl border border-white/10 bg-[#1a1a1a] px-5 text-sm text-white placeholder-white/40 outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all duration-500";
  const labelClasses = "block text-[10px] font-bold uppercase tracking-[0.25em] text-white/60 mb-2 pl-1";

  const addVariation = () => {
    const nextVariations = [...(form.variations || []), { size_label: '', price: '', stock_quantity: '' }];
    onFieldChange('variations', nextVariations);
  };

  const removeVariation = (index) => {
    const nextVariations = form.variations.filter((_, i) => i !== index);
    onFieldChange('variations', nextVariations);
  };

  const updateVariation = (index, field, value) => {
    const nextVariations = form.variations.map((v, i) => i === index ? { ...v, [field]: value } : v);
    onFieldChange('variations', nextVariations);
  };

  const addSpec = () => {
    const nextSpecs = [...(form.specs || []), { key: '', value: '' }];
    onFieldChange('specs', nextSpecs);
  };

  const removeSpec = (index) => {
    const nextSpecs = form.specs.filter((_, i) => i !== index);
    onFieldChange('specs', nextSpecs);
  };

  const updateSpec = (index, field, value) => {
    const nextSpecs = form.specs.map((s, i) => i === index ? { ...s, [field]: value } : s);
    onFieldChange('specs', nextSpecs);
  };

  const addImage = () => {
    const nextImages = [...(form.images || []), ''];
    onFieldChange('images', nextImages);
  };

  const removeImage = (index) => {
    const nextImages = form.images.filter((_, i) => i !== index);
    onFieldChange('images', nextImages);
  };

  const updateImage = (index, value) => {
    const nextImages = form.images.map((img, i) => i === index ? value : img);
    onFieldChange('images', nextImages);
  };

  const genderOptions = [
    { value: 'unisex', label: 'Unisex' },
    { value: 'men', label: 'Men' },
    { value: 'women', label: 'Women' },
  ];

  const categoryOptions = categories.map(c => ({ value: String(c.id), label: c.name }));
  const brandOptions = brands.map(b => ({ value: String(b.id), label: b.name }));

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
      <div className="grid gap-8 rounded-[40px] border border-white/5 bg-luxury-black/40 p-8 shadow-luxury-md sm:p-10">
        <div>
          <label htmlFor={nameId} className={labelClasses}>Product Name</label>
          <input
            id={nameId}
            type="text"
            value={form.name}
            onChange={(event) => onFieldChange('name', event.target.value)}
            placeholder="e.g. No. 5 Parfum"
            required
            className={inputClasses}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className={labelClasses}>Brand (Maison)</label>
            <CustomDropdown
              value={String(form.brand_id)}
              onChange={(val) => onFieldChange('brand_id', val)}
              options={brandOptions}
              placeholder="Select Maison"
              className="!h-12 !rounded-2xl !bg-[#1a1a1a] !border-white/10"
            />
          </div>

          <div>
            <label className={labelClasses}>Gender Category</label>
            <CustomDropdown
              value={form.gender_category}
              onChange={(val) => onFieldChange('gender_category', val)}
              options={genderOptions}
              className="!h-12 !rounded-2xl !bg-[#1a1a1a] !border-white/10"
            />
          </div>
        </div>

        <div>
          <label className={labelClasses}>Category</label>
          <CustomDropdown
            value={String(form.category_id)}
            onChange={(val) => onFieldChange('category_id', val)}
            options={categoryOptions}
            placeholder="Select Group"
            className="!h-12 !rounded-2xl !bg-[#1a1a1a] !border-white/10"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t border-white/5">
          <div className={form.variations?.length > 0 ? "opacity-50" : ""}>
            <label className={labelClasses}>
              Base Price {form.variations?.length > 0 && <span className="text-luxury-gold normal-case font-medium ml-2">(Auto-derived)</span>}
            </label>
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => onFieldChange('price', e.target.value)}
              placeholder="0.00"
              disabled={form.variations?.length > 0}
              className={inputClasses}
            />
          </div>

          <div className={form.variations?.length > 0 ? "opacity-50" : ""}>
            <label className={labelClasses}>
              Base Stock {form.variations?.length > 0 && <span className="text-luxury-gold normal-case font-medium ml-2">(Auto-summed)</span>}
            </label>
            <input
              type="number"
              value={form.stock_level}
              onChange={(e) => onFieldChange('stock_level', e.target.value)}
              placeholder="0"
              disabled={form.variations?.length > 0}
              className={inputClasses}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-2xl text-white">Size Variations</h3>
            <button
              type="button"
              onClick={addVariation}
              className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold hover:text-white transition-colors"
            >
              + Add Size
            </button>
          </div>

          <div className="space-y-4">
            {(form.variations || []).map((variation, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_1fr_48px] gap-4 items-end animate-in fade-in slide-in-from-top-2 duration-500">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-stone-500 mb-2 pl-1">Size (e.g. 50ml)</label>
                  <input
                    type="text"
                    value={variation.size_label}
                    onChange={(e) => updateVariation(index, 'size_label', e.target.value)}
                    placeholder="Label"
                    required
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-stone-500 mb-2 pl-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={variation.price}
                    onChange={(e) => updateVariation(index, 'price', e.target.value)}
                    placeholder="0.00"
                    required
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-stone-500 mb-2 pl-1">Stock</label>
                  <input
                    type="number"
                    value={variation.stock_quantity}
                    onChange={(e) => updateVariation(index, 'stock_quantity', e.target.value)}
                    placeholder="0"
                    required
                    className={inputClasses}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeVariation(index)}
                  className="h-12 w-12 flex items-center justify-center rounded-2xl border border-white/5 bg-luxury-black text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>
            ))}

            {!form.variations?.length && (
              <div className="py-10 text-center rounded-[32px] border border-white/5 bg-luxury-black/20 italic text-stone-600 text-sm">
                No variations defined for this piece.
              </div>
            )}
          </div>
        </div>

        {/* SPECIFICATIONS SECTION */}
        <div className="pt-4 border-t border-white/5 mt-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-2xl text-white">Specifications</h3>
            <button
              type="button"
              onClick={addSpec}
              className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold hover:text-white transition-colors"
            >
              + Add Spec
            </button>
          </div>

          <div className="space-y-4">
            {(form.specs || []).map((spec, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_48px] gap-4 items-end animate-in fade-in slide-in-from-top-2 duration-500">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-stone-500 mb-2 pl-1">Name (e.g. Material)</label>
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) => updateSpec(index, 'key', e.target.value)}
                    placeholder="Spec Name"
                    required
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-stone-500 mb-2 pl-1">Value (e.g. Leather)</label>
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => updateSpec(index, 'value', e.target.value)}
                    placeholder="Spec Value"
                    required
                    className={inputClasses}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSpec(index)}
                  className="h-12 w-12 flex items-center justify-center rounded-2xl border border-white/5 bg-luxury-black text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300"
                >
                  <X size={16} />
                </button>
              </div>
            ))}

            {!form.specs?.length && (
              <div className="py-10 text-center rounded-[32px] border border-white/5 bg-luxury-black/20 italic text-stone-600 text-sm">
                No specifications defined for this piece.
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor={descriptionId} className={labelClasses}>Artisanal Description</label>
          <textarea
            id={descriptionId}
            value={form.description}
            onChange={(event) => onFieldChange('description', event.target.value)}
            placeholder="Curate the piece's heritage and features..."
            rows={6}
            required
            className="w-full min-h-[160px] resize-none rounded-[32px] border border-white/10 bg-[#1a1a1a] px-6 py-5 text-sm text-white placeholder-white/40 outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all duration-500"
          />
        </div>
      </div>

      <div className="grid gap-6 rounded-[40px] border border-white/5 bg-luxury-black/40 p-8 shadow-luxury-md sm:p-10">
        <div>
          <div className="flex items-center justify-between mb-4">
             <label className={labelClasses}>Exhibition URLs (Images)</label>
             <button
              type="button"
              onClick={addImage}
              className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold hover:text-white transition-colors"
            >
              + Add URL
            </button>
          </div>
          
          <div className="space-y-4">
             {(form.images || []).map((imgUrl, index) => (
                <div key={index} className="flex gap-2 items-center">
                   <div className="flex-1">
                      <input
                        type="url"
                        value={imgUrl}
                        onChange={(e) => updateImage(index, e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className={inputClasses}
                        required
                      />
                   </div>
                   <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-2xl border border-white/5 bg-luxury-black text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300"
                    >
                      <X size={16} />
                   </button>
                </div>
             ))}
             {!form.images?.length && (
                 <div className="py-6 text-center rounded-[24px] border border-dashed border-white/10 bg-[#1a1a1a]/50 text-[10px] italic text-stone-500 uppercase tracking-widest">
                   No image URLs added
                 </div>
             )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 pt-6 border-t border-white/5">
          {(form.images || []).map((src, index) => (
            src ? (
              <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-white/5 bg-luxury-black">
                <img src={src} alt="" className="w-full h-full object-cover" />
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-luxury-gold/90 text-luxury-dark text-[8px] font-bold uppercase tracking-widest">
                    Primary
                  </div>
                )}
              </div>
            ) : null
          ))}
          
          {(!form.images || form.images.every(img => !img)) && (
            <div className="col-span-2 aspect-video rounded-2xl border border-dashed border-white/5 bg-luxury-black/20 flex flex-col items-center justify-center gap-3">
               <ImageIcon size={32} className="text-stone-800" />
               <p className="text-[10px] italic text-stone-600 uppercase tracking-widest">Awaiting digital assets...</p>
            </div>
          )}
        </div>
      </div>

      {error ? <p className="lg:col-span-2 text-center text-xs font-bold text-rose-500 tracking-wide uppercase">{error}</p> : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:col-span-2 pt-4">
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
          className="rounded-full border border-luxury-gold bg-luxury-gold px-12 py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-luxury-dark transition-all duration-700 hover:bg-transparent hover:text-luxury-gold shadow-gold-glow disabled:opacity-50"
        >
          {submitting ? 'Processing...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
