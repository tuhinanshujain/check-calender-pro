
import React, { useState } from 'react';
import { Icons } from '../constants';

type SubPage = 'Premium' | 'Language' | 'Theme' | 'WeekStart' | 'CheckColor' | 'Privacy' | 'Terms' | null;

interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
  hasArrow?: boolean;
  isDestructive?: boolean;
  description?: string;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (val: boolean) => void;
  onClick?: () => void;
}

const SettingRow: React.FC<SettingRowProps> = ({ 
  icon, label, value, hasArrow = true, isDestructive = false, 
  description, toggle = false, toggleValue = false, onToggle, onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className={`flex flex-col py-3 px-4 active:bg-slate-50 transition-colors cursor-pointer ${onClick || toggle ? '' : 'pointer-events-none'}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`${isDestructive ? 'text-red-500' : 'text-slate-600'}`}>
            {icon}
          </div>
          <span className={`text-sm font-medium ${isDestructive ? 'text-red-500' : 'text-slate-800'}`}>
            {label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {value && !toggle && <span className="text-xs font-medium text-slate-400">{value}</span>}
          {toggle ? (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggle?.(!toggleValue);
              }}
              className={`w-10 h-6 rounded-full transition-colors relative ${toggleValue ? 'bg-blue-500' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${toggleValue ? 'left-5' : 'left-1'}`} />
            </button>
          ) : (
            hasArrow && <Icons.ChevronRight className="w-4 h-4 text-slate-300" />
          )}
        </div>
      </div>
      {description && (
        <p className="text-[10px] text-slate-400 mt-1 ml-9 leading-tight">{description}</p>
      )}
    </div>
  );
};

const Group = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-4 ${className}`}>
    <div className="divide-y divide-slate-50">
      {children}
    </div>
  </div>
);

export const Settings: React.FC = () => {
  const [activeSubPage, setActiveSubPage] = useState<SubPage>(null);
  const [language, setLanguage] = useState('English');
  const [theme, setTheme] = useState('Auto');
  const [weekStart, setWeekStart] = useState('Sunday');
  const [checkColor, setCheckColor] = useState('Basil');
  const [toggles, setToggles] = useState({
    displayCount: true,
    vibration: true,
    doubleTap: false,
    confirmation: false,
    keepAwake: false,
    tabNav: true,
    notifications: false,
    biometrics: false,
  });

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const SelectionList = ({ items, current, onSelect }: { items: string[] | {label: string, icon?: React.ReactNode}[], current: string, onSelect: (val: string) => void }) => (
    <Group className="mt-4">
      {items.map((item) => {
        const label = typeof item === 'string' ? item : item.label;
        const icon = typeof item === 'string' ? null : item.icon;
        return (
          <div 
            key={label}
            onClick={() => { onSelect(label); setActiveSubPage(null); }}
            className="flex items-center justify-between py-4 px-6 active:bg-slate-50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {icon}
              <span className={`text-sm ${current === label ? 'text-slate-900 font-bold' : 'text-slate-600 font-medium'}`}>{label}</span>
            </div>
            {current === label && <Icons.Check className="w-5 h-5 text-blue-500 stroke-[3px]" />}
          </div>
        );
      })}
    </Group>
  );

  const LegalPage = ({ title, content }: { title: string, content: string }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm animate-fade-in">
      <h2 className="text-xl font-bold text-slate-900 mb-6">{title}</h2>
      <div className="prose prose-slate prose-sm max-w-none text-slate-600 space-y-4 whitespace-pre-wrap leading-relaxed">
        {content}
      </div>
    </div>
  );

  const renderSubPage = () => {
    switch (activeSubPage) {
      case 'Premium':
        return (
          <div className="animate-fade-in px-4 pb-10">
            <div className="flex flex-col items-center text-center mt-6 mb-8">
              <img 
                src="https://ouch-cdn2.icons8.com/Psh5n6gC0yv3p-wX5u9kI9R2A9R2A9R2A9R2A9R2A9R2A9R2A.png" 
                alt="Premium Illustration" 
                className="w-48 mb-6"
              />
              <h2 className="text-lg font-bold text-slate-800 leading-tight px-6">
                Unlimited use of the app with a one-time purchase, permanent license
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-100/50 border border-slate-200 rounded-2xl p-6 text-center">
                <p className="text-lg font-bold text-slate-800">Free</p>
                <p className="text-xs text-slate-500 mt-1">1 Week Free</p>
                <p className="text-sm font-bold text-slate-800 mt-4">Current Plan</p>
              </div>
              <div className="bg-blue-50 border-2 border-blue-500 rounded-2xl p-6 text-center shadow-lg shadow-blue-100">
                <p className="text-lg font-bold text-slate-800">Premium</p>
                <p className="text-xs text-slate-500 mt-1">Unlimited</p>
                <p className="text-2xl font-black text-blue-600 mt-4">₹400.00</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1">Pay Once</p>
              </div>
            </div>

            <div className="space-y-3 px-6 mb-10">
              {[
                "Unlimited App Use",
                "Automatic Backup & Restore",
                "No Ads",
                "CSV Export"
              ].map(feat => (
                <div key={feat} className="flex items-center gap-3">
                  <Icons.Check className="w-4 h-4 text-blue-500 stroke-[3px]" />
                  <span className="text-sm font-semibold text-slate-700">{feat}</span>
                </div>
              ))}
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 mb-4">
              Purchase Premium Version
            </button>
            <button className="w-full text-blue-600 text-sm font-bold hover:underline">
              Restore Purchase
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-6 px-4">
              Payments will be charged to your store account. Subscription terms apply.
            </p>
          </div>
        );
      case 'Language':
        return (
          <SelectionList 
            items={['English', '日本語', 'Português', 'Deutsch', 'Español', 'Français', 'Italiano', 'Nederlands', 'Svenska', 'हिन्दी', '简体中文', '繁體中文', '한국어']} 
            current={language} 
            onSelect={setLanguage} 
          />
        );
      case 'Theme':
        return (
          <SelectionList 
            items={['Auto', 'Dark', 'Light']} 
            current={theme} 
            onSelect={setTheme} 
          />
        );
      case 'WeekStart':
        return (
          <SelectionList 
            items={['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']} 
            current={weekStart} 
            onSelect={setWeekStart} 
          />
        );
      case 'CheckColor':
        return (
          <SelectionList 
            items={[
              { label: 'Basil', icon: <div className="w-5 h-5 bg-green-500 rounded-md" /> },
              { label: 'Banana', icon: <div className="w-5 h-5 bg-yellow-400 rounded-md" /> },
              { label: 'Tomato', icon: <div className="w-5 h-5 bg-red-500 rounded-md" /> },
              { label: 'Blueberry', icon: <div className="w-5 h-5 bg-blue-500 rounded-md" /> },
              { label: 'Cassis', icon: <div className="w-5 h-5 bg-purple-600 rounded-md" /> },
              { label: 'Flamingo', icon: <div className="w-5 h-5 bg-orange-300 rounded-md" /> },
              { label: 'Stone', icon: <div className="w-5 h-5 bg-slate-300 rounded-md" /> },
              { label: 'Graphite', icon: <div className="w-5 h-5 bg-slate-600 rounded-md" /> }
            ]} 
            current={checkColor} 
            onSelect={setCheckColor} 
          />
        );
      case 'Privacy':
        return <LegalPage title="Privacy Policy" content={`Your privacy is important to us. It is CheckCalendar's policy to respect your privacy regarding any information we may collect from you through our app.

1. Information we collect
We only collect information about you if we have a reason to do so—for example, to provide our services, to communicate with you, or to make our services better.

2. Data Storage
All habit data is stored locally on your device unless you choose to use our Backup & Restore feature.

3. Third-party services
We may use third-party services that collect information used to identify you.

Last updated: May 2024`} />;
      case 'Terms':
        return <LegalPage title="Terms of Service" content={`By accessing CheckCalendar, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.

1. Use License
Permission is granted to temporarily download one copy of the materials (information or software) on CheckCalendar's app for personal, non-commercial transitory viewing only.

2. Disclaimer
The materials on CheckCalendar's app are provided on an 'as is' basis. CheckCalendar makes no warranties, expressed or implied.

3. Premium Version
The Premium Version is a one-time purchase that grants access to advanced features. It is tied to your store account.`} />;
      default:
        return (
          <div className="animate-fade-in">
            {/* Trial Banner */}
            <button className="w-full bg-white rounded-2xl py-4 px-6 flex items-center justify-between border border-slate-100 mb-6 shadow-sm active:scale-[0.98] transition-transform">
              <span className="text-sm font-bold text-slate-800">In Free Trial (7 days remaining)</span>
              <Icons.ChevronRight className="w-4 h-4 text-slate-300" />
            </button>

            {/* Premium Group */}
            <Group>
              <SettingRow 
                icon={<Icons.Star className="w-5 h-5 text-blue-500 fill-blue-500" />} 
                label="Purchase Premium Version" 
                onClick={() => setActiveSubPage('Premium')} 
              />
              <SettingRow 
                icon={<Icons.RefreshCw className="w-5 h-5" />} 
                label="Backup & Restore" 
                description="Automatically backup data and restore it anytime"
                onClick={() => {}} 
              />
              <SettingRow 
                icon={<Icons.FileText className="w-5 h-5" />} 
                label="Export All Calendars as CSV" 
                onClick={() => {}} 
              />
            </Group>

            {/* App Settings Group */}
            <Group>
              <SettingRow 
                icon={<Icons.Globe className="w-5 h-5" />} 
                label="Language" 
                value={language}
                onClick={() => setActiveSubPage('Language')} 
              />
              <SettingRow 
                icon={<Icons.Droplet className="w-5 h-5" />} 
                label="Theme" 
                value={theme}
                onClick={() => setActiveSubPage('Theme')} 
              />
              <SettingRow 
                icon={<Icons.History className="w-5 h-5" />} 
                label="Week starts on" 
                value={weekStart}
                onClick={() => setActiveSubPage('WeekStart')} 
              />
              <SettingRow 
                icon={<Icons.Bell className="w-5 h-5" />} 
                label="Notification" 
                toggle
                toggleValue={toggles.notifications}
                onToggle={() => handleToggle('notifications')}
              />
              <SettingRow 
                icon={<Icons.Lock className="w-5 h-5" />} 
                label="Biometric authentication" 
                toggle
                toggleValue={toggles.biometrics}
                onToggle={() => handleToggle('biometrics')}
              />
              <SettingRow 
                icon={<Icons.Info className="w-5 h-5" />} 
                label="Display Count on Tab" 
                toggle
                toggleValue={toggles.displayCount}
                onToggle={() => handleToggle('displayCount')}
              />
              <SettingRow 
                icon={<Icons.Smartphone className="w-5 h-5" />} 
                label="Check Vibration" 
                toggle
                toggleValue={toggles.vibration}
                onToggle={() => handleToggle('vibration')}
              />
            </Group>

            {/* Customization Group */}
            <div className="space-y-1 mb-4">
              <Group className="mb-0">
                <SettingRow 
                  icon={<Icons.Palette className="w-5 h-5" />} 
                  label="Check Color" 
                  value={<div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">{checkColor}</span>
                    <Icons.Check className="w-4 h-4 text-green-500 stroke-[3px]" />
                  </div> as any}
                  onClick={() => setActiveSubPage('CheckColor')} 
                />
              </Group>
              <p className="text-[10px] text-slate-400 px-4 font-medium">You can set the default color for checks.</p>
            </div>

            {/* Additional Settings Toggles */}
            <div className="space-y-1 mb-4">
              <Group className="mb-0">
                <SettingRow 
                  icon={<Icons.Zap className="w-5 h-5" />} 
                  label="Double Tap to Check" 
                  toggle
                  toggleValue={toggles.doubleTap}
                  onToggle={() => handleToggle('doubleTap')}
                />
              </Group>
              <p className="text-[10px] text-slate-400 px-4 font-medium">Require a double tap instead of a single tap to check.</p>
            </div>

            <div className="space-y-1 mb-4">
              <Group className="mb-0">
                <SettingRow 
                  icon={<Icons.AlertCircle className="w-5 h-5" />} 
                  label="Check Confirmation" 
                  toggle
                  toggleValue={toggles.confirmation}
                  onToggle={() => handleToggle('confirmation')}
                />
              </Group>
              <p className="text-[10px] text-slate-400 px-4 font-medium">You can display a confirmation message when checking to prevent mistaps.</p>
            </div>

            {/* Legal & Compliance Group (Store Mandated) */}
            <Group>
              <SettingRow 
                icon={<Icons.Lock className="w-5 h-5" />} 
                label="Privacy Policy" 
                onClick={() => setActiveSubPage('Privacy')} 
              />
              <SettingRow 
                icon={<Icons.FileText className="w-5 h-5" />} 
                label="Terms of Service" 
                onClick={() => setActiveSubPage('Terms')} 
              />
              <SettingRow 
                icon={<Icons.MessageCircle className="w-5 h-5" />} 
                label="Send feedback" 
                onClick={() => {}} 
              />
            </Group>

            {/* App Info Group */}
            <Group>
              <SettingRow 
                icon={<Icons.Info className="w-5 h-5" />} 
                label="Version" 
                value="13.44.0"
                hasArrow={false}
              />
            </Group>

            {/* Destructive Actions (Store Mandated for Account Deletion) */}
            <Group>
              <SettingRow 
                icon={<Icons.Trash className="w-5 h-5" />} 
                label="Initialize Data" 
                isDestructive
                hasArrow={false}
                onClick={() => {
                  if(confirm("Are you sure you want to initialize all data? This action cannot be undone.")) {
                    alert("Data initialized.");
                  }
                }} 
              />
              <SettingRow 
                icon={<Icons.SwitchVertical className="w-5 h-5" />} 
                label="Log Out" 
                hasArrow={false}
                onClick={() => {
                   if(confirm("Are you sure you want to log out?")) {
                      // This clears the token and forces the app to reload
                      // enabling the Login screen to appear again.
                      localStorage.removeItem('auth_token');
                      window.location.reload(); 
                   }
                }} 
              />
              <SettingRow 
                icon={<Icons.Trash className="w-5 h-5" />} 
                label="Delete Account" 
                description="Required to provide if account creation is supported"
                isDestructive
                hasArrow={false}
                onClick={() => {
                  if(confirm("Permanently delete your account and all associated data? This is required by App Store policy and cannot be reversed.")) {
                    window.location.reload();
                  }
                }} 
              />
            </Group>
          </div>
        );
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 overflow-x-hidden">
      {/* Dynamic Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md z-40 px-4 py-4 border-b border-slate-100 flex items-center gap-4">
        {activeSubPage && (
          <button 
            onClick={() => setActiveSubPage(null)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Icons.ChevronLeft className="w-5 h-5 text-slate-800" />
          </button>
        )}
        <h1 className="text-xl font-bold text-slate-900">
          {activeSubPage === 'Premium' ? 'Purchase Premium Version' :
           activeSubPage === 'Language' ? 'Language' :
           activeSubPage === 'Theme' ? 'Theme' :
           activeSubPage === 'WeekStart' ? 'Week starts on' :
           activeSubPage === 'CheckColor' ? 'Check Color' : 
           activeSubPage === 'Privacy' ? 'Privacy Policy' :
           activeSubPage === 'Terms' ? 'Terms of Service' : 'Settings'}
        </h1>
      </div>

      <div className="p-4">
        {renderSubPage()}
      </div>
    </div>
  );
};
