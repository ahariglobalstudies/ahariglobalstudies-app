import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  ShieldCheck,
  Lock,
  LogOut,
  Upload,
  FileText,
  Newspaper,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
  Eye,
  Sparkles,
  BookOpen,
  Send,
  Layers,
  ChevronDown,
  Clock,
  ArrowRight,
  ExternalLink,
  Plus,
  Edit2,
  RefreshCw,
  Search,
  Filter,
  Paperclip,
  Database,
  Copy,
  Check,
  UserCheck,
  FolderPlus,
  Video,
  FileCode,
  Users,
  GraduationCap,
  Key,
  Download,
  PenTool,
} from 'lucide-react';
import {
  DbUser,
  DbCourse,
  DbCourseTeacher,
  DbSubject,
  DbVideo,
  DbNote,
  DbEditorial,
  DashboardContentRow,
  EditorialType,
  EditorialStatus,
} from '../types/cms';
import { cmsStore, INITIAL_USERS } from '../services/cmsStore';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast?: (msg: string) => void;
  onDataChanged?: () => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  showToast,
  onDataChanged,
}) => {
  // Current Authenticated User (admin, teacher, or staff)
  const [currentUser, setCurrentUser] = useState<DbUser | null>(() => cmsStore.getCurrentUser());

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('shantilalmeena994@gmail.com');
  const [loginPin, setLoginPin] = useState('9940');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Admin View Tab
  const [activeAdminTab, setActiveAdminTab] = useState<'upload' | 'dashboard' | 'editorials' | 'teachers' | 'sql'>('upload');

  // --- CASCADING UPLOAD FORM STATE ---
  // Step 0: Upload Category Toggle: 'paid_course' vs 'editorial'
  const [uploadCategory, setUploadCategory] = useState<'paid_course' | 'editorial'>('paid_course');

  // Paid Course Content Cascading Dropdowns State:
  // Step 1: Course
  const [coursesList, setCoursesList] = useState<DbCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [isAddingNewCourse, setIsAddingNewCourse] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');

  // Step 2: Subject (strictly filtered to selectedCourseId)
  const [subjectsList, setSubjectsList] = useState<DbSubject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [isAddingNewSubject, setIsAddingNewSubject] = useState(false);
  const [newSubjectTitle, setNewSubjectTitle] = useState('');

  // Step 3: Video (strictly filtered to selectedSubjectId)
  const [videosList, setVideosList] = useState<DbVideo[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string>('');
  const [isAddingNewVideo, setIsAddingNewVideo] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoDuration, setNewVideoDuration] = useState('48:30');

  // Step 4: Notes Upload
  const [noteTitle, setNoteTitle] = useState('क्षेत्रमिति मेंसुरेशन हस्तलिखित क्लासरूम नोट्स - कागद सर');
  const [noteFileUrl, setNoteFileUrl] = useState('https://example.com/notes/mensuration-paper-sir.pdf');
  const [noteSizeMb, setNoteSizeMb] = useState<number>(14.2);
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  // --- 3-PHASE COURSE CONTENT UPLOADER STATE ---
  // 1: Video Lecture -> 2: Class Handout PDF -> 3: Printable PDF / Typed E-Book
  const [courseUploadPhase, setCourseUploadPhase] = useState<1 | 2 | 3>(1);

  // Phase 3: Printable PDF / Typed E-Book Upload State
  const [pnoteTitle, setPnoteTitle] = useState('');
  const [pnoteType, setPnoteType] = useState<'printable_pdf' | 'typed_ebook'>('printable_pdf');
  const [pnoteFileUrl, setPnoteFileUrl] = useState('');
  const [pnotePages, setPnotePages] = useState<number>(20);
  const [pnoteSizeMb, setPnoteSizeMb] = useState<number>(8.5);
  const [isSubmittingPrintable, setIsSubmittingPrintable] = useState(false);

  // --- TEACHER APPOINTMENT & ID GENERATOR STATE ---
  const [appointName, setAppointName] = useState('');
  const [appointEmail, setAppointEmail] = useState('');
  const [appointPin, setAppointPin] = useState(() => String(Math.floor(1000 + Math.random() * 9000)));
  const [appointSpecialty, setAppointSpecialty] = useState('');
  const [appointCourseIds, setAppointCourseIds] = useState<string[]>([]);
  const [appointedResult, setAppointedResult] = useState<{
    teacher: DbUser;
    plainPin: string;
    teacherDisplayId: string;
    courseTitles: string[];
  } | null>(null);
  const [copiedCredentials, setCopiedCredentials] = useState(false);

  // --- EDITORIAL / CURRENT AFFAIRS FORM STATE ---
  const [edtType, setEdtType] = useState<EditorialType>('current_affairs');
  const [edtCategory, setEdtCategory] = useState('पर्यावरण एवं ऊर्जा (Environment & Energy)');
  const [edtTitle, setEdtTitle] = useState('');
  const [edtSlug, setEdtSlug] = useState('');
  const [edtContent, setEdtContent] = useState('');
  const [edtPdfUrl, setEdtPdfUrl] = useState('');
  const [edtPublishDate, setEdtPublishDate] = useState(new Date().toISOString().split('T')[0]);
  const [edtStatus, setEdtStatus] = useState<EditorialStatus>('published');
  const [edtEditorMode, setEdtEditorMode] = useState<'write' | 'preview'>('write');

  // --- DASHBOARD TABLE STATE ---
  const [tableCourseFilter, setTableCourseFilter] = useState<string>('all');
  const [tableStatusFilter, setTableStatusFilter] = useState<'all' | 'attached' | 'missing'>('all');
  const [tableSearchQuery, setTableSearchQuery] = useState<string>('');
  const [dashboardRows, setDashboardRows] = useState<DashboardContentRow[]>([]);

  // Modal for Quick Replace / Attach PDF from Dashboard Table
  const [attachModalVideo, setAttachModalVideo] = useState<DashboardContentRow | null>(null);
  const [replaceTitle, setReplaceTitle] = useState('');
  const [replaceUrl, setReplaceUrl] = useState('');
  const [replaceSize, setReplaceSize] = useState<number>(12.5);

  // SQL Copy Feedback
  const [copiedSql, setCopiedSql] = useState(false);

  // Sync CMS Data
  const refreshCmsData = (userOverride?: DbUser | null) => {
    const user = userOverride !== undefined ? userOverride : (currentUser || cmsStore.getCurrentUser());
    const courses = cmsStore.getCourses(user);
    setCoursesList(courses);

    if (courses.length > 0) {
      if (!selectedCourseId || !courses.some((c) => c.id === selectedCourseId)) {
        setSelectedCourseId(courses[0].id);
      }
    } else {
      setSelectedCourseId('');
    }

    // Refresh dashboard rows scoped to user role
    const rows = cmsStore.getDashboardContentRows(tableCourseFilter, tableStatusFilter, tableSearchQuery, user);
    setDashboardRows(rows);

    if (onDataChanged) {
      onDataChanged();
    }
  };

  useEffect(() => {
    if (isOpen) {
      const user = cmsStore.getCurrentUser();
      setCurrentUser(user);
      refreshCmsData(user);
    }
  }, [isOpen]);

  // Update Subjects when Course selection changes (scoped to user)
  useEffect(() => {
    if (selectedCourseId) {
      const subjects = cmsStore.getSubjects(selectedCourseId, currentUser);
      setSubjectsList(subjects);
      if (subjects.length > 0) {
        setSelectedSubjectId(subjects[0].id);
      } else {
        setSelectedSubjectId('');
      }
    } else {
      setSubjectsList([]);
      setSelectedSubjectId('');
    }
    setIsAddingNewSubject(false);
  }, [selectedCourseId, currentUser]);

  // Update Videos when Subject selection changes (scoped to user)
  useEffect(() => {
    if (selectedSubjectId) {
      const videos = cmsStore.getVideos(selectedSubjectId, currentUser);
      setVideosList(videos);
      if (videos.length > 0) {
        setSelectedVideoId(videos[0].id);
      } else {
        setSelectedVideoId('');
      }
    } else {
      setVideosList([]);
      setSelectedVideoId('');
    }
    setIsAddingNewVideo(false);
  }, [selectedSubjectId, currentUser]);

  // Update Note Title default based on selected video
  useEffect(() => {
    if (selectedVideoId) {
      const vid = videosList.find((v) => v.id === selectedVideoId);
      if (vid) {
        const existingNote = cmsStore.getNoteForVideo(vid.id);
        if (existingNote) {
          setNoteTitle(existingNote.title);
          setNoteFileUrl(existingNote.file_url);
          setNoteSizeMb(existingNote.file_size_mb);
        } else {
          setNoteTitle(`${vid.title} - हस्तलिखित क्लासरूम नोट्स`);
        }
      }
    }
  }, [selectedVideoId, videosList]);

  // Update Dashboard rows on filter changes
  useEffect(() => {
    const rows = cmsStore.getDashboardContentRows(tableCourseFilter, tableStatusFilter, tableSearchQuery, currentUser);
    setDashboardRows(rows);
  }, [tableCourseFilter, tableStatusFilter, tableSearchQuery, currentUser]);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const result = cmsStore.authenticate(loginEmail, loginPin);
    if (!result.success) {
      setLoginError(result.error || 'लॉगिन विफल');
      return;
    }
    setCurrentUser(result.user || null);
    if (showToast) {
      showToast(`स्वागत है ${result.user?.name}! भूमिका: ${result.user?.role}`);
    }
    refreshCmsData(result.user);
  };

  // Handle Logout
  const handleLogout = () => {
    cmsStore.logout();
    setCurrentUser(null);
    if (showToast) {
      showToast('सफलतापूर्वक लॉगआउट किया गया।');
    }
    refreshCmsData(null);
  };

  // Quick preset login for testing (Admin, Teachers, Staff)
  const handleQuickLogin = (preset: 'admin' | 'staff' | 'teacher_kagad' | 'teacher_bhavesh') => {
    if (preset === 'admin') {
      setLoginEmail('shantilalmeena994@gmail.com');
      setLoginPin('9940');
    } else if (preset === 'teacher_kagad') {
      setLoginEmail('kagad.sir@ags.edu');
      setLoginPin('5555');
    } else if (preset === 'teacher_bhavesh') {
      setLoginEmail('bhavesh.faculty@ags.edu');
      setLoginPin('7777');
    } else {
      setLoginEmail('staff@ags.edu');
      setLoginPin('1234');
    }
  };

  // Toggle Teacher Course Assignment (Admin Only)
  const handleToggleCourseTeacher = (
    courseId: string,
    teacherId: string,
    teacherName: string,
    courseTitle: string
  ) => {
    const assignedIds = cmsStore.getTeacherAssignedCourseIds(teacherId);
    const isAssigned = assignedIds.includes(courseId);
    if (isAssigned) {
      cmsStore.removeTeacherFromCourse(courseId, teacherId);
      if (showToast) showToast(`✕ ${teacherName} से "${courseTitle}" का एक्सेस हटाया गया।`);
    } else {
      cmsStore.assignTeacherToCourse(courseId, teacherId);
      if (showToast) showToast(`✓ ${teacherName} को "${courseTitle}" असाइन किया गया।`);
    }
    refreshCmsData();
  };

  // Quick switch test session to teacher
  const handleSwitchToTeacherTest = (teacher: DbUser) => {
    cmsStore.setCurrentUser(teacher);
    setCurrentUser(teacher);
    setActiveAdminTab('upload');
    refreshCmsData(teacher);
    if (showToast) {
      showToast(`👨‍🏫 शिक्षक टेस्ट मोड सक्रिय: ${teacher.name}`);
    }
  };

  // Handle Create Course
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;
    const slug = newCourseTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const created = cmsStore.addCourse({
      title: newCourseTitle.trim(),
      slug: slug || `course-${Date.now()}`,
      is_published: true,
    });
    setNewCourseTitle('');
    setIsAddingNewCourse(false);
    refreshCmsData();
    setSelectedCourseId(created.id);
    if (showToast) showToast(`कोर्स जोड़ा गया: "${created.title}"`);
  };

  // Handle Create Subject
  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectTitle.trim() || !selectedCourseId) return;
    const count = subjectsList.length;
    const created = cmsStore.addSubject({
      course_id: selectedCourseId,
      title: newSubjectTitle.trim(),
      order_index: count + 1,
    });
    setNewSubjectTitle('');
    setIsAddingNewSubject(false);
    const updated = cmsStore.getSubjects(selectedCourseId);
    setSubjectsList(updated);
    setSelectedSubjectId(created.id);
    refreshCmsData();
    if (showToast) showToast(`विषय जोड़ा गया: "${created.title}"`);
  };

  // Handle Create Video
  const handleCreateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle.trim() || !selectedSubjectId) return;
    const count = videosList.length;
    const created = cmsStore.addVideo({
      subject_id: selectedSubjectId,
      title: newVideoTitle.trim(),
      video_url: newVideoUrl.trim() || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: newVideoDuration.trim() || '45:00',
      order_index: count + 1,
    });
    setNewVideoTitle('');
    setNewVideoUrl('');
    setIsAddingNewVideo(false);
    const updated = cmsStore.getVideos(selectedSubjectId);
    setVideosList(updated);
    setSelectedVideoId(created.id);
    refreshCmsData();
    if (showToast) showToast(`वीडियो जोड़ा गया: "${created.title}"`);
  };

  // Handle Step 4: Attach Notes to Video
  const handleAttachNotesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVideoId) {
      if (showToast) showToast('कृपया पहले स्टेप 3 में वीडियो/लेक्चर चुनें!');
      return;
    }
    if (!noteTitle.trim()) {
      if (showToast) showToast('कृपया नोट्स का शीर्षक दर्ज करें!');
      return;
    }

    setIsSubmittingNote(true);
    try {
      const savedNote = cmsStore.attachNote({
        video_id: selectedVideoId,
        title: noteTitle.trim(),
        file_url: noteFileUrl.trim() || 'https://example.com/notes/classroom-notes.pdf',
        file_size_mb: Number(noteSizeMb) || 12.5,
      });

      refreshCmsData();
      if (showToast) {
        showToast(`✓ क्लास हैंडआउट नोट्स जुड़े! (वीडियो: ${selectedVideoId})`);
      }
      // Suggest moving to Phase 3 (Printable Notes)
      setCourseUploadPhase(3);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  // Handle Phase 3: Create Printable PDF / Typed E-Book
  const handleCreatePrintableNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) {
      if (showToast) showToast('कृपया पहले कोर्स चुनें!');
      return;
    }
    if (!pnoteTitle.trim()) {
      if (showToast) showToast('कृपया प्रिंटेबल नोट्स/ई-बुक का शीर्षक दर्ज करें!');
      return;
    }

    setIsSubmittingPrintable(true);
    try {
      const created = cmsStore.addPrintableNote({
        course_id: selectedCourseId,
        title: pnoteTitle.trim(),
        type: pnoteType,
        file_url: pnoteFileUrl.trim() || 'https://example.com/notes/course-printable.pdf',
        pages: Number(pnotePages) || 20,
        file_size_mb: Number(pnoteSizeMb) || 8.5,
        uploaded_by: currentUser?.id,
        uploader_name: currentUser?.name,
      });

      setPnoteTitle('');
      setPnoteFileUrl('');
      refreshCmsData();
      if (showToast) {
        showToast(`✓ प्रिंटेबल नोट्स/ई-बुक "${created.title}" सफलतापूर्वक प्रकाशित!`);
      }
    } finally {
      setIsSubmittingPrintable(false);
    }
  };

  // Handle Appointing a Teacher (Admin Only)
  const handleAppointTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointName.trim()) {
      if (showToast) showToast('कृपया शिक्षक का नाम दर्ज करें!');
      return;
    }

    const cleanEmail =
      appointEmail.trim().toLowerCase() ||
      `${appointName.toLowerCase().replace(/[^a-z0-9]/g, '')}.faculty@ags.edu`;

    const result = cmsStore.addTeacher({
      name: appointName.trim(),
      email: cleanEmail,
      password_pin: appointPin,
      subject_specialty: appointSpecialty.trim() || 'संकाय विशेषज्ञ (Faculty)',
      course_ids: appointCourseIds,
    });

    const allCourses = cmsStore.getCourses(INITIAL_USERS[0]);
    const assignedTitles = allCourses
      .filter((c) => appointCourseIds.includes(c.id))
      .map((c) => c.title);

    setAppointedResult({
      teacher: result.teacher,
      plainPin: result.plainPin,
      teacherDisplayId: result.teacherDisplayId,
      courseTitles: assignedTitles,
    });

    // Reset inputs
    setAppointName('');
    setAppointEmail('');
    setAppointPin(String(Math.floor(1000 + Math.random() * 9000)));
    setAppointSpecialty('');
    setAppointCourseIds([]);
    refreshCmsData();

    if (showToast) {
      showToast(`✓ शिक्षक "${result.teacher.name}" नियुक्त! आईडी: ${result.teacherDisplayId}`);
    }
  };

  const handleCopyCredentials = () => {
    if (!appointedResult) return;
    const text = `AHARI Global Studies (AGS) शिक्षक नियुक्ति विवरण:\nशिक्षक का नाम: ${appointedResult.teacher.name}\nशिक्षक आईडी (Teacher ID): ${appointedResult.teacherDisplayId}\nलॉगिन ईमेल: ${appointedResult.teacher.email}\nसुरक्षा पिन (PIN): ${appointedResult.plainPin}\nविशेषज्ञता: ${appointedResult.teacher.subject_specialty}\nअसाइन किए गए कोर्स: ${appointedResult.courseTitles.join(', ') || 'सभी'}\n\nपोर्टल लिंक: AHARI Global Studies Admin/Teacher Portal`;

    navigator.clipboard.writeText(text);
    setCopiedCredentials(true);
    setTimeout(() => setCopiedCredentials(false), 2500);
    if (showToast) showToast('📋 शिक्षक क्रेडेंशियल कॉपी हो गए! WhatsApp/SMS पर साझा करें।');
  };

  const handleDeleteTeacher = (teacherId: string, teacherName: string) => {
    if (window.confirm(`क्या आप शिक्षक "${teacherName}" की नियुक्ति व उनके कोर्स आवंटन को हटाना चाहते हैं?`)) {
      cmsStore.deleteTeacher(teacherId);
      refreshCmsData();
      if (showToast) showToast(`शिक्षक "${teacherName}" का खाता हटा दिया गया।`);
    }
  };

  // Handle Editorial Submit (Draft or Published)
  const handleSaveEditorial = (statusToSave: EditorialStatus) => {
    if (!edtTitle.trim()) {
      if (showToast) showToast('कृपया लेख का शीर्षक दर्ज करें!');
      return;
    }
    if (!edtContent.trim()) {
      if (showToast) showToast('कृपया लेख का विवरण/सामग्री दर्ज करें!');
      return;
    }

    const slug =
      edtSlug.trim() ||
      edtTitle
        .toLowerCase()
        .replace(/[^a-z0-9\u0900-\u097F]+/g, '-')
        .replace(/(^-|-$)+/g, '') ||
      `article-${Date.now()}`;

    const saved = cmsStore.saveEditorial({
      type: edtType,
      category: edtCategory,
      title: edtTitle.trim(),
      slug,
      content: edtContent.trim(),
      pdf_url: edtPdfUrl.trim() || undefined,
      publish_date: edtPublishDate || new Date().toISOString().split('T')[0],
      status: statusToSave,
    });

    refreshCmsData();
    if (showToast) {
      showToast(
        statusToSave === 'published'
          ? '✓ संपादकीय/करंट अफेयर सीधे लाइव पब्लिश हो गया!'
          : '✓ ड्राफ्ट सुरक्षित कर लिया गया है।'
      );
    }

    // Reset Editorial Form
    setEdtTitle('');
    setEdtSlug('');
    setEdtContent('');
    setEdtPdfUrl('');
  };

  // Preload PM Surya Ghar Template into Editor
  const handleLoadPmSuryaGharTemplate = () => {
    setEdtType('current_affairs');
    setEdtCategory('पर्यावरण एवं ऊर्जा (Environment & Energy)');
    setEdtTitle("भारत में नवीकरणीय ऊर्जा और रूफटॉप सोलर क्रांति: 'पीएम सूर्य घर' का प्रभाव");
    setEdtSlug('india-renewable-energy-rooftop-solar-pm-surya-ghar');
    setEdtPdfUrl('https://example.com/editorials/pm-surya-ghar-analysis.pdf');
    setEdtContent(`## 1. चर्चा में क्यों?
भारत ने वर्ष 2030 तक 500 गीगावाट (GW) गैर-जीवाश्म ईंधन आधारित बिजली क्षमता हासिल करने का राष्ट्रीय लक्ष्य रखा है। इस दिशा में विकेंद्रीकृत सौर ऊर्जा (Decentralized Solar Power) को बढ़ावा देने के लिए संचालित ‘पीएम सूर्य घर: मुफ्त बिजली योजना’ देश भर में घरेलू और संस्थागत स्तर पर ऊर्जा आत्मनिर्भरता का प्रमुख आधार बनकर उभरी है।

## 2. योजना की मुख्य विशेषताएं (Exam Key Points)
- **नोडल मंत्रालय:** नवीन एवं नवीकरणीय ऊर्जा मंत्रालय (MNRE)।
- **लक्ष्य:** देश के 1 करोड़ घरों की छतों पर सोलर पैनल स्थापित करना।
- **मुफ्त बिजली प्रावधान:** इसके तहत प्रत्येक पात्र परिवार को प्रति माह 300 यूनिट तक मुफ्त सौर बिजली सुनिश्चित करने का प्रावधान है।
- **सब्सिडी संरचना (वित्तीय सहायता):**
  - 1 kW से 2 kW क्षमता तक के संयंत्रों के लिए लागत का लगभग 60% तक का केंद्रीय अनुदान।
  - 3 kW या उससे अधिक क्षमता पर ₹78,000 तक की अधिकतम वित्तीय सहायता।
  - शेष राशि के लिए कम ब्याज दर पर संपार्श्विक-मुक्त (collateral-free) संस्थागत बैंक ऋण की सुविधा।

## 3. परीक्षा उपयोगी बहुविकल्पीय प्रश्न (Practice MCQs)
**प्रश्न 1:** 'पीएम सूर्य घर: मुफ्त बिजली योजना' के तहत घरेलू उपभोक्ताओं को प्रति माह कितने यूनिट तक मुफ्त बिजली देने का लक्ष्य रखा गया है?
- (A) 100 यूनिट
- (B) 200 यूनिट
- (C) 300 यूनिट
- (D) 400 यूनिट
**उत्तर:** (C) 300 यूनिट

**प्रश्न 2:** भारत ने किस वर्ष तक 500 गीगावाट गैर-जीवाश्म ऊर्जा क्षमता प्राप्त करने का संकल्प लिया है?
- (A) 2028
- (B) 2030
- (C) 2035
- (D) 2047
**उत्तर:** (B) 2030

## 4. मुख्य परीक्षा (Mains) हेतु विश्लेषणात्मक बिंदु
- **डिस्कॉम (DISCOMs) पर सकारात्मक प्रभाव:** घरेलू छतों पर सौर उत्पादन से ट्रांसमिशन एवं डिस्ट्रीब्यूशन (T&D) नुकसान कम होता है और पीक-आवर लोड प्रबंधन में सहायता मिलती है।
- **कार्बन उत्सर्जन में कमी:** यह पहल भारत के NDC लक्ष्यों को प्राप्त करने और कार्बन उत्सर्जन में भारी कमी लाने में सहायक है।
- **रोजगार सृजन:** सौर ऊर्जा उपकरणों की स्थापना, वायरिंग और अनुरक्षण में नए रोजगार पैदा हो रहे हैं।`);
    if (showToast) showToast('पीएम सूर्य घर संपादकीय टेम्पलेट लोड हो गया!');
  };

  // Quick Append MCQ Template
  const handleAppendMcqSnippet = () => {
    const snippet = `\n\n### परीक्षा उपयोगी बहुविकल्पीय प्रश्न (MCQ)
**प्रश्न:** यहाँ अपना प्रश्न लिखें?
- (A) विकल्प 1
- (B) विकल्प 2
- (C) विकल्प 3
- (D) विकल्प 4
**उत्तर:** (A) विकल्प 1\n`;
    setEdtContent((prev) => prev + snippet);
  };

  // Quick Replace Modal Save
  const handleSaveReplaceModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attachModalVideo) return;
    cmsStore.attachNote({
      video_id: attachModalVideo.videoId,
      title: replaceTitle.trim() || `${attachModalVideo.videoTitle} - हस्तलिखित क्लासरूम नोट्स`,
      file_url: replaceUrl.trim() || 'https://example.com/notes/classroom-notes.pdf',
      file_size_mb: Number(replaceSize) || 12.5,
    });
    setAttachModalVideo(null);
    refreshCmsData();
    if (showToast) showToast('✓ नई PDF नोट्स सफलतापूर्वक अटैच हो गई!');
  };

  // Quick Delete Note
  const handleDeleteNoteFromVideo = (videoId: string) => {
    if (window.confirm('क्या आप सचमुच इस वीडियो से जुड़े नोट्स हटाना चाहते हैं?')) {
      cmsStore.deleteNoteByVideoId(videoId);
      refreshCmsData();
      if (showToast) showToast('नोट्स हटा दिया गया');
    }
  };

  // Quick Delete Video
  const handleDeleteVideo = (videoId: string, title: string) => {
    if (window.confirm(`क्या आप वीडियो "${title}" और इससे जुड़े सभी नोट्स हटाना चाहते हैं?`)) {
      cmsStore.deleteVideo(videoId);
      refreshCmsData();
      if (showToast) showToast('वीडियो एवं संबंधित नोट्स हटा दिए गए');
    }
  };

  // Copy SQL script to clipboard
  const handleCopySql = () => {
    const sqlText = `-- PostgreSQL / Supabase Migration Script for AHARI Global Studies (AGS)
-- Multi-Instructor & Course Management System (RBAC + RLS)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE (Roles: admin, staff, teacher)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'staff', 'teacher')),
    subject_specialty VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. COURSE_TEACHERS JUNCTION TABLE (Multi-Instructor Mapping)
CREATE TABLE IF NOT EXISTS public.course_teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(course_id, teacher_id)
);

-- 4. SUBJECTS TABLE (FK to courses)
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. VIDEOS TABLE (FK to subjects, uploaded_by -> users)
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    video_url TEXT NOT NULL,
    duration VARCHAR(50) NOT NULL DEFAULT '45:00',
    order_index INT NOT NULL DEFAULT 0,
    uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. NOTES TABLE (FK to videos, uploaded_by -> users)
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size_mb NUMERIC(8, 2) NOT NULL DEFAULT 12.50,
    uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. EDITORIALS TABLE (Editorial & Current Affairs CMS)
CREATE TABLE IF NOT EXISTS public.editorials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('editorial', 'current_affairs')),
    category VARCHAR(100) NOT NULL,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    pdf_url TEXT,
    publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(50) NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'published',
    author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_course_teachers_teacher ON public.course_teachers(teacher_id);
CREATE INDEX IF NOT EXISTS idx_course_teachers_course ON public.course_teachers(course_id);
CREATE INDEX IF NOT EXISTS idx_subjects_course ON public.subjects(course_id);
CREATE INDEX IF NOT EXISTS idx_videos_subject ON public.videos(subject_id);
CREATE INDEX IF NOT EXISTS idx_notes_video ON public.notes(video_id);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorials ENABLE ROW LEVEL SECURITY;

-- RLS HELPER: CHECK IF CURRENT USER IS TEACHER ASSIGNED TO COURSE
CREATE OR REPLACE FUNCTION public.is_teacher_assigned_to_course(p_course_id UUID, p_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.course_teachers
        WHERE course_id = p_course_id AND teacher_id = p_user_id
    );
$$;`;

    navigator.clipboard.writeText(sqlText);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
    if (showToast) showToast('✓ SQL माइग्रेशन कोड क्लिपबोर्ड पर कॉपी हो गया!');
  };

  // Metrics (scoped to logged in user / teacher)
  const summaryMetrics = useMemo(() => {
    const allRows = cmsStore.getDashboardContentRows(undefined, undefined, undefined, currentUser);
    const attachedCount = allRows.filter((r) => r.hasNote).length;
    const missingCount = allRows.filter((r) => !r.hasNote).length;
    const editorialsCount = cmsStore.getEditorials().length;
    const coursesCount = cmsStore.getCourses(currentUser).length;

    return {
      totalVideos: allRows.length,
      attachedCount,
      missingCount,
      editorialsCount,
      coursesCount,
    };
  }, [dashboardRows, currentUser]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-2 sm:p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
        
        {/* MODAL HEADER */}
        <div className="bg-[#0a2240] text-white px-5 py-3.5 flex items-center justify-between shrink-0 border-b border-blue-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-white">
                  AGS एडमिन पोर्टल एवं कंटेंट मैनेजमेंट सिस्टम
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  CMS v2.0
                </span>
              </div>
              <p className="text-xs text-blue-200">
                सुरक्षित भूमिका आधारित नियंत्रण (RBAC) • कैस्केडिंग नोट्स अपलोड • संपादकीय पब्लिशर
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center text-white"
            aria-label="Close Admin Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AUTH CHECK: If not logged in as Admin, Teacher or Staff, show secure login form */}
        {!currentUser ? (
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col items-center justify-center bg-slate-50">
            <div className="max-w-md w-full bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200">
              <div className="text-center space-y-2 mb-6">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-inner">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">सुरक्षित एडमिन / शिक्षक / स्टाफ प्रवेश</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  केवल <strong className="text-slate-700 font-semibold">'admin'</strong>,{' '}
                  <strong className="text-slate-700 font-semibold">'teacher'</strong> एवं{' '}
                  <strong className="text-slate-700 font-semibold">'staff'</strong> रोल वाले अधिकृत
                  सहयोगी ही इस पोर्टल का उपयोग कर सकते हैं।
                </p>
              </div>

              {loginError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p>{loginError}</p>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    अधिकृत ईमेल पता (Authorized Email)
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    placeholder="name@ags.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a2240]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    सुरक्षा पिन (Security PIN)
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value)}
                    required
                    placeholder="••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 tracking-widest text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0a2240]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0a2240] hover:bg-[#133560] text-white text-xs font-bold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>सत्यापित करें एवं पोर्टल खोलें</span>
                </button>
              </form>

              {/* Demo Credentials Quick-Selector for testing */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 block mb-2 text-center uppercase tracking-wider">
                  त्वरित टेस्ट क्रेडेंशियल्स (Quick Test Sign-in)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin')}
                    className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left transition-all"
                  >
                    <span className="text-[10px] font-bold text-amber-900 block flex items-center gap-1">
                      👑 <span>Admin (शान्तिलाल)</span>
                    </span>
                    <span className="text-[9px] text-amber-700 truncate block">shantilalmeena994...</span>
                    <span className="text-[9px] font-mono text-amber-800">PIN: 9940 (All Access)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('teacher_kagad')}
                    className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-left transition-all"
                  >
                    <span className="text-[10px] font-bold text-indigo-900 block flex items-center gap-1">
                      👨‍🏫 <span>कागद सर (Teacher)</span>
                    </span>
                    <span className="text-[9px] text-indigo-700 truncate block">kagad.sir@ags.edu</span>
                    <span className="text-[9px] font-mono text-indigo-800">PIN: 5555 (Maths Only)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('teacher_bhavesh')}
                    className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-left transition-all"
                  >
                    <span className="text-[10px] font-bold text-emerald-900 block flex items-center gap-1">
                      👨‍🏫 <span>भावेश सर (Teacher)</span>
                    </span>
                    <span className="text-[9px] text-emerald-700 truncate block">bhavesh.faculty@ags...</span>
                    <span className="text-[9px] font-mono text-emerald-800">PIN: 7777 (Map+Hist)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('staff')}
                    className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-left transition-all"
                  >
                    <span className="text-[10px] font-bold text-blue-900 block flex items-center gap-1">
                      👤 <span>Content Staff</span>
                    </span>
                    <span className="text-[9px] text-blue-700 truncate block">staff@ags.edu</span>
                    <span className="text-[9px] font-mono text-blue-800">PIN: 1234 (Upload)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN / TEACHER / STAFF VIEW */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* COLLABORATOR STATUS BAR */}
            <div className="bg-slate-100 border-b border-slate-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700 flex-wrap">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-slate-900">
                  वर्तमान सहयोगी:{' '}
                  <span className="text-[#0a2240] font-bold">{currentUser.name}</span>
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    currentUser.role === 'admin'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : currentUser.role === 'teacher'
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                      : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}
                >
                  {currentUser.role === 'admin'
                    ? '👑 Admin (पूर्ण नियंत्रण)'
                    : currentUser.role === 'teacher'
                    ? '👨‍🏫 शिक्षक (Teacher Role)'
                    : '👤 Content Staff'}
                </span>
                {currentUser.subject_specialty && (
                  <span className="text-[10px] text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded">
                    विशेषज्ञता: {currentUser.subject_specialty}
                  </span>
                )}
                <span className="text-slate-400 text-[11px] font-mono">
                  (ID: {currentUser.id})
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 border border-transparent hover:border-red-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>लॉगआउट</span>
              </button>
            </div>

            {/* TEACHER ISOLATION BANNER (If current user is teacher) */}
            {currentUser.role === 'teacher' && (
              <div className="bg-amber-50/90 border-b border-amber-200 px-5 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>मल्टी-टीचर एक्सेस आइसोलेशन सक्रिय:</strong> आपको केवल आपके अधिकृत{' '}
                    <span className="font-bold underline">{coursesList.length} कोर्स</span>{' '}
                    का ही एक्सेस प्राप्त है। अन्य शिक्षकों का डेटा पूरी तरह सुरक्षित व पृथक है।
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {coursesList.map((c) => (
                    <span
                      key={c.id}
                      className="text-[10px] bg-white border border-amber-300 px-2 py-0.5 rounded-md font-semibold text-slate-800 shadow-2xs"
                    >
                      ✓ {c.title.split(' (')[0]}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* TAB NAVIGATION */}
            <div className="bg-white border-b border-slate-200 px-5 pt-2 flex items-center justify-between overflow-x-auto">
              <div className="flex space-x-1 sm:space-x-2">
                <button
                  onClick={() => setActiveAdminTab('upload')}
                  className={`px-3.5 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                    activeAdminTab === 'upload'
                      ? 'border-[#0a2240] text-[#0a2240]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-amber-500" />
                  <span>कोर्स कंटेंट अपलोड (3-चरण)</span>
                </button>

                <button
                  onClick={() => setActiveAdminTab('editorials')}
                  className={`px-3.5 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                    activeAdminTab === 'editorials'
                      ? 'border-[#0a2240] text-[#0a2240]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Newspaper className="w-4 h-4 text-emerald-600" />
                  <span>करेंट अफेयर्स व संपादकीय ({summaryMetrics.editorialsCount})</span>
                </button>

                {/* TEACHER APPOINTMENT & COURSE ACCESS TAB: VISIBLE ONLY TO ADMIN */}
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => setActiveAdminTab('teachers')}
                    className={`px-3.5 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                      activeAdminTab === 'teachers'
                        ? 'border-[#0a2240] text-[#0a2240]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>शिक्षक नियुक्ति व आईडी जनरेटर</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700 text-[10px]">
                      {cmsStore.getTeachers().length} शिक्षक
                    </span>
                  </button>
                )}

                <button
                  onClick={() => setActiveAdminTab('dashboard')}
                  className={`px-3.5 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                    activeAdminTab === 'dashboard'
                      ? 'border-[#0a2240] text-[#0a2240]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>कंटेंट ओवरव्यू टेबल</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 text-[10px]">
                    {summaryMetrics.totalVideos}
                  </span>
                </button>

                <button
                  onClick={() => setActiveAdminTab('sql')}
                  className={`px-3.5 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                    activeAdminTab === 'sql'
                      ? 'border-[#0a2240] text-[#0a2240]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Database className="w-4 h-4 text-purple-600" />
                  <span>डेटाबेस स्कीमा (SQL)</span>
                </button>
              </div>

              {/* Refresh Button */}
              <button
                onClick={() => refreshCmsData()}
                title="डेटा रीफ्रेश करें"
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
              
              {/* TAB 1: CASCADING SMART UPLOAD FORM */}
              {activeAdminTab === 'upload' && (
                <div className="max-w-4xl mx-auto space-y-5">
                  {/* Course Content 3-Phase Navigation Bar */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <span>कोर्स कंटेंट अपलोड व्यवस्था (3-चरण यूजर-फ्रेंडली पाइपलाइन):</span>
                      </span>
                      <span className="text-[11px] text-slate-500">
                        1. वीडियो लेक्चर ➔ 2. क्लासरूम हैंडआउट PDF ➔ 3. प्रिंटेबल ई-बुक / पीडीएफ नोट्स
                      </span>
                    </div>

                    <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 w-full md:w-auto">
                      <button
                        type="button"
                        onClick={() => setCourseUploadPhase(1)}
                        className={`flex-1 md:flex-none px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                          courseUploadPhase === 1
                            ? 'bg-[#0a2240] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Video className="w-3.5 h-3.5 text-blue-400" />
                        <span>1. वीडियो लेक्चर</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCourseUploadPhase(2)}
                        className={`flex-1 md:flex-none px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                          courseUploadPhase === 2
                            ? 'bg-[#0a2240] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>2. क्लास PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCourseUploadPhase(3)}
                        className={`flex-1 md:flex-none px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                          courseUploadPhase === 3
                            ? 'bg-[#0a2240] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                        <span>3. प्रिंटेबल PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* ============================================================== */}
                  {/* PHASE 1: VIDEO LECTURE UPLOAD */}
                  {/* ============================================================== */}
                  {courseUploadPhase === 1 && (
                    <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
                      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                              1
                            </span>
                            चरण 1: वीडियो लेक्चर अपलोड करें (Add Video Lecture)
                          </h3>
                          <p className="text-xs text-slate-500">
                            कोर्स चुनें ➔ विषय चुनें ➔ वीडियो लेक्चर शीर्षक व लिंक सेव करें
                          </p>
                        </div>

                        {currentUser?.role === 'teacher' && (
                          <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                            🔒 केवल आपके अधिकृत कोर्स
                          </span>
                        )}
                      </div>

                      {/* STEP 1: SELECT COURSE */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-[#0a2240] text-white flex items-center justify-center text-[10px]">
                              1
                            </span>
                            <span>स्टेप 1: कोर्स चुनें (Select Course)</span>
                            <span className="text-red-500">*</span>
                          </label>

                          {currentUser?.role === 'teacher' ? (
                            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                              🔒 केवल आपके अधिकृत कोर्स ({coursesList.length})
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setIsAddingNewCourse(!isAddingNewCourse)}
                              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>{isAddingNewCourse ? 'रद्द करें' : '+ नया कोर्स जोड़ें'}</span>
                            </button>
                          )}
                        </div>

                        {isAddingNewCourse ? (
                          <div className="flex gap-2 animate-in fade-in">
                            <input
                              type="text"
                              value={newCourseTitle}
                              onChange={(e) => setNewCourseTitle(e.target.value)}
                              placeholder="नये विषयवार कोर्स का नाम (उदा. विश्व एवं भारत का मानचित्र स्पेशल बैच)"
                              className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0a2240]"
                            />
                            <button
                              type="button"
                              onClick={handleCreateCourse}
                              className="px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700"
                            >
                              सेव करें
                            </button>
                          </div>
                        ) : coursesList.length === 0 ? (
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                            आपको अभी कोई कोर्स असाइन नहीं किया गया है। कृपया मुख्य एडमिनिस्ट्रेटर से संपर्क करें।
                          </div>
                        ) : (
                          <select
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0a2240]"
                          >
                            {coursesList.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.title}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      {/* STEP 2: SELECT SUBJECT (Filtered by chosen course) */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-[#0a2240] text-white flex items-center justify-center text-[10px]">
                              2
                            </span>
                            <span>स्टेप 2: विषय चुनें (Select Subject - केवल चुने हुए कोर्स के)</span>
                            <span className="text-red-500">*</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => setIsAddingNewSubject(!isAddingNewSubject)}
                            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>{isAddingNewSubject ? 'रद्द करें' : '+ नया विषय जोड़ें'}</span>
                          </button>
                        </div>

                        {isAddingNewSubject ? (
                          <div className="flex gap-2 animate-in fade-in">
                            <input
                              type="text"
                              value={newSubjectTitle}
                              onChange={(e) => setNewSubjectTitle(e.target.value)}
                              placeholder="नये विषय का नाम (उदा. प्राचीन भारतीय इतिहास)"
                              className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0a2240]"
                            />
                            <button
                              type="button"
                              onClick={handleCreateSubject}
                              className="px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700"
                            >
                              सेव करें
                            </button>
                          </div>
                        ) : subjectsList.length === 0 ? (
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center justify-between">
                            <span>इस कोर्स में अभी कोई विषय नहीं है। कृपया '+ नया विषय जोड़ें' पर क्लिक करें।</span>
                          </div>
                        ) : (
                          <select
                            value={selectedSubjectId}
                            onChange={(e) => setSelectedSubjectId(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0a2240]"
                          >
                            {subjectsList.map((s) => (
                              <option key={s.id} value={s.id}>
                                #{s.order_index} {s.title}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      {/* STEP 3: SELECT VIDEO / LECTURE (Filtered by chosen subject) */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-[#0a2240] text-white flex items-center justify-center text-[10px]">
                              3
                            </span>
                            <span>स्टेप 3: वीडियो/लेक्चर चुनें (Select Video - केवल उस विषय के)</span>
                            <span className="text-red-500">*</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => setIsAddingNewVideo(!isAddingNewVideo)}
                            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>{isAddingNewVideo ? 'रद्द करें' : '+ नया वीडियो जोड़ें'}</span>
                          </button>
                        </div>

                        {isAddingNewVideo ? (
                          <div className="space-y-2 p-3 bg-white rounded-lg border border-slate-200 animate-in fade-in">
                            <input
                              type="text"
                              value={newVideoTitle}
                              onChange={(e) => setNewVideoTitle(e.target.value)}
                              placeholder="वीडियो का शीर्षक (उदा. L-01 सिंधु घाटी सभ्यता नगर नियोजन)"
                              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="url"
                                value={newVideoUrl}
                                onChange={(e) => setNewVideoUrl(e.target.value)}
                                placeholder="YouTube / MP4 URL"
                                className="px-3 py-2 text-xs rounded-lg border border-slate-300"
                              />
                              <input
                                type="text"
                                value={newVideoDuration}
                                onChange={(e) => setNewVideoDuration(e.target.value)}
                                placeholder="अवधि (उदा. 52:14)"
                                className="px-3 py-2 text-xs rounded-lg border border-slate-300"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={handleCreateVideo}
                              className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700"
                            >
                              वीडियो जोड़ें
                            </button>
                          </div>
                        ) : videosList.length === 0 ? (
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center justify-between">
                            <span>इस विषय में अभी कोई वीडियो नहीं है। कृपया '+ नया वीडियो जोड़ें' पर क्लिक करें।</span>
                          </div>
                        ) : (
                          <select
                            value={selectedVideoId}
                            onChange={(e) => setSelectedVideoId(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0a2240]"
                          >
                            {videosList.map((v) => {
                              const note = cmsStore.getNoteForVideo(v.id);
                              return (
                                <option key={v.id} value={v.id}>
                                  #{v.order_index} {v.title} ({v.duration}) {note ? '✓ [नोट्स संलग्न]' : '⚠ [नोट्स नहीं हैं]'}
                                </option>
                              );
                            })}
                          </select>
                        )}
                      </div>

                      {/* Existing Videos in this Module */}
                      <div className="pt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">
                            इस विषय में अपलोड किए गए वीडियो ({videosList.length}):
                          </span>
                          {selectedVideoId && (
                            <button
                              type="button"
                              onClick={() => setCourseUploadPhase(2)}
                              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200"
                            >
                              <span>➔ चरण 2: क्लास PDF अटैच करें</span>
                            </button>
                          )}
                        </div>

                        {videosList.length === 0 ? (
                          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-400">
                            इस विषय में अभी तक कोई वीडियो अपलोड नहीं किया गया है। ऊपर दिए गए फॉर्म से वीडियो जोड़ें।
                          </div>
                        ) : (
                          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white overflow-hidden">
                            {videosList.map((v) => {
                              const note = cmsStore.getNoteForVideo(v.id);
                              const isCurrent = v.id === selectedVideoId;

                              return (
                                <div
                                  key={v.id}
                                  className={`p-3 flex items-center justify-between gap-3 transition-all ${
                                    isCurrent ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                                      #{v.order_index}
                                    </div>
                                    <div className="truncate">
                                      <p className="text-xs font-bold text-slate-800 truncate">{v.title}</p>
                                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                        <span>अवधि: {v.duration}</span>
                                        <span>•</span>
                                        {note ? (
                                          <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                            <span>क्लास PDF संलग्न ({note.file_size_mb} MB)</span>
                                          </span>
                                        ) : (
                                          <span className="text-amber-700 font-semibold">⚠ क्लास PDF अभी नहीं जुड़ी</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedVideoId(v.id);
                                        setCourseUploadPhase(2);
                                      }}
                                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-2xs transition-all flex items-center gap-1"
                                    >
                                      <FileText className="w-3 h-3" />
                                      <span>{note ? 'PDF बदलें' : '+ PDF जोड़ें'}</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleDeleteVideo(v.id, v.title)}
                                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                                      title="वीडियो हटाएं"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ============================================================== */}
                  {/* PHASE 2: CLASSROOM HANDOUT PDF ATTACHMENT */}
                  {/* ============================================================== */}
                  {courseUploadPhase === 2 && (
                    <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
                      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">
                              2
                            </span>
                            <span>चरण 2: क्लासरूम बोर्ड हैंडआउट PDF जोड़ें (Class Notes PDF)</span>
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            यह PDF विशिष्ट वीडियो लेक्चर के साथ संलग्न होगी और वीडियो के बगल में छात्र को डाउनलोड के लिए मिलेगी
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setCourseUploadPhase(3)}
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
                        >
                          <span>➔ चरण 3: प्रिंटेबल PDF जोड़ें</span>
                        </button>
                      </div>

                      {/* Course + Subject + Video cascading picker */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            1. कोर्स
                          </label>
                          <select
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                            className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800"
                          >
                            {coursesList.map((c) => (
                              <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            2. विषय
                          </label>
                          <select
                            value={selectedSubjectId}
                            onChange={(e) => setSelectedSubjectId(e.target.value)}
                            className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-800"
                          >
                            {subjectsList.map((s) => (
                              <option key={s.id} value={s.id}>#{s.order_index} {s.title}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            3. लक्षित वीडियो लेक्चर *
                          </label>
                          <select
                            value={selectedVideoId}
                            onChange={(e) => setSelectedVideoId(e.target.value)}
                            className="w-full px-2.5 py-2 rounded-lg border border-amber-300 text-xs bg-amber-50/50 text-slate-900 font-semibold"
                          >
                            {videosList.length === 0 ? (
                              <option value="">कोई वीडियो नहीं है</option>
                            ) : (
                              videosList.map((v) => (
                                <option key={v.id} value={v.id}>
                                  #{v.order_index} {v.title}
                                </option>
                              ))
                            )}
                          </select>
                        </div>
                      </div>

                      {/* PDF Form */}
                      {selectedVideoId ? (
                        <form onSubmit={handleAttachNotesSubmit} className="p-5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                              <Paperclip className="w-4 h-4 text-amber-600" />
                              <span>क्लास PDF नोट्स का विवरण (Target Video ID: {selectedVideoId})</span>
                            </span>

                            {cmsStore.getNoteForVideo(selectedVideoId) && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                                ✓ वर्तमान में नोट्स संलग्न है
                              </span>
                            )}
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                क्लास नोट्स का शीर्षक (Class Handout Title) *
                              </label>
                              <input
                                type="text"
                                value={noteTitle}
                                onChange={(e) => setNoteTitle(e.target.value)}
                                required
                                placeholder="उदा. L-01 क्लासरूम बोर्ड डिजिटल हैंडआउट PDF - कागद सर"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                  पीडीएफ फाइल URL (Google Drive / Storage Link) *
                                </label>
                                <input
                                  type="url"
                                  value={noteFileUrl}
                                  onChange={(e) => setNoteFileUrl(e.target.value)}
                                  required
                                  placeholder="https://drive.google.com/... या PDF URL"
                                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                  फाइल साइज (MB) *
                                </label>
                                <input
                                  type="number"
                                  step="0.1"
                                  min="0.1"
                                  value={noteSizeMb}
                                  onChange={(e) => setNoteSizeMb(parseFloat(e.target.value) || 0)}
                                  required
                                  placeholder="12.5"
                                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>अपलोडर: <strong>{currentUser.name}</strong></span>
                            </div>

                            <button
                              type="submit"
                              disabled={isSubmittingNote}
                              className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                            >
                              <Paperclip className="w-4 h-4" />
                              <span>क्लास PDF इस वीडियो के साथ सेव करें</span>
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl text-center text-xs text-amber-800 space-y-2">
                          <p>कृपया पहले चरण 1 से कोई वीडियो लेक्चर बनाएं ताकि उसके साथ क्लास पीडीएफ जोड़ी जा सके।</p>
                          <button
                            type="button"
                            onClick={() => setCourseUploadPhase(1)}
                            className="px-4 py-1.5 bg-[#0a2240] text-white rounded-lg font-bold text-xs"
                          >
                            ➔ चरण 1 पर जाएं (वीडियो जोड़ें)
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ============================================================== */}
                  {/* PHASE 3: PRINTABLE PDF & TYPED E-BOOK NOTES */}
                  {/* ============================================================== */}
                  {courseUploadPhase === 3 && (
                    <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
                      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">
                              3
                            </span>
                            <span>चरण 3: प्रिंटेबल पीडीएफ / टाइप्ड ई-बुक नोट्स (Printable Course Notes)</span>
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            यह संपूर्ण कोर्स या विषय की मुख्य प्रिंटेबल बुकलेट/ई-बुक है जो कोर्स के तीसरे सब-टैब में सीधे डाउनलोड होगी
                          </p>
                        </div>
                      </div>

                      {/* Course Picker */}
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                        <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>कोर्स चुनें (Select Target Course)</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={selectedCourseId}
                          onChange={(e) => setSelectedCourseId(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0a2240]"
                        >
                          {coursesList.map((c) => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                          ))}
                        </select>
                      </div>

                      {/* Printable Note Upload Form */}
                      <form onSubmit={handleCreatePrintableNote} className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                            <Download className="w-4 h-4 text-emerald-600" />
                            <span>प्रिंटेबल ई-बुक / पीडीएफ नोट्स विवरण</span>
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              ई-बुक / प्रिंटेबल नोट्स का शीर्षक (Printable Note Title) *
                            </label>
                            <input
                              type="text"
                              value={pnoteTitle}
                              onChange={(e) => setPnoteTitle(e.target.value)}
                              required
                              placeholder="उदा. सम्पूर्ण भारतीय संविधान एवं राजव्यवस्था - मास्टर प्रिंटेबल ई-बुक"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                नोट्स का प्रकार (Document Type) *
                              </label>
                              <select
                                value={pnoteType}
                                onChange={(e) => setPnoteType(e.target.value as any)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              >
                                <option value="printable_pdf">प्रिंटेबल पीडीएफ (Printable PDF)</option>
                                <option value="typed_notes">टाइप्ड ई-बुक नोट्स (Typed E-Book)</option>
                                <option value="question_bank">अभ्यास प्रश्नोत्तर / मॉडल पेपर</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                कुल पृष्ठ संख्या (Pages) *
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={pnotePages}
                                onChange={(e) => setPnotePages(parseInt(e.target.value) || 1)}
                                required
                                placeholder="120"
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                फाइल साइज (MB) *
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                min="0.1"
                                value={pnoteSizeMb}
                                onChange={(e) => setPnoteSizeMb(parseFloat(e.target.value) || 0)}
                                required
                                placeholder="18.5"
                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              पीडीएफ फाइल / डाउनलोड URL (Google Drive / Storage Link) *
                            </label>
                            <input
                              type="url"
                              value={pnoteFileUrl}
                              onChange={(e) => setPnoteFileUrl(e.target.value)}
                              required
                              placeholder="https://drive.google.com/... या PDF URL"
                              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                        </div>

                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>अपलोडर: <strong>{currentUser.name}</strong></span>
                          </div>

                          <button
                            type="submit"
                            disabled={!selectedCourseId || isSubmittingPrintable}
                            className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            <span>+ प्रिंटेबल ई-बुक / पीडीएफ नोट्स पब्लिश करें</span>
                          </button>
                        </div>
                      </form>

                      {/* Existing Printable Notes for this Course */}
                      <div className="space-y-2 pt-2">
                        <span className="text-xs font-bold text-slate-700">
                          इस कोर्स के प्रकाशित प्रिंटेबल नोट्स ({cmsStore.getPrintableNotes(selectedCourseId).length}):
                        </span>

                        {cmsStore.getPrintableNotes(selectedCourseId).length === 0 ? (
                          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-400">
                            इस कोर्स के लिए अभी तक कोई प्रिंटेबल नोट्स अपलोड नहीं किया गया है।
                          </div>
                        ) : (
                          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white overflow-hidden">
                            {cmsStore.getPrintableNotes(selectedCourseId).map((pn) => (
                              <div key={pn.id} className="p-3 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0">
                                    PDF
                                  </div>
                                  <div className="truncate">
                                    <p className="text-xs font-bold text-slate-800 truncate">{pn.title}</p>
                                    <p className="text-[10px] text-slate-500">
                                      {pn.pages} पृष्ठ • {pn.file_size_mb} MB • अपलोडर: {pn.uploader_name || 'Admin'}
                                    </p>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    cmsStore.deletePrintableNote(pn.id);
                                    refreshCmsData();
                                    if (showToast) showToast('प्रिंटेबल नोट्स हटा दिया गया');
                                  }}
                                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                                  title="नोट्स डिलीट करें"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: CONTENT OVERVIEW DASHBOARD TABLE */}
              {activeAdminTab === 'dashboard' && (
                <div className="space-y-4">
                  {/* Summary Metric Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        कुल वीडियो / लेक्चर्स
                      </span>
                      <span className="text-xl font-bold text-slate-900">
                        {summaryMetrics.totalVideos}
                      </span>
                    </div>

                    <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 shadow-2xs">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>नोट्स जुड़े हैं (Attached)</span>
                      </span>
                      <span className="text-xl font-bold text-emerald-700">
                        {summaryMetrics.attachedCount}
                      </span>
                    </div>

                    <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 shadow-2xs">
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        <span>नोट्स गायब हैं (Missing)</span>
                      </span>
                      <span className="text-xl font-bold text-amber-700">
                        {summaryMetrics.missingCount}
                      </span>
                    </div>

                    <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200 shadow-2xs">
                      <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
                        कुल कोर्सेज
                      </span>
                      <span className="text-xl font-bold text-[#0a2240]">
                        {summaryMetrics.coursesCount}
                      </span>
                    </div>
                  </div>

                  {/* Filter Toolbar */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      {/* Filter by Course */}
                      <select
                        value={tableCourseFilter}
                        onChange={(e) => setTableCourseFilter(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-700 bg-slate-50 font-semibold"
                      >
                        <option value="all">सभी कोर्स (All Courses)</option>
                        {coursesList.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>

                      {/* Filter by Notes Attachment Status */}
                      <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setTableStatusFilter('all')}
                          className={`px-2.5 py-1 rounded-md text-[11px] ${
                            tableStatusFilter === 'all'
                              ? 'bg-white shadow-2xs text-slate-900 font-bold'
                              : 'text-slate-500'
                          }`}
                        >
                          सभी (All)
                        </button>
                        <button
                          type="button"
                          onClick={() => setTableStatusFilter('attached')}
                          className={`px-2.5 py-1 rounded-md text-[11px] text-emerald-700 ${
                            tableStatusFilter === 'attached'
                              ? 'bg-emerald-100 shadow-2xs font-bold'
                              : 'text-slate-500'
                          }`}
                        >
                          ✓ केवल जुड़े हुए ({summaryMetrics.attachedCount})
                        </button>
                        <button
                          type="button"
                          onClick={() => setTableStatusFilter('missing')}
                          className={`px-2.5 py-1 rounded-md text-[11px] text-amber-700 ${
                            tableStatusFilter === 'missing'
                              ? 'bg-amber-100 shadow-2xs font-bold'
                              : 'text-slate-500'
                          }`}
                        >
                          ⚠ मिसिंग नोट्स ({summaryMetrics.missingCount})
                        </button>
                      </div>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={tableSearchQuery}
                        onChange={(e) => setTableSearchQuery(e.target.value)}
                        placeholder="कोर्स, विषय या वीडियो खोजें..."
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 placeholder-slate-400"
                      />
                    </div>
                  </div>

                  {/* THE DASHBOARD TABLE */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#0a2240] text-white text-[11px] font-semibold uppercase tracking-wider">
                          <tr>
                            <th className="py-3 px-4">कोर्स (Course Name)</th>
                            <th className="py-3 px-4">विषय (Subject)</th>
                            <th className="py-3 px-4">वीडियो / लेक्चर (Video Name)</th>
                            <th className="py-3 px-4">नोट्स स्थिति (Attachment Status)</th>
                            <th className="py-3 px-4 text-right">कार्रवाई (Actions)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {dashboardRows.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                                कोई वीडियो या कंटेंट रिकॉर्ड नहीं मिला।
                              </td>
                            </tr>
                          ) : (
                            dashboardRows.map((row) => (
                              <tr key={row.videoId} className="hover:bg-slate-50/80 transition-colors">
                                {/* Course */}
                                <td className="py-3 px-4 font-semibold text-slate-900 max-w-[180px]">
                                  <span className="line-clamp-2" title={row.courseTitle}>
                                    {row.courseTitle}
                                  </span>
                                </td>

                                {/* Subject */}
                                <td className="py-3 px-4 text-slate-600 max-w-[150px]">
                                  <span className="line-clamp-2" title={row.subjectTitle}>
                                    {row.subjectTitle}
                                  </span>
                                </td>

                                {/* Video */}
                                <td className="py-3 px-4 max-w-[220px]">
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-slate-900 line-clamp-2" title={row.videoTitle}>
                                      #{row.orderIndex} {row.videoTitle}
                                    </span>
                                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                                      <Clock className="w-3 h-3" />
                                      <span>{row.duration}</span>
                                    </span>
                                  </div>
                                </td>

                                {/* Notes Attachment Status (Green Badge vs Yellow Badge) */}
                                <td className="py-3 px-4">
                                  {row.hasNote && row.note ? (
                                    <div className="flex flex-col gap-1 items-start">
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Attached (संलग्न है)</span>
                                      </span>
                                      <span className="text-[10px] text-slate-600 font-medium line-clamp-1 max-w-[200px]" title={row.note.title}>
                                        📄 {row.note.title}
                                      </span>
                                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                                        <span>{row.note.file_size_mb} MB</span>
                                        {row.noteUploaderName && (
                                          <span className="text-emerald-700 bg-emerald-50 px-1 rounded">
                                            by {row.noteUploaderName}
                                          </span>
                                        )}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col gap-1 items-start">
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs">
                                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                        <span>Missing Notes (नोट्स नहीं हैं)</span>
                                      </span>
                                      <span className="text-[10px] text-slate-400">
                                        इस वीडियो के साथ अभी नोट्स संलग्न नहीं हैं
                                      </span>
                                    </div>
                                  )}
                                </td>

                                {/* Actions */}
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    {/* Replace / Attach PDF Modal Opener */}
                                    <button
                                      onClick={() => {
                                        setAttachModalVideo(row);
                                        setReplaceTitle(
                                          row.note?.title ||
                                            `${row.videoTitle} - हस्तलिखित क्लासरूम नोट्स (कागद सर)`
                                        );
                                        setReplaceUrl(row.note?.file_url || '');
                                        setReplaceSize(row.note?.file_size_mb || 12.5);
                                      }}
                                      className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-all flex items-center gap-1"
                                      title={row.hasNote ? 'नई PDF नोट्स बदलें (Replace PDF)' : 'नोट्स जोड़ें (Attach PDF)'}
                                    >
                                      <Paperclip className="w-3 h-3" />
                                      <span>{row.hasNote ? 'PDF बदलें' : '+ नोट्स जोड़ें'}</span>
                                    </button>

                                    {/* Delete Note Only */}
                                    {row.hasNote && (
                                      <button
                                        onClick={() => handleDeleteNoteFromVideo(row.videoId)}
                                        className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-all"
                                        title="केवल नोट्स हटाएं"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    )}

                                    {/* Delete Video & Notes */}
                                    <button
                                      onClick={() => handleDeleteVideo(row.videoId, row.videoTitle)}
                                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                                      title="वीडियो व नोट्स डिलीट करें"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: CURRENT AFFAIRS & EDITORIALS PUBLISHER */}
              {activeAdminTab === 'editorials' && (
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Top Intro Card */}
                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                    <div>
                      <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                        <Newspaper className="w-5 h-5 text-emerald-700" />
                        <span>करेंट अफेयर्स, संपादकीय व नोट्स पब्लिशर (Faculty CA & Editorial CMS)</span>
                      </h3>
                      <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                        शिक्षकों एवं स्टाफ के लिए विशेष सुविधा: यहाँ से आप दैनिक समसामयिकी (Current Affairs), मुख्य परीक्षा संपादकीय आलेख, 
                        और दैनिक करेंट अफेयर्स की PDF फाइल सीधे एक क्लिक में छात्रों के लिए प्रकाशित कर सकते हैं।
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleLoadPmSuryaGharTemplate}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>'पीएम सूर्य घर' टेम्पलेट लोड करें</span>
                    </button>
                  </div>

                  {/* Rich Editor Form */}
                  <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-5">
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <PenTool className="w-4 h-4 text-emerald-600" />
                        <span>नया आलेख / दैनिक करेंट अफेयर्स पोस्ट लिखें</span>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        लाइव होने पर होमपेज के दैनिक समसामयिकी सेक्शन में दिखेगा
                      </span>
                    </div>

                    {/* Controls: Type, Category, Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          प्रकार (Type) *
                        </label>
                        <select
                          value={edtType}
                          onChange={(e) => setEdtType(e.target.value as EditorialType)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold bg-white"
                        >
                          <option value="current_affairs">करेंट अफेयर्स (Current Affairs)</option>
                          <option value="editorial">संपादकीय आलेख (Editorial Article)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          श्रेणी (Category) *
                        </label>
                        <input
                          type="text"
                          value={edtCategory}
                          onChange={(e) => setEdtCategory(e.target.value)}
                          placeholder="उदा. राष्ट्रीय, पर्यावरण एवं ऊर्जा, अर्थव्यवस्था"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          प्रकाशन तिथि (Date) *
                        </label>
                        <input
                          type="date"
                          value={edtPublishDate}
                          onChange={(e) => setEdtPublishDate(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                        />
                      </div>
                    </div>

                    {/* Title & Slug */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          आलेख / पोस्ट का शीर्षक (Article Headline) *
                        </label>
                        <input
                          type="text"
                          value={edtTitle}
                          onChange={(e) => setEdtTitle(e.target.value)}
                          placeholder="उदा. 24 अक्टूबर 2026: दैनिक राष्ट्रीय एवं अंतर्राष्ट्रीय समसामयिकी विशेषांक"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            URL स्लग (Slug)
                          </label>
                          <input
                            type="text"
                            value={edtSlug}
                            onChange={(e) => setEdtSlug(e.target.value)}
                            placeholder="daily-current-affairs-oct-2026"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono text-slate-700 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            संलग्न करेंट अफेयर्स PDF डाउनलोड लिंक (वैकल्पिक)
                          </label>
                          <div className="relative">
                            <Paperclip className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="url"
                              value={edtPdfUrl}
                              onChange={(e) => setEdtPdfUrl(e.target.value)}
                              placeholder="https://example.com/daily-ca-notes.pdf"
                              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Rich Text Editor Toolbar & Content */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <label className="text-[11px] font-bold text-slate-700">
                          लेख की सामग्री (Article Content & Rich Text Editor) *
                        </label>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleAppendMcqSnippet}
                            className="text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded border border-blue-200 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>+ अभ्यास प्रश्न (MCQ) टेम्पलेट</span>
                          </button>

                          <div className="flex bg-slate-100 rounded-lg p-0.5 text-xs font-semibold">
                            <button
                              type="button"
                              onClick={() => setEdtEditorMode('write')}
                              className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                                edtEditorMode === 'write'
                                  ? 'bg-white shadow-2xs text-slate-900 font-bold'
                                  : 'text-slate-500 hover:text-slate-900'
                              }`}
                            >
                              लिखें (Write)
                            </button>
                            <button
                              type="button"
                              onClick={() => setEdtEditorMode('preview')}
                              className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                                edtEditorMode === 'preview'
                                  ? 'bg-white shadow-2xs text-slate-900 font-bold'
                                  : 'text-slate-500 hover:text-slate-900'
                              }`}
                            >
                              पूर्वावलोकन (Preview)
                            </button>
                          </div>
                        </div>
                      </div>

                      {edtEditorMode === 'write' ? (
                        <textarea
                          rows={11}
                          value={edtContent}
                          onChange={(e) => setEdtContent(e.target.value)}
                          placeholder="यहाँ अपना पूरा लेख लिखें या पेस्ट करें। हेडिंग के लिए ##, बुलेट पॉइंट्स के लिए -, और मुख्य बिंदुओं को **बोल्ड** कर सकते हैं..."
                          className="w-full p-3.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-mono leading-relaxed bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      ) : (
                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 max-h-80 overflow-y-auto text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                          {edtContent ? (
                            <div className="prose prose-xs max-w-none">
                              {edtContent}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">
                              कोई सामग्री नहीं लिखी गई है।
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Submit Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>लेखक रिकॉर्ड: <strong>{currentUser.name}</strong> ({currentUser.role})</span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => handleSaveEditorial('draft')}
                          className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all"
                        >
                          ड्राफ्ट में सुरक्षित करें (Save Draft)
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSaveEditorial('published')}
                          className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>सीधा पब्लिश करें (Publish Now)</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Published Articles List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        प्रकाशित एवं सुरक्षित आलेख ({cmsStore.getEditorials().length})
                      </h4>
                    </div>

                    {cmsStore.getEditorials().length === 0 ? (
                      <div className="p-6 bg-white border border-slate-200 rounded-2xl text-center text-xs text-slate-400">
                        अभी तक कोई आलेख या करेंट अफेयर्स प्रकाशित नहीं किया गया है।
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {cmsStore.getEditorials().map((edt) => (
                          <div
                            key={edt.id}
                            className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-2"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                    edt.status === 'published'
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                      : 'bg-slate-100 text-slate-700 border border-slate-300'
                                  }`}
                                >
                                  {edt.status === 'published' ? '✓ प्रकाशित (Live)' : 'ड्राफ्ट (Draft)'}
                                </span>
                                <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                  {edt.category}
                                </span>
                                <span className="text-xs text-slate-400">
                                  तारीख: {edt.publish_date}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-slate-500">
                                  लेखक: <strong>{edt.author_name || 'Admin'}</strong>
                                </span>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`क्या आप आलेख "${edt.title}" को हटाना चाहते हैं?`)) {
                                      cmsStore.deleteEditorial(edt.id);
                                      refreshCmsData();
                                      if (showToast) showToast('आलेख डिलीट कर दिया गया');
                                    }
                                  }}
                                  className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                                  title="हटाएं"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <h4 className="text-sm font-bold text-slate-900 leading-snug">
                              {edt.title}
                            </h4>

                            <div className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-sans">
                              {edt.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: TEACHER-SPECIFIC COURSE ACCESS (Multi-Instructor System - Admin Only) */}
              {activeAdminTab === 'teachers' && currentUser.role === 'admin' && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                    <div>
                      <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-700" />
                        <span>बहु-शिक्षक कोर्स आवंटन नियंत्रण (Multi-Instructor Course Access)</span>
                      </h3>
                      <p className="text-xs text-indigo-800 mt-1 leading-relaxed">
                        बाहर रहने वाले फैकल्टी (जैसे कागद सर, भावेश सर) को विशिष्ट कोर्स असाइन करें। जब कोई शिक्षक लॉगिन करेगा, 
                        तो उसे <strong>केवल अपने लिंक्ड कोर्स</strong> ही दिखाई देंगे और वह केवल उन्हीं में वीडियो/नोट्स अपलोड कर सकेगा।
                      </p>
                    </div>

                    <div className="px-3 py-1.5 bg-white border border-indigo-200 rounded-xl text-xs font-bold text-indigo-900 shrink-0">
                      कुल शिक्षक: {cmsStore.getTeachers().length}
                    </div>
                  </div>

                  {/* APPOINT NEW TEACHER & GENERATE CREDENTIALS FORM */}
                  <form onSubmit={handleAppointTeacher} className="bg-white rounded-2xl border border-indigo-200 p-5 sm:p-6 shadow-sm space-y-4">
                    <div className="border-b border-indigo-50 pb-3 flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                          +
                        </span>
                        <span>नया शिक्षक नियुक्त करें एवं आईडी व पासवर्ड जनरेट करें (Appoint Faculty)</span>
                      </h4>
                      <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        Auto-Generated Teacher ID
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          शिक्षक का पूरा नाम *
                        </label>
                        <input
                          type="text"
                          value={appointName}
                          onChange={(e) => setAppointName(e.target.value)}
                          required
                          placeholder="उदा. भावेश सर / डॉ. अमित"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          विषय विशेषज्ञता (Specialty)
                        </label>
                        <input
                          type="text"
                          value={appointSpecialty}
                          onChange={(e) => setAppointSpecialty(e.target.value)}
                          placeholder="उदा. विश्व इतिहास एवं कला-संस्कृति"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          लॉगिन ईमेल (Login Email)
                        </label>
                        <input
                          type="email"
                          value={appointEmail}
                          onChange={(e) => setAppointEmail(e.target.value)}
                          placeholder="faculty@ags.edu (रिक्त छोड़ें तो स्वतः बनेगा)"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          सुरक्षा पिन (4-6 अंक) *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={appointPin}
                            onChange={(e) => setAppointPin(e.target.value)}
                            required
                            placeholder="7788"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <button
                            type="button"
                            onClick={() => setAppointPin(String(Math.floor(1000 + Math.random() * 9000)))}
                            title="नया पिन जनरेट करें"
                            className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300"
                          >
                            🎲
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Pre-assign Courses for this new teacher */}
                    <div className="space-y-2 pt-1">
                      <label className="block text-[11px] font-bold text-slate-700">
                        असाइन किए जाने वाले कोर्स चुनें (Select Courses to Grant Access):
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {cmsStore.getCourses(INITIAL_USERS[0]).map((c) => {
                          const isChecked = appointCourseIds.includes(c.id);
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                if (isChecked) {
                                  setAppointCourseIds(appointCourseIds.filter((id) => id !== c.id));
                                } else {
                                  setAppointCourseIds([...appointCourseIds, c.id]);
                                }
                              }}
                              className={`p-2 rounded-xl text-left text-xs transition-all flex items-center gap-2 border ${
                                isChecked
                                  ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-bold'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 border ${
                                isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                              }`}>
                                {isChecked && <Check className="w-2.5 h-2.5" />}
                              </div>
                              <span className="truncate">{c.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>शिक्षक नियुक्त करें एवं आईडी जनरेट करें (Appoint Teacher)</span>
                      </button>
                    </div>
                  </form>

                  {/* APPOINTED CREDENTIALS DISPLAY & WHATSAPP COPY BOX */}
                  {appointedResult && (
                    <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-5 shadow-sm space-y-3 animate-in fade-in">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                            ✓
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-emerald-950">
                              शिक्षक नियुक्ति सफल! क्रेडेंशियल जनरेट हो गए हैं
                            </h4>
                            <p className="text-xs text-emerald-800">
                              नीचे दिए गए क्रेडेंशियल को कॉपी करके शिक्षक को व्हाट्सएप या एसएमएस पर भेजें।
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleCopyCredentials}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all shrink-0 active:scale-95"
                        >
                          {copiedCredentials ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          <span>{copiedCredentials ? 'क्रेडेंशियल कॉपी हो गए!' : '📋 क्रेडेंशियल कॉपी करें (WhatsApp हेतु)'}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-white rounded-xl border border-emerald-200 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block">शिक्षक आईडी (ID):</span>
                          <span className="font-mono font-bold text-indigo-700 text-sm">
                            {appointedResult.teacherDisplayId}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">लॉगिन ईमेल (ID):</span>
                          <span className="font-semibold text-slate-900 break-all">
                            {appointedResult.teacher.email}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">सुरक्षा पिन (PIN):</span>
                          <span className="font-mono font-bold text-emerald-700 text-sm">
                            {appointedResult.plainPin}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block">असाइन किए गए कोर्स:</span>
                          <span className="font-semibold text-slate-900">
                            {appointedResult.courseTitles.length} कोर्स
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ACTIVE TEACHERS LIST & COURSE ASSIGNMENT MATRIX */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      नियुक्त शिक्षकों की सूची एवं कोर्स एक्सेस प्रबंधन ({cmsStore.getTeachers().length})
                    </h4>

                    {cmsStore.getTeachers().map((teacher) => {
                      const assignedIds = cmsStore.getTeacherAssignedCourseIds(teacher.id);
                      const allCourses = cmsStore.getCourses(INITIAL_USERS[0]); // Master list of all 9 courses

                      return (
                        <div
                          key={teacher.id}
                          className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:border-indigo-200 transition-all"
                        >
                          {/* Teacher Profile Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center justify-center font-bold text-base shadow-xs">
                                <GraduationCap className="w-6 h-6" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-bold text-slate-900">{teacher.name}</h4>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 uppercase">
                                    {teacher.display_id || teacher.id.substring(0, 8)}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-500">
                                  <span>{teacher.email}</span>
                                  <span>•</span>
                                  <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                                    PIN: {teacher.password_hash}
                                  </span>
                                  {teacher.subject_specialty && (
                                    <>
                                      <span>•</span>
                                      <span className="text-indigo-600 font-semibold">{teacher.subject_specialty}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                                अधिकृत कोर्स: <strong>{assignedIds.length}</strong> / {allCourses.length}
                              </span>

                              <button
                                type="button"
                                onClick={() => handleSwitchToTeacherTest(teacher)}
                                className="px-3 py-1.5 rounded-lg bg-[#0a2240] hover:bg-[#133560] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                                title="इस शिक्षक के रूप में तुरंत लॉगिन करके देखें कि उन्हें क्या दिखेगा"
                              >
                                <Eye className="w-3.5 h-3.5 text-amber-400" />
                                <span>शिक्षक मोड टेस्ट करें</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteTeacher(teacher.id, teacher.name)}
                                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                                title="शिक्षक को हटाएं / पदमुक्त करें"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Course Assignment Chips */}
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-700">
                              कोर्स एक्सेस असाइन करें (क्लिक करके अनुमति दें अथवा हटाएं):
                            </label>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {allCourses.map((course) => {
                                const isAssigned = assignedIds.includes(course.id);

                                return (
                                  <button
                                    key={course.id}
                                    type="button"
                                    onClick={() =>
                                      handleToggleCourseTeacher(course.id, teacher.id, teacher.name, course.title)
                                    }
                                    className={`p-2.5 rounded-xl text-left text-xs transition-all flex items-start gap-2 border ${
                                      isAssigned
                                        ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950 font-bold shadow-2xs'
                                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-indigo-50/50 hover:border-indigo-300'
                                    }`}
                                  >
                                    <div className="mt-0.5 shrink-0">
                                      {isAssigned ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                      ) : (
                                        <div className="w-4 h-4 rounded-full border border-slate-300 bg-white" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <span className="block leading-snug line-clamp-2">
                                        {course.title}
                                      </span>
                                      <span className="text-[10px] font-normal block mt-0.5 text-slate-500">
                                        {isAssigned ? '✓ अधिकृत (एक्सेस सक्रिय)' : '+ क्लिक कर असाइन करें'}
                                      </span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 5: DATABASE SCHEMA & SQL CODE */}
              {activeAdminTab === 'sql' && (
                <div className="space-y-4 max-w-4xl mx-auto">
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                        <Database className="w-4 h-4 text-purple-700" />
                        <span>PostgreSQL / Supabase पूर्ण डेटाबेस स्कीमा (course_teachers + RBAC + RLS)</span>
                      </h3>
                      <p className="text-[11px] text-purple-700 mt-0.5">
                        यह कोड <code className="font-mono bg-purple-100 px-1 rounded">/supabase/migrations/20261024_init_admin_cms.sql</code> एवं <code className="font-mono bg-purple-100 px-1 rounded">/schema.sql</code> में भी उपलब्ध है।
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopySql}
                      className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
                    >
                      {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSql ? 'कॉपी हो गया!' : 'Copy SQL Code'}</span>
                    </button>
                  </div>

                  <div className="bg-slate-900 rounded-xl p-4 text-slate-200 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800 max-h-96">
                    <pre className="whitespace-pre">
{`-- 1. USERS TABLE (Roles: admin, staff, teacher)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'staff', 'teacher')),
    subject_specialty VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. COURSE_TEACHERS JUNCTION TABLE (Multi-Instructor Access Mapping)
CREATE TABLE IF NOT EXISTS public.course_teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(course_id, teacher_id)
);

-- 4. SUBJECTS TABLE (FK to courses)
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. VIDEOS TABLE (FK to subjects, uploaded_by -> users)
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    video_url TEXT NOT NULL,
    duration VARCHAR(50) NOT NULL DEFAULT '45:00',
    order_index INT NOT NULL DEFAULT 0,
    uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. NOTES TABLE (FK to videos, uploaded_by -> users)
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size_mb NUMERIC(8, 2) NOT NULL DEFAULT 12.50,
    uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. EDITORIALS TABLE (Editorial & Current Affairs CMS)
CREATE TABLE IF NOT EXISTS public.editorials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('editorial', 'current_affairs')),
    category VARCHAR(100) NOT NULL,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    pdf_url TEXT,
    publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(50) NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'published',
    author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. ROW LEVEL SECURITY (RLS) POLICIES FOR TEACHERS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Policy: Teachers can only view & upload inside assigned courses
CREATE POLICY "Teachers can view assigned courses"
    ON public.courses FOR SELECT
    USING (
        auth.jwt() ->> 'role' = 'admin' OR
        EXISTS (
            SELECT 1 FROM public.course_teachers ct
            WHERE ct.course_id = courses.id
            AND ct.teacher_id = auth.uid()
        )
    );`}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* QUICK ATTACH / REPLACE PDF MODAL (Triggered from Dashboard Table) */}
        {attachModalVideo && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Paperclip className="w-4 h-4 text-blue-600" />
                  <span>PDF नोट्स जोड़ें / बदलें (Attach / Replace PDF)</span>
                </h4>
                <button
                  onClick={() => setAttachModalVideo(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-2 text-[11px] text-slate-500">
                वीडियो: <strong className="text-slate-800">{attachModalVideo.videoTitle}</strong>
              </div>

              <form onSubmit={handleSaveReplaceModal} className="space-y-3 mt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    नोट्स का शीर्षक *
                  </label>
                  <input
                    type="text"
                    value={replaceTitle}
                    onChange={(e) => setReplaceTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    फाइल URL *
                  </label>
                  <input
                    type="url"
                    value={replaceUrl}
                    onChange={(e) => setReplaceUrl(e.target.value)}
                    required
                    placeholder="https://example.com/notes.pdf"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    साइज (MB) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={replaceSize}
                    onChange={(e) => setReplaceSize(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAttachModalVideo(null)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#0a2240] text-white text-xs font-bold rounded-lg hover:bg-blue-900 shadow-sm"
                  >
                    सुरक्षित करें (Save)
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
