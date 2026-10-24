import React, { useState } from 'react';
import { Bell, Search, Globe, X, Sparkles, AlertCircle } from 'lucide-react';
import { NOTICES } from '../data/mockData';

interface HeaderProps {
  currentLanguage: 'hi' | 'en';
  onToggleLanguage: () => void;
  onOpenSearch?: () => void;
  targetExam?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onToggleLanguage,
  targetExam = 'UPSC & SSC',
}) => {
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#0a2240] text-white shadow-md border-b border-blue-950">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          {/* Brand Wordmark Zone */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center font-bold text-amber-400 border border-white/20 tracking-wider text-base shadow-inner">
              AGS
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight leading-tight text-white flex items-center gap-1.5">
                AHARI GLOBAL STUDIES
                <span className="hidden sm:inline-block text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded">
                  Official
                </span>
              </span>
              <span className="text-[10px] text-blue-200/80 font-normal leading-none">
                {currentLanguage === 'hi' ? 'राष्ट्र निर्माण में समर्पित' : 'Dedicated to Nation Building'}
              </span>
            </div>
          </div>

          {/* Quick Info & Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Target Exam Indicator */}
            <div className="hidden sm:flex items-center gap-1 text-[11px] bg-white/10 px-2.5 py-1 rounded-full text-blue-100 border border-white/10">
              <span className="text-amber-400 font-semibold">Goal:</span>
              <span className="truncate max-w-[120px]">{targetExam}</span>
            </div>

            {/* Language Switcher */}
            <button
              onClick={onToggleLanguage}
              className="min-h-[36px] px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/15 active:scale-95 transition-all text-blue-100 flex items-center gap-1.5 border border-white/10"
              title="Toggle Language (भाषा बदलें)"
              aria-label="Toggle Hindi or English"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentLanguage === 'hi' ? 'हिंदी' : 'ENG'}</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => {
                setShowNotificationDrawer(true);
                setUnreadCount(0);
              }}
              className="relative min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/15 active:scale-95 transition-all text-blue-100 border border-white/10"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-blue-100" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Notification Modal Drawer */}
      {showNotificationDrawer && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="p-4 bg-[#0a2240] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">
                  {currentLanguage === 'hi' ? 'सूचनाएं एवं अपडेट' : 'Notifications & Updates'}
                </h3>
              </div>
              <button
                onClick={() => setShowNotificationDrawer(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="p-4 divide-y divide-slate-100 overflow-y-auto max-h-[60vh]">
              {NOTICES.map((notice, idx) => (
                <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertCircle className="w-4 h-4 text-[#0a2240]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-800 leading-relaxed font-medium">{notice}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {idx === 0 ? 'Just now' : `${idx + 1} hours ago`}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <button
                onClick={() => setShowNotificationDrawer(false)}
                className="w-full py-2.5 rounded-xl bg-[#0a2240] text-white text-xs font-semibold hover:bg-blue-900 transition-colors"
              >
                {currentLanguage === 'hi' ? 'सभी पढ़े गए' : 'Mark All as Read'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
