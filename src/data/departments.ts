import type { Department } from '@/types';

export const departments: Department[] = [
  {
    id: 'dep-man',
    name: 'Manutenção',
    slug: 'manutencao',
    description:
      'Equipe responsável pela manutenção preventiva e corretiva, instalações elétricas e hidráulicas, conservação predial e cuidado com os equipamentos da operação.',
    manager: 'Eduardo Ramalho',
    color: '#2563eb',
    icon: 'Wrench',
    createdAt: '2023-01-15',
  },
  {
    id: 'dep-lim',
    name: 'Limpeza',
    slug: 'limpeza',
    description:
      'Equipe responsável pela higienização, conservação e organização de todos os ambientes, com foco em segurança sanitária e uso correto de produtos e EPIs.',
    manager: 'Sueli Aparecida Nunes',
    color: '#0d9488',
    icon: 'SprayCan',
    createdAt: '2023-01-15',
  },
  {
    id: 'dep-adm',
    name: 'Administrativo',
    slug: 'administrativo',
    description:
      'Equipe responsável pelos processos administrativos, financeiros e operacionais de retaguarda, atendimento interno e suporte às demais áreas da empresa.',
    manager: 'Mariana Costa',
    color: '#ea580c',
    icon: 'Briefcase',
    createdAt: '2023-01-15',
  },
];

export const departmentById = (id: string | null | undefined) =>
  departments.find((d) => d.id === id);
