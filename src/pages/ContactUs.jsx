import { useState } from 'react';
import { MapPin, Mail, Phone, Loader2 } from 'lucide-react';
import apiClient from '../api/axios';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await apiClient.post('/contact', form);
      toast.success(response.data.message || 'Message sent. Please check your inbox for confirmation.');
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main className="min-h-screen bg-luxury-black text-stone-100 px-6 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-24 lg:grid-cols-2 lg:items-start">
          
          {/* Left Column: Contact Details */}
          <motion.section 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-16"
          >
            <div className="space-y-8">
              
              <h1 className="font-serif text-7xl tracking-tight text-white sm:text-8xl">GET IN <br className="hidden sm:block" /> TOUCH</h1>
              <p className="max-w-md text-sm leading-8 text-stone-400 sm:text-lg sm:leading-9">
                Whether you seek a bespoke fragrance consultation or have an inquiry regarding our latest collection, our dedicated concierge team is at your disposal.
              </p>
            </div>

            <div className="space-y-10 pt-4">
              <div className="flex items-start gap-8 group">
                <div className="mt-1 rounded-full bg-white/5 p-4 text-luxury-gold transition-colors duration-500 group-hover:bg-luxury-gold group-hover:text-luxury-dark">
                  <MapPin size={22} />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500 mb-3">Atelier Address</h3>
                  <p className="text-base font-medium leading-relaxed text-white">
                    DHA Phase 6, Karachi<br />
                    Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-8 group">
                <div className="mt-1 rounded-full bg-white/5 p-4 text-luxury-gold transition-colors duration-500 group-hover:bg-luxury-gold group-hover:text-luxury-dark">
                  <Mail size={22} />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500 mb-3">Digital Inquiry</h3>
                  <p className="text-base font-medium text-white underline decoration-white/10 underline-offset-8 transition-all group-hover:decoration-luxury-gold">luxurysense.ls@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-8 group">
                <div className="mt-1 rounded-full bg-white/5 p-4 text-luxury-gold transition-colors duration-500 group-hover:bg-luxury-gold group-hover:text-luxury-dark">
                  <Phone size={22} />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500 mb-3">Direct Hotline</h3>
                  <p className="text-base font-medium text-white tracking-widest">+92 300 1234567</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Right Column: Contact Form */}
          <motion.section 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[48px] border border-white/5 bg-luxury-charcoal p-8 shadow-luxury-lg sm:p-14"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500 ml-1">Your Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="E.g. Alexander McQueen"
                  className="w-full h-14 rounded-2xl border border-white/5 bg-luxury-black px-6 text-sm text-white placeholder-white/20 outline-none focus:border-luxury-gold/30 transition-all duration-500"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500 ml-1">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@domain.com"
                  className="w-full h-14 rounded-2xl border border-white/5 bg-luxury-black px-6 text-sm text-white placeholder-white/20 outline-none focus:border-luxury-gold/30 transition-all duration-500"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500 ml-1">The Inquiry</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can we curate your experience?"
                  className="w-full resize-none rounded-[32px] border border-white/5 bg-luxury-black px-6 py-5 text-sm text-white placeholder-white/20 outline-none focus:border-luxury-gold/30 transition-all duration-500"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-full bg-white py-5 text-[11px] font-bold uppercase tracking-[0.4em] text-luxury-dark transition-all duration-700 hover:bg-luxury-gold disabled:opacity-50 flex items-center justify-center gap-4 shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Processing
                  </>
                ) : 'Dispatch Message'}
              </motion.button>
            </form>
          </motion.section>

        </div>
      </div>
    </main>
  );
}
