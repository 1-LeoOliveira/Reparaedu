import type {
  Course,
  CourseLevel,
  CourseStatus,
  LessonType,
  Material,
  Module,
  QuizQuestion,
} from '@/types';

// Vídeos públicos de demonstração (placeholders do player)
export const DEMO_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
];

export interface LessonDef {
  t: string;
  type?: LessonType;
  min: number;
  d?: string;
}

export interface ModuleDef {
  title: string;
  description: string;
  lessons: LessonDef[];
}

export interface QuestionDef {
  q: string;
  options: string[];
  correct: number;
  why: string;
}

export interface CourseDef {
  id: string;
  title: string;
  departmentId: string;
  category: string;
  instructor: string;
  instructorRole: string;
  instructorImg: number;
  level: CourseLevel;
  status?: CourseStatus;
  mandatory: boolean;
  deadlineDays: number | null;
  icon: string;
  from: string;
  to: string;
  summary: string;
  description: string;
  objectives: string[];
  syllabus: string[];
  modules: ModuleDef[];
  materials?: Material[];
  questions: QuestionDef[];
  minimumScore?: number;
  rating: number;
  enrolledCount: number;
  createdAt: string;
  publishedAt?: string | null;
}

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export function buildCourse(def: CourseDef): Course {
  let videoIndex = 0;

  const modules: Module[] = def.modules.map((mod, mi) => ({
    id: `${def.id}-m${mi + 1}`,
    title: mod.title,
    description: mod.description,
    lessons: mod.lessons.map((lesson, li) => {
      const type: LessonType = lesson.type ?? 'video';
      const videoUrl =
        type === 'video'
          ? DEMO_VIDEOS[videoIndex++ % DEMO_VIDEOS.length]
          : undefined;
      return {
        id: `${def.id}-m${mi + 1}-a${li + 1}`,
        title: lesson.t,
        type,
        duration: lesson.min,
        description:
          lesson.d ??
          `Conteúdo demonstrativo da aula "${lesson.t}", parte do módulo ${mod.title}.`,
        videoUrl,
      };
    }),
  }));

  const durationMinutes = modules.reduce(
    (total, mod) => total + mod.lessons.reduce((sum, l) => sum + l.duration, 0),
    0,
  );

  const questions: QuizQuestion[] = def.questions.map((question, qi) => {
    const options = question.options.map((text, oi) => ({
      id: `${def.id}-q${qi + 1}-o${oi + 1}`,
      text,
    }));
    return {
      id: `${def.id}-q${qi + 1}`,
      statement: question.q,
      options,
      correctOptionId: options[question.correct].id,
      explanation: question.why,
    };
  });

  const status: CourseStatus = def.status ?? 'publicado';

  return {
    id: def.id,
    title: def.title,
    slug: slugify(def.title),
    description: def.description,
    summary: def.summary,
    departmentId: def.departmentId,
    category: def.category,
    instructor: def.instructor,
    instructorRole: def.instructorRole,
    instructorAvatar: `https://i.pravatar.cc/120?img=${def.instructorImg}`,
    durationMinutes,
    level: def.level,
    status,
    mandatory: def.mandatory,
    deadlineDays: def.deadlineDays,
    cover: def.icon,
    coverFrom: def.from,
    coverTo: def.to,
    objectives: def.objectives,
    syllabus: def.syllabus,
    modules,
    materials:
      def.materials ??
      [
        {
          id: `${def.id}-mat1`,
          name: `${def.title} — Apostila completa.pdf`,
          type: 'pdf',
          size: '2,4 MB',
        },
        {
          id: `${def.id}-mat2`,
          name: `${def.title} — Checklist de aplicação.pdf`,
          type: 'pdf',
          size: '480 KB',
        },
        {
          id: `${def.id}-mat3`,
          name: 'Slides da apresentação.pdf',
          type: 'pdf',
          size: '1,1 MB',
        },
      ],
    assessment:
      questions.length > 0
        ? {
            id: `${def.id}-av`,
            title: `Avaliação final — ${def.title}`,
            minimumScore: def.minimumScore ?? 70,
            attemptsAllowed: 3,
            questions,
          }
        : null,
    rating: def.rating,
    enrolledCount: def.enrolledCount,
    createdAt: def.createdAt,
    publishedAt:
      def.publishedAt === undefined
        ? def.createdAt
        : def.publishedAt,
  };
}
