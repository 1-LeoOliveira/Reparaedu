import React from 'react';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Icon,
  LinkButton,
  Modal,
  PageHeader,
  SearchInput,
  StatCard,
} from '@/components/ui';
import { CertificateSheet, printCertificate } from '@/components/CertificateSheet';
import { useAuthStore } from '@/store/useAuthStore';
import { useDataStore } from '@/store/useDataStore';
import { useEmployeeLearning } from '@/hooks/useAnalytics';
import { toast } from '@/store/useToastStore';
import { formatDate, formatHours } from '@/utils/format';
import type { Certificate } from '@/types';

export default function Certificates() {
  const user = useAuthStore((s) => s.user);
  const courses = useDataStore((s) => s.courses);
  const learning = useEmployeeLearning(user?.id);
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState<Certificate | null>(null);

  const items = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    return learning.certificates
      .map((certificate) => ({
        certificate,
        course: courses.find((c) => c.id === certificate.courseId),
      }))
      .filter((item) =>
        term ? (item.course?.title ?? '').toLowerCase().includes(term) : true,
      );
  }, [learning.certificates, courses, search]);

  const totalHours = learning.certificates.reduce((sum, c) => sum + c.hours, 0);
  const averageScore = learning.certificates.length
    ? Math.round(
        learning.certificates.reduce((sum, c) => sum + c.score, 0) /
          learning.certificates.length,
      )
    : 0;

  return (
    <div>
      <PageHeader
        title="Meus certificados"
        description="Certificados emitidos automaticamente a cada treinamento concluído com aproveitamento."
        breadcrumbs={[{ label: 'Início', to: '/app' }, { label: 'Certificados' }]}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Certificados emitidos"
          value={learning.certificates.length}
          icon="Award"
          tone="warning"
          hint="Disponíveis para impressão"
        />
        <StatCard
          label="Carga horária certificada"
          value={`${totalHours}h`}
          icon="Clock"
          tone="success"
          hint="Total acumulado de capacitação"
        />
        <StatCard
          label="Aproveitamento médio"
          value={`${averageScore}%`}
          icon="Target"
          tone="brand"
          hint="Média das notas nas avaliações"
        />
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar certificado por treinamento…"
          className="sm:w-80"
        />
        <p className="text-[13px] text-slate-500">
          {items.length} {items.length === 1 ? 'certificado' : 'certificados'}
        </p>
      </div>

      {items.length === 0 ? (
        <Card>
          <EmptyState
            icon="Award"
            title="Nenhum certificado emitido"
            description="Conclua um treinamento e seja aprovado na avaliação final para receber seu primeiro certificado."
            action={
              <LinkButton to="/app/meus-treinamentos" icon="BookOpen">
                Ver meus treinamentos
              </LinkButton>
            }
          />
        </Card>
      ) : (
        <div className="grid animate-fade-up gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map(({ certificate, course }) => (
            <Card key={certificate.id} hover className="flex flex-col overflow-hidden">
              <div
                className="relative flex h-24 items-center justify-between px-5"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${course?.coverFrom ?? '#1d3155'}, ${course?.coverTo ?? '#2563eb'})`,
                }}
              >
                <Icon name="Award" className="h-10 w-10 text-white/35" strokeWidth={1.5} />
                <span className="rounded-md bg-white/95 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
                  Aprovado · {certificate.score}%
                </span>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-2 text-[14.5px] font-bold leading-snug tracking-tight text-navy-900">
                  {course?.title ?? 'Treinamento'}
                </h3>
                <p className="mt-1 text-[12.5px] text-slate-500">
                  {course?.instructor} · {course?.category}
                </p>

                <dl className="mt-3 space-y-1.5 text-[12.5px]">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Carga horária</dt>
                    <dd className="font-semibold text-navy-900">{certificate.hours}h</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Conclusão</dt>
                    <dd className="font-semibold text-navy-900">
                      {formatDate(certificate.issuedAt)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Código</dt>
                    <dd className="font-mono text-[11.5px] font-semibold text-navy-800">
                      {certificate.code}
                    </dd>
                  </div>
                </dl>

                <div className="mt-auto flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    icon="Eye"
                    className="flex-1 justify-center"
                    onClick={() => setSelected(certificate)}
                  >
                    Visualizar
                  </Button>
                  <Button
                    size="sm"
                    icon="Printer"
                    className="flex-1 justify-center"
                    onClick={() => {
                      setSelected(certificate);
                      window.setTimeout(printCertificate, 420);
                    }}
                  >
                    Imprimir
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Certificado de conclusão"
        description="Pré-visualização do documento emitido pela plataforma."
        size="xl"
        icon="Award"
        footer={
          <>
            <Badge tone="neutral" icon="ShieldCheck" className="mr-auto">
              Código {selected?.code}
            </Badge>
            <Button
              variant="outline"
              icon="Copy"
              onClick={() => {
                if (selected) {
                  navigator.clipboard?.writeText(selected.code);
                  toast('Código copiado', selected.code);
                }
              }}
            >
              Copiar código
            </Button>
            <Button icon="Printer" onClick={printCertificate}>
              Imprimir certificado
            </Button>
          </>
        }
      >
        {selected && <CertificateSheet certificate={selected} />}
      </Modal>
    </div>
  );
}
