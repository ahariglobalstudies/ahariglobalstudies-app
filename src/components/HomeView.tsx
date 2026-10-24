import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  Clock,
  BookOpen,
  ChevronRight,
  Flame,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Award,
  Download,
  Users,
  Star,
  Quote,
  Newspaper,
  FileText,
  TrendingUp,
  ShieldCheck,
  Trophy,
  X,
  RefreshCw,
  Video,
  ExternalLink,
} from 'lucide-react';
import {
  FEATURED_BANNERS,
  SUBJECT_CATEGORIES,
  COURSES,
  AHARI_SIR_QUOTES,
} from '../data/mockData';
import { Course, TabType } from '../types';

interface HomeViewProps {
  language: 'hi' | 'en';
  onNavigateTab: (tab: TabType) => void;
  onOpenCourseSyllabus: (course: Course) => void;
  onEnrollCourse: (course: Course) => void;
  onResumeLecture: (courseTitle: string, lectureTitle: string, videoUrl?: string) => void;
  onSelectCategoryFilter: (categoryName: string) => void;
  onStartDailyQuiz: () => void;
}

interface CurrentAffairsArticle {
  id: string;
  tag: string;
  date: string;
  titleHi: string;
  titleEn: string;
  summaryHi: string;
  summaryEn: string;
  pointsHi: string[];
  pointsEn: string[];
  mnemonicTip?: string;
  badge: string;
  readTime: string;
  fullVerbatimArticle?: {
    whyInNews: string;
    keyPoints: string[];
    mcqs: {
      questionNumber: string;
      question: string;
      options: string[];
      answer: string;
    }[];
    mainsAnalysis: string[];
  };
}

const CA_TAGS = [
  { id: 'all', labelHi: 'करंट अफेयर्स', labelEn: 'Current Affairs' },
  { id: 'daily', labelHi: 'दैनिक करंट अफेयर', labelEn: 'Daily CA' },
  { id: 'monthly', labelHi: 'मासिक', labelEn: 'Monthly' },
  { id: 'yearly', labelHi: 'वार्षिकी', labelEn: 'Yearly' },
  { id: 'test', labelHi: 'सामयिकी टेस्ट', labelEn: 'Samayiki Quiz' },
  { id: 'sports', labelHi: 'खेल', labelEn: 'Sports' },
];

