import React, { useState, useMemo } from 'react';
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
  Video,
  Plus,
  Search,
  Paperclip,
  Check,
  Lock,
  GraduationCap,
  FolderOpen,
} from 'lucide-react';
import { Course, NoteItem } from '../types';
import { PDF_NOTES } from '../data/mockData';
import { cmsStore } from '../services/cmsStore';

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
  allNotes?: NoteItem[];
}

export type CourseSubTabType = 'videos' | 'class_notes' | 'pdf_notes';

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
  allNotes = [],
}) => {
  // 3 Sub-Tables / Sub-Tabs as requested:
  // 1st: Video Lectures, 2nd: Class Notes, 3rd: PDF Notes & Typed Notes
  const [activeSubTab, setActiveSubTab] = useState<CourseSubTabType>('videos');
  const [searchQuery, setSearchQuery] = useState('');

  // Local storage for in-course uploaded notes
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteType, setNewNoteType] = useState<'typed' | 'pdf'>('typed');
  const [newNoteUrl, setNewNoteUrl] = useState('');
  const [newNoteSize, setNewNoteSize] = useState<number>(10.5);
  const [newNotePages, setNewNotePages] = useState<number>(16);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [customCourseNotes, setCustomCourseNotes] = useState<NoteItem[]>(() => {
    try {
      const saved = localStorage.getItem(`ags_course_notes_${course.id}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  if (!isOpen) return null;

  const isEnrolled = enrolledCourseIds.includes(course.id);

  // 1. COMPILE ALL VIDEO LECTURES (Strictly No Auto-play on entering)
  const allLectures = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      duration: string;
      isFreeDemo?: boolean;
      date: string;
      videoUrl?: string;
      chapterIndex?: number;
      chapterTitle?: string;
      hasNote?: boolean;
      noteTitle?: string;
    }> = [];

    // Check relational CMS store for this course's subjects & videos
    try {
      const cmsSubjects = cmsStore.getSubjects(course.id);
      if (cmsSubjects.length > 0) {
        cmsSubjects.forEach((subj) => {
          const cmsVideos = cmsStore.getVideos(subj.id);
          cmsVideos.forEach((v) => {
            const note = cmsStore.getNoteForVideo(v.id);
            list.push({
              id: v.id,
              title: v.title,
              duration: v.duration || '48:30',
              isFreeDemo: v.order_index === 1,
              date: '24 अक्टूबर 2026',
              videoUrl: v.video_url,
              chapterTitle: subj.title,
              hasNote: !!note,
              noteTitle: note?.title,
            });
          });
        });
      }
    } catch {
      // ignore
    }

    // Merge with course.lectures if any real ones exist
    (course.lectures || []).forEach((lec, idx) => {
      if (!list.some((l) => l.title.toLowerCase() === lec.title.toLowerCase())) {
        list.push({
          id: lec.id || `lec-${idx}`,
          title: lec.title,
          duration: lec.duration || '52:14',
          isFreeDemo: lec.isFreeDemo || idx === 0,
          date: lec.date || 'उपलब्ध VOD',
          videoUrl: lec.videoUrl || 'https://youtu.be/RTXwE6g3Q4U?si=IpkySZpDoS4xvXuf',
          chapterIndex: lec.chapterIndex,
          chapterTitle: lec.chapterTitle || (course.syllabus[idx % course.syllabus.length]?.title ?? 'फाउंडेशन इकाई'),
          hasNote: false,
          noteTitle: '',
        });
      }
    });

    // Zero dummy videos: if none uploaded, returns empty array so clear empty state shows
    return list;
  }, [course]);

  // 2. COMPILE ALL CLASS NOTES (Handwritten Classroom Notes linked to real uploaded lectures)
  const classNotesList = useMemo(() => {
    const list: Array<{
      id: string;
      chapterIndex: number;
      chapterTitle: string;
      lectureTitle: string;
      faculty: string;
      topics: string[];
      pages: number;
      sizeMb: string;
      uploadDate: string;
      format: 'हस्तलिखित क्लासरूम बोर्ड नोट्स';
      fileUrl: string;
    }> = [];

    // Find notes attached to allLectures
    allLectures.forEach((lec, idx) => {
      const note = cmsStore.getNoteForVideo(lec.id);
      if (note) {
        list.push({
          id: note.id,
          chapterIndex: idx + 1,
          chapterTitle: lec.chapterTitle || course.title,
          lectureTitle: lec.title,
          faculty: course.faculty || 'शांति लाल अहारी',
          topics: [note.title],
          pages: 14,
          sizeMb: String(note.file_size_mb || 12.5),
          uploadDate: new Date(note.created_at || Date.now()).toLocaleDateString('hi-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
          format: 'हस्तलिखित क्लासरूम बोर्ड नोट्स',
          fileUrl: note.file_url,
        });
      }
    });

    return list;
  }, [course, allLectures]);

  // 3. COMPILE ALL PDF NOTES & TYPED NOTES (Course Level Printable & E-Books)
  const pdfAndTypedNotesList = useMemo(() => {
    // 1. Fetch real uploaded printable notes from cmsStore
    const cmsPrintable = cmsStore.getPrintableNotes(course.id).map((p) => ({
      id: p.id,
      title: p.title,
      hindiTitle: p.title,
      subject: course.category,
      medium: 'Hindi' as const,
      pages: p.pages || 20,
      fileSize: `${p.file_size_mb || 8.5} MB`,
      downloadCount: 1,
      uploadDate: new Date(p.created_at || Date.now()).toLocaleDateString('hi-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      fileUrl: p.file_url,
      uploaderName: p.uploader_name || 'फैकल्टी',
      faculty: p.uploader_name || course.faculty,
      pdfContentSummary: `${p.title} - ${p.type === 'typed_ebook' ? 'टाइप्ड ई-बुक नोट्स' : 'प्रिंटेबल पीडीएफ नोट्स'}।`,
      previewPages: ['पेज 1: मुख्य सूत्र व विषय सारांश', 'पेज 2: महत्वपूर्ण अभ्यास प्रश्न संग्रह'],
    }));

    // 2. Fetch any real notes strictly bound to this course
    const courseSpecific = allNotes.filter(
      (n) => n.courseId && n.courseId === course.id
    );

    // Merge: custom in-course uploaded notes + cms printable notes + course-specific notes
    const combined = [...customCourseNotes, ...cmsPrintable, ...courseSpecific];
    const seen = new Set<string>();
    return combined.filter((item) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  }, [course, allNotes, customCourseNotes]);

  // Handle in-course Note Save
  const handleSaveInCourseNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;

    const newNote: NoteItem = {
      id: `course-note-${Date.now()}`,
      title: newNoteTitle.trim(),
      hindiTitle: newNoteTitle.trim(),
      subject: course.category,
      medium: 'Hindi',
      pages: Number(newNotePages) || 12,
      fileSize: `${newNoteSize} MB`,
      downloadCount: 1,
      uploadDate: new Date().toLocaleDateString('hi-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      previewPages: ['पेज 1: मुख्य बिंदु', 'पेज 2: प्रश्नोत्तरी'],
      pdfContentSummary: newNoteContent || `${newNoteTitle} - क्लासरूम में तैयार टाइप्ड एवं पीडीएफ सामग्री।`,
      fileUrl: newNoteUrl.trim() || 'https://example.com/notes/course-typed-note.pdf',
      fileName: `${newNoteTitle.trim().replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      isUploadedByAdmin: true,
      uploaderName: course.faculty || 'फैकल्टी',
      faculty: course.faculty || 'फैकल्टी',
      courseId: course.id,
    };

    const updated = [newNote, ...customCourseNotes];
    setCustomCourseNotes(updated);
    try {
      localStorage.setItem(`ags_course_notes_${course.id}`, JSON.stringify(updated));
    } catch {
      // ignore
    }

    setNewNoteTitle('');
    setNewNoteUrl('');
    setNewNoteContent('');
    setIsAddingNote(false);
  };

  // Filter items based on user search query
  const filteredLectures = useMemo(() => {
    if (!searchQuery.trim()) return allLectures;
    const q = searchQuery.toLowerCase();
    return allLectures.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        (l.chapterTitle && l.chapterTitle.toLowerCase().includes(q))
    );
  }, [allLectures, searchQuery]);

  const filteredClassNotes = useMemo(() => {
    if (!searchQuery.trim()) return classNotesList;
    const q = searchQuery.toLowerCase();
    return classNotesList.filter(
      (c) =>
        c.chapterTitle.toLowerCase().includes(q) ||
        c.lectureTitle.toLowerCase().includes(q) ||
        c.topics.some((t) => t.toLowerCase().includes(q))
    );
  }, [classNotesList, searchQuery]);

  const filteredPdfNotes = useMemo(() => {
    if (!searchQuery.trim()) return pdfAndTypedNotesList;
    const q = searchQuery.toLowerCase();
    return pdfAndTypedNotesList.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.hindiTitle?.toLowerCase().includes(q) ||
        n.subject.toLowerCase().includes(q)
    );
  }, [pdfAndTypedNotesList, searchQuery]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-3xl bg-white text-slate-900 rounded-t-3xl sm:rounded-2xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in slide-in-from-bottom duration-200">
        
        {/* 1. TOP MODAL HEADER */}
        <div className="bg-[#0a2240] text-white p-4 flex items-center justify-between shrink-0 border-b border-blue-900">
          <div className="pr-3 min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 border border-white/15">
                {course.category} • स्पेशल बैच
              </span>
              {isEnrolled ? (
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>प्रवेश पूर्ण (Active Access)</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded-full">
                  मात्र ₹199 में पूर्ण एक्सेस
                </span>
              )}
            </div>

            <h3 className="font-bold text-sm sm:text-base leading-snug truncate text-white">
              {course.hindiTitle || course.title}
            </h3>
            <p className="text-[11px] text-blue-200/90 truncate mt-0.5">
              मार्गदर्शन: {course.faculty} • वैधता: {course.validity}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white shrink-0 transition-all"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. THE 3 SUB-TABS (वीडियो लेक्चर | क्लास नोट्स | पीडीएफ/टाइपिंग नोट्स) */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 shrink-0">
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            {/* SUB-TAB 1: VIDEO LECTURES */}
            <button
              type="button"
              onClick={() => setActiveSubTab('videos')}
              className={`py-2.5 px-1.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 truncate border ${
                activeSubTab === 'videos'
                  ? 'bg-[#0a2240] text-white border-[#0a2240] shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Video className={`w-3.5 h-3.5 shrink-0 ${activeSubTab === 'videos' ? 'text-amber-400' : 'text-blue-600'}`} />
              <span className="truncate">1. वीडियो लेक्चर</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeSubTab === 'videos' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {allLectures.length}
              </span>
            </button>

            {/* SUB-TAB 2: CLASS NOTES */}
            <button
              type="button"
              onClick={() => setActiveSubTab('class_notes')}
              className={`py-2.5 px-1.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 truncate border ${
                activeSubTab === 'class_notes'
                  ? 'bg-[#0a2240] text-white border-[#0a2240] shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <FileText className={`w-3.5 h-3.5 shrink-0 ${activeSubTab === 'class_notes' ? 'text-amber-400' : 'text-indigo-600'}`} />
              <span className="truncate">2. क्लास नोट्स</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeSubTab === 'class_notes' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {classNotesList.length}
              </span>
            </button>

            {/* SUB-TAB 3: PDF NOTES & TYPED NOTES */}
            <button
              type="button"
              onClick={() => setActiveSubTab('pdf_notes')}
              className={`py-2.5 px-1.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 truncate border ${
                activeSubTab === 'pdf_notes'
                  ? 'bg-[#0a2240] text-white border-[#0a2240] shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <BookOpen className={`w-3.5 h-3.5 shrink-0 ${activeSubTab === 'pdf_notes' ? 'text-amber-400' : 'text-emerald-600'}`} />
              <span className="truncate">3. पीडीएफ व टाइप नोट्स</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeSubTab === 'pdf_notes' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {pdfAndTypedNotesList.length}
              </span>
            </button>
          </div>

          {/* Search bar inside the active sub-table */}
          <div className="relative mt-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeSubTab === 'videos'
                  ? 'वीडियो लेक्चर या टॉपिक खोजें...'
                  : activeSubTab === 'class_notes'
                  ? 'हस्तलिखित क्लास नोट्स खोजें...'
                  : 'पीडीएफ या टाइप्ड नोट्स खोजें...'
              }
              className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0a2240] shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 3. SCROLLABLE SUB-TABLE CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50">
          
          {/* ============================================================ */}
          {/* SUB-TABLE 1: 🎥 वीडियो लेक्चर (VIDEO LECTURES TABLE)         */}
          {/* Note: NO immediate video playback! Only plays when clicked.  */}
          {/* ============================================================ */}
          {activeSubTab === 'videos' && (
            <div className="space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-200">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-blue-700" />
                    <span>इकाई एवं अध्याय वार वीडियो लेक्चर्स (Video Lectures Sub-Table)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    सीधे वीडियो ऑटो-प्ले नहीं होगा; अपनी पसंद के लेक्चर के 'देखें (Play)' बटन पर क्लिक करें
                  </p>
                </div>

                <span className="text-[10px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-lg shrink-0">
                  कुल {filteredLectures.length} लेक्चर्स
                </span>
              </div>

              {filteredLectures.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                  <Video className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">
                    {searchQuery ? 'खोज के अनुसार कोई वीडियो लेक्चर नहीं मिला' : 'इस कोर्स में अभी कोई वीडियो अपलोड नहीं किया गया है'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {searchQuery ? 'कृपया खोज शब्द बदलें।' : 'जैसे ही आप या अधिकृत शिक्षक वीडियो अपलोड करेंगे, केवल वही वीडियो यहाँ दिखाई देगा।'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredLectures.map((lec, idx) => {
                    const isUnlocked = isEnrolled || lec.isFreeDemo;

                    return (
                      <div
                        key={lec.id || idx}
                        className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:shadow-xs transition-all"
                      >
                        {/* Left: Lecture Info */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-900 border border-blue-100 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            {idx + 1}
                          </div>

                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                  lec.isFreeDemo
                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                    : 'bg-blue-100 text-blue-900 border border-blue-200'
                                }`}
                              >
                                {lec.isFreeDemo ? 'फ्री डेमो (Free Demo)' : 'फुल क्लास (Full Class)'}
                              </span>

                              {lec.chapterTitle && (
                                <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded font-medium border border-slate-200 truncate max-w-[200px]">
                                  {lec.chapterTitle}
                                </span>
                              )}

                              <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{lec.duration}</span>
                              </span>
                            </div>

                            <h5 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                              {lec.title}
                            </h5>

                            {/* Linked Class Notes Status Indicator */}
                            {lec.hasNote && (
                              <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span className="truncate">
                                  {lec.noteTitle || 'क्लास नोट्स संलग्न हैं (Class Notes Attached)'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right: Play Action Button */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {isUnlocked ? (
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onWatchDemo(lec.title, lec.videoUrl);
                              }}
                              className="px-3.5 py-2 rounded-xl bg-[#0a2240] hover:bg-[#133560] active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                            >
                              <Play className="w-3 h-3 fill-current text-amber-400" />
                              <span>देखें (Play)</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onEnroll(course);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 text-xs font-bold flex items-center gap-1 shadow-2xs transition-all"
                            >
                              <Lock className="w-3 h-3" />
                              <span>प्रवेश लें (Unlock)</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* SUB-TABLE 2: 📝 क्लास नोट्स (HANDWRITTEN CLASSROOM NOTES)    */}
          {/* ============================================================ */}
          {activeSubTab === 'class_notes' && (
            <div className="space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-200">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-700" />
                    <span>हस्तलिखित क्लासरूम नोट्स एवं बोर्ड समरी (Class Notes Sub-Table)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    फैकल्टी द्वारा क्लास के दौरान पढ़ाए गए विषयों के हस्तलिखित नोट्स, फॉर्मूला शीट व आरेख
                  </p>
                </div>

                <span className="text-[10px] font-semibold text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-lg shrink-0">
                  कुल {filteredClassNotes.length} अध्याय हैंडआउट्स
                </span>
              </div>

              {filteredClassNotes.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">
                    {searchQuery ? 'खोज के अनुसार कोई क्लास नोट्स नहीं मिला' : 'इस कोर्स में अभी कोई क्लास नोट्स अपलोड नहीं हैं'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {searchQuery ? 'कृपया खोज शब्द बदलें।' : 'जब शिक्षक वीडियो लेक्चर के साथ क्लास हैंडआउट PDF अटैच करेंगे, वह सीधे यहाँ उपलब्ध होगी।'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredClassNotes.map((cn) => (
                    <div
                      key={cn.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 shadow-2xs hover:shadow-xs transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            {cn.chapterIndex}
                          </span>
                          <div>
                            <h5 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                              अध्याय {cn.chapterIndex} हस्तलिखित नोट्स: {cn.chapterTitle}
                            </h5>
                            <span className="text-[11px] text-slate-500">
                              शिक्षक: <strong>{cn.faculty}</strong> • {cn.pages} पृष्ठ • {cn.sizeMb} MB
                            </span>
                          </div>
                        </div>

                        {/* Read / Download Actions */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => {
                              if (onOpenPdf) {
                                onOpenPdf({
                                  id: cn.id,
                                  title: `${cn.chapterTitle} - हस्तलिखित क्लास नोट्स`,
                                  hindiTitle: `${cn.chapterTitle} - हस्तलिखित क्लास नोट्स`,
                                  subject: course.category,
                                  medium: 'Hindi',
                                  pages: cn.pages,
                                  fileSize: `${cn.sizeMb} MB`,
                                  downloadCount: 840,
                                  uploadDate: cn.uploadDate,
                                  previewPages: ['पेज 1: मुख्य सूत्र व अवधारणा', 'पेज 2: उदाहरण व विश्लेषण'],
                                  pdfContentSummary: `${cn.chapterTitle} के हस्तलिखित क्लासरूम नोट्स।`,
                                  fileUrl: cn.fileUrl,
                                  faculty: cn.faculty,
                                });
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl border border-indigo-200 hover:bg-indigo-50 text-indigo-950 font-bold text-xs flex items-center gap-1 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5 text-indigo-700" />
                            <span>पढ़ें</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (onDownloadNote) {
                                onDownloadNote({
                                  id: cn.id,
                                  title: `${cn.chapterTitle} - हस्तलिखित क्लास नोट्स`,
                                  hindiTitle: `${cn.chapterTitle} - हस्तलिखित क्लास नोट्स`,
                                  subject: course.category,
                                  medium: 'Hindi',
                                  pages: cn.pages,
                                  fileSize: `${cn.sizeMb} MB`,
                                  downloadCount: 840,
                                  uploadDate: cn.uploadDate,
                                  previewPages: [],
                                  pdfContentSummary: '',
                                  fileUrl: cn.fileUrl,
                                });
                              }
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                              downloadedNoteIds.includes(cn.id)
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                                : 'bg-[#0a2240] hover:bg-[#133560] text-white shadow-2xs'
                            }`}
                          >
                            {downloadedNoteIds.includes(cn.id) ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>सेव्ड</span>
                              </>
                            ) : (
                              <>
                                <Download className="w-3.5 h-3.5" />
                                <span>डाउनलोड</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Topics Covered Checklist */}
                      <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                          शामिल मुख्य बिंदु (Key Topics Covered):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {cn.topics.map((top, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-lg flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                              <span>{top}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* SUB-TABLE 3: 📄 पीडीएफ नोट्स एवं टाइपिंग नोट्स (PDF & TYPED) */}
          {/* ============================================================ */}
          {activeSubTab === 'pdf_notes' && (
            <div className="space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-200">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-700" />
                    <span>पीडीएफ नोट्स एवं टाइप्ड ई-बुक्स (PDF & Typed Notes Sub-Table)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    अध्यायवार प्रमाणित पीडीएफ नोट्स, टाइप्ड अध्ययन सामग्री व ई-बुक्स सीधे पढ़ें अथवा डाउनलोड करें
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingNote(!isAddingNote)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs shrink-0 self-start sm:self-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingNote ? 'फॉर्म बंद करें' : '+ नया नोट्स / टाइपिंग जोड़ें'}</span>
                </button>
              </div>

              {/* IN-COURSE UPLOAD FORM (When active) */}
              {isAddingNote && (
                <form
                  onSubmit={handleSaveInCourseNote}
                  className="p-4 rounded-2xl bg-white border-2 border-emerald-400 shadow-md space-y-3 animate-in zoom-in-95"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Paperclip className="w-4 h-4 text-emerald-600" />
                      <span>इस कोर्स के लिए नया पीडीएफ या टाइप्ड नोट्स जोड़ें</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingNote(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        नोट्स का शीर्षक (Note Title) *
                      </label>
                      <input
                        type="text"
                        value={newNoteTitle}
                        onChange={(e) => setNewNoteTitle(e.target.value)}
                        required
                        placeholder="उदा. अध्याय 1: महत्वपूर्ण फॉर्मूला व प्रश्न संग्रह"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        सामग्री का प्रकार (Type)
                      </label>
                      <select
                        value={newNoteType}
                        onChange={(e) => setNewNoteType(e.target.value as 'typed' | 'pdf')}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold bg-white"
                      >
                        <option value="typed">टाइप्ड ई-बुक / नोट्स (Typed Notes)</option>
                        <option value="pdf">पीडीएफ फाइल URL (PDF Document)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        पीडीएफ URL (वैकल्पिक)
                      </label>
                      <input
                        type="url"
                        value={newNoteUrl}
                        onChange={(e) => setNewNoteUrl(e.target.value)}
                        placeholder="https://example.com/notes.pdf"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        कुल पृष्ठ (Pages)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newNotePages}
                        onChange={(e) => setNewNotePages(parseInt(e.target.value) || 12)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        साइज (MB)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={newNoteSize}
                        onChange={(e) => setNewNoteSize(parseFloat(e.target.value) || 5.0)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      टाइपिंग नोट्स विवरण / सारांश (Typed Note Content / Summary)
                    </label>
                    <textarea
                      rows={3}
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      placeholder="यहाँ नोट्स के महत्वपूर्ण बिंदु या पूरा सार टाइप करें..."
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingNote(false)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"
                    >
                      रद्द करें
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                    >
                      सुरक्षित करें (Save to Course)
                    </button>
                  </div>
                </form>
              )}

              {/* LIST OF PDF & TYPED NOTES */}
              {filteredPdfNotes.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                  <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">
                    {searchQuery ? 'खोज के अनुसार कोई पीडीएफ नोट्स नहीं मिला' : 'इस कोर्स में अभी कोई प्रिंटेबल ई-बुक या पीडीएफ अपलोड नहीं है'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {searchQuery ? 'कृपया खोज शब्द बदलें अथवा नया नोट्स जोड़ें।' : 'जैसे ही आप या शिक्षक प्रिंटेबल ई-बुक/नोट्स पब्लिश करेंगे, वह तुरंत यहाँ उपलब्ध होगी।'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredPdfNotes.map((note) => {
                    const isDownloaded = downloadedNoteIds.includes(note.id);

                    return (
                      <div
                        key={note.id}
                        className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:shadow-xs transition-all"
                      >
                        {/* Note Metadata */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0 mt-0.5">
                            <FileText className="w-4 h-4" />
                          </div>

                          <div className="min-w-0 flex-1 space-y-0.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                                {'isUploadedByAdmin' in note && (note as any).isUploadedByAdmin ? 'टाइप्ड ई-बुक' : 'पीडीएफ नोट्स'}
                              </span>
                              <span className="text-[10px] text-slate-500 font-medium">
                                शिक्षक: {note.uploaderName || note.faculty || course.faculty}
                              </span>
                            </div>

                            <h5
                              onClick={() => onOpenPdf && onOpenPdf(note)}
                              className="font-bold text-xs sm:text-sm text-slate-900 leading-snug cursor-pointer hover:text-emerald-700 transition-colors line-clamp-1"
                            >
                              {note.hindiTitle || note.title}
                            </h5>

                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium flex-wrap">
                              <span>{note.pages} पृष्ठ</span>
                              <span>•</span>
                              <span>{note.fileSize}</span>
                              <span>•</span>
                              <span>अपलोड: {note.uploadDate}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions: View & Download */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {onOpenPdf && (
                            <button
                              type="button"
                              onClick={() => onOpenPdf(note)}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1 transition-all"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-600" />
                              <span>पढ़ें</span>
                            </button>
                          )}

                          {onDownloadNote && (
                            <button
                              type="button"
                              onClick={() => onDownloadNote(note)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                                isDownloaded
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                                  : 'bg-[#0a2240] hover:bg-[#133560] text-white shadow-2xs'
                              }`}
                            >
                              {isDownloaded ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>सेव्ड</span>
                                </>
                              ) : (
                                <>
                                  <Download className="w-3.5 h-3.5" />
                                  <span>डाउनलोड</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

        {/* 4. BOTTOM BAR (CONDITIONAL ADMISSION & HUB STATUS) */}
        <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          {isEnrolled ? (
            /* If Enrolled: Show clear confirmation that all 3 sub-tables are active; no auto video playback */
            <>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">
                    प्रवेश पूर्ण (Already Joined)
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    तीनों सब-टेबल अनलॉक हैं • अपनी पसंद का कंटेंट चुनें
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
                >
                  बंद करें
                </button>
              </div>
            </>
          ) : (
            /* If Not Enrolled: Show Course Fee & Active 'प्रवेश' Button */
            <>
              <div>
                <span className="text-[10px] text-slate-500 block">कुल शुल्क (Full Course Fee)</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base sm:text-lg font-extrabold text-[#0a2240] font-mono">
                    {course.price === 0 ? 'FREE' : `₹${course.price}`}
                  </span>
                  {course.originalPrice > course.price && (
                    <span className="text-xs text-slate-400 line-through">₹{course.originalPrice}</span>
                  )}
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    सभी 3 सब-टेबल शामिल
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEnroll(course);
                }}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all"
              >
                {course.price === 0 ? 'फ्री देखें' : 'प्रवेश'}
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
