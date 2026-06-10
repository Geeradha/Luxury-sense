import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CustomDatePicker Component
 * A luxury-themed replacement for the native HTML <input type="date" /> and its calendar popup.
 * 
 * @param {Object} props
 * @param {string} props.value - Currently selected date (YYYY-MM-DD)
 * @param {Function} props.onChange - Callback when a new date is selected
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.className - Additional classes for the trigger button
 */
export default function CustomDatePicker({ 
  value, 
  onChange, 
  placeholder = 'Select date',
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const days = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const totalDays = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const daysArray = [];
    
    // Previous month padding
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
      daysArray.push({ day: prevMonthDays - i, currentMonth: false, date: new Date(year, month - 1, prevMonthDays - i) });
    }
    
    // Current month
    for (let i = 1; i <= totalDays; i++) {
      daysArray.push({ day: i, currentMonth: true, date: new Date(year, month, i) });
    }
    
    // Next month padding
    const remaining = 42 - daysArray.length;
    for (let i = 1; i <= remaining; i++) {
      daysArray.push({ day: i, currentMonth: false, date: new Date(year, month + 1, i) });
    }
    
    return daysArray;
  }, [viewDate]);

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleSelectDate = (date) => {
    onChange(formatDate(date));
    setIsOpen(false);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className={`relative inline-block w-full ${isOpen ? 'z-[120]' : 'z-10'}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-2xl border border-white/10 bg-luxury-black/50 px-5 py-4 text-sm text-white outline-none transition-all duration-300 hover:border-luxury-gold/50 focus:border-luxury-gold/50 ${className}`}
      >
        <span className="truncate">{value ? new Date(value).toLocaleDateString() : placeholder}</span>
        <CalendarIcon size={16} className="text-luxury-gold" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-[110] mt-2 w-[320px] overflow-hidden rounded-[32px] border border-white/10 bg-[#121212] p-6 shadow-2xl backdrop-blur-2xl left-0 lg:left-auto lg:right-0"
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-white/5 text-stone-500 hover:text-white transition-colors">
                <ChevronLeft size={18} />
              </button>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
              </div>
              <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-white/5 text-stone-500 hover:text-white transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-[8px] font-bold uppercase tracking-widest text-stone-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((item, index) => {
                const isSelected = value && formatDate(item.date) === value;
                const isToday = formatDate(item.date) === formatDate(new Date());
                
                return (
                  <button
                    key={index}
                    onClick={() => handleSelectDate(item.date)}
                    className={`h-9 w-9 flex items-center justify-center rounded-xl text-[10px] font-bold transition-all duration-300 ${
                      isSelected 
                        ? 'bg-luxury-gold text-luxury-dark shadow-gold-glow' 
                        : item.currentMonth 
                          ? 'text-stone-300 hover:bg-white/5 hover:text-luxury-gold' 
                          : 'text-stone-700 hover:text-stone-500'
                    } ${isToday && !isSelected ? 'border border-luxury-gold/30' : ''}`}
                  >
                    {item.day}
                  </button>
                );
              })}
            </div>

            {/* Clear Button */}
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between">
              <button 
                onClick={() => handleSelectDate(new Date())}
                className="text-[8px] font-bold uppercase tracking-widest text-luxury-gold hover:text-white transition-colors"
              >
                Today
              </button>
              <button 
                onClick={() => { onChange(''); setIsOpen(false); }}
                className="text-[8px] font-bold uppercase tracking-widest text-stone-600 hover:text-rose-500 transition-colors"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
