'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, MessageSquare, Calendar, LogOut } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Builder', href: '/resumes/create', icon: FileText },
    { name: 'AI Chat Assistant', href: '/chat', icon: MessageSquare },
    { name: 'Expert Consultations', href: '/consultations/book', icon: Calendar },
  ];

  return (
    <nav className="bg-[#0B1120] text-slate-300 w-72 min-h-screen flex flex-col fixed left-0 top-0 border-r border-slate-800 shadow-2xl z-50">
      <div className="p-8 mb-4">
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          Career<span className="text-blue-500">AI</span>
        </h1>
      </div>
      
      <div className="flex-1 px-4 space-y-2">
        <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-6 border-t border-slate-800/50">
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 px-4 py-3.5 w-full rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors text-slate-400 font-medium"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
}
