'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
import DashboardLayout from '../../../../components/DashboardLayout';
import { ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';

export default function ResumePreview({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [resume, setResume] = useState<any>(null);
  const [isCached, setIsCached] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await api.get(`/resume/${resolvedParams.id}`);
        setResume(res.data);
        if (res.data.cached) setIsCached(true);
      } catch (e) {
        console.error('Failed to load resume');
      }
    };
    fetchResume();
  }, [resolvedParams.id]);

  if (!resume) return <DashboardLayout><div className="p-8">Loading Document...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-full transition bg-slate-200/50">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Resume Preview</h1>
        </div>
        {isCached && (
          <span className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-200">
            <CheckCircle2 size={14} /> Served from Redis Cache
          </span>
        )}
      </div>

      <div className="bg-white shadow-2xl rounded-2xl border border-slate-200 min-h-[70vh] p-12 max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-900 border-b pb-4 mb-6">{resume.title}</h1>
        
        {resume.experience && resume.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wider mb-4 text-blue-600">Professional Summary</h2>
            <div className="prose prose-slate max-w-none text-slate-600" dangerouslySetInnerHTML={{ __html: resume.experience[0].description }} />
          </div>
        )}
        
        <div className="mt-12 p-6 bg-slate-50 border rounded-xl text-center text-slate-500 text-sm">
          This resume is optimized for ATS parsing using Semantic HTML blocks.
        </div>
      </div>
    </DashboardLayout>
  );
}
