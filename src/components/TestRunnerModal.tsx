import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Globe,
  Award,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { MockTest } from '../types';

interface TestRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  test: MockTest;
  defaultLang?: 'hi' | 'en';
}

export const TestRunnerModal: React.FC<TestRunnerModalProps> = ({
  isOpen,
  onClose,
  test,
  defaultLang = 'hi',
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [lang, setLang] = useState<'hi' | 'en'>(defaultLang);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(test.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showPalette, setShowPalette] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || isSubmitted) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isSubmitted]);

  // Reset when test changes
  useEffect(() => {
    if (isOpen) {
      setCurrentQIndex(0);
      setSelectedAnswers({});
      setMarkedForReview({});
      setSecondsRemaining(test.durationMinutes * 60);
      setIsSubmitted(false);
      setShowConfirmSubmit(false);
    }
  }, [isOpen, test]);

  if (!isOpen) return null;

  const currentQ = test.questions[currentQIndex];

  const handleSelectOption = (optIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQIndex]: optIndex,
    }));
  };

  const handleClearResponse = () => {
    setSelectedAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQIndex];
      return next;
    });
  };

  const handleToggleReview = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQIndex]: !prev[currentQIndex],
    }));
  };

  const handleNext = () => {
    if (currentQIndex < test.questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(currentQIndex - 1);
    }
  };

  const handleFinalSubmit = () => {
    setIsSubmitted(true);
    setShowConfirmSubmit(false);
  };

  // Score Calculation
  const calculateResults = () => {
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    test.questions.forEach((q, idx) => {
      const ans = selectedAnswers[idx];
      if (ans === undefined) {
        unattempted++;
      } else if (ans === q.correctOption) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const marksPerQ = test.totalMarks / test.totalQuestions;
    const positiveMarks = correct * marksPerQ;
    const negativeMarks = incorrect * test.negativeMarking;
    const finalScore = Math.max(0, positiveMarks - negativeMarks);
    const accuracy = correct + incorrect > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;

    return {
      correct,
      incorrect,
      unattempted,
      finalScore: finalScore.toFixed(1),
      maxMarks: test.totalMarks,
      accuracy,
    };
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-2xl bg-white text-slate-900 rounded-none sm:rounded-2xl max-h-screen sm:max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Test Engine Top Bar */}
        <div className="bg-[#0a2240] text-white px-4 py-3 flex items-center justify-between border-b border-blue-900">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
              AHARI GLOBAL STUDIES (AGS) CBT Examination
            </span>
            <h3 className="text-xs sm:text-sm font-bold truncate max-w-[240px] sm:max-w-md">
              {lang === 'hi' ? test.hindiTitle : test.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Countdown Timer */}
            {!isSubmitted && (
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-xs font-bold border ${
                  secondsRemaining < 120
                    ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
                    : 'bg-white/10 text-amber-300 border-white/20'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimer(secondsRemaining)}</span>
              </div>
            )}

            {/* Language Switch */}
            <button
              onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
              className="px-2 py-1 rounded-lg bg-white/10 text-white text-xs font-medium flex items-center gap-1 border border-white/10 hover:bg-white/20"
              title="Change Question Language"
            >
              <Globe className="w-3 h-3 text-amber-400" />
              <span>{lang === 'hi' ? 'ENG' : 'हिंदी'}</span>
            </button>

            {/* Close / Exit Button */}
            <button
              onClick={() => {
                if (!isSubmitted && Object.keys(selectedAnswers).length > 0) {
                  setShowConfirmSubmit(true);
                } else {
                  onClose();
                }
              }}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* BODY: If already submitted -> Show Scorecard */}
        {isSubmitted ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-5">
            {/* Scorecard Hero */}
            {(() => {
              const res = calculateResults();
              return (
                <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm text-center">
                  <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 border border-amber-200 mx-auto flex items-center justify-center mb-2">
                    <Award className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    {lang === 'hi' ? 'टेस्ट परिणाम एवं स्कोरकार्ड' : 'Test Result & Scorecard'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{test.title}</p>

                  <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                    <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                      <span className="text-[11px] text-slate-500 block">प्राप्तांक (Score)</span>
                      <span className="text-xl font-extrabold text-[#0a2240] font-mono tabular-nums">
                        {res.finalScore} / {res.maxMarks}
                      </span>
                    </div>
                    <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                      <span className="text-[11px] text-slate-500 block">सटीकता (Accuracy)</span>
                      <span className="text-xl font-extrabold text-emerald-700 font-mono tabular-nums">
                        {res.accuracy}%
                      </span>
                    </div>
                    <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100">
                      <span className="text-[11px] text-slate-500 block">ऑल इंडिया रैंक</span>
                      <span className="text-xl font-extrabold text-purple-700 font-mono tabular-nums">
                        #428
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 text-xs font-semibold mt-4 pt-3 border-t border-slate-100">
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> सही: {res.correct}
                    </span>
                    <span className="text-rose-600 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> गलत: {res.incorrect}
                    </span>
                    <span className="text-slate-500 flex items-center gap-1">
                      छोड़े: {res.unattempted}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* In-depth Question Solutions with Shanti Lal Ahari Sir Mnemonics */}
            <div className="space-y-4">
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-600">
                {lang === 'hi' ? 'विस्तृत व्याख्या एवं शांति लाल अहारी सर ट्रिक्स' : 'Detailed Solution & Shanti Lal Ahari Sir Mnemonics'}
              </h5>

              {test.questions.map((q, idx) => {
                const userAns = selectedAnswers[idx];
                const isCorrect = userAns === q.correctOption;
                const isSkipped = userAns === undefined;

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-xs text-[#0a2240]">
                        Q{idx + 1}. {q.topic}
                      </span>
                      {isSkipped ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          छोड़ा गया (Skipped)
                        </span>
                      ) : isCorrect ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> सही (+{test.totalMarks / test.totalQuestions})
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> गलत (-{test.negativeMarking})
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm font-medium text-slate-900 leading-relaxed">
                      {lang === 'hi' ? q.questionHi : q.questionEn}
                    </p>

                    {/* Options summary */}
                    <div className="space-y-1.5 text-xs">
                      {(lang === 'hi' ? q.optionsHi : q.optionsEn).map((opt, optIdx) => {
                        const isCorrectOption = optIdx === q.correctOption;
                        const isSelectedByStudent = optIdx === userAns;

                        let style = 'bg-slate-50 border-slate-200 text-slate-700';
                        if (isCorrectOption) {
                          style = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold';
                        } else if (isSelectedByStudent && !isCorrectOption) {
                          style = 'bg-rose-50 border-rose-300 text-rose-900';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-2 rounded-lg border text-xs flex items-center justify-between ${style}`}
                          >
                            <span>
                              {String.fromCharCode(65 + optIdx)}. {opt}
                            </span>
                            {isCorrectOption && (
                              <span className="text-[10px] text-emerald-700 font-bold shrink-0">
                                ✓ सही उत्तर
                              </span>
                            )}
                            {isSelectedByStudent && !isCorrectOption && (
                              <span className="text-[10px] text-rose-600 font-bold shrink-0">
                                ✗ आपका चयन
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Shanti Lal Ahari Explanation Box */}
                    <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-amber-950">
                      <div className="flex items-center gap-1 font-bold text-amber-900 mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>व्याख्या (Solution Explanation):</span>
                      </div>
                      <p className="leading-relaxed">
                        {lang === 'hi' ? q.explanationHi : q.explanationEn}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Done button */}
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-[#0a2240] text-white font-bold text-xs hover:bg-blue-900 transition-colors shadow-sm"
              >
                {lang === 'hi' ? 'समाप्त करें एवं होम पर जाएं' : 'Done & Return to Test Series'}
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE CBT QUESTION ENGINE */
          <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-50">
            {/* Top Question Status bar */}
            <div className="px-4 py-2 bg-white border-b border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0a2240]">
                  प्रश्न {currentQIndex + 1} / {test.questions.length}
                </span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-500 font-medium">{currentQ.topic}</span>
              </div>
              <button
                onClick={() => setShowPalette(!showPalette)}
                className="text-blue-700 hover:text-blue-900 font-semibold text-xs flex items-center gap-1"
              >
                <span>प्रश्न पैलेट ({showPalette ? 'छिपाएं' : 'देखें'})</span>
              </button>
            </div>

            {/* Question Palette Drawer (Collapsible) */}
            {showPalette && (
              <div className="p-3 bg-slate-100 border-b border-slate-200 flex flex-wrap gap-2 animate-in fade-in duration-150">
                {test.questions.map((_, idx) => {
                  const isAnswered = selectedAnswers[idx] !== undefined;
                  const isMarked = markedForReview[idx];
                  const isCurrent = idx === currentQIndex;

                  let colorClass = 'bg-white border-slate-300 text-slate-700';
                  if (isMarked) {
                    colorClass = 'bg-purple-600 text-white border-purple-700';
                  } else if (isAnswered) {
                    colorClass = 'bg-emerald-600 text-white border-emerald-700';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentQIndex(idx);
                        setShowPalette(false);
                      }}
                      className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center border transition-all ${colorClass} ${
                        isCurrent ? 'ring-2 ring-[#0a2240] ring-offset-1 scale-105' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Question and Options Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
                <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                  {lang === 'hi' ? currentQ.questionHi : currentQ.questionEn}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {(lang === 'hi' ? currentQ.optionsHi : currentQ.optionsEn).map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentQIndex] === optIdx;

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all min-h-[50px] ${
                        isSelected
                          ? 'bg-blue-50/90 border-[#0a2240] text-slate-950 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected
                            ? 'bg-[#0a2240] text-white border-[#0a2240]'
                            : 'border-slate-300 text-slate-500'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="text-xs sm:text-sm font-medium flex-1">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="bg-white border-t border-slate-200 p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2 max-w-2xl mx-auto">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleReview}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                      markedForReview[currentQIndex]
                        ? 'bg-purple-100 text-purple-900 border-purple-300'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {markedForReview[currentQIndex] ? '✓ Marked' : 'Mark Review'}
                  </button>

                  <button
                    onClick={handleClearResponse}
                    disabled={selectedAnswers[currentQIndex] === undefined}
                    className="px-2.5 py-2 text-xs font-medium rounded-xl text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Clear
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {currentQIndex > 0 && (
                    <button
                      onClick={handlePrev}
                      className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  )}

                  {currentQIndex < test.questions.length - 1 ? (
                    <button
                      onClick={handleNext}
                      className="px-4 py-2 rounded-xl bg-[#0a2240] text-white text-xs font-bold hover:bg-blue-900 flex items-center gap-1 shadow-sm"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowConfirmSubmit(true)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm"
                    >
                      Submit Test
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 border border-amber-200 mx-auto flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {lang === 'hi' ? 'क्या आप टेस्ट जमा करना चाहते हैं?' : 'Submit Test Confirmation'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  आपने {Object.keys(selectedAnswers).length} में से {test.questions.length} प्रश्नों का उत्तर दिया है।
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                >
                  जारी रखें (Cancel)
                </button>
                <button
                  onClick={handleFinalSubmit}
                  className="flex-1 py-2.5 rounded-xl bg-[#0a2240] text-white font-bold text-xs hover:bg-blue-900 shadow-sm"
                >
                  जमा करें (Submit)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
