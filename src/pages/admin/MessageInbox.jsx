import { useEffect, useState } from 'react';
import apiClient from '../../api/axios';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MailOpen, Trash2, Loader2 } from 'lucide-react';

export default function MessageInbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/admin/contact-messages');
      setMessages(response.data);
    } catch (error) {
      toast.error('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleReadStatus = async (id, currentStatus) => {
    setUpdatingId(id);
    try {
      await apiClient.put(`/admin/contact-messages/${id}`, { is_read: !currentStatus });
      setMessages(prev => prev.map(msg => 
        msg.id === id ? { ...msg, is_read: !currentStatus } : msg
      ));
    } catch (error) {
      toast.error('Failed to update message status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to permanently remove this inquiry?')) return;
    try {
      await apiClient.delete(`/admin/contact-messages/${id}`);
      setMessages(prev => prev.filter(msg => msg.id !== id));
      toast.success('Message removed.');
    } catch (error) {
      toast.error('Failed to delete message.');
    }
  };

  return (
    <section className="grid gap-10">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold/90">Customer Inquiries</p>
        <h1 className="font-serif text-5xl tracking-tight text-white sm:text-6xl">Message Inbox</h1>
      </div>

      <div className="overflow-hidden rounded-[40px] border border-white/5 bg-luxury-charcoal shadow-luxury-md">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead className="bg-white/2 text-[9px] font-bold uppercase tracking-[0.3em] text-stone-500">
              <tr>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Sender</th>
                <th className="px-8 py-6">Message</th>
                <th className="px-8 py-6">Received</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-luxury-gold" />
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-stone-500 italic uppercase tracking-widest text-[10px]">No messages found in your inbox.</td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {messages.map((msg) => (
                    <motion.tr 
                      key={msg.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`group transition-colors duration-500 ${!msg.is_read ? 'bg-luxury-gold/[0.03]' : 'hover:bg-white/2'}`}
                    >
                      <td className="px-8 py-6">
                        {!msg.is_read ? (
                          <span className="inline-flex items-center gap-2 rounded-full border border-luxury-gold/30 bg-luxury-gold/10 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-luxury-gold">
                            <span className="h-1.5 w-1.5 rounded-full bg-luxury-gold animate-pulse" />
                            New
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold uppercase tracking-widest text-stone-600">Read</span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className={`font-serif text-lg ${!msg.is_read ? 'text-white' : 'text-stone-400'}`}>{msg.name}</div>
                        <div className="text-[10px] text-stone-500 uppercase tracking-widest mt-0.5">{msg.email}</div>
                      </td>
                      <td className="px-8 py-6 max-w-md">
                        <p className={`text-sm leading-relaxed line-clamp-2 ${!msg.is_read ? 'text-stone-200 font-medium' : 'text-stone-500'}`}>
                          {msg.message}
                        </p>
                      </td>
                      <td className="px-8 py-6 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                        {new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end items-center gap-6">
                          <button
                            onClick={() => toggleReadStatus(msg.id, msg.is_read)}
                            disabled={updatingId === msg.id}
                            className={`transition-colors ${msg.is_read ? 'text-stone-600 hover:text-white' : 'text-luxury-gold hover:text-white'}`}
                            title={msg.is_read ? 'Mark as Unread' : 'Mark as Read'}
                          >
                            {msg.is_read ? <MailOpen size={18} /> : <Mail size={18} />}
                          </button>
                          <button
                            onClick={() => deleteMessage(msg.id)}
                            className="text-stone-600 hover:text-rose-500 transition-colors"
                            title="Delete Inquiry"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
