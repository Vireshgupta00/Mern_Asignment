'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import DashboardLayout from '../../../components/DashboardLayout';
import ResumeEditor from '../../../components/ResumeEditor';
import { ArrowLeft, Save, Sparkles, LayoutTemplate, User, Briefcase } from 'lucide-react';

export default function CreateResume() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [templateId, setTemplateId] = useState('modern');
  const [generatedHtml, setGeneratedHtml] = useState('');
  const router = useRouter();

  // Structured Data State
  const [personalInfo, setPersonalInfo] = useState({ name: 'Jane Developer', email: 'jane@example.com', phone: '(555) 123-4567', location: 'San Francisco, CA' });
  const [experience, setExperience] = useState([{ title: 'Senior Software Engineer', company: 'TechNova', startDate: '2021', endDate: 'Present', description: 'Architected scalable microservices using the MERN stack.' }]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Hits the AI Generation endpoint which combines structured data + AI summary + Templates
      const res = await api.post('/resume/generate', { personalInfo, experience, templateId });
      setGeneratedHtml(res.data.html);
      setStep(2); // Move to the Tiptap Editing step
    } catch (err) {
      alert('Failed to generate AI Resume');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.post('/resume', {
        title: `${personalInfo.name} - ${templateId === 'ats-classic' ? 'ATS' : 'Modern'} Resume`,
        personalInfo: {
          fullName: personalInfo.name,
          email: personalInfo.email,
          phone: personalInfo.phone,
          location: personalInfo.location
        },
        summary: generatedHtml,
        experience: []
      });
      router.push('/dashboard');
    } catch (err: any) {
      alert('Failed to save resume: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-full transition bg-slate-200/50">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">AI Resume Builder</h1>
            <p className="text-slate-500 mt-1">Structured data to semantic HTML generation flow.</p>
          </div>
        </div>
      </div>

      {step === 1 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><User className="text-blue-600"/> Personal Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <input className="border p-3 rounded-lg w-full" placeholder="Full Name" value={personalInfo.name} onChange={e => setPersonalInfo({...personalInfo, name: e.target.value})} />
                <input className="border p-3 rounded-lg w-full" placeholder="Email" value={personalInfo.email} onChange={e => setPersonalInfo({...personalInfo, email: e.target.value})} />
                <input className="border p-3 rounded-lg w-full" placeholder="Phone" value={personalInfo.phone} onChange={e => setPersonalInfo({...personalInfo, phone: e.target.value})} />
                <input className="border p-3 rounded-lg w-full" placeholder="Location" value={personalInfo.location} onChange={e => setPersonalInfo({...personalInfo, location: e.target.value})} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><Briefcase className="text-blue-600"/> Latest Experience</h2>
              <div className="grid grid-cols-2 gap-4">
                <input className="border p-3 rounded-lg w-full" placeholder="Job Title" value={experience[0].title} onChange={e => { const newExp = [...experience]; newExp[0].title = e.target.value; setExperience(newExp); }} />
                <input className="border p-3 rounded-lg w-full" placeholder="Company" value={experience[0].company} onChange={e => { const newExp = [...experience]; newExp[0].company = e.target.value; setExperience(newExp); }} />
                <input className="border p-3 rounded-lg w-full" placeholder="Start Date" value={experience[0].startDate} onChange={e => { const newExp = [...experience]; newExp[0].startDate = e.target.value; setExperience(newExp); }} />
                <input className="border p-3 rounded-lg w-full" placeholder="End Date" value={experience[0].endDate} onChange={e => { const newExp = [...experience]; newExp[0].endDate = e.target.value; setExperience(newExp); }} />
                <textarea className="border p-3 rounded-lg w-full col-span-2" rows={3} placeholder="Job Description" value={experience[0].description} onChange={e => { const newExp = [...experience]; newExp[0].description = e.target.value; setExperience(newExp); }} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><LayoutTemplate className="text-indigo-600"/> Select Template</h2>
              <select className="w-full border p-4 rounded-xl font-medium focus:ring-2 focus:ring-blue-500" value={templateId} onChange={e => setTemplateId(e.target.value)}>
                <option value="modern">Modern Professional</option>
                <option value="ats-classic">ATS Classic (Semantic HTML)</option>
              </select>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-blue-600 text-white p-6 rounded-2xl font-bold text-lg hover:bg-blue-700 transition flex flex-col items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-blue-600/20"
            >
              <Sparkles size={32} />
              {loading ? 'AI is drafting your resume...' : 'Generate with AI'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-2xl rounded-2xl border border-slate-200 min-h-[70vh] overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Tiptap Resume Editor</h2>
              <p className="text-slate-500 text-sm">Refine your AI-generated content before saving.</p>
            </div>
            <button onClick={handleSave} disabled={loading} className="bg-slate-900 text-white px-6 py-2.5 rounded-lg shadow-md hover:bg-slate-800 transition flex items-center gap-2 font-medium">
              <Save size={18} /> {loading ? 'Saving...' : 'Save to Database'}
            </button>
          </div>
          <div className="p-8 max-w-4xl mx-auto">
            <ResumeEditor initialContent={generatedHtml} onChange={setGeneratedHtml} />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
