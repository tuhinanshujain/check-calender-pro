
import React, { useState, useEffect } from 'react';

interface AuthProps {
  onLogin: (token: string, email: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'ID' | 'OTP'>('ID');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{message: string, isNetwork: boolean} | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const API_BASE = isLocal ? 'http://localhost:3001' : '';

  useEffect(() => {
    let interval: number;
    if (resendTimer > 0) {
      interval = window.setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(`${API_BASE}/api/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Server Error");
      }

      setStep('OTP');
      setResendTimer(60);
    } catch (err: any) {
      console.error('[Auth] Error:', err);
      const isNetwork = err.name === 'TypeError' || err.name === 'AbortError';
      setError({
        message: isNetwork 
          ? "Cannot connect to the backend server. Make sure your local Node.js server is running on port 3001." 
          : err.message,
        isNetwork
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Invalid code.');
      }

      onLogin(data.token, data.email);
    } catch (err: any) {
      setError({ message: err.message || "Verification failed.", isNetwork: false });
    } finally {
      setLoading(false);
    }
  };

  const enterDemoMode = () => {
    onLogin('demo-token', email || 'demo@example.com');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 transition-all">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl mb-6 text-white shadow-xl shadow-blue-200">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">CheckCalendar</h1>
          <p className="text-slate-400 mt-2 font-semibold">
            {step === 'ID' ? 'Sign in to your account' : 'Check your inbox'}
          </p>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-red-50 border border-red-100 rounded-3xl animate-fade-in">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 text-sm font-bold leading-snug">{error.message}</p>
            </div>
            {error.isNetwork && (
              <button 
                onClick={enterDemoMode}
                className="mt-4 w-full py-2 bg-white text-slate-900 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-colors"
              >
                Skip to Demo Mode
              </button>
            )}
          </div>
        )}

        {step === 'ID' ? (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-900 font-medium text-lg"
                placeholder="name@example.com"
                required
                disabled={loading}
              />
            </div>
            <button
              disabled={loading}
              type="submit"
              className="w-full py-5 bg-slate-900 text-white font-black text-lg rounded-3xl transition-all shadow-xl hover:shadow-slate-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading && <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? 'Connecting...' : 'Continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Verification Code</label>
              <input
                type="text"
                maxLength={6}
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full px-6 py-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-center text-4xl font-black tracking-[0.5em] text-blue-600"
                placeholder="000000"
                required
                disabled={loading}
              />
            </div>
            <button
              disabled={loading}
              type="submit"
              className="w-full py-5 bg-blue-600 text-white font-black text-lg rounded-3xl transition-all shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loading && <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep('ID')}
                className="text-slate-400 text-sm font-bold hover:text-slate-600"
              >
                Change email address
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
