'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../lib/api';
import { LayoutDashboard, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Branding Column */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/30 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl"><LayoutDashboard size={24} className="text-white" /></div>
          <span className="text-2xl font-black text-white tracking-tight">Career<span className="text-blue-400">AI</span></span>
        </div>

        <div className="relative z-10 max-w-lg mt-auto mb-auto">
          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Accelerate your career trajectory with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Artificial Intelligence</span>.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">Join thousands of professionals building better resumes, practicing interviews, and booking top-tier career experts.</p>
        </div>
      </div>

      {/* Right Form Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="text-blue-600" size={32} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">Welcome back</h2>
            <p className="text-slate-500 mt-3">Sign in to your account to continue</p>
          </div>

          {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm font-medium">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input type="email" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <input type="password" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none" value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white p-4 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-70 mt-4 shadow-lg shadow-slate-900/20">
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>
          
          <p className="mt-8 text-center text-slate-500 font-medium">
            Don't have an account? <Link href="/register" className="text-blue-600 font-bold hover:underline">Create one now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
