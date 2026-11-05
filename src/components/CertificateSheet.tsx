import { Icon } from '@/components/ui';
import { useDataStore } from '@/store/useDataStore';
import { formatDate } from '@/utils/format';
import type { Certificate } from '@/types';

const NAVY = '#0d2149';
const NAVY_DEEP = '#09132a';
const ORANGE = '#e8551f';

/**
 * Certificado de capacitação — formato paisagem.
 *
 * Toda a tipografia é dimensionada em `cqw` (porcentagem da largura do
 * container), de modo que o documento mantém exatamente as mesmas proporções
 * na pré-visualização em tela e na impressão em A4 paisagem.
 */
export function CertificateSheet({ certificate }: { certificate: Certificate }) {
  const courses = useDataStore((s) => s.courses);
  const employees = useDataStore((s) => s.employees);
  const settings = useDataStore((s) => s.settings);

  const course = courses.find((c) => c.id === certificate.courseId);
  const employee = employees.find((e) => e.id === certificate.employeeId);

  const validityYears = Math.round(settings.certificateValidityMonths / 12);
  const validityLabel =
    settings.certificateValidityMonths % 12 === 0
      ? `${validityYears} ${validityYears === 1 ? 'ano' : 'anos'}`
      : `${settings.certificateValidityMonths} meses`;

  return (
    <div className="cert-scroll scrollbar-thin">
      <div className="print-area cert-root">
      <style>{`
        /*
         * Em telas estreitas o documento não é reduzido — a tipografia em cqw
         * ficaria ilegível. Ele mantém uma largura mínima e o container rola
         * na horizontal, preservando as proporções do certificado.
         */
        .cert-scroll { overflow-x: auto; }
        .cert-root {
          container-type: inline-size;
          width: 100%;
          min-width: 620px;
          margin-inline: auto;
        }
        @media print {
          .cert-scroll { overflow: visible; }
          .cert-root { min-width: 0; }
        }
        .cert-sheet {
          position: relative;
          width: 100%;
          aspect-ratio: 1.5 / 1;
          overflow: hidden;
          background: #ffffff;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
          box-shadow: 0 10px 30px -12px rgba(9, 19, 42, 0.28);
        }
        .cert-wash {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(118deg, #ffffff 0%, #f6f8fc 42%, #eef2f8 62%, #f8fafd 100%);
        }
        .cert-stripe {
          position: absolute;
          inset: 0;
          opacity: 0.55;
          background: repeating-linear-gradient(
            118deg,
            rgba(13, 33, 73, 0) 0 46px,
            rgba(13, 33, 73, 0.028) 46px 92px
          );
        }
        /* Recuos mantêm o conteúdo livre dos ornamentos de canto (11cqw). */
        .cert-pad {
          position: absolute;
          inset: 0;
          padding: 4cqw 13cqw 3.6cqw 11.8cqw;
          display: flex;
          flex-direction: column;
        }
        .cert-title {
          font-size: 6.2cqw;
          line-height: 0.96;
          font-weight: 800;
          letter-spacing: 0.055em;
          color: ${NAVY};
        }
        .cert-subtitle {
          font-size: 1.6cqw;
          font-weight: 700;
          letter-spacing: 0.4em;
          color: ${NAVY};
          white-space: nowrap;
        }
        .cert-rule {
          height: 0.16cqw;
          background: ${ORANGE};
          flex: 1;
        }
        .cert-lead { font-size: 1.8cqw; color: #334155; line-height: 1.4; }
        .cert-name {
          font-size: 4cqw;
          font-weight: 800;
          letter-spacing: -0.015em;
          color: ${NAVY};
          line-height: 1.05;
        }
        .cert-pill {
          display: inline-flex;
          align-items: center;
          gap: 1.4cqw;
          background: ${NAVY};
          color: #fff;
          border-radius: 0.7cqw;
          padding: 0.95cqw 2.2cqw 0.95cqw 1.7cqw;
          max-width: 100%;
        }
        .cert-pill-text {
          font-size: 2.3cqw;
          font-weight: 800;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }
        .cert-desc {
          font-size: 1.55cqw;
          line-height: 1.5;
          color: #3f4d63;
          max-width: 54cqw;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .cert-meta-label {
          font-size: 1.12cqw;
          color: #64748b;
          line-height: 1.2;
        }
        .cert-meta-value {
          font-size: 1.55cqw;
          font-weight: 800;
          color: ${NAVY};
          line-height: 1.25;
        }
        .cert-meta-sep {
          width: 0.1cqw;
          align-self: stretch;
          background: #cbd5e1;
        }
        .cert-sign-line {
          height: 0.12cqw;
          background: ${NAVY};
          width: 23cqw;
        }
        .cert-tagline {
          font-size: 1.22cqw;
          font-weight: 800;
          letter-spacing: 0.17em;
          color: ${NAVY};
          line-height: 1.5;
        }
        .cert-seal-ring {
          background:
            repeating-conic-gradient(
              from 0deg,
              #f7d278 0deg 6deg,
              #d9a23d 6deg 12deg
            );
        }
        .cert-seal-face {
          background:
            radial-gradient(circle at 32% 26%, #fdf0c8 0%, #f3cd77 38%, #d9a23d 72%, #b9832a 100%);
        }
        @media print {
          .cert-sheet { box-shadow: none; }
        }
      `}</style>

      <div className="cert-sheet">
        <div className="cert-wash" />
        <div className="cert-stripe" />

        {/* ---------------------- Painel temático à direita ------------- */}
        <div
          style={{
            position: 'absolute',
            inset: '0 0 0 58%',
            clipPath: 'polygon(18% 0, 100% 0, 100% 100%, 0 100%)',
            backgroundImage: `linear-gradient(140deg, ${course?.coverFrom ?? NAVY} 0%, ${course?.coverTo ?? ORANGE} 100%)`,
            opacity: 0.085,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '4cqw',
            bottom: '12cqw',
            opacity: 0.07,
            color: NAVY,
          }}
        >
          <Icon name={course?.cover ?? 'GraduationCap'} className="h-[22cqw] w-[22cqw]" strokeWidth={1.1} />
        </div>

        {/* ----------------------- Ornamentos de canto ------------------ */}
        <svg
          viewBox="0 0 240 240"
          style={{ position: 'absolute', left: 0, top: 0, width: '11cqw', height: '11cqw' }}
        >
          <polygon points="0,0 104,0 0,104" fill={ORANGE} />
          <polygon points="124,0 240,0 0,240 0,124" fill={NAVY} />
        </svg>
        <svg
          viewBox="0 0 240 240"
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '11cqw',
            height: '11cqw',
            transform: 'rotate(180deg)',
          }}
        >
          <polygon points="0,0 104,0 0,104" fill={ORANGE} />
          <polygon points="124,0 240,0 0,240 0,124" fill={NAVY} />
        </svg>

        {/* ------------------------------ Selo -------------------------- */}
        <div
          style={{
            position: 'absolute',
            right: '5.5cqw',
            top: '4.5cqw',
            width: '17cqw',
            height: '21cqw',
          }}
        >
          {/* Fitas */}
          <div
            style={{
              position: 'absolute',
              left: '2.6cqw',
              top: '9cqw',
              width: '4.4cqw',
              height: '11.5cqw',
              background: NAVY,
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '2.6cqw',
              top: '9cqw',
              width: '4.4cqw',
              height: '11.5cqw',
              background: NAVY,
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)',
            }}
          />
          {/* Medalha */}
          <div
            className="cert-seal-ring"
            style={{
              position: 'absolute',
              inset: '0 0 auto 0',
              height: '17cqw',
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 0.5cqw 1.4cqw -0.6cqw rgba(120, 80, 10, 0.55)',
            }}
          >
            <div
              className="cert-seal-face"
              style={{
                width: '14.4cqw',
                height: '14.4cqw',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                boxShadow: 'inset 0 0 0 0.18cqw rgba(255,255,255,0.55)',
              }}
            >
              <div style={{ textAlign: 'center', lineHeight: 1 }}>
                <div style={{ display: 'grid', placeItems: 'center' }}>
                  <span
                    style={{
                      width: '5.4cqw',
                      height: '5.4cqw',
                      borderRadius: '1.1cqw',
                      background: NAVY_DEEP,
                      display: 'grid',
                      placeItems: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src="/favicon.png"
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </span>
                </div>
                <div
                  style={{
                    marginTop: '0.5cqw',
                    fontSize: '1.42cqw',
                    fontWeight: 800,
                    color: NAVY,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Repara Edu
                </div>
                <div
                  style={{
                    marginTop: '0.45cqw',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '0.5cqw',
                  }}
                >
                  {[0, 1, 2].map((star) => (
                    <span
                      key={star}
                      style={{ color: NAVY, fontSize: '1.1cqw', lineHeight: 1 }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------- Conteúdo ------------------------ */}
        <div className="cert-pad">
          {/* Cabeçalho */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.6cqw' }}>
            <span
              style={{
                width: '5.2cqw',
                height: '5.2cqw',
                borderRadius: '1.1cqw',
                background: NAVY_DEEP,
                display: 'grid',
                placeItems: 'center',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <img
                src="/favicon.png"
                alt="Repara Edu"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </span>
            <div
              style={{
                fontSize: '3.1cqw',
                fontWeight: 800,
                letterSpacing: '-0.01em',
                color: NAVY,
                lineHeight: 1,
              }}
            >
              REPARA <span style={{ color: ORANGE }}>Edu</span>
            </div>
            <div
              style={{ width: '0.12cqw', height: '3.4cqw', background: '#cbd5e1' }}
            />
            <div
              style={{
                fontSize: '1.42cqw',
                color: '#475569',
                lineHeight: 1.35,
                fontWeight: 500,
              }}
            >
              Aprender. Evoluir.
              <br />
              Transformar.
            </div>
          </div>

          {/* Título */}
          <div style={{ marginTop: '2.2cqw' }}>
            <h1 className="cert-title">CERTIFICADO</h1>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.4cqw',
                marginTop: '1.1cqw',
                maxWidth: '62cqw',
              }}
            >
              <span className="cert-rule" />
              <span className="cert-subtitle">DE CAPACITAÇÃO</span>
              <span className="cert-rule" />
            </div>
          </div>

          {/* Corpo */}
          <div style={{ marginTop: '1.6cqw' }}>
            <p className="cert-lead">
              A <strong style={{ fontWeight: 700, color: NAVY }}>Repara Edu</strong>{' '}
              certifica que
            </p>
            <p className="cert-name" style={{ marginTop: '0.8cqw' }}>
              {employee?.name ?? '—'}
            </p>
            <div
              style={{
                height: '0.14cqw',
                background: ORANGE,
                width: '46cqw',
                margin: '1.1cqw 0 1.3cqw',
              }}
            />
            <p className="cert-lead">concluiu com aproveitamento o curso de</p>

            <div style={{ marginTop: '0.9cqw' }}>
              <span className="cert-pill">
                <Icon
                  name={course?.cover ?? 'GraduationCap'}
                  className="h-[2.4cqw] w-[2.4cqw] shrink-0"
                  strokeWidth={2}
                />
                <span
                  style={{
                    width: '0.1cqw',
                    alignSelf: 'stretch',
                    flexShrink: 0,
                    background: 'rgba(255,255,255,0.3)',
                  }}
                />
                <span className="cert-pill-text">{course?.title ?? '—'}</span>
              </span>
            </div>

            <p className="cert-desc" style={{ marginTop: '1.2cqw' }}>
              {course?.summary ??
                'Demonstrando conhecimento e habilidades aplicáveis à sua função.'}
            </p>
          </div>

          {/* Metadados */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2.2cqw',
              marginTop: '1.6cqw',
            }}
          >
            {[
              {
                icon: 'CalendarDays',
                label: 'Data de Conclusão',
                value: formatDate(certificate.issuedAt),
              },
              {
                icon: 'Clock',
                label: 'Carga Horária',
                value: `${certificate.hours} horas`,
              },
              {
                icon: 'CheckCircle2',
                label: 'Aproveitamento',
                value: `${certificate.score}%`,
              },
              {
                icon: 'ShieldCheck',
                label: 'Validade',
                value: validityLabel,
              },
            ].map((item, index) => (
              <div
                key={item.label}
                style={{ display: 'flex', alignItems: 'center', gap: '2.2cqw' }}
              >
                {index > 0 && <span className="cert-meta-sep" />}
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.9cqw' }}>
                  <Icon
                    name={item.icon}
                    className="h-[2.2cqw] w-[2.2cqw] shrink-0"
                    strokeWidth={1.8}
                  />
                  <span>
                    <span className="cert-meta-label" style={{ display: 'block' }}>
                      {item.label}
                    </span>
                    <span className="cert-meta-value" style={{ display: 'block' }}>
                      {item.value}
                    </span>
                  </span>
                </span>
              </div>
            ))}
          </div>

          {/* Rodapé */}
          <div
            style={{
              marginTop: 'auto',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '3cqw',
            }}
          >
            <div>
              <svg
                viewBox="0 0 260 70"
                style={{ width: '16cqw', height: '3.6cqw', display: 'block' }}
              >
                <path
                  d="M8 52c18-6 26-28 36-38s14 2 10 14-14 22-6 24 22-14 30-26 12-10 12 2-6 20 2 22 20-12 28-22 14-12 16-2-4 18 2 20 18-8 26-16 16-14 20-8"
                  fill="none"
                  stroke={NAVY}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="cert-sign-line" style={{ margin: '0.5cqw 0 0.9cqw' }} />
              <p
                style={{
                  fontSize: '1.52cqw',
                  fontWeight: 800,
                  color: NAVY,
                  lineHeight: 1.25,
                }}
              >
                Equipe Repara Edu
              </p>
              <p style={{ fontSize: '1.3cqw', color: '#64748b', lineHeight: 1.3 }}>
                Departamento de Treinamento
              </p>
              <p
                style={{
                  marginTop: '0.9cqw',
                  fontSize: '1.12cqw',
                  color: '#94a3b8',
                  lineHeight: 1.3,
                }}
              >
                Código de validação{' '}
                <strong
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    color: NAVY_DEEP,
                    fontWeight: 700,
                  }}
                >
                  {certificate.code}
                </strong>
              </p>
            </div>

            <div style={{ textAlign: 'right', paddingBottom: '1cqw' }}>
              <p className="cert-tagline">
                DESENVOLVIMENTO
                <br />
                QUE IMPULSIONA RESULTADOS
              </p>
              <div
                style={{
                  height: '0.14cqw',
                  background: ORANGE,
                  width: '14cqw',
                  marginLeft: 'auto',
                  marginTop: '0.9cqw',
                }}
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

/**
 * Imprime o certificado em A4 paisagem.
 *
 * A regra `@page` não pode ser condicionada por seletor, então a orientação é
 * injetada apenas durante a impressão do certificado e removida em seguida —
 * preservando a orientação retrato usada nos relatórios.
 */
export function printCertificate() {
  const style = document.createElement('style');
  style.id = 'cert-print-orientation';
  style.textContent = '@page { size: A4 landscape; margin: 10mm; }';
  document.head.appendChild(style);

  window.setTimeout(() => {
    window.print();
    window.setTimeout(() => style.remove(), 500);
  }, 120);
}
