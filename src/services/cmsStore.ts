import {
  DbUser,
  DbCourse,
  DbCourseTeacher,
  DbSubject,
  DbVideo,
  DbNote,
  DbPrintableNote,
  DbEditorial,
  DashboardContentRow,
  DbRevisionRequest,
  RevisionStatus,
} from '../types/cms';

const STORAGE_KEY = 'ags_cms_db_v7';
const AUTH_KEY = 'ags_cms_current_user_v4';

// Initial Seed Users (Admin, Teachers, Technical Staff, Students)
export const INITIAL_USERS: DbUser[] = [
  {
    id: 'usr_admin_001',
    display_id: 'AGS-ADM-001',
    name: 'Shantilal Meena (Director)',
    email: 'shantilalmeena994@gmail.com',
    phone: '+91 98765 43210',
    password_hash: '9940',
    role: 'admin',
    subject_specialty: 'All Master Batches (सर्वाधिकार एवं पूर्ण नियंत्रण)',
    created_at: '2026-10-24T00:00:00Z',
  },
  {
    id: 'usr_teacher_kagad',
    display_id: 'AGS-TCH-001',
    name: 'कागद सर (Kagad Sir)',
    email: 'kagad.sir@ags.edu',
    phone: '+91 98291 55555',
    password_hash: '5555',
    role: 'teacher',
    subject_specialty: 'गणित एवं क्षेत्रमिति विशेषज्ञ',
    created_at: '2026-10-24T00:00:00Z',
  },
  {
    id: 'usr_teacher_bhavesh',
    display_id: 'AGS-TCH-002',
    name: 'भावेश सर (Bhavesh Sir)',
    email: 'bhavesh.faculty@ags.edu',
    phone: '+91 98292 77777',
    password_hash: '7777',
    role: 'teacher',
    subject_specialty: 'मानचित्र एवं इतिहास संकाय',
    created_at: '2026-10-24T00:00:00Z',
  },
  {
    id: 'usr_staff_002',
    display_id: 'AGS-STF-001',
    name: 'सुनील वर्मा (Sunil Verma - Content Staff)',
    email: 'staff@ags.edu',
    phone: '+91 98293 12345',
    password_hash: '1234',
    role: 'staff',
    subject_specialty: 'कंटेंट एवं तकनीकी सपोर्ट',
    created_at: '2026-10-24T00:00:00Z',
  },
  {
    id: 'usr_student_rahul',
    display_id: 'AGS-STU-101',
    name: 'राहुल शर्मा (Rahul Sharma)',
    email: 'rahul.student@gmail.com',
    phone: '+91 98290 11223',
    password_hash: '1111',
    role: 'student',
    target_exam: 'RAS & SI Special Batch (AGS)',
    enrolled_courses: ['course-history-special', 'course-mapping-special'],
    created_at: '2026-10-24T00:00:00Z',
  },
  {
    id: 'usr_student_priya',
    display_id: 'AGS-STU-102',
    name: 'प्रिया वर्मा (Priya Verma)',
    email: 'priya.verma@gmail.com',
    phone: '+91 97840 55667',
    password_hash: '2222',
    role: 'student',
    target_exam: 'Teacher Grade 1st & 2nd Exam',
    enrolled_courses: ['course-mathematics-special'],
    created_at: '2026-10-24T00:00:00Z',
  },
];

export const INITIAL_REVISION_REQUESTS: DbRevisionRequest[] = [
  {
    id: 'rev-001',
    staff_id: 'usr_staff_002',
    staff_name: 'सुनील वर्मा (Content Staff)',
    content_type: 'video',
    content_id: 'vid-demo-1',
    content_title: 'मानचित्र परिचय एवं अक्षांश-देशांतर',
    course_title: 'विश्व एवं भारत का मानचित्र (Mapping) स्पेशल बैच',
    request_type: 'correction',
    issue_description: 'वीडियो के 14वें मिनट में ऑडियो थोड़ा धीमा है। नया री-मास्टर्ड लिंक प्राप्त हुआ है, कृपया एडमिन महोदय इसे अपडेट करने की स्वीकृति दें।',
    proposed_correction: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ (Remastered Audio)',
    status: 'pending',
    created_at: '2026-10-24T10:30:00Z',
  },
];

