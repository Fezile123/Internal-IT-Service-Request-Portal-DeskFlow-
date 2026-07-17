import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Sparkles,
  Loader2,
  ListChecks,
  Wrench,
  BrainCircuit,
  ShieldCheck,
  BarChart3,
  AlertTriangle,
} from 'lucide-react';

import { analyzeTicketRequest } from '../api/aiApi';

export default function AIAssistantPanel() {
  const [form, setForm] = useState({
    title: '',
    description: '',
  });

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState(null);

  const handleAnalyze = async () => {
    if (
      !form.title ||
      !form.description
    ) {
      toast.error(
        'Please enter a title and description'
      );
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res =
        await analyzeTicketRequest(
          form
        );

      setResult(res.data);
    } catch (err) {
      toast.error(
        err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">

      {/* LEFT SIDE */}
      <div className="card p-6">

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-brand-600/20">
            <BrainCircuit
              size={24}
              className="text-brand-400"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              AI Ticket Assistant
            </h2>

            <p className="text-sm text-gray-400">
              Analyze support requests and
              receive intelligent IT recommendations.
            </p>
          </div>
        </div>

        <div className="space-y-4">

          <input
            className="input-field"
            placeholder="Ticket Title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
          />

          <textarea
            rows={8}
            className="input-field resize-none"
            placeholder="Describe the issue in detail..."
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description:
                  e.target.value,
              })
            }
          />

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Analyzing Ticket...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Analyze Ticket
              </>
            )}
          </button>

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="card p-6">

        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck
            size={22}
            className="text-emerald-400"
          />

          <h2 className="text-xl font-semibold">
            AI Analysis Result
          </h2>
        </div>

        {!result && !loading && (
          <div className="text-center py-20">

            <Sparkles
              size={42}
              className="mx-auto text-gray-600 mb-3"
            />

            <h3 className="font-medium mb-2">
              Ready for Analysis
            </h3>

            <p className="text-gray-500 text-sm">
              Enter ticket details and run
              an AI analysis.
            </p>

          </div>
        )}

        {loading && (
          <div className="text-center py-20">

            <Loader2
              size={40}
              className="animate-spin mx-auto text-brand-400"
            />

            <p className="mt-4 text-gray-400">
              Processing ticket...
            </p>

          </div>
        )}

        {result && (
          <div className="space-y-6">

            {/* TOP CARDS */}
            <div className="grid grid-cols-2 gap-4">

              <div className="bg-surface rounded-xl border border-surface-border p-4">
                <p className="text-xs text-gray-500 mb-1">
                  Category
                </p>

                <p className="font-semibold text-brand-400">
                  {result.category}
                </p>
              </div>

              <div className="bg-surface rounded-xl border border-surface-border p-4">
                <p className="text-xs text-gray-500 mb-1">
                  Priority
                </p>

                <p className="font-semibold text-amber-400">
                  {result.recommendedPriority}
                </p>
              </div>

            </div>

            {/* CONFIDENCE */}
            <div className="card p-4 bg-surface">

              <div className="flex items-center gap-2 mb-2">
                <BarChart3
                  size={16}
                  className="text-emerald-400"
                />

                <span className="text-sm font-medium">
                  Confidence Score
                </span>
              </div>

              <div className="h-3 rounded-full bg-surface-border overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{
                    width: `${
                      result.confidence || 85
                    }%`,
                  }}
                />
              </div>

              <p className="text-xs text-gray-500 mt-2">
                {result.confidence || 85}% confidence
              </p>

            </div>

            {/* SUMMARY */}
            <div>

              <h3 className="font-semibold mb-2">
                Summary
              </h3>

              <p className="text-sm text-gray-400">
                {result.summary}
              </p>

            </div>

            {/* TROUBLESHOOTING */}
            <div>

              <h3 className="flex items-center gap-2 font-semibold mb-3">
                <ListChecks size={16} />
                Troubleshooting Steps
              </h3>

              <ul className="space-y-2">
                {result.troubleshootingSteps?.map(
                  (step, index) => (
                    <li
                      key={index}
                      className="flex gap-3 text-sm text-gray-400"
                    >
                      <span className="text-brand-400 font-bold">
                        {index + 1}.
                      </span>

                      {step}
                    </li>
                  )
                )}
              </ul>

            </div>

            {/* RESOLUTION */}
            <div>

              <h3 className="flex items-center gap-2 font-semibold mb-2">
                <Wrench size={16} />
                Suggested Resolution
              </h3>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <p className="text-sm text-gray-300">
                  {result.suggestedResolution}
                </p>
              </div>

            </div>

            {/* ALERT */}
            {result.recommendedPriority ===
              'High' && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle
                  size={18}
                  className="text-red-400 mt-0.5"
                />

                <div>
                  <p className="font-medium text-red-400">
                    High Priority Issue
                  </p>

                  <p className="text-sm text-gray-400">
                    Immediate IT attention
                    is recommended.
                  </p>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}