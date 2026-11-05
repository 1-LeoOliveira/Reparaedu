import type { Announcement, Settings } from '@/types';

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const announcements: Announcement[] = [
  {
    id: 'com-01',
    title: 'Nova Universidade Corporativa no ar',
    content:
      'A partir de hoje todos os treinamentos da empresa passam a ser realizados e registrados na Universidade Corporativa. Acesse o catálogo, confira os treinamentos obrigatórios do seu setor e acompanhe sua evolução pelo painel inicial. Em caso de dúvidas, procure a área de Recursos Humanos.',
    author: 'Mariana Costa',
    authorAvatar: 'https://i.pravatar.cc/120?img=5',
    date: daysAgo(2),
    tag: 'Institucional',
    pinned: true,
  },
  {
    id: 'com-02',
    title: 'Campanha de reciclagem de NR-10 e NR-32',
    content:
      'As reciclagens anuais das normas NR-10 e NR-32 estão abertas. Colaboradores das equipes de Manutenção e Limpeza devem concluir o treinamento correspondente dentro do prazo indicado na plataforma. O não cumprimento impacta a liberação para atividades em campo.',
    author: 'Eng. Roberto Caldeira',
    authorAvatar: 'https://i.pravatar.cc/120?img=52',
    date: daysAgo(6),
    tag: 'Segurança',
    pinned: true,
  },
  {
    id: 'com-03',
    title: 'Semana Interna de Prevenção de Acidentes — SIPAT',
    content:
      'A SIPAT deste ano acontecerá entre os dias 18 e 22, com palestras, dinâmicas e ações de saúde em todas as unidades. A participação será registrada na plataforma e contará como horas de capacitação. A programação completa será divulgada pela liderança de cada setor.',
    author: 'Carlos Henrique Moura',
    authorAvatar: 'https://i.pravatar.cc/120?img=59',
    date: daysAgo(11),
    tag: 'Eventos',
    pinned: false,
  },
  {
    id: 'com-04',
    title: 'Novo treinamento: Excel para Rotinas Administrativas',
    content:
      'Está disponível no catálogo o treinamento de Excel voltado às rotinas administrativas, com conteúdo prático sobre tabelas dinâmicas, funções de busca e construção de painéis. A inscrição é livre para toda a equipe administrativa.',
    author: 'Patrícia Yamamoto',
    authorAvatar: 'https://i.pravatar.cc/120?img=23',
    date: daysAgo(19),
    tag: 'Treinamentos',
    pinned: false,
  },
  {
    id: 'com-05',
    title: 'Atualização da Política de Proteção de Dados',
    content:
      'A política interna de proteção de dados foi revisada para incorporar novos procedimentos de resposta a incidentes. O documento atualizado está disponível nos materiais complementares do treinamento de LGPD e a leitura é recomendada a todos.',
    author: 'Dra. Helena Vasques',
    authorAvatar: 'https://i.pravatar.cc/120?img=48',
    date: daysAgo(27),
    tag: 'Compliance',
    pinned: false,
  },
  {
    id: 'com-06',
    title: 'Resultado do programa de capacitação do trimestre',
    content:
      'Encerramos o trimestre com crescimento consistente nas horas de capacitação e na taxa de conclusão dos treinamentos obrigatórios. Agradecemos o empenho de todas as equipes e reforçamos o compromisso de ampliar o catálogo nos próximos meses.',
    author: 'Carlos Henrique Moura',
    authorAvatar: 'https://i.pravatar.cc/120?img=59',
    date: daysAgo(38),
    tag: 'Institucional',
    pinned: false,
  },
];

export const defaultSettings: Settings = {
  companyName: 'Repara Edu — Universidade Corporativa',
  companyShortName: 'Repara Edu',
  cnpj: '18.472.905/0001-64',
  address: 'Av. Engenheiro Luís Carlos Berrini, 1681 — Cidade Monções, São Paulo/SP',
  email: 'contato@reparaedu.com.br',
  phone: '(11) 3042-8800',
  logoInitials: 'RE',
  primaryColor: '#09132a',
  accentColor: '#e8551f',
  categories: [
    'Segurança e Saúde',
    'Normas Regulamentadoras',
    'Técnico Operacional',
    'Qualidade e Processos',
    'Compliance',
    'Integração',
    'Produtividade',
    'Comportamental',
    'Liderança',
  ],
  minimumScore: 70,
  certificateValidityMonths: 24,
  allowSelfEnrollment: true,
  notifyByEmail: true,
  requireAssessment: true,
};
