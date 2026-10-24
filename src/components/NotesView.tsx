import React, { useState } from 'react';
import {
  FileText,
  Download,
  Search,
  Eye,
  CheckCircle2,
  FolderOpen,
} from 'lucide-react';
import { PDF_NOTES } from '../data/mockData';
import { NoteItem } from '../types';

interface NotesViewProps {
  language: 'hi' | 'en';
  onOpenPdf: (note: NoteItem) => void;
  onDownloadNote: (note: NoteItem) => void;
  downloadedNoteIds: string[];
  notes?: NoteItem[];
}

export const NotesView: React.FC<NotesViewProps> = ({
  language,
  onOpenPdf,
  onDownloadNote,
  downloadedNoteIds,
  notes = PDF_NOTES,
}) => {
  const [selectedMedium, setSelectedMedium] = useState<'All' | 'Hindi' | 'English'>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // 8 AGS Special subjects
  const subjects = [
    'All',
    'HISTORY',
    'POLITY',
    'GEOGRAPHY',
    'MAPPING',
    'ECONOMY',
    'MATHEMATICS',
    'REASONING',
    'HINDI',
  ];

  // Subject label helper
  const getSubjectLabel = (sub: string) => {
    switch (sub.toUpperCase()) {
      case 'HISTORY':
        return language === 'hi' ? 'इतिहास (History)' : 'History';
      case 'POLITY':
        return language === 'hi' ? 'राजव्यवस्था (Polity)' : 'Polity';
      case 'GEOGRAPHY':
        return language === 'hi' ? 'भूगोल (Geography)' : 'Geography';
      case 'MAPPING':
        return language === 'hi' ? 'मानचित्र (Mapping)' : 'Mapping';
      case 'ECONOMY':
        return language === 'hi' ? 'अर्थव्यवस्था (Economy)' : 'Economy';
      case 'MATHEMATICS':
        return language === 'hi' ? 'गणित (Maths)' : 'Mathematics';
      case 'REASONING':
        return language === 'hi' ? 'रीजनिंग (Reasoning)' : 'Reasoning';
      case 'HINDI':
        return language === 'hi' ? 'सामान्य हिंदी (Hindi)' : 'Hindi';
      default:
        return sub;
    }
  };

  const filteredNotes = notes.filter((note) => {
    // Medium filter
    if (selectedMedium === 'Hindi' && note.medium !== 'Hindi' && note.medium !== 'Bilingual') {
      return false;
    }
    if (selectedMedium === 'English' && note.medium !== 'English' && note.medium !== 'Bilingual') {
      return false;
    }

    // Subject filter
    if (selectedSubject !== 'All' && note.subject.toUpperCase() !== selectedSubject.toUpperCase()) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = note.title.toLowerCase().includes(q);
      const matchHindi = (note.hindiTitle || '').toLowerCase().includes(q);
      const matchSub = note.subject.toLowerCase().includes(q);
      if (!matchTitle && !matchHindi && !matchSub) return false;
    }

    return true;
  });

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* 1. HEADER & SEARCH */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            {language === 'hi' ? 'क्लास नोट्स एवं ई-बुक्स डाउनलोड' : 'Class Notes & PDF Materials'}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'hi'
              ? 'शांति लाल अहारी सर द्वारा प्रमाणित हस्तलिखित नोट्स, माइंडमैप एवं मंथली ई-बुक्स'
              : 'Official digitized classroom handwritten notes by Shanti Lal Ahari and revision charts'}
          </p>
        </div>

        {/* Search Notes Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'hi' ? 'नोट्स या विषय खोजें...' : 'Search notes by topic or keyword...'}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0a2240] shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 3. MEDIUM FILTER (HINDI / ENGLISH / ALL) */}
      <div className="flex p-1 bg-slate-200/80 rounded-xl">
        <button
          onClick={() => setSelectedMedium('All')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            selectedMedium === 'All'
              ? 'bg-[#0a2240] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {language === 'hi' ? 'सभी माध्यम (All)' : 'All Mediums'}
        </button>
        <button
          onClick={() => setSelectedMedium('Hindi')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            selectedMedium === 'Hindi'
              ? 'bg-[#0a2240] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          हिंदी माध्यम (Hindi)
        </button>
        <button
          onClick={() => setSelectedMedium('English')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
            selectedMedium === 'English'
              ? 'bg-[#0a2240] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          English Medium
        </button>
      </div>

      {/* 4. SUBJECT TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
        {subjects.map((sub) => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
              selectedSubject === sub
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {getSubjectLabel(sub)}
          </button>
        ))}
      </div>

      {/* 5. PDF NOTES LIST */}
      <div className="space-y-3">
        {filteredNotes.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
            <FolderOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-sm text-slate-800">कोई नोट्स नहीं मिला</h4>
            <p className="text-xs text-slate-500">
              कृपया माध्यम या विषय बदलकर पुनः प्रयास करें।
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => {
            const isDownloaded = downloadedNoteIds.includes(note.id);

            return (
              <div
                key={note.id}
                className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:border-[#0a2240]/40 transition-all"
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Left: PDF Icon + Essential Info Only */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      {/* 1. Title */}
                      <h4
                        onClick={() => onOpenPdf(note)}
                        className="font-bold text-xs sm:text-sm text-slate-900 leading-snug cursor-pointer hover:text-blue-700 transition-colors"
                      >
                        {language === 'hi' ? note.hindiTitle || note.title : note.title}
                      </h4>

                      {/* 2. Faculty / Teacher Name */}
                      <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
                        {note.uploaderName || note.faculty || (language === 'hi' ? 'कागद सर' : 'Faculty')}
                      </div>

                      {/* 3. Pages, Size (MB), Date ONLY */}
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 font-medium flex-wrap">
                        <span>{note.pages} पृष्ठ</span>
                        <span>•</span>
                        <span>{note.fileSize}</span>
                        <span>•</span>
                        <span>{note.uploadDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Small Compact Read & Download Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onOpenPdf(note)}
                      title={language === 'hi' ? 'पीडीएफ पढ़ें' : 'Read PDF'}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span className="hidden sm:inline">{language === 'hi' ? 'पढ़ें' : 'Read'}</span>
                    </button>

                    <button
                      onClick={() => onDownloadNote(note)}
                      title={isDownloaded ? 'डाउनलोड हो चुका' : 'डाउनलोड करें'}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 active:scale-95 transition-all shadow-2xs ${
                        isDownloaded
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-[#0a2240] hover:bg-blue-900 text-white'
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
                          <span>{language === 'hi' ? 'डाउनलोड' : 'PDF'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
