import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CustomDropdown Component
 * A premium replacement for the native HTML <select> element.
 * 
 * @param {Object} props
 * @param {string} props.value - Currently selected value
 * @param {Function} props.onChange - Callback when a new value is selected
 * @param {Array} props.options - Array of options (strings or objects { value, label })
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.disabled - Whether the dropdown is disabled
 * @param {string} props.className - Additional classes for the trigger button
 * @param {string} props.align - Dropdown alignment ('left' or 'right')
 */
export default function CustomDropdown({ 
  value, 
  onChange, 
  options, 
  placeholder = 'Select option', 
  disabled = false,
  className = '',
  align = 'left'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getOptionLabel = (option) => {
    if (typeof option === 'string') return option;
    return option.label;
  };

  const getOptionValue = (option) => {
    if (typeof option === 'string') return option;
    return option.value;
  };

  const selectedOption = options.find(opt => getOptionValue(opt) === value);
  const displayLabel = selectedOption ? getOptionLabel(selectedOption) : placeholder;

  const handleSelect = (option) => {
    if (disabled) return;
    onChange(getOptionValue(option));
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block w-full ${isOpen ? 'z-[120]' : 'z-10'}`} ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-2xl border border-white/10 bg-luxury-black px-5 py-4 text-sm text-white outline-none transition-all duration-300 hover:border-luxury-gold/40 focus:border-luxury-gold/40 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      >
        <span className="truncate capitalize">{displayLabel}</span>
        <ChevronDown 
          size={16} 
          className={`text-stone-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`absolute z-[100] mt-2 w-full min-w-[200px] overflow-hidden rounded-2xl border border-white/10 bg-[#121212] p-2 shadow-2xl backdrop-blur-2xl ${align === 'right' ? 'right-0' : 'left-0'}`}
          >
            <ul className="max-h-[300px] overflow-y-auto custom-scrollbar">
              {options.map((option, index) => {
                const optValue = getOptionValue(option);
                const isSelected = optValue === value;
                const isOptionDisabled = typeof option === 'object' && option.disabled;

                return (
                  <li key={index}>
                    <button
                      type="button"
                      disabled={isOptionDisabled}
                      onClick={() => handleSelect(option)}
                      className={`w-full rounded-xl px-4 py-3 text-left text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                        isSelected 
                          ? 'bg-luxury-gold text-luxury-dark' 
                          : 'text-stone-300 hover:bg-white/5 hover:text-luxury-gold'
                      } ${isOptionDisabled ? 'cursor-not-allowed opacity-30' : ''}`}
                    >
                      {getOptionLabel(option)}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
