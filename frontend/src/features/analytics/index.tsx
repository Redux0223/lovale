import * as React from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Download,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesChart } from "@/components/charts";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { api } from "@/lib/supabase";

// CSV导出工具函数
const exportToCSV = (data: Record<string, unknown>[], filename: string) => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        const stringValue = String(value ?? '');
        return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

const kpiData = [
  { id: "revenue", label: "总收入", value: "¥2,847,392", change: 12.5, trend: "up", icon: DollarSign },
  { id: "orders", label: "订单数", value: "1,847", change: 8.2, trend: "up", icon: ShoppingCart },
  { id: "customers", label: "新客户", value: "324", change: -2.4, trend: "down", icon: Users },
  { id: "views", label: "页面访问", value: "45.2K", change: 18.7, trend: "up", icon: Eye },
];

const topProducts = [
  { name: "iPhone 15 Pro Max", sales: 234, revenue: 2339766, percentage: 28 },
  { name: "MacBook Pro 14寸", sales: 156, revenue: 2339844, percentage: 24 },
  { name: "AirPods Pro 2", sales: 567, revenue: 1076433, percentage: 18 },
  { name: "Apple Watch S9", sales: 189, revenue: 604611, percentage: 15 },
];

const trafficSources = [
  { source: "直接访问", visits: 12450, percentage: 35, color: "bg-cobalt" },
  { source: "搜索引擎", visits: 9870, percentage: 28, color: "bg-cyan-500" },
  { source: "社交媒体", visits: 6540, percentage: 18, color: "bg-amber-500" },
  { source: "邮件营销", visits: 4320, percentage: 12, color: "bg-vermilion" },
  { source: "其他", visits: 2490, percentage: 7, color: "bg-gray-500" },
];

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = React.useState("7d");
  const [exporting, setExporting] = React.useState(false);

  const handleExportAll = async () => {
    setExporting(true);
    try {
      // 导出订单数据
      const orders = await api.orders.getAll();
      exportToCSV(orders.map(o => ({
        订单号: o.order_number,
        客户: o.customer_name,
        金额: o.total_amount,
        商品数: o.items_count,
        状态: o.status,
        支付状态: o.payment_status,
        创建时间: o.created_at,
      })), '订单数据');

      // 导出客户数据
      const customers = await api.customers.getAll();
      exportToCSV(customers.map(c => ({
        姓名: c.name,
        邮箱: c.email,
        电话: c.phone,
        地区: c.location,
        订单数: c.total_orders,
        消费总额: c.total_spent,
        状态: c.status,
        注册时间: c.created_at,
      })), '客户数据');

      // 导出产品数据
      const products = await api.products.getAll();
      exportToCSV(products.map(p => ({
        产品名称: p.name,
        分类: p.category,
        价格: p.price,
        库存: p.stock,
        状态: p.status,
        创建时间: p.created_at,
      })), '产品数据');

      alert('数据导出成功！已生成3个CSV文件。');
    } catch (error) {
      console.error('Export failed:', error);
      alert('导出失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] font-display">数据分析</h1>
          <p className="text-[var(--foreground-muted)] mt-1 font-sans">深入了解您的业务数据</p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList className="bg-[var(--background-muted)]">
              <TabsTrigger value="24h">24小时</TabsTrigger>
              <TabsTrigger value="7d">7天</TabsTrigger>
              <TabsTrigger value="30d">30天</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" className="gap-2" onClick={handleExportAll} disabled={exporting}>
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {exporting ? "导出中..." : "导出CSV"}
          </Button>
        </div>
      </div>

      <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => (
          <motion.div key={kpi.id} variants={staggerItem} className="bg-[var(--background-card)] rounded-xl border border-[var(--border)] p-5">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-[var(--background-muted)]">
                <kpi.icon className="h-5 w-5 text-[var(--foreground-muted)]" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {kpi.trend === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                {Math.abs(kpi.change)}%
              </div>
            </div>
            <p className="text-sm text-[var(--foreground-muted)] mt-3 font-sans">{kpi.label}</p>
            <p className="text-2xl font-bold text-[var(--foreground)] mt-1 font-display">{kpi.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 bg-[var(--background-card)] rounded-xl border border-[var(--border)] p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-6 font-display">销售趋势</h2>
          <SalesChart height={300} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[var(--background-card)] rounded-xl border border-[var(--border)] p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-6 font-display">流量来源</h2>
          <div className="space-y-4">
            {trafficSources.map((source, index) => (
              <div key={source.source}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--foreground)] font-sans">{source.source}</span>
                  <span className="text-sm text-[var(--foreground-muted)] font-sans">{source.percentage}%</span>
                </div>
                <div className="h-2 bg-[var(--background-muted)] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${source.percentage}%` }} transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }} className={`h-full ${source.color} rounded-full`} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[var(--background-card)] rounded-xl border border-[var(--border)] p-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-6 font-display">热销产品</h2>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={product.name} className="flex items-center gap-4">
              <span className="w-6 text-sm font-medium text-[var(--foreground-muted)]">#{index + 1}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-[var(--foreground)] font-sans">{product.name}</span>
                  <span className="font-mono text-sm text-[var(--foreground)]">¥{(product.revenue / 10000).toFixed(1)}万</span>
                </div>
                <div className="h-2 bg-[var(--background-muted)] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${product.percentage}%` }} transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }} className="h-full bg-[var(--primary)] rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default AnalyticsPage;
