
import React from 'react';
import { Icons } from '../constants';

export const HowTo: React.FC = () => {
  return (
    <div className="bg-white min-h-screen pb-20 animate-fade-in">
      <div className="sticky top-0 bg-white/90 backdrop-blur-md z-40 px-6 py-4 border-b border-slate-100">
        <h1 className="text-xl font-bold text-slate-900">How to</h1>
      </div>

      <div className="p-6 space-y-16">
        {/* Short Note Section */}
        <section className="text-center space-y-6">
          <div className="flex justify-center items-end gap-1 mb-8">
            <div className="flex flex-col items-center border-l border-slate-100 px-6">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 w-6 h-6 rounded-full flex items-center justify-center mb-4">5</span>
              <Icons.Check className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex flex-col items-center border-l border-slate-100 px-6">
              <span className="text-xs font-bold text-slate-400 mb-2">6</span>
              <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded mb-4">Workout</span>
            </div>
            <div className="flex flex-col items-center border-l border-r border-slate-100 px-6">
              <span className="text-xs font-bold text-slate-400 mb-4">7</span>
              <Icons.Check className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-800">Short Note</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Long press on a date to insert a short note.
            </p>
          </div>
        </section>

        {/* Change Emoji Section */}
        <section className="text-center space-y-6">
          <div className="inline-grid grid-cols-5 border border-slate-100 rounded-lg overflow-hidden divide-x divide-y divide-slate-100">
            {[7, 8, 9, 10, 11, 14, 15, 16, 17, 18].map((day, i) => (
              <div key={day} className="w-12 h-16 flex flex-col items-center justify-center p-2">
                <span className="text-[10px] text-slate-400 font-bold mb-2">{day}</span>
                <span className="text-xl">
                  {i === 0 && <span className="text-red-500 font-bold text-lg">○</span>}
                  {i === 1 && <span className="text-red-500 font-bold text-lg">✕</span>}
                  {i === 2 && '➡️'}
                  {i === 3 && '☀️'}
                  {i === 4 && '🌧️'}
                  {i === 5 && '👍'}
                  {i === 6 && '👎'}
                  {i === 7 && '👉'}
                  {i === 8 && '⭐'}
                  {i === 9 && '😊'}
                </span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-800">Change Emoji for Each Day</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Long press on a date to change it to an emoji of your choice.
            </p>
          </div>
        </section>

        {/* Add Note Section */}
        <section className="text-center space-y-6">
          <div className="inline-block bg-slate-50 border border-slate-100 rounded-lg p-6 text-left w-64 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Notes</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <span>🏋️</span> Workout
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <span>📚</span> Study
              </div>
              <div className="w-[2px] h-4 bg-blue-500 animate-pulse ml-1" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-800">Add Note</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Long press on a date to add a note.
            </p>
          </div>
        </section>

        {/* Reorder Tabs Section */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
            <div className="bg-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold text-slate-800 shadow-sm border border-slate-100">
              💪 Workout
            </div>
            <div className="px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold text-slate-400">
              📕 Study
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-800">Reorder Tabs</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Long press to freely reorder tabs.
            </p>
          </div>
        </section>

        {/* Return Home Section */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center justify-center p-6 bg-blue-50 rounded-full">
            <Icons.Home className="w-16 h-16 text-blue-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-800 px-6">Quickly display this month's calendar</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed px-10">
              When viewing the calendar for a month other than the current month, tap the Home button in the footer to quickly return to this month's calendar.
            </p>
          </div>
        </section>

        {/* Delete Section */}
        <section className="text-center space-y-6">
          <div className="flex justify-center gap-1.5 py-4">
            <div className="w-2.5 h-2.5 bg-slate-300 rounded-full" />
            <div className="w-2.5 h-2.5 bg-slate-300 rounded-full" />
            <div className="w-2.5 h-2.5 bg-slate-300 rounded-full" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-800">Delete Calendar</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed px-10">
              Tap the dot icon in the upper right of the home to display a popup where you can delete the calendar of a specific tab.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