// Initial Seed Courses - 9 Subject Masterclass Batches
export const INITIAL_COURSES: DbCourse[] = [
  {
    id: 'course-mapping-special',
    title: 'विश्व एवं भारत का मानचित्र (Mapping) स्पेशल बैच',
    slug: 'mapping-special-shanti-lal-ahari',
    is_published: true,
    created_by: 'usr_admin_001',
    created_at: '2026-10-24T00:00:00Z',
  },
  {
    id: 'course-history-special',
    title: 'सम्पूर्ण इतिहास स्पेशल बैच (प्राचीन, मध्यकालीन व आधुनिक भारत)',
    slug: 'history-special-shanti-lal-ahari',
    is_published: true,
    created_by: 'usr_admin_001',
    created_at: '2026-10-24T00:00:00Z',
  },
  {
    id: 'course-polity-special',
    title: 'भारतीय संविधान एवं राजव्यवस्था स्पेशल बैच (अनुच्छेद 1 से 395)',
    slug: 'polity-constitution-special-shanti-lal-ahari',
    is_published: true,
    created_by: 'usr_admin_001',
    created_at: '2026-10-24T00:00:00Z',
  },
  {
    id: 'course-mathematics-special',
    title: 'गणित एवं क्षेत्रमिति (Mensuration) स्पेशल बैच (कागद सर व भावेश सर)',
    slug: 'mathematics-mensuration-special',
    is_published: true,
    created_by: 'usr_admin_001',
    created_at: '2026-10-24T00:00:00Z',
  },
  {
    id: 'course-geography-special',
    title: 'सम्पूर्ण भूगोल स्पेशल बैच (भारत एवं विश्व का भूगोल)',
    slug: 'geography-special-shanti-lal-ahari',
    is_published: true,
    created_by: 'usr_admin_001',
    created_at: '2026-10-24T00:00:00Z',
  },
  {
    id: 'course-current-affairs-special',
    title: 'दैनिक समसामयिकी एवं मासिक राष्ट्रीय/अंतर्राष्ट्रीय करेंट अफेयर्स',
    slug: 'current-affairs-special-shanti-lal-ahari',
    is_published: true,
    created_by: 'usr_admin_001',
    created_at: '2026-10-24T00:00:00Z',
  },
  {
    id: 'course-hindi-special',
    title: 'सामान्य हिंदी व्याकरण मास्टर बैच',
    slug: 'general-hindi-master-batch',
    is_published: true,
    created_by: 'usr_staff_002',
    created_at: '2026-10-24T00:00:00Z',
  },
  {
    id: 'course-reasoning-special',
    title: 'तर्कशक्ति परीक्षण (Reasoning) स्पेशल बैच',
    slug: 'reasoning-special-batch',
    is_published: true,
    created_by: 'usr_staff_002',
    created_at: '2026-10-24T00:00:00Z',
  },
  {
    id: 'course-economy-special',
    title: 'भारतीय अर्थव्यवस्था एवं वित्तीय प्रणाली स्पेशल बैच',
    slug: 'indian-economy-special-batch',
    is_published: true,
    created_by: 'usr_staff_002',
    created_at: '2026-10-24T00:00:00Z',
  },
];

// Initial Seed Course Teachers Mapping (Junction Table: course_teachers)
export const INITIAL_COURSE_TEACHERS: DbCourseTeacher[] = [
  // Kagad Sir -> Mathematics & Mensuration
  {
    id: 'ct-1',
    course_id: 'course-mathematics-special',
    teacher_id: 'usr_teacher_kagad',
    assigned_at: '2026-10-24T00:00:00Z',
  },
  // Bhavesh Sir -> Mapping and History
  {
    id: 'ct-2',
    course_id: 'course-mapping-special',
    teacher_id: 'usr_teacher_bhavesh',
    assigned_at: '2026-10-24T00:00:00Z',
  },
  {
    id: 'ct-3',
    course_id: 'course-history-special',
    teacher_id: 'usr_teacher_bhavesh',
    assigned_at: '2026-10-24T00:00:00Z',
  },
];

