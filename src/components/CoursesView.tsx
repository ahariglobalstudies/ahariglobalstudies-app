import React, { useState } from 'react';
import {
  Search,
  Filter,
  Clock,
  Users,
  Star,
  CheckCircle2,
  Play,
  Sparkles,
  BookOpen,
  RefreshCw,
  Video,
  ExternalLink,
} from 'lucide-react';
import { COURSES } from '../data/mockData';
import { Course, CourseType, ExamCategory, SheetClassRecord } from '../types';

interface CoursesViewProps {
  language: 'hi' | 'en';
  onOpenSyllabus: (course: Course) => void;
  onEnroll: (course: Course) => void;
  onResumeLecture?: (courseTitle: string, lectureTitle: string, videoUrl?: string) => void;
  initialCategory?: ExamCategory;
  sheetClasses?: SheetClassRecord[];
  isSheetLoading?: boolean;
  onRefreshSheet?: () => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  language,
  onOpenSyllabus,
  onEnroll,
  onResumeLecture,
  initialCategory = 'All',
  sheetClasses = [],
  isSheetLoading = false,
  onRefreshSheet,
}) => {
  const [selectedType, setSelectedType] = useState<CourseType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  const categories: ExamCategory[] = [
    'All',
    'CURRENT AFFAIRS',
    'MAPPING',
    'HISTORY',
    'GEOGRAPHY',
    'POLITY',
    'ECONOMY',
    'MATHEMATICS',
    'REASONING',
    'HINDI',
  ];

  // Dynamic courses augmented with Google Sheet live classes
  const coursesWithSheetData = COURSES.map((course) => {
    const matchingSheetClasses = sheetClasses.filter((sc) => {
      const scBatch = sc.batch.toLowerCase();
      const cTitle = course.title.toLowerCase();
      const cCat = course.category.toLowerCase();
      return (
        cTitle.includes(scBatch) ||
        (scBatch.includes('history') && cCat === 'history')
      );
    });

    if (matchingSheetClasses.length > 0) {
      const sheetLectures = matchingSheetClasses.map((sc) => ({
        id: `sheet-${sc.id}`,
        title: sc.title,
        duration: 'Live Class',
        isFreeDemo: true,
        date: sc.date,
        videoUrl: sc.videoUrl,
      }));
      return {
        ...course,
        lectures: [...sheetLectures, ...course.lectures],
      };
    }
    return course;
  });

  // Filter courses
  const filteredCourses = coursesWithSheetData.filter((course) => {
    // Type filter
    if (selectedType !== 'all') {
      if (selectedType === 'free') {
        // has free demo or price 0
        if (course.price !== 0 && !course.lectures.some((l) => l.isFreeDemo)) return false;
      } else if (course.type !== selectedType) {
        return false;
      }
    }

    // Category filter
    if (selectedCategory !== 'All' && course.category !== selectedCategory) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchFaculty = course.faculty.toLowerCase().includes(q);
      const matchHindi = course.hindiTitle?.toLowerCase().includes(q);
      if (!matchTitle && !matchFaculty && !matchHindi) return false;
    }

    return true;
  });

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* 1. TOP HEADER & SEARCH */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            {language === 'hi' ? 'शांति लाल अहारी स्पेशल विषयवार ऑनलाइन बैच' : 'Shanti Lal Ahari Subject Special Batches'}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'hi'
              ? 'सभी विषयवार स्पेशल बैच (Mapping, History, Polity, Maths, Hindi आदि) मात्र ₹199 में'
              : 'All subject-wise masterclass batches available at only ₹199 each'}
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'hi' ? 'विषय या शिक्षक का नाम खोजें...' : 'Search subject or faculty...'}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0a2240] shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 2. COURSE TYPE SEGMENTED CONTROLS (All / Live / Recorded / Free) */}
      <div className="flex p-1 bg-slate-200/80 rounded-xl">
        <button
          onClick={() => setSelectedType('all')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            selectedType === 'all'
              ? 'bg-[#0a2240] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {language === 'hi' ? 'सभी (All)' : 'All Batches'}
        </button>
        <button
          onClick={() => setSelectedType('live')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            selectedType === 'live'
              ? 'bg-[#0a2240] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {language === 'hi' ? '🔴 लाइव (Live)' : 'Live Batches'}
        </button>
        <button
          onClick={() => setSelectedType('recorded')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            selectedType === 'recorded'
              ? 'bg-[#0a2240] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {language === 'hi' ? '📹 रिकॉर्डेड' : 'Recorded'}
        </button>
        <button
          onClick={() => setSelectedType('free')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            selectedType === 'free'
              ? 'bg-[#0a2240] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {language === 'hi' ? '🎁 फ्री डेमो' : 'Free Demo'}
        </button>
      </div>

      {/* 3. EXAM CATEGORY FILTER CHIPS */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 4. COURSE CARDS LIST (2 CARDS PER ROW) */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {filteredCourses.length === 0 ? (
          <div className="col-span-2 p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-sm text-slate-800">कोई कोर्स नहीं मिला</h4>
            <p className="text-xs text-slate-500">
              कृपया अन्य श्रेणी चुनें या खोज शब्द बदलें।
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-2 text-xs font-bold text-[#0a2240] underline"
            >
              सभी कोर्स देखें
            </button>
          </div>
        ) : (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xs hover:border-blue-400 transition-all flex flex-col justify-between"
            >
              {/* Card Banner / Thumbnail (Clickable to open classes) */}
              <div
                onClick={() => onOpenSyllabus(course)}
                className={`p-2.5 sm:p-3 bg-gradient-to-r ${course.bannerGradient} text-white relative cursor-pointer group`}
              >
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/20 backdrop-blur-xs text-amber-300 border border-white/20">
                    {course.category}
                  </span>
                  <div className="flex items-center gap-1">
                    {course.isLiveNow ? (
                      <span className="text-[9px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                        LIVE
                      </span>
                    ) : (
                      <span className="text-[9px] text-blue-100 font-medium">{course.medium}</span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-xs sm:text-sm leading-snug text-white line-clamp-2 min-h-[32px] group-hover:text-amber-300 transition-colors">
                  {language === 'hi' && course.hindiTitle ? course.hindiTitle : course.title}
                </h3>

                <p className="text-[10px] text-blue-200/90 mt-1 truncate">
                  {course.faculty}
                </p>
              </div>

              {/* Course Specs Body */}
              <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between space-y-2">
                <p
                  onClick={() => onOpenSyllabus(course)}
                  className="text-[10px] sm:text-xs text-slate-600 line-clamp-2 leading-relaxed cursor-pointer"
                >
                  {course.description}
                </p>

                {/* Key metadata */}
                <div className="grid grid-cols-2 gap-1 py-1.5 border-y border-slate-100 text-[10px] text-slate-500">
                  <div className="truncate">
                    <span className="text-[9px] text-slate-400 block">वैधता</span>
                    <span className="font-semibold text-slate-800 truncate block text-[10px]">{course.validity}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">रेटिंग</span>
                    <span className="font-semibold text-amber-600 flex items-center gap-0.5 text-[10px]">
                      <Star className="w-2.5 h-2.5 fill-current" /> {course.rating}
                    </span>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="pt-1 space-y-2 mt-auto">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 block">कोर्स शुल्क</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm sm:text-base font-extrabold text-[#0a2240] font-mono">
                          {course.price === 0 ? 'FREE' : `₹${course.price}`}
                        </span>
                        {course.originalPrice > course.price && (
                          <span className="text-[10px] text-slate-400 line-through">
                            ₹{course.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => onOpenSyllabus(course)}
                      className="py-1.5 px-1 rounded-lg border border-[#0a2240] bg-blue-50/60 hover:bg-blue-100/80 active:scale-95 text-[#0a2240] text-[10px] font-bold text-center truncate shadow-2xs transition-all flex items-center justify-center gap-1"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>{language === 'hi' ? 'क्लासेस देखें' : 'Classes'}</span>
                    </button>
                    <button
                      onClick={() => onEnroll(course)}
                      className="py-1.5 px-1 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-[10px] text-center truncate shadow-2xs transition-all"
                    >
                      {course.price === 0 ? 'फ्री देखें' : 'प्रवेश लें'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
