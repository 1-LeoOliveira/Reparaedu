import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Avatar, Badge, Button, Icon } from '@/components/ui';
import { Field, Input } from '@/components/ui/form';
import { BrandLockup, BrandSignature } from '@/components/Brand';
import { isManager, useAuthStore } from '@/store/useAuthStore';
import { useDataStore } from '@/store/useDataStore';
import { users } from '@/data/employees';
import { departmentById } from '@/data/departments';
import { cn } from '@/utils/format';
import { toast } from '@/store/useToastStore';

const roleMeta = {
  admin: { label: 'Administrador', tone: 'navy' as const, icon: 'ShieldCheck' },
  rh: { label: 'Gestão de RH', tone: 'brand' as const, icon: 'Users' },
  colaborador: { label: 'Colaborador', tone: 'info' as const, icon: 'User' },
};

const highlights = [
  {
    icon: 'GraduationCap',
    title: 'Catálogo completo de treinamentos',
    description:
      'Conteúdos por departamento, com módulos, aulas, materiais e avaliações.',
  },
  {
    icon: 'Route',
    title: 'Trilhas de desenvolvimento',
    description:
      'Jornadas estruturadas de capacitação, da integração à especialização técnica.',
  },
  {
    icon: 'BarChart3',
    title: 'Indicadores em tempo real',
    description:
      'Conclusões, pendências, horas de capacitação e desempenho por setor.',
  },
  {
    icon: 'Award',
    title: 'Certificação automática',
    description:
      'Emissão de certificado com código de validação ao concluir cada treinamento.',
  },
];

