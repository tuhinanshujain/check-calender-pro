
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import { Calendar as CalendarType } from '../types';
import { getHabitInsights } from '../services/geminiService';

interface CalendarProps {
  activeCalendar: CalendarType;
  onToggleDate: (date: string) => void;
  onAddCalendar: () => void;
}

export const Calendar: React.FC<CalendarProps> = ({ activeCalendar, onToggleDate, onAddCalendar }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isChecked = (day: number) => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const iso = d.toISOString().split('T')[0];
    return activeCalendar.checks.includes(iso);
  };

  const handleToggle = (day: number) => {
    // Subtle haptic feedback for touch devices
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const iso = d.toISOString().split('T')[0];
    onToggleDate(iso);
  };

  const getInsight = async () => {
    setIsAiLoading(true);
    const insight = await getHabitInsights(activeCalendar.name, activeCalendar.checks);
    setAiInsight(insight || "You're doing great!");
    setIsAiLoading(false);
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-4 space-y-6 relative pb-24">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{activeCalendar.name}</h2>
            <p className="text-slate-500 font-medium">Total: {activeCalendar.checks.length} checks</p>
          </div>
          <button 
            onClick={getInsight}
            disabled={isAiLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${isAiLoading ? 'bg-slate-100 text-slate-400' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
          >
            <Icons.Sparkles className="w-4 h-4" />
            {isAiLoading ? 'Thinking...' : 'AI Insight'}
          </button>
        </div>
        {aiInsight && (
          <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100 animate-fade-in">
            <p className="text-indigo-800 text-sm leading-relaxed italic">
              "{aiInsight}"
            </p>
          </div>
        )}
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Month Selector */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
          <h3 className="text-lg font-bold text-slate-800">{monthName} {year}</h3>
          <div className="flex gap-1">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <Icons.ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <Icons.ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdays.map(day => (
              <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {/* Padding for start of month */}
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`pad-${i}`} className="aspect-square" />
            ))}
            
            {/* Days of month */}
            {Array.from({ length: daysInMonth(year, currentDate.getMonth()) }).map((_, i) => {
              const day = i + 1;
              const checked = isChecked(day);
              return (
                <button
                  key={day}
                  onClick={() => handleToggle(day)}
                  className={`
                    aspect-square rounded-2xl flex items-center justify-center relative transition-all active:scale-95 duration-200
                    ${checked 
                      ? 'bg-green-500 text-white shadow-lg shadow-green-100' 
                      : 'hover:bg-slate-50 text-slate-700 font-medium'
                    }
                  `}
                >
                  <span className={checked ? 'hidden' : 'text-sm'}>{day}</span>
                  {checked && <Icons.Check className="w-6 h-6 animate-pop" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Visual Streak Card */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-3xl p-5 border border-blue-100">
          <p className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-1">Consistency</p>
          <p className="text-2xl font-bold text-blue-900">84%</p>
        </div>
        <div className="bg-orange-50 rounded-3xl p-5 border border-orange-100">
          <p className="text-orange-600 text-xs font-bold uppercase tracking-widest mb-1">Best Streak</p>
          <p className="text-2xl font-bold text-orange-900">12 Days</p>
        </div>
      </div>

      {/* Prominent Floating Action Button */}
      <button 
        onClick={onAddCalendar}
        className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-2xl shadow-blue-300 flex items-center justify-center active:scale-90 transition-all z-50 border-4 border-white"
      >
        <Icons.Plus className="w-8 h-8" />
      </button>
    </div>
  );
};
