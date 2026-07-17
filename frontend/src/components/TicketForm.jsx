import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Send,
  AlertCircle,
  FileText,
  Tag,
  Flag,
} from 'lucide-react';

import { createTicketRequest } from '../api/ticketApi';

export default function TicketForm({
  onCreated,
}) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: 'Software',
  });

  const [submitting, setSubmitting] =
    useState(false);

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      form.title.trim().length < 3
    ) {
      toast.error(
        'Title must contain at least 3 characters'
      );
      return;
    }

    if (
      form.description.trim()
        .length < 10
    ) {
      toast.error(
        'Description must contain at least 10 characters'
      );
      return;
    }

    setSubmitting(true);

    try {
      const res =
        await createTicketRequest(
          form
        );

      toast.success(
        'Support ticket submitted successfully'
      );

      setForm({
        title: '',
        description: '',
        priority: 'Medium',
        category: 'Software',
      });

      onCreated?.(
        res.data.ticket
      );
    } catch (err) {
      toast.error(
        err.message
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card p-6 space-y-5 sticky top-6"
    >
      {/* HEADER */}
      <div className="flex items-center gap-3 pb-4 border-b border-surface-border">

        <div className="p-3 rounded-xl bg-brand-600/20">
          <FileText
            size={22}
            className="text-brand-400"
          />
        </div>

        <div>
          <h2 className="font-semibold text-xl">
            Submit IT Request
          </h2>

          <p className="text-sm text-gray-400">
            Create a support ticket for the IT team
          </p>
        </div>

      </div>

      {/* TITLE */}
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

      {/* CATEGORY */}
      <div>
        <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
          <Tag size={14} />
          Category
        </label>

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="input-field"
        >
          <option>
            Software
          </option>

          <option>
            Hardware
          </option>

          <option>
            Network
          </option>

          <option>
            Account Access
          </option>

          <option>
            Other
          </option>
        </select>
      </div>

      {/* PRIORITY */}
      <div>
        <label className="text-sm text-gray-400 mb-2 flex items-center gap-2">
          <Flag size={14} />
          Priority
        </label>

        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="input-field"
        >
          <option>
            Low
          </option>

          <option>
            Medium
          </option>

          <option>
            High
          </option>
        </select>

        <div className="flex gap-2 mt-2">

          <span className="px-2 py-1 rounded-full text-xs bg-slate-500/15 text-slate-400 border border-slate-500/30">
            Low
          </span>

          <span className="px-2 py-1 rounded-full text-xs bg-amber-500/15 text-amber-400 border border-amber-500/30">
            Medium
          </span>

          <span className="px-2 py-1 rounded-full text-xs bg-red-500/15 text-red-400 border border-red-500/30">
            High
          </span>

        </div>
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="text-sm text-gray-400 mb-2 block">
          Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={7}
          maxLength={1000}
          placeholder="Provide detailed information about the issue..."
          className="input-field resize-none"
        />

        <div className="flex justify-between text-xs text-gray-500 mt-2">

          <span className="flex items-center gap-1">
            <AlertCircle size={12} />
            Minimum 10 characters
          </span>

          <span>
            {form.description.length}/1000
          </span>

        </div>
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full flex items-center justify-center gap-2 py-3"
      >
        <Send size={16} />

        {submitting
          ? 'Submitting Ticket...'
          : 'Submit Ticket'}
      </button>

    </form>
  );
}