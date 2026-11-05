// ---------------------------------------------------------------------------
// Tipos de domínio da plataforma de Universidade Corporativa
// ---------------------------------------------------------------------------

export type Role = 'admin' | 'rh' | 'colaborador';

export type EmployeeStatus = 'ativo' | 'ferias' | 'afastado' | 'inativo';

export type CourseStatus = 'publicado' | 'rascunho' | 'arquivado';

export type CourseLevel = 'basico' | 'intermediario' | 'avancado';

export type EnrollmentStatus =
  | 'nao_iniciado'
  | 'em_andamento'
  | 'concluido'
  | 'atrasado';

export type LessonType = 'video' | 'leitura' | 'quiz';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  jobTitle: string;
  departmentId: string | null;
  password: string;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  description: string;
  manager: string;
  color: string;
  icon: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  jobTitle: string;
  departmentId: string;
  admissionDate: string;
  status: EmployeeStatus;
  phone: string;
  registration: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: number; // minutos
  description: string;
  videoUrl?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Material {
  id: string;
  name: string;
  type: 'pdf' | 'xlsx' | 'docx' | 'link';
  size: string;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  statement: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
}

export interface Assessment {
  id: string;
  title: string;
  minimumScore: number;
  attemptsAllowed: number;
  questions: QuizQuestion[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  summary: string;
  departmentId: string;
  category: string;
  instructor: string;
  instructorRole: string;
  instructorAvatar: string;
  durationMinutes: number;
  level: CourseLevel;
  status: CourseStatus;
  mandatory: boolean;
  deadlineDays: number | null;
  cover: string;
  coverFrom: string;
  coverTo: string;
  objectives: string[];
  syllabus: string[];
  modules: Module[];
  materials: Material[];
  assessment: Assessment | null;
  rating: number;
  enrolledCount: number;
  createdAt: string;
  publishedAt: string | null;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  departmentId: string | null;
  audience: string;
  mandatory: boolean;
  deadlineDays: number;
  courseIds: string[];
  cover: string;
  coverFrom: string;
  coverTo: string;
  icon: string;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt: string | null;
}

export interface AttemptRecord {
  id: string;
  score: number;
  passed: boolean;
  date: string;
  answers: Record<string, string>;
}

export interface Enrollment {
  id: string;
  employeeId: string;
  courseId: string;
  status: EnrollmentStatus;
  progress: number; // 0-100
  startedAt: string | null;
  completedAt: string | null;
  dueDate: string | null;
  lastAccessAt: string | null;
  lessonsProgress: LessonProgress[];
  attempts: AttemptRecord[];
  score: number | null;
}

export interface Certificate {
  id: string;
  code: string;
  employeeId: string;
  courseId: string;
  issuedAt: string;
  hours: number;
  score: number;
}

export type NotificationKind =
  | 'novo_curso'
  | 'obrigatorio'
  | 'prazo'
  | 'atrasado'
  | 'certificado'
  | 'comunicado';

export interface Notification {
  id: string;
  kind: NotificationKind;
  title: string;
  message: string;
  date: string;
  read: boolean;
  audience: 'todos' | 'admin' | 'colaborador';
  employeeId?: string;
  link?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  date: string;
  tag: string;
  pinned: boolean;
}

export interface ActivityLog {
  id: string;
  employeeId: string;
  action: string;
  target: string;
  date: string;
  kind: 'conclusao' | 'inicio' | 'avaliacao' | 'certificado' | 'acesso';
}

export interface MonthlyStat {
  month: string;
  conclusoes: number;
  inicios: number;
  horas: number;
}

export interface Settings {
  companyName: string;
  companyShortName: string;
  cnpj: string;
  address: string;
  email: string;
  phone: string;
  logoInitials: string;
  primaryColor: string;
  accentColor: string;
  categories: string[];
  minimumScore: number;
  certificateValidityMonths: number;
  allowSelfEnrollment: boolean;
  notifyByEmail: boolean;
  requireAssessment: boolean;
}
