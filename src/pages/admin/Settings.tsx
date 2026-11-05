import React from 'react';
import {
  Badge,
  Button,
  Card,
  CardHeader,
  ConfirmDialog,
  Icon,
  PageHeader,
  StatCard,
  Tabs,
} from '@/components/ui';
import { Field, Input, Textarea, Toggle } from '@/components/ui/form';
import { BrandLockup, BrandMark } from '@/components/Brand';
import { useDataStore } from '@/store/useDataStore';
import { useAnalytics } from '@/hooks/useAnalytics';
import { toast } from '@/store/useToastStore';
import type { Settings } from '@/types';

export default function SettingsPage() {
  const settings = useDataStore((s) => s.settings);
  const updateSettings = useDataStore((s) => s.updateSettings);
  const resetDemoData = useDataStore((s) => s.resetDemoData);
  const analytics = useAnalytics();

  const [tab, setTab] = React.useState('instituicao');
  const [form, setForm] = React.useState<Settings>(settings);
  const [newCategory, setNewCategory] = React.useState('');
  const [confirmReset, setConfirmReset] = React.useState(false);

  React.useEffect(() => setForm(settings), [settings]);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const save = () => {
    updateSettings(form);
    toast('Configurações salvas', 'As alterações já estão aplicadas na plataforma.');
  };

  const addCategory = () => {
    const value = newCategory.trim();
    if (!value) return;
    if (form.categories.includes(value)) {
      toast('Categoria já existe', value, 'error');
      return;
    }
    set('categories', [...form.categories, value]);
    setNewCategory('');
  };

  return (
    <div>
      <PageHeader
        title="Configurações"
        description="Dados institucionais, identidade visual, categorias de treinamento e regras gerais da plataforma."
        breadcrumbs={[{ label: 'Painel de gestão', to: '/admin' }, { label: 'Configurações' }]}
        actions={
          <>
            <Button variant="outline" icon="RotateCcw" onClick={() => setForm(settings)}>
              Descartar alterações
            </Button>
            <Button icon="Save" onClick={save}>
              Salvar configurações
            </Button>
          </>
        }
      />

      <Tabs
        className="mb-5"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'instituicao', label: 'Dados institucionais', icon: 'Building2' },
          { id: 'identidade', label: 'Identidade visual', icon: 'Palette' },
          {
            id: 'categorias',
            label: 'Categorias',
            icon: 'Tags',
            count: form.categories.length,
          },
          { id: 'plataforma', label: 'Regras da plataforma', icon: 'Settings2' },
        ]}
      />

      {/* -------------------------- Dados institucionais ------------------ */}
      {tab === 'instituicao' && (
        <div className="grid gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader
              title="Informações da empresa"
              subtitle="Dados exibidos em certificados, relatórios e comunicados"
              icon="Building2"
            />
            <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
              <Field label="Razão social / nome da plataforma" className="sm:col-span-2">
                <Input
                  value={form.companyName}
                  onChange={(event) => set('companyName', event.target.value)}
                />
              </Field>
              <Field label="Nome curto" hint="Exibido no cabeçalho e no certificado">
                <Input
                  value={form.companyShortName}
                  onChange={(event) => set('companyShortName', event.target.value)}
                />
              </Field>
              <Field label="CNPJ">
                <Input value={form.cnpj} onChange={(event) => set('cnpj', event.target.value)} />
              </Field>
              <Field label="E-mail institucional">
                <Input
                  type="email"
                  value={form.email}
                  onChange={(event) => set('email', event.target.value)}
                />
              </Field>
              <Field label="Telefone">
                <Input
                  value={form.phone}
                  onChange={(event) => set('phone', event.target.value)}
                />
              </Field>
              <Field label="Endereço" className="sm:col-span-2">
                <Textarea
                  rows={2}
                  value={form.address}
                  onChange={(event) => set('address', event.target.value)}
                />
              </Field>
            </div>
          </Card>

          <div className="space-y-4">
            <StatCard
              label="Colaboradores"
              value={analytics.employeeCount}
              icon="Users"
              tone="navy"
            />
            <StatCard
              label="Treinamentos publicados"
              value={analytics.courseCount}
              icon="GraduationCap"
              tone="brand"
            />
            <StatCard
              label="Certificados emitidos"
              value={analytics.certificateCount}
              icon="Award"
              tone="success"
            />
          </div>
        </div>
      )}

      {/* --------------------------- Identidade visual -------------------- */}
      {tab === 'identidade' && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader
              title="Marca da plataforma"
              subtitle="Logotipo e símbolo aplicados em toda a interface"
              icon="Image"
            />
            <div className="space-y-5 px-5 py-5">
              <div>
                <p className="mb-2 text-[12.5px] font-semibold text-slate-700">
                  Lockup horizontal
                </p>
                <div
                  className="flex items-center justify-center rounded-xl px-6 py-7"
                  style={{ background: form.primaryColor }}
                >
                  <BrandLockup height={46} />
                </div>
                <p className="mt-2 text-[11.5px] text-slate-400">
                  Arquivo: <code className="text-slate-500">/repara-edu-logo.png</code> · aplicado
                  sobre fundo escuro na sidebar e na tela de acesso.
                </p>
              </div>

              <div>
                <p className="mb-2 text-[12.5px] font-semibold text-slate-700">
                  Símbolo (favicon e ícone)
                </p>
                <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <BrandMark size={64} />
                  <BrandMark size={40} />
                  <BrandMark size={28} rounded="rounded-lg" />
                  <div className="ml-auto text-right">
                    <p className="text-[12px] font-semibold text-navy-900">favicon.png</p>
                    <p className="text-[11px] text-slate-400">331 × 325 px</p>
                  </div>
                </div>
              </div>

              <Field label="Iniciais de fallback" hint="Usadas quando a imagem não carrega">
                <Input
                  maxLength={3}
                  value={form.logoInitials}
                  onChange={(event) =>
                    set('logoInitials', event.target.value.toUpperCase())
                  }
                  className="w-24"
                />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Cores institucionais"
              subtitle="Aplicadas em gradientes, capas e elementos de destaque"
              icon="Palette"
            />
            <div className="space-y-5 px-5 py-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Cor principal">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.primaryColor}
                      onChange={(event) => set('primaryColor', event.target.value)}
                      className="h-10 w-12 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
                    />
                    <Input
                      value={form.primaryColor}
                      onChange={(event) => set('primaryColor', event.target.value)}
                    />
                  </div>
                </Field>
                <Field label="Cor de destaque">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.accentColor}
                      onChange={(event) => set('accentColor', event.target.value)}
                      className="h-10 w-12 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
                    />
                    <Input
                      value={form.accentColor}
                      onChange={(event) => set('accentColor', event.target.value)}
                    />
                  </div>
                </Field>
              </div>

              <div>
                <p className="mb-2 text-[12.5px] font-semibold text-slate-700">
                  Pré-visualização
                </p>
                <div
                  className="relative overflow-hidden rounded-xl p-6"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${form.primaryColor} 0%, ${form.accentColor} 140%)`,
                  }}
                >
                  <div className="absolute inset-0 grid-pattern opacity-50" />
                  <div className="relative">
                    <p className="text-[18px] font-extrabold tracking-tight text-white">
                      {form.companyShortName}
                    </p>
                    <p className="mt-1 text-[12.5px] text-white/85">
                      Universidade Corporativa · identidade aplicada
                    </p>
                    <div className="mt-4 flex gap-2">
                      <span
                        className="rounded-lg px-3 py-1.5 text-[12px] font-bold text-white"
                        style={{ background: form.accentColor }}
                      >
                        Botão de destaque
                      </span>
                      <span className="rounded-lg bg-white/15 px-3 py-1.5 text-[12px] font-bold text-white backdrop-blur">
                        Elemento secundário
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5">
                <p className="flex items-start gap-2 text-[12px] leading-relaxed text-slate-600">
                  <Icon name="Info" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                  As cores dos gráficos seguem uma paleta validada para contraste e visão de
                  cores (daltonismo) e não são alteradas por esta configuração.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ----------------------------- Categorias ------------------------- */}
      {tab === 'categorias' && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader
              title="Categorias de treinamento"
              subtitle="Usadas para classificar e filtrar o catálogo"
              icon="Tags"
            />
            <div className="px-5 py-5">
              <div className="mb-4 flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      addCategory();
                    }
                  }}
                  placeholder="Nome da nova categoria"
                />
                <Button icon="Plus" onClick={addCategory}>
                  Adicionar
                </Button>
              </div>

              <ul className="space-y-2">
                {form.categories.map((category) => (
                  <li
                    key={category}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 px-3.5 py-2.5"
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-700">
                      <Icon name="Tag" className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-navy-900">
                      {category}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        set(
                          'categories',
                          form.categories.filter((item) => item !== category),
                        )
                      }
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Icon name="Trash2" className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Distribuição do catálogo"
              subtitle="Treinamentos publicados por categoria"
              icon="PieChart"
            />
            <ul className="divide-y divide-slate-100">
              {form.categories.map((category) => {
                const count = analytics.courseStats.filter(
                  (item) => item.course.category === category,
                ).length;
                return (
                  <li
                    key={category}
                    className="flex items-center justify-between gap-3 px-5 py-3"
                  >
                    <span className="text-[13px] text-slate-600">{category}</span>
                    <Badge tone={count > 0 ? 'brand' : 'neutral'}>
                      {count} {count === 1 ? 'treinamento' : 'treinamentos'}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      )}

      {/* --------------------------- Regras gerais ------------------------ */}
      {tab === 'plataforma' && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader
              title="Regras de aprendizagem"
              subtitle="Parâmetros aplicados a novos treinamentos"
              icon="Settings2"
            />
            <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
              <Field
                label="Nota mínima padrão (%)"
                hint="Sugerida ao criar uma avaliação"
              >
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={form.minimumScore}
                  onChange={(event) => set('minimumScore', Number(event.target.value) || 0)}
                />
              </Field>
              <Field
                label="Validade do certificado (meses)"
                hint="Usada para campanhas de reciclagem"
              >
                <Input
                  type="number"
                  min={0}
                  value={form.certificateValidityMonths}
                  onChange={(event) =>
                    set('certificateValidityMonths', Number(event.target.value) || 0)
                  }
                />
              </Field>
            </div>
            <div className="divide-y divide-slate-100 px-5 pb-3">
              <Toggle
                checked={form.requireAssessment}
                onChange={(value) => set('requireAssessment', value)}
                label="Exigir avaliação para conclusão"
                description="O treinamento só é concluído após aprovação na avaliação final."
              />
              <Toggle
                checked={form.allowSelfEnrollment}
                onChange={(value) => set('allowSelfEnrollment', value)}
                label="Permitir inscrição livre no catálogo"
                description="Colaboradores podem iniciar treinamentos opcionais por conta própria."
              />
              <Toggle
                checked={form.notifyByEmail}
                onChange={(value) => set('notifyByEmail', value)}
                label="Enviar notificações por e-mail"
                description="Resumo de pendências e avisos de prazo enviados ao e-mail corporativo."
              />
            </div>
          </Card>

          <div className="space-y-5">
            <Card>
              <CardHeader
                title="Ambiente de demonstração"
                subtitle="Controles exclusivos do protótipo"
                icon="FlaskConical"
              />
              <div className="px-5 py-5">
                <p className="text-[13px] leading-relaxed text-slate-600">
                  Todas as alterações feitas nesta demonstração — cadastros, progresso de
                  aulas, avaliações e certificados — ficam salvas no navegador
                  (LocalStorage). Use a opção abaixo para restaurar a base fictícia
                  original antes de uma nova apresentação.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="danger"
                    icon="RotateCcw"
                    onClick={() => setConfirmReset(true)}
                  >
                    Restaurar dados de demonstração
                  </Button>
                </div>
                <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3">
                  <Icon
                    name="AlertTriangle"
                    className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
                  />
                  <p className="text-[12px] leading-relaxed text-amber-900">
                    A restauração apaga todas as alterações feitas durante a demonstração e
                    recria a base fictícia inicial.
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader title="Sobre esta versão" icon="Info" />
              <dl className="divide-y divide-slate-100">
                {[
                  { label: 'Versão do protótipo', value: '1.0.0 (demonstração)' },
                  { label: 'Persistência', value: 'LocalStorage do navegador' },
                  { label: 'Origem dos dados', value: 'Base fictícia gerada localmente' },
                  { label: 'Integração com API', value: 'Prevista para a implantação' },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-3 px-5 py-2.5"
                  >
                    <dt className="text-[12.5px] text-slate-500">{row.label}</dt>
                    <dd className="text-[12.5px] font-semibold text-navy-900">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={() => {
          resetDemoData();
          toast('Dados restaurados', 'A base de demonstração foi recriada do zero.');
        }}
        title="Restaurar dados de demonstração"
        message="Todas as alterações feitas nesta demonstração serão perdidas e a base fictícia original será recriada. Deseja continuar?"
        confirmLabel="Restaurar base fictícia"
      />
    </div>
  );
}