const DAILY_CA_ARTICLES: CurrentAffairsArticle[] = [
  {
    id: 'ca-pm-surya-ghar',
    tag: 'daily',
    date: '24 अक्टूबर 2026',
    badge: 'विशेष संपादकीय • हॉट टॉपिक',
    readTime: '4 मिनट',
    titleHi: "भारत में नवीकरणीय ऊर्जा और रूफटॉप सोलर क्रांति: 'पीएम सूर्य घर' का प्रभाव",
    titleEn: "Renewable Energy & Rooftop Solar Revolution in India: Impact of 'PM Surya Ghar'",
    summaryHi: 'भारत ने वर्ष 2030 तक 500 गीगावाट (GW) गैर-जीवाश्म ईंधन आधारित बिजली क्षमता हासिल करने का राष्ट्रीय लक्ष्य रखा है। इस दिशा में ‘पीएम सूर्य घर: मुफ्त बिजली योजना’ ऊर्जा आत्मनिर्भरता का प्रमुख आधार बनी है।',
    summaryEn: 'India sets national goal of 500 GW non-fossil power capacity by 2030. PM Surya Ghar: Muft Bijli Yojana powers domestic decentralized solar adoption.',
    pointsHi: [
      'नोडल मंत्रालय: नवीन एवं नवीकरणीय ऊर्जा मंत्रालय (MNRE)।',
      'लक्ष्य: देश के 1 करोड़ घरों की छतों पर सोलर पैनल स्थापित करना।',
      'मुफ्त बिजली प्रावधान: प्रत्येक पात्र परिवार को प्रति माह 300 यूनिट तक मुफ्त सौर बिजली सुनिश्चित करने का प्रावधान।',
      'वित्तीय सहायता: 1-2 kW संयंत्रों पर लागत का ~60% केंद्रीय अनुदान, 3 kW+ पर ₹78,000 तक अधिकतम वित्तीय सहायता।'
    ],
    pointsEn: [
      'Nodal Ministry: Ministry of New and Renewable Energy (MNRE).',
      'National Target: Solar panel installations on 1 crore household rooftops across India.',
      'Free Power Provision: Up to 300 units of free solar power per month for eligible households.',
      'Financial Assistance: Up to ~60% central grant for 1-2 kW, and up to ₹78,000 for 3 kW or higher.'
    ],
    mnemonicTip: 'अहारी सर का मेमोरी सूत्र: 2030 (500 GW) + 1 करोड़ छतें + 300 यूनिट मुफ्त + MNRE = पीएम सूर्य घर का संपूर्ण निचोड़!',
    fullVerbatimArticle: {
      whyInNews:
        'भारत ने वर्ष 2030 तक 500 गीगावाट (GW) गैर-जीवाश्म ईंधन आधारित बिजली क्षमता हासिल करने का राष्ट्रीय लक्ष्य रखा है। इस दिशा में विकेंद्रीकृत सौर ऊर्जा (Decentralized Solar Power) को बढ़ावा देने के लिए संचालित ‘पीएम सूर्य घर: मुफ्त बिजली योजना’ देश भर में घरेलू और संस्थागत स्तर पर ऊर्जा आत्मनिर्भरता का प्रमुख आधार बनकर उभरी है।',
      keyPoints: [
        'नोडल मंत्रालय: नवीन एवं नवीकरणीय ऊर्जा मंत्रालय (MNRE)।',
        'लक्ष्य: देश के 1 करोड़ घरों की छतों पर सोलर पैनल स्थापित करना।',
        'मुफ्त बिजली प्रावधान: इसके तहत प्रत्येक पात्र परिवार को प्रति माह 300 यूनिट तक मुफ्त सौर बिजली सुनिश्चित करने का प्रावधान है।',
        'सब्सिडी संरचना (वित्तीय सहायता): 1 kW से 2 kW क्षमता तक के संयंत्रों के लिए लागत का लगभग 60% तक का केंद्रीय अनुदान।',
        '3 kW या उससे अधिक क्षमता पर ₹78,000 तक की अधिकतम वित्तीय सहायता।',
        'शेष राशि के लिए कम ब्याज दर पर संपार्श्विक-मुक्त (collateral-free) संस्थागत बैंक ऋण की सुविधा।'
      ],
      mcqs: [
        {
          questionNumber: 'प्रश्न 1',
          question:
            "'पीएम सूर्य घर: मुफ्त बिजली योजना' के तहत घरेलू उपभोक्ताओं को प्रति माह कितने यूनिट तक मुफ्त बिजली देने का लक्ष्य रखा गया है?",
          options: ['(A) 100 यूनिट', '(B) 200 यूनिट', '(C) 300 यूनिट', '(D) 400 यूनिट'],
          answer: 'उत्तर: (C) 300 यूनिट'
        },
        {
          questionNumber: 'प्रश्न 2',
          question:
            'भारत ने किस वर्ष तक 500 गीगावाट गैर-जीवाश्म ऊर्जा क्षमता प्राप्त करने का संकल्प लिया है?',
          options: ['(A) 2028', '(B) 2030', '(C) 2035', '(D) 2047'],
          answer: 'उत्तर: (B) 2030'
        }
      ],
      mainsAnalysis: [
        'डिस्कॉम (DISCOMs) पर सकारात्मक प्रभाव: घरेलू छतों पर सौर उत्पादन से ट्रांसमिशन एवं डिस्ट्रीब्यूशन (T&D) नुकसान कम होता है और पीक-आवर लोड प्रबंधन में सहायता मिलती है।',
        "कार्बन उत्सर्जन में कमी: यह पहल भारत के 'पंचामृत' लक्ष्यों और 2070 तक 'नेट ज़ीरो' कार्बन उत्सर्जन की प्रतिबद्धता को ज़मीनी स्तर पर गति देती है।"
      ]
    }
  },
  {
    id: 'ca-1',
    tag: 'daily',
    date: '24 अक्टूबर 2026',
    badge: 'दैनिक बुलेटिन',
    readTime: '3 मिनट',
    titleHi: 'राष्ट्रीय एवं अंतर्राष्ट्रीय समसामयिकी बुलेटिन: 24 अक्टूबर 2026',
    titleEn: 'National & International Current Affairs Bulletin: 24 Oct 2026',
    summaryHi: 'इसरो गगनयान मानव मिशन का अंतिम परीक्षण सफल, नोबेल पुरस्कार 2026 विजेताओं की सूची जारी, और भारत की जीडीपी विकास दर 7.2% अनुमानित।',
    summaryEn: 'ISRO Gaganyaan mission final dry test successful, Nobel Prize 2026 winners list declared, and India GDP forecast at 7.2%.',
    pointsHi: [
      'इसरो (ISRO): श्रीहरिकोटा से मानव रहित अंतरिक्ष क्रू मॉड्यूल का सफल परीक्षण पूरा।',
      'अर्थशास्त्र नोबेल 2026: संस्थागत विकास और आर्थिक समृद्धि पर अभूतपूर्व शोध के लिए प्रदान किया गया।',
      'राजस्थान समसामयिकी: मुख्यमंत्री रोजगार गारंटी योजना के अंतर्गत 125 दिन का रोजगार प्रावधान लागू।',
      'पर्यावरण: भारत का 55वां टाइगर रिजर्व राजस्थान के धौलपुर-करौली क्षेत्र में पूर्ण रूप से अधिसूचित।'
    ],
    pointsEn: [
      'ISRO successfully tests Gaganyaan unmanned crew escape module from Sriharikota.',
      'Nobel Prize 2026 announced highlighting institutional economics and prosperity.',
      'Rajasthan special: 125 days guaranteed urban employment initiative expanded.',
      '55th Tiger Reserve of India in Dholpur-Karauli fully notified.'
    ],
    mnemonicTip: 'शांति लाल अहारी सर की ट्रिक: "गगन-धौलपुर-नोबेल" त्रिसूत्र से आज के तीनों मुख्य प्रश्न कंठस्थ रखें!'
  },
  {
    id: 'ca-sports',
    tag: 'sports',
    date: '23 अक्टूबर 2026',
    badge: 'खेल जगत',
    readTime: '2 मिनट',
    titleHi: 'खेल समसामयिकी: एशियन शूटिंग चैंपियनशिप में भारत को 5 स्वर्ण पदक',
    titleEn: 'Sports CA: India clinches 5 Gold Medals at Asian Shooting Championship',
    summaryHi: 'भारतीय निशानेबाजों ने इतिहास रचा, 10 मीटर एयर राइफल और 50 मीटर राइफल 3-पोजिशन में शीर्ष स्थान प्राप्त किया।',
    summaryEn: 'Indian shooters scripted history in 10m Air Rifle and 50m Rifle 3-Position events.',
    pointsHi: [
      'भारत पदक तालिका में प्रथम स्थान पर रहा।',
      'निशानेबाजी में नए विश्व रिकॉर्ड के साथ पेरिस ओलंपिक के बाद सबसे बड़ा पदक संग्रह।',
      'राष्ट्रीय खेल 2026 के आगामी आयोजन स्थल की आधिकारिक घोषणा।'
    ],
    pointsEn: [
      'India topped the medal tally with exceptional shooting prowess.',
      'New continental record established in mixed team event.',
      'National Games 2026 venue finalized.'
    ],
    mnemonicTip: 'परीक्षा टिप: खेल पुरस्कार और पदक विजेताओं के नाम सीधे पूछे जाते हैं!'
  }
];

