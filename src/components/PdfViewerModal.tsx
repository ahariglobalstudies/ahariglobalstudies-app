import React, { useState } from 'react';
import {
  X,
  Download,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Moon,
  Sun,
  Bookmark,
  Share2,
  Check,
  FileText,
} from 'lucide-react';
import { NoteItem } from '../types';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: NoteItem;
  onDownloadCompleted?: (noteId: string) => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  note,
  onDownloadCompleted,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const [viewFormat, setViewFormat] = useState<'embed' | 'smart'>(note.fileUrl ? 'embed' : 'smart');

  if (!isOpen) return null;

  const totalPages = note.pages || 120;

  const handleDownload = () => {
    // If this is an admin-uploaded real PDF, trigger real PDF file download
    if (note.fileUrl) {
      const link = document.createElement('a');
      link.href = note.fileUrl;
      link.download = note.fileName || `${note.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      if (onDownloadCompleted) {
        onDownloadCompleted(note.id);
      }
      setTimeout(() => setDownloadSuccess(false), 3000);
      return;
    }

    // Default simulated classroom study notes
    const content = `=====================================================
AHARI GLOBAL STUDIES (AGS) - OFFICIAL CLASSROOM NOTES
Title: ${note.title}
Subject: ${note.subject} | Medium: ${note.medium}
Pages: ${note.pages} | Downloaded for Student: Shantilal Meena (#AGS-9941)
=====================================================

OVERVIEW & CHAPTER SUMMARY:
${note.pdfContentSummary}

STUDY ADVICE BY SHANTI LAL AHARI SIR:
1. Revise every diagram and memory trick at least 3 times before exams.
2. Solve previous 5 years questions related to each chapter.
3. Keep your focus high: "मंजिल पाना तो बहुत दूर की बात है, गर गुरूर में रहोगे, तो रास्ते भी न देख पाओगे।"

Official Portal: ahariglobalstudies.com
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${note.id}-AGS-Notes.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    if (onDownloadCompleted) {
      onDownloadCompleted(note.id);
    }
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-2xl bg-white text-slate-900 rounded-none sm:rounded-2xl max-h-screen sm:max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* PDF Reader Top Toolbar */}
        <div className="bg-[#0a2240] text-white px-4 py-2.5 flex items-center justify-between border-b border-blue-900">
          <div className="flex-1 truncate mr-2">
            <span className="text-[10px] text-amber-400 font-semibold block uppercase">
              {note.subject} • {note.medium} Medium
            </span>
            <h3 className="text-xs sm:text-sm font-bold truncate text-white">{note.title}</h3>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Dark mode toggle for reader */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-blue-100 hover:bg-white/20"
              title="Reading Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Bookmark */}
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isBookmarked ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-white/10 text-blue-100 hover:bg-white/20'
              }`}
              title="Bookmark Page"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className={`h-8 px-2.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold transition-all ${
                downloadSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 text-slate-950 hover:bg-amber-400 active:scale-95'
              }`}
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </>
              )}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Optional format switcher if fileUrl exists */}
        {note.fileUrl && (
          <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-200 text-xs">
            <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-300">
              <button
                onClick={() => setViewFormat('embed')}
                className={`px-3 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
                  viewFormat === 'embed'
                    ? 'bg-[#0a2240] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>मूल PDF फ़ाइल (Original PDF)</span>
              </button>
              <button
                onClick={() => setViewFormat('smart')}
                className={`px-3 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all ${
                  viewFormat === 'smart'
                    ? 'bg-[#0a2240] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>स्मार्ट रीडर (Reader View)</span>
              </button>
            </div>

            <a
              href={note.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0a2240] font-bold hover:underline flex items-center gap-1 text-[11px]"
            >
              <span>पूर्ण स्क्रीन पर खोलें ↗</span>
            </a>
          </div>
        )}

        {/* Reader Document Canvas */}
        {note.fileUrl && viewFormat === 'embed' ? (
          <div className="flex-1 w-full bg-slate-800 flex flex-col min-h-[500px]">
            <iframe
              src={`${note.fileUrl}#view=FitH`}
              className="w-full flex-1 min-h-[550px] border-0 bg-white"
              title={note.title}
            />
          </div>
        ) : (
          <div
            className={`flex-1 overflow-y-auto p-4 sm:p-6 transition-colors flex justify-center ${
              isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-100 text-slate-900'
            }`}
          >
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className={`w-full max-w-xl min-h-[500px] p-6 sm:p-8 rounded-xl shadow-lg border transition-transform duration-150 ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-100'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* Header Stamp */}
              <div className="flex items-center justify-between border-b pb-3 mb-4 border-current/15 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#0a2240] text-amber-400 font-bold flex items-center justify-center text-[10px]">
                    AGS
                  </div>
                  <span className="font-bold text-[11px] tracking-wide">
                    AHARI GLOBAL STUDIES • SMART NOTES
                  </span>
                </div>
                <span className="text-[10px] opacity-70">Page {currentPage} of {totalPages}</span>
              </div>

              {/* Page Title & Subject */}
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
                    Chapter Overview • {note.subject}
                  </span>
                  {note.isUploadedByAdmin && (
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                      Uploaded by Admin
                    </span>
                  )}
                </div>
                <h2 className="text-base sm:text-lg font-bold leading-tight mt-0.5">
                  {note.hindiTitle || note.title}
                </h2>
              </div>

              {/* Page Body Sample */}
              <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
                <div
                  className={`p-3 rounded-lg border ${
                    isDarkMode
                      ? 'bg-blue-950/30 border-blue-900/50 text-blue-200'
                      : 'bg-blue-50/80 border-blue-100 text-blue-950'
                  }`}
                >
                  <p className="font-semibold text-xs">
                    📌 {note.previewPages && note.previewPages.length > 0
                      ? note.previewPages[(currentPage - 1) % note.previewPages.length]
                      : `अध्याय: ${note.title} (कक्षा हस्तलिखित सम्पूर्ण नोट्स)`}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <h4 className="font-bold uppercase tracking-wider text-[11px] opacity-80">
                    विस्तृत अध्ययन सामग्री (Detailed Content):
                  </h4>
                  <p className="leading-relaxed opacity-90">{note.pdfContentSummary}</p>
                </div>

                {/* Memory Trick Box */}
                <div
                  className={`p-3 rounded-lg border text-xs ${
                    isDarkMode
                      ? 'bg-amber-950/20 border-amber-900/40 text-amber-200'
                      : 'bg-amber-50/70 border-amber-200/80 text-amber-950'
                  }`}
                >
                  <span className="font-bold block mb-1">💡 शांति लाल अहारी सर की स्मरण ट्रिक (Mnemonic):</span>
                  "कोई भी कठिन तथ्य हो, उसे रटने के बजाय उसके कारण और प्रभाव को समझें। जब आप मानचित्र और चित्र दिमाग में बैठा लेंगे, तो परीक्षा हॉल में कभी कन्फ्यूजन नहीं होगा।"
                </div>

                {/* Watermark / Digital signature */}
                <div className="pt-6 border-t border-current/10 flex items-center justify-between text-[10px] opacity-60">
                  <span>Verified by AGS Academic Research Team</span>
                  <span>File Size: {note.fileSize}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reader Bottom Navigation & Zoom Controls */}
        <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-between text-xs">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 text-slate-600">
            <button
              onClick={() => setZoomLevel(Math.max(70, zoomLevel - 10))}
              className="p-1 rounded hover:bg-slate-100"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="font-mono text-[11px] px-1">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(Math.min(130, zoomLevel + 10))}
              className="p-1 rounded hover:bg-slate-100"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Page Turner */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-50 flex items-center gap-1 text-xs font-semibold"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>पिछला (Prev)</span>
            </button>

            <span className="font-mono text-xs font-medium text-slate-700">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-50 flex items-center gap-1 text-xs font-semibold"
            >
              <span>अगला (Next)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
