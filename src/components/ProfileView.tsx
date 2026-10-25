import React, { useState } from 'react';
import {
  User,
  BookOpen,
  Receipt,
  MessageCircle,
  PhoneCall,
  Clock,
  Award,
  Download,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  HelpCircle,
  FileText,
  CheckCircle2,
  Play,
  Layers,
  Video,
  Shield,
  LogOut,
  ArrowRightLeft,
  GraduationCap,
  Wrench,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { COURSES, ORDER_HISTORY } from '../data/mockData';
import { UserProfile, Course, OrderRecord } from '../types';
import { DbUser } from '../types/cms';
import { cmsStore } from '../services/cmsStore';

interface ProfileViewProps {
  user: UserProfile;
  currentUser?: DbUser | null;
  language: 'hi' | 'en';
  onToggleLanguage: () => void;
  onOpenCourse: (course: Course) => void;
  onResumeLecture: (courseTitle: string, lectureTitle: string) => void;
  onOpenAdmin?: () => void;
  onLogout?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  currentUser,
  language,
  onToggleLanguage,
  onOpenCourse,
  onResumeLecture,
  onOpenAdmin,
  onLogout,
}) => {
  const [activeSection, setActiveSection] = useState<'batches' | 'orders' | 'help'>('batches');
  const [showInvoiceModal, setShowInvoiceModal] = useState<OrderRecord | null>(null);
  const [whatsappToast, setWhatsappToast] = useState(false);

  // Active Authenticated User (Strict session from cmsStore)
  const activeUser: DbUser | null = currentUser || cmsStore.getCurrentUser();
  const role = activeUser?.role || 'student';

  // For students: dynamically get their enrolled courses
  const enrolledIds = activeUser?.enrolled_courses || user.enrolledCourseIds || [];
  const enrolledCourses = COURSES.filter((c) => enrolledIds.includes(c.id));

  // For teachers: get their allotted courses
  const teacherAssignedCourseIds =
    role === 'teacher' && activeUser ? cmsStore.getTeacherAssignedCourseIds(activeUser.id) : [];
  const teacherCourses = COURSES.filter((c) => teacherAssignedCourseIds.includes(c.id));

  // Staff revision requests stats
  const staffRevisionRequests =
    role === 'staff' && activeUser
      ? cmsStore.getRevisionRequests().filter((r) => r.staff_id === activeUser.id)
      : [];

  const handleWhatsappSupport = () => {
    setWhatsappToast(true);
    setTimeout(() => setWhatsappToast(false), 3500);
  };

  const handleTriggerLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      cmsStore.logout();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      
      {/* ============================================================== */}
      {/* 1. DYNAMIC USER PROFILE IDENTITY CARD (ROLE TAILORED) */}
      {/* ============================================================== */}

      {/* --- CASE A: STUDENT PROFILE --- */}
      {role === 'student' && (
        <div className="bg-gradient-to-br from-[#0a2240] via-[#0f2c52] to-[#0a2240] rounded-2xl p-5 text-white shadow-md space-y-4 border border-blue-900/60">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-[#0a2240] flex items-center justify-center font-extrabold text-2xl shadow-inner border border-amber-300 shrink-0">
                {activeUser?.name ? activeUser.name.charAt(0) : user.name.charAt(0)}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-bold text-base sm:text-lg truncate">
                    {activeUser?.name || user.name}
                  </h2>
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-emerald-300" />
                    <span>विद्यार्थी (Student)</span>
                  </span>
                </div>
                <p className="text-xs text-blue-200 font-mono">
                  आईडी: {activeUser?.display_id || user.studentId}
                </p>
                <p className="text-xs text-blue-100/80 truncate">
                  लक्ष्य: {activeUser?.target_exam || user.targetExam}
                </p>
                <p className="text-[11px] text-blue-300/70 truncate">
                  {activeUser?.email || user.email} • {activeUser?.phone || user.phone}
                </p>
              </div>
            </div>

            {/* Switch Role Button for testing & role changes */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-blue-100 border border-white/15 text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all shrink-0"
                title="भूमिका बदलें या अन्य आईडी से लॉगिन करें"
              >
                <ArrowRightLeft className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">भूमिका बदलें</span>
                <span className="sm:hidden">बदलें</span>
              </button>
            )}
          </div>

          {/* Study Statistics Strip */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center">
            <div className="p-2 rounded-xl bg-white/10 border border-white/10">
              <span className="text-xs font-mono font-extrabold text-amber-300 block">
                {enrolledCourses.length}
              </span>
              <span className="text-[10px] text-blue-200">
                {language === 'hi' ? 'सक्रिय बैच' : 'Batches'}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-white/10 border border-white/10">
              <span className="text-xs font-mono font-extrabold text-amber-300 block">
                {user.completedQuizzesCount}
              </span>
              <span className="text-[10px] text-blue-200">
                {language === 'hi' ? 'क्विज़ पूर्ण' : 'Quizzes'}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-white/10 border border-white/10">
              <span className="text-xs font-mono font-extrabold text-amber-300 block">
                {user.totalHoursWatched}h
              </span>
              <span className="text-[10px] text-blue-200">
                {language === 'hi' ? 'अध्ययन समय' : 'Study Hours'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* --- CASE B: TEACHER / FACULTY PROFILE --- */}
      {role === 'teacher' && activeUser && (
        <div className="bg-gradient-to-br from-indigo-950 via-[#0a2240] to-indigo-900 rounded-2xl p-5 text-white shadow-md space-y-4 border border-indigo-400/30">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-inner border border-indigo-300 shrink-0">
                👨‍🏫
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-bold text-base sm:text-lg truncate">{activeUser.name}</h2>
                  <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                    अधिकृत शिक्षक (Faculty)
                  </span>
                </div>
                <p className="text-xs text-indigo-200 font-mono">
                  आईडी: {activeUser.display_id || activeUser.id}
                </p>
                <p className="text-xs text-amber-200 truncate">
                  विशेषज्ञता: {activeUser.subject_specialty || 'संकाय विशेषज्ञ'}
                </p>
                <p className="text-[11px] text-indigo-200/70 truncate">{activeUser.email}</p>
              </div>
            </div>

            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-blue-100 border border-white/15 text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all shrink-0"
              >
                <ArrowRightLeft className="w-3 h-3 text-amber-400" />
                <span>भूमिका बदलें</span>
              </button>
            )}
          </div>

          {/* Teacher Course Authorization Banner */}
          <div className="p-3 rounded-xl bg-indigo-900/50 border border-indigo-500/30 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>आवंटित कोर्स संख्या: {teacherAssignedCourseIds.length}</span>
              </span>
              <span className="text-[11px] text-indigo-200">
                (केवल अधिकृत कोर्स ही दिखाई देंगे)
              </span>
            </div>
            <p className="text-[11px] text-indigo-100/80 leading-relaxed">
              आपको केवल आपके आवंटित कोर्स में अध्याय, वीडियो लेक्चर एवं नोट्स संशोधन/अपलोड करने का
              अधिकार है। डेटाबेस स्कीमा एवं अन्य कोर्स पूरी तरह सुरक्षित हैं।
            </p>
          </div>

          {/* Open Teacher Course Portal Action */}
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <FileText className="w-4 h-4 text-slate-950" />
              <span>मेरा अधिकृत कोर्स कंटेंट प्रबंधन पोर्टल खोलें</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* --- CASE C: TECHNICAL STAFF PROFILE --- */}
      {role === 'staff' && activeUser && (
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-5 text-white shadow-md space-y-4 border border-blue-400/30">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-inner border border-blue-400 shrink-0">
                🛠️
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-bold text-base sm:text-lg truncate">{activeUser.name}</h2>
                  <span className="text-[10px] font-bold bg-blue-400/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Wrench className="w-3 h-3 text-blue-300" />
                    <span>टेक्निकल स्टाफ (Technical Staff)</span>
                  </span>
                </div>
                <p className="text-xs text-blue-200 font-mono">
                  आईडी: {activeUser.display_id || activeUser.id}
                </p>
                <p className="text-xs text-blue-100 truncate">
                  कार्य: वीडियो, हैंडआउट व ई-बुक अपलोड • सुधार अनुरोध प्रणाली
                </p>
                <p className="text-[11px] text-blue-300/70 truncate">{activeUser.email}</p>
              </div>
            </div>

            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-blue-100 border border-white/15 text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all shrink-0"
              >
                <ArrowRightLeft className="w-3 h-3 text-amber-400" />
                <span>भूमिका बदलें</span>
              </button>
            )}
          </div>

          <div className="p-3 rounded-xl bg-blue-900/30 border border-blue-500/20 text-xs space-y-1.5">
            <strong className="text-amber-300 block font-bold">
              स्टाफ कार्यप्रणाली (Staff Protocol):
            </strong>
            <p className="text-[11px] text-blue-100/90 leading-relaxed">
              आप नए वीडियो लेक्चर, क्लास हैंडआउट एवं प्रिंटेबल ई-बुक सीधे अपलोड कर सकते हैं। पूर्व
              प्रकाशित सामग्री में गलती होने पर एडमिन को तुरंत सुधार अनुरोध भेजें।
            </p>
          </div>

          {/* Quick Staff Action Buttons */}
          {onOpenAdmin && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={onOpenAdmin}
                className="py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Video className="w-4 h-4 text-slate-950 shrink-0" />
                <span>अपलोड पोर्टल</span>
              </button>
              <button
                onClick={onOpenAdmin}
                className="py-2.5 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/20 transition-all"
              >
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>सुधार अनुरोध ({staffRevisionRequests.length})</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- CASE D: ADMIN / DIRECTOR PROFILE --- */}
      {role === 'admin' && activeUser && (
        <div className="bg-gradient-to-br from-[#0a2240] via-slate-900 to-[#0a2240] rounded-2xl p-5 text-white shadow-md space-y-4 border border-amber-400/40">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-2xl shadow-inner border border-amber-300 shrink-0">
                👑
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-bold text-base sm:text-lg truncate">{activeUser.name}</h2>
                  <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-400" />
                    <span>सर्वाधिकार (Super Admin)</span>
                  </span>
                </div>
                <p className="text-xs text-amber-300/90 font-mono">
                  आईडी: {activeUser.display_id || activeUser.id}
                </p>
                <p className="text-xs text-blue-200 truncate">
                  अधिकार: कोर्स पंजीकरण, शिक्षक/स्टाफ आवंटन, SQL, ओवरव्यू, रिवीजन समीक्षा
                </p>
                <p className="text-[11px] text-blue-300/70 truncate">{activeUser.email}</p>
              </div>
            </div>

            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-blue-100 border border-white/15 text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all shrink-0"
              >
                <ArrowRightLeft className="w-3 h-3 text-amber-400" />
                <span>भूमिका बदलें</span>
              </button>
            )}
          </div>

          {/* Admin Master Statistics Strip */}
          <div className="grid grid-cols-4 gap-1.5 pt-2 text-center text-[10px]">
            <div className="p-2 rounded-xl bg-white/10 border border-white/10">
              <span className="text-xs font-mono font-extrabold text-amber-300 block">
                {COURSES.length}
              </span>
              <span className="text-blue-200">कोर्सेज</span>
            </div>
            <div className="p-2 rounded-xl bg-white/10 border border-white/10">
              <span className="text-xs font-mono font-extrabold text-amber-300 block">
                {cmsStore.getTeachers().length}
              </span>
              <span className="text-blue-200">शिक्षक</span>
            </div>
            <div className="p-2 rounded-xl bg-white/10 border border-white/10">
              <span className="text-xs font-mono font-extrabold text-amber-300 block">
                {cmsStore.getStaffUsers().length}
              </span>
              <span className="text-blue-200">स्टाफ</span>
            </div>
            <div className="p-2 rounded-xl bg-white/10 border border-white/10">
              <span className="text-xs font-mono font-extrabold text-amber-300 block">
                {cmsStore.getRevisionRequests('pending').length}
              </span>
              <span className="text-amber-300 font-bold">लंबित समीक्षा</span>
            </div>
          </div>

          {/* Master Admin Portal Trigger */}
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>सम्पूर्ण एडमिन कंट्रोल पैनल खोलें (सभी 6 टैब)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. SECTION TABS (My Batches / Orders / Help Support) */}
      {/* ============================================================== */}
      <div className="flex p-1 bg-slate-200/80 rounded-xl">
        <button
          onClick={() => setActiveSection('batches')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeSection === 'batches'
              ? 'bg-[#0a2240] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {role === 'teacher'
            ? 'अधिकृत कोर्स'
            : language === 'hi'
            ? 'सक्रिय बैच'
            : 'My Batches'}
        </button>
        <button
          onClick={() => setActiveSection('orders')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeSection === 'orders'
              ? 'bg-[#0a2240] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {language === 'hi' ? 'रसीद / ऑर्डर' : 'Order History'}
        </button>
        <button
          onClick={() => setActiveSection('help')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeSection === 'help'
              ? 'bg-[#0a2240] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {language === 'hi' ? 'मदद / सहायता' : 'Help & Support'}
        </button>
      </div>

      {/* ============================================================== */}
      {/* 3. ACTIVE SECTION CONTENT */}
      {/* ============================================================== */}

      {/* SECTION A: MY BATCHES / ASSIGNED COURSES */}
      {activeSection === 'batches' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {role === 'teacher'
                ? 'आपके अधिकृत कोर्स (Only Assigned to You)'
                : language === 'hi'
                ? 'सक्रिय नामांकित बैच'
                : 'Active Enrolled Batches'}
            </h3>
            <span className="text-xs font-bold text-[#0a2240]">
              {(role === 'teacher' ? teacherCourses : enrolledCourses).length}{' '}
              {language === 'hi' ? 'बैच सक्रिय' : 'Batches Active'}
            </span>
          </div>

          <div className="space-y-3">
            {(role === 'teacher' ? (teacherCourses.length > 0 ? teacherCourses : COURSES.slice(0, 1)) : enrolledCourses).map(
              (course) => (
                <div
                  key={course.id}
                  onClick={() => onOpenCourse(course)}
                  className="bg-white rounded-2xl p-4 border-2 border-indigo-200/90 hover:border-indigo-500 shadow-xs hover:shadow-md transition-all space-y-3 cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>
                            {role === 'teacher' ? 'अधिकृत फैकल्टी एक्सेस' : 'प्रवेश पूर्ण (ACTIVE)'}
                          </span>
                        </span>
                        <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md font-semibold">
                          {course.category}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug group-hover:text-indigo-900 transition-colors">
                        {language === 'hi' && course.hindiTitle ? course.hindiTitle : course.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">{course.faculty}</p>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-[#0a2240] text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      {course.category.slice(0, 3)}
                    </div>
                  </div>

                  {/* 3 Sub-Tables Available Indicators */}
                  <div className="grid grid-cols-3 gap-1.5 py-1 text-center text-[10px]">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-1 text-slate-700 font-semibold flex items-center justify-center gap-1">
                      <Video className="w-3 h-3 text-blue-600 shrink-0" />
                      <span>1. वीडियो</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-1 text-slate-700 font-semibold flex items-center justify-center gap-1">
                      <FileText className="w-3 h-3 text-indigo-600 shrink-0" />
                      <span>2. क्लास नोट्स</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-1 text-slate-700 font-semibold flex items-center justify-center gap-1">
                      <BookOpen className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>3. ई-बुक पीडीएफ</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">वैधता: {course.validity}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenCourse(course);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#0a2240] hover:bg-[#133560] active:scale-95 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        {language === 'hi'
                          ? 'कोर्स कंटेंट खोलें (3 सब-टेबल)'
                          : 'Open Course (3 Tabs)'}
                      </span>
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* SECTION B: ORDER HISTORY & INVOICE RECEIPTS */}
      {activeSection === 'orders' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {language === 'hi' ? 'भुगतान एवं रसीद विवरण' : 'Payment History & Receipts'}
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">
              खाता: {activeUser?.name || user.name}
            </span>
          </div>

          <div className="space-y-2.5">
            {ORDER_HISTORY.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-500">
                      {order.orderId}
                    </span>
                    <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                      {order.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 truncate">
                    {order.courseTitle}
                  </h4>
                  <div className="text-[11px] text-slate-400">
                    {order.date} • {order.paymentMethod}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-extrabold text-sm text-[#0a2240] font-mono block">
                    ₹{order.amount}
                  </span>
                  <button
                    onClick={() => setShowInvoiceModal(order)}
                    className="text-[11px] font-semibold text-blue-700 hover:underline flex items-center gap-0.5 mt-0.5 justify-end"
                  >
                    <Receipt className="w-3 h-3" />
                    <span>रसीद देखें</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION C: HELP & WHATSAPP SUPPORT */}
      {activeSection === 'help' && (
        <div className="space-y-4">
          {/* WhatsApp Support Hero Card */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0">
                <MessageCircle className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-emerald-950">
                  AHARI GLOBAL STUDIES व्हाट्सएप सहायता
                </h4>
                <p className="text-xs text-emerald-800">
                  एडमिशन, ऐप संबंधी समस्या या पूछताछ के लिए तुरंत चैट करें
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleWhatsappSupport}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>व्हाट्सएप पर चैट करें (+91 88779 12345)</span>
              </button>
            </div>
          </div>

          {/* Direct Helpline Calling */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0a2240] flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                  स्टूडेंट हेल्पलाइन डेस्क (10 AM - 7 PM)
                </h4>
                <p className="text-xs text-slate-500 font-mono">0612-2345678 / +91 91556 78901</p>
              </div>
            </div>
            <a
              href="tel:+919155678901"
              className="px-3 py-1.5 rounded-lg bg-slate-100 text-[#0a2240] text-xs font-bold hover:bg-slate-200"
            >
              Call Now
            </a>
          </div>

          {/* Frequently Asked Questions */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              अक्सर पूछे जाने वाले सवाल (FAQs)
            </h4>
            {[
              {
                q: 'क्या लाइव क्लास छूट जाने पर रिकॉर्डेड वीडियो देख सकते हैं?',
                a: 'हां, प्रत्येक लाइव क्लास के 2 घंटे के भीतर रिकॉर्डेड वीडियो आपकी प्रोफाइल में पूरे कोर्स की वैधता तक उपलब्ध रहेगा।',
              },
              {
                q: 'क्या पीडीएफ नोट्स को ऑफलाइन डाउनलोड किया जा सकता है?',
                a: 'बिल्कुल! PDF नोट्स टैब से आप कभी भी क्लास नोट्स डाउनलोड करके बिना इंटरनेट पढ़ सकते हैं।',
              },
              {
                q: 'कम इंटरनेट स्पीड में वीडियो कैसे देखें?',
                a: 'वीडियो प्लेयर में 360p (Low Data) मोड चुनें, जिससे 2G/3G कनेक्शन में भी वीडियो बिना बफरिंग के चलता है।',
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1.5 cursor-pointer group"
              >
                <summary className="font-bold text-slate-900 list-none flex items-center justify-between">
                  <span>{faq.q}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="text-slate-600 pt-1 leading-relaxed border-t border-slate-100 mt-2">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* WHATSAPP TOAST NOTIFICATION */}
      {whatsappToast && (
        <div className="fixed bottom-20 left-4 right-4 z-50 max-w-sm mx-auto p-3.5 rounded-2xl bg-emerald-600 text-white text-xs font-medium shadow-xl flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200">
          <MessageCircle className="w-5 h-5 shrink-0" />
          <div className="flex-1">
            <span className="font-bold block">WhatsApp Support Simulated</span>
            <span>AHARI GLOBAL STUDIES Helpdesk (+91 88779 12345) connected.</span>
          </div>
        </div>
      )}

      {/* INVOICE MODAL (Shows actual logged in user's name) */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#0a2240] text-amber-400 font-bold flex items-center justify-center text-xs">
                  AGS
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">ई-रसीद (Tax Invoice)</h4>
                  <span className="text-[10px] text-slate-400">
                    {showInvoiceModal.invoiceNumber}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowInvoiceModal(null)}
                className="p-1 rounded-full hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>
                  {role === 'student' ? 'विद्यार्थी का नाम:' : 'उपयोगकर्ता का नाम:'}
                </span>
                <span className="font-bold text-slate-900">
                  {activeUser?.name || user.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span>आईडी:</span>
                <span className="font-mono text-slate-800">
                  {activeUser?.display_id || user.studentId}
                </span>
              </div>
              <div className="flex justify-between">
                <span>कोर्स विवरण:</span>
                <span className="font-bold text-slate-900 text-right max-w-[180px] truncate">
                  {showInvoiceModal.courseTitle}
                </span>
              </div>
              <div className="flex justify-between">
                <span>तारीख:</span>
                <span>{showInvoiceModal.date}</span>
              </div>
              <div className="flex justify-between">
                <span>भुगतान माध्यम:</span>
                <span>{showInvoiceModal.paymentMethod}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-sm text-slate-900">
                <span>कुल प्राप्त राशि:</span>
                <span className="text-emerald-700 font-mono">₹{showInvoiceModal.amount}</span>
              </div>
            </div>

            <button
              onClick={() => setShowInvoiceModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#0a2240] text-white font-bold text-xs hover:bg-blue-900"
            >
              बंद करें (Close)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
