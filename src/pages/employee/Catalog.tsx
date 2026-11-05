import React from 'react';
import { Card, EmptyState, Icon, PageHeader, Skeleton } from '@/components/ui';
import { FilterChip, SearchInput, Select } from '@/components/ui/form';
import { CourseCard } from '@/components/shared';
import { useAuthStore } from '@/store/useAuthStore';
import { useDataStore } from '@/store/useDataStore';
import { formatMinutes } from '@/utils/format';

const durationOptions = [
  { id: 'all', label: 'Qualquer duração' },
  { id: 'short', label: 'Até 2 horas' },
  { id: 'medium', label: 'De 2 a 4 horas' },
  { id: 'long', label: 'Acima de 4 horas' },
];

const statusOptions = [
  { id: 'all', label: 'Todos' },
  { id: 'nao_iniciado', label: 'Não iniciados' },
  { id: 'em_andamento', label: 'Em andamento' },
  { id: 'concluido', label: 'Concluídos' },
  { id: 'atrasado', label: 'Atrasados' },
];

export default function Catalog() {
  const user = useAuthStore((s) => s.user);
  const courses = useDataStore((s) => s.courses);
  const departments = useDataStore((s) => s.departments);
  const enrollments = useDataStore((s) => s.enrollments);

  const [search, setSearch] = React.useState('');
  const [department, setDepartment] = React.useState('all');
  const [category, setCategory] = React.useState('all');
  const [duration, setDuration] = React.useState('all');
  const [status, setStatus] = React.useState('all');
  const [level, setLevel] = React.useState('all');
  const [onlyMandatory, setOnlyMandatory] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 380);
    return () => window.clearTimeout(timer);
  }, []);

  const published = React.useMemo(
    () => courses.filter((c) => c.status === 'publicado'),
    [courses],
  );

  const categories = React.useMemo(
    () => Array.from(new Set(published.map((c) => c.category))).sort(),
    [published],
  );

  const myEnrollments = React.useMemo(
    () => enrollments.filter((e) => e.employeeId === user?.id),
    [enrollments, user?.id],
  );

  const enrollmentOf = (courseId: string) =>
    myEnrollments.find((e) => e.courseId === courseId) ?? null;

  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase();

    return published.filter((course) => {
      if (term && !`${course.title} ${course.summary} ${course.instructor}`.toLowerCase().includes(term)) {
        return false;
      }
      if (department !== 'all' && course.departmentId !== department) return false;
      if (category !== 'all' && course.category !== category) return false;
      if (level !== 'all' && course.level !== level) return false;
      if (onlyMandatory && !course.mandatory) return false;

      if (duration !== 'all') {
        const hours = course.durationMinutes / 60;
        if (duration === 'short' && hours > 2) return false;
        if (duration === 'medium' && (hours <= 2 || hours > 4)) return false;
        if (duration === 'long' && hours <= 4) return false;
      }

      if (status !== 'all') {
        const enrollment = enrollmentOf(course.id);
        const current = enrollment?.status ?? 'nao_iniciado';
        if (current !== status) return false;
      }

      return true;
    });
  }, [published, search, department, category, level, duration, status, onlyMandatory, myEnrollments]);

  const totalMinutes = filtered.reduce((sum, c) => sum + c.durationMinutes, 0);
  const activeFilters =
    (department !== 'all' ? 1 : 0) +
    (category !== 'all' ? 1 : 0) +
    (duration !== 'all' ? 1 : 0) +
    (status !== 'all' ? 1 : 0) +
    (level !== 'all' ? 1 : 0) +
    (onlyMandatory ? 1 : 0);

  const clearFilters = () => {
    setDepartment('all');
    setCategory('all');
    setDuration('all');
    setStatus('all');
    setLevel('all');
    setOnlyMandatory(false);
    setSearch('');
  };

  return (
    <div>
      <PageHeader
        title="Catálogo de treinamentos"
        description="Biblioteca completa de conteúdos de capacitação disponíveis para a sua função e para toda a empresa."
        breadcrumbs={[{ label: 'Início', to: '/app' }, { label: 'Catálogo' }]}
      />

      {/* ------------------------------ Filtros -------------------------- */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Buscar por título, descrição ou instrutor…"
              className="min-w-[240px] flex-1"
            />
            <Select
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              className="w-auto min-w-[168px]"
            >
              <option value="all">Todos os departamentos</option>
              {departments.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
            <Select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-auto min-w-[168px]"
            >
              <option value="all">Todas as categorias</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
            <Select
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              className="w-auto min-w-[160px]"
            >
              {durationOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
            <span className="mr-1 text-[11.5px] font-bold uppercase tracking-wide text-slate-400">
              Situação
            </span>
            {statusOptions.map((item) => (
              <FilterChip
                key={item.id}
                active={status === item.id}
                onClick={() => setStatus(item.id)}
              >
                {item.label}
              </FilterChip>
            ))}
            <span className="mx-1 h-5 w-px bg-slate-200" />
            {[
              { id: 'all', label: 'Todos os níveis' },
              { id: 'basico', label: 'Básico' },
              { id: 'intermediario', label: 'Intermediário' },
              { id: 'avancado', label: 'Avançado' },
            ].map((item) => (
              <FilterChip
                key={item.id}
                active={level === item.id}
                onClick={() => setLevel(item.id)}
              >
                {item.label}
              </FilterChip>
            ))}
            <span className="mx-1 h-5 w-px bg-slate-200" />
            <FilterChip active={onlyMandatory} onClick={() => setOnlyMandatory((v) => !v)}>
              Somente obrigatórios
            </FilterChip>

            {activeFilters > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="ml-auto inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-500 transition hover:text-rose-600"
              >
                <Icon name="X" className="h-3.5 w-3.5" />
                Limpar filtros ({activeFilters})
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* ------------------------------ Resultado ------------------------ */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[13px] text-slate-500">
          <strong className="font-bold text-navy-900">{filtered.length}</strong>{' '}
          {filtered.length === 1 ? 'treinamento encontrado' : 'treinamentos encontrados'}
          {filtered.length > 0 && (
            <>
              {' '}
              · carga horária total de{' '}
              <strong className="font-semibold text-navy-800">
                {formatMinutes(totalMinutes)}
              </strong>
            </>
          )}
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-[104px] rounded-none" />
              <div className="space-y-2.5 p-4">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-8 w-full" />
              </div>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon="SearchX"
            title="Nenhum treinamento encontrado"
            description="Ajuste os filtros ou tente outro termo de busca para encontrar o conteúdo desejado."
            action={
              <button
                type="button"
                onClick={clearFilters}
                className="text-[13px] font-semibold text-brand-700 hover:text-brand-800"
              >
                Limpar todos os filtros
              </button>
            }
          />
        </Card>
      ) : (
        <div className="grid animate-fade-up gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              enrollment={enrollmentOf(course.id)}
              to={`/app/catalogo/${course.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
