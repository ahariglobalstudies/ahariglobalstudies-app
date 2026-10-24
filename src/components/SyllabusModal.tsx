import React from 'react';
import { X, BookOpen, Clock, Calendar, Play, CheckCircle2, Award, UserCheck } from 'lucide-react';
import { Course } from '../types';

interface SyllabusModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  onWatchDemo: (lectureTitle: string, videoUrl?: string) => void;
  onEnroll: (course: Course) => void;
}

export const SyllabusModal: React.FC<SyllabusModalProps> = ({
  isOpen,
  onClose,
  course,
  onWatchDemo,
  onEnroll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-2xl bg-white text-slate-900 rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="bg-[#0a2240] text-white p-4 flex items-center justify-between">
          <div className="pr-3 truncate">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
              पाठ्यक्रम एवं अध्ययन योजना (Course Syllabus)
            </span>
            <h3 className="font-bold text-sm sm:text-base leading-tight truncate">{course.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50">
          {/* Top Quick Badges Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200">
              <span className="text-[10px] text-slate-500 block">कक्षा अवधि</span>
              <span className="font-bold text-slate-900">{course.totalHours}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200">
              <span className="text-[10px] text-slate-500 block">कोर्स वैधता</span>
              <span className="font-bold text-slate-900">{course.validity}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200">
              <span className="text-[10px] text-slate-500 block">माध्यम</span>
              <span className="font-bold text-slate-900">{course.medium}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-slate-200">
              <span className="text-[10px] text-slate-500 block">प्रारंभ तिथि</span>
              <span className="font-bold text-slate-900">{course.startDate}</span>
            </div>
          </div>

          {/* Faculty Box */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0a2240] flex items-center justify-center font-bold text-sm border border-blue-200 shrink-0">
              AGS
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">अध्यापन दल (Faculty Team)</span>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">{course.faculty}</h4>
            </div>
          </div>

          {/* Course Classes Section */}
          {course.lectures && course.lectures.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>उपलब्ध कक्षाएं (Course Classes & Lectures)</span>
                </h4>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  मुफ्त देखें (Free Demo)
                </span>
              </div>

              <div className="space-y-2.5">
                {course.lectures.map((lec) => (
                  <div
                    key={lec.id}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 flex items-center justify-between gap-3 shadow-xs transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
                          {lec.isFreeDemo ? 'Free Demo' : 'Live Class'}
                        </span>
                        {lec.date && (
                          <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.2 rounded">
                            {lec.date}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">{lec.duration}</span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{lec.title}</p>
                      {lec.videoUrl && (
                        <span className="text-[10px] text-red-600 font-medium flex items-center gap-1 mt-0.5">
                          ▶ YouTube Video Available
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onWatchDemo(lec.title, lec.videoUrl);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#0a2240] hover:bg-blue-900 active:scale-95 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>देखें</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Module-wise Detailed Syllabus */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              इकाईवार संपूर्ण पाठ्यक्रम (Module-wise Syllabus)
            </h4>

            <div className="space-y-2.5">
              {course.syllabus.map((module, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-[#0a2240]">
                      Module {idx + 1}: {module.title}
                    </span>
                    <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {module.hours}
                    </span>
                  </div>

                  <ul className="space-y-1 pt-1 text-xs text-slate-600">
                    {module.topics.map((topic, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-500 block">कुल शुल्क (Course Fee)</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-[#0a2240]">₹{course.price}</span>
              <span className="text-xs text-slate-400 line-through">₹{course.originalPrice}</span>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onEnroll(course);
            }}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all"
          >
            अभी प्रवेश लें (Enroll Now)
          </button>
        </div>
      </div>
    </div>
  );
};
