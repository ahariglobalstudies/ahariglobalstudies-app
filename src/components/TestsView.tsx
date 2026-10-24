import React, { useState } from 'react';
import {
  Award,
  Clock,
  HelpCircle,
  CheckCircle,
  Play,
  Flame,
  AlertCircle,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { MOCK_TESTS } from '../data/mockData';
import { MockTest, ExamCategory } from '../types';

interface TestsViewProps {
  language: 'hi' | 'en';
  onStartTest: (test: MockTest) => void;
}

export const TestsView: React.FC<TestsViewProps> = ({ language, onStartTest }) => {
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory>('All');

  const categories: ExamCategory[] = ['All', 'POLITY', 'REASONING', 'HISTORY', 'MAPPING'];

  const filteredTests = MOCK_TESTS.filter((t) => {
    if (selectedCategory !== 'All' && t.category !== selectedCategory) return false;
    return true;
  });

  const dailyQuizzes = MOCK_TESTS.filter((t) => t.isDailyQuiz);
  const fullMockTests = filteredTests.filter((t) => !t.isDailyQuiz);

  return (
    <div className="space-y-5 pb-20 animate-in fade-in duration-200">
      {/* 1. HEADER */}
      <div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
          {language === 'hi' ? 'ऑल इंडिया टेस्ट सीरीज़ एवं मॉक टेस्ट' : 'Test Series & Daily Quizzes'}
        </h2>
        <p className="text-xs text-slate-500">
          {language === 'hi'
            ? 'नवीनतम परीक्षा पैटर्न, खान सर एक्सप्लेनेशन और ऑल इंडिया मेरिट लिस्ट के साथ'
            : 'Exact CBT exam simulator with detailed solutions & All India Rank'}
        </p>
      </div>

      {/* 2. DAILY FREE QUIZ SPOTLIGHT */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500 fill-current" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              {language === 'hi' ? 'दैनिक फ्री क्विज़ (Daily Free Quiz)' : 'Daily Free Quizzes'}
            </h3>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
            Free for All
          </span>
        </div>

        {dailyQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="p-4 rounded-2xl bg-gradient-to-br from-[#0a2240] to-blue-900 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950 uppercase">
                  LIVE TODAY
                </span>
                <span className="text-[11px] text-blue-200">
                  {quiz.attemptedCount.toLocaleString()} Aspirants Attempted
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white">
                {language === 'hi' ? quiz.hindiTitle : quiz.title}
              </h4>
              <div className="flex items-center gap-3 text-xs text-blue-200 pt-1">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> {quiz.durationMinutes} Mins
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> {quiz.totalQuestions} Questions
                </span>
                <span>•</span>
                <span className="font-mono">{quiz.totalMarks} Marks</span>
              </div>
            </div>

            <button
              onClick={() => onStartTest(quiz)}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{language === 'hi' ? 'क्विज़ शुरू करें' : 'Start Daily Quiz'}</span>
            </button>
          </div>
        ))}
      </div>

      {/* 3. CATEGORY CHIPS FOR FULL MOCKS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {language === 'hi' ? 'फुल लेंथ मॉक टेस्ट' : 'Full-Length Mock Tests'}
          </h3>
          <div className="flex items-center gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#0a2240] text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* MOCK TEST CARDS */}
        <div className="space-y-3">
          {fullMockTests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#0a2240] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                      {test.category} CBT
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Bilingual (हिंदी / English)</span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                    {language === 'hi' ? test.hindiTitle : test.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    नेगेटिव मार्किंग: 1/{Math.round(1 / test.negativeMarking)} अंक काटा जाएगा
                  </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{test.durationMinutes} Min</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>{test.totalQuestions} Qs</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{test.totalMarks} Marks</span>
                </div>
              </div>

              {/* Start Test Action */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400">
                  {test.attemptedCount.toLocaleString()} Students Enrolled
                </span>

                <button
                  onClick={() => onStartTest(test)}
                  className="px-4 py-2 rounded-xl bg-[#0a2240] hover:bg-blue-900 active:scale-95 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{language === 'hi' ? 'टेस्ट शुरू करें' : 'Start Test'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. EXAM INSTRUCTIONS INFO BOX */}
      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 text-blue-950 text-xs space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-blue-900">
          <AlertCircle className="w-4 h-4 text-blue-700" />
          <span>ऑनलाइन परीक्षा नियम एवं सुझाव (Shanti Lal Ahari Sir Tips):</span>
        </div>
        <ul className="space-y-1 text-[11px] text-blue-800/90 list-disc list-inside">
          <li>टेस्ट के दौरान आप कभी भी हिंदी या अंग्रेजी माध्यम बदल सकते हैं।</li>
          <li>जिस सवाल में संशय हो उसे 'Mark for Review' करें और अंत में हल करें।</li>
          <li>सबमिट करते ही आपको विस्तृत व्याख्या और ऑल इंडिया रैंक दिखाई जाएगी।</li>
        </ul>
      </div>
    </div>
  );
};
