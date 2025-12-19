import * as React from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  // Trash2,
  ChevronLeft,
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { staggerContainer, staggerItem } from "@/lib/animations";

const orders = [
  { id: "ORD-2024001", customer: "张三", email: "zhangsan@example.com", amount: 2599, items: 3, status: "pending", date: "2024-12-19", payment: "已支付" },
  { id: "ORD-2024002", customer: "李四", email: "lisi@example.com", amount: 1299, items: 1, status: "processing", date: "2024-12-19", payment: "已支付" },
  { id: "ORD-2024003", customer: "王五", email: "wangwu@example.com", amount: 4599, items: 2, status: "shipped", date: "2024-12-18", payment: "已支付" },
  { id: "ORD-2024004", customer: "赵六", email: "zhaoliu@example.com", amount: 899, items: 1, status: "completed", date: "2024-12-18", payment: "已支付" },
  { id: "ORD-2024005", customer: "钱七", email: "qianqi@example.com", amount: 3299, items: 4, status: "cancelled", date: "2024-12-17", payment: "已退款" },
  { id: "ORD-2024006", customer: "孙八", email: "sunba@example.com", amount: 1899, items: 2, status: "pending", date: "2024-12-17", payment: "待支付" },
  { id: "ORD-2024007", customer: "周九", email: "zhoujiu@example.com", amount: 5999, items: 1, status: "completed", date: "2024-12-16", payment: "已支付" },
  { id: "ORD-2024008", customer: "吴十", email: "wushi@example.com", amount: 799, items: 2, status: "processing", date: "2024-12-16", payment: "已支付" },
];

const statusConfig = {
  pending: { label: "待处理", icon: Clock, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  processing: { label: "处理中", icon: Package, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  shipped: { label: "已发货", icon: Truck, color: "bg-cobalt/10 text-cobalt" },
  completed: { label: "已完成", icon: CheckCircle, color: "bg-green-500/10 text-green-600 dark:text-green-400" },
  cancelled: { label: "已取消", icon: XCircle, color: "bg-red-500/10 text-red-600 dark:text-red-400" },
};

export function OrdersPage() {
  const [selectedTab, setSelectedTab] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedTab === "all" || order.status === selectedTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] font-display">订单管理</h1>
          <p className="text-[var(--foreground-muted)] mt-1 font-sans">管理和跟踪所有订单</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          创建订单
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--foreground-muted)]" />
          <Input
            placeholder="搜索订单号、客户名..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            筛选
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            导出
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="bg-[var(--background-muted)]">
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="pending">待处理</TabsTrigger>
          <TabsTrigger value="processing">处理中</TabsTrigger>
          <TabsTrigger value="shipped">已发货</TabsTrigger>
          <TabsTrigger value="completed">已完成</TabsTrigger>
          <TabsTrigger value="cancelled">已取消</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Orders Table */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="bg-[var(--background-card)] rounded-xl border border-[var(--border)] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-4 px-6 text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">
                  <input type="checkbox" className="rounded border-[var(--border)]" />
                </th>
                <th className="text-left py-4 px-6 text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">订单号</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">客户</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">金额</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">商品数</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">状态</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">支付</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">日期</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const status = statusConfig[order.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;
                return (
                  <motion.tr
                    key={order.id}
                    variants={staggerItem}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--state-hover)] transition-colors"
                  >
                    <td className="py-4 px-6">
                      <input type="checkbox" className="rounded border-[var(--border)]" />
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-sm font-medium text-[var(--foreground)]">{order.id}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">{order.customer}</p>
                        <p className="text-xs text-[var(--foreground-muted)]">{order.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-sm font-medium text-[var(--foreground)]">¥{order.amount.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-[var(--foreground-muted)]">{order.items} 件</span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge className={`gap-1 ${status.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-[var(--foreground-muted)]">{order.payment}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-[var(--foreground-muted)]">{order.date}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-[var(--background-muted)] transition-colors">
                          <Eye className="h-4 w-4 text-[var(--foreground-muted)]" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-[var(--background-muted)] transition-colors">
                          <Edit className="h-4 w-4 text-[var(--foreground-muted)]" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-[var(--background-muted)] transition-colors">
                          <MoreHorizontal className="h-4 w-4 text-[var(--foreground-muted)]" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border)]">
          <p className="text-sm text-[var(--foreground-muted)]">
            显示 1-{filteredOrders.length} 共 {filteredOrders.length} 条
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              上一页
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              下一页
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default OrdersPage;