export const HomeView: React.FC<HomeViewProps> = ({
  language,
  onNavigateTab,
  onOpenCourseSyllabus,
  onEnrollCourse,
  onResumeLecture,
  onSelectCategoryFilter,
  onStartDailyQuiz,
}) => {
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [selectedCaTag, setSelectedCaTag] = useState<string>('all');
  const [activeArticleModal, setActiveArticleModal] = useState<CurrentAffairsArticle | null>(null);
  const [showAllCaModal, setShowAllCaModal] = useState(false);

  // Auto banner slider
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % FEATURED_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const activeBanner = FEATURED_BANNERS[activeBannerIndex];
  const targetCourse = COURSES.find((c) => c.id === activeBanner.targetCourseId) || COURSES[0];

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* 1. TOP FEATURED BANNER SLIDER */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 shadow-md">
        <div
          className={`relative p-5 sm:p-6 bg-gradient-to-br ${activeBanner.color} text-white min-h-[175px] sm:min-h-[195px] flex flex-col justify-between transition-all duration-300`}
        >
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Top Badge & Tag */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-amber-300 border border-white/20">
              {activeBanner.badge}
            </span>
            <span className="text-[10px] text-blue-200/90 font-medium">{activeBanner.tag}</span>
          </div>

          {/* Main Title & Subtitle */}
          <div className="relative z-10 my-2">
            <h2 className="text-lg sm:text-xl font-extrabold leading-tight tracking-tight text-white drop-shadow-xs">
              {activeBanner.title}
            </h2>
            <p className="text-xs text-blue-100/90 mt-1 max-w-sm line-clamp-2">
              {activeBanner.subtitle}
            </p>
          </div>

          {/* Price, Faculty and CTA */}
          <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/15">
            <div>
              <span className="text-[10px] text-blue-200 block">मार्गदर्शन: {activeBanner.faculty}</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-base sm:text-lg font-extrabold text-amber-400 font-mono">
                  {activeBanner.price}
                </span>
                <span className="text-xs text-blue-200/60 line-through">
                  {activeBanner.originalPrice}
                </span>
              </div>
            </div>

            <button
              onClick={() => onEnrollCourse(targetCourse)}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-[#0a2240] font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <span>{language === 'hi' ? 'एडमिशन लें' : 'Enroll Now'}</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Banner Pagination Dots */}
        <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1.5 z-20 pointer-events-auto">
          {FEATURED_BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveBannerIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                activeBannerIndex === idx ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 2. CONTINUE WATCHING CARD (ACTIVE COURSE RESUME) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wide">
              {language === 'hi' ? 'देखना जारी रखें' : 'Continue Watching'}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
            History Special Batch
          </span>
        </div>

        <div className="flex items-start gap-3">
          <div
            className="relative w-16 h-16 rounded-xl bg-slate-900 shrink-0 overflow-hidden flex items-center justify-center text-white shadow-xs group cursor-pointer"
            onClick={() =>
              onResumeLecture(
                'Complete History Special Batch',
                'Ancient History: सिंधु घाटी सभ्यता एवं नगर नियोजन',
                'https://youtu.be/RTXwE6g3Q4U?si=IpkySZpDoS4xvXuf'
              )
            }
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a2240] to-blue-900 opacity-90" />
            <Play className="w-6 h-6 text-amber-400 fill-current relative z-10 transition-transform group-hover:scale-110" />
          </div>

          <div className="flex-1 min-w-0">
            <h4
              onClick={() =>
                onResumeLecture(
                  'Complete History Special Batch',
                  'Ancient History: सिंधु घाटी सभ्यता एवं नगर नियोजन',
                  'https://youtu.be/RTXwE6g3Q4U?si=IpkySZpDoS4xvXuf'
                )
              }
              className="font-bold text-xs text-slate-900 truncate cursor-pointer hover:text-blue-700 transition-colors"
            >
              सिंधु घाटी सभ्यता एवं नगर नियोजन (Indus Valley Civilization)
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">फैकल्टी: शांति लाल अहारी • 42 मिनट शेष</p>

            {/* Progress Bar */}
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-[68%]" />
              </div>
              <span className="text-[10px] font-bold text-slate-600 font-mono">68%</span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] text-slate-400">Class Date: Today</span>
          <button
            onClick={() =>
              onResumeLecture(
                'Complete History Special Batch',
                'Ancient History: सिंधु घाटी सभ्यता एवं नगर नियोजन',
                'https://youtu.be/RTXwE6g3Q4U?si=IpkySZpDoS4xvXuf'
              )
            }
            className="text-xs font-bold text-[#0a2240] hover:text-blue-700 flex items-center gap-1 active:scale-95"
          >
            <span>{language === 'hi' ? 'क्लास फिर से शुरू करें' : 'Resume Lecture'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2.5 CURRENT AFFAIRS (करेंट अफेयर्स) SECTION */}
      {/* Positioned exactly between Continue Watching and above विषयवार अध्ययन */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>{language === 'hi' ? 'करेंट अफेयर्स' : 'Current Affairs'}</span>
            </h3>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
              {language === 'hi' ? 'आज का अपडेट' : "Today's Update"}
            </span>
          </div>
          <button
            onClick={() => setShowAllCaModal(true)}
            className="text-[11px] text-blue-700 font-semibold hover:underline flex items-center gap-0.5 active:scale-95"
          >
            <span>{language === 'hi' ? 'सभी देखें' : 'View All'}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Filter Tabs: Horizontal slidable chips row (करंट अफेयर, दैनिक करंट अफेयर, मासिक, वार्षिकी, सामयिकी टेस्ट, खेल) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 snap-x">
          {CA_TAGS.map((tag) => {
            const isSelected = selectedCaTag === tag.id;
            return (
              <button
                key={tag.id}
                onClick={() => {
                  setSelectedCaTag(tag.id);
                  if (tag.id === 'all') {
                    const el = document.getElementById('ca-card-daily');
                    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                  } else {
                    const el = document.getElementById(`ca-card-${tag.id}`);
                    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                  }
                }}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shadow-2xs active:scale-95 snap-start ${
                  isSelected
                    ? 'bg-[#0a2240] text-amber-300 font-bold border border-[#0a2240] shadow-xs'
                    : 'bg-white border border-slate-200/90 text-slate-700 hover:border-[#0a2240] hover:bg-slate-50'
                }`}
              >
                <span>{language === 'hi' ? tag.labelHi : tag.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Slidable Cards: Single horizontal slidable row */}
        <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 snap-x snap-mandatory pt-0.5">
          {/* Option 1: PM Surya Ghar Special Article */}
          <div
            id="ca-card-solar"
            className={`w-[280px] sm:w-[310px] shrink-0 snap-start bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white p-3.5 rounded-2xl border shadow-2xs flex flex-col justify-between transition-all ${
              selectedCaTag === 'daily' || selectedCaTag === 'all'
                ? 'border-amber-400 ring-1 ring-amber-400/40'
                : 'border-slate-200/90'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0">
                    <Flame className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold text-amber-800 uppercase">
                        {language === 'hi' ? 'विशेष लेख • हॉट टॉपिक' : 'Special Editorial'}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 leading-tight">
                      {language === 'hi'
                        ? "सोलर क्रांति: 'पीएम सूर्य घर' योजना"
                        : "Solar: 'PM Surya Ghar' Yojana"}
                    </h4>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mt-2 line-clamp-2">
                {language === 'hi'
                  ? '2030 तक 500 GW लक्ष्य, 1 करोड़ छतें, 300 यूनिट मुफ्त बिजली, सब्सिडी संरचना एवं 2 मुख्य MCQs।'
                  : '500 GW goal, 1 crore rooftops, 300 units free power, MNRE subsidy and key MCQs.'}
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-amber-200/70 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-medium">⏱️ 4 min • प्रश्नोत्तरी सहित</span>
              <button
                onClick={() => setActiveArticleModal(DAILY_CA_ARTICLES[0])}
                className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 active:scale-95"
              >
                <span>{language === 'hi' ? 'लेख पढ़ें' : 'Read Article'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Option 2: Daily News Bulletin */}
          <div
            id="ca-card-daily"
            className={`w-[275px] sm:w-[300px] shrink-0 snap-start bg-gradient-to-br from-white to-blue-50/50 p-3.5 rounded-2xl border shadow-2xs flex flex-col justify-between transition-all ${
              selectedCaTag === 'daily'
                ? 'border-blue-300 ring-1 ring-blue-400/30'
                : 'border-slate-200/90'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-700 flex items-center justify-center shrink-0">
                    <Newspaper className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold text-blue-700 uppercase">
                        {language === 'hi' ? 'दैनिक बुलेटिन' : 'Daily News'}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 leading-tight">
                      {language === 'hi' ? '24 अक्टूबर 2026 समसामयिकी' : '24 Oct 2026 Headlines'}
                    </h4>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mt-2 line-clamp-2">
                {language === 'hi'
                  ? 'इसरो गगनयान मॉड्यूल सफल परीक्षण, नोबेल 2026 और राजस्थान धौलपुर-करौली रिजर्व।'
                  : 'ISRO Gaganyaan trial, Nobel Prize 2026 announcements and state initiatives.'}
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-blue-100/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">⏱️ 3 min</span>
              <button
                onClick={() => setActiveArticleModal(DAILY_CA_ARTICLES[1])}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 active:scale-95"
              >
                <span>{language === 'hi' ? 'बुलेटिन पढ़ें' : 'Read News'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Option 2: Monthly PDF Magazine */}
          <div
            id="ca-card-monthly"
            className={`w-[275px] sm:w-[300px] shrink-0 snap-start bg-gradient-to-br from-white to-amber-50/40 p-3.5 rounded-2xl border shadow-2xs flex flex-col justify-between transition-all ${
              selectedCaTag === 'monthly'
                ? 'border-amber-400 ring-1 ring-amber-400/40'
                : 'border-amber-200/70'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold text-amber-700 uppercase">
                        {language === 'hi' ? 'मासिक विशेषांक' : 'Monthly PDF'}
                      </span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                        NEW
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 leading-tight">
                      {language === 'hi' ? 'अक्टूबर 2026 वार्षिकी मैगजीन' : 'October 2026 Magazine'}
                    </h4>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mt-2 line-clamp-2">
                {language === 'hi'
                  ? '150+ वस्तुनिष्ठ प्रश्नोत्तर, राजस्थान एवं राष्ट्रीय समसामयिकी हस्तलिखित नोट्स।'
                  : '150+ MCQs with detailed explanations and handwritten faculty notes.'}
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-amber-200/60 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">📄 64 पृष्ठ PDF</span>
              <button
                onClick={() => onNavigateTab('notes')}
                className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 active:scale-95"
              >
                <span>{language === 'hi' ? 'PDF डाउनलोड' : 'Get PDF'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Option 3: Samayiki Test */}
          <div
            id="ca-card-test"
            className={`w-[275px] sm:w-[300px] shrink-0 snap-start bg-gradient-to-br from-white to-emerald-50/50 p-3.5 rounded-2xl border shadow-2xs flex flex-col justify-between transition-all ${
              selectedCaTag === 'test'
                ? 'border-emerald-400 ring-1 ring-emerald-400/40'
                : 'border-emerald-200/80'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold text-emerald-700 uppercase">
                        {language === 'hi' ? 'सामयिकी टेस्ट' : 'Daily Test'}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                        FREE
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 leading-tight">
                      {language === 'hi' ? 'दैनिक समसामयिकी टेस्ट' : 'Current Affairs Quiz'}
                    </h4>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mt-2 line-clamp-2">
                {language === 'hi'
                  ? 'आज की घटनाओं पर आधारित 10 प्रश्न, ऑल इंडिया रैंक और विस्तृत व्याख्या।'
                  : '10 high-yield questions based on today news with instant rank calculation.'}
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-emerald-200/60 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">🎯 10 Qs • 10 Mins</span>
              <button
                onClick={onStartDailyQuiz}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 active:scale-95"
              >
                <span>{language === 'hi' ? 'टेस्ट दें' : 'Start Quiz'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Option 4: Yearly Special */}
          <div
            id="ca-card-yearly"
            className={`w-[275px] sm:w-[300px] shrink-0 snap-start bg-gradient-to-br from-white to-purple-50/40 p-3.5 rounded-2xl border shadow-2xs flex flex-col justify-between transition-all ${
              selectedCaTag === 'yearly'
                ? 'border-purple-400 ring-1 ring-purple-400/40'
                : 'border-purple-200/80'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-600/10 text-purple-700 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold text-purple-700 uppercase">
                        {language === 'hi' ? 'वार्षिकी विशेषांक' : 'Yearly Special'}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-bold">
                        2025-26
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 leading-tight">
                      {language === 'hi' ? 'वार्षिक समसामयिकी संकलन' : 'Yearly CA Master Compilation'}
                    </h4>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mt-2 line-clamp-2">
                {language === 'hi'
                  ? 'संपूर्ण वर्ष के सभी राष्ट्रीय व राजस्थान के प्रमुख मुद्दे एवं 1200+ प्रश्नोत्तर।'
                  : 'Complete year key topics, schemes, policy indices with 1200+ MCQs.'}
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-purple-200/60 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">📚 ई-बुक & नोट्स</span>
              <button
                onClick={() => onNavigateTab('notes')}
                className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 active:scale-95"
              >
                <span>{language === 'hi' ? 'विशेषांक देखें' : 'View Special'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Option 5: Sports News */}
          <div
            id="ca-card-sports"
            className={`w-[275px] sm:w-[300px] shrink-0 snap-start bg-gradient-to-br from-white to-orange-50/40 p-3.5 rounded-2xl border shadow-2xs flex flex-col justify-between transition-all ${
              selectedCaTag === 'sports'
                ? 'border-orange-400 ring-1 ring-orange-400/40'
                : 'border-orange-200/80'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-600/10 text-orange-700 flex items-center justify-center shrink-0">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold text-orange-700 uppercase">
                        {language === 'hi' ? 'खेल जगत' : 'Sports CA'}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-100 text-orange-800 font-bold">
                        5 GOLD
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 leading-tight">
                      {language === 'hi' ? 'एशियन शूटिंग व राष्ट्रीय खेल' : 'Asian Shooting & National Games'}
                    </h4>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mt-2 line-clamp-2">
                {language === 'hi'
                  ? 'भारतीय निशानेबाजों का रिकॉर्ड प्रदर्शन, आगामी राष्ट्रीय खेल स्थल एवं पदक तालिका।'
                  : 'Indian shooting records, upcoming National Games venue and medal tally.'}
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-orange-200/60 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">🏆 2 min पढ़ें</span>
              <button
                onClick={() => setActiveArticleModal(DAILY_CA_ARTICLES[1])}
                className="text-xs font-bold text-orange-700 hover:text-orange-900 flex items-center gap-1 active:scale-95"
              >
                <span>{language === 'hi' ? 'खबरें पढ़ें' : 'Read News'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. QUICK SUBJECT CATEGORY CHIPS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {language === 'hi' ? 'विषयवार अध्ययन' : 'Subject Categories'}
          </h3>
          <button
            onClick={() => onNavigateTab('courses')}
            className="text-[11px] text-blue-700 font-semibold hover:underline"
          >
            {language === 'hi' ? 'सभी देखें' : 'View All'}
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4">
          {SUBJECT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategoryFilter(cat.id);
                onNavigateTab('courses');
              }}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200/90 text-slate-800 text-xs font-semibold hover:border-[#0a2240] hover:bg-slate-50 active:scale-95 transition-all shadow-2xs"
            >
              <span>{language === 'hi' ? cat.nameHi : cat.nameEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. DAILY FREE QUIZ PROMOTION CARD */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-[#0a2240] text-white flex items-center justify-between gap-3 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-950">
              DAILY FREE QUIZ
            </span>
            <span className="text-[11px] text-blue-200 font-medium">10 Questions</span>
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-white">
            {language === 'hi'
              ? 'दैनिक समसामयिकी एवं GS ऑल इंडिया टेस्ट'
              : 'Daily Current Affairs & GS All India Quiz'}
          </h4>
          <p className="text-[11px] text-blue-200">
            {language === 'hi' ? 'अपनी तैयारी जांचें और ऑल इंडिया रैंक पाएं' : 'Check rank & prepare with Shanti Lal Ahari mnemonics'}
          </p>
        </div>

        <button
          onClick={onStartDailyQuiz}
          className="shrink-0 px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1"
        >
          <Award className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'टेस्ट दें' : 'Start'}</span>
        </button>
      </div>

      {/* 5. POPULAR BATCHES (TOP COURSES CAROUSEL / LIST) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {language === 'hi' ? 'लोकप्रिय बैच (Popular Batches)' : 'Popular Live Batches'}
          </h3>
          <button
            onClick={() => onNavigateTab('courses')}
            className="text-[11px] text-blue-700 font-semibold hover:underline"
          >
            {language === 'hi' ? 'पूरा कोर्स देखें' : 'View All'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {COURSES.slice(0, 6).map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-1 flex-wrap">
                  <span className="text-[9px] font-bold text-[#0a2240] bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-md">
                    {course.category}
                  </span>
                  {course.isLiveNow ? (
                    <span className="text-[9px] text-red-600 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                      LIVE
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-400 font-medium">
                      {course.medium}
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-2 min-h-[34px]">
                  {language === 'hi' && course.hindiTitle ? course.hindiTitle : course.title}
                </h4>

                <p className="text-[10px] text-slate-500 truncate">
                  {course.faculty}
                </p>

                {/* Price and Rating */}
                <div className="pt-1.5 border-t border-slate-100 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm sm:text-base font-extrabold text-[#0a2240] font-mono">
                      {course.price === 0 ? 'FREE' : `₹${course.price}`}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">
                      ₹{course.originalPrice}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    {course.rating}
                  </span>
                </div>

                {/* Validity & Enrolled */}
                <div className="flex items-center justify-between text-[9px] text-slate-400 pt-0.5">
                  <span className="truncate">{course.validity}</span>
                  <span className="shrink-0">{(course.enrolledCount / 1000).toFixed(0)}k छात्र</span>
                </div>
              </div>

              {/* Action Buttons: 2 per card */}
              <div className="grid grid-cols-2 gap-1.5 pt-2 mt-auto">
                <button
                  onClick={() => onOpenCourseSyllabus(course)}
                  className="py-1.5 px-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-[10px] font-semibold text-center truncate transition-colors"
                >
                  {language === 'hi' ? 'सिलेबस' : 'Syllabus'}
                </button>
                <button
                  onClick={() => onEnrollCourse(course)}
                  className="py-1.5 px-1 rounded-lg bg-[#0a2240] hover:bg-blue-900 active:scale-95 text-white text-[10px] font-bold text-center truncate transition-all shadow-2xs"
                >
                  {language === 'hi' ? `प्रवेश (₹${course.price})` : 'Enroll'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. DAILY SHANTI LAL AHARI MOTIVATION CARD */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-950 space-y-2 shadow-2xs">
        <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
          <Quote className="w-4 h-4 text-amber-600" />
          <span>{AHARI_SIR_QUOTES[0].tag}</span>
        </div>
        <p className="text-xs sm:text-sm font-medium italic leading-relaxed text-amber-900">
          "{AHARI_SIR_QUOTES[0].quote}"
        </p>
        <p className="text-[11px] text-amber-700/80">
          — शांति लाल अहारी (AHARI GLOBAL STUDIES)
        </p>
      </div>

      {/* 7. QUICK ACCESS TILES STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => onNavigateTab('notes')}
          className="p-3 rounded-xl bg-white border border-slate-200 text-left hover:border-slate-300 transition-all flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-xs text-slate-900 block leading-tight">
              {language === 'hi' ? 'PDF नोट्स' : 'PDF Notes'}
            </span>
            <span className="text-[10px] text-slate-400">Class Handwritten</span>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('tests')}
          className="p-3 rounded-xl bg-white border border-slate-200 text-left hover:border-slate-300 transition-all flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-900 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-xs text-slate-900 block leading-tight">
              {language === 'hi' ? 'मॉक टेस्ट' : 'Mock Tests'}
            </span>
            <span className="text-[10px] text-slate-400">All India Rank</span>
          </div>
        </button>
      </div>

      {/* MODAL 1: DAILY BULLETIN READER */}
      {activeArticleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0a2240] to-blue-900 text-white p-4.5 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                    {activeArticleModal.badge}
                  </span>
                  <span className="text-xs text-blue-200">{activeArticleModal.date}</span>
                </div>
                <h3 className="font-bold text-sm sm:text-base mt-1.5 leading-snug">
                  {language === 'hi' ? activeArticleModal.titleHi : activeArticleModal.titleEn}
                </h3>
              </div>
              <button
                onClick={() => setActiveArticleModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shrink-0 ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4.5 space-y-4 overflow-y-auto flex-1">
              {activeArticleModal.fullVerbatimArticle ? (
                /* Full Verbatim 4-Part Article View */
                <div className="space-y-4 text-xs">
                  {/* Section 1: चर्चा में क्यों? */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
                    <span className="font-bold text-amber-900 text-xs sm:text-sm block">
                      1. चर्चा में क्यों?
                    </span>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {activeArticleModal.fullVerbatimArticle.whyInNews}
                    </p>
                  </div>

                  {/* Section 2: योजना की मुख्य विशेषताएं */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                    <span className="font-bold text-[#0a2240] text-xs sm:text-sm block border-b border-slate-100 pb-1.5">
                      2. योजना की मुख्य विशेषताएं (Exam Key Points)
                    </span>
                    <div className="space-y-2 pt-0.5">
                      {activeArticleModal.fullVerbatimArticle.keyPoints.map((pt, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2 text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 3: बहुविकल्पीय प्रश्न (MCQs) */}
                  <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-3">
                    <div className="flex items-center justify-between border-b border-blue-200/60 pb-1.5">
                      <span className="font-bold text-blue-900 text-xs sm:text-sm">
                        3. परीक्षा उपयोगी बहुविकल्पीय प्रश्न (Practice MCQs)
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        2 Questions
                      </span>
                    </div>

                    <div className="space-y-3.5">
                      {activeArticleModal.fullVerbatimArticle.mcqs.map((mcq, mIdx) => (
                        <div
                          key={mIdx}
                          className="p-3 rounded-xl bg-white border border-blue-100 shadow-2xs space-y-2"
                        >
                          <div className="font-bold text-slate-900 flex items-start gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-mono shrink-0">
                              {mcq.questionNumber}
                            </span>
                            <span className="leading-snug">{mcq.question}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5 pt-1">
                            {mcq.options.map((opt, oIdx) => (
                              <div
                                key={oIdx}
                                className={`p-2 rounded-lg text-[11px] font-medium border ${
                                  mcq.answer.includes(opt.slice(0, 3))
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                                    : 'bg-slate-50 border-slate-200 text-slate-700'
                                }`}
                              >
                                {opt}
                              </div>
                            ))}
                          </div>

                          <div className="p-2 rounded-lg bg-emerald-100/70 text-emerald-900 font-bold text-[11px] flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <span>{mcq.answer}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 4: मुख्य परीक्षा हेतु विश्लेषणात्मक बिंदु */}
                  <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-200/80 space-y-2">
                    <span className="font-bold text-purple-950 text-xs sm:text-sm block border-b border-purple-200/60 pb-1.5">
                      4. मुख्य परीक्षा (Mains) हेतु विश्लेषणात्मक बिंदु
                    </span>
                    <div className="space-y-2 pt-0.5">
                      {activeArticleModal.fullVerbatimArticle.mainsAnalysis.map((an, aIdx) => (
                        <div key={aIdx} className="flex items-start gap-2 text-slate-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0 mt-1.5" />
                          <span className="leading-relaxed">{an}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Standard Bulletin View */
                <>
                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-slate-700 leading-relaxed font-medium">
                    {language === 'hi' ? activeArticleModal.summaryHi : activeArticleModal.summaryEn}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2">
                      {language === 'hi' ? 'मुख्य परीक्षा बिंदु (Key Highlights):' : 'Key Exam Points:'}
                    </h4>
                    <div className="space-y-2">
                      {(language === 'hi' ? activeArticleModal.pointsHi : activeArticleModal.pointsEn).map(
                        (point, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </>
              )}

              {activeArticleModal.mnemonicTip && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'अहारी सर का मेमोरी सूत्र' : 'Exam Memory Mnemonic'}</span>
                  </div>
                  <p className="text-xs text-amber-900 mt-1 font-semibold">
                    {activeArticleModal.mnemonicTip}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setActiveArticleModal(null);
                  onNavigateTab('notes');
                }}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-100 active:scale-95"
              >
                {language === 'hi' ? 'मासिक PDF देखें' : 'View Monthly PDF'}
              </button>
              <button
                onClick={() => {
                  setActiveArticleModal(null);
                  onStartDailyQuiz();
                }}
                className="px-4 py-2 rounded-xl bg-[#0a2240] text-amber-400 text-xs font-bold hover:bg-blue-900 active:scale-95 shadow-md flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'आज का टेस्ट दें' : 'Take Daily Quiz'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ALL CURRENT AFFAIRS HUB */}
      {showAllCaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-[#0a2240] to-blue-900 text-white p-4.5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">
                  {language === 'hi' ? 'करेंट अफेयर्स हब (Current Affairs)' : 'Current Affairs Hub'}
                </h3>
                <p className="text-xs text-blue-200">दैनिक समाचार, मासिक PDF और सामयिकी टेस्ट</p>
              </div>
              <button
                onClick={() => setShowAllCaModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto flex-1">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                    LATEST ISSUE
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm mt-1">
                    अक्टूबर 2026 समसामयिकी वार्षिकी विशेषांक
                  </h4>
                  <p className="text-[11px] text-blue-200">पूर्ण व्याख्या और 150+ वस्तुनिष्ठ प्रश्न</p>
                </div>
                <button
                  onClick={() => {
                    setShowAllCaModal(false);
                    onNavigateTab('notes');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 text-[#0a2240] text-xs font-bold shrink-0"
                >
                  PDF खोलें
                </button>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">सभी उपलब्ध अपडेट्स:</span>
                {DAILY_CA_ARTICLES.map((art) => (
                  <div
                    key={art.id}
                    className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-white transition-all cursor-pointer"
                    onClick={() => {
                      setShowAllCaModal(false);
                      setActiveArticleModal(art);
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                        {art.badge}
                      </span>
                      <span className="text-[10px] text-slate-400">{art.date}</span>
                    </div>
                    <h5 className="font-bold text-xs text-slate-900">
                      {language === 'hi' ? art.titleHi : art.titleEn}
                    </h5>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {language === 'hi' ? art.summaryHi : art.summaryEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <span className="text-xs text-slate-500">सभी नोट्स PDF सेक्शन में उपलब्ध हैं</span>
              <button
                onClick={() => {
                  setShowAllCaModal(false);
                  onNavigateTab('notes');
                }}
                className="text-xs font-bold text-blue-700 hover:underline"
              >
                PDF नोट्स पर जाएं →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
