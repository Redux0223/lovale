import * as React from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  Package,
  Clock
} from "lucide-react";
import { KPICard, SalesChart } from "@/components/charts";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { api, type Order } from "@/lib/supabase";

// 格式化时间差
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "刚刚";
  if (diffMins < 60) return `${diffMins}分钟前`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}小时前`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}天前`;
}

const statusColors: Record<string, string> = {
  pending: "bg-accent-warning/10 text-accent-warning",
  processing: "bg-accent-primary/10 text-accent-primary",
  shipped: "bg-cobalt/10 text-cobalt",
  completed: "bg-accent-success/10 text-accent-success",
  cancelled: "bg-accent-error/10 text-accent-error",
};

const statusLabels: Record<string, string> = {
  pending: "待处理",
  processing: "处理中",
  shipped: "已发货",
  completed: "已完成",
  cancelled: "已取消",
};

export function DashboardPage() {
  const [kpiData, setKpiData] = React.useState([
    { id: "revenue", title: "总销售额", value: 0, trend: 12.5, trendType: "up" as const, icon: DollarSign, format: "currency" as const },
    { id: "orders", title: "订单数量", value: 0, trend: 8.2, trendType: "up" as const, icon: ShoppingCart, format: "number" as const },
    { id: "customers", title: "活跃客户", value: 0, trend: 5.3, trendType: "up" as const, icon: Users, format: "compact" as const },
    { id: "conversion", title: "转化率", value: 3.24, trend: 0.8, trendType: "up" as const, icon: TrendingUp, format: "percent" as const },
  ]);
  const [recentOrders, setRecentOrders] = React.useState<Order[]>([]);
  const [, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        // 获取KPI数据
        const kpis = await api.metrics.getKPIs();
        setKpiData(prev => prev.map(kpi => {
          if (kpi.id === "revenue") return { ...kpi, value: kpis.totalRevenue };
          if (kpi.id === "orders") return { ...kpi, value: kpis.totalOrders };
          if (kpi.id === "customers") return { ...kpi, value: kpis.totalCustomers };
          if (kpi.id === "conversion") return { ...kpi, value: kpis.conversionRate };
          return kpi;
        }));

        // 获取最近订单
        const orders = await api.orders.getRecent(5);
        setRecentOrders(orders);
      } catch (error) {
        console.error("获取数据失败:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] font-display">
            仪表盘
          </h1>
          <p className="text-[var(--foreground-muted)] mt-1 font-sans">
            欢迎回来！以下是您店铺的概况。
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
          <Clock className="h-4 w-4" />
          <span>最后更新: 刚刚</span>
        </div>
      </div>

      {/* KPI Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {kpiData.map((kpi, index) => (
          <motion.div key={kpi.id} variants={staggerItem}>
            <KPICard
              title={kpi.title}
              value={kpi.value}
              trend={kpi.trend}
              trendType={kpi.trendType}
              icon={kpi.icon}
              format={kpi.format}
              delay={index}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid - Bento Style */}
      <div className="grid grid-cols-12 gap-4">
        {/* Sales Chart - Large */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="col-span-12 lg:col-span-8 bg-[var(--background-card)] rounded-xl border border-[var(--border)] p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] font-display">
              销售趋势
            </h2>
            <div className="flex gap-2">
              {["7天", "30天", "90天"].map((period) => (
                <button
                  key={period}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--background-muted)] text-[var(--foreground-muted)] hover:bg-[var(--state-hover)] hover:text-[var(--foreground)] transition-colors"
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          
          {/* Sales Chart */}
          <SalesChart height={280} />
        </motion.div>

        {/* Top Products - Side Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="col-span-12 lg:col-span-4 bg-[var(--background-card)] rounded-xl border border-[var(--border)] p-6"
        >
          <h2 className="text-lg font-semibold text-[var(--foreground)] font-display mb-4">
            热销产品
          </h2>
          <div className="space-y-4">
            {[
              { name: "iPhone 15 Pro Max", sales: 234, revenue: 280000 },
              { name: "MacBook Pro 14寸", sales: 156, revenue: 312000 },
              { name: "AirPods Pro 2", sales: 423, revenue: 84600 },
              { name: "Apple Watch S9", sales: 189, revenue: 56700 },
            ].map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-[var(--background-muted)] hover:bg-[var(--state-hover)] transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-accent-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--foreground)] truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-[var(--foreground-muted)]">
                    {product.sales} 销量
                  </p>
                </div>
                <span className="text-sm font-medium text-[var(--foreground)] font-mono">
                  ¥{(product.revenue / 10000).toFixed(1)}万
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Orders - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="col-span-12 bg-[var(--background-card)] rounded-xl border border-[var(--border)] p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)] font-display">
              最近订单
            </h2>
            <button className="text-sm text-accent-primary hover:underline">
              查看全部 →
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-3 px-4 text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    订单号
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    客户
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    金额
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    状态
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                    时间
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.05 }}
                    className="border-b border-[var(--border)] hover:bg-[var(--state-hover)] transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-[var(--foreground)] font-mono">
                        {order.order_number}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-[var(--foreground)]">{order.customer_name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-[var(--foreground)] font-mono">
                        ¥{Number(order.total_amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusColors[order.status] || statusColors.pending
                        }`}
                      >
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-[var(--foreground-muted)]">{formatTimeAgo(order.created_at)}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default DashboardPage;
