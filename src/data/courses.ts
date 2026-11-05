import type { Course } from '@/types';
import { buildCourse } from './courseBuilder';
import { manutencaoCourses } from './coursesManutencao';
import { limpezaCourses } from './coursesLimpeza';
import { administrativoCourses } from './coursesAdministrativo';

export const courses: Course[] = [
  ...manutencaoCourses,
  ...limpezaCourses,
  ...administrativoCourses,
].map(buildCourse);

/** Treinamentos obrigatórios aplicados a toda a empresa, independente do setor. */
export const companyWideCourseIds = ['crs-01', 'crs-09', 'crs-11', 'crs-12'];

export const courseById = (id: string) => courses.find((c) => c.id === id);

export const courseCategories = Array.from(
  new Set(courses.map((c) => c.category)),
).sort();
