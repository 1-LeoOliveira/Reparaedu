import type { CourseDef } from './courseBuilder';

export const manutencaoCourses: CourseDef[] = [
  {
    id: 'crs-01',
    title: 'Segurança no Trabalho',
    departmentId: 'dep-man',
    category: 'Segurança e Saúde',
    instructor: 'Eng. Roberto Caldeira',
    instructorRole: 'Engenheiro de Segurança do Trabalho',
    instructorImg: 52,
    level: 'basico',
    mandatory: true,
    deadlineDays: 30,
    icon: 'HardHat',
    from: '#1d3155',
    to: '#2563eb',
    summary:
      'Fundamentos de segurança ocupacional, identificação de riscos e comportamento preventivo no dia a dia da operação.',
    description:
      'Treinamento obrigatório que apresenta os princípios da segurança do trabalho aplicados à rotina das equipes técnicas. O colaborador aprende a reconhecer riscos no ambiente, aplicar medidas de controle, utilizar corretamente os equipamentos de proteção e agir de forma adequada diante de incidentes. O conteúdo é alinhado às Normas Regulamentadoras e à política interna de segurança da empresa.',
    objectives: [
      'Reconhecer os principais riscos presentes no ambiente de trabalho',
      'Aplicar a hierarquia de controle de riscos nas atividades diárias',
      'Utilizar corretamente os equipamentos de proteção individual e coletiva',
      'Saber como comunicar incidentes, quase-acidentes e condições inseguras',
      'Compreender as responsabilidades legais do empregador e do colaborador',
    ],
    syllabus: [
      'Conceitos de risco, perigo e incidente',
      'Normas Regulamentadoras aplicáveis à operação',
      'Mapa de riscos e análise preliminar de risco (APR)',
      'EPI e EPC: seleção, uso, guarda e conservação',
      'Sinalização de segurança e permissão de trabalho',
      'Primeiros socorros e rota de evacuação',
    ],
    modules: [
      {
        title: 'Fundamentos da Segurança do Trabalho',
        description:
          'Conceitos essenciais, legislação aplicável e a cultura de prevenção na empresa.',
        lessons: [
          { t: 'Boas-vindas e panorama do treinamento', min: 8 },
          { t: 'Perigo, risco e incidente: entendendo as diferenças', min: 14 },
          { t: 'Normas Regulamentadoras na prática', min: 18 },
          {
            t: 'Leitura: Política interna de segurança',
            type: 'leitura',
            min: 10,
          },
        ],
      },
      {
        title: 'Identificação e Controle de Riscos',
        description:
          'Como mapear riscos no ambiente e aplicar as medidas de controle adequadas.',
        lessons: [
          { t: 'Mapa de riscos: como ler e como construir', min: 16 },
          { t: 'Análise Preliminar de Risco (APR) passo a passo', min: 20 },
          { t: 'Hierarquia de controles: da eliminação ao EPI', min: 15 },
          { t: 'Estudo de caso: risco elétrico em manutenção', min: 12 },
        ],
      },
      {
        title: 'Proteção, Emergência e Comportamento Seguro',
        description:
          'Uso de equipamentos de proteção, resposta a emergências e comunicação de desvios.',
        lessons: [
          { t: 'EPI e EPC: escolha e conservação', min: 17 },
          { t: 'Sinalização e permissão de trabalho', min: 12 },
          { t: 'Noções de primeiros socorros', min: 22 },
          { t: 'Comunicação de quase-acidentes', min: 10 },
          { t: 'Encerramento e orientações finais', min: 6 },
        ],
      },
    ],
    questions: [
      {
        q: 'Qual a diferença correta entre perigo e risco?',
        options: [
          'São sinônimos e podem ser usados de forma intercambiável',
          'Perigo é a fonte com potencial de causar dano; risco é a combinação entre probabilidade e severidade desse dano',
          'Perigo é o dano já ocorrido; risco é a previsão de prejuízo financeiro',
          'Risco é a fonte do dano e perigo é a consequência registrada no relatório',
        ],
        correct: 1,
        why: 'Perigo é a fonte, situação ou ato com potencial de causar dano. Risco é a combinação da probabilidade de ocorrência com a severidade das consequências.',
      },
      {
        q: 'Na hierarquia de controle de riscos, qual medida deve ser priorizada?',
        options: [
          'Fornecimento de EPI ao colaborador',
          'Treinamento comportamental da equipe',
          'Eliminação do risco na fonte',
          'Sinalização da área com placas de advertência',
        ],
        correct: 2,
        why: 'A eliminação do risco na fonte é sempre a primeira opção. O EPI é a última barreira, aplicada quando as demais medidas não eliminam totalmente a exposição.',
      },
      {
        q: 'Ao identificar uma condição insegura durante uma atividade, o colaborador deve:',
        options: [
          'Concluir a tarefa rapidamente e relatar apenas se houver acidente',
          'Interromper a atividade, isolar a área quando necessário e comunicar imediatamente a liderança',
          'Improvisar uma solução com os materiais disponíveis no local',
          'Aguardar a próxima reunião mensal de segurança para registrar o ocorrido',
        ],
        correct: 1,
        why: 'O colaborador tem o direito e o dever de interromper atividades em condição insegura (recusa consciente) e comunicar a liderança imediatamente.',
      },
      {
        q: 'Sobre o uso de EPI, a afirmação correta é:',
        options: [
          'A empresa fornece o EPI e o colaborador é responsável pelo uso, guarda e conservação',
          'O colaborador deve adquirir seu próprio EPI com desconto em folha',
          'O uso de EPI é opcional em atividades de curta duração',
          'O EPI pode ser compartilhado livremente entre colaboradores do mesmo turno',
        ],
        correct: 0,
        why: 'A empresa fornece gratuitamente o EPI adequado e certificado; o colaborador deve usá-lo corretamente, guardá-lo e conservá-lo, comunicando qualquer dano.',
      },
    ],
    rating: 4.8,
    enrolledCount: 24,
    createdAt: '2024-02-12',
  },
  {
    id: 'crs-02',
    title: 'Manutenção Preventiva de Equipamentos',
    departmentId: 'dep-man',
    category: 'Técnico Operacional',
    instructor: 'Eduardo Ramalho',
    instructorRole: 'Supervisor de Manutenção',
    instructorImg: 33,
    level: 'intermediario',
    mandatory: true,
    deadlineDays: 45,
    icon: 'Cog',
    from: '#13213a',
    to: '#1d4ed8',
    summary:
      'Planejamento, execução e registro de rotinas preventivas para aumentar a disponibilidade dos ativos.',
    description:
      'Curso voltado à equipe técnica responsável pela conservação dos ativos da empresa. Aborda a diferença entre manutenção corretiva, preventiva e preditiva, a construção de planos de manutenção, o uso de checklists, o controle de histórico de intervenções e os indicadores que demonstram o resultado do trabalho da equipe.',
    objectives: [
      'Diferenciar manutenção corretiva, preventiva e preditiva',
      'Elaborar planos de manutenção com periodicidade adequada',
      'Executar e registrar inspeções usando checklists padronizados',
      'Interpretar indicadores como MTBF, MTTR e disponibilidade',
      'Organizar o histórico de intervenções por equipamento',
    ],
    syllabus: [
      'Tipos de manutenção e quando aplicar cada um',
      'Criticidade de ativos e priorização',
      'Plano de manutenção preventiva e cronograma anual',
      'Checklists de inspeção e ordens de serviço',
      'Lubrificação, aperto, limpeza e ajuste (rotinas básicas)',
      'Indicadores de manutenção e análise de falhas',
    ],
    modules: [
      {
        title: 'Conceitos e Estratégias de Manutenção',
        description:
          'Panorama dos tipos de manutenção e critérios de escolha para cada ativo.',
        lessons: [
          { t: 'Apresentação do curso e do plano de estudos', min: 7 },
          { t: 'Corretiva, preventiva e preditiva', min: 18 },
          { t: 'Criticidade de ativos: definindo prioridades', min: 16 },
          { t: 'Leitura: Inventário de ativos da empresa', type: 'leitura', min: 12 },
        ],
      },
      {
        title: 'Construindo o Plano Preventivo',
        description:
          'Da definição de periodicidade à montagem do cronograma anual de intervenções.',
        lessons: [
          { t: 'Levantamento de requisitos do fabricante', min: 14 },
          { t: 'Definição de periodicidade e janelas de parada', min: 19 },
          { t: 'Montagem do cronograma anual', min: 21 },
          { t: 'Ordens de serviço e fluxo de aprovação', min: 15 },
        ],
      },
      {
        title: 'Execução, Registro e Indicadores',
        description:
          'Boas práticas de execução em campo, registro de histórico e leitura de indicadores.',
        lessons: [
          { t: 'Rotinas básicas: limpeza, lubrificação e aperto', min: 20 },
          { t: 'Preenchimento correto de checklists', min: 13 },
          { t: 'MTBF, MTTR e disponibilidade', min: 18 },
          { t: 'Análise de falhas e os 5 porquês', min: 16 },
          { t: 'Revisão final do conteúdo', min: 8 },
        ],
      },
    ],
    questions: [
      {
        q: 'A manutenção preventiva se caracteriza por:',
        options: [
          'Intervir somente após a falha do equipamento',
          'Intervenções planejadas em intervalos definidos, antes da ocorrência da falha',
          'Monitorar variáveis em tempo real para prever o momento exato da falha',
          'Substituir o equipamento sempre que houver qualquer ruído anormal',
        ],
        correct: 1,
        why: 'A preventiva é planejada e executada em intervalos de tempo ou uso definidos, com o objetivo de reduzir a probabilidade de falha.',
      },
      {
        q: 'O indicador MTBF representa:',
        options: [
          'O tempo médio de reparo de um equipamento',
          'O tempo médio entre falhas de um equipamento',
          'O custo médio de manutenção por ativo',
          'O percentual de ordens de serviço concluídas no prazo',
        ],
        correct: 1,
        why: 'MTBF (Mean Time Between Failures) é o tempo médio entre falhas. O tempo médio de reparo é o MTTR.',
      },
      {
        q: 'Por que a classificação de criticidade dos ativos é importante?',
        options: [
          'Para definir o valor patrimonial de cada equipamento no balanço',
          'Para priorizar recursos e frequência de inspeção nos ativos de maior impacto na operação',
          'Para decidir qual colaborador será responsável pela limpeza do setor',
          'Para justificar a compra de novos equipamentos ao setor financeiro',
        ],
        correct: 1,
        why: 'A criticidade orienta onde investir mais recursos e atenção, concentrando esforço nos ativos cuja falha causa maior impacto.',
      },
      {
        q: 'Ao concluir uma intervenção preventiva, o registro no histórico do equipamento deve conter:',
        options: [
          'Apenas a data e a assinatura do executante',
          'Serviço executado, peças substituídas, tempo gasto, condições encontradas e pendências',
          'Somente as pendências, para não poluir o relatório',
          'Nada, pois o registro é responsabilidade exclusiva da liderança',
        ],
        correct: 1,
        why: 'O histórico completo permite análise de falhas, planejamento de estoque de peças e cálculo correto dos indicadores.',
      },
    ],
    rating: 4.6,
    enrolledCount: 8,
    createdAt: '2024-03-04',
  },
  {
    id: 'crs-03',
    title: 'NR-10 — Segurança em Instalações Elétricas',
    departmentId: 'dep-man',
    category: 'Normas Regulamentadoras',
    instructor: 'Eng. Roberto Caldeira',
    instructorRole: 'Engenheiro de Segurança do Trabalho',
    instructorImg: 52,
    level: 'avancado',
    mandatory: true,
    deadlineDays: 30,
    icon: 'Zap',
    from: '#0b1526',
    to: '#f59e0b',
    summary:
      'Capacitação obrigatória para atividades em instalações elétricas energizadas ou com risco de energização.',
    description:
      'Treinamento alinhado à Norma Regulamentadora nº 10, obrigatório para profissionais que intervêm em instalações elétricas. Aborda riscos elétricos, medidas de controle, desenergização, aterramento temporário, documentação da instalação, procedimentos de trabalho e resposta a emergências com vítimas de choque elétrico.',
    objectives: [
      'Reconhecer os riscos elétricos: choque, arco elétrico e campos eletromagnéticos',
      'Aplicar corretamente a sequência de desenergização e reenergização',
      'Identificar e utilizar EPIs e EPCs específicos para risco elétrico',
      'Compreender a documentação obrigatória do prontuário da instalação',
      'Atuar em emergências envolvendo acidentes de origem elétrica',
    ],
    syllabus: [
      'Riscos em instalações e serviços com eletricidade',
      'Técnicas de análise de risco elétrico',
      'Medidas de controle: desenergização, aterramento, bloqueio e sinalização',
      'EPI e EPC para atividades elétricas',
      'Rotinas de trabalho e procedimentos padronizados',
      'Documentação: prontuário e ordens de serviço',
      'Acidentes de origem elétrica e primeiros socorros',
    ],
    modules: [
      {
        title: 'Riscos Elétricos e Análise',
        description:
          'Natureza dos riscos elétricos e metodologias de avaliação antes da intervenção.',
        lessons: [
          { t: 'Introdução à NR-10 e campo de aplicação', min: 12 },
          { t: 'Choque elétrico: efeitos no corpo humano', min: 20 },
          { t: 'Arco elétrico e queimaduras', min: 18 },
          { t: 'Análise de risco em atividades elétricas', min: 22 },
        ],
      },
      {
        title: 'Medidas de Controle',
        description:
          'Procedimentos obrigatórios de desenergização, bloqueio e proteção coletiva.',
        lessons: [
          { t: 'Sequência de desenergização (6 etapas)', min: 24 },
          { t: 'Aterramento temporário na prática', min: 19 },
          { t: 'Bloqueio e etiquetagem (LOTO)', min: 17 },
          { t: 'EPIs específicos para risco elétrico', min: 16 },
          { t: 'Leitura: Prontuário da instalação elétrica', type: 'leitura', min: 14 },
        ],
      },
      {
        title: 'Procedimentos e Emergências',
        description:
          'Rotinas de trabalho, documentação e resposta a acidentes de origem elétrica.',
        lessons: [
          { t: 'Permissão de trabalho e ordens de serviço', min: 15 },
          { t: 'Trabalho em altura combinado com risco elétrico', min: 18 },
          { t: 'Primeiros socorros em vítimas de choque', min: 23 },
          { t: 'Simulação de emergência e encerramento', min: 14 },
        ],
      },
    ],
    questions: [
      {
        q: 'A sequência correta de desenergização prevista na NR-10 inicia por:',
        options: [
          'Instalação do aterramento temporário',
          'Seccionamento do circuito',
          'Constatação da ausência de tensão',
          'Sinalização da área de trabalho',
        ],
        correct: 1,
        why: 'A sequência é: seccionamento, impedimento de reenergização, constatação da ausência de tensão, aterramento temporário, proteção de elementos energizados e sinalização.',
      },
      {
        q: 'O aterramento temporário tem como função principal:',
        options: [
          'Reduzir o consumo de energia durante a manutenção',
          'Escoar eventuais energizações acidentais, protegendo o trabalhador',
          'Melhorar a qualidade do sinal elétrico do circuito',
          'Permitir que o trabalho seja feito sem EPI',
        ],
        correct: 1,
        why: 'O aterramento temporário garante caminho de baixa impedância para a corrente em caso de energização acidental, protegendo quem executa o serviço.',
      },
      {
        q: 'Diante de uma vítima de choque elétrico ainda em contato com o circuito, a primeira ação é:',
        options: [
          'Puxar a vítima imediatamente pelos braços',
          'Desligar a fonte de energia ou afastar a vítima com material isolante antes de qualquer contato',
          'Jogar água para dissipar a corrente elétrica',
          'Iniciar massagem cardíaca sem interromper a energia',
        ],
        correct: 1,
        why: 'Nunca se deve tocar a vítima ainda energizada. A primeira medida é cortar a energia ou usar material isolante, evitando uma segunda vítima.',
      },
      {
        q: 'O procedimento de bloqueio e etiquetagem (LOTO) existe para:',
        options: [
          'Registrar as horas trabalhadas pela equipe de manutenção',
          'Impedir fisicamente a reenergização do circuito e identificar o responsável pelo bloqueio',
          'Identificar o patrimônio dos equipamentos elétricos',
          'Sinalizar o nível de tensão nominal do painel',
        ],
        correct: 1,
        why: 'O LOTO garante o impedimento de reenergização por meio de dispositivo físico de bloqueio, com etiqueta identificando o responsável e a data.',
      },
    ],
    rating: 4.9,
    enrolledCount: 8,
    createdAt: '2024-01-29',
  },
  {
    id: 'crs-04',
    title: 'Utilização de Ferramentas e Equipamentos',
    departmentId: 'dep-man',
    category: 'Técnico Operacional',
    instructor: 'Marcos Vinícius Dias',
    instructorRole: 'Mecânico de Equipamentos',
    instructorImg: 14,
    level: 'basico',
    mandatory: false,
    deadlineDays: 60,
    icon: 'Hammer',
    from: '#1d3155',
    to: '#0ea5e9',
    summary:
      'Uso correto, inspeção e conservação de ferramentas manuais, elétricas e equipamentos de medição.',
    description:
      'Curso prático sobre a seleção e o uso seguro das ferramentas utilizadas pela equipe de manutenção. Inclui ferramentas manuais, elétricas portáteis, instrumentos de medição e dispositivos de içamento, com ênfase em inspeção pré-uso, torque correto, armazenamento e descarte de ferramentas danificadas.',
    objectives: [
      'Selecionar a ferramenta adequada para cada tipo de serviço',
      'Executar a inspeção pré-uso de ferramentas manuais e elétricas',
      'Aplicar torque correto e utilizar instrumentos de medição com precisão',
      'Armazenar e conservar ferramentas prolongando sua vida útil',
      'Identificar e retirar de uso ferramentas danificadas',
    ],
    syllabus: [
      'Classificação de ferramentas manuais e elétricas',
      'Inspeção pré-uso e critérios de descarte',
      'Ferramentas de aperto e controle de torque',
      'Instrumentos de medição: paquímetro, multímetro e manômetro',
      'Equipamentos de içamento e movimentação de carga',
      'Organização de ferramentaria e controle de empréstimo',
    ],
    modules: [
      {
        title: 'Ferramentas Manuais',
        description:
          'Seleção, uso correto e inspeção das ferramentas do dia a dia.',
        lessons: [
          { t: 'Panorama das ferramentas da equipe', min: 10 },
          { t: 'Chaves, alicates e martelos: uso correto', min: 18 },
          { t: 'Inspeção pré-uso e critérios de descarte', min: 14 },
        ],
      },
      {
        title: 'Ferramentas Elétricas e Medição',
        description:
          'Operação segura de ferramentas portáteis e leitura de instrumentos.',
        lessons: [
          { t: 'Furadeiras, esmerilhadeiras e serras: riscos e cuidados', min: 22 },
          { t: 'Controle de torque: torquímetro na prática', min: 17 },
          { t: 'Paquímetro e multímetro: leitura correta', min: 20 },
          { t: 'Leitura: Tabela de torques recomendados', type: 'leitura', min: 8 },
        ],
      },
      {
        title: 'Conservação e Organização',
        description:
          'Boas práticas de armazenamento, controle e movimentação de carga.',
        lessons: [
          { t: 'Organização da ferramentaria e método 5S', min: 15 },
          { t: 'Equipamentos de içamento e cintas', min: 19 },
          { t: 'Checklist final e encerramento', min: 9 },
        ],
      },
    ],
    questions: [
      {
        q: 'A inspeção pré-uso de uma esmerilhadeira deve verificar, entre outros pontos:',
        options: [
          'Apenas se a ferramenta liga normalmente',
          'Integridade do disco, presença e fixação da proteção, estado do cabo e do plugue',
          'A cor do corpo da ferramenta e o número de patrimônio',
          'O nível de óleo do motor elétrico',
        ],
        correct: 1,
        why: 'Disco sem trincas, proteção instalada e cabo/plugue íntegros são itens essenciais. A ausência de qualquer um deles impede o uso da ferramenta.',
      },
      {
        q: 'Usar uma chave de boca com abertura maior que a porca pode causar:',
        options: [
          'Aperto mais rápido e eficiente',
          'Arredondamento da porca, escorregamento da chave e risco de lesão',
          'Aumento do torque aplicado de forma segura',
          'Nenhum efeito, desde que a porca seja de aço',
        ],
        correct: 1,
        why: 'A folga provoca escorregamento, danifica a porca e é uma das causas mais comuns de lesões nas mãos em serviços de manutenção.',
      },
      {
        q: 'Ao identificar uma ferramenta com cabo trincado, o procedimento correto é:',
        options: [
          'Reforçar o cabo com fita isolante e continuar usando',
          'Retirar a ferramenta de uso, identificá-la e encaminhá-la para descarte ou reparo',
          'Usar somente em serviços leves até o fim do turno',
          'Devolver à ferramentaria sem qualquer identificação',
        ],
        correct: 1,
        why: 'Ferramenta danificada deve ser imediatamente retirada de uso e identificada, evitando que outro colaborador a utilize por desconhecimento.',
      },
      {
        q: 'O torquímetro é utilizado para:',
        options: [
          'Medir a espessura de peças metálicas',
          'Aplicar e controlar o valor exato de aperto especificado pelo fabricante',
          'Verificar a continuidade elétrica de um circuito',
          'Medir a pressão de sistemas hidráulicos',
        ],
        correct: 1,
        why: 'O torquímetro garante que o aperto fique dentro da especificação, evitando tanto folga quanto deformação por excesso de torque.',
      },
    ],
    rating: 4.5,
    enrolledCount: 8,
    createdAt: '2024-04-18',
  },
  {
    id: 'crs-05',
    title: 'Procedimentos de Manutenção Predial',
    departmentId: 'dep-man',
    category: 'Técnico Operacional',
    instructor: 'Anderson Küster',
    instructorRole: 'Encanador Predial',
    instructorImg: 51,
    level: 'intermediario',
    mandatory: false,
    deadlineDays: 90,
    icon: 'Building2',
    from: '#13213a',
    to: '#14b8a6',
    summary:
      'Rotinas de conservação predial: hidráulica, alvenaria, pintura, cobertura e sistemas de combate a incêndio.',
    description:
      'Treinamento sobre as rotinas de conservação da estrutura física das unidades. Aborda inspeções prediais periódicas, reparos hidráulicos, pequenos serviços de alvenaria e pintura, conservação de telhados e calhas, além da verificação dos sistemas de combate a incêndio e do registro das intervenções.',
    objectives: [
      'Executar inspeções prediais periódicas com checklist padronizado',
      'Realizar reparos hidráulicos básicos com segurança',
      'Identificar patologias em alvenaria, pintura e cobertura',
      'Verificar extintores, hidrantes e sinalização de emergência',
      'Registrar intervenções e abrir solicitações para serviços especializados',
    ],
    syllabus: [
      'Inspeção predial: roteiro e periodicidade',
      'Sistemas hidrossanitários e reparos comuns',
      'Patologias de alvenaria: fissuras, infiltração e umidade',
      'Pintura e acabamento: preparo e aplicação',
      'Telhados, calhas e drenagem pluvial',
      'Sistemas de combate a incêndio e rotas de fuga',
    ],
    modules: [
      {
        title: 'Inspeção Predial',
        description:
          'Como percorrer a unidade, o que observar e como registrar as ocorrências.',
        lessons: [
          { t: 'Roteiro de inspeção e periodicidade', min: 16 },
          { t: 'Registro fotográfico e abertura de demanda', min: 12 },
          { t: 'Leitura: Checklist de inspeção predial', type: 'leitura', min: 10 },
        ],
      },
      {
        title: 'Hidráulica e Alvenaria',
        description:
          'Reparos de maior frequência na rotina de conservação predial.',
        lessons: [
          { t: 'Vazamentos, torneiras e caixas acopladas', min: 21 },
          { t: 'Desobstrução de ralos e caixas de inspeção', min: 15 },
          { t: 'Fissuras, infiltração e umidade ascendente', min: 20 },
          { t: 'Pequenos reparos de alvenaria e rejunte', min: 17 },
        ],
      },
      {
        title: 'Cobertura, Pintura e Emergência',
        description:
          'Conservação externa da edificação e verificação dos sistemas de segurança.',
        lessons: [
          { t: 'Telhados e calhas: inspeção segura', min: 18 },
          { t: 'Preparo de superfície e pintura', min: 16 },
          { t: 'Extintores, hidrantes e sinalização', min: 19 },
          { t: 'Revisão e encerramento', min: 8 },
        ],
      },
    ],
    questions: [
      {
        q: 'Uma fissura horizontal contínua na base de uma parede, acompanhada de manchas de umidade, indica mais provavelmente:',
        options: [
          'Retração natural da pintura',
          'Umidade ascendente por falha de impermeabilização da fundação',
          'Excesso de carga sobre a laje superior',
          'Dilatação térmica da esquadria metálica',
        ],
        correct: 1,
        why: 'Umidade ascendente é típica da base das paredes e decorre de falha ou ausência de barreira impermeabilizante, exigindo tratamento específico.',
      },
      {
        q: 'Na inspeção de extintores de incêndio, deve-se verificar:',
        options: [
          'Apenas a presença do equipamento no suporte',
          'Validade da carga, pressão no manômetro, lacre, acesso desobstruído e sinalização visível',
          'Somente o peso total do cilindro',
          'A cor da parede onde está instalado',
        ],
        correct: 1,
        why: 'A verificação é completa: carga válida, manômetro na faixa verde, lacre intacto, acesso livre e sinalização adequada.',
      },
      {
        q: 'Antes de subir em um telhado para inspeção, a medida indispensável é:',
        options: [
          'Avisar a portaria por rádio',
          'Garantir sistema de proteção contra quedas, linha de vida e autorização de trabalho em altura',
          'Usar calçado com sola lisa para não danificar as telhas',
          'Executar o serviço sozinho para não sobrecarregar a estrutura',
        ],
        correct: 1,
        why: 'Trabalho em telhado é trabalho em altura e exige proteção contra quedas, linha de vida, permissão de trabalho e acompanhamento.',
      },
      {
        q: 'A limpeza periódica de calhas e condutores pluviais previne principalmente:',
        options: [
          'Perda de carga nos circuitos elétricos',
          'Transbordamento de água, infiltração em paredes e sobrecarga na estrutura do telhado',
          'Desgaste prematuro das fechaduras',
          'Aumento no consumo de água potável',
        ],
        correct: 1,
        why: 'Calhas obstruídas provocam transbordamento, infiltrações na edificação e acúmulo de peso sobre a cobertura.',
      },
    ],
    rating: 4.4,
    enrolledCount: 8,
    createdAt: '2024-05-22',
  },
];
