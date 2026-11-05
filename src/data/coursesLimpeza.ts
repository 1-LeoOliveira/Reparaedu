import type { CourseDef } from './courseBuilder';

export const limpezaCourses: CourseDef[] = [
  {
    id: 'crs-06',
    title: 'Boas Práticas de Higienização',
    departmentId: 'dep-lim',
    category: 'Qualidade e Processos',
    instructor: 'Sueli Aparecida Nunes',
    instructorRole: 'Supervisora de Limpeza',
    instructorImg: 26,
    level: 'basico',
    mandatory: true,
    deadlineDays: 30,
    icon: 'Sparkles',
    from: '#0f766e',
    to: '#2dd4bf',
    summary:
      'Técnicas, sequência correta e padronização da higienização de ambientes corporativos.',
    description:
      'Treinamento obrigatório para a equipe de limpeza, com foco nas técnicas corretas de higienização de ambientes. Apresenta a diferença entre limpeza, desinfecção e esterilização, a sequência correta de execução, a setorização por cores, a frequência das rotinas e os critérios de qualidade utilizados na avaliação do serviço.',
    objectives: [
      'Diferenciar limpeza, desinfecção e esterilização',
      'Aplicar a sequência correta de higienização em cada tipo de ambiente',
      'Utilizar o código de cores de panos e materiais para evitar contaminação cruzada',
      'Executar rotinas conforme a frequência definida para cada área',
      'Avaliar o próprio serviço com base nos critérios de qualidade da empresa',
    ],
    syllabus: [
      'Conceitos: limpeza, desinfecção e esterilização',
      'Classificação de áreas: crítica, semicrítica e não crítica',
      'Sequência de higienização e contaminação cruzada',
      'Código de cores e setorização de materiais',
      'Higienização de sanitários, copas e áreas de circulação',
      'Critérios de qualidade e autoavaliação',
    ],
    modules: [
      {
        title: 'Fundamentos da Higienização',
        description:
          'Conceitos básicos e classificação dos ambientes conforme o risco.',
        lessons: [
          { t: 'Boas-vindas e importância do nosso trabalho', min: 8 },
          { t: 'Limpeza, desinfecção e esterilização', min: 16 },
          { t: 'Áreas críticas, semicríticas e não críticas', min: 14 },
          { t: 'Leitura: Manual de higienização da empresa', type: 'leitura', min: 12 },
        ],
      },
      {
        title: 'Técnica e Sequência Correta',
        description:
          'Como executar a higienização evitando contaminação cruzada.',
        lessons: [
          { t: 'Sequência correta: do mais limpo ao mais sujo', min: 18 },
          { t: 'Código de cores de panos e baldes', min: 13 },
          { t: 'Técnica de varredura úmida e dois baldes', min: 20 },
          { t: 'Higienização de sanitários passo a passo', min: 22 },
        ],
      },
      {
        title: 'Rotinas e Qualidade',
        description:
          'Frequências, checklists e critérios de avaliação do serviço.',
        lessons: [
          { t: 'Rotinas diárias, semanais e mensais', min: 15 },
          { t: 'Copas e áreas de alimentação', min: 17 },
          { t: 'Critérios de qualidade e autoavaliação', min: 14 },
          { t: 'Encerramento e próximos passos', min: 7 },
        ],
      },
    ],
    questions: [
      {
        q: 'A sequência correta de higienização de um ambiente deve seguir a lógica de:',
        options: [
          'Começar pelo local mais sujo para liberar a área mais rápido',
          'Iniciar pelas áreas e superfícies mais limpas, terminando nas mais sujas',
          'Alternar entre áreas limpas e sujas para economizar produto',
          'Começar sempre pelo sanitário, independentemente do ambiente',
        ],
        correct: 1,
        why: 'Iniciar pelo mais limpo e terminar no mais sujo evita que a sujeira e os microrganismos sejam levados para áreas já higienizadas.',
      },
      {
        q: 'A diferença entre limpeza e desinfecção é que:',
        options: [
          'Limpeza remove sujidade visível; desinfecção reduz a carga de microrganismos',
          'Limpeza elimina todos os microrganismos; desinfecção apenas remove poeira',
          'São processos idênticos, com nomes diferentes',
          'Desinfecção dispensa a limpeza prévia da superfície',
        ],
        correct: 0,
        why: 'A limpeza remove sujidade e matéria orgânica. A desinfecção reduz microrganismos e só é eficaz sobre uma superfície previamente limpa.',
      },
      {
        q: 'O código de cores de panos e baldes existe para:',
        options: [
          'Facilitar o controle de estoque do almoxarifado',
          'Evitar contaminação cruzada entre ambientes de riscos diferentes',
          'Identificar o turno em que o material foi utilizado',
          'Padronizar a identidade visual da equipe',
        ],
        correct: 1,
        why: 'Cada cor é destinada a um tipo de área (sanitário, copa, mobiliário, vidros), impedindo que o material usado em área suja seja aplicado em área limpa.',
      },
      {
        q: 'A técnica de varredura úmida é preferível à varredura seca porque:',
        options: [
          'Consome menos tempo de execução',
          'Evita a dispersão de poeira e microrganismos no ar',
          'Elimina a necessidade de uso de EPI',
          'Dispensa o uso posterior de desinfetante',
        ],
        correct: 1,
        why: 'A varredura seca levanta poeira e aerossóis. A varredura úmida retém as partículas, protegendo a qualidade do ar e a saúde de todos.',
      },
    ],
    rating: 4.7,
    enrolledCount: 8,
    createdAt: '2024-02-20',
  },
  {
    id: 'crs-07',
    title: 'Utilização Correta de Produtos Químicos',
    departmentId: 'dep-lim',
    category: 'Segurança e Saúde',
    instructor: 'Química Fernanda Bauer',
    instructorRole: 'Responsável Técnica de Produtos',
    instructorImg: 24,
    level: 'intermediario',
    mandatory: true,
    deadlineDays: 30,
    icon: 'FlaskConical',
    from: '#0d9488',
    to: '#f59e0b',
    summary:
      'Diluição, armazenamento, rotulagem e segurança no manuseio de saneantes e desinfetantes.',
    description:
      'Curso essencial para quem manuseia produtos químicos na rotina de limpeza. Aborda a leitura da FISPQ, a diluição correta conforme a finalidade, incompatibilidades perigosas entre produtos, rotulagem de frascos de uso, armazenamento adequado e as medidas de primeiros socorros em caso de contato ou inalação.',
    objectives: [
      'Ler e interpretar a FISPQ e o rótulo dos produtos',
      'Realizar diluições corretas conforme a finalidade de uso',
      'Reconhecer incompatibilidades químicas e seus riscos',
      'Armazenar e identificar produtos de forma segura',
      'Aplicar primeiros socorros em caso de contato, ingestão ou inalação',
    ],
    syllabus: [
      'Classificação de saneantes: detergentes, desinfetantes e removedores',
      'FISPQ e rótulo: o que cada informação significa',
      'Diluição: cálculo, dosadores e erros mais comuns',
      'Incompatibilidades químicas e reações perigosas',
      'Armazenamento, ventilação e identificação',
      'Primeiros socorros e ficha de emergência',
    ],
    modules: [
      {
        title: 'Conhecendo os Produtos',
        description:
          'Tipos de saneantes, finalidades e informações obrigatórias de rótulo.',
        lessons: [
          { t: 'Panorama dos produtos utilizados na empresa', min: 12 },
          { t: 'Detergentes, desinfetantes e removedores', min: 18 },
          { t: 'Como ler a FISPQ', min: 20 },
          { t: 'Leitura: FISPQ dos principais produtos', type: 'leitura', min: 15 },
        ],
      },
      {
        title: 'Diluição e Manuseio',
        description:
          'Como preparar a solução correta e manusear com segurança.',
        lessons: [
          { t: 'Cálculo de diluição e uso de dosadores', min: 19 },
          { t: 'Erros comuns: "quanto mais, melhor" é mito', min: 14 },
          { t: 'Incompatibilidades: cloro + ácido e outras combinações', min: 21 },
          { t: 'EPI obrigatório no manuseio de químicos', min: 16 },
        ],
      },
      {
        title: 'Armazenamento e Emergência',
        description:
          'Guarda segura dos produtos e conduta diante de acidentes.',
        lessons: [
          { t: 'Organização do depósito de produtos', min: 15 },
          { t: 'Rotulagem de frascos de uso diário', min: 11 },
          { t: 'Primeiros socorros: contato, ingestão e inalação', min: 20 },
          { t: 'Revisão final', min: 8 },
        ],
      },
    ],
    questions: [
      {
        q: 'A mistura de água sanitária (hipoclorito) com produtos ácidos, como desincrustantes, pode:',
        options: [
          'Potencializar o efeito desinfetante com segurança',
          'Liberar gás cloro, altamente tóxico por inalação',
          'Formar uma solução neutra e inofensiva',
          'Reduzir o consumo de produto sem qualquer risco',
        ],
        correct: 1,
        why: 'A reação libera gás cloro, que causa irritação grave das vias respiratórias e pode levar a intoxicação aguda. Produtos nunca devem ser misturados.',
      },
      {
        q: 'A FISPQ de um produto químico informa, entre outros dados:',
        options: [
          'Apenas o preço e o fornecedor do produto',
          'Identificação de perigos, manuseio, armazenamento, EPI e medidas de primeiros socorros',
          'Somente a data de validade',
          'A lista de clientes que utilizam o produto',
        ],
        correct: 1,
        why: 'A Ficha de Informações de Segurança de Produtos Químicos reúne perigos, composição, manuseio, armazenamento, EPI, primeiros socorros e combate a incêndio.',
      },
      {
        q: 'Usar o produto em concentração acima da recomendada pelo fabricante:',
        options: [
          'Garante desinfecção mais eficiente',
          'Pode danificar superfícies, aumentar o risco à saúde e elevar o custo, sem ganho de eficácia',
          'É recomendado em áreas críticas',
          'Não altera o resultado de nenhuma forma',
        ],
        correct: 1,
        why: 'A eficácia é comprovada na concentração indicada. O excesso agride superfícies, aumenta a exposição do trabalhador e desperdiça produto.',
      },
      {
        q: 'Ao transferir um produto para um frasco de uso diário, é obrigatório:',
        options: [
          'Nada, desde que a equipe saiba o que há no frasco',
          'Identificar o frasco com nome do produto, diluição e data de preparo',
          'Utilizar sempre garrafa de refrigerante vazia',
          'Remover o rótulo original da embalagem-mãe',
        ],
        correct: 1,
        why: 'A rotulagem evita uso incorreto e intoxicações. Nunca se deve usar embalagem de alimentos ou bebidas para armazenar saneantes.',
      },
    ],
    rating: 4.8,
    enrolledCount: 8,
    createdAt: '2024-03-11',
  },
  {
    id: 'crs-08',
    title: 'NR-32 — Segurança e Saúde no Trabalho',
    departmentId: 'dep-lim',
    category: 'Normas Regulamentadoras',
    instructor: 'Enfª Patrícia Arantes',
    instructorRole: 'Enfermeira do Trabalho',
    instructorImg: 9,
    level: 'avancado',
    mandatory: true,
    deadlineDays: 30,
    icon: 'ShieldCheck',
    from: '#0b1526',
    to: '#0d9488',
    summary:
      'Proteção contra riscos biológicos, químicos e físicos em serviços de saúde e ambientes assistenciais.',
    description:
      'Treinamento alinhado à Norma Regulamentadora nº 32, voltado aos colaboradores que atuam em ambientes com risco biológico. Aborda a classificação dos agentes biológicos, precauções padrão, manejo de resíduos de serviços de saúde, conduta diante de acidentes com material biológico, imunização e descarte seguro de materiais perfurocortantes.',
    objectives: [
      'Reconhecer os riscos biológicos presentes no ambiente de trabalho',
      'Aplicar as precauções padrão em todas as atividades',
      'Segregar e descartar resíduos conforme a classificação RDC',
      'Adotar a conduta correta em acidentes com material biológico',
      'Compreender a importância do calendário vacinal ocupacional',
    ],
    syllabus: [
      'Campo de aplicação e estrutura da NR-32',
      'Agentes biológicos e vias de transmissão',
      'Precauções padrão e higienização das mãos',
      'Resíduos de serviços de saúde: grupos A, B, C, D e E',
      'Perfurocortantes e caixa coletora',
      'Acidente com material biológico: fluxo de atendimento',
      'Imunização e exames ocupacionais',
    ],
    modules: [
      {
        title: 'Riscos Biológicos',
        description:
          'Natureza dos agentes biológicos e formas de exposição no trabalho.',
        lessons: [
          { t: 'Introdução à NR-32', min: 13 },
          { t: 'Agentes biológicos e vias de transmissão', min: 20 },
          { t: 'Avaliação de risco biológico no setor', min: 17 },
        ],
      },
      {
        title: 'Precauções e Resíduos',
        description:
          'Barreiras de proteção e manejo correto dos resíduos gerados.',
        lessons: [
          { t: 'Precauções padrão: a base de tudo', min: 18 },
          { t: 'Higienização das mãos: os 5 momentos', min: 15 },
          { t: 'Resíduos: grupos A, B, C, D e E', min: 22 },
          { t: 'Perfurocortantes e caixa coletora', min: 16 },
          { t: 'Leitura: Plano de gerenciamento de resíduos', type: 'leitura', min: 14 },
        ],
      },
      {
        title: 'Acidentes e Prevenção',
        description:
          'Como agir diante de exposição e quais medidas preventivas são obrigatórias.',
        lessons: [
          { t: 'Acidente com material biológico: o que fazer', min: 21 },
          { t: 'Fluxo de notificação e CAT', min: 13 },
          { t: 'Imunização ocupacional', min: 15 },
          { t: 'Revisão e encerramento', min: 9 },
        ],
      },
    ],
    questions: [
      {
        q: 'As precauções padrão devem ser aplicadas:',
        options: [
          'Somente quando se sabe que o paciente ou o material é contaminado',
          'A todos os pacientes e materiais, independentemente do diagnóstico conhecido',
          'Apenas em unidades de isolamento',
          'Somente durante procedimentos cirúrgicos',
        ],
        correct: 1,
        why: 'As precauções padrão partem do princípio de que todo sangue, fluido corporal e material pode ser infectante, devendo ser aplicadas universalmente.',
      },
      {
        q: 'Material perfurocortante utilizado deve ser descartado:',
        options: [
          'Em saco plástico branco leitoso, com identificação',
          'Em recipiente rígido, resistente à punctura, sem reencapar a agulha e sem ultrapassar o limite de preenchimento',
          'No lixo comum, desde que embalado em duas sacolas',
          'Em recipiente de vidro com tampa',
        ],
        correct: 1,
        why: 'O descarte é em coletor rígido específico (grupo E), sem reencapar nem desconectar manualmente a agulha, respeitando o limite de 2/3 a 3/4 da capacidade.',
      },
      {
        q: 'Diante de um acidente com exposição a material biológico, a primeira conduta é:',
        options: [
          'Espremer o local para retirar o sangue contaminado',
          'Lavar imediatamente o local com água e sabão e procurar o serviço de saúde para avaliação e notificação',
          'Aplicar álcool 70% e seguir trabalhando',
          'Aguardar o fim do turno e comunicar na próxima reunião',
        ],
        correct: 1,
        why: 'Lavar com água e sabão (ou soro em mucosas), não espremer o local e buscar atendimento imediato para avaliação de profilaxia e emissão da CAT.',
      },
      {
        q: 'Resíduos classificados no grupo A são:',
        options: [
          'Resíduos químicos perigosos',
          'Resíduos com possível presença de agentes biológicos que apresentem risco de infecção',
          'Rejeitos radioativos',
          'Resíduos comuns equiparados aos domiciliares',
        ],
        correct: 1,
        why: 'O grupo A reúne resíduos com risco biológico. O grupo B é químico, C é radioativo, D é comum e E é perfurocortante.',
      },
    ],
    rating: 4.9,
    enrolledCount: 8,
    createdAt: '2024-01-31',
  },
  {
    id: 'crs-09',
    title: 'Uso de EPIs',
    departmentId: 'dep-lim',
    category: 'Segurança e Saúde',
    instructor: 'Enfª Patrícia Arantes',
    instructorRole: 'Enfermeira do Trabalho',
    instructorImg: 9,
    level: 'basico',
    mandatory: true,
    deadlineDays: 20,
    icon: 'ShieldAlert',
    from: '#0f766e',
    to: '#3b82f6',
    summary:
      'Seleção, colocação, retirada, higienização e conservação dos equipamentos de proteção individual.',
    description:
      'Treinamento prático sobre equipamentos de proteção individual. O colaborador aprende a identificar o EPI adequado para cada atividade, a sequência correta de colocação e retirada, os cuidados de higienização e guarda, os critérios de substituição e as responsabilidades previstas na NR-06.',
    objectives: [
      'Identificar o EPI adequado para cada risco e atividade',
      'Executar a sequência correta de colocação e retirada',
      'Higienizar, guardar e conservar os equipamentos',
      'Reconhecer quando o EPI deve ser substituído',
      'Compreender as responsabilidades da empresa e do colaborador (NR-06)',
    ],
    syllabus: [
      'NR-06: conceitos e responsabilidades',
      'Tipos de EPI por região do corpo e por risco',
      'Certificado de Aprovação (CA) e validade',
      'Sequência de colocação e retirada',
      'Higienização, guarda e substituição',
      'Fichas de entrega e controle de EPI',
    ],
    modules: [
      {
        title: 'Conhecendo os EPIs',
        description: 'Tipos de equipamento, finalidade e certificação.',
        lessons: [
          { t: 'Por que o EPI é a última barreira', min: 11 },
          { t: 'Tipos de EPI e riscos associados', min: 19 },
          { t: 'Certificado de Aprovação (CA) e validade', min: 12 },
        ],
      },
      {
        title: 'Uso Correto na Prática',
        description:
          'Demonstrações de colocação, retirada e ajuste dos equipamentos.',
        lessons: [
          { t: 'Luvas: tipos e limitações', min: 16 },
          { t: 'Proteção respiratória e ajuste facial', min: 20 },
          { t: 'Óculos, protetor facial e auditivo', min: 15 },
          { t: 'Calçado de segurança e avental', min: 13 },
          { t: 'Sequência de colocação e retirada', min: 18 },
        ],
      },
      {
        title: 'Conservação e Responsabilidades',
        description:
          'Como manter o equipamento em condições de uso e o que diz a norma.',
        lessons: [
          { t: 'Higienização e guarda adequada', min: 14 },
          { t: 'Critérios de substituição e descarte', min: 12 },
          { t: 'Ficha de entrega e responsabilidades', min: 10 },
          { t: 'Encerramento', min: 6 },
        ],
      },
    ],
    questions: [
      {
        q: 'Segundo a NR-06, o fornecimento do EPI adequado ao risco é:',
        options: [
          'Opcional, conforme a disponibilidade orçamentária',
          'Obrigação gratuita do empregador, que também deve exigir e orientar o uso',
          'Responsabilidade do colaborador, com reembolso parcial',
          'Exclusivo para funções administrativas',
        ],
        correct: 1,
        why: 'O empregador deve fornecer gratuitamente EPI adequado, em perfeito estado, com CA válido, além de treinar, exigir o uso e substituir quando necessário.',
      },
      {
        q: 'Na retirada dos EPIs após atividade com risco biológico, a ordem adequada considera:',
        options: [
          'Retirar primeiro a proteção respiratória, por ser a mais incômoda',
          'Retirar primeiro os itens mais contaminados, mantendo a proteção respiratória até o fim, e higienizar as mãos ao final',
          'Retirar tudo simultaneamente para reduzir o tempo de exposição',
          'A ordem é indiferente, desde que se lave as mãos antes',
        ],
        correct: 1,
        why: 'A retirada começa pelos itens mais contaminados (luvas, avental), preservando a proteção respiratória por último, sempre com higienização das mãos ao final.',
      },
      {
        q: 'O Certificado de Aprovação (CA) de um EPI indica que:',
        options: [
          'O equipamento foi comprado de fornecedor nacional',
          'O equipamento atende aos requisitos de proteção e foi aprovado pelo órgão competente',
          'O colaborador está autorizado a utilizar o equipamento',
          'O EPI tem validade indeterminada',
        ],
        correct: 1,
        why: 'O CA atesta que o modelo foi ensaiado e aprovado. EPI sem CA válido não pode ser fornecido nem utilizado.',
      },
      {
        q: 'Uma luva de procedimento com pequeno furo percebido durante a atividade deve ser:',
        options: [
          'Mantida até o fim da tarefa, se o furo for pequeno',
          'Trocada imediatamente, com higienização das mãos antes de calçar o novo par',
          'Reforçada com fita adesiva',
          'Virada do lado contrário e reutilizada',
        ],
        correct: 1,
        why: 'Qualquer perda de integridade anula a proteção. A troca deve ser imediata, com higienização das mãos entre a retirada e a nova colocação.',
      },
    ],
    rating: 4.7,
    enrolledCount: 24,
    createdAt: '2024-02-05',
  },
  {
    id: 'crs-10',
    title: 'Procedimentos de Limpeza e Conservação',
    departmentId: 'dep-lim',
    category: 'Qualidade e Processos',
    instructor: 'Sueli Aparecida Nunes',
    instructorRole: 'Supervisora de Limpeza',
    instructorImg: 26,
    level: 'intermediario',
    mandatory: false,
    deadlineDays: 60,
    icon: 'SprayCan',
    from: '#13213a',
    to: '#2dd4bf',
    summary:
      'Procedimentos operacionais padrão por tipo de superfície, equipamento e ambiente.',
    description:
      'Curso que detalha os procedimentos operacionais padrão (POP) da área de limpeza. Cada tipo de superfície exige técnica, produto e equipamento específicos. O treinamento também aborda a operação de enceradeiras e lavadoras, a conservação de pisos e vidros, a limpeza pós-obra e a organização do carro funcional.',
    objectives: [
      'Aplicar o POP correto para cada tipo de superfície',
      'Operar equipamentos de limpeza com segurança',
      'Conservar pisos frios, vinílicos, madeira e carpetes',
      'Executar limpeza de vidros e fachadas internas com segurança',
      'Organizar o carro funcional e dimensionar materiais',
    ],
    syllabus: [
      'POP: o que é e como seguir',
      'Pisos: tipos, produtos e técnicas de conservação',
      'Operação de enceradeira, lavadora e aspirador',
      'Vidros, metais e mobiliário',
      'Limpeza pós-obra e limpeza terminal',
      'Carro funcional, dimensionamento e controle de materiais',
    ],
    modules: [
      {
        title: 'Procedimentos por Superfície',
        description:
          'Técnica e produto adequados para cada tipo de material.',
        lessons: [
          { t: 'O que é um POP e por que seguir', min: 12 },
          { t: 'Pisos frios, vinílicos e madeira', min: 21 },
          { t: 'Vidros, metais e mobiliário', min: 17 },
          { t: 'Leitura: POPs da área de limpeza', type: 'leitura', min: 16 },
        ],
      },
      {
        title: 'Equipamentos de Limpeza',
        description: 'Operação segura e conservação dos equipamentos.',
        lessons: [
          { t: 'Enceradeira: operação e segurança', min: 20 },
          { t: 'Lavadora automática e extratora', min: 18 },
          { t: 'Aspirador de pó e água', min: 14 },
          { t: 'Manutenção básica dos equipamentos', min: 13 },
        ],
      },
      {
        title: 'Rotinas Especiais e Organização',
        description:
          'Limpezas específicas e gestão dos materiais da equipe.',
        lessons: [
          { t: 'Limpeza pós-obra e terminal', min: 19 },
          { t: 'Organização do carro funcional', min: 12 },
          { t: 'Dimensionamento e controle de materiais', min: 15 },
          { t: 'Encerramento do curso', min: 7 },
        ],
      },
    ],
    questions: [
      {
        q: 'Antes de operar uma enceradeira, é obrigatório:',
        options: [
          'Molhar completamente o piso para facilitar o deslizamento',
          'Verificar cabo e plugue, instalar o disco adequado e sinalizar a área como piso em manutenção',
          'Remover a proteção do disco para aumentar o rendimento',
          'Operar com os pés descalços para melhor equilíbrio',
        ],
        correct: 1,
        why: 'Inspeção elétrica, disco correto para a finalidade e sinalização da área são requisitos de segurança para o operador e para quem circula no local.',
      },
      {
        q: 'Em pisos de madeira, o procedimento adequado é:',
        options: [
          'Lavar com grande volume de água e detergente alcalino',
          'Usar pano levemente umedecido e produto específico, evitando excesso de água',
          'Aplicar água sanitária pura para desinfetar',
          'Usar vassoura de piaçava com força abrasiva',
        ],
        correct: 1,
        why: 'Excesso de água empena e mancha a madeira. A conservação pede umidade mínima e produto específico para o tipo de acabamento.',
      },
      {
        q: 'O carro funcional bem organizado contribui para:',
        options: [
          'Apenas a aparência estética da equipe',
          'Produtividade, segurança e redução de deslocamentos desnecessários',
          'Aumentar a quantidade de produto consumida por ambiente',
          'Dispensar o uso de EPI durante a rotina',
        ],
        correct: 1,
        why: 'O carro funcional reúne tudo o que é necessário para o ambiente, reduzindo idas e vindas, riscos de queda e tempo de execução.',
      },
      {
        q: 'A limpeza pós-obra difere da limpeza de rotina principalmente porque:',
        options: [
          'Não exige uso de EPI',
          'Envolve remoção de resíduos de construção, poeira fina e respingos, exigindo produtos e sequência específicos',
          'Deve ser feita apenas com água',
          'É sempre mais rápida que a limpeza diária',
        ],
        correct: 1,
        why: 'Pós-obra exige remoção de respingos de tinta, cimento e poeira fina, com produtos específicos, mais EPI e sequência própria para não danificar acabamentos.',
      },
    ],
    rating: 4.5,
    enrolledCount: 8,
    createdAt: '2024-04-09',
  },
];