export default function Login() {
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const loginAs = useAuthStore((s) => s.loginAs);
  const settings = useDataStore((s) => s.settings);
  const navigate = useNavigate();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [selected, setSelected] = React.useState<string | null>(null);

  if (user) {
    return <Navigate to={isManager(user) ? '/admin' : '/app'} replace />;
  }

  const go = (role: string) => {
    navigate(role === 'colaborador' ? '/app' : '/admin', { replace: true });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    window.setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (!result.ok) {
        setError(result.error ?? 'Não foi possível entrar.');
        return;
      }
      const logged = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
      );
      toast(
        `Bem-vindo, ${logged?.name.split(' ')[0]}!`,
        'Acesso realizado no ambiente de demonstração.',
      );
      go(logged?.role ?? 'colaborador');
    }, 650);
  };

  const quickAccess = (userId: string) => {
    setSelected(userId);
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    setEmail(target.email);
    setPassword(target.password);
    setLoading(true);
    window.setTimeout(() => {
      loginAs(userId);
      setLoading(false);
      toast(
        `Bem-vindo, ${target.name.split(' ')[0]}!`,
        `Perfil de demonstração: ${roleMeta[target.role].label}.`,
      );
      go(target.role);
    }, 550);
  };

  return (
    <div className="flex min-h-viewport bg-slate-50">
      {/* ------------------------- Painel institucional ------------------- */}
      <aside className="relative hidden w-[46%] max-w-[640px] overflow-hidden bg-navy-950 lg:block">
        <div className="absolute inset-0 grid-pattern opacity-70" />
        <div
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.42), transparent 70%)' }}
        />
        <div
          className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(232,85,31,0.30), transparent 70%)' }}
        />

        <div className="relative flex h-full flex-col justify-between p-12 xl:p-14">
          <div>
            <BrandLockup height={40} />
            <p className="mt-2.5 text-[10.5px] font-bold uppercase tracking-[0.22em] text-navy-200">
              Universidade Corporativa
            </p>
          </div>

          <div className="max-w-md">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11.5px] font-semibold uppercase tracking-wide text-white">
              <Icon name="Sparkles" className="h-3.5 w-3.5 text-repara-orange-soft" />
              Plataforma de educação corporativa
            </span>
            <h1 className="mt-6 text-[34px] font-extrabold leading-[1.12] tracking-tight text-white xl:text-[40px]">
              Toda a capacitação da sua equipe em um só ambiente.
            </h1>
            <p className="mt-4 text-[14.5px] leading-relaxed text-navy-200">
              Centralize treinamentos, trilhas de desenvolvimento, avaliações,
              certificados e indicadores de desempenho dos seus colaboradores —
              com acompanhamento completo por departamento.
            </p>

            <ul className="mt-9 space-y-4">
              {highlights.map((item) => (
                <li key={item.title} className="flex items-start gap-3.5">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-repara-orange-soft">
                    <Icon name={item.icon} className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[13.5px] font-bold text-white">{item.title}</p>
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-navy-300">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-6 border-t border-white/10 pt-6">
            <div>
              <p className="text-[21px] font-extrabold text-white">24</p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-400">
                Colaboradores
              </p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="text-[21px] font-extrabold text-white">16</p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-400">
                Treinamentos
              </p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="text-[21px] font-extrabold text-white">5</p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-400">
                Trilhas
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ------------------------------ Formulário ------------------------ */}
      <main className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-[420px] animate-fade-up">
          <div className="mb-8 lg:hidden">
            <BrandSignature tone="light" size={44} />
          </div>

          <h2 className="text-[25px] font-extrabold tracking-tight text-navy-900">
            Acesse sua conta
          </h2>
          <p className="mt-1.5 text-[13.5px] text-slate-500">
            Informe suas credenciais corporativas para continuar.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <Field label="E-mail corporativo" required>
              <div className="relative">
                <Icon
                  name="Mail"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                />
                <Input
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="nome.sobrenome@reparaedu.com.br"
                  className="pl-9"
                />
              </div>
            </Field>

            <Field label="Senha" required>
              <div className="relative">
                <Icon
                  name="Lock"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  <Icon name={showPassword ? 'EyeOff' : 'Eye'} className="h-4 w-4" />
                </button>
              </div>
            </Field>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-[12.5px] font-medium text-slate-600">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-3.5 w-3.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500/30"
                />
                Manter conectado
              </label>
              <button
                type="button"
                onClick={() =>
                  toast(
                    'Recuperação de senha',
                    'No ambiente de demonstração use a senha demo123.',
                    'info',
                  )
                }
                className="text-[12.5px] font-semibold text-brand-700 transition hover:text-brand-800"
              >
                Esqueci minha senha
              </button>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-3">
                <Icon name="AlertCircle" className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                <p className="text-[12.5px] font-medium leading-relaxed text-rose-700">
                  {error}
                </p>
              </div>
            )}

            <Button type="submit" size="lg" loading={loading} className="w-full justify-center">
              Entrar na plataforma
            </Button>
          </form>

          {/* --------------------- Contas de demonstração ------------------ */}
          <div className="mt-8">
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Contas de demonstração
              </span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <p className="mb-3 text-center text-[12px] text-slate-500">
              Clique em um perfil para acessar diretamente. Senha padrão:{' '}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-navy-800">
                demo123
              </code>
            </p>

            <div className="space-y-2">
              {users.map((demo) => {
                const meta = roleMeta[demo.role];
                const department = departmentById(demo.departmentId);
                return (
                  <button
                    key={demo.id}
                    type="button"
                    disabled={loading}
                    onClick={() => quickAccess(demo.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl border bg-white p-2.5 text-left transition-all duration-150',
                      'hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card-hover',
                      'disabled:cursor-not-allowed disabled:opacity-60',
                      selected === demo.id ? 'border-brand-400 ring-2 ring-brand-500/20' : 'border-slate-200',
                    )}
                  >
                    <Avatar name={demo.name} src={demo.avatar} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-bold text-navy-900">
                        {demo.name}
                      </span>
                      <span className="block truncate text-[11.5px] text-slate-500">
                        {demo.jobTitle}
                        {department && demo.role === 'colaborador' ? ` · ${department.name}` : ''}
                      </span>
                    </span>
                    <Badge tone={meta.tone} icon={meta.icon}>
                      {meta.label}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-8 text-center text-[11.5px] leading-relaxed text-slate-400">
            {settings.companyName} · Protótipo demonstrativo com dados fictícios.
            <br />
            Nenhuma informação real de colaboradores é utilizada.
          </p>
        </div>
      </main>
    </div>
  );
}
