
import React, { useState } from 'react';
import { Calendar as CalendarType } from '../types';
import { Icons } from '../constants';

interface HistoryProps {
  calendars: CalendarType[];
}

type HistoryTab = 'Check' | 'Short Note' | 'Note';

export const History: React.FC<HistoryProps> = ({ calendars }) => {
  const [activeTab, setActiveTab] = useState<HistoryTab>('Check');
  const [searchQuery, setSearchQuery] = useState('');

  // Generate history items from all calendars
  const historyItems = calendars.flatMap(cal => 
    cal.checks.map(dateStr => {
      const checkDate = new Date(dateStr);
      // Mocking the creation time based on the check date for variety
      const createdAt = new Date(checkDate.getTime() + 47811000); // add some offset
      return {
        id: `${cal.id}-${dateStr}`,
        calendarName: cal.name,
        checkDate: dateStr,
        createdAt: createdAt.toISOString(),
        type: 'Check'
      };
    })
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredItems = historyItems.filter(item => 
    item.calendarName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.checkDate.includes(searchQuery)
  );

  const formatDateLabel = (iso: string) => {
    const d = new Date(iso);
    const day = d.toLocaleDateString('en-US', { weekday: 'short' });
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    const date = d.getDate();
    const time = d.toTimeString().split(' ')[0];
    return `${month} ${date} (${day}) ${time}`;
  };

  const formatCheckLabel = (iso: string) => {
    const d = new Date(iso);
    const day = d.toLocaleDateString('en-US', { weekday: 'short' });
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    const date = d.getDate();
    return `${month} ${date} (${day})`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-slate-50">
        <h1 className="text-xl font-bold text-slate-900">History</h1>
      </div>

      {/* Segmented Control */}
      <div className="px-4 py-3">
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          {(['Check', 'Short Note', 'Note'] as HistoryTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab 
                ? 'bg-blue-100 text-blue-700 shadow-sm' 
                : 'text-slate-500'
              }`}
            >
              {tab === 'Check' && <Icons.Check className="w-4 h-4" />}
              {tab === 'Short Note' && <Icons.Pencil className="w-4 h-4" />}
              {tab === 'Note' && <Icons.Note className="w-4 h-4" />}
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-2 flex items-center gap-3">
        <div className="flex-1 relative">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 border-none rounded-2xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
          />
        </div>
        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl">
          <Icons.Collection className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {activeTab === 'Check' ? (
          filteredItems.length > 0 ? (
            <div className="relative">
              {/* Vertical line for timeline */}
              <div className="absolute left-[11px] top-2 bottom-0 w-[2px] bg-slate-100" />
              
              <div className="space-y-8">
                {filteredItems.map((item, idx) => (
                  <div key={item.id} className="relative pl-8 flex justify-between items-start group">
                    {/* Timeline Dot */}
                    <div className="absolute left-0 top-[6px] w-6 h-6 bg-white flex items-center justify-center">
                       <div className="w-3 h-3 rounded-full bg-slate-900 border-2 border-white" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-slate-900">{formatDateLabel(item.createdAt)}</h3>
                      <p className="text-sm text-slate-600 font-medium">{item.calendarName}</p>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{formatCheckLabel(item.checkDate)}</p>
                      <div className="flex items-center gap-1.5 text-green-500">
                        <Icons.Check className="w-4 h-4 stroke-[3px]" />
                        <span className="text-sm font-bold">Checked</span>
                      </div>
                    </div>

                    <button className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                      <Icons.Trash className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <div className="w-48 h-48 bg-blue-50/50 rounded-full flex items-center justify-center mb-6">
                <img 
                  src="https://ouch-cdn2.icons8.com/6XyB9vO_z9I9sW_X9R2A9R2A9R2A9R2A9R2A9R2A9R2A.png" 
                  alt="Empty state" 
                  className="w-32 opacity-40 grayscale"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
                  }}
                />
              </div>
              <p className="text-slate-400 font-medium">No history found.</p>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <div className="w-48 h-48 bg-slate-50 rounded-full flex items-center justify-center mb-6">
               <Icons.Note className="w-16 h-16 text-slate-200" />
            </div>
            <p className="text-slate-400 font-medium">No {activeTab.toLowerCase()}s found.</p>
          </div>
        )}
      </div>
    </div>
  );
};
