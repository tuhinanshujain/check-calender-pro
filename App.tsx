
import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Calendar } from './components/Calendar';
import { Report } from './components/Report';
import { History } from './components/History';
import { Settings } from './components/Settings';
import { HowTo } from './components/HowTo';
import { Header, BottomNav } from './components/Navigation';
import { Calendar as CalendarType, ViewType } from './types';
import { Icons } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ViewType>('Home');
  const [calendars, setCalendars] = useState<CalendarType[]>([]);
  const [activeCalendarId, setActiveCalendarId] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedCals = localStorage.getItem('app_calendars');
    
    if (savedToken) {
      setAuthToken(savedToken);
      setIsAuthenticated(true);
      if (savedCals) {
        const parsed = JSON.parse(savedCals);
        setCalendars(parsed);
        if (parsed.length > 0) setActiveCalendarId(parsed[0].id);
      } else {
        // Sample data for demo
        const sample: CalendarType = {
          id: 'sample-1',
          name: 'Exercise',
          color: '#3b82f6',
          checks: [new Date().toISOString().split('T')[0]],
          createdAt: new Date().toISOString()
        };
        setCalendars([sample]);
        setActiveCalendarId(sample.id);
      }
    }
  }, []);

  useEffect(() => {
    if (calendars.length > 0) {
      localStorage.setItem('app_calendars', JSON.stringify(calendars));
    }
  }, [calendars]);

  const handleLogin = (token: string, email: string) => {
    localStorage.setItem('auth_token', token);
    setAuthToken(token);
    setIsAuthenticated(true);
  };

  const handleToggleDate = (dateIso: string) => {
    if (!activeCalendarId) return;
    setCalendars(prev => prev.map(cal => {
      if (cal.id === activeCalendarId) {
        const isAlreadyChecked = cal.checks.includes(dateIso);
        const newChecks = isAlreadyChecked 
          ? cal.checks.filter(d => d !== dateIso)
          : [...cal.checks, dateIso];
        return { ...cal, checks: newChecks };
      }
      return cal;
    }));
  };

  const confirmAddCalendar = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (newHabitName.trim()) {
      const newCal: CalendarType = {
        id: Math.random().toString(36).substr(2, 9),
        name: newHabitName.trim(),
        color: '#3b82f6',
        checks: [],
        createdAt: new Date().toISOString(),
      };
      setCalendars([...calendars, newCal]);
      setActiveCalendarId(newCal.id);
      setNewHabitName('');
      setIsAddModalOpen(false);
    }
  };

  const activeCalendar = calendars.find(c => c.id === activeCalendarId) || calendars[0];

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="max-w-md mx-auto bg-slate-50 min-h-screen pb-24 relative shadow-2xl shadow-slate-300">
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="w-full bg-white rounded-[2.5rem] p-8 shadow-2xl animate-pop border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-2">New Activity</h2>
            <p className="text-slate-400 text-sm font-bold mb-6">What would you like to track?</p>
            <form onSubmit={confirmAddCalendar}>
              <input 
                autoFocus
                type="text"
                placeholder="E.g. Meditation, Gym, Coding..."
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none mb-8 text-slate-900 font-bold"
              />
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" disabled={!newHabitName.trim()} className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-colors">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeView !== 'History' && activeView !== 'Settings' && activeView !== 'HowTo' && (
        <Header calendars={calendars} activeCalendarId={activeCalendarId} onSelectCalendar={setActiveCalendarId} onAddCalendar={() => setIsAddModalOpen(true)} />
      )}
      
      <main className="min-h-screen">
        {activeView === 'Home' && activeCalendar && <Calendar activeCalendar={activeCalendar} onToggleDate={handleToggleDate} onAddCalendar={() => setIsAddModalOpen(true)} />}
        {activeView === 'Home' && !activeCalendar && (
          <div className="flex flex-col items-center justify-center h-[80vh] px-8 text-center">
            <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 mb-6 shadow-sm"><Icons.Plus className="w-12 h-12"/></div>
            <h2 className="text-2xl font-black text-slate-900">Start your first streak</h2>
            <p className="text-slate-400 mt-2 font-semibold">Track anything you want to make into a permanent habit.</p>
            <button onClick={() => setIsAddModalOpen(true)} className="mt-10 px-10 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all">Add New Activity</button>
          </div>
        )}
        {activeView === 'Report' && activeCalendar && <Report activeCalendar={activeCalendar} />}
        {activeView === 'History' && <History calendars={calendars} />}
        {activeView === 'Settings' && <Settings />}
        {activeView === 'HowTo' && <HowTo />}
      </main>

      <BottomNav activeView={activeView} onViewChange={setActiveView} />
    </div>
  );
};

export default App;
