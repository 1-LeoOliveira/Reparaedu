import React from 'react';
import {
  Card,
  EmptyState,
  LinkButton,
  PageHeader,
  StatCard,
  Tabs,
} from '@/components/ui';
import { SearchInput } from '@/components/ui/form';
import { CourseCard } from '@/components/shared';
import { useAuthStore } from '@/store/useAuthStore';
import { useEmployeeLearning } from '@/hooks/useAnalytics';
import { formatHours } from '@/utils/format';

export default function MyCourses() {
  const user = useAuthStore((s) => s.user);
  const learning = useEmployeeLearning(user?.id);
  const [tab, setTab] = React.useState('todos');
  const [search, setSearch] = React.useState('');

  const items = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    return learning.items
      .filter((item) => (term ? item.course.title.toLowerCase().includes(term) : true))
      .filter((item) => {
        if (tab === 'todos') return true;
        if (tab === 'obrigatorios') return item.course.mandatory;
        return item.enrollment.status === tab;
      })
      .sort((a, b) => {
        const order = { atrasado: 0, em_andamento: 1, nao_iniciado: 2, concluido: 3 };
        return order[a.enrollment.status] - order[b.enrollment.status];
      });
  }, [learning.items, tab, search]);

  const tabs = [
    { id: 'todos', label: 'Todos', icon: 'LayoutGrid', count: learning.total },
    {
      id: 'em_andamento',
      label: 'Em andamento',
      icon: 'PlayCircle',
      count: learning.inProgress,
    },
    {
      id: 'nao_iniciado',
      label: 'Não iniciados',
      icon: 'Circle',
      count: learning.notStarted,
    },
    { id: 'atrasado', label: 'Atrasados', icon: 'AlertTriangle', count: learning.late },
    {
      id: 'concluido',
      label: 'Concluídos',
      icon: 'CheckCircle2',
      count: learning.completed,
    },
    {
      id: 'obrigatorios',
      label: 'Obrigatórios',
      icon: 'ShieldAlert',
      count: learning.items.filter((i) => i.course.mandatory).length,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Meus treinamentos"
        description="Todos os treinamentos atribuídos à sua função, com situação, progresso e prazos de conclusão."
        breadcrumbs={[{ label: 'Início', to: '/app' }, { label: 'Meus treinamentos' }]}
        actions={
          <LinkButton to="/app/catalogo" variant="outline" icon="LibraryBig">
            Explorar catálogo
          </LinkButton>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Conclusão geral"
          value={`${learning.progress}%`}
          icon="Target"
          tone="brand"
          hint={`${learning.completed} de ${learning.total} treinamentos`}
        />
        <StatCard
          label="Em andamento"
          value={learning.inProgress}
          icon="PlayCircle"
          tone="navy"
          hint="Iniciados e não concluídos"
        />
        <StatCard
          label="Em atraso"
          value={learning.late}
          icon="AlertTriangle"
          tone="danger"
          hint="Prazo de conclusão vencido"
        />
        <StatCard
          label="Horas concluídas"
          value={formatHours(learning.minutes)}
          icon="Clock"
          tone="success"
          hint="Carga horária acumulada"
        />
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <Tabs tabs={tabs} value={tab} onChange={setTab} className="flex-1" />
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar treinamento…"
          className="sm:w-64"
        />
      </div>

      {items.length === 0 ? (
        <Card>
          <EmptyState
            icon="BookOpenCheck"
            title="Nenhum treinamento nesta situação"
            description="Altere o filtro selecionado ou explore o catálogo para iniciar um novo treinamento."
            action={
              <LinkButton to="/app/catalogo" icon="LibraryBig">
                Ir para o catálogo
              </LinkButton>
            }
          />
        </Card>
      ) : (
        <div className="grid animate-fade-up gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map(({ course, enrollment }) => (
            <CourseCard
              key={course.id}
              course={course}
              enrollment={enrollment}
              to={`/app/catalogo/${course.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
