import React, { useState, useEffect } from 'react';
import { Volume2, ChevronRight, BellRing } from 'lucide-react';
import { NOTICES } from '../data/mockData';

interface NoticeBoardProps {
  language: 'hi' | 'en';
  onViewAll?: () => void;
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({ language, onViewAll }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % NOTICES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-amber-50 border-y border-amber-200/80 px-3 py-2 text-xs flex items-center gap-2 overflow-hidden shadow-xs">
      {/* Notice Tag */}
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500 text-white font-bold text-[10px] shrink-0 tracking-wider">
        <Volume2 className="w-3.5 h-3.5 animate-pulse" />
        <span>{language === 'hi' ? 'सूचना' : 'UPDATE'}</span>
      </div>

      {/* Rotating Marquee Message */}
      <div className="flex-1 overflow-hidden h-5 relative">
        <div
          key={currentIndex}
          className="text-slate-800 font-medium truncate text-xs leading-5 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {NOTICES[currentIndex]}
        </div>
      </div>

      {/* View All Arrow Button */}
      {onViewAll && (
        <button
          onClick={onViewAll}
          className="shrink-0 text-amber-900 hover:text-amber-950 flex items-center font-semibold text-[11px] gap-0.5 px-1 py-0.5 rounded"
          aria-label="View all notices"
        >
          <span>{language === 'hi' ? 'सभी' : 'All'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
