export type TabType = 'home' | 'my-courses' | 'courses' | 'tests' | 'notes' | 'helpdesk' | 'profile';

export type ExamCategory =
  | 'All'
  | 'CURRENT AFFAIRS'
  | 'MAPPING'
  | 'HISTORY'
  | 'GEOGRAPHY'
  | 'POLITY'
  | 'ECONOMY'
  | 'MATHEMATICS'
  | 'REASONING'
  | 'HINDI';

export type CourseType = 'live' | 'recorded' | 'free';

export interface Course {
  id: string;
  title: string;
  hindiTitle?: string;
  category: ExamCategory;
  type: CourseType;
  faculty: string;
  validity: string;
  price: number;
  originalPrice: number;
  isPopular?: boolean;
  isLiveNow?: boolean;
  rating: number;
  enrolledCount: number;
  medium: 'Hindi' | 'English' | 'Bilingual';
  startDate: string;
  totalHours: string;
  bannerGradient: string;
  description: string;
  syllabus: {
    title: string;
    topics: string[];
    hours: string;
  }[];
  lectures: {
    id: string;
    title: string;
    duration: string;
    isFreeDemo?: boolean;
    date: string;
    videoUrl?: string;
  }[];
}

export interface SheetClassRecord {
  id: string;
  title: string;
  batch: string;
  videoUrl: string;
  date: string;
}

export interface Question {
  id: number;
  questionEn: string;
  questionHi: string;
  optionsEn: string[];
  optionsHi: string[];
  correctOption: number; // 0-indexed
  explanationEn: string;
  explanationHi: string;
  topic: string;
}

export interface MockTest {
  id: string;
  title: string;
  hindiTitle: string;
  category: ExamCategory;
  durationMinutes: number;
  totalQuestions: number;
  totalMarks: number;
  negativeMarking: number;
  attemptedCount: number;
  isDailyQuiz?: boolean;
  questions: Question[];
}

export interface NoteItem {
  id: string;
  title: string;
  hindiTitle: string;
  subject: string;
  medium: 'Hindi' | 'English' | 'Bilingual';
  pages: number;
  fileSize: string;
  downloadCount: number;
  uploadDate: string;
  previewPages: string[];
  pdfContentSummary: string;
  fileUrl?: string;
  fileName?: string;
  isUploadedByAdmin?: boolean;
  uploaderName?: string;
  faculty?: string;
}

export interface UserProfile {
  name: string;
  studentId: string;
  phone: string;
  email: string;
  targetExam: string;
  state: string;
  enrolledCourseIds: string[];
  completedQuizzesCount: number;
  totalHoursWatched: number;
  downloadedNotesCount: number;
}

export interface OrderRecord {
  orderId: string;
  courseTitle: string;
  date: string;
  amount: number;
  paymentMethod: string;
  status: 'Completed' | 'Pending';
  invoiceNumber: string;
}
