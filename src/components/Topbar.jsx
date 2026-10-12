import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, Settings } from 'lucide-react';

export default function Topbar({ title = 'Boshqaruv paneli', search, setSearch }) {
  const { user } = useAuth();
  const userName = user?.username || user?.name || 'Ali Valiyev';
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2) || 'AV';

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
      {/* Title */}
      <h1 className="text-xl font-bold text-slate-900">{title}</h1>

      {/* Center Search & Right Controls */}
      <div className="flex items-center gap-6">
        {/* Search Input */}
        <div className="relative w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search || ''}
            onChange={(e) => setSearch && setSearch(e.target.value)}
            placeholder="Qidirish..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all font-medium"
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors relative cursor-pointer">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>
          <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
            <Settings className="w-4 h-4" />
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-200 text-slate-800 font-bold text-xs rounded-full flex items-center justify-center border border-slate-300">
            {initials}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-900 leading-tight">{userName}</div>
            <div className="text-[10px] text-slate-400 font-medium">Bosh administrator</div>
          </div>
        </div>
      </div>
    </header>
  );
}

