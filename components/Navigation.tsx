
import React from 'react';
import { Icons } from '../constants';
import { ViewType, Calendar as CalendarType } from '../types';

interface BottomNavProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeView, onViewChange }) => {
  const tabs: { id: ViewType; icon: React.ReactNode; label: string }[] = [
    { id: 'Home', icon: <Icons.Home className="w-6 h-6" />, label: 'Home' },
    { id: 'Report', icon: <Icons.Report className="w-6 h-6" />, label: 'Report' },
    { id: 'History', icon: <Icons.History className="w-6 h-6" />, label: 'History' },
    { id: 'HowTo', icon: <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center font-bold text-xs">?</div>, label: 'How to' },
    { id: 'Settings', icon: <Icons.Settings className="w-6 h-6" />, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-2 flex justify-between items-center z-50 pb-safe">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onViewChange(tab.id)}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all ${
            activeView === tab.id ? 'text-blue-600 bg-blue-50' : 'text-slate-400'
          }`}
        >
          {tab.icon}
          <span className="text-[10px] font-bold mt-1 uppercase">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

interface HeaderProps {
  calendars: CalendarType[];
  activeCalendarId: string;
  onSelectCalendar: (id: string) => void;
  onAddCalendar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ calendars, activeCalendarId, onSelectCalendar, onAddCalendar }) => {
  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-xl z-40 px-4 py-4 border-b border-slate-100 flex items-center gap-3 no-scrollbar overflow-x-auto">
      <div className="flex items-center gap-2 whitespace-nowrap">
        {calendars.map(cal => (
          <button
            key={cal.id}
            onClick={() => onSelectCalendar(cal.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeCalendarId === cal.id 
              ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cal.name}
            <span className="ml-2 opacity-60 font-medium">{cal.checks.length}</span>
          </button>
        ))}
        <button 
          onClick={onAddCalendar}
          className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 active:scale-95"
        >
          <Icons.Plus className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
