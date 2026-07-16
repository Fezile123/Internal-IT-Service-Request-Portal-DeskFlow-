import { useState } from 'react';
import toast from 'react-hot-toast';
import { Send, AlertCircle, FileText } from 'lucide-react';
import { createTicketRequest } from '../api/ticketApi';

export default function TicketForm({ onCreated }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: 'Software',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.title.trim().length < 3) {
      toast.error('Title must contain at least 3 characters');
      return;
    }

    if (form.description.trim().length < 10) {
      toast.error('Description must contain at least 10 characters');
      return;
    }

    setSubmitting(true);

    try {
      const res = await createTicketRequest(form);

      toast.success('Support ticket submitted successfully');

      setForm({
        title: '',
        description: '',
        priority: 'Medium',
        category: 'Software',
      });

      onCreated?.(res.data.ticket);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card p-6 space-y-5"
    >
      <div className="flex items-center gap-2">
        <FileText size={18} className="text-brand-400" />
        <h2 className="font-semibold text-lg">
          Create New Ticket
        </h2>
      </div>

      <div>
        <label className="text-sm text-gray-400 mb-2 block">
          Issue Title
        </label>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Unable to connect to VPN"
          className="input-field"
          maxLength={100}
        />

        <div className="text-right text-xs text-gray-500 mt-1">
          {form.title.length}/100
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-400 mb-2 block">
          Category
        </label>

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="input-field"
        >
          <option>Software</option>
          <option>Hardware</option>
          <option>Network</option>
          <option>Account Access</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label className="text-sm text-gray-400 mb-2 block">
          Priority
        </label>

        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="input-field"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      <div>
        <label className="text-sm text-gray-400 mb-2 block">
          Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={6}
          maxLength={1000}
          placeholder="Provide as much detail as possible about the issue..."
          className="input-field resize-none"
        />

        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span className="flex items-center gap-1">
            <AlertCircle size={12} />
            Minimum 10 characters
          </span>

          <span>
            {form.description.length}/1000
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <Send size={16} />

        {submitting
          ? 'Submitting Ticket...'
          : 'Submit Ticket'}
      </button>
    </form>
  );
}
