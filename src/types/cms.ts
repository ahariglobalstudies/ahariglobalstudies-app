export type UserRole = 'admin' | 'teacher' | 'student' | 'staff';

export interface DbUser {
  id: string;
  display_id?: string;
  name: string;
  email: string;
  phone?: string;
  password_hash?: string;
  role: UserRole;
  subject_specialty?: string;
  target_exam?: string;
  enrolled_courses?: string[];
  created_at: string;
}

export type RevisionType = 'correction' | 'deletion';
export type RevisionStatus = 'pending' | 'approved' | 'rejected';

export interface DbRevisionRequest {
  id: string;
  staff_id: string;
  staff_name: string;
  content_type: 'video' | 'note' | 'printable_note';
  content_id: string;
  content_title: string;
  course_id?: string;
  course_title: string;
  request_type: RevisionType;
  issue_description: string;
  proposed_correction?: string;
  status: RevisionStatus;
  admin_remarks?: string;
  created_at: string;
  resolved_at?: string;
}

export interface DbCourse {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
  created_by?: string;
  created_at?: string;
}

// Junction Table: course_teachers (Multi-Instructor System)
export interface DbCourseTeacher {
  id: string;
  course_id: string;
  teacher_id: string;
  assigned_at: string;
}

export interface DbSubject {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
  created_at?: string;
}

export interface DbVideo {
  id: string;
  subject_id: string;
  title: string;
  video_url: string;
  duration: string;
  order_index: number;
  uploaded_by?: string;
  created_at?: string;
}

export interface DbNote {
  id: string;
  video_id: string;
  title: string;
  file_url: string;
  file_size_mb: number;
  uploaded_by?: string;
  created_at?: string;
}

// 3rd Sub-Table: Printable PDF / Typed E-Book Notes
export interface DbPrintableNote {
  id: string;
  course_id: string;
  title: string;
  type: 'printable_pdf' | 'typed_ebook';
  file_url: string;
  pages: number;
  file_size_mb: number;
  uploaded_by?: string;
  uploader_name?: string;
  created_at?: string;
}

export type EditorialType = 'editorial' | 'current_affairs';
export type EditorialStatus = 'draft' | 'published';

export interface DbEditorial {
  id: string;
  type: EditorialType;
  category: string;
  title: string;
  slug: string;
  content: string;
  pdf_url?: string;
  publish_date: string;
  status: EditorialStatus;
  author_id?: string;
  author_name?: string;
  created_at?: string;
}

// Flat overview row for Content Dashboard Table
export interface DashboardContentRow {
  courseId: string;
  courseTitle: string;
  subjectId: string;
  subjectTitle: string;
  videoId: string;
  videoTitle: string;
  videoUrl: string;
  duration: string;
  orderIndex: number;
  videoUploadedBy?: string;
  hasNote: boolean;
  note?: DbNote;
  noteUploaderName?: string;
}
