'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import DashboardLayout from '../../components/DashboardLayout';
import { FileText, MessageSquare, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        // Fetching independently so a failure in the Chat service doesn't wipe out the Resume data!
        const resumesRes = await api.get('/resume').catch(() => ({ data: [] }));
        const chatsRes = await api.get('/ai/sessions').catch(() => ({ data: [] }));

        setStats({
          totalResumes: resumesRes.data.length || 0,
          resumesList: resumesRes.data || [],
          totalChats: chatsRes.data.length || 0,
          upcomingConsultations: 0, 
          completedConsultations: 0
        });
      } catch (error) {
        setStats({ totalResumes: 0, resumesList: [], totalChats: 0, upcomingConsultations: 0, completedConsultations: 0 });
      }
    };
    fetchStats();
  }, [router]);

  if (!stats) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-[60vh] text-slate-400 font-medium animate-pulse">
        Loading your workspace...
      </div>
    </DashboardLayout>
  );

  const statCards = [
    { title: 'Total Resumes', value: stats.totalResumes, icon: FileText, color: 'bg-blue-500', bg: 'bg-blue-50' },
    { title: 'Chat Sessions', value: stats.totalChats, icon: MessageSquare, color: 'bg-indigo-500', bg: 'bg-indigo-50' },
    { title: 'Upcoming Calls', value: stats.upcomingConsultations, icon: Calendar, color: 'bg-purple-500', bg: 'bg-purple-50' },
    { title: 'Completed', value: stats.completedConsultations, icon: CheckCircle2, color: 'bg-emerald-500', bg: 'bg-emerald-50' },
  ];

  return (
    <DashboardLayout>
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Welcome back, User</h1>
        <p className="text-slate-500 mt-2 text-lg">Here is an overview of your career progression today.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${card.bg}`}>
                  <Icon size={24} className={card.color.replace('bg-', 'text-')} />
                </div>
              </div>
              <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{card.title}</h3>
              <p className="text-4xl font-black mt-1 text-slate-800">{card.value}</p>
            </div>
          )
        })}
      </div>
      
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         <button onClick={() => router.push('/resumes/create')} className="text-left group relative bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
           <FileText size={32} className="text-blue-500 mb-6" />
           <h3 className="text-xl font-bold text-slate-900 mb-2">Build Resume</h3>
           <p className="text-slate-500 mb-6 line-clamp-2">Use our AI tools to craft a professional, ATS-friendly resume.</p>
           <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">Get Started <ArrowRight size={18} className="ml-1" /></div>
         </button>

         <button onClick={() => router.push('/chat')} className="text-left group relative bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-indigo-600"></div>
           <MessageSquare size={32} className="text-indigo-500 mb-6" />
           <h3 className="text-xl font-bold text-slate-900 mb-2">Talk to AI Assistant</h3>
           <p className="text-slate-500 mb-6 line-clamp-2">Practice for interviews or get personalized career advice.</p>
           <div className="flex items-center text-indigo-600 font-semibold group-hover:gap-2 transition-all">Start Chat <ArrowRight size={18} className="ml-1" /></div>
         </button>

         <button onClick={() => router.push('/consultations/book')} className="text-left group relative bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
           <Calendar size={32} className="text-purple-500 mb-6" />
           <h3 className="text-xl font-bold text-slate-900 mb-2">Book Expert</h3>
           <p className="text-slate-500 mb-6 line-clamp-2">Schedule a 1-on-1 session with a professional career coach.</p>
           <div className="flex items-center text-purple-600 font-semibold group-hover:gap-2 transition-all">View Experts <ArrowRight size={18} className="ml-1" /></div>
         </button>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Recent Resumes</h2>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {stats.resumesList && stats.resumesList.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {stats.resumesList.map((resume: any) => (
              <li key={resume._id} className="p-6 hover:bg-slate-50 transition flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{resume.title || 'Untitled Resume'}</h3>
                  <p className="text-sm text-slate-500 mt-1">Generated on {new Date(resume.createdAt).toLocaleDateString()}</p>
                </div>
                <button 
                  onClick={() => router.push(`/resumes/${resume._id}/preview`)}
                  className="px-4 py-2 bg-blue-50 text-blue-700 font-semibold rounded-lg hover:bg-blue-100 transition"
                >
                  Preview HTML
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-slate-500">
            You haven't generated any resumes yet.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
