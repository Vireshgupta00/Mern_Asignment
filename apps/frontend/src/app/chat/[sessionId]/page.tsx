'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
import DashboardLayout from '../../../../components/DashboardLayout';
import { ArrowLeft, Bot, Send } from 'lucide-react';

export default function PastChatSession({ params }: { params: Promise<{ sessionId: string }> }) {
  const resolvedParams = use(params);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await api.get(`/ai/sessions/${resolvedParams.sessionId}`);
        setMessages(res.data.messages || []);
      } catch (e) {
        console.error('Failed to load session');
      }
    };
    fetchSession();
  }, [resolvedParams.sessionId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post(`/ai/sessions/${resolvedParams.sessionId}/messages`, { content: userText });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.assistantMessage.content }]);
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'system', content: `Error: ${e.response?.data?.error || 'Failed to reach AI service.'}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-full transition bg-slate-200/50">
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">Conversation History</h1>
      </div>
      <div className="flex flex-col h-[75vh] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl max-w-[75%] shadow-sm leading-relaxed ${
                msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && <div className="p-4 bg-slate-50 text-slate-500 italic rounded-2xl border w-24 text-center shadow-sm">Thinking...</div>}
        </main>
        <footer className="bg-slate-50 p-4 border-t border-slate-200">
          <form onSubmit={sendMessage} className="flex gap-3">
            <input type="text" value={input} onChange={e => setInput(e.target.value)} className="flex-1 border border-slate-300 p-4 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" placeholder="Reply to AI..." />
            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center disabled:opacity-50">
              <Send size={20} />
            </button>
          </form>
        </footer>
      </div>
    </DashboardLayout>
  );
}
