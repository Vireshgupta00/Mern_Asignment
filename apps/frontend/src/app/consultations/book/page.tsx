'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import DashboardLayout from '../../../components/DashboardLayout';
import { ArrowLeft, User, CreditCard, Clock, Star, Calendar } from 'lucide-react';

export default function BookConsultation() {
  const [consultants, setConsultants] = useState<any[]>([]);
  const [selectedConsultant, setSelectedConsultant] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Form State for Section 10 Requirements
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 11:00 AM');
  const [name, setName] = useState('Jane Doe');
  const [email, setEmail] = useState('jane@example.com');
  const [phone, setPhone] = useState('(555) 123-4567');
  const [agenda, setAgenda] = useState('I need help transitioning into a Senior MERN role.');

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const res = await api.get('/bookings/consultants');
        setConsultants(res.data);
        if (res.data.length > 0) setSelectedConsultant(res.data[0]._id);
      } catch (e) {
        console.error('Failed to fetch consultants', e);
      }
    };
    fetchConsultants();
  }, []);

  const handleBook = async () => {
    if (!selectedConsultant || !date || !name || !email) return alert('Please fill in all required fields.');
    setLoading(true);
    try {
      const res = await api.post('/bookings', {
        consultantId: selectedConsultant,
        date,
        timeSlot,
        name,
        email,
        phone,
        agenda
      });
      // The backend validates date/time, checks double bookings, creates the PENDING_PAYMENT state, 
      // and initiates a Stripe session securely (Section 11).
      if (res.data.stripeSessionUrl) window.location.href = res.data.stripeSessionUrl;
      else router.push('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to book consultation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-full transition bg-slate-200/50">
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Book an Expert</h1>
          <p className="text-slate-500 mt-1">Schedule a 1-on-1 session to accelerate your career.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Consultant Selection */}
        <div className="bg-white p-8 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100 h-fit">
          {consultants.length === 0 ? (
            <div className="p-6 bg-amber-50 text-amber-800 rounded-2xl border border-amber-200 flex items-center gap-3">
              <Clock className="animate-pulse" />
              <span className="font-semibold">Searching our network for available experts...</span>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-bold mb-4 text-slate-900 uppercase tracking-widest text-blue-600">Step 1: Select Expert</label>
              <div className="grid gap-4">
                {consultants.map(c => (
                  <label 
                    key={c._id} 
                    className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedConsultant === c._id ? 'border-blue-600 bg-blue-50/50 shadow-md shadow-blue-500/10' : 'border-slate-100 hover:border-slate-300 bg-white'}`}
                  >
                    <input type="radio" name="consultant" value={c._id} checked={selectedConsultant === c._id} onChange={(e) => setSelectedConsultant(e.target.value)} className="mt-1.5 w-4 h-4 text-blue-600 focus:ring-blue-500" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            {c.name}
                            <span className="flex items-center text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full"><Star size={12} className="mr-1 fill-amber-500" /> Top Rated</span>
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {c.expertise.map((skill: string) => (
                              <span key={skill} className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{skill}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-slate-900">${c.hourlyRate}</span>
                          <span className="text-slate-500 text-sm">/hr</span>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Section 10 Form Requirements */}
        <div className="bg-white p-8 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100">
           <label className="block text-sm font-bold mb-6 text-slate-900 uppercase tracking-widest text-blue-600">Step 2: Meeting Details</label>
           
           <div className="space-y-4 mb-8">
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Date</label>
                  <input type="date" required className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Time Slot</label>
                  <select className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={timeSlot} onChange={e => setTimeSlot(e.target.value)}>
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                    <option value="1:00 PM - 2:00 PM">1:00 PM - 2:00 PM</option>
                    <option value="3:00 PM - 4:00 PM">3:00 PM - 4:00 PM</option>
                  </select>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <input type="text" required className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={name} onChange={e => setName(e.target.value)} />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <input type="email" required className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={email} onChange={e => setEmail(e.target.value)} />
               </div>
             </div>

             <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                <input type="tel" required className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={phone} onChange={e => setPhone(e.target.value)} />
             </div>

             <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Meeting Agenda</label>
                <textarea required rows={3} className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="What would you like to discuss?" value={agenda} onChange={e => setAgenda(e.target.value)} />
             </div>
           </div>

           <button 
              onClick={handleBook}
              disabled={loading || !selectedConsultant}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20"
            >
              <CreditCard size={24} />
              {loading ? 'Initializing Secure Checkout...' : 'Confirm & Proceed to Payment'}
            </button>
            <p className="text-center text-xs text-slate-400 mt-4">Payment handled securely via Stripe. Calendar invites sent upon confirmation.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
