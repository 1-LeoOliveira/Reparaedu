import React from 'react';
import { Card, EmptyState, PageHeader, StatCard, Tabs } from '@/components/ui';
import { PathCard } from '@/components/shared';
import { useAuthStore } from '@/store/useAuthStore';
import { usePathsProgress } from '@/hooks/useAnalytics';

export default function EmployeePaths() {
  const user = useAuthStore((s) => s.user);
  const paths = usePathsProgress(user?.id);
  const [tab, setTab] = React.useState('minhas');

  const mine = paths.filter(
    (item) => !item.path.departmentId || item.path.departmentId === user?.departmentId,
  );

  const list = React.useMemo(() => {
    if (tab === 'minhas') return mine;
    if (tab === 'obrigatorias') return mine.filter((item) => item.path.mandatory);
    if (tab === 'concluidas') return mine.filter((item) => item.progress === 100);
    return paths;
  }, [tab, mine, paths]);

  const averageProgress = mine.length
    ? Math.round(mine.reduce((sum, item) => sum + item.progress, 0) / mine.length)
    : 0;

  return (
    <div>
      <PageHeader
        title="Trilhas de aprendizagem"
        description="Jornadas estruturadas que agrupam treinamentos em uma sequência de desenvolvimento profissional."
        breadcrumbs={[{ label: 'Início', to: '/app' }, { label: 'Trilhas' }]}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Trilhas atribuídas"
          value={mine.length}
          icon="Route"
          tone="navy"
          hint="Aplicáveis à sua função e setor"
        />
        <StatCard
          label="Progresso médio"
          value={`${averageProgress}%`}
          icon="TrendingUp"
          tone="brand"
          hint="Média de evolução nas suas trilhas"
        />
        <StatCard
          label="Trilhas concluídas"
          value={mine.filter((item) => item.progress === 100).length}
          icon="CheckCircle2"
          tone="success"
          hint="Jornadas finalizadas integralmente"
        />
      </div>

      <Tabs
        className="mb-5"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'minhas', label: 'Minhas trilhas', icon: 'Route', count: mine.length },
          {
            id: 'obrigatorias',
            label: 'Obrigatórias',
            icon: 'ShieldAlert',
            count: mine.filter((item) => item.path.mandatory).length,
          },
          {
            id: 'concluidas',
            label: 'Concluídas',
            icon: 'CheckCircle2',
            count: mine.filter((item) => item.progress === 100).length,
          },
          { id: 'todas', label: 'Todas da empresa', icon: 'LibraryBig', count: paths.length },
        ]}
      />

      {list.length === 0 ? (
        <Card>
          <EmptyState
            icon="Route"
            title="Nenhuma trilha nesta seleção"
            description="Altere o filtro para visualizar outras jornadas de desenvolvimento."
          />
        </Card>
      ) : (
        <div className="grid animate-fade-up gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((item) => (
            <PathCard
              key={item.path.id}
              path={item.path}
              to={`/app/trilhas/${item.path.id}`}
              courseCount={item.courses.length}
              completed={item.completed}
              progress={item.progress}
              minutes={item.minutes}
            />
          ))}
        </div>
      )}
    </div>
  );
}
