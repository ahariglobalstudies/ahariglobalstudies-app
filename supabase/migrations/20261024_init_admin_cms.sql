-- ==============================================================================
-- AHARI GLOBAL STUDIES (AGS) - CMS DATABASE MIGRATION WITH MULTI-INSTRUCTOR RBAC
-- Target: PostgreSQL / Supabase
-- Tables: users, courses, course_teachers, subjects, videos, notes, editorials
-- Multi-Instructor Access Control:
--   - 'admin': Full access to all courses, instructors, and global settings.
--   - 'teacher': Strictly scoped to assigned courses via course_teachers junction table.
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 2. USERS TABLE (Role-Based Access Control: admin / staff / teacher)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'staff', 'teacher')),
    subject_specialty VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- ------------------------------------------------------------------------------
-- 3. COURSES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_published ON public.courses(is_published);

-- ------------------------------------------------------------------------------
-- 4. COURSE_TEACHERS JUNCTION TABLE (Teacher-Specific Course Access)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.course_teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_course_teacher UNIQUE (course_id, teacher_id)
);

CREATE INDEX IF NOT EXISTS idx_course_teachers_course ON public.course_teachers(course_id);
CREATE INDEX IF NOT EXISTS idx_course_teachers_teacher ON public.course_teachers(teacher_id);

-- ------------------------------------------------------------------------------
-- 5. SUBJECTS TABLE (FK to courses)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subjects_course_id ON public.subjects(course_id);
CREATE INDEX IF NOT EXISTS idx_subjects_order ON public.subjects(course_id, order_index);