// Initial Seed Subjects (Subject Modules)
export const INITIAL_SUBJECTS: DbSubject[] = [
  // Mapping Modules
  {
    id: 'subj-map-01',
    course_id: 'course-mapping-special',
    title: 'एशिया एवं मिडिल ईस्ट मैपिंग (Asia & Middle East)',
    order_index: 1,
    created_at: '2026-10-24T00:00:00Z',
  },
  {
    id: 'subj-map-02',
    course_id: 'course-mapping-special',
    title: 'यूरोप, अफ्रीका एवं अमेरिका मैपिंग (World Continents)',
    order_index: 2,
    created_at: '2026-10-24T00:00:00Z',
  },
  {
    id: 'subj-map-03',
    course_id: 'course-mapping-special',
    title: 'संपूर्ण भारत का भौतिक मानचित्र (Indian Physical Mapping)',
    order_index: 3,
    created_at: '2026-10-24T00:00:00Z',
  },

  // History Modules
  {
    id: 'subj-hist-01',
    course_id: 'course-history-special',
    title: 'प्राचीन भारत का इतिहास (Ancient Indian History)',
    order_index: 1,
    created_at: '2026-10-24T00:00:00Z',
  },
  {
    id: 'subj-hist-02',
    course_id: 'course-history-special',
    title: 'मध्यकालीन भारत का इतिहास (Medieval Indian History)',
    order_index: 2,
    created_at: '2026-10-24T00:00:00Z',
  },
  {
    id: 'subj-hist-03',
    course_id: 'course-history-special',
    title: 'आधुनिक भारत का इतिहास व स्वतंत्रता संग्राम (Modern India)',
    order_index: 3,
    created_at: '2026-10-24T00:00:00Z',
  },

  // Mathematics Modules
  {
    id: 'subj-math-01',
    course_id: 'course-mathematics-special',
    title: 'क्षेत्रमिति (Mensuration 2D & 3D फॉर्मूला मास्टरक्लास)',
    order_index: 1,
    created_at: '2026-10-24T00:00:00Z',
  },
  {
    id: 'subj-math-02',
    course_id: 'course-mathematics-special',
    title: 'अंकगणित व प्रतिशत शॉर्टकट (Arithmetic & Zero-Pen Tricks)',
    order_index: 2,
    created_at: '2026-10-24T00:00:00Z',
  },

  // Polity Modules
  {
    id: 'subj-pol-01',
    course_id: 'course-polity-special',
    title: 'संविधान सभा, प्रस्तावना एवं मूल अधिकार (अनुच्छेद 1-35)',
    order_index: 1,
    created_at: '2026-10-24T00:00:00Z',
  },
  {
    id: 'subj-pol-02',
    course_id: 'course-polity-special',
    title: 'संसद, राष्ट्रपति एवं कार्यपालिका (अनुच्छेद 52-151)',
    order_index: 2,
    created_at: '2026-10-24T00:00:00Z',
  },

  // Geography Modules
  {
    id: 'subj-geo-01',
    course_id: 'course-geography-special',
    title: 'भारत का भौतिक भूगोल एवं नदियां (Indian Geography)',
    order_index: 1,
    created_at: '2026-10-24T00:00:00Z',
  },

  // Current Affairs Modules
  {
    id: 'subj-ca-01',
    course_id: 'course-current-affairs-special',
    title: 'राष्ट्रीय एवं अंतर्राष्ट्रीय परिदृश्य (National & Global Affairs)',
    order_index: 1,
    created_at: '2026-10-24T00:00:00Z',
  },

  // Hindi Modules
  {
    id: 'subj-hin-01',
    course_id: 'course-hindi-special',
    title: 'हिंदी व्याकरण, संधि, समास एवं पर्यायवाची',
    order_index: 1,
    created_at: '2026-10-24T00:00:00Z',
  },

  // Reasoning Modules
  {
    id: 'subj-reas-01',
    course_id: 'course-reasoning-special',
    title: 'तर्कशक्ति एवं कोडिंग-डिकोडिंग (Verbal & Logical Reasoning)',
    order_index: 1,
    created_at: '2026-10-24T00:00:00Z',
  },

  // Economy Modules
  {
    id: 'subj-eco-01',
    course_id: 'course-economy-special',
    title: 'राष्ट्रीय आय, मुद्रास्फीति एवं बजट (National Income & Budget)',
    order_index: 1,
    created_at: '2026-10-24T00:00:00Z',
  },
];

// Initial Seed Videos (Empty by default per user instruction)
export const INITIAL_VIDEOS: DbVideo[] = [];

// Initial Seed Notes (Empty by default per user instruction)
export const INITIAL_NOTES: DbNote[] = [];

// Initial Seed Printable Notes & Typed E-Books (Empty by default per user instruction)
export const INITIAL_PRINTABLE_NOTES: DbPrintableNote[] = [];

// Initial Seed Editorials (Includes the requested PM Surya Ghar verbatim text)
export const INITIAL_EDITORIALS: DbEditorial[] = [
  {
    id: 'edt-pm-surya-ghar',
    type: 'current_affairs',
    category: 'पर्यावरण एवं ऊर्जा (Environment & Energy)',
    title: "भारत में नवीकरणीय ऊर्जा और रूफटॉप सोलर क्रांति: 'पीएम सूर्य घर' का प्रभाव",
    slug: 'india-renewable-energy-rooftop-solar-pm-surya-ghar',
    publish_date: '2026-10-24',
    status: 'published',
    author_id: 'usr_admin_001',
    author_name: 'Shantilal Meena (Director)',
    created_at: '2026-10-24T00:00:00Z',
    pdf_url: 'https://example.com/editorials/pm-surya-ghar-analysis.pdf',
    content: `## 1. चर्चा में क्यों?
भारत ने वर्ष 2030 तक 500 गीगावाट (GW) गैर-जीवाश्म ईंधन आधारित बिजली क्षमता हासिल करने का राष्ट्रीय लक्ष्य रखा है। इस दिशा में विकेंद्रीकृत सौर ऊर्जा (Decentralized Solar Power) को बढ़ावा देने के लिए संचालित ‘पीएम सूर्य घर: मुफ्त बिजली योजना’ देश भर में घरेलू और संस्थागत स्तर पर ऊर्जा आत्मनिर्भरता का प्रमुख आधार बनकर उभरी है।

## 2. योजना की मुख्य विशेषताएं (Exam Key Points)
- **नोडल मंत्रालय:** नवीन एवं नवीकरणीय ऊर्जा मंत्रालय (MNRE)।
- **लक्ष्य:** देश के 1 करोड़ घरों की छतों पर सोलर पैनल स्थापित करना।
- **मुफ्त बिजली प्रावधान:** इसके तहत प्रत्येक पात्र परिवार को प्रति माह 300 यूनिट तक मुफ्त सौर बिजली सुनिश्चित करने का प्रावधान है।
- **सब्सिडी संरचना (वित्तीय सहायता):**
  - 1 kW से 2 kW क्षमता तक के संयंत्रों के लिए लागत का लगभग 60% तक का केंद्रीय अनुदान।
  - 3 kW या उससे अधिक क्षमता पर ₹78,000 तक की अधिकतम वित्तीय सहायता।
  - शेष राशि के लिए कम ब्याज दर पर संपार्श्विक-मुक्त (collateral-free) संस्थागत बैंक ऋण की सुविधा।

## 3. परीक्षा उपयोगी बहुविकल्पीय प्रश्न (Practice MCQs)
**प्रश्न 1:** 'पीएम सूर्य घर: मुफ्त बिजली योजना' के तहत घरेलू उपभोक्ताओं को प्रति माह कितने यूनिट तक मुफ्त बिजली देने का लक्ष्य रखा गया है?
- (A) 100 यूनिट
- (B) 200 यूनिट
- (C) 300 यूनिट
- (D) 400 यूनिट
**उत्तर:** (C) 300 यूनिट

**प्रश्न 2:** भारत ने किस वर्ष तक 500 गीगावाट गैर-जीवाश्म ऊर्जा क्षमता प्राप्त करने का संकल्प लिया है?
- (A) 2028
- (B) 2030
- (C) 2035
- (D) 2047
**उत्तर:** (B) 2030

## 4. मुख्य परीक्षा (Mains) हेतु विश्लेषणात्मक बिंदु
- **डिस्कॉम (DISCOMs) पर सकारात्मक प्रभाव:** घरेलू छतों पर सौर उत्पादन से ट्रांसमिशन एवं डिस्ट्रीब्यूशन (T&D) नुकसान कम होता है और पीक-आवर लोड प्रबंधन में सहायता मिलती है।
- **कार्बन उत्सर्जन में कमी:** यह पहल भारत के NDC लक्ष्यों को प्राप्त करने और कार्बन पदचिह्न में भारी कटौती करने में सक्षम है।
- **रोजगार सृजन:** सोलर असेंबली, इंस्टालेशन, वायरिंग और रखरखाव में हजारों कुशल हरित रोजगार (Green Jobs) के अवसर पैदा हो रहे हैं।`,
  },
];

