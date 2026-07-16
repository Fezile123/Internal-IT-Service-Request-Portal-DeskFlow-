import { useState } from 'react';
import toast from 'react-hot-toast';
import { Sparkles, Loader2, ListChecks, Wrench } from 'lucide-react';
import { analyzeTicketRequest } from '../api/aiApi';

export default function AIAssistantPanel() {
  const [form, setForm] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!form.title || !form.description) { toast.error('Enter a title and description to analyze'); return; }
    setLoading(true); setResult(null);
    try {
      const res = await analyzeTicketRequest(form);
      setResult(res.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-5">
      <div className="card p-5 space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><Sparkles size={16} className="text-brand-400" /> Analyze a Ticket</h2>
        <input className="input-field" placeholder="Ticket title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className="input-field resize-none" rows={5} placeholder="Ticket description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button onClick={handleAnalyze} disabled={loading} className="btn-primary flex items-center gap-2">
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          {loading ? 'Analyzing...' : 'Run AI Analysis'}
        </button>
      </div>
      <div className="card p-5">
        <h2 className="font-semibold mb-4">AI Result</h2>
        {!result && !loading && <p className="text-sm text-gray-500">Results will appear here.</p>}
        {loading && <p className="text-sm text-gray-500">Groq is analyzing the ticket...</p>}
        {result && (
          <div className="space-y-4 text-sm">
            <div className="flex gap-2 flex-wrap">
              <span className="px-2 py-1 rounded-full bg-brand-600/20 text-brand-400 border border-brand-600/30 text-xs">{result.category}</span>
              <span className="px-2 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs">Priority: {result.recommendedPriority}</span>
            </div>
            <div><p className="text-gray-400 text-xs mb-1">Summary</p><p>{result.summary}</p></div>
            <div>
              <p className="text-gray-400 text-xs mb-1 flex items-center gap-1"><ListChecks size={13} /> Troubleshooting Steps</p>
              <ul className="list-disc list-inside space-y-1">{result.troubleshootingSteps.map((step, i) => <li key={i}>{step}</li>)}</ul>
            </div>
            <div><p className="text-gray-400 text-xs mb-1 flex items-center gap-1"><Wrench size={13} /> Suggested Resolution</p><p>{result.suggestedResolution}</p></div>
          </div>
        )}
      </div>
    </div>
  );
}
