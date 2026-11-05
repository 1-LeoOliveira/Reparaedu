import React from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatNumber } from '@/utils/format';

// ---------------------------------------------------------------------------
// Tokens de visualização
// Paleta categórica validada (CVD + contraste) — blue / teal / orange.
// Cores de status são reservadas e sempre acompanhadas de rótulo na legenda.
// ---------------------------------------------------------------------------

export const VIZ = {
  series: ['#2563eb', '#0d9488', '#ea580c'],
  status: {
    concluido: '#059669',
    em_andamento: '#2563eb',
    atrasado: '#e11d48',
    nao_iniciado: '#94a3b8',
  },
  grid: '#eef2f7',
  axis: '#94a3b8',
  axisText: '#64748b',
  surface: '#ffffff',
};

const axisProps = {
  tick: { fill: VIZ.axisText, fontSize: 11.5, fontVariantNumeric: 'tabular-nums' },
  tickLine: false,
  axisLine: false,
} as const;

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------

interface TooltipEntry {
  name?: string;
  value?: number | string;
  color?: string;
  payload?: Record<string, unknown>;
}

function ChartTooltip({
  active,
  payload,
  label,
  suffix,
  total,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
  suffix?: string;
  total?: boolean;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const sum = payload.reduce((acc, item) => acc + Number(item.value ?? 0), 0);

  return (
    <div className="min-w-[168px] rounded-lg border border-slate-200 bg-white/98 px-3 py-2.5 shadow-pop backdrop-blur">
      {label && (
        <p className="mb-1.5 text-[11.5px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="flex items-center justify-between gap-4 text-[12.5px]"
          >
            <span className="flex items-center gap-1.5 text-slate-600">
              <span
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ background: item.color }}
              />
              {item.name}
            </span>
            <span className="font-bold tabular-nums text-navy-900">
              {formatNumber(Number(item.value ?? 0))}
              {suffix}
            </span>
          </div>
        ))}
      </div>
      {total && payload.length > 1 && (
        <div className="mt-1.5 flex items-center justify-between gap-4 border-t border-slate-100 pt-1.5 text-[12.5px]">
          <span className="font-semibold text-slate-500">Total</span>
          <span className="font-bold tabular-nums text-navy-900">
            {formatNumber(sum)}
            {suffix}
          </span>
        </div>
      )}
    </div>
  );
}