-- ------------------------------------------------------------------------------
-- 6. VIDEOS TABLE (FK to subjects, uploaded_by -> users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    video_url TEXT NOT NULL,
    duration VARCHAR(50) NOT NULL DEFAULT '45:00',
    order_index INT NOT NULL DEFAULT 0,
    uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_videos_subject_id ON public.videos(subject_id);
CREATE INDEX IF NOT EXISTS idx_videos_order ON public.videos(subject_id, order_index);
CREATE INDEX IF NOT EXISTS idx_videos_uploaded_by ON public.videos(uploaded_by);

-- ------------------------------------------------------------------------------
-- 7. NOTES TABLE (FK to videos, uploaded_by -> users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size_mb NUMERIC(8, 2) NOT NULL DEFAULT 12.50,
    uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notes_video_id ON public.notes(video_id);
CREATE INDEX IF NOT EXISTS idx_notes_uploaded_by ON public.notes(uploaded_by);

-- ------------------------------------------------------------------------------
-- 8. EDITORIALS TABLE (Editorial & Current Affairs CMS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.editorials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('editorial', 'current_affairs')),
    category VARCHAR(100) NOT NULL,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    pdf_url TEXT,
    publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(50) NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'published',
    author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_editorials_status ON public.editorials(status);
CREATE INDEX IF NOT EXISTS idx_editorials_type ON public.editorials(type);
CREATE INDEX IF NOT EXISTS idx_editorials_date ON public.editorials(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_editorials_author ON public.editorials(author_id);

-- ------------------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorials ENABLE ROW LEVEL SECURITY;

-- Helper Functions to check role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid() AND users.role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid() AND users.role = 'teacher'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public can view published content
CREATE POLICY "Public can view published courses" 
    ON public.courses FOR SELECT 
    USING (is_published = true);

CREATE POLICY "Public can view subjects of published courses" 
    ON public.subjects FOR SELECT 
    USING (EXISTS (SELECT 1 FROM public.courses WHERE courses.id = subjects.course_id AND courses.is_published = true));

CREATE POLICY "Public can view videos" 
    ON public.videos FOR SELECT 
    USING (true);

CREATE POLICY "Public can view notes" 
    ON public.notes FOR SELECT 
    USING (true);

CREATE POLICY "Public can view published editorials" 
    ON public.editorials FOR SELECT 
    USING (status = 'published');

-- ADMIN POLICIES: Full management access
CREATE POLICY "Admin can manage all users" ON public.users FOR ALL USING (public.is_admin());
CREATE POLICY "Admin can manage all courses" ON public.courses FOR ALL USING (public.is_admin());
CREATE POLICY "Admin can manage course assignments" ON public.course_teachers FOR ALL USING (public.is_admin());
CREATE POLICY "Admin can manage all subjects" ON public.subjects FOR ALL USING (public.is_admin());
CREATE POLICY "Admin can manage all videos" ON public.videos FOR ALL USING (public.is_admin());
CREATE POLICY "Admin can manage all notes" ON public.notes FOR ALL USING (public.is_admin());
CREATE POLICY "Admin can manage all editorials" ON public.editorials FOR ALL USING (public.is_admin());

-- TEACHER POLICIES: Scoped strictly to assigned courses via course_teachers
CREATE POLICY "Teachers can view assigned courses"
    ON public.courses FOR SELECT
    USING (
        public.is_teacher() AND EXISTS (
            SELECT 1 FROM public.course_teachers 
            WHERE course_teachers.course_id = courses.id 
              AND course_teachers.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can manage assigned course subjects"
    ON public.subjects FOR ALL
    USING (
        public.is_teacher() AND EXISTS (
            SELECT 1 FROM public.course_teachers 
            WHERE course_teachers.course_id = subjects.course_id 
              AND course_teachers.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can manage videos in their assigned courses"
    ON public.videos FOR ALL
    USING (
        public.is_teacher() AND EXISTS (
            SELECT 1 FROM public.subjects s
            JOIN public.course_teachers ct ON ct.course_id = s.course_id
            WHERE s.id = videos.subject_id 
              AND ct.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can manage notes in their assigned courses"
    ON public.notes FOR ALL
    USING (
        public.is_teacher() AND EXISTS (
            SELECT 1 FROM public.videos v
            JOIN public.subjects s ON s.id = v.subject_id
            JOIN public.course_teachers ct ON ct.course_id = s.course_id
            WHERE v.id = notes.video_id 
              AND ct.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can view their own course assignments"
    ON public.course_teachers FOR SELECT
    USING (teacher_id = auth.uid());

-- ------------------------------------------------------------------------------
-- 10. SEED INITIAL USERS & MULTI-INSTRUCTOR ASSIGNMENTS
-- ------------------------------------------------------------------------------
INSERT INTO public.users (id, name, email, password_hash, role, subject_specialty)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Shantilal Meena (Director)', 'shantilalmeena994@gmail.com', 'scrypt:9940', 'admin', 'All Subjects'),
    ('00000000-0000-0000-0000-000000000002', 'कागद सर (Kagad Sir)', 'kagad.sir@ags.edu', 'scrypt:5555', 'teacher', 'गणित एवं क्षेत्रमिति (Mathematics)'),
    ('00000000-0000-0000-0000-000000000003', 'अहारी सर (Ahari Sir)', 'ahari.faculty@ags.edu', 'scrypt:7777', 'teacher', 'मानचित्र एवं इतिहास (Mapping & History)'),
    ('00000000-0000-0000-0000-000000000004', 'AGS Content Staff', 'staff@ags.edu', 'scrypt:1234', 'staff', 'Content Operations')
ON CONFLICT (email) DO NOTHING;

-- Seed Subject Special Courses
INSERT INTO public.courses (id, title, slug, is_published, created_by)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'विश्व एवं भारत का मानचित्र (Mapping) स्पेशल बैच', 'mapping-special-shanti-lal-ahari', true, '00000000-0000-0000-0000-000000000001'),
    ('22222222-2222-2222-2222-222222222222', 'सम्पूर्ण इतिहास स्पेशल बैच (प्राचीन, मध्यकालीन व आधुनिक भारत)', 'history-special-shanti-lal-ahari', true, '00000000-0000-0000-0000-000000000001'),
    ('33333333-2222-2222-2222-222222222222', 'गणित एवं क्षेत्रमिति स्पेशल बैच (कागद सर व भावेश सर)', 'mathematics-mensuration-special', true, '00000000-0000-0000-0000-000000000001')
ON CONFLICT (slug) DO NOTHING;

-- Seed Teacher Course Assignments (Multi-Instructor Junction)
-- Kagad Sir -> Mathematics & Mensuration
-- Ahari Sir -> Mapping & History
INSERT INTO public.course_teachers (course_id, teacher_id)
VALUES 
    ('33333333-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000002'), -- Kagad Sir to Maths
    ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000003'), -- Ahari Sir to Mapping
    ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000003')  -- Ahari Sir to History
ON CONFLICT DO NOTHING;
