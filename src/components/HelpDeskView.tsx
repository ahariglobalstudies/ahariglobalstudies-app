import React, { useState } from 'react';
import {
  Headset,
  PhoneCall,
  MessageCircle,
  Mail,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Send,
  CheckCircle2,
  Receipt,
  FileQuestion,
  User,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { UserProfile, OrderRecord } from '../types';
import { ORDER_HISTORY } from '../data/mockData';

interface HelpDeskViewProps {
  user: UserProfile;
  language: 'hi' | 'en';
}

export const HelpDeskView: React.FC<HelpDeskViewProps> = ({ user, language }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState('Payment / Course Access');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [whatsappToast, setWhatsappToast] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState<OrderRecord | null>(null);

  const faqs = [
    {
      q: 'कोर्स में प्रवेश (Admission) कैसे लें और ₹199 का भुगतान कैसे करें?',
      a: 'किसी भी कोर्स कार्ड पर "प्रवेश लें (₹199)" बटन पर क्लिक करें। आप Google Pay, PhonePe, Paytm, UPI या Debit Card से मात्र ₹199 का भुगतान करके तुरंत बैच में शामिल हो सकते हैं।',
    },
    {
      q: 'क्या लाइव क्लास छूट जाने पर रिकॉर्डेड वीडियो देख सकते हैं?',
      a: 'हां, प्रत्येक लाइव क्लास समाप्त होने के तुरंत बाद रिकॉर्डेड रूप में "My Courses" में पूरे 1 वर्ष की वैधता तक असीमित बार देखने के लिए उपलब्ध रहती है।',
    },
    {
      q: 'भावेश सर (Mathematics) एवं शांति लाल अहारी सर के PDF नोट्स कैसे पढ़ें व डाउनलोड करें?',
      a: '"PDF Notes" टैब पर जाएं। वहां "पीडीएफ पढ़ें" पर क्लिक करके ऐप के अंदर ज़ूम के साथ पढ़ सकते हैं और "डाउनलोड करें" बटन दबाकर अपने फोन/कंप्यूटर में ऑफलाइन सेव कर सकते हैं।',
    },
    {
      q: 'यदि बैंक खाते से पैसे कट जाएं और बैच सक्रिय न हो तो क्या करें?',
      a: 'चिंता न करें! हमारे हेल्पलाइन नंबर +91 91556 78901 पर या नीचे व्हाट्सएप पर अपने UTR / Transaction ID का स्क्रीनशॉट भेजें। हमारी टीम 15 मिनट में आपका बैच एक्टिव कर देगी।',
    },
    {
      q: 'क्या एक से अधिक डिवाइस (फोन और लैपटॉप) पर क्लास चल सकती है?',
      a: 'हां, आप अपने पंजीकृत मोबाइल नंबर से किसी भी डिवाइस पर ऐप खोलकर अपनी कक्षाएं जारी रख सकते हैं।',
    },
    {
      q: 'कम इंटरनेट स्पीड या ग्रामीण क्षेत्र में वीडियो कैसे देखें?',
      a: 'वीडियो प्लेयर के अंदर 360p (Low Data) क्वालिटी मोड दिया गया है, जिससे 2G/3G नेटवर्क में भी वीडियो बिना बफरिंग के सुचारू रूप से चलता है।',
    },
  ];

  const handleWhatsappClick = () => {
    setWhatsappToast(true);
    setTimeout(() => setWhatsappToast(false), 3500);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMessage.trim()) return;

    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setTicketMessage('');
    }, 4000);
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* 1. HERO SUPPORT BANNER */}
      <div className="bg-gradient-to-br from-[#0a2240] via-blue-950 to-slate-900 rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded-lg bg-amber-400 text-slate-950">
                <Headset className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                Student Support & Help Desk
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              {language === 'hi' ? 'अहारी ग्लोबल स्टडीज सहायता केंद्र' : 'AGS Student Help Desk'}
            </h2>
            <p className="text-xs text-blue-100/90 leading-relaxed">
              {language === 'hi'
                ? 'प्रवेश, तकनीकी सहायता, क्लास या नोट्स संबंधी किसी भी समस्या हेतु संपर्क करें।'
                : 'Contact us for admissions, technical assistance, courses, or notes.'}
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 text-amber-300 flex items-center justify-center shrink-0">
            <Headset className="w-6 h-6 text-amber-400" />
          </div>
        </div>

        {/* Student Quick Identity Strip */}
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-blue-200">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-white font-semibold">{user.name}</span>
            <span className="text-[10px] opacity-75">({user.studentId})</span>
          </span>
          <span className="font-mono text-[11px] text-amber-300">{user.phone}</span>
        </div>
      </div>

      {/* 2. DIRECT CONTACT ACTION CARDS (WHATSAPP + CALLING) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* WhatsApp Card */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-950 space-y-2.5 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-emerald-950">
                व्हाट्सएप सहायता (WhatsApp)
              </h4>
              <p className="text-[10px] text-emerald-700">त्वरित समाधान एवं चैट सहायता</p>
            </div>
          </div>

          <p className="text-xs text-emerald-800 leading-relaxed">
            एडमिशन, पेमेंट स्क्रीनशॉट या क्लास लिंक के लिए तुरंत व्हाट्सएप पर संदेश भेजें।
          </p>

          <button
            onClick={handleWhatsappClick}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>व्हाट्सएप पर चैट करें (+91 88779 12345)</span>
          </button>
        </div>

        {/* Calling Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2.5 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0a2240] border border-blue-100 flex items-center justify-center shrink-0 shadow-xs">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                हेल्पलाइन कॉलिंग (Toll-Free Helpline)
              </h4>
              <p className="text-[10px] text-slate-500 font-mono">09:00 AM - 08:00 PM</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-mono">
            +91 91556 78901 / 0612-2345678
          </p>

          <a
            href="tel:+919155678901"
            className="w-full py-2.5 rounded-xl bg-[#0a2240] hover:bg-blue-900 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>सीधे कॉल करें (+91 91556 78901)</span>
          </a>
        </div>
      </div>

      {/* 3. EMAIL & TIMINGS STRIP */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div className="min-w-0 truncate">
            <span className="font-bold text-slate-800 block text-[11px]">
              आधिकारिक ईमेल सपोर्ट
            </span>
            <span className="text-[11px] text-slate-500 font-mono truncate block">
              support@ahariglobalstudies.com
            </span>
          </div>
        </div>

        <a
          href="mailto:support@ahariglobalstudies.com?subject=Student%20Support%20Request"
          className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shrink-0"
        >
          ईमेल भेजें
        </a>
      </div>

      {/* 4. FREQUENTLY ASKED QUESTIONS (FAQS) ACCORDIONS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>अक्सर पूछे जाने वाले सवाल (FAQs)</span>
          </h3>
          <span className="text-[10px] text-slate-400">6 सामान्य प्रश्न</span>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;

            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-3.5 text-left flex items-center justify-between gap-3 text-xs font-bold text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <span className="leading-snug">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. SUBMIT QUERY TICKET FORM */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <FileQuestion className="w-4 h-4 text-[#0a2240]" />
          <h3 className="font-bold text-xs sm:text-sm text-slate-900">
            सवाल या शिकायत दर्ज करें (Submit Query Ticket)
          </h3>
        </div>

        {ticketSubmitted ? (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              आपका टिकट दर्ज कर लिया गया है (Ticket #AGS-{Math.floor(1000 + Math.random() * 9000)})। हमारी सहायता टीम 2 घंटे के भीतर आपसे संपर्क करेगी।
            </span>
          </div>
        ) : (
          <form onSubmit={handleTicketSubmit} className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                समस्या का विषय (Subject)
              </label>
              <select
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0a2240]"
              >
                <option value="Payment / Course Access">पेमेंट कट गया / बैच एक्टिव नहीं हुआ</option>
                <option value="Live Class / Video Issue">लाइव क्लास या वीडियो नहीं चल रहा</option>
                <option value="PDF Notes Download">PDF नोट्स डाउनलोड समस्या</option>
                <option value="Mock Test & Rank">मॉक टेस्ट या रैंक संबंधी सवाल</option>
                <option value="Other Query">अन्य सामान्य पूछताछ</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                विस्तृत विवरण (Explain your issue)
              </label>
              <textarea
                rows={3}
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="उदा. मैंने कल रात ₹199 का History बैच खरीदा था, कृपया एक्टिव करें..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0a2240] resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#0a2240] hover:bg-blue-900 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>टिकट सबमिट करें (Submit Ticket)</span>
            </button>
          </form>
        )}
      </div>

      {/* 6. ORDER RECEIPT / INVOICES QUICK ACCESS */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
            <Receipt className="w-4 h-4 text-slate-600" />
            <span>कोर्स शुल्क रसीद (Tax Invoices)</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {ORDER_HISTORY.length} Invoices
          </span>
        </div>

        <div className="space-y-1.5">
          {ORDER_HISTORY.slice(0, 2).map((order) => (
            <div
              key={order.orderId}
              className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
            >
              <div className="min-w-0">
                <span className="font-bold text-slate-900 truncate block text-[11px]">
                  {order.courseTitle}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {order.date} • ₹{order.amount}
                </span>
              </div>
              <button
                onClick={() => setShowReceiptModal(order)}
                className="text-[11px] font-bold text-blue-700 hover:underline shrink-0"
              >
                रसीद देखें
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* WHATSAPP TOAST NOTIFICATION */}
      {whatsappToast && (
        <div className="fixed bottom-20 left-4 right-4 z-50 max-w-sm mx-auto p-3.5 rounded-2xl bg-emerald-600 text-white text-xs font-medium shadow-xl flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200">
          <MessageCircle className="w-5 h-5 shrink-0" />
          <div className="flex-1">
            <span className="font-bold block">WhatsApp Support Connected</span>
            <span>AHARI GLOBAL STUDIES Helpdesk (+91 88779 12345) से चैट कनेक्ट हो गया।</span>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-[#0a2240] text-amber-400 font-bold flex items-center justify-center text-xs">
                  AGS
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">शुल्क रसीद (Tax Invoice)</h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {showReceiptModal.invoiceNumber}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowReceiptModal(null)}
                className="p-1 rounded-full hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>छात्र:</span>
                <span className="font-bold text-slate-900">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span>कोर्स:</span>
                <span className="font-bold text-slate-900 text-right max-w-[180px] truncate">
                  {showReceiptModal.courseTitle}
                </span>
              </div>
              <div className="flex justify-between">
                <span>तारीख:</span>
                <span>{showReceiptModal.date}</span>
              </div>
              <div className="flex justify-between">
                <span>माध्यम:</span>
                <span>{showReceiptModal.paymentMethod}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-sm text-slate-900">
                <span>कुल प्राप्त राशि:</span>
                <span className="text-emerald-700 font-mono">₹{showReceiptModal.amount}</span>
              </div>
            </div>

            <button
              onClick={() => setShowReceiptModal(null)}
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
