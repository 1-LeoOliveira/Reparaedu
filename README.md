# Repara Edu — Universidade Corporativa

Protótipo funcional de uma plataforma de educação corporativa (LMS), construído para
demonstração comercial. Toda a aplicação roda no navegador, com dados fictícios e
persistência local — não há backend nesta fase.

## Stack

| Camada | Tecnologia |
|---|---|
| Build | Vite 5 |
| UI | React 18 + TypeScript |
| Estilo | Tailwind CSS 3 |
| Rotas | React Router 6 |
| Estado | Zustand (com `persist` em LocalStorage) |
| Gráficos | Recharts |
| Ícones | Lucide React |

## Como executar

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção em dist/
npm run preview  # pré-visualiza o build
```

## Deploy

O build gera um site estático em `dist/`. Como a aplicação é uma SPA, o
servidor precisa devolver `index.html` para qualquer rota — caso contrário,
atualizar a página em `/app/catalogo` resulta em 404, já que esse caminho não
existe como arquivo.

Na Vercel isso é resolvido pelo `vercel.json` incluído no repositório. Em outro
provedor, configure o equivalente:

| Provedor | Configuração |
|---|---|
| Vercel | `vercel.json` com `rewrites` para `/index.html` (já no repositório) |
| Netlify | `_redirects` com `/* /index.html 200` |
| Nginx | `try_files $uri $uri/ /index.html;` |
| Apache | `FallbackResource /index.html` |

## Contas de demonstração

A tela de acesso permite entrar com um clique em qualquer um dos perfis abaixo.
A senha de todos é `demo123`.

| Perfil | Usuário | Ambiente |
|---|---|---|
| Administrador | Carlos Henrique Moura | Gestão completa |
| Gestão de RH | Mariana Costa | Gestão completa |
| Colaborador | João Pedro Alves | Manutenção |
| Colaboradora | Ana Paula Ferreira | Limpeza |
| Colaborador | Rafael Martins | Administrativo |

## Funcionalidades

**Ambiente do colaborador** — painel inicial com continuidade de aprendizagem,
catálogo com filtros, página do treinamento, player de vídeo com marcação de aulas e
retomada, avaliação com gabarito comentado e novas tentativas, certificados
imprimíveis com código de validação, trilhas de aprendizagem e perfil.

**Ambiente de gestão** — dashboard com indicadores e gráficos, gestão de
departamentos, colaboradores, treinamentos (editor completo de módulos, aulas,
materiais e avaliações), trilhas, relatórios com exportação CSV, central de
notificações com publicação de comunicados e configurações institucionais.

## Estrutura

```
src/
  components/    componentes reutilizáveis (ui/, charts/, marca, certificado)
  layouts/       shell da aplicação (sidebar, topbar, busca, notificações)
  pages/         auth/ · employee/ · admin/
  data/          dados fictícios e gerador determinístico do seed
  hooks/         métricas e analytics derivados
  store/         estado global (auth, dados, toasts)
  types/         tipos de domínio
  utils/         formatação, datas e exportação CSV
```

### Dados fictícios

A base demonstrativa tem 3 departamentos, 24 colaboradores, 16 treinamentos,
5 trilhas e cerca de 184 matrículas. Todo o histórico — progresso, avaliações,
certificados, notificações e séries mensais dos gráficos — é derivado de um
gerador determinístico em `src/data/seed.ts`, de modo que os números dos
relatórios sempre correspondem aos históricos individuais.

Os arquivos de `src/data/` são o ponto de substituição por uma API real: os
componentes consomem os dados sempre através da store, nunca diretamente.

Alterações feitas durante a demonstração ficam salvas no LocalStorage. Para
restaurar a base original, use **Configurações → Regras da plataforma →
Restaurar dados de demonstração**.

## Identidade visual

A marca fica em `public/`: `repara-edu-logo.png` (lockup horizontal, aplicado
sobre fundo navy) e `favicon.png` (símbolo). O navy do sistema (`#09132a`)
é o mesmo do fundo da logomarca, para encaixe sem emenda.

A paleta dos gráficos é separada da paleta da marca e foi validada para
contraste e visão de cores (daltonismo) — ver `src/components/charts/index.tsx`.

## Observações

- Os vídeos das aulas são arquivos públicos de demonstração.
- Os downloads de materiais geram um arquivo de texto explicativo.
- Nenhuma informação real de colaboradores é utilizada.
