/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { NoticeBoard } from './components/NoticeBoard';
import { HomeView } from './components/HomeView';
import { CoursesView } from './components/CoursesView';
import { TestsView } from './components/TestsView';
import { NotesView } from './components/NotesView';
import { MyCoursesView } from './components/MyCoursesView';
import { HelpDeskView } from './components/HelpDeskView';
import { ProfileView } from './components/ProfileView';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { TestRunnerModal } from './components/TestRunnerModal';
import { PdfViewerModal } from './components/PdfViewerModal';
import { EnrollModal } from './components/EnrollModal';
import { SyllabusModal } from './components/SyllabusModal';
import {
  COURSES,
  MOCK_TESTS,
  PDF_NOTES,
  INITIAL_USER,
} from './data/mockData';
import { TabType, Course, MockTest, NoteItem, UserProfile, ExamCategory, SheetClassRecord } from './types';
import { fetchGoogleSheetClasses, FALLBACK_SHEET_CLASSES } from './services/sheetService';
import { Smartphone, Monitor, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [language, setLanguage] = useState<'hi' | 'en'>('hi');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [downloadedNoteIds, setDownloadedNoteIds] = useState<string[]>([
    'note-history-handwritten',
  ]);
  const [selectedCourseCategory, setSelectedCourseCategory] = useState<ExamCategory>('All');
  const [viewMode, setViewMode] = useState<'mobile' | 'responsive'>('mobile');

  // Google Sheet live classes state
  const [sheetClasses, setSheetClasses] = useState<SheetClassRecord[]>(FALLBACK_SHEET_CLASSES);
  const [isSheetLoading, setIsSheetLoading] = useState<boolean>(false);

  // Notes state
  const [allNotes] = useState<NoteItem[]>(() => {
    try {
      localStorage.removeItem('ags_custom_admin_notes');
    } catch (e) {
      // ignore
    }
    return PDF_NOTES;
  });

  // Modal States
  const [videoModal, setVideoModal] = useState<{
    isOpen: boolean;
    lectureTitle: string;
    courseTitle: string;
    videoUrl?: string;
  }>({
    isOpen: false,
    lectureTitle: '',
    courseTitle: '',
    videoUrl: undefined,
  });

  const [testModal, setTestModal] = useState<{
    isOpen: boolean;
    test: MockTest | null;
  }>({
    isOpen: false,
    test: null,
  });

  const [pdfModal, setPdfModal] = useState<{
    isOpen: boolean;
    note: NoteItem | null;
  }>({
    isOpen: false,
    note: null,
  });

  const [enrollModal, setEnrollModal] = useState<{
    isOpen: boolean;
    course: Course | null;
  }>({
    isOpen: false,
    course: null,
  });

  const [syllabusModal, setSyllabusModal] = useState<{
    isOpen: boolean;
    course: Course | null;
  }>({
    isOpen: false,
    course: null,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadSheetData = async (isInitial = false) => {
    if (!isInitial) setIsSheetLoading(true);
    try {
      const res = await fetchGoogleSheetClasses();
      if (res.classes && res.classes.length > 0) {
        setSheetClasses(res.classes);
      }
      if (!isInitial) {
        showToast(`Google Sheet से ${res.classes.length} कक्षाएं सफलतापूर्वक लोड हुईं!`);
      }
    } catch (err) {
      console.error('Failed to load sheet classes:', err);
      if (!isInitial) showToast('Google Sheet डेटा लोड करने में समस्या, कैश्ड डेटा प्रयुक्त।');
    } finally {
      if (!isInitial) setIsSheetLoading(false);
    }
  };

  useEffect(() => {
    loadSheetData(true);
  }, []);

  // Handlers
  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'hi' ? 'en' : 'hi'));
  };

  const handleResumeLecture = (courseTitle: string, lectureTitle: string, videoUrl?: string) => {
    let resolvedVideoUrl = videoUrl;
    if (!resolvedVideoUrl) {
      const match = sheetClasses.find(
        (c) =>
          c.title.toLowerCase().includes(lectureTitle.toLowerCase()) ||
          lectureTitle.toLowerCase().includes(c.title.toLowerCase()) ||
          c.batch.toLowerCase().includes(courseTitle.toLowerCase())
      );
      resolvedVideoUrl = match
        ? match.videoUrl
        : (sheetClasses[0]?.videoUrl || 'https://youtu.be/RTXwE6g3Q4U?si=IpkySZpDoS4xvXuf');
    }

    setVideoModal({
      isOpen: true,
      lectureTitle,
      courseTitle,
      videoUrl: resolvedVideoUrl,
    });
  };

  const handleStartTest = (test: MockTest) => {
    setTestModal({
      isOpen: true,
      test,
    });
  };

  const handleOpenPdf = (note: NoteItem) => {
    setPdfModal({
      isOpen: true,
      note,
    });
  };

  const handleDownloadNote = (note: NoteItem) => {
    if (!downloadedNoteIds.includes(note.id)) {
      setDownloadedNoteIds((prev) => [...prev, note.id]);
      setUser((prev) => ({
        ...prev,
        downloadedNotesCount: prev.downloadedNotesCount + 1,
      }));
    }

    if (note.fileUrl) {
      const link = document.createElement('a');
      link.href = note.fileUrl;
      link.download = note.fileName || `${note.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    showToast(`"${note.title.slice(0, 32)}..." डाउनलोड हो चुका है!`);
  };

  const handleEnrollSuccess = (courseId: string) => {
    if (!user.enrolledCourseIds.includes(courseId)) {
      setUser((prev) => ({
        ...prev,
        enrolledCourseIds: [...prev.enrolledCourseIds, courseId],
      }));
    }
    showToast('बैच में प्रवेश सफल! My Batches में जोड़ा गया।');
  };

  const handleCategoryFromHome = (categoryName: string) => {
    const validCategory = categoryName as ExamCategory;
    setSelectedCourseCategory(validCategory);
    setActiveTab('courses');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-start text-slate-900 selection:bg-[#0a2240] selection:text-white">
      {/* Top Desktop Frame Switcher Bar */}
      <div className="w-full bg-slate-950/90 text-slate-300 py-1.5 px-4 text-[11px] hidden sm:flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-semibold text-slate-200">
            AHARI GLOBAL STUDIES (AGS) • Mobile-First EdTech Platform
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-0.5 border border-slate-800">
          <button
            onClick={() => setViewMode('mobile')}
            className={`px-2.5 py-1 rounded-md text-[10px] font-semibold flex items-center gap-1 transition-all ${
              viewMode === 'mobile'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>मोबाइल व्यू (Mobile App)</span>
          </button>
          <button
            onClick={() => setViewMode('responsive')}
            className={`px-2.5 py-1 rounded-md text-[10px] font-semibold flex items-center gap-1 transition-all ${
              viewMode === 'responsive'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3 h-3" />
            <span>रेस्पॉन्सिव (Full Width)</span>
          </button>
        </div>
      </div>

      {/* Main App Container */}
      <div
        className={`w-full bg-[#f8fafc] min-h-screen relative flex flex-col transition-all duration-300 ${
          viewMode === 'mobile'
            ? 'sm:max-w-md sm:my-4 sm:rounded-3xl sm:shadow-2xl sm:border-[8px] sm:border-slate-800 sm:min-h-[860px] overflow-hidden'
            : 'max-w-4xl shadow-xl'
        }`}
      >
        {/* Top App Header */}
        <Header
          currentLanguage={language}
          onToggleLanguage={handleToggleLanguage}
          targetExam={user.targetExam}
        />

        {/* Notice Board Ticker (Active on Home and visible) */}
        {activeTab === 'home' && (
          <NoticeBoard
            language={language}
            onViewAll={() => setActiveTab('courses')}
          />
        )}

        {/* Scrollable Main Views Area */}
        <main className="flex-1 px-4 pt-4 overflow-y-auto">
          {activeTab === 'home' && (
            <HomeView
              language={language}
              onNavigateTab={setActiveTab}
              onOpenCourseSyllabus={(course) => setSyllabusModal({ isOpen: true, course })}
              onEnrollCourse={(course) => setEnrollModal({ isOpen: true, course })}
              onResumeLecture={handleResumeLecture}
              onSelectCategoryFilter={handleCategoryFromHome}
              onStartDailyQuiz={() => {
                const quiz = MOCK_TESTS.find((t) => t.isDailyQuiz) || MOCK_TESTS[0];
                handleStartTest(quiz);
              }}
            />
          )}

          {activeTab === 'my-courses' && (
            <MyCoursesView
              user={user}
              language={language}
              onOpenCourse={(course) => setSyllabusModal({ isOpen: true, course })}
              onResumeLecture={handleResumeLecture}
              onExploreCourses={() => setActiveTab('courses')}
            />
          )}

          {activeTab === 'courses' && (
            <CoursesView
              language={language}
              initialCategory={selectedCourseCategory}
              onOpenSyllabus={(course) => setSyllabusModal({ isOpen: true, course })}
              onEnroll={(course) => setEnrollModal({ isOpen: true, course })}
              onResumeLecture={handleResumeLecture}
              sheetClasses={sheetClasses}
              isSheetLoading={isSheetLoading}
              onRefreshSheet={() => loadSheetData(false)}
            />
          )}

          {activeTab === 'tests' && (
            <TestsView
              language={language}
              onStartTest={handleStartTest}
            />
          )}

          {activeTab === 'notes' && (
            <NotesView
              language={language}
              onOpenPdf={handleOpenPdf}
              onDownloadNote={handleDownloadNote}
              downloadedNoteIds={downloadedNoteIds}
              notes={allNotes}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              user={user}
              language={language}
              onToggleLanguage={handleToggleLanguage}
              onOpenCourse={(course) => setSyllabusModal({ isOpen: true, course })}
              onResumeLecture={handleResumeLecture}
            />
          )}

          {activeTab === 'helpdesk' && (
            <HelpDeskView
              user={user}
              language={language}
            />
          )}
        </main>

        {/* Persistent 5-Tab Bottom Navigation Bar */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          language={language}
          badgeCounts={{
            courses: COURSES.filter((c) => c.isLiveNow).length,
            tests: 1, // 1 Daily Quiz live
          }}
        />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-20 left-6 right-6 z-50 max-w-sm mx-auto p-3.5 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200 border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="flex-1">{toastMessage}</span>
          </div>
        )}
      </div>

      {/* Global Interactive Modals */}

      {/* 1. Video Player Modal */}
      <VideoPlayerModal
        isOpen={videoModal.isOpen}
        onClose={() =>
          setVideoModal({ isOpen: false, lectureTitle: '', courseTitle: '', videoUrl: undefined })
        }
        lectureTitle={videoModal.lectureTitle}
        courseTitle={videoModal.courseTitle}
        videoUrl={videoModal.videoUrl}
        facultyName="शांति लाल अहारी (Shanti Lal Ahari)"
        onOpenNotes={() => {
          setActiveTab('notes');
          const note = PDF_NOTES[0];
          handleOpenPdf(note);
        }}
      />

      {/* 2. CBT Mock Test Runner Modal */}
      {testModal.test && (
        <TestRunnerModal
          isOpen={testModal.isOpen}
          onClose={() => setTestModal({ isOpen: false, test: null })}
          test={testModal.test}
          defaultLang={language}
        />
      )}

      {/* 3. PDF Notes Reader Modal */}
      {pdfModal.note && (
        <PdfViewerModal
          isOpen={pdfModal.isOpen}
          onClose={() => setPdfModal({ isOpen: false, note: null })}
          note={pdfModal.note}
          onDownloadCompleted={(id) => {
            if (!downloadedNoteIds.includes(id)) {
              setDownloadedNoteIds((prev) => [...prev, id]);
            }
          }}
        />
      )}

      {/* 4. Course Enrollment & Checkout Modal */}
      {enrollModal.course && (
        <EnrollModal
          isOpen={enrollModal.isOpen}
          onClose={() => setEnrollModal({ isOpen: false, course: null })}
          course={enrollModal.course}
          onSuccess={handleEnrollSuccess}
        />
      )}

      {/* 5. Detailed Course Syllabus Modal */}
      {syllabusModal.course && (
        <SyllabusModal
          isOpen={syllabusModal.isOpen}
          onClose={() => setSyllabusModal({ isOpen: false, course: null })}
          course={syllabusModal.course}
          onWatchDemo={(lecTitle, vUrl) => {
            handleResumeLecture(syllabusModal.course!.title, lecTitle, vUrl);
          }}
          onEnroll={(course) => {
            setEnrollModal({ isOpen: true, course });
          }}
        />
      )}
    </div>
  );
}
