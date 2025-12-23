import * as React from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Loader2,
  Calendar,
  User,
  ShoppingBag,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { api, type Order } from "@/lib/supabase";

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: "待处理", icon: Clock, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  processing: { label: "处理中", icon: Package, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  shipped: { label: "已发货", icon: Truck, color: "bg-cobalt/10 text-cobalt" },
  completed: { label: "已完成", icon: CheckCircle, color: "bg-green-500/10 text-green-600 dark:text-green-400" },
  cancelled: { label: "已取消", icon: XCircle, color: "bg-red-500/10 text-red-600 dark:text-red-400" },
};

const paymentStatusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "待支付", color: "text-amber-600" },
  paid: { label: "已支付", color: "text-green-600" },
  refunded: { label: "已退款", color: "text-red-600" },
};

type OrderFormData = {
  order_number: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  items_count: number;
  status: string;
  payment_status: string;
};

const defaultOrder: OrderFormData = {
  order_number: "",
  customer_name: "",
  customer_email: "",
  total_amount: 0,
  items_count: 1,
  status: "pending",
  payment_status: "pending",
};

// 生成订单号
const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${year}${random}`;
};

export function OrdersPage() {
  const [selectedTab, setSelectedTab] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [editingOrder, setEditingOrder] = React.useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = React.useState<Order | null>(null);
  const [formData, setFormData] = React.useState<OrderFormData>(defaultOrder);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await api.orders.getAll();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrder = () => {
    setEditingOrder(null);
    setFormData({
      ...defaultOrder,
      order_number: generateOrderNumber(),
    });
    setEditDialogOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      order_number: order.order_number,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      total_amount: order.total_amount,
      items_count: order.items_count,
      status: order.status,
      payment_status: order.payment_status,
    });
    setEditDialogOpen(true);
  };

  const handleViewOrder = (order: Order) => {
    setViewingOrder(order);
    setViewDialogOpen(true);
  };

  const handleSaveOrder = async () => {
    if (!formData.customer_name || !formData.customer_email) {
      alert("请填写客户姓名和邮箱");
      return;
    }
    try {
      setSaving(true);
      if (editingOrder) {
        await api.orders.update(editingOrder.id, formData as Partial<Order>);
      } else {
        await api.orders.create(formData as Omit<Order, 'id' | 'created_at' | 'updated_at'>);
      }
      await loadOrders();
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to save order:", error);
      alert("保存失败，请重试");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm("确定要删除这个订单吗？")) return;
    try {
      await api.orders.delete(id);
      await loadOrders();
    } catch (error) {
      console.error("Failed to delete order:", error);
      alert("删除失败，请重试");
    }
  };

  const handleExport = () => {
    const csv = [
      ['订单号', '客户', '邮箱', '金额', '商品数', '状态', '支付状态', '创建时间'].join(','),
      ...filteredOrders.map(order => [
        order.order_number,
        order.customer_name,
        order.customer_email,
        order.total_amount,
        order.items_count,
        statusConfig[order.status]?.label || order.status,
        paymentStatusConfig[order.payment_status]?.label || order.payment_status,
        order.created_at,
      ].join(','))
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedTab === "all" || order.status === selectedTab;
    return matchesSearch && matchesTab;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--accent-primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] font-display">订单管理</h1>
          <p className="text-[var(--foreground-muted)] mt-1 font-sans">管理和跟踪所有订单</p>
        </div>
        <Button className="gap-2" onClick={handleAddOrder}>
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
          <Button variant="outline" className="gap-2" onClick={handleExport}>
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
                const status = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = status.icon;
                const payment = paymentStatusConfig[order.payment_status] || paymentStatusConfig.pending;
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
                      <span className="font-mono text-sm font-medium text-[var(--foreground)]">{order.order_number}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">{order.customer_name}</p>
                        <p className="text-xs text-[var(--foreground-muted)]">{order.customer_email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-sm font-medium text-[var(--foreground)]">¥{Number(order.total_amount).toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-[var(--foreground-muted)]">{order.items_count} 件</span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge className={`gap-1 ${status.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-sm ${payment.color}`}>{payment.label}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-[var(--foreground-muted)]">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString('zh-CN') : '-'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <button 
                          className="p-1.5 rounded-lg hover:bg-[var(--background-muted)] transition-colors"
                          onClick={() => handleViewOrder(order)}
                          title="查看详情"
                        >
                          <Eye className="h-4 w-4 text-[var(--foreground-muted)]" />
                        </button>
                        <button 
                          className="p-1.5 rounded-lg hover:bg-[var(--background-muted)] transition-colors"
                          onClick={() => handleEditOrder(order)}
                          title="编辑订单"
                        >
                          <Edit className="h-4 w-4 text-[var(--foreground-muted)]" />
                        </button>
                        <button 
                          className="p-1.5 rounded-lg hover:bg-[var(--background-muted)] transition-colors"
                          onClick={() => handleDeleteOrder(order.id)}
                          title="删除订单"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="py-12 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto text-[var(--foreground-muted)] mb-4" />
            <p className="text-[var(--foreground-muted)]">暂无订单数据</p>
          </div>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
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
        )}
      </motion.div>

      {/* Edit/Create Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingOrder ? "编辑订单" : "创建订单"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="order_number">订单号</Label>
              <Input
                id="order_number"
                value={formData.order_number}
                onChange={(e) => setFormData({ ...formData, order_number: e.target.value })}
                placeholder="ORD-2024XXX"
                disabled={!!editingOrder}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer_name">客户姓名 *</Label>
              <Input
                id="customer_name"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                placeholder="输入客户姓名"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer_email">客户邮箱 *</Label>
              <Input
                id="customer_email"
                type="email"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                placeholder="customer@example.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total_amount">订单金额 (元)</Label>
                <Input
                  id="total_amount"
                  type="number"
                  value={formData.total_amount}
                  onChange={(e) => setFormData({ ...formData, total_amount: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="items_count">商品数量</Label>
                <Input
                  id="items_count"
                  type="number"
                  value={formData.items_count}
                  onChange={(e) => setFormData({ ...formData, items_count: Number(e.target.value) })}
                  placeholder="1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">订单状态</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
                >
                  <option value="pending">待处理</option>
                  <option value="processing">处理中</option>
                  <option value="shipped">已发货</option>
                  <option value="completed">已完成</option>
                  <option value="cancelled">已取消</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_status">支付状态</Label>
                <select
                  id="payment_status"
                  value={formData.payment_status}
                  onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
                >
                  <option value="pending">待支付</option>
                  <option value="paid">已支付</option>
                  <option value="refunded">已退款</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>取消</Button>
            <Button onClick={handleSaveOrder} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {saving ? "保存中..." : "保存"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Detail Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>订单详情</span>
              {viewingOrder && (
                <Badge className={statusConfig[viewingOrder.status]?.color || ''}>
                  {statusConfig[viewingOrder.status]?.label || viewingOrder.status}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-6 py-4">
              {/* Order Info */}
              <div className="p-4 rounded-lg bg-[var(--background-muted)]">
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingBag className="h-5 w-5 text-[var(--accent-primary)]" />
                  <span className="font-medium">订单信息</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[var(--foreground-muted)]">订单号</span>
                    <p className="font-mono font-medium">{viewingOrder.order_number}</p>
                  </div>
                  <div>
                    <span className="text-[var(--foreground-muted)]">商品数量</span>
                    <p className="font-medium">{viewingOrder.items_count} 件</p>
                  </div>
                  <div>
                    <span className="text-[var(--foreground-muted)]">订单金额</span>
                    <p className="font-mono font-medium text-lg">¥{Number(viewingOrder.total_amount).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[var(--foreground-muted)]">支付状态</span>
                    <p className={`font-medium ${paymentStatusConfig[viewingOrder.payment_status]?.color}`}>
                      {paymentStatusConfig[viewingOrder.payment_status]?.label || viewingOrder.payment_status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="p-4 rounded-lg bg-[var(--background-muted)]">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-5 w-5 text-[var(--accent-primary)]" />
                  <span className="font-medium">客户信息</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground-muted)]">客户姓名</span>
                    <span className="font-medium">{viewingOrder.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground-muted)]">客户邮箱</span>
                    <span className="font-medium">{viewingOrder.customer_email}</span>
                  </div>
                </div>
              </div>

              {/* Timeline Info */}
              <div className="p-4 rounded-lg bg-[var(--background-muted)]">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-5 w-5 text-[var(--accent-primary)]" />
                  <span className="font-medium">时间信息</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground-muted)]">创建时间</span>
                    <span>{viewingOrder.created_at ? new Date(viewingOrder.created_at).toLocaleString('zh-CN') : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground-muted)]">更新时间</span>
                    <span>{viewingOrder.updated_at ? new Date(viewingOrder.updated_at).toLocaleString('zh-CN') : '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>关闭</Button>
            <Button onClick={() => {
              setViewDialogOpen(false);
              if (viewingOrder) handleEditOrder(viewingOrder);
            }}>
              <Edit className="h-4 w-4 mr-2" />
              编辑订单
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default OrdersPage;
