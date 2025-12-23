
import React from 'react';
import { Calendar as CalendarType } from '../types';
import { Icons } from '../constants';

interface ReportProps {
  activeCalendar: CalendarType;
}

export const Report: React.FC<ReportProps> = ({ activeCalendar }) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Helper to count checks in a specific period
  const countInPeriod = (filterFn: (d: Date) => boolean) => {
    return activeCalendar.checks.filter(dateStr => {
      const d = new Date(dateStr);
      return filterFn(d);
    }).length;
  };

  const totalChecks = activeCalendar.checks.length;
  const checksThisYear = countInPeriod(d => d.getFullYear() === currentYear);
  const checksThisMonth = countInPeriod(d => d.getFullYear() === currentYear && d.getMonth() === currentMonth);
  const checksLastMonth = countInPeriod(d => {
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const year = currentMonth === 0 ? currentYear - 1 : currentYear;
    return d.getFullYear() === year && d.getMonth() === lastMonth;
  });

  // Mock data for the chart (last 7 days)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('default', { month: 'short', day: 'numeric' });
    const checked = activeCalendar.checks.includes(iso);
    return { label, checked, value: checked ? 1 : 0 };
  });

  return (
    <div className="p-4 space-y-6 animate-fade-in pb-10">
      {/* Report Header */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Activity Report</h1>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900">Total: {totalChecks}</h2>
          </div>
        </div>
        <div className="relative">
          <select className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-10 text-sm font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Year</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icons.ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="h-48 w-full flex items-end justify-between gap-2 relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className="border-t border-slate-50 w-full h-px"></div>
            <div className="border-t border-slate-50 w-full h-px"></div>
            <div className="border-t border-slate-100 w-full h-px"></div>
          </div>
          
          {/* Bars/Dots */}
          {last7Days.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-3 z-10">
              <div className="relative w-full flex justify-center items-end h-32">
                 <div 
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${day.checked ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-200'}`}
                  style={{ marginBottom: day.checked ? '80%' : '0%' }}
                />
                {/* Connecting lines - visual only */}
                {i < last7Days.length - 1 && (
                  <div className="absolute left-1/2 w-full border-t border-dashed border-slate-200 -z-10" style={{ bottom: '4px' }} />
                )}
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">{day.label.split(' ')[0]} {day.label.split(' ')[1]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Total" value={totalChecks} color="slate" />
        <StatCard label="This Year" value={checksThisYear} color="blue" />
        <StatCard label="This Month" value={checksThisMonth} color="green" />
        <StatCard label="Last Month" value={checksLastMonth} color="orange" />
      </div>

      {/* Insight Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Icons.Sparkles className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold">Progress Summary</h3>
        </div>
        <p className="text-blue-50 text-sm leading-relaxed">
          Your consistency for <b>{activeCalendar.name}</b> is improving! You've checked in <b>{checksThisMonth}</b> times this month. Keep this momentum to hit your next milestone.
        </p>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => {
  const colors: Record<string, string> = {
    slate: "bg-slate-50 text-slate-900 border-slate-100",
    blue: "bg-blue-50 text-blue-900 border-blue-100",
    green: "bg-green-50 text-green-900 border-green-100",
    orange: "bg-orange-50 text-orange-900 border-orange-100",
  };

  return (
    <div className={`rounded-3xl p-6 border shadow-sm transition-transform active:scale-95 ${colors[color]}`}>
      <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">{label}</p>
      <p className="text-4xl font-black">{value}</p>
    </div>
  );
};