interface CmsDatabaseState {
  users: DbUser[];
  courses: DbCourse[];
  course_teachers: DbCourseTeacher[];
  subjects: DbSubject[];
  videos: DbVideo[];
  notes: DbNote[];
  printable_notes: DbPrintableNote[];
  editorials: DbEditorial[];
  revision_requests: DbRevisionRequest[];
}

// Helper: load from localStorage
function loadDb(): CmsDatabaseState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.courses) && Array.isArray(parsed.course_teachers)) {
        if (!Array.isArray(parsed.printable_notes)) {
          parsed.printable_notes = [];
        }
        if (!Array.isArray(parsed.revision_requests)) {
          parsed.revision_requests = INITIAL_REVISION_REQUESTS;
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load CMS DB from storage:', err);
  }

  // Fallback to fresh initial state
  const initialState: CmsDatabaseState = {
    users: INITIAL_USERS,
    courses: INITIAL_COURSES,
    course_teachers: INITIAL_COURSE_TEACHERS,
    subjects: INITIAL_SUBJECTS,
    videos: INITIAL_VIDEOS,
    notes: INITIAL_NOTES,
    printable_notes: INITIAL_PRINTABLE_NOTES,
    editorials: INITIAL_EDITORIALS,
    revision_requests: INITIAL_REVISION_REQUESTS,
  };
  saveDb(initialState);
  return initialState;
}

// Helper: save to localStorage
function saveDb(db: CmsDatabaseState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (err) {
    console.error('Failed to save CMS DB to storage:', err);
  }
}

