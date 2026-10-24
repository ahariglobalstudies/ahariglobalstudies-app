import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  FileText,
  HelpCircle,
  List,
  CheckCircle2,
  Send,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { extractYouTubeId } from '../services/sheetService';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lectureTitle: string;
  courseTitle: string;
  facultyName?: string;
  onOpenNotes?: () => void;
  videoUrl?: string;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onClose,
  lectureTitle,
  courseTitle,
  facultyName = 'शांति लाल अहारी (Shanti Lal Ahari)',
  onOpenNotes,
  videoUrl,
}) => {
  const youtubeId = extractYouTubeId(videoUrl);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(1420); // 23:40
  const duration = 4500; // 75 mins
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [quality, setQuality] = useState<'360p' | '480p' | '720p'>('480p');
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'chapters' | 'notes' | 'doubts'>('chapters');
  const [doubtText, setDoubtText] = useState('');
  const [doubtsList, setDoubtsList] = useState<
    { user: string; question: string; answer?: string; time: string }[]
  >([
    {
      user: 'Rahul Kumar',
      question: 'सर, हड़प्पा में अन्नागार (Granary) का मुंह नदी की तरफ क्यों था?',
      answer: 'शांति लाल अहारी सर उत्तर: ताकि नाव से आने-जाने वाले अनाज को सीधे गोदाम में उतारा जा सके। यह हड़प्पा सभ्यता के एडवांस लॉजिस्टिक्स का सबूत है!',
      time: '10 mins ago',
    },
    {
      user: 'Pooja Sharma',
      question: 'Sir, what was the standard ratio of Harappan bricks?',
      answer: 'Standard ratio was 4:2:1 (Length : Breadth : Thickness). Remember 4-2-1 formula!',
      time: '25 mins ago',
    },
  ]);

  // Video ticker simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handlePostDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim()) return;
    setDoubtsList([
      {
        user: 'You (Shantilal Meena)',
        question: doubtText,
        answer: 'शांति लाल अहारी टीम: आपका प्रश्न दर्ज कर लिया गया है। अगली लाइव डाउट क्लास में शांति लाल अहारी सर इसका विश्लेषण करेंगे।',
        time: 'Just now',
      },
      ...doubtsList,
    ]);
    setDoubtText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4">
      <div className="w-full sm:max-w-2xl bg-slate-900 text-white rounded-none sm:rounded-2xl max-h-screen sm:max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-800">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/90 border-b border-slate-800">
          <div className="flex-1 truncate mr-2">
            <span className="text-[11px] text-amber-400 font-semibold block">{courseTitle}</span>
            <h3 className="text-xs sm:text-sm font-bold truncate text-white">{lectureTitle}</h3>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {videoUrl && (
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded-lg transition-colors"
                title="YouTube पर खोलें"
              >
                <span>YouTube ↗</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white"
              aria-label="Close lecture player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Canvas / Inbuilt YouTube Player */}
        {youtubeId ? (
          <div className="relative bg-black aspect-video w-full flex items-center justify-center overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
              title={lectureTitle}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="relative bg-black aspect-video flex flex-col justify-between p-3 select-none overflow-hidden group">
            {/* Blackboard / Visual Graphic Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#07192f] via-[#0b2447] to-[#040d1a] flex flex-col items-center justify-center p-6 text-center">
              {/* Visual Classroom elements */}
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-lg">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <div className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                Live Classroom Broadcast • {facultyName}
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white max-w-md line-clamp-2">
                {lectureTitle}
              </h4>
              <p className="text-[11px] text-slate-300 mt-1 max-w-sm">
                AHARI GLOBAL STUDIES Smart Digital Board Studio
              </p>

              {/* Brand Watermark */}
              <div className="absolute bottom-12 right-4 text-[10px] text-white/30 font-bold tracking-widest pointer-events-none">
                AGS OFFICIAL CLASSROOM
              </div>
            </div>

            {/* Top Controls Overlay */}
            <div className="relative z-10 flex items-center justify-between text-xs">
              <span className="bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                STUDY VOD
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value as any)}
                  className="bg-black/60 border border-white/20 text-white text-[10px] rounded px-1.5 py-0.5 font-medium cursor-pointer"
                >
                  <option value="360p">360p (Low Data)</option>
                  <option value="480p">480p (Standard)</option>
                  <option value="720p">720p HD</option>
                </select>

                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                  className="bg-black/60 border border-white/20 text-white text-[10px] rounded px-1.5 py-0.5 font-medium cursor-pointer"
                >
                  <option value={1}>1.0x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2.0x</option>
                </select>
              </div>
            </div>

            {/* Center Play/Pause button */}
            <div className="relative z-10 flex items-center justify-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-[#0a2240] flex items-center justify-center shadow-xl transition-transform active:scale-90"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
              </button>
            </div>

            {/* Bottom Scrub and Controls */}
            <div className="relative z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-3 pb-1 -mx-3 -mb-3 px-3">
              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={(e) => setCurrentTime(Number(e.target.value))}
                className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />

              <div className="flex items-center justify-between text-[11px] mt-1 text-slate-300">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                    className="hover:text-white"
                    title="-10s"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="hover:text-white font-bold"
                  >
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                  <button
                    onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
                    className="hover:text-white"
                    title="+10s"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="hover:text-white ml-1"
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                  <span className="font-mono tabular-nums text-[10px]">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="text-[10px] text-amber-400/90 font-medium">
                  {Math.round((currentTime / duration) * 100)}% Watched
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lower Tabbed Panel for Chapters, Notes, Doubts */}
        <div className="flex border-b border-slate-800 bg-slate-950/70 text-xs">
          <button
            onClick={() => setActiveTab('chapters')}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 font-semibold transition-colors ${
              activeTab === 'chapters'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-white/5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>विषय सूची (Chapters)</span>
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 font-semibold transition-colors ${
              activeTab === 'notes'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-white/5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>क्लास नोट्स (Notes)</span>
          </button>
          <button
            onClick={() => setActiveTab('doubts')}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 font-semibold transition-colors ${
              activeTab === 'doubts'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-white/5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>पूछें सवाल (Doubts)</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 flex-1 overflow-y-auto max-h-[35vh] bg-slate-900/90 text-xs space-y-3">
          {activeTab === 'chapters' && (
            <div className="space-y-2">
              {[
                { time: '00:00', title: '1. Introduction & Discovery of Harappa (Dayaram Sahni 1921)', done: true },
                { time: '15:20', title: '2. Geographical Boundaries (Manda, Alamgirpur, Daimabad, Sutkagendor)', done: true },
                { time: '28:45', title: '3. Great Bath & Granary of Mohenjo-daro with Drainage Grid', done: false },
                { time: '45:10', title: '4. Trade, Seals & Bronze Dancing Girl Sculpture', done: false },
                { time: '62:00', title: '5. Theories of Decline & Previous Year UPSC Questions', done: false },
              ].map((chap, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 transition-colors cursor-pointer"
                  onClick={() => {
                    const [m, s] = chap.time.split(':').map(Number);
                    setCurrentTime(m * 60 + s);
                    setIsPlaying(true);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${chap.done ? 'text-emerald-400' : 'text-slate-600'}`}
                    />
                    <span className="font-medium text-slate-200">{chap.title}</span>
                  </div>
                  <span className="font-mono text-[10px] text-amber-400 bg-black/30 px-1.5 py-0.5 rounded shrink-0">
                    {chap.time}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <h5 className="font-bold text-amber-400 text-xs mb-1">
                  📄 Digital Board Handwritten PDF Notes
                </h5>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  आज की क्लास के सभी बोर्ड नोट्स, मानचित्र और महत्वपूर्ण सूत्र पीडीएफ प्रारूप में उपलब्ध हैं।
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (onOpenNotes) {
                        onClose();
                        onOpenNotes();
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
                  >
                    Open PDF Notes (नोट्स खोलें)
                  </button>
                  <span className="text-[10px] text-slate-400">14 Pages • 4.2 MB</span>
                </div>
              </div>

              {/* Shanti Lal Ahari Sir Quick Mnemonics */}
              <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-900/40 text-[11px] text-blue-200">
                <span className="font-bold text-blue-300 block mb-0.5">शांति लाल अहारी सर की खास ट्रिक:</span>
                "हड़प्पा की सीमा याद रखने की ट्रिक: <strong>समअदा (S-M-A-D)</strong> - सुत्कागेंनडोर (पश्चिम), मांडा (उत्तर), आलमगीरपुर (पूर्व), दायमाबाद (दक्षिण)!"
              </div>
            </div>
          )}

          {activeTab === 'doubts' && (
            <div className="space-y-3">
              <form onSubmit={handlePostDoubt} className="flex gap-2">
                <input
                  type="text"
                  value={doubtText}
                  onChange={(e) => setDoubtText(e.target.value)}
                  placeholder="शांति लाल अहारी सर से अपना सवाल पूछें..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-amber-500 text-slate-950 rounded-xl font-bold text-xs flex items-center gap-1 hover:bg-amber-400 active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>भेजें</span>
                </button>
              </form>

              <div className="space-y-2 mt-2">
                {doubtsList.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-semibold text-amber-300">{item.user}</span>
                      <span>{item.time}</span>
                    </div>
                    <p className="text-slate-200 text-xs font-medium">{item.question}</p>
                    {item.answer && (
                      <div className="mt-1.5 p-2 rounded bg-slate-900/90 text-[11px] text-emerald-300 border-l-2 border-emerald-400">
                        {item.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
