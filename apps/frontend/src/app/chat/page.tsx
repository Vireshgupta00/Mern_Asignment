'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import DashboardLayout from '../../components/DashboardLayout';
import { ArrowLeft, Bot, Send } from 'lucide-react';

export default function ChatAssistant() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await api.post('/ai/sessions');
        setSessionId(res.data._id);
      } catch (e) {
        console.error('Failed to init chat');
      }
    };
    initSession();
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !sessionId) return;
    
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post(`/ai/sessions/${sessionId}/messages`, { content: userText });
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
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            AI Career Assistant
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-widest font-bold">Online</span>
          </h1>
        </div>
      </div>

      <div className="flex flex-col h-[75vh] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
              <Bot size={64} className="text-slate-400" />
              <div>
                <h2 className="text-xl font-bold text-slate-700">How can I help you today?</h2>
                <p className="text-slate-500 max-w-md mx-auto">Ask me to review your resume, practice interview questions, or provide career transition advice.</p>
              </div>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role !== 'user' && (
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <Bot size={18} className="text-indigo-600" />
                </div>
              )}
              <div className={`p-4 rounded-2xl max-w-[75%] shadow-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex justify-start items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Bot size={18} className="text-indigo-600" />
               </div>
               <div className="p-4 bg-slate-50 text-slate-500 italic rounded-2xl rounded-tl-sm border border-slate-100 flex gap-1">
                 <span className="animate-bounce">.</span><span className="animate-bounce delay-75">.</span><span className="animate-bounce delay-150">.</span>
               </div>
             </div>
          )}
        </main>
        
        <footer className="bg-slate-50 p-4 border-t border-slate-200">
          <form onSubmit={sendMessage} className="flex gap-3 max-w-4xl mx-auto relative">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything about your career..."
              className="flex-1 bg-white border border-slate-300 p-4 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-800 transition-all shadow-sm"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim() || !sessionId} 
              className="bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition shadow-sm flex items-center justify-center w-16"
            >
              <Send size={20} />
            </button>
          </form>
        </footer>
      </div>
    </DashboardLayout>
  );
}
