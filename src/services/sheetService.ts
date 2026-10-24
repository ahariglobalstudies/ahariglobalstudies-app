import { SheetClassRecord } from '../types';

export const DEFAULT_SHEET_CSV_URL = '/assets/aistudio/RAJASTHAN_HISTORY_BATCH_1d1d2514';
const STORAGE_KEY = 'ags_google_sheet_csv_url';

export const FALLBACK_SHEET_CLASSES: SheetClassRecord[] = [
  {
    id: 'L01',
    title: 'सिंधु घाटी सभ्यता part 1',
    batch: 'Rajasthan history',
    videoUrl: 'https://youtu.be/RTXwE6g3Q4U?si=IpkySZpDoS4xvXuf',
    date: '24 October 2026',
  },
];

/**
 * Extracts a standard 11-character YouTube video ID from various YouTube URL formats.
 */
export function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const clean = url.trim();

  // 1. youtu.be/<id>
  const shortMatch = clean.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // 2. youtube.com/watch?v=<id>
  const watchMatch = clean.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  // 3. youtube.com/embed/<id>
  const embedMatch = clean.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  // 4. youtube.com/live/<id> or /shorts/<id>
  const streamMatch = clean.match(/youtube\.com\/(?:live|shorts)\/([a-zA-Z0-9_-]{11})/);
  if (streamMatch) return streamMatch[1];

  return null;
}

/**
 * Parses CSV raw text into structured SheetClassRecord array.
 */
export function parseSheetCsv(csvText: string): SheetClassRecord[] {
  if (!csvText || !csvText.trim()) return FALLBACK_SHEET_CLASSES;

  const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length <= 1) {
    return FALLBACK_SHEET_CLASSES;
  }

  // Header inspection
  const headerLine = lines[0].toLowerCase();
  const headerCols = headerLine.split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));

  const idIdx = headerCols.indexOf('id');
  const titleIdx = headerCols.indexOf('title');
  const batchIdx = headerCols.indexOf('batch');
  const videoUrlIdx = headerCols.indexOf('videourl');
  const dateIdx = headerCols.indexOf('date');

  const records: SheetClassRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    // CSV split handling quoted values
    const parts = parseCsvLine(rawLine);
    if (!parts || parts.length < 3) continue;

    const id = (idIdx !== -1 && parts[idIdx]) ? parts[idIdx] : `L${i < 10 ? '0' : ''}${i}`;
    const title = (titleIdx !== -1 && parts[titleIdx]) ? parts[titleIdx] : parts[1] || `Class ${i}`;
    const batch = (batchIdx !== -1 && parts[batchIdx]) ? parts[batchIdx] : parts[2] || 'Rajasthan history';
    const videoUrl = (videoUrlIdx !== -1 && parts[videoUrlIdx]) ? parts[videoUrlIdx] : parts[3] || '';
    const date = (dateIdx !== -1 && parts[dateIdx]) ? parts[dateIdx] : parts[4] || 'Latest Class';

    if (title.trim() && title.toLowerCase() !== 'title') {
      records.push({
        id: id.trim(),
        title: title.trim(),
        batch: batch.trim(),
        videoUrl: videoUrl.trim(),
        date: date.trim(),
      });
    }
  }

  return records.length > 0 ? records : FALLBACK_SHEET_CLASSES;
}

/**
 * Handles basic CSV line with quotes and commas
 */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result.map((r) => r.replace(/^["']|["']$/g, '').trim());
}

/**
 * Gets configured active CSV URL from localStorage or default
 */
export function getActiveSheetUrl(): string {
  try {
    const custom = localStorage.getItem(STORAGE_KEY);
    if (custom && custom.trim()) {
      return custom.trim();
    }
  } catch (e) {
    console.warn('Could not read sheet url from localStorage', e);
  }
  return DEFAULT_SHEET_CSV_URL;
}

/**
 * Sets new custom CSV URL
 */
export function setActiveSheetUrl(url: string): void {
  try {
    if (url && url.trim()) {
      localStorage.setItem(STORAGE_KEY, url.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (e) {
    console.warn('Could not save sheet url to localStorage', e);
  }
}

/**
 * Fetches Google Sheet live CSV data with cache-busting
 */
export async function fetchGoogleSheetClasses(customUrl?: string): Promise<{
  classes: SheetClassRecord[];
  sourceUrl: string;
  isOnline: boolean;
}> {
  const targetUrl = customUrl?.trim() || getActiveSheetUrl();
  const cacheBustUrl = targetUrl.includes('?')
    ? `${targetUrl}&_t=${Date.now()}`
    : `${targetUrl}?_t=${Date.now()}`;

  try {
    const response = await fetch(cacheBustUrl, {
      method: 'GET',
      headers: {
        Accept: 'text/csv, text/plain, */*',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    const text = await response.text();
    const parsed = parseSheetCsv(text);
    return {
      classes: parsed,
      sourceUrl: targetUrl,
      isOnline: true,
    };
  } catch (error) {
    console.warn('Error fetching live Google Sheet CSV, falling back to cached file:', error);

    // Fallback: If custom URL failed, try the local workspace file
    if (targetUrl !== DEFAULT_SHEET_CSV_URL) {
      try {
        const fallbackRes = await fetch(DEFAULT_SHEET_CSV_URL);
        if (fallbackRes.ok) {
          const fallbackText = await fallbackRes.text();
          return {
            classes: parseSheetCsv(fallbackText),
            sourceUrl: DEFAULT_SHEET_CSV_URL,
            isOnline: false,
          };
        }
      } catch (fbErr) {
        console.warn('Fallback fetch failed too', fbErr);
      }
    }

    return {
      classes: FALLBACK_SHEET_CLASSES,
      sourceUrl: targetUrl,
      isOnline: false,
    };
  }
}
