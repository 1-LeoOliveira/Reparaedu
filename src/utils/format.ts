import type {
  CourseLevel,
  EmployeeStatus,
  EnrollmentStatus,
  NotificationKind,
} from '@/types';

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function formatDate(value: string | null | undefined) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateLong(value: string | null | undefined) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return '—';
  return new Date(value).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function relativeTime(value: string | null | undefined) {
  if (!value) return '—';
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return 'agora';
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `há ${hours} h`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'ontem';
  if (days < 30) return `há ${days} dias`;
  const months = Math.round(days / 30);
  if (months < 12) return `há ${months} ${months === 1 ? 'mês' : 'meses'}`;
  const years = Math.round(months / 12);
  return `há ${years} ${years === 1 ? 'ano' : 'anos'}`;
}

export function formatMinutes(minutes: number) {
  if (!minutes) return '0min';
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest}min`;
  if (rest === 0) return `${hours}h`;
  return `${hours}h ${rest}min`;
}

export function formatHours(minutes: number) {
  const hours = minutes / 60;
  if (hours >= 100) return `${Math.round(hours)}h`;
  return `${hours.toFixed(1).replace('.0', '').replace('.', ',')}h`;
}

export function formatNumber(value: number) {
  return value.toLocaleString('pt-BR');
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0];
}

export const levelLabel: Record<CourseLevel, string> = {
  basico: 'Básico',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
};

export const enrollmentStatusLabel: Record<EnrollmentStatus, string> = {
  nao_iniciado: 'Não iniciado',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
  atrasado: 'Atrasado',
};

export const employeeStatusLabel: Record<EmployeeStatus, string> = {
  ativo: 'Ativo',
  ferias: 'Férias',
  afastado: 'Afastado',
  inativo: 'Inativo',
};

export const notificationKindLabel: Record<NotificationKind, string> = {
  novo_curso: 'Novo treinamento',
  obrigatorio: 'Obrigatório',
  prazo: 'Prazo',
  atrasado: 'Atraso',
  certificado: 'Certificado',
  comunicado: 'Comunicado',
};

export const MONTH_LABELS = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
];

export function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function monthLabel(key: string) {
  const [year, month] = key.split('-');
  return `${MONTH_LABELS[Number(month) - 1]}/${year.slice(2)}`;
}

/** Últimos N meses no formato { key, label }, do mais antigo ao mais recente. */
export function lastMonths(count: number) {
  const list: Array<{ key: string; label: string }> = [];
  const base = new Date();
  base.setDate(1);
  for (let i = count - 1; i >= 0; i -= 1) {
    const date = new Date(base);
    date.setMonth(base.getMonth() - i);
    const key = monthKey(date);
    list.push({ key, label: monthLabel(key) });
  }
  return list;
}

export function daysBetween(from: string | Date, to: string | Date = new Date()) {
  const a = typeof from === 'string' ? new Date(from) : from;
  const b = typeof to === 'string' ? new Date(to) : to;
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

export function downloadCsv(filename: string, rows: Array<Array<string | number>>) {
  const content = rows
    .map((row) =>
      row
        .map((cell) => {
          const value = String(cell ?? '');
          return /[";\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
        })
        .join(';'),
    )
    .join('\r\n');

  const blob = new Blob([`﻿${content}`], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
