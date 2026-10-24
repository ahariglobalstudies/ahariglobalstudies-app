import React from 'react';
import { Home, BookOpen, CheckSquare, FileText, User } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  language: 'hi' | 'en';
  badgeCounts?: {
    courses?: number;
    tests?: number;
    notes?: number;
  };
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  language,
  badgeCounts,
}) => {
  const tabs: {
    id: TabType;
    labelEn: string;
    labelHi: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: 'home', labelEn: 'Home', labelHi: 'होम', icon: Home },
    { id: 'courses', labelEn: 'Courses', labelHi: 'कोर्स', icon: BookOpen, badge: badgeCounts?.courses },
    { id: 'tests', labelEn: 'Tests', labelHi: 'टेस्ट', icon: CheckSquare, badge: badgeCounts?.tests },
    { id: 'notes', labelEn: 'Notes', labelHi: 'नोट्स', icon: FileText, badge: badgeCounts?.notes },
    { id: 'profile', labelEn: 'Profile', labelHi: 'प्रोफाइल', icon: User },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] pb-safe"
      aria-label="Bottom Navigation"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center min-h-[48px] py-1 px-1 rounded-xl transition-all select-none ${
                isActive
                  ? 'text-[#0a2240] font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              aria-label={language === 'hi' ? tab.labelHi : tab.labelEn}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active top pill indicator */}
              {isActive && (
                <span className="absolute top-0.5 w-6 h-1 bg-[#0a2240] rounded-full animate-in fade-in duration-200" />
              )}

              {/* Icon Container with Badge */}
              <div className="relative mt-1">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Caption */}
              <span
                className={`text-[10px] mt-1 tracking-tight leading-none whitespace-nowrap truncate max-w-full ${
                  isActive ? 'font-bold text-[#0a2240]' : 'font-medium'
                }`}
              >
                {language === 'hi' ? tab.labelHi : tab.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
