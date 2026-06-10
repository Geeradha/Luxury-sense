import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

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

  return 'Unable to load product questions.';
}

export default function AdminQuestions() {
  const { token } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    }),
    [token]
  );

  useEffect(() => {
    let isActive = true;

    const loadQuestions = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get('/api/admin/product-questions', { headers: authHeaders });
        if (isActive) {
          const nextQuestions = extractItems(response);
          setQuestions(nextQuestions);
          setAnswers(
            nextQuestions.reduce((accumulator, question) => {
              accumulator[question.id] = question.answer || '';
              return accumulator;
            }, {})
          );
        }
      } catch (fetchError) {
        if (isActive) {
          setError(getApiErrorMessage(fetchError));
          setQuestions([]);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadQuestions();

    return () => {
      isActive = false;
    };
  }, [authHeaders]);

  const handleSave = async (questionId) => {
    setSavingId(questionId);
    setError('');

    try {
      const response = await axios.put(
        `/api/admin/product-questions/${questionId}`,
        { answer: answers[questionId] || '' },
        { headers: authHeaders }
      );

      const updatedQuestion = response.data?.data;

      setQuestions((currentQuestions) =>
        currentQuestions.map((question) => (question.id === questionId ? updatedQuestion : question))
      );

      setAnswers((currentAnswers) => ({
        ...currentAnswers,
        [questionId]: updatedQuestion?.answer || '',
      }));

      toast.success('Question approved and answer saved.');
    } catch (saveError) {
      const message = getApiErrorMessage(saveError);
      setError(message);
      toast.error(message);
    } finally {
      setSavingId(null);
    }
  };

  const rows = useMemo(() => {
    if (loading) {
      return (
        <tr>
          <td colSpan="4" className="px-4 py-8 text-center text-sm text-stone-500">Loading questions...</td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan="4" className="px-4 py-8 text-center text-sm text-rose-700">{error}</td>
        </tr>
      );
    }

    if (!questions.length) {
      return (
        <tr>
          <td colSpan="4" className="px-4 py-8 text-center text-sm text-stone-500">No questions found.</td>
        </tr>
      );
    }

    return questions.map((question) => (
      <tr key={question.id} className="border-t border-stone-100 align-top">
        <td className="px-4 py-4 text-sm text-stone-700">
          <div className="font-medium text-stone-950">{question.question}</div>
          <div className="mt-2 text-xs uppercase tracking-[0.2em] text-stone-400">By {question.user?.name || 'Guest'}</div>
        </td>
        <td className="px-4 py-4 text-sm text-stone-600">{question.product?.name || 'Unknown Product'}</td>
        <td className="px-4 py-4">
          <textarea
            value={answers[question.id] || ''}
            onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
            rows={4}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-300 focus:border-stone-950"
            placeholder="Type the answer here"
          />
        </td>
        <td className="px-4 py-4">
          <button
            type="button"
            onClick={() => handleSave(question.id)}
            disabled={savingId === question.id}
            className="rounded-full border border-stone-950 bg-stone-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {savingId === question.id ? 'Saving...' : 'Approve & Save'}
          </button>
        </td>
      </tr>
    ));
  }, [answers, error, loading, questions, savingId]);

  return (
    <section className="grid gap-10">
      <div>
        
        <h1 className="mt-4 font-serif text-5xl tracking-tight text-white sm:text-6xl">Product Inquiries</h1>
      </div>

      <div className="overflow-hidden rounded-[40px] border border-white/5 bg-luxury-charcoal shadow-luxury-md">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead className="bg-white/2 text-[9px] font-bold uppercase tracking-[0.3em] text-stone-500">
              <tr>
                <th className="px-8 py-6">Inquiry</th>
                <th className="px-8 py-6">Subject</th>
                <th className="px-8 py-6">Draft Response</th>
                <th className="px-8 py-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center">
                    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-luxury-gold border-t-transparent"></div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-rose-500 font-bold uppercase tracking-widest text-xs">{error}</td>
                </tr>
              ) : questions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-stone-500 italic uppercase tracking-widest text-xs">No pending inquiries discovered.</td>
                </tr>
              ) : questions.map((question) => (
                <tr key={question.id} className="group hover:bg-white/2 transition-colors duration-500 align-top">
                  <td className="px-8 py-8">
                    <div className="font-serif text-lg text-white leading-relaxed">{question.question}</div>
                    <div className="mt-2 text-[9px] font-bold uppercase tracking-[0.2em] text-stone-500">From: {question.user?.name || 'Guest'}</div>
                  </td>
                  <td className="px-8 py-8 text-sm text-stone-400 font-medium">
                    {question.product?.name || 'Bespoke Request'}
                  </td>
                  <td className="px-8 py-8">
                    <textarea
                      value={answers[question.id] || ''}
                      onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
                      rows={3}
                      className="w-full rounded-2xl border border-white/10 bg-luxury-black/50 px-5 py-4 text-sm text-white outline-none focus:border-luxury-gold/50 transition-all duration-500 placeholder:text-stone-700"
                      placeholder="Draft your refined response..."
                    />
                  </td>
                  <td className="px-8 py-8 text-right">
                    <button
                      type="button"
                      onClick={() => handleSave(question.id)}
                      disabled={savingId === question.id}
                      className="text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-gold hover:text-white transition-colors disabled:opacity-50"
                    >
                      {savingId === question.id ? 'Saving...' : 'Publish'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
