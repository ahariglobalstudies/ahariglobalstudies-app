import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Clock,
  Calendar,
  Play,
  CheckCircle2,
  Award,
  FileText,
  HelpCircle,
  Download,
  Eye,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Course, NoteItem } from '../types';
import { PDF_NOTES } from '../data/mockData';

interface SyllabusModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  onWatchDemo: (lectureTitle: string, videoUrl?: string) => void;
  onEnroll: (course: Course) => void;
  enrolledCourseIds?: string[];
  onOpenPdf?: (note: NoteItem) => void;
  onDownloadNote?: (note: NoteItem) => void;
  downloadedNoteIds?: string[];
}

export const SyllabusModal: React.FC<SyllabusModalProps> = ({
  isOpen,
  onClose,
  course,
  onWatchDemo,
  onEnroll,
  enrolledCourseIds = [],
  onOpenPdf,
  onDownloadNote,
  downloadedNoteIds = [],
}) => {
  const [activeTab, setActiveTab] = useState<'syllabus' | 'notes' | 'faqs' | 'pdf_notes'>('syllabus');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  if (!isOpen) return null;

  const isEnrolled = enrolledCourseIds.includes(course.id);

  // Filter relevant PDF notes for this course
  const subjectNotes = PDF_NOTES.filter(
    (n) =>
      n.subject === course.category ||
      course.title.toLowerCase().includes(n.subject.toLowerCase()) ||
      course.description.toLowerCase().includes(n.subject.toLowerCase())
  );
  const displayPdfNotes = subjectNotes.length > 0 ? subjectNotes : PDF_NOTES;

  // Course FAQs
  const courseFaqs = [
    {
      q: 'क्या यह कोर्स लाइव के साथ रिकॉर्डेड भी रहेगा?',
      a: 'हां, लाइव क्लास समाप्त होने के तुरंत बाद वीडियो रिकॉर्डेड रूप में 1080p, 720p, 480p क्वालिटी में उपलब्ध रहता है। आप इसे 1 वर्ष तक असीमित बार देख सकते हैं।',
    },
    {
      q: 'क्या क्लास नोट्स और पीडीएफ का प्रिंट आउट निकाल सकते हैं?',
      a: 'बिल्कुल! सभी क्लास नोट्स, हस्तलिखित नोट्स और ई-बुक्स डाउनलोड करके प्रिंट आउट निकाला जा सकता है।',
    },
    {
      q: 'कोर्स की वैधता (Validity) कब तक रहेगी?',
      a: `इस बैच की वैधता एडमिशन लेने की तारीख से पूरे ${course.validity} तक रहेगी।`,
    },
    {
      q: 'क्या इस बैच में अभ्यास प्रश्न और टेस्ट सीरीज शामिल हैं?',
      a: 'हां, प्रत्येक अध्याय समाप्त होने पर चैप्टर टेस्ट एवं ऑल इंडिया रैंकिंग सहित साप्ताहिक मॉक टेस्ट उपलब्ध कराए जाते हैं।',
    },
    {
      q: 'यदि क्लास के दौरान कोई डाउट हो तो कैसे पूछें?',
      a: 'लाइव चैट में सीधे शिक्षक से सवाल पूछ सकते हैं। इसके अलावा ऐप में 24x7 डाउट क्लियरिंग हेल्पडेस्क उपलब्ध है।',
    },
  ];

  // Helper to get lectures for a specific chapter/module
  const getLecturesForChapter = (chapterIndex: number, chapterTitle: string) => {
    // 1. Direct match by chapterIndex
    const explicit = (course.lectures || []).filter(
      (l) => l.chapterIndex === chapterIndex || l.chapterTitle === chapterTitle
    );
    if (explicit.length > 0) return explicit;

    // 2. Keyword matching in title
    const keywords = chapterTitle.toLowerCase().split(/[\s,()/-]+/);
    const matched = (course.lectures || []).filter((l) =>
      keywords.some((kw) => kw.length > 3 && l.title.toLowerCase().includes(kw))
    );
    if (matched.length > 0) return matched;

    // 3. Fallback distribution
    if (course.lectures && course.lectures.length > 0) {
      if (chapterIndex === 0) {
        return [course.lectures[0]];
      } else if (chapterIndex === 1 && course.lectures.length > 1) {
        return [course.lectures[1]];
      } else if (chapterIndex === 2 && course.lectures.length > 2) {
        return [course.lectures[2]];
      }
    }

    // Default placeholder class for this chapter
    return [
      {
        id: `gen-lec-${course.id}-${chapterIndex}-1`,
        title: `${chapterTitle} - भाग 1 (फाउंडेशन क्लास)`,
        duration: '1h 15m',
        isFreeDemo: chapterIndex === 0,
        date: 'VOD Class Available',
        videoUrl: course.lectures?.[0]?.videoUrl || 'https://youtu.be/RTXwE6g3Q4U?si=IpkySZpDoS4xvXuf',
      },
    ];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-2xl bg-white text-slate-900 rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="bg-[#0a2240] text-white p-4 flex items-center justify-between">
          <div className="pr-3 truncate">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
              {course.category} • स्पेशल बैच
            </span>
            <h3 className="font-bold text-sm sm:text-base leading-tight truncate">
              {course.hindiTitle || course.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Interactive Tabs Bar */}
        <div className="bg-slate-100 p-1.5 border-b border-slate-200 grid grid-cols-4 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`py-2 px-1 rounded-xl font-bold transition-all text-center truncate ${
              activeTab === 'syllabus'
                ? 'bg-[#0a2240] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
            }`}
          >
            विषय सूची
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-2 px-1 rounded-xl font-bold transition-all text-center truncate ${
              activeTab === 'notes'
                ? 'bg-[#0a2240] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
            }`}
          >
            क्लास नोट्स
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`py-2 px-1 rounded-xl font-bold transition-all text-center truncate ${
              activeTab === 'faqs'
                ? 'bg-[#0a2240] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
            }`}
          >
            पूछे गए सवाल
          </button>
          <button
            onClick={() => setActiveTab('pdf_notes')}
            className={`py-2 px-1 rounded-xl font-bold transition-all text-center truncate relative ${
              activeTab === 'pdf_notes'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
            }`}
          >
            पीडीएफ नोट्स
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-1.5 right-1.5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50">
          {/* Top Quick Badges Strip (Shared) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 block">कक्षा अवधि</span>
              <span className="font-bold text-slate-900 text-xs">{course.totalHours}</span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 block">कोर्स वैधता</span>
              <span className="font-bold text-slate-900 text-xs">{course.validity}</span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 block">माध्यम</span>
              <span className="font-bold text-slate-900 text-xs">{course.medium}</span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-400 block">प्रारंभ तिथि</span>
              <span className="font-bold text-slate-900 text-xs">{course.startDate}</span>
            </div>
          </div>

          {/* TAB 1: विषय सूची (Chapter-wise / चैप्टर वाइज Videos & Topics) */}
          {activeTab === 'syllabus' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-700" />
                    <span>इकाई एवं अध्याय वार कक्षाएं (Chapter-wise Classes)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    प्रत्येक अध्याय के वीडियो लेक्चर एवं महत्वपूर्ण अध्ययन बिंदु
                  </p>
                </div>
                {isEnrolled && (
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                    पूर्ण एक्सेस सक्रिय
                  </span>
                )}
              </div>

              {/* Chapter-wise Container */}
              <div className="space-y-3.5">
                {course.syllabus.map((chapter, cIdx) => {
                  const chapterLectures = getLecturesForChapter(cIdx, chapter.title);

                  return (
                    <div
                      key={cIdx}
                      className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs"
                    >
                      {/* Chapter Header */}
                      <div className="p-3 bg-gradient-to-r from-slate-100 to-blue-50/40 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-[#0a2240] text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                            {cIdx + 1}
                          </span>
                          <div>
                            <h5 className="font-bold text-xs sm:text-sm text-[#0a2240] leading-snug">
                              अध्याय {cIdx + 1}: {chapter.title}
                            </h5>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {chapterLectures.length} वीडियो कक्षाएं • {chapter.hours}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Chapter Topics Checklist */}
                      <div className="p-3 bg-slate-50/60 border-b border-slate-100">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                          मुख्य अध्ययन बिंदु (Topics Covered):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {chapter.topics.map((top, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[11px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-lg flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>{top}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Chapter Video Lectures */}
                      <div className="p-3 space-y-2">
                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                          वीडियो कक्षाएं (Chapter Lectures):
                        </span>

                        <div className="space-y-2">
                          {chapterLectures.map((lec) => (
                            <div
                              key={lec.id}
                              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-400 flex items-center justify-between gap-3 shadow-2xs transition-all"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                  <span
                                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                      lec.isFreeDemo
                                        ? 'bg-emerald-100 text-emerald-900'
                                        : 'bg-blue-100 text-blue-900'
                                    }`}
                                  >
                                    {lec.isFreeDemo ? 'Free Demo' : 'Full Class'}
                                  </span>
                                  {lec.date && (
                                    <span className="text-[9px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                      {lec.date}
                                    </span>
                                  )}
                                  <span className="text-[9px] text-slate-400 font-medium">
                                    {lec.duration}
                                  </span>
                                </div>

                                <p className="text-xs font-bold text-slate-900 truncate">
                                  {lec.title}
                                </p>

                                {lec.videoUrl && (
                                  <span className="text-[10px] text-red-600 font-medium flex items-center gap-1 mt-0.5">
                                    ▶ YouTube Live / VOD Available
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={() => {
                                  onClose();
                                  onWatchDemo(lec.title, lec.videoUrl);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-[#0a2240] hover:bg-blue-900 active:scale-95 text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-2xs transition-all"
                              >
                                <Play className="w-3 h-3 fill-current" />
                                <span>देखें</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: क्लास नोट्स (Class Notes & Handouts) */}
          {activeTab === 'notes' && (
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-700" />
                  <span>क्लास नोट्स एवं महत्वपूर्ण सार संग्रह (Class Handouts)</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  कक्षा में पढ़ाए गए विषयों के मुख्य बिंदु एवं फॉर्मूला शीट
                </p>
              </div>

              <div className="space-y-2.5">
                {course.syllabus.map((mod, mIdx) => (
                  <div key={mIdx} className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#0a2240]">
                        अध्याय {mIdx + 1} नोट्स: {mod.title}
                      </span>
                      <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        अपलोड किया गया
                      </span>
                    </div>

                    <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                      {mod.topics.map((t, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                          <span>{t} - विस्तृत सार संग्रह एवं हस्तलिखित आरेख</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: पूछे गए सवाल (FAQs) */}
          {activeTab === 'faqs' && (
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-700" />
                  <span>अक्सर पूछे जाने वाले सवाल (Course FAQs)</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  बैच, वैधता और अध्ययन सामग्री से जुड़े सामान्य प्रश्नोत्तर
                </p>
              </div>

              <div className="space-y-2">
                {courseFaqs.map((faq, fIdx) => {
                  const isExpanded = expandedFaqIndex === fIdx;

                  return (
                    <div
                      key={fIdx}
                      className="rounded-2xl bg-white border border-slate-200 overflow-hidden transition-all shadow-2xs"
                    >
                      <button
                        onClick={() => setExpandedFaqIndex(isExpanded ? null : fIdx)}
                        className="w-full p-3.5 text-left flex items-center justify-between gap-2 hover:bg-slate-50 font-bold text-xs sm:text-sm text-slate-900"
                      >
                        <span className="flex-1">{faq.q}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="px-3.5 pb-3.5 text-xs text-slate-600 border-t border-slate-100 pt-2.5 leading-relaxed bg-slate-50/50">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: पीडीएफ नोट्स (PDF Notes - Compact Streamlined Format) */}
          {activeTab === 'pdf_notes' && (
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  <span>हस्तलिखित क्लासरूम पीडीएफ नोट्स (PDF Notes)</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  विषयवार प्रमाणित हस्तलिखित क्लासरूम नोट्स सीधे डाउनलोड करें
                </p>
              </div>

              <div className="space-y-2.5">
                {displayPdfNotes.map((note) => {
                  const isDownloaded = downloadedNoteIds.includes(note.id);

                  return (
                    <div
                      key={note.id}
                      className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs hover:border-[#0a2240]/40 transition-all"
                    >
                      <div className="flex items-center justify-between gap-2.5">
                        {/* Left: PDF Icon + Compact Details */}
                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                          <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0 mt-0.5">
                            <FileText className="w-4 h-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            {/* 1. Title */}
                            <h5
                              onClick={() => onOpenPdf && onOpenPdf(note)}
                              className="font-bold text-xs text-slate-900 leading-snug cursor-pointer hover:text-blue-700 transition-colors line-clamp-1"
                            >
                              {note.hindiTitle || note.title}
                            </h5>

                            {/* 2. Faculty / Teacher */}
                            <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
                              {note.uploaderName || note.faculty || 'कागद सर'}
                            </div>

                            {/* 3. Pages, Size (MB), Date ONLY */}
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 font-medium flex-wrap">
                              <span>{note.pages} पृष्ठ</span>
                              <span>•</span>
                              <span>{note.fileSize}</span>
                              <span>•</span>
                              <span>{note.uploadDate}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Small Compact Buttons */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {onOpenPdf && (
                            <button
                              onClick={() => onOpenPdf(note)}
                              title="पीडीएफ पढ़ें"
                              className="px-2 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 text-xs font-semibold flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3 text-slate-500" />
                              <span className="hidden sm:inline">पढ़ें</span>
                            </button>
                          )}

                          {onDownloadNote && (
                            <button
                              onClick={() => onDownloadNote(note)}
                              title={isDownloaded ? 'डाउनलोड हो चुका' : 'डाउनलोड करें'}
                              className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 active:scale-95 transition-all shadow-2xs ${
                                isDownloaded
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-[#0a2240] hover:bg-blue-900 text-white'
                              }`}
                            >
                              {isDownloaded ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>सेव्ड</span>
                                </>
                              ) : (
                                <>
                                  <Download className="w-3 h-3" />
                                  <span>डाउनलोड</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar: Conditional Buy / Enrolled state */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
          {isEnrolled ? (
            /* If Bought/Enrolled: "buy wala buten band kar do" -> replaced with Enrolled badge & Class start button */
            <>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">
                    नामांकित बैच (Enrolled)
                  </span>
                  <span className="text-xs font-semibold text-slate-700">पूर्ण एक्सेस उपलब्ध है</span>
                </div>
              </div>

              <button
                onClick={() => {
                  const firstLec = course.lectures?.[0];
                  if (firstLec) {
                    onClose();
                    onWatchDemo(firstLec.title, firstLec.videoUrl);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>क्लास शुरू करें</span>
              </button>
            </>
          ) : (
            /* If Not Enrolled: Show Course Fee & Buy/Enroll Button */
            <>
              <div>
                <span className="text-[10px] text-slate-500 block">कुल शुल्क (Course Fee)</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base sm:text-lg font-bold text-[#0a2240]">
                    {course.price === 0 ? 'FREE' : `₹${course.price}`}
                  </span>
                  {course.originalPrice > course.price && (
                    <span className="text-xs text-slate-400 line-through">₹{course.originalPrice}</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onEnroll(course);
                }}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all"
              >
                {course.price === 0 ? 'फ्री देखें (Enroll Free)' : 'अभी प्रवेश लें (Enroll Now)'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
