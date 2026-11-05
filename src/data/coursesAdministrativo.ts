import type { CourseDef } from './courseBuilder';

export const administrativoCourses: CourseDef[] = [
  {
    id: 'crs-11',
    title: 'Integração Institucional',
    departmentId: 'dep-adm',
    category: 'Integração',
    instructor: 'Mariana Costa',
    instructorRole: 'Gestora de Recursos Humanos',
    instructorImg: 5,
    level: 'basico',
    mandatory: true,
    deadlineDays: 15,
    icon: 'Handshake',
    from: '#1d3155',
    to: '#7c3aed',
    summary:
      'História, cultura, estrutura e políticas internas da empresa para novos colaboradores.',
    description:
      'Primeiro treinamento da jornada de qualquer colaborador. Apresenta a história da empresa, seus valores, estrutura organizacional, políticas internas, benefícios, canais de comunicação e o funcionamento da Universidade Corporativa. É o ponto de partida da trilha de integração.',
    objectives: [
      'Conhecer a história, a missão e os valores da empresa',
      'Compreender a estrutura organizacional e as áreas de atuação',
      'Saber onde consultar políticas internas e procedimentos',
      'Utilizar os canais de comunicação e de suporte interno',
      'Entender benefícios, jornada e rotinas de departamento pessoal',
    ],
    syllabus: [
      'Nossa história e nossos números',
      'Missão, visão e valores na prática',
      'Estrutura organizacional e áreas',
      'Políticas internas e código de conduta',
      'Benefícios, jornada e ponto eletrônico',
      'Canais de comunicação e ouvidoria',
      'Como usar a Universidade Corporativa',
    ],
    modules: [
      {
        title: 'Bem-vindo à Empresa',
        description: 'Quem somos, de onde vimos e para onde vamos.',
        lessons: [
          { t: 'Mensagem da diretoria', min: 9 },
          { t: 'Nossa história e nossos números', min: 14 },
          { t: 'Missão, visão e valores na prática', min: 16 },
        ],
      },
      {
        title: 'Como Nos Organizamos',
        description: 'Estrutura, áreas e políticas que orientam o dia a dia.',
        lessons: [
          { t: 'Estrutura organizacional e áreas', min: 15 },
          { t: 'Políticas internas essenciais', min: 18 },
          { t: 'Leitura: Código de conduta', type: 'leitura', min: 13 },
          { t: 'Canais de comunicação e ouvidoria', min: 12 },
        ],
      },
      {
        title: 'Sua Jornada Aqui',
        description:
          'Benefícios, rotinas de pessoal e desenvolvimento profissional.',
        lessons: [
          { t: 'Benefícios e como utilizá-los', min: 17 },
          { t: 'Jornada, ponto e banco de horas', min: 14 },
          { t: 'Universidade Corporativa: sua trilha de desenvolvimento', min: 13 },
          { t: 'Encerramento e próximos passos', min: 7 },
        ],
      },
    ],
    questions: [
      {
        q: 'A Universidade Corporativa tem como principal propósito:',
        options: [
          'Substituir os processos de avaliação de desempenho',
          'Centralizar o treinamento, a capacitação e o desenvolvimento de todos os colaboradores',
          'Registrar apenas os treinamentos obrigatórios por lei',
          'Controlar a frequência e a jornada de trabalho',
        ],
        correct: 1,
        why: 'A plataforma centraliza trilhas, treinamentos, certificados e acompanhamento, sendo o ambiente único de desenvolvimento profissional na empresa.',
      },
      {
        q: 'Ao identificar uma conduta que contraria o código de conduta, o colaborador deve:',
        options: [
          'Comentar informalmente com os colegas do setor',
          'Utilizar os canais oficiais de comunicação ou a ouvidoria, que garantem sigilo',
          'Ignorar, pois a responsabilidade é exclusiva da liderança',
          'Publicar o caso em redes sociais para dar visibilidade',
        ],
        correct: 1,
        why: 'Os canais oficiais garantem tratamento adequado, sigilo e proteção contra retaliação a quem reporta de boa-fé.',
      },
      {
        q: 'Os treinamentos marcados como obrigatórios na plataforma:',
        options: [
          'Podem ser realizados a qualquer momento, sem prazo',
          'Possuem prazo de conclusão definido e geram pendência quando vencidos',
          'São apenas sugestões de desenvolvimento',
          'Dispensam avaliação final',
        ],
        correct: 1,
        why: 'Treinamentos obrigatórios têm prazo. Após o vencimento, a situação passa a atrasada e aparece nos relatórios da liderança.',
      },
      {
        q: 'As políticas internas da empresa devem ser consultadas:',
        options: [
          'Somente no momento da admissão',
          'Sempre que houver dúvida sobre procedimentos, pois ficam disponíveis de forma permanente',
          'Apenas pela liderança',
          'Somente em caso de processo disciplinar',
        ],
        correct: 1,
        why: 'As políticas são documentos vivos e de consulta permanente, disponíveis a todos os colaboradores sempre que necessário.',
      },
    ],
    rating: 4.6,
    enrolledCount: 24,
    createdAt: '2024-01-18',
  },
  {
    id: 'crs-12',
    title: 'Ética e Conduta Profissional',
    departmentId: 'dep-adm',
    category: 'Compliance',
    instructor: 'Dra. Helena Vasques',
    instructorRole: 'Consultora de Compliance',
    instructorImg: 48,
    level: 'basico',
    mandatory: true,
    deadlineDays: 30,
    icon: 'Scale',
    from: '#13213a',
    to: '#8b5cf6',
    summary:
      'Princípios éticos, conflito de interesses, assédio, anticorrupção e canais de denúncia.',
    description:
      'Treinamento de compliance que trata dos princípios éticos que orientam a conduta profissional. Aborda conflito de interesses, recebimento de brindes e presentes, relações com o poder público, prevenção ao assédio moral e sexual, discriminação, uso de informações confidenciais e o funcionamento do canal de denúncias.',
    objectives: [
      'Aplicar os princípios éticos da empresa em decisões cotidianas',
      'Identificar e declarar situações de conflito de interesses',
      'Reconhecer e prevenir assédio moral, sexual e discriminação',
      'Compreender as regras anticorrupção e de relacionamento com terceiros',
      'Utilizar corretamente o canal de denúncias',
    ],
    syllabus: [
      'Ética, moral e integridade no ambiente corporativo',
      'Conflito de interesses e declaração obrigatória',
      'Brindes, presentes e hospitalidades',
      'Lei Anticorrupção e relações com o poder público',
      'Assédio moral, assédio sexual e discriminação',
      'Confidencialidade e uso de informações',
      'Canal de denúncias e não retaliação',
    ],
    modules: [
      {
        title: 'Fundamentos de Integridade',
        description:
          'O que esperamos da conduta de cada colaborador e por quê.',
        lessons: [
          { t: 'Ética, moral e integridade', min: 15 },
          { t: 'Nosso código de conduta em casos reais', min: 19 },
          { t: 'Leitura: Programa de integridade', type: 'leitura', min: 12 },
        ],
      },
      {
        title: 'Riscos de Conduta',
        description:
          'Situações sensíveis mais frequentes no ambiente de trabalho.',
        lessons: [
          { t: 'Conflito de interesses: como identificar', min: 18 },
          { t: 'Brindes, presentes e hospitalidades', min: 14 },
          { t: 'Lei Anticorrupção na prática', min: 20 },
          { t: 'Confidencialidade e informações privilegiadas', min: 16 },
        ],
      },
      {
        title: 'Respeito e Canais',
        description:
          'Prevenção ao assédio, diversidade e como reportar desvios.',
        lessons: [
          { t: 'Assédio moral: o que é e o que não é', min: 21 },
          { t: 'Assédio sexual e discriminação', min: 19 },
          { t: 'Canal de denúncias e não retaliação', min: 13 },
          { t: 'Encerramento', min: 6 },
        ],
      },
    ],
    questions: [
      {
        q: 'Um colaborador participa da escolha de fornecedores e um dos concorrentes é empresa de seu irmão. A conduta correta é:',
        options: [
          'Participar normalmente, desde que escolha o melhor preço',
          'Declarar o conflito de interesses e se afastar da decisão',
          'Avisar apenas o irmão para que ele apresente a melhor proposta',
          'Desclassificar a empresa do irmão sem comunicar nada',
        ],
        correct: 1,
        why: 'Conflito de interesses deve ser declarado formalmente, com afastamento do colaborador da tomada de decisão, preservando a lisura do processo.',
      },
      {
        q: 'Caracteriza assédio moral:',
        options: [
          'Cobrança de resultados dentro das atribuições do cargo, feita de forma respeitosa',
          'Exposição repetitiva do colaborador a situações humilhantes e vexatórias, que o desestabilizam',
          'Feedback corretivo pontual sobre um erro de processo',
          'Solicitação de cumprimento de prazo acordado',
        ],
        correct: 1,
        why: 'Assédio moral exige repetição e intenção de humilhar ou desestabilizar. Gestão e cobrança respeitosas de resultados não configuram assédio.',
      },
      {
        q: 'Sobre o canal de denúncias, é correto afirmar que:',
        options: [
          'Exige identificação do denunciante em todos os casos',
          'Permite relato anônimo, garante sigilo e proíbe retaliação a quem reporta de boa-fé',
          'Deve ser usado somente para casos de furto',
          'As denúncias são divulgadas internamente para dar transparência',
        ],
        correct: 1,
        why: 'O canal admite anonimato, assegura confidencialidade e veda qualquer forma de retaliação contra quem relata de boa-fé.',
      },
      {
        q: 'Receber de um fornecedor um presente de valor significativo durante uma negociação em andamento:',
        options: [
          'É aceitável, por se tratar de cortesia comercial',
          'Deve ser recusado e comunicado, pois pode comprometer a imparcialidade da decisão',
          'É permitido se for compartilhado com a equipe',
          'Depende apenas da vontade do colaborador',
        ],
        correct: 1,
        why: 'Presentes de valor relevante, sobretudo durante negociação, afetam a imparcialidade e devem ser recusados e reportados conforme a política.',
      },
    ],
    rating: 4.7,
    enrolledCount: 24,
    createdAt: '2024-02-26',
  },
  {
    id: 'crs-13',
    title: 'Proteção de Dados e LGPD',
    departmentId: 'dep-adm',
    category: 'Compliance',
    instructor: 'Dra. Helena Vasques',
    instructorRole: 'Consultora de Compliance',
    instructorImg: 48,
    level: 'intermediario',
    mandatory: true,
    deadlineDays: 45,
    icon: 'Lock',
    from: '#0b1526',
    to: '#6366f1',
    summary:
      'Princípios da LGPD, bases legais, direitos do titular e segurança da informação no dia a dia.',
    description:
      'Treinamento sobre a Lei Geral de Proteção de Dados aplicada à rotina administrativa. Apresenta os conceitos de dado pessoal e dado sensível, as bases legais de tratamento, os direitos dos titulares, as obrigações da empresa, o fluxo de resposta a incidentes e boas práticas de segurança da informação.',
    objectives: [
      'Identificar dados pessoais e dados pessoais sensíveis',
      'Reconhecer as bases legais que autorizam o tratamento',
      'Atender corretamente às solicitações dos titulares',
      'Aplicar boas práticas de segurança da informação na rotina',
      'Seguir o fluxo de comunicação de incidentes de segurança',
    ],
    syllabus: [
      'Conceitos: dado pessoal, dado sensível, titular e tratamento',
      'Princípios e bases legais da LGPD',
      'Direitos do titular e prazos de atendimento',
      'Papéis: controlador, operador e encarregado (DPO)',
      'Segurança da informação: senhas, e-mail e compartilhamento',
      'Incidentes de segurança e comunicação à ANPD',
    ],
    modules: [
      {
        title: 'Fundamentos da LGPD',
        description: 'Conceitos essenciais e a lógica da lei.',
        lessons: [
          { t: 'Por que a LGPD existe', min: 13 },
          { t: 'Dado pessoal e dado sensível', min: 17 },
          { t: 'Princípios e bases legais', min: 21 },
          { t: 'Leitura: Política de privacidade interna', type: 'leitura', min: 14 },
        ],
      },
      {
        title: 'Direitos e Responsabilidades',
        description: 'Quem é quem no tratamento de dados e o que o titular pode exigir.',
        lessons: [
          { t: 'Controlador, operador e encarregado', min: 15 },
          { t: 'Direitos do titular e prazos', min: 19 },
          { t: 'Contratos e compartilhamento com terceiros', min: 16 },
        ],
      },
      {
        title: 'Segurança no Dia a Dia',
        description:
          'Práticas concretas para proteger dados na rotina administrativa.',
        lessons: [
          { t: 'Senhas, acessos e mesa limpa', min: 14 },
          { t: 'E-mail, anexos e phishing', min: 18 },
          { t: 'Incidentes de segurança: o que fazer', min: 17 },
          { t: 'Revisão e encerramento', min: 8 },
        ],
      },
    ],
    questions: [
      {
        q: 'São exemplos de dados pessoais sensíveis:',
        options: [
          'Nome completo e endereço residencial',
          'Dados sobre saúde, origem racial, convicção religiosa e dado biométrico',
          'Número de telefone comercial',
          'Matrícula funcional e cargo',
        ],
        correct: 1,
        why: 'A LGPD define como sensíveis dados sobre origem racial, convicção religiosa, opinião política, saúde, vida sexual, genéticos e biométricos.',
      },
      {
        q: 'O consentimento do titular:',
        options: [
          'É a única base legal possível para tratar dados pessoais',
          'É uma das bases legais, devendo ser livre, informado, específico e revogável',
          'Pode ser presumido pelo silêncio do titular',
          'Vale indefinidamente e não pode ser retirado',
        ],
        correct: 1,
        why: 'Existem dez bases legais. O consentimento é apenas uma delas e precisa ser livre, informado, específico e passível de revogação a qualquer momento.',
      },
      {
        q: 'Ao receber um e-mail inesperado com anexo solicitando atualização urgente de dados bancários, o correto é:',
        options: [
          'Abrir o anexo para verificar o conteúdo',
          'Não abrir o anexo nem clicar em links, e reportar ao time de segurança da informação',
          'Encaminhar para os colegas pedindo opinião',
          'Responder solicitando mais detalhes ao remetente',
        ],
        correct: 1,
        why: 'É um padrão clássico de phishing. O procedimento é não interagir com o conteúdo e reportar imediatamente pelo canal interno.',
      },
      {
        q: 'Diante de um incidente de segurança envolvendo dados pessoais, o colaborador deve:',
        options: [
          'Tentar resolver sozinho e só comunicar se houver dano comprovado',
          'Comunicar imediatamente o encarregado (DPO) pelo fluxo interno definido',
          'Apagar os registros para conter o vazamento',
          'Aguardar a apuração anual de conformidade',
        ],
        correct: 1,
        why: 'A comunicação imediata permite avaliar risco, adotar medidas de contenção e cumprir o prazo legal de notificação à ANPD e aos titulares, quando aplicável.',
      },
    ],
    rating: 4.8,
    enrolledCount: 16,
    createdAt: '2024-03-19',
  },
  {
    id: 'crs-14',
    title: 'Excel para Rotinas Administrativas',
    departmentId: 'dep-adm',
    category: 'Produtividade',
    instructor: 'Patrícia Yamamoto',
    instructorRole: 'Analista Financeiro',
    instructorImg: 23,
    level: 'intermediario',
    mandatory: false,
    deadlineDays: 90,
    icon: 'Table2',
    from: '#1d3155',
    to: '#22c55e',
    summary:
      'Fórmulas, tabelas dinâmicas, formatação condicional e automação de planilhas do dia a dia.',
    description:
      'Curso prático de Excel voltado às rotinas administrativas reais da empresa. Parte da organização correta dos dados e avança até tabelas dinâmicas, funções de busca, validação de dados e construção de painéis simples para acompanhamento de indicadores.',
    objectives: [
      'Organizar bases de dados corretamente para análise',
      'Aplicar funções essenciais de texto, data, lógica e busca',
      'Construir tabelas dinâmicas e gráficos a partir de bases',
      'Usar validação de dados e formatação condicional',
      'Montar um painel simples de acompanhamento',
    ],
    syllabus: [
      'Organização de bases e boas práticas de planilha',
      'Funções essenciais: SE, SOMASES, CONT.SES, PROCX',
      'Funções de texto e data aplicadas a cadastros',
      'Tabela dinâmica e segmentação de dados',
      'Validação de dados e formatação condicional',
      'Construção de painel de indicadores',
    ],
    modules: [
      {
        title: 'Base Bem Estruturada',
        description:
          'Como organizar dados para que a análise se torne simples.',
        lessons: [
          { t: 'Erros comuns em planilhas corporativas', min: 14 },
          { t: 'Estrutura de base: linhas, colunas e tipos', min: 17 },
          { t: 'Validação de dados e listas', min: 15 },
          { t: 'Leitura: Planilha modelo comentada', type: 'leitura', min: 10 },
        ],
      },
      {
        title: 'Funções que Resolvem',
        description: 'As funções mais usadas na rotina administrativa.',
        lessons: [
          { t: 'SE, E, OU e SEERRO', min: 20 },
          { t: 'SOMASES e CONT.SES', min: 18 },
          { t: 'PROCX e busca entre bases', min: 22 },
          { t: 'Funções de texto e data', min: 16 },
        ],
      },
      {
        title: 'Análise e Painel',
        description:
          'Transformando dados em informação visual para a liderança.',
        lessons: [
          { t: 'Tabela dinâmica do zero', min: 24 },
          { t: 'Gráficos e segmentação', min: 18 },
          { t: 'Formatação condicional inteligente', min: 14 },
          { t: 'Montando seu painel de indicadores', min: 21 },
          { t: 'Encerramento', min: 6 },
        ],
      },
    ],
    questions: [
      {
        q: 'A função SOMASES é adequada quando se deseja:',
        options: [
          'Somar valores de um intervalo que atendam a um ou mais critérios',
          'Contar quantas células estão preenchidas',
          'Localizar um valor em outra planilha',
          'Converter texto em número',
        ],
        correct: 0,
        why: 'SOMASES soma com base em múltiplos critérios. Para contar use CONT.SES; para buscar, PROCX ou PROCV.',
      },
      {
        q: 'Uma vantagem do PROCX sobre o PROCV é que ele:',
        options: [
          'Funciona apenas em versões antigas do Excel',
          'Permite buscar em qualquer direção e retornar valor padrão quando não encontra',
          'Dispensa a existência de uma coluna de referência',
          'Soma automaticamente os resultados encontrados',
        ],
        correct: 1,
        why: 'O PROCX busca à esquerda ou à direita, não depende de índice numérico de coluna e aceita um argumento para o caso de não localizar o valor.',
      },
      {
        q: 'Para que uma tabela dinâmica funcione corretamente, a base de dados deve:',
        options: [
          'Conter células mescladas para melhor leitura',
          'Ter uma linha de cabeçalho única, sem colunas vazias e sem linhas em branco no meio',
          'Estar formatada com cores alternadas',
          'Ter subtotais calculados manualmente em cada bloco',
        ],
        correct: 1,
        why: 'Tabela dinâmica exige base tabular limpa: cabeçalho único, um registro por linha, sem mesclagens, colunas vazias ou subtotais intercalados.',
      },
      {
        q: 'A formatação condicional é indicada para:',
        options: [
          'Alterar permanentemente o valor das células',
          'Destacar visualmente células conforme regras, facilitando a leitura de desvios',
          'Proteger a planilha contra edição',
          'Criar backup automático do arquivo',
        ],
        correct: 1,
        why: 'Ela aplica formatos dinamicamente conforme regras, destacando prazos vencidos, metas não atingidas e exceções, sem alterar os dados.',
      },
    ],
    rating: 4.6,
    enrolledCount: 8,
    createdAt: '2024-05-06',
  },
  {
    id: 'crs-15',
    title: 'Atendimento e Comunicação Profissional',
    departmentId: 'dep-adm',
    category: 'Comportamental',
    instructor: 'Cristiane Albuquerque',
    instructorRole: 'Consultora de Desenvolvimento Humano',
    instructorImg: 41,
    level: 'basico',
    mandatory: false,
    deadlineDays: 60,
    icon: 'MessagesSquare',
    from: '#13213a',
    to: '#ec4899',
    summary:
      'Comunicação assertiva, escuta ativa, atendimento ao público interno e gestão de conflitos.',
    description:
      'Curso comportamental sobre comunicação no ambiente de trabalho. Trabalha escuta ativa, clareza na escrita de e-mails e mensagens, postura no atendimento ao público interno e externo, condução de conversas difíceis e técnicas de administração de conflitos.',
    objectives: [
      'Aplicar escuta ativa em atendimentos e reuniões',
      'Escrever e-mails e mensagens claros, objetivos e cordiais',
      'Adotar postura profissional no atendimento presencial e por telefone',
      'Conduzir conversas difíceis com assertividade',
      'Administrar conflitos buscando solução e preservando a relação',
    ],
    syllabus: [
      'Elementos da comunicação e ruídos mais comuns',
      'Escuta ativa e perguntas de esclarecimento',
      'Comunicação escrita: e-mail, chat e registro formal',
      'Atendimento presencial e telefônico',
      'Comunicação assertiva x passiva x agressiva',
      'Administração de conflitos e feedback',
    ],
    modules: [
      {
        title: 'Bases da Comunicação',
        description: 'Como a mensagem se perde e como evitar ruídos.',
        lessons: [
          { t: 'Elementos da comunicação e ruídos', min: 15 },
          { t: 'Escuta ativa na prática', min: 18 },
          { t: 'Comunicação verbal e não verbal', min: 14 },
        ],
      },
      {
        title: 'Comunicação Escrita e Atendimento',
        description:
          'Clareza na escrita e postura profissional no atendimento.',
        lessons: [
          { t: 'E-mail profissional: estrutura e tom', min: 19 },
          { t: 'Mensagens instantâneas no ambiente de trabalho', min: 13 },
          { t: 'Atendimento presencial e telefônico', min: 17 },
          { t: 'Leitura: Guia de linguagem institucional', type: 'leitura', min: 11 },
        ],
      },
      {
        title: 'Assertividade e Conflitos',
        description:
          'Posicionar-se com respeito e transformar conflito em solução.',
        lessons: [
          { t: 'Assertivo, passivo e agressivo', min: 16 },
          { t: 'Conduzindo conversas difíceis', min: 20 },
          { t: 'Administração de conflitos', min: 18 },
          { t: 'Feedback que constrói', min: 15 },
          { t: 'Encerramento do curso', min: 7 },
        ],
      },
    ],
    questions: [
      {
        q: 'Escuta ativa significa:',
        options: [
          'Ouvir enquanto prepara a resposta que pretende dar',
          'Concentrar-se no interlocutor, confirmar o entendimento e fazer perguntas de esclarecimento',
          'Concordar com tudo o que o outro diz para evitar conflito',
          'Anotar literalmente tudo o que é falado',
        ],
        correct: 1,
        why: 'Escuta ativa é atenção plena ao interlocutor, com parafraseamento e perguntas que confirmam o entendimento antes de responder.',
      },
      {
        q: 'Um e-mail profissional eficaz normalmente:',
        options: [
          'Tem assunto genérico e texto longo para demonstrar esforço',
          'Tem assunto específico, mensagem objetiva, pedido claro e prazo quando aplicável',
          'Usa letras maiúsculas para destacar urgência',
          'Dispensa saudação e assinatura em comunicações internas',
        ],
        correct: 1,
        why: 'Assunto específico, objetividade, pedido explícito e prazo reduzem retrabalho e aceleram a resposta de quem recebe.',
      },
      {
        q: 'A comunicação assertiva se caracteriza por:',
        options: [
          'Expressar a própria posição com clareza, respeitando o outro',
          'Evitar o tema para não gerar desconforto',
          'Impor o ponto de vista usando tom elevado',
          'Delegar a conversa difícil para a liderança',
        ],
        correct: 0,
        why: 'Assertividade é o equilíbrio: dizer o que precisa ser dito, de forma direta e respeitosa, sem passividade nem agressividade.',
      },
      {
        q: 'Diante de um conflito entre colegas sobre a divisão de uma tarefa, a conduta mais produtiva é:',
        options: [
          'Evitar o assunto até que o prazo resolva a questão',
          'Separar pessoa do problema, alinhar o objetivo comum e negociar critérios objetivos de divisão',
          'Registrar imediatamente uma reclamação formal',
          'Assumir toda a tarefa para encerrar a discussão',
        ],
        correct: 1,
        why: 'Focar no problema e não na pessoa, explicitar o objetivo comum e usar critérios objetivos preserva a relação e resolve a causa do conflito.',
      },
    ],
    rating: 4.5,
    enrolledCount: 16,
    createdAt: '2024-06-11',
  },
  {
    id: 'crs-16',
    title: 'Liderança e Gestão de Equipes',
    departmentId: 'dep-adm',
    category: 'Liderança',
    instructor: 'Cristiane Albuquerque',
    instructorRole: 'Consultora de Desenvolvimento Humano',
    instructorImg: 41,
    level: 'avancado',
    status: 'rascunho',
    mandatory: false,
    deadlineDays: null,
    icon: 'Users',
    from: '#1d3155',
    to: '#f97316',
    summary:
      'Programa em construção para desenvolvimento de supervisores e lideranças de equipe.',
    description:
      'Treinamento em elaboração, destinado a supervisores e coordenadores. Abordará delegação, acompanhamento de desempenho, feedback estruturado, condução de reuniões e desenvolvimento de pessoas. Conteúdo em revisão pela área de Recursos Humanos antes da publicação.',
    objectives: [
      'Desenvolver competências essenciais de liderança de equipe',
      'Estruturar rotinas de acompanhamento e feedback',
      'Conduzir reuniões produtivas e orientadas a resultado',
    ],
    syllabus: [
      'Papéis e responsabilidades da liderança',
      'Delegação e acompanhamento',
      'Feedback e conversas de desenvolvimento',
      'Reuniões produtivas',
    ],
    modules: [
      {
        title: 'Fundamentos da Liderança',
        description: 'Módulo em elaboração.',
        lessons: [
          { t: 'O papel do líder na operação', min: 18 },
          { t: 'Estilos de liderança', min: 16 },
        ],
      },
      {
        title: 'Rotinas de Gestão',
        description: 'Módulo em elaboração.',
        lessons: [
          { t: 'Delegação eficaz', min: 17 },
          { t: 'Acompanhamento de desempenho', min: 19 },
        ],
      },
    ],
    questions: [],
    rating: 0,
    enrolledCount: 0,
    createdAt: '2025-09-28',
    publishedAt: null,
  },
];
