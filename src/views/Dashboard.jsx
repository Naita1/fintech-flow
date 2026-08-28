import React from "react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import SummaryCard from "../components/ui/SummaryCard";
import ProfitLossIndicator from "../components/ui/ProfitLossIndicator";
import ChartCard from "../components/ui/ChartCard";
import { totals, categoriaDist } from "../utils/calculations";
import { fmtBRL } from "../utils/format";
import { CATEGORIA_COR, EMERALD, ROSE } from "../constants/categories";

// Estilização compartilhada de Tooltip com alta performance visual
const tooltipStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)",
  fontSize: "12px",
  fontWeight: "600",
  padding: "8px 12px",
};

export default function Dashboard({ weeks }) {
  const todas = weeks.flatMap((w) => w.transacoes);
  const { entradas, saidas, saldo } = totals(todas);

  const barData = weeks.map((w) => {
    const t = totals(w.transacoes);
    return { periodo: w.label, Entradas: t.entradas, Saídas: t.saidas };
  });

  const lineData = (() => {
    let acumulado = 0;
    return weeks.map((w) => {
      const t = totals(w.transacoes);
      acumulado += t.saldo;
      return { periodo: w.label, Saldo: acumulado };
    });
  })();

  const pieData = categoriaDist(todas);

  const comparacao = [
    { periodo: "1ª Quinzena", ...(() => {
        const t = totals(weeks[0].transacoes.concat(weeks[1].transacoes));
        return { Entradas: t.entradas, Saídas: t.saidas, Saldo: t.saldo };
      })() },
    { periodo: "2ª Quinzena", ...(() => {
        const t = totals(weeks[2].transacoes.concat(weeks[3].transacoes));
        return { Entradas: t.entradas, Saídas: t.saidas, Saldo: t.saldo };
      })() },
  ];

  return (
    <div className="space-y-6 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-300 motion-reduce:animate-none">
      
      {/* Indicador de Lucro / Prejuízo */}
      <div className="w-full">
        <ProfitLossIndicator saldo={saldo} size="lg" />
      </div>

      {/* Cards de Resumo KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <SummaryCard label="Total de Entradas" value={fmtBRL(entradas)} icon={ArrowUpRight} tone="entrada" />
        <SummaryCard label="Total de Saídas" value={fmtBRL(saidas)} icon={ArrowDownRight} tone="saida" />
        <SummaryCard
          label={saldo >= 0 ? "Lucro do Mês" : "Prejuízo do Mês"}
          value={fmtBRL(Math.abs(saldo))}
          icon={saldo >= 0 ? TrendingUp : TrendingDown}
          tone={saldo >= 0 ? "lucro" : "prejuizo"}
        />
        <SummaryCard label="Saldo do Período" value={fmtBRL(saldo)} icon={Wallet} tone="saldo" />
      </div>

      {/* Seção de Gráficos Otimizados */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        
        {/* Gráfico 1: Entradas x Saídas */}
        <ChartCard title="Entradas x Saídas" subtitle="Comparativo semanal do mês atual">
          <div className="w-full h-[260px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="periodo" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={{ stroke: "#cbd5e1" }} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => fmtBRL(v)} contentStyle={tooltipStyle} cursor={{ fill: "rgba(241, 245, 249, 0.6)" }} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: "8px" }} />
                <Bar dataKey="Entradas" fill={EMERALD} radius={[6, 6, 0, 0]} animationDuration={500} />
                <Bar dataKey="Saídas" fill={ROSE} radius={[6, 6, 0, 0]} animationDuration={500} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Gráfico 2: Evolução do Saldo */}
        <ChartCard title="Evolução do Saldo" subtitle="Saldo acumulado semana a semana">
          <div className="w-full h-[260px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="periodo" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={{ stroke: "#cbd5e1" }} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => fmtBRL(v)} contentStyle={tooltipStyle} />
                <Line 
                  type="monotone" 
                  dataKey="Saldo" 
                  stroke="#1e293b" 
                  strokeWidth={2.5} 
                  dot={{ r: 4, fill: "#1e293b", strokeWidth: 2, stroke: "#fff" }} 
                  activeDot={{ r: 6, fill: "#0f172a" }}
                  animationDuration={600} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Gráfico 3: Distribuição dos Gastos */}
        <ChartCard title="Distribuição dos Gastos" subtitle="Saídas por categoria no mês">
          <div className="w-full h-[260px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Pie 
                  data={pieData} 
                  dataKey="valor" 
                  nameKey="categoria" 
                  innerRadius={50} 
                  outerRadius={80} 
                  paddingAngle={3}
                  animationDuration={500}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.categoria} fill={(CATEGORIA_COR[entry.categoria] || {}).hex || "#94a3b8"} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => fmtBRL(v)} contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Gráfico 4: Comparação entre Períodos */}
        <ChartCard title="Comparação entre Períodos" subtitle="1ª quinzena x 2ª quinzena">
          <div className="w-full h-[260px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparacao} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="periodo" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={{ stroke: "#cbd5e1" }} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => fmtBRL(v)} contentStyle={tooltipStyle} cursor={{ fill: "rgba(241, 245, 249, 0.6)" }} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: "8px" }} />
                <Bar dataKey="Entradas" fill={EMERALD} radius={[6, 6, 0, 0]} animationDuration={500} />
                <Bar dataKey="Saídas" fill={ROSE} radius={[6, 6, 0, 0]} animationDuration={500} />
                <Bar dataKey="Saldo" fill="#1e293b" radius={[6, 6, 0, 0]} animationDuration={500} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

      </div>
    </div>
  );
}