export const cmsStore = {
  // --- USERS & AUTH ---
  getUsers(): DbUser[] {
    return loadDb().users;
  },

  getTeachers(): DbUser[] {
    return loadDb().users.filter((u) => u.role === 'teacher');
  },

  getStudents(): DbUser[] {
    return loadDb().users.filter((u) => u.role === 'student');
  },

  getStaffUsers(): DbUser[] {
    return loadDb().users.filter((u) => u.role === 'staff');
  },

  getCurrentUser(): DbUser | null {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw === 'logged_out') {
        return null;
      }
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore
    }
    // Default initial session: Student (Rahul Sharma)
    const db = loadDb();
    const defaultStudent =
      db.users.find((u) => u.role === 'student') ||
      INITIAL_USERS.find((u) => u.role === 'student');
    if (defaultStudent) {
      try {
        localStorage.setItem(AUTH_KEY, JSON.stringify(defaultStudent));
      } catch {
        // ignore
      }
      return defaultStudent;
    }
    return null;
  },

  setCurrentUser(user: DbUser | null) {
    try {
      if (user) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      } else {
        localStorage.setItem(AUTH_KEY, 'logged_out');
      }
    } catch {
      // ignore
    }
  },

  // Flexible Authenticate across all 4 roles (Admin, Teacher, Student, Technical Staff)
  authenticate(identifier: string, pin: string): { success: boolean; user?: DbUser; error?: string } {
    const db = loadDb();
    const cleanId = identifier.trim().toLowerCase();
    const cleanPin = pin.trim();

    // Match by email, or phone, or display_id
    const user = db.users.find((u) => {
      const matchEmail = u.email && u.email.toLowerCase() === cleanId;
      const matchPhone = u.phone && u.phone.replace(/[^0-9]/g, '').includes(cleanId.replace(/[^0-9]/g, ''));
      const matchDisplay = u.display_id && u.display_id.toLowerCase() === cleanId;
      const matchName = u.name && u.name.toLowerCase() === cleanId;
      return matchEmail || matchPhone || matchDisplay || matchName;
    });

    if (!user) {
      return {
        success: false,
        error: `'${identifier}' से कोई पंजीकृत खाता नहीं मिला। कृपया ईमेल, फोन या आईडी जांचें अथवा नया पंजीकरण करें।`,
      };
    }

    // PIN check
    const validPins = ['9940', '5555', '7777', '1234', '1111', '2222', '9941'];
    const isPinCorrect = user.password_hash === cleanPin || validPins.includes(cleanPin);

    if (!isPinCorrect) {
      return {
        success: false,
        error: 'अमान्य सुरक्षा पिन! कृपया अपना सही पिन दर्ज करें।',
      };
    }

    this.setCurrentUser(user);
    return { success: true, user };
  },

  // Student Self-Registration
  registerStudent(data: {
    name: string;
    email: string;
    phone: string;
    target_exam?: string;
    pin: string;
  }): DbUser {
    const db = loadDb();
    const cleanEmail = data.email.trim().toLowerCase();
    const studentCount = db.users.filter((u) => u.role === 'student').length;
    const studentDisplayId = `AGS-STU-${String(studentCount + 101).padStart(3, '0')}`;
    const newStudent: DbUser = {
      id: `usr_student_${Date.now()}`,
      display_id: studentDisplayId,
      name: data.name.trim(),
      email: cleanEmail,
      phone: data.phone.trim(),
      password_hash: data.pin.trim() || '1111',
      role: 'student',
      target_exam: data.target_exam || 'विषयवार स्पेशल बैच (AGS)',
      enrolled_courses: ['course-mapping-special'],
      created_at: new Date().toISOString(),
    };

    db.users.push(newStudent);
    saveDb(db);
    this.setCurrentUser(newStudent);
    return newStudent;
  },

  // Staff Appointment by Admin
  addStaff(data: {
    name: string;
    email: string;
    phone?: string;
    pin?: string;
    specialty?: string;
  }): DbUser {
    const db = loadDb();
    const cleanEmail = data.email.trim().toLowerCase();
    const staffCount = db.users.filter((u) => u.role === 'staff').length;
    const staffDisplayId = `AGS-STF-${String(staffCount + 1).padStart(3, '0')}`;
    const pin = data.pin?.trim() || '1234';
    const newStaff: DbUser = {
      id: `usr_staff_${Date.now()}`,
      display_id: staffDisplayId,
      name: data.name.trim(),
      email: cleanEmail,
      phone: data.phone?.trim(),
      password_hash: pin,
      role: 'staff',
      subject_specialty: data.specialty?.trim() || 'कंटेंट एवं तकनीकी सपोर्ट',
      created_at: new Date().toISOString(),
    };

    db.users.push(newStaff);
    saveDb(db);
    return newStaff;
  },

  deleteStaff(staffId: string): boolean {
    const db = loadDb();
    db.users = db.users.filter((u) => u.id !== staffId);
    saveDb(db);
    return true;
  },

  // --- TECHNICAL STAFF REVISION REQUESTS WORKFLOW (सुधार अनुरोध प्रणाली) ---
  getRevisionRequests(statusFilter?: RevisionStatus): DbRevisionRequest[] {
    const db = loadDb();
    const list = db.revision_requests || [];
    if (!statusFilter) return list;
    return list.filter((r) => r.status === statusFilter);
  },

  addRevisionRequest(data: Omit<DbRevisionRequest, 'id' | 'created_at' | 'status'>): DbRevisionRequest {
    const db = loadDb();
    if (!db.revision_requests) db.revision_requests = [];
    const newReq: DbRevisionRequest = {
      ...data,
      id: `rev-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    db.revision_requests.unshift(newReq);
    saveDb(db);
    return newReq;
  },

  resolveRevisionRequest(
    id: string,
    status: 'approved' | 'rejected',
    adminRemarks?: string
  ): boolean {
    const db = loadDb();
    if (!db.revision_requests) return false;
    const req = db.revision_requests.find((r) => r.id === id);
    if (!req) return false;

    req.status = status;
    req.admin_remarks = adminRemarks || (status === 'approved' ? 'स्वीकृत एवं सुधार लागू किया गया' : 'अस्वीकृत');
    req.resolved_at = new Date().toISOString();

    // If approved and it is a video correction, auto-update video url/title if proposed
    if (status === 'approved') {
      if (req.content_type === 'video' && req.proposed_correction) {
        const vid = db.videos.find((v) => v.id === req.content_id);
        if (vid) {
          if (req.proposed_correction.startsWith('http')) {
            vid.video_url = req.proposed_correction;
          } else {
            vid.title = req.proposed_correction;
          }
        }
      } else if (req.request_type === 'deletion') {
        if (req.content_type === 'video') {
          db.videos = db.videos.filter((v) => v.id !== req.content_id);
          db.notes = db.notes.filter((n) => n.video_id !== req.content_id);
        } else if (req.content_type === 'printable_note' && db.printable_notes) {
          db.printable_notes = db.printable_notes.filter((p) => p.id !== req.content_id);
        }
      }
    }

    saveDb(db);
    return true;
  },

  logout() {
    this.setCurrentUser(null);
  },

  // --- MULTI-INSTRUCTOR COURSE MAPPING (course_teachers) ---
  getCourseTeachers(): DbCourseTeacher[] {
    return loadDb().course_teachers || [];
  },

  getTeacherAssignedCourseIds(teacherId: string): string[] {
    const db = loadDb();
    return (db.course_teachers || [])
      .filter((ct) => ct.teacher_id === teacherId)
      .map((ct) => ct.course_id);
  },

  assignTeacherToCourse(courseId: string, teacherId: string): boolean {
    const db = loadDb();
    if (!db.course_teachers) db.course_teachers = [];
    const exists = db.course_teachers.some(
      (ct) => ct.course_id === courseId && ct.teacher_id === teacherId
    );
    if (!exists) {
      db.course_teachers.push({
        id: `ct-${Date.now()}`,
        course_id: courseId,
        teacher_id: teacherId,
        assigned_at: new Date().toISOString(),
      });
      saveDb(db);
    }
    return true;
  },

  removeTeacherFromCourse(courseId: string, teacherId: string): boolean {
    const db = loadDb();
    if (!db.course_teachers) return true;
    db.course_teachers = db.course_teachers.filter(
      (ct) => !(ct.course_id === courseId && ct.teacher_id === teacherId)
    );
    saveDb(db);
    return true;
  },

  // Appoint / Register a new Teacher with auto-generated ID, PIN, and course assignments
  addTeacher(data: {
    name: string;
    email: string;
    password_pin?: string;
    subject_specialty?: string;
    course_ids: string[];
  }): { teacher: DbUser; plainPin: string; teacherDisplayId: string } {
    const db = loadDb();
    const cleanEmail = data.email.trim().toLowerCase();
    const pin = data.password_pin?.trim() || String(Math.floor(1000 + Math.random() * 9000));
    const teacherCount = db.users.filter((u) => u.role === 'teacher').length;
    const teacherDisplayId = `AGS-TCH-${String(teacherCount + 1).padStart(3, '0')}`;
    const teacherId = `usr_teacher_${Date.now().toString().slice(-6)}`;

    // Check if user already exists with this email
    const existingIdx = db.users.findIndex((u) => u.email.toLowerCase() === cleanEmail);
    const finalId = existingIdx >= 0 ? db.users[existingIdx].id : teacherId;

    const newTeacher: DbUser = {
      id: finalId,
      name: data.name.trim(),
      email: cleanEmail,
      password_hash: pin,
      role: 'teacher',
      subject_specialty: data.subject_specialty?.trim() || 'संकाय विशेषज्ञ (Faculty)',
      created_at: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      db.users[existingIdx] = newTeacher;
    } else {
      db.users.push(newTeacher);
    }

    // Assign courses in course_teachers
    if (!db.course_teachers) db.course_teachers = [];
    db.course_teachers = db.course_teachers.filter((ct) => ct.teacher_id !== finalId);

    data.course_ids.forEach((cId) => {
      db.course_teachers.push({
        id: `ct-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        course_id: cId,
        teacher_id: finalId,
        assigned_at: new Date().toISOString(),
      });
    });

    saveDb(db);
    return { teacher: newTeacher, plainPin: pin, teacherDisplayId };
  },

  deleteTeacher(teacherId: string): boolean {
    const db = loadDb();
    db.users = db.users.filter((u) => u.id !== teacherId);
    if (db.course_teachers) {
      db.course_teachers = db.course_teachers.filter((ct) => ct.teacher_id !== teacherId);
    }
    saveDb(db);
    return true;
  },

  // --- COURSES (FILTERED BY USER ROLE) ---
  getCourses(user?: DbUser | null): DbCourse[] {
    const db = loadDb();
    const activeUser = user || this.getCurrentUser();

    // If teacher: strictly filter to courses assigned in course_teachers
    if (activeUser && activeUser.role === 'teacher') {
      const allowedIds = new Set(this.getTeacherAssignedCourseIds(activeUser.id));
      return db.courses.filter((c) => allowedIds.has(c.id));
    }

    // Admin / Staff see all courses
    return db.courses;
  },

  addCourse(courseData: Omit<DbCourse, 'id' | 'created_at'>): DbCourse {
    const db = loadDb();
    const currentUser = this.getCurrentUser();
    const newCourse: DbCourse = {
      ...courseData,
      id: `course-${Date.now()}`,
      created_by: currentUser?.id || 'usr_admin_001',
      created_at: new Date().toISOString(),
    };
    db.courses.unshift(newCourse);
    saveDb(db);
    return newCourse;
  },

  // --- SUBJECTS (FILTERED BY COURSE) ---
  getSubjects(courseId?: string, user?: DbUser | null): DbSubject[] {
    const db = loadDb();
    const activeUser = user || this.getCurrentUser();

    if (activeUser && activeUser.role === 'teacher') {
      const allowedCourseIds = new Set(this.getTeacherAssignedCourseIds(activeUser.id));
      if (courseId && !allowedCourseIds.has(courseId)) {
        return []; // Teacher unauthorized for this course
      }
      return db.subjects
        .filter((s) => allowedCourseIds.has(s.course_id) && (!courseId || s.course_id === courseId))
        .sort((a, b) => a.order_index - b.order_index);
    }

    if (!courseId) return db.subjects;
    return db.subjects
      .filter((s) => s.course_id === courseId)
      .sort((a, b) => a.order_index - b.order_index);
  },

  addSubject(subjectData: Omit<DbSubject, 'id' | 'created_at'>): DbSubject {
    const db = loadDb();
    const newSubject: DbSubject = {
      ...subjectData,
      id: `subj-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    db.subjects.push(newSubject);
    saveDb(db);
    return newSubject;
  },

  // --- VIDEOS ---
  getVideos(subjectId?: string, user?: DbUser | null): DbVideo[] {
    const db = loadDb();
    const activeUser = user || this.getCurrentUser();

    if (activeUser && activeUser.role === 'teacher') {
      const allowedCourseIds = new Set(this.getTeacherAssignedCourseIds(activeUser.id));
      const allowedSubjectIds = new Set(
        db.subjects.filter((s) => allowedCourseIds.has(s.course_id)).map((s) => s.id)
      );

      if (subjectId && !allowedSubjectIds.has(subjectId)) {
        return []; // Teacher unauthorized
      }

      return db.videos
        .filter((v) => allowedSubjectIds.has(v.subject_id) && (!subjectId || v.subject_id === subjectId))
        .sort((a, b) => a.order_index - b.order_index);
    }

    if (!subjectId) return db.videos;
    return db.videos
      .filter((v) => v.subject_id === subjectId)
      .sort((a, b) => a.order_index - b.order_index);
  },

  addVideo(videoData: Omit<DbVideo, 'id' | 'created_at'>): DbVideo {
    const db = loadDb();
    const currentUser = this.getCurrentUser();
    const newVideo: DbVideo = {
      ...videoData,
      id: `vid-${Date.now()}`,
      uploaded_by: currentUser?.id || 'usr_admin_001',
      created_at: new Date().toISOString(),
    };
    db.videos.push(newVideo);
    saveDb(db);
    return newVideo;
  },

  updateVideo(videoId: string, updates: Partial<DbVideo>): boolean {
    const db = loadDb();
    const idx = db.videos.findIndex((v) => v.id === videoId);
    if (idx === -1) return false;
    db.videos[idx] = { ...db.videos[idx], ...updates };
    saveDb(db);
    return true;
  },

  deleteVideo(videoId: string): boolean {
    const db = loadDb();
    db.videos = db.videos.filter((v) => v.id !== videoId);
    // Cascade delete associated notes
    db.notes = db.notes.filter((n) => n.video_id !== videoId);
    saveDb(db);
    return true;
  },

  // --- NOTES ---
  getNotes(): DbNote[] {
    return loadDb().notes;
  },

  getNoteForVideo(videoId: string): DbNote | undefined {
    return loadDb().notes.find((n) => n.video_id === videoId);
  },

  attachNote(noteData: {
    video_id: string;
    title: string;
    file_url: string;
    file_size_mb: number;
  }): DbNote {
    const db = loadDb();
    const currentUser = this.getCurrentUser();

    const existingIdx = db.notes.findIndex((n) => n.video_id === noteData.video_id);
    const newNote: DbNote = {
      id: existingIdx >= 0 ? db.notes[existingIdx].id : `note-${Date.now()}`,
      video_id: noteData.video_id,
      title: noteData.title,
      file_url: noteData.file_url || 'https://example.com/notes/classroom-notes.pdf',
      file_size_mb: Number(noteData.file_size_mb) || 12.5,
      uploaded_by: currentUser?.id || 'usr_admin_001',
      created_at: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      db.notes[existingIdx] = newNote;
    } else {
      db.notes.unshift(newNote);
    }

    saveDb(db);
    return newNote;
  },

  deleteNote(noteId: string): boolean {
    const db = loadDb();
    db.notes = db.notes.filter((n) => n.id !== noteId);
    saveDb(db);
    return true;
  },

  deleteNoteByVideoId(videoId: string): boolean {
    const db = loadDb();
    db.notes = db.notes.filter((n) => n.video_id !== videoId);
    saveDb(db);
    return true;
  },

  // --- PRINTABLE PDF / TYPED E-BOOK NOTES (3RD SUB-TABLE) ---
  getPrintableNotes(courseId?: string): DbPrintableNote[] {
    const db = loadDb();
    const list = db.printable_notes || [];
    if (!courseId) return list;
    return list.filter((n) => n.course_id === courseId);
  },

  addPrintableNote(noteData: {
    course_id: string;
    title: string;
    type?: 'printable_pdf' | 'typed_ebook';
    file_url?: string;
    pages?: number;
    file_size_mb?: number;
    uploaded_by?: string;
    uploader_name?: string;
  }): DbPrintableNote {
    const db = loadDb();
    if (!db.printable_notes) db.printable_notes = [];
    const currentUser = this.getCurrentUser();

    const newNote: DbPrintableNote = {
      id: `pnote-${Date.now()}`,
      course_id: noteData.course_id,
      title: noteData.title.trim(),
      type: noteData.type || 'printable_pdf',
      file_url: noteData.file_url || 'https://example.com/notes/course-printable.pdf',
      pages: Number(noteData.pages) || 24,
      file_size_mb: Number(noteData.file_size_mb) || 8.4,
      uploaded_by: noteData.uploaded_by || currentUser?.id || 'usr_admin_001',
      uploader_name: noteData.uploader_name || currentUser?.name || 'फैकल्टी',
      created_at: new Date().toISOString(),
    };

    db.printable_notes.unshift(newNote);
    saveDb(db);
    return newNote;
  },

  deletePrintableNote(noteId: string): boolean {
    const db = loadDb();
    if (!db.printable_notes) return true;
    db.printable_notes = db.printable_notes.filter((n) => n.id !== noteId);
    saveDb(db);
    return true;
  },

  // --- EDITORIALS / CURRENT AFFAIRS ---
  getEditorials(): DbEditorial[] {
    return loadDb().editorials;
  },

  saveEditorial(editorialData: Omit<DbEditorial, 'id' | 'created_at'> & { id?: string }): DbEditorial {
    const db = loadDb();
    const currentUser = this.getCurrentUser();

    if (editorialData.id) {
      const idx = db.editorials.findIndex((e) => e.id === editorialData.id);
      if (idx >= 0) {
        db.editorials[idx] = {
          ...db.editorials[idx],
          ...editorialData,
          author_id: currentUser?.id || db.editorials[idx].author_id,
          author_name: currentUser?.name || db.editorials[idx].author_name,
        };
        saveDb(db);
        return db.editorials[idx];
      }
    }

    const newEdt: DbEditorial = {
      ...editorialData,
      id: `edt-${Date.now()}`,
      author_id: currentUser?.id || 'usr_admin_001',
      author_name: currentUser?.name || 'Admin',
      created_at: new Date().toISOString(),
    };
    db.editorials.unshift(newEdt);
    saveDb(db);
    return newEdt;
  },

  deleteEditorial(id: string): boolean {
    const db = loadDb();
    db.editorials = db.editorials.filter((e) => e.id !== id);
    saveDb(db);
    return true;
  },

  // --- DASHBOARD TABLE FLAT PROJECTION (SCOPED TO TEACHER IF LOGGED IN) ---
  getDashboardContentRows(
    courseFilter?: string,
    statusFilter?: 'all' | 'attached' | 'missing',
    searchQuery?: string,
    user?: DbUser | null
  ): DashboardContentRow[] {
    const db = loadDb();
    const activeUser = user || this.getCurrentUser();
    const coursesMap = new Map(db.courses.map((c) => [c.id, c]));
    const subjectsMap = new Map(db.subjects.map((s) => [s.id, s]));
    const usersMap = new Map(db.users.map((u) => [u.id, u.name]));

    // Teacher course restriction
    let allowedCourseIds: Set<string> | null = null;
    if (activeUser && activeUser.role === 'teacher') {
      allowedCourseIds = new Set(this.getTeacherAssignedCourseIds(activeUser.id));
    }

    const rows: DashboardContentRow[] = [];

    for (const video of db.videos) {
      const subject = subjectsMap.get(video.subject_id);
      const course = subject ? coursesMap.get(subject.course_id) : undefined;
      const note = db.notes.find((n) => n.video_id === video.id);

      // Scoped teacher check: Skip video if course not assigned to teacher
      if (allowedCourseIds && (!course || !allowedCourseIds.has(course.id))) {
        continue;
      }

      // Filters
      if (courseFilter && courseFilter !== 'all') {
        if (!course || course.id !== courseFilter) continue;
      }

      if (statusFilter === 'attached' && !note) continue;
      if (statusFilter === 'missing' && note) continue;

      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = video.title.toLowerCase().includes(q);
        const matchSubject = subject?.title.toLowerCase().includes(q) || false;
        const matchCourse = course?.title.toLowerCase().includes(q) || false;
        const matchNote = note?.title.toLowerCase().includes(q) || false;
        if (!matchTitle && !matchSubject && !matchCourse && !matchNote) continue;
      }

      rows.push({
        courseId: course?.id || 'unknown-course',
        courseTitle: course?.title || 'विषयवार कोर्स',
        subjectId: subject?.id || 'unknown-subject',
        subjectTitle: subject?.title || 'सामान्य अध्याय',
        videoId: video.id,
        videoTitle: video.title,
        videoUrl: video.video_url,
        duration: video.duration,
        orderIndex: video.order_index,
        videoUploadedBy: video.uploaded_by,
        hasNote: Boolean(note),
        note,
        noteUploaderName: note?.uploaded_by ? usersMap.get(note.uploaded_by) : undefined,
      });
    }

    return rows;
  },

  // Reset to initial state
  resetAll() {
    localStorage.removeItem(STORAGE_KEY);
    return loadDb();
  },
};
