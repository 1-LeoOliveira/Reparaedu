import type { LearningPath } from '@/types';

export const learningPaths: LearningPath[] = [
  {
    id: 'trl-01',
    title: 'Trilha de Integração de Novos Colaboradores',
    description:
      'Jornada inicial obrigatória para todo colaborador recém-admitido. Apresenta a empresa, sua cultura, políticas internas e as regras de conduta e proteção de dados que orientam o dia a dia.',
    departmentId: null,
    audience: 'Todos os colaboradores admitidos nos últimos 90 dias',
    mandatory: true,
    deadlineDays: 45,
    courseIds: ['crs-11', 'crs-12', 'crs-13'],
    cover: 'Rocket',
    coverFrom: '#1d3155',
    coverTo: '#7c3aed',
    icon: 'Rocket',
  },
  {
    id: 'trl-02',
    title: 'Trilha de Segurança do Trabalho',
    description:
      'Trilha obrigatória de segurança ocupacional aplicada a todas as áreas operacionais, reunindo fundamentos de prevenção, uso de EPIs e segurança em instalações elétricas.',
    departmentId: null,
    audience: 'Equipes operacionais de Manutenção e Limpeza',
    mandatory: true,
    deadlineDays: 60,
    courseIds: ['crs-01', 'crs-09', 'crs-03'],
    cover: 'HardHat',
    coverFrom: '#0b1526',
    coverTo: '#f59e0b',
    icon: 'HardHat',
  },
  {
    id: 'trl-03',
    title: 'Trilha de Desenvolvimento Administrativo',
    description:
      'Programa de aperfeiçoamento para a equipe administrativa, com foco em conformidade, produtividade com ferramentas digitais e qualidade no atendimento interno.',
    departmentId: 'dep-adm',
    audience: 'Colaboradores do setor Administrativo',
    mandatory: false,
    deadlineDays: 120,
    courseIds: ['crs-13', 'crs-14', 'crs-15'],
    cover: 'Briefcase',
    coverFrom: '#13213a',
    coverTo: '#22c55e',
    icon: 'Briefcase',
  },
  {
    id: 'trl-04',
    title: 'Trilha de Capacitação da Equipe de Limpeza',
    description:
      'Formação completa da equipe de higienização e conservação, da técnica de limpeza ao manuseio seguro de produtos químicos e ao cumprimento da NR-32.',
    departmentId: 'dep-lim',
    audience: 'Colaboradores do setor de Limpeza',
    mandatory: true,
    deadlineDays: 90,
    courseIds: ['crs-06', 'crs-07', 'crs-08', 'crs-09', 'crs-10'],
    cover: 'SprayCan',
    coverFrom: '#0f766e',
    coverTo: '#2dd4bf',
    icon: 'SprayCan',
  },
  {
    id: 'trl-05',
    title: 'Trilha de Capacitação Técnica — Manutenção',
    description:
      'Desenvolvimento técnico progressivo da equipe de manutenção, cobrindo segurança, rotinas preventivas, NR-10, uso de ferramentas e conservação predial.',
    departmentId: 'dep-man',
    audience: 'Colaboradores do setor de Manutenção',
    mandatory: true,
    deadlineDays: 120,
    courseIds: ['crs-01', 'crs-02', 'crs-03', 'crs-04', 'crs-05'],
    cover: 'Wrench',
    coverFrom: '#13213a',
    coverTo: '#1d4ed8',
    icon: 'Wrench',
  },
];

export const pathById = (id: string) => learningPaths.find((p) => p.id === id);