function LegendContent({ payload }: { payload?: Array<{ value?: string; color?: string }> }) {
  if (!payload) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-3">
      {payload.map((item) => (
        <span
          key={item.value}
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-600"
        >
          <span
            className="h-2 w-2 rounded-[2px]"
            style={{ background: item.color }}
          />
          {item.value}
        </span>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Evolução mensal (conclusões x inícios)
// ---------------------------------------------------------------------------

export function TrendChart({
  data,
  height = 272,
}: {
  data: Array<{ label: string; conclusoes: number; inicios: number }>;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="gradConclusoes" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={VIZ.series[0]} stopOpacity={0.22} />
            <stop offset="100%" stopColor={VIZ.series[0]} stopOpacity={0.01} />
          </linearGradient>
          <linearGradient id="gradInicios" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={VIZ.series[1]} stopOpacity={0.16} />
            <stop offset="100%" stopColor={VIZ.series[1]} stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={VIZ.grid} vertical={false} />
        <XAxis dataKey="label" {...axisProps} dy={6} />
        <YAxis {...axisProps} width={46} allowDecimals={false} />
        <Tooltip
          content={<ChartTooltip />}
          cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        <Legend content={<LegendContent />} />
        <Area
          type="monotone"
          dataKey="conclusoes"
          name="Conclusões"
          stroke={VIZ.series[0]}
          strokeWidth={2}
          fill="url(#gradConclusoes)"
          activeDot={{ r: 4.5, strokeWidth: 2, stroke: '#fff' }}
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="inicios"
          name="Treinamentos iniciados"
          stroke={VIZ.series[1]}
          strokeWidth={2}
          fill="url(#gradInicios)"
          activeDot={{ r: 4.5, strokeWidth: 2, stroke: '#fff' }}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ---------------------------------------------------------------------------
// Horas de capacitação por mês
// ---------------------------------------------------------------------------

export function HoursChart({
  data,
  height = 240,
}: {
  data: Array<{ label: string; horas: number }>;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
        <CartesianGrid stroke={VIZ.grid} vertical={false} />
        <XAxis dataKey="label" {...axisProps} dy={6} />
        <YAxis {...axisProps} width={46} />
        <Tooltip
          content={<ChartTooltip suffix="h" />}
          cursor={{ fill: 'rgba(37,99,235,0.05)' }}
        />
        <Bar
          dataKey="horas"
          name="Horas de capacitação"
          fill={VIZ.series[0]}
          radius={[4, 4, 0, 0]}
          maxBarSize={26}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ---------------------------------------------------------------------------
// Desempenho por departamento (barras empilhadas horizontais)
// Ordem de empilhamento mantém "Concluído" e "Atrasado" não adjacentes.
// ---------------------------------------------------------------------------

export function DepartmentStackChart({
  data,
  height = 240,
}: {
  data: Array<{
    label: string;
    concluido: number;
    em_andamento: number;
    atrasado: number;
    nao_iniciado: number;
  }>;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 4, bottom: 0 }}
        barSize={22}
      >
        <CartesianGrid stroke={VIZ.grid} horizontal={false} />
        <XAxis type="number" {...axisProps} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="label"
          {...axisProps}
          width={104}
          tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }}
        />
        <Tooltip content={<ChartTooltip total />} cursor={{ fill: 'rgba(15,23,42,0.035)' }} />
        <Legend content={<LegendContent />} />
        <Bar
          dataKey="concluido"
          name="Concluído"
          stackId="a"
          fill={VIZ.status.concluido}
          stroke={VIZ.surface}
          strokeWidth={2}
        />
        <Bar
          dataKey="em_andamento"
          name="Em andamento"
          stackId="a"
          fill={VIZ.status.em_andamento}
          stroke={VIZ.surface}
          strokeWidth={2}
        />
        <Bar
          dataKey="nao_iniciado"
          name="Não iniciado"
          stackId="a"
          fill={VIZ.status.nao_iniciado}
          stroke={VIZ.surface}
          strokeWidth={2}
        />
        <Bar
          dataKey="atrasado"
          name="Atrasado"
          stackId="a"
          fill={VIZ.status.atrasado}
          stroke={VIZ.surface}
          strokeWidth={2}
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ---------------------------------------------------------------------------
// Distribuição de status (rosca)
// ---------------------------------------------------------------------------

export function StatusDonut({
  data,
  height = 236,
  centerLabel,
  centerValue,
}: {
  data: Array<{ name: string; value: number; color: string }>;
  height?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="62%"
            outerRadius="88%"
            paddingAngle={2}
            strokeWidth={2}
            stroke={VIZ.surface}
          >
            {data.map((item) => (
              <Cell key={item.name} fill={item.color} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="text-center">
          <p className="text-[24px] font-extrabold leading-none tracking-tight text-navy-900">
            {centerValue ?? formatNumber(total)}
          </p>
          {centerLabel && (
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              {centerLabel}
            </p>
          )}
        </div>
      </div>
      <div className="mt-2 space-y-1.5">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-3 text-[12.5px]">
            <span className="flex items-center gap-2 text-slate-600">
              <span
                className="h-2 w-2 rounded-[2px]"
                style={{ background: item.color }}
              />
              {item.name}
            </span>
            <span className="font-bold tabular-nums text-navy-900">
              {item.value}
              <span className="ml-1 font-medium text-slate-400">
                ({total ? Math.round((item.value / total) * 100) : 0}%)
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ranking horizontal (treinamentos mais acessados, participação)
// ---------------------------------------------------------------------------

export function RankingBars({
  data,
  height = 268,
  suffix,
  color = VIZ.series[0],
}: {
  data: Array<{ label: string; value: number }>;
  height?: number;
  suffix?: string;
  color?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 38, left: 4, bottom: 0 }}
        barSize={16}
      >
        <CartesianGrid stroke={VIZ.grid} horizontal={false} />
        <XAxis type="number" {...axisProps} hide />
        <YAxis
          type="category"
          dataKey="label"
          tickLine={false}
          axisLine={false}
          width={188}
          tick={{ fill: '#334155', fontSize: 12 }}
        />
        <Tooltip
          content={<ChartTooltip suffix={suffix} />}
          cursor={{ fill: 'rgba(15,23,42,0.035)' }}
        />
        <Bar dataKey="value" name="Total" fill={color} radius={[0, 4, 4, 0]}>
          <LabelList
            dataKey="value"
            position="right"
            className="fill-slate-500"
            style={{ fontSize: 11.5, fontWeight: 700 }}
            formatter={(value: React.ReactNode) => `${value}${suffix ?? ''}`}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ---------------------------------------------------------------------------
// Evolução da taxa de conclusão (linha única)
// ---------------------------------------------------------------------------

export function CompletionRateChart({
  data,
  height = 232,
}: {
  data: Array<{ label: string; taxa: number }>;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 12, right: 16, left: -18, bottom: 0 }}>
        <CartesianGrid stroke={VIZ.grid} vertical={false} />
        <XAxis dataKey="label" {...axisProps} dy={6} />
        <YAxis {...axisProps} width={46} domain={[0, 100]} unit="%" />
        <Tooltip
          content={<ChartTooltip suffix="%" />}
          cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
        />
        <Line
          type="monotone"
          dataKey="taxa"
          name="Taxa de conclusão"
          stroke={VIZ.series[0]}
          strokeWidth={2}
          dot={{ r: 3, strokeWidth: 2, stroke: '#fff', fill: VIZ.series[0] }}
          activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ---------------------------------------------------------------------------
// Participação por departamento (barras verticais, paleta categórica)
// ---------------------------------------------------------------------------

export function ParticipationChart({
  data,
  height = 240,
}: {
  data: Array<{ label: string; value: number; color: string }>;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 18, right: 12, left: -18, bottom: 0 }}>
        <CartesianGrid stroke={VIZ.grid} vertical={false} />
        <XAxis dataKey="label" {...axisProps} dy={6} />
        <YAxis {...axisProps} width={46} unit="%" domain={[0, 100]} />
        <Tooltip
          content={<ChartTooltip suffix="%" />}
          cursor={{ fill: 'rgba(15,23,42,0.035)' }}
        />
        <Bar dataKey="value" name="Participação" radius={[4, 4, 0, 0]} maxBarSize={54}>
          {data.map((item) => (
            <Cell key={item.label} fill={item.color} />
          ))}
          <LabelList
            dataKey="value"
            position="top"
            className="fill-slate-500"
            style={{ fontSize: 11.5, fontWeight: 700 }}
            formatter={(value: React.ReactNode) => `${value}%`}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
