import * as React from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { cn } from "@/lib/utils";

interface SalesDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

interface SalesChartProps {
  data?: SalesDataPoint[];
  className?: string;
  showOrders?: boolean;
  height?: number;
}

// 图表配置常量
const CHART_CONFIG = {
  MARGIN: { top: 5, right: 30, left: 20, bottom: 5 },
  UPDATE_INTERVAL: 1000,
  HOVER_FADE_OPACITY: 0.2,
  HOVER_FOCUSED_STROKE_WIDTH: 4,
  HOVER_DEFAULT_STROKE_WIDTH: 2.5,
};

// 图表颜色 (使用CSS变量 - 大胆纯色)
const CHART_COLORS = {
  revenue: "var(--chart-1)",
  orders: "var(--chart-2)",
  revenueHex: "#2563eb",  // 钴蓝
  ordersHex: "#059669",   // 翡翠绿
};

// 生成模拟数据
function generateMockData(days: number = 30): SalesDataPoint[] {
  const data: SalesDataPoint[] = [];
  const now = new Date();
  let baseRevenue = 50000;
  let baseOrders = 50;

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const variation = 0.7 + Math.random() * 0.6;
    const revenue = Math.round(baseRevenue * variation);
    const orders = Math.round(baseOrders * variation);
    
    data.push({
      date: date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" }),
      revenue,
      orders,
    });

    baseRevenue += (Math.random() - 0.48) * 2000;
    baseOrders += Math.round((Math.random() - 0.48) * 5);
  }

  return data;
}

// 自定义 Tooltip
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--chart-tooltip-bg)] border border-[var(--chart-tooltip-border)] rounded-lg px-4 py-3 shadow-lg"
    >
      <p className="text-sm font-medium text-[var(--chart-tooltip-text)] mb-2">
        {label}
      </p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[var(--foreground-muted)]">
            {entry.name === "revenue" ? "销售额" : "订单数"}:
          </span>
          <span className="font-mono font-medium text-[var(--chart-tooltip-text)]">
            {entry.name === "revenue"
              ? `¥${entry.value.toLocaleString()}`
              : entry.value}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

export function SalesChart({
  data,
  className,
  showOrders = true,
  height = 300,
}: SalesChartProps) {
  const [chartData, setChartData] = React.useState<SalesDataPoint[]>(
    data || generateMockData()
  );
  const [hoveredLine, setHoveredLine] = React.useState<string | null>(null);

  // 实时数据更新 (演示用)
  React.useEffect(() => {
    if (data) return; // 如果传入了数据，不自动更新

    const interval = setInterval(() => {
      setChartData((prev) => {
        const newData = [...prev.slice(1)];
        const lastPoint = prev[prev.length - 1];
        const now = new Date();
        
        const variation = 0.9 + Math.random() * 0.2;
        newData.push({
          date: now.toLocaleDateString("zh-CN", { month: "short", day: "numeric" }),
          revenue: Math.round(lastPoint.revenue * variation),
          orders: Math.round(lastPoint.orders * variation),
        });
        
        return newData;
      });
    }, 5000); // 每5秒更新一次

    return () => clearInterval(interval);
  }, [data]);

  const getLineOpacity = (lineName: string) => {
    if (!hoveredLine) return 1;
    return hoveredLine === lineName ? 1 : CHART_CONFIG.HOVER_FADE_OPACITY;
  };

  const getStrokeWidth = (lineName: string) => {
    if (!hoveredLine) return CHART_CONFIG.HOVER_DEFAULT_STROKE_WIDTH;
    return hoveredLine === lineName
      ? CHART_CONFIG.HOVER_FOCUSED_STROKE_WIDTH
      : CHART_CONFIG.HOVER_DEFAULT_STROKE_WIDTH;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
      className={cn("w-full", className)}
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={CHART_CONFIG.MARGIN}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.revenueHex} stopOpacity={0.3} />
              <stop offset="100%" stopColor={CHART_COLORS.revenueHex} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.ordersHex} stopOpacity={0.3} />
              <stop offset="100%" stopColor={CHART_COLORS.ordersHex} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--chart-grid)"
            opacity={0.5}
          />

          <XAxis
            dataKey="date"
            stroke="var(--chart-axis)"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: "var(--chart-grid)" }}
            tick={{ fill: "var(--foreground-muted)" }}
          />

          <YAxis
            yAxisId="revenue"
            stroke="var(--chart-axis)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--foreground-muted)" }}
            tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}k`}
          />

          {showOrders && (
            <YAxis
              yAxisId="orders"
              orientation="right"
              stroke="var(--chart-axis)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--foreground-muted)" }}
            />
          )}

          <Tooltip content={<CustomTooltip />} />

          <ReferenceLine
            yAxisId="revenue"
            y={chartData.reduce((sum, d) => sum + d.revenue, 0) / chartData.length}
            stroke="var(--chart-reference)"
            strokeDasharray="5 5"
            opacity={0.5}
          />

          <Line
            yAxisId="revenue"
            type="monotone"
            dataKey="revenue"
            name="revenue"
            stroke={CHART_COLORS.revenueHex}
            strokeWidth={getStrokeWidth("revenue")}
            dot={false}
            activeDot={{
              r: 6,
              fill: CHART_COLORS.revenueHex,
              stroke: "var(--background)",
              strokeWidth: 2,
            }}
            opacity={getLineOpacity("revenue")}
            onMouseEnter={() => setHoveredLine("revenue")}
            onMouseLeave={() => setHoveredLine(null)}
            style={{ transition: "all 0.25s ease" }}
          />

          {showOrders && (
            <Line
              yAxisId="orders"
              type="monotone"
              dataKey="orders"
              name="orders"
              stroke={CHART_COLORS.ordersHex}
              strokeWidth={getStrokeWidth("orders")}
              dot={false}
              activeDot={{
                r: 6,
                fill: CHART_COLORS.ordersHex,
                stroke: "var(--background)",
                strokeWidth: 2,
              }}
              opacity={getLineOpacity("orders")}
              onMouseEnter={() => setHoveredLine("orders")}
              onMouseLeave={() => setHoveredLine(null)}
              style={{ transition: "all 0.25s ease" }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export default SalesChart;
