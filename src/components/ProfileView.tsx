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
} from 'lucide-react';
import { COURSES, ORDER_HISTORY } from '../data/mockData';
import { UserProfile, Course, OrderRecord } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  language: 'hi' | 'en';
  onToggleLanguage: () => void;
  onOpenCourse: (course: Course) => void;
  onResumeLecture: (courseTitle: string, lectureTitle: string) => void;
  onOpenAdmin?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  language,
  onToggleLanguage,
  onOpenCourse,
  onResumeLecture,
  onOpenAdmin,
}) => {
  const [activeSection, setActiveSection] = useState<'batches' | 'orders' | 'help'>('batches');
  const [showInvoiceModal, setShowInvoiceModal] = useState<OrderRecord | null>(null);
  const [whatsappToast, setWhatsappToast] = useState(false);

  // Get enrolled courses
  const enrolledCourses = COURSES.filter((c) => user.enrolledCourseIds.includes(c.id));

  const handleWhatsappSupport = () => {
    setWhatsappToast(true);
    setTimeout(() => setWhatsappToast(false), 3500);
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* 1. USER PROFILE IDENTITY CARD */}
      <div className="bg-[#0a2240] rounded-2xl p-5 text-white shadow-md space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-amber-400 text-[#0a2240] flex items-center justify-center font-extrabold text-xl shadow-inner border border-amber-300 shrink-0">
            {user.name.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base sm:text-lg truncate">{user.name}</h2>
              <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.2 rounded-full">
                Student
              </span>
            </div>
            <p className="text-xs text-blue-200 font-mono">ID: {user.studentId}</p>
            <p className="text-xs text-blue-100/80 truncate">लक्ष्य: {user.targetExam}</p>
          </div>
        </div>

        {/* Study Statistics Strip */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center">
          <div className="p-2 rounded-xl bg-white/10 border border-white/10">
            <span className="text-xs font-mono font-extrabold text-amber-300 block">
              {enrolledCourses.length}
            </span>
            <span className="text-[10px] text-blue-200">
              {language === 'hi' ? 'बैच' : 'Batches'}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-white/10 border border-white/10">
            <span className="text-xs font-mono font-extrabold text-amber-300 block">
              {user.completedQuizzesCount}
            </span>
            <span className="text-[10px] text-blue-200">
              {language === 'hi' ? 'क्विज़' : 'Quizzes'}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-white/10 border border-white/10">
            <span className="text-xs font-mono font-extrabold text-amber-300 block">
              {user.totalHoursWatched}h
            </span>
            <span className="text-[10px] text-blue-200">
              {language === 'hi' ? 'अध्ययन समय' : 'Hours'}
            </span>
          </div>
        </div>
      </div>

      {/* Admin Portal Card */}
      {onOpenAdmin && (
        <div className="bg-gradient-to-r from-[#0a2240] to-slate-900 rounded-2xl p-4 text-white flex items-center justify-between border border-amber-400/30 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-white">
                {language === 'hi' ? 'व्यवस्थापक पोर्टल (Admin Portal)' : 'Admin Control Panel'}
              </h4>
              <p className="text-[11px] text-blue-200">
                {language === 'hi'
                  ? 'नोट्स अपलोड एवं करंट अफेयर्स सीधा प्रकाशन'
                  : 'Upload notes & publish current affairs'}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenAdmin}
            className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1 active:scale-95 shadow-xs transition-all shrink-0"
          >
            <span>{language === 'hi' ? 'एडमिन लॉगिन' : 'Admin Login'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. SECTION TABS (My Batches / Orders / Help Support) */}
      <div className="flex p-1 bg-slate-200/80 rounded-xl">
        <button
          onClick={() => setActiveSection('batches')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeSection === 'batches'
              ? 'bg-[#0a2240] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {language === 'hi' ? 'मेरे बैच' : 'My Batches'}
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

      {/* 3. ACTIVE SECTION CONTENT */}

      {/* SECTION A: MY ENROLLED BATCHES */}
      {activeSection === 'batches' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {language === 'hi' ? 'सक्रिय नामांकित बैच' : 'Active Enrolled Batches'}
            </h3>
            <span className="text-xs font-bold text-[#0a2240]">
              {enrolledCourses.length} {language === 'hi' ? 'बैच सक्रिय' : 'Batches Active'}
            </span>
          </div>

          <div className="space-y-3">
            {enrolledCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => onOpenCourse(course)}
                className="bg-white rounded-2xl p-4 border-2 border-indigo-200/90 hover:border-indigo-500 shadow-sm hover:shadow-md transition-all space-y-3 cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>प्रवेश पूर्ण (ACTIVE)</span>
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
                    <span>3. पीडीएफ</span>
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
                    <span>{language === 'hi' ? 'कोर्स कंटेंट खोलें (3 सब-टेबल)' : 'Open Course (3 Tabs)'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION B: ORDER HISTORY & INVOICE RECEIPTS */}
      {activeSection === 'orders' && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {language === 'hi' ? 'भुगतान एवं रसीद विवरण' : 'Payment History & Receipts'}
          </h3>

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
                    <span>रसीद</span>
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
                  {language === 'hi' ? 'AHARI GLOBAL STUDIES व्हाट्सएप सहायता' : 'AHARI GLOBAL STUDIES WhatsApp Support'}
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
                a: 'बिल्कुल! ' + 'PDF नोट्स' + ' टैब से आप कभी भी क्लास नोट्स डाउनलोड करके बिना इंटरनेट पढ़ सकते हैं।',
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

      {/* INVOICE MODAL */}
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
                  <span className="text-[10px] text-slate-400">{showInvoiceModal.invoiceNumber}</span>
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
                <span>छात्र का नाम:</span>
                <span className="font-bold text-slate-900">{user.name}</span>
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
