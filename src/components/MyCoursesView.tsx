import React from 'react';
import {
  GraduationCap,
  Play,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  FileText,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { COURSES } from '../data/mockData';
import { UserProfile, Course } from '../types';

interface MyCoursesViewProps {
  user: UserProfile;
  language: 'hi' | 'en';
  onOpenCourse: (course: Course) => void;
  onResumeLecture: (courseTitle: string, lectureTitle: string, videoUrl?: string) => void;
  onExploreCourses: () => void;
}

export const MyCoursesView: React.FC<MyCoursesViewProps> = ({
  user,
  language,
  onOpenCourse,
  onResumeLecture,
  onExploreCourses,
}) => {
  const enrolledCourses = COURSES.filter((c) =>
    user.enrolledCourseIds.includes(c.id)
  );

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* 1. TOP HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#0a2240] via-blue-950 to-[#0a2240] rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded-lg bg-amber-400 text-slate-950">
                <GraduationCap className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                My Enrolled Batches
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              {language === 'hi' ? 'मेरे कोर्सेस एवं लाइव बैच' : 'My Courses & Enrolled Batches'}
            </h2>
            <p className="text-xs text-blue-200">
              {language === 'hi'
                ? `विद्यार्थी: ${user.name} (ID: ${user.studentId})`
                : `Student: ${user.name} (ID: ${user.studentId})`}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-lg font-extrabold text-amber-400 font-mono block">
              {enrolledCourses.length}
            </span>
            <span className="text-[10px] text-blue-200 block">
              {language === 'hi' ? 'सक्रिय बैच' : 'Active'}
            </span>
          </div>
        </div>

        {/* Learning Highlights */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10 text-center">
          <div className="bg-white/10 rounded-xl p-1.5">
            <span className="text-xs font-mono font-bold text-amber-300 block">
              {user.totalHoursWatched}h
            </span>
            <span className="text-[9px] text-blue-200">अध्ययन समय</span>
          </div>
          <div className="bg-white/10 rounded-xl p-1.5">
            <span className="text-xs font-mono font-bold text-amber-300 block">
              {user.completedQuizzesCount}
            </span>
            <span className="text-[9px] text-blue-200">क्विज़ हल</span>
          </div>
          <div className="bg-white/10 rounded-xl p-1.5">
            <span className="text-xs font-mono font-bold text-amber-300 block">
              {user.downloadedNotesCount}
            </span>
            <span className="text-[9px] text-blue-200">नोट्स सेव्ड</span>
          </div>
        </div>
      </div>

      {/* 2. ENROLLED COURSES LIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {language === 'hi' ? 'सक्रिय नामांकित कक्षाएं' : 'Active Courses'}
          </h3>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{enrolledCourses.length} Active</span>
          </span>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-sm text-slate-800">
              {language === 'hi' ? 'अभी कोई कोर्स सक्रिय नहीं है' : 'No Enrolled Courses Yet'}
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {language === 'hi'
                ? 'शांति लाल अहारी सर के विषयवार स्पेशल बैच मात्र ₹199 में उपलब्ध हैं।'
                : 'Explore subject special batches at just ₹199.'}
            </p>
            <button
              onClick={onExploreCourses}
              className="px-5 py-2.5 rounded-xl bg-[#0a2240] text-white font-bold text-xs hover:bg-blue-900 shadow-sm"
            >
              {language === 'hi' ? 'कोर्सेस एक्सप्लोर करें (₹199)' : 'Explore Courses'}
            </button>
          </div>
        ) : (
          enrolledCourses.map((course) => {
            const nextLec = course.lectures[0]?.title || 'कक्षा 1: परिचय एवं आधार';

            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all space-y-3"
              >
                {/* Course Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] font-bold text-[#0a2240] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                        {course.category}
                      </span>
                      <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                        <span>नामांकित (Enrolled)</span>
                      </span>
                      {course.isLiveNow && (
                        <span className="text-[9px] text-red-600 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                          LIVE
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                      {language === 'hi' && course.hindiTitle ? course.hindiTitle : course.title}
                    </h4>

                    <p className="text-[11px] text-slate-500">
                      मार्गदर्शन: {course.faculty}
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0a2240] to-blue-900 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                    {course.category.slice(0, 3)}
                  </div>
                </div>

                {/* Progress & Next Class Bar */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Play className="w-3 h-3 text-[#0a2240]" />
                      <span className="font-medium text-slate-700 truncate max-w-[200px]">
                        {nextLec}
                      </span>
                    </span>
                    <span className="font-bold text-blue-900 font-mono text-[10px]">
                      45% पूर्ण
                    </span>
                  </div>
                  {/* Progress Line */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full w-[45%]" />
                  </div>
                </div>

                {/* Course Meta Info */}
                <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>वैधता: {course.validity}</span>
                  </span>
                  <span>{course.totalHours}</span>
                </div>

                {/* Actions: Resume lecture + View syllabus */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onOpenCourse(course)}
                    className="py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                    <span>सिलेबस व नोट्स</span>
                  </button>

                  <button
                    onClick={() => onResumeLecture(course.title, nextLec)}
                    className="py-2 px-3 rounded-xl bg-[#0a2240] hover:bg-blue-900 active:scale-95 text-white text-xs font-bold text-center transition-all shadow-xs flex items-center justify-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>क्लास देखें</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. EXPLORE OTHER SPECIAL BATCHES STRIP */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-950 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="font-bold text-xs text-amber-900">
              अन्य विषयवार स्पेशल बैच
            </span>
          </div>
          <span className="text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full">
            मात्र ₹199
          </span>
        </div>
        <p className="text-xs text-amber-800 leading-relaxed">
          Mapping, Geography, Polity, Economy, Maths, Reasoning और Hindi के नए बैच में प्रवेश लें।
        </p>
        <button
          onClick={onExploreCourses}
          className="w-full py-2 rounded-xl bg-[#0a2240] hover:bg-blue-900 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs"
        >
          <span>सभी 8 विषय स्पेशल बैच देखें</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
