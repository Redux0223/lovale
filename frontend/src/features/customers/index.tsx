import * as React from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  TrendingUp,
  User,
  UserCheck,
  UserX,
  Loader2,
  Edit,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { api, type Customer } from "@/lib/supabase";

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  active: { label: "活跃", icon: UserCheck, color: "bg-green-500/10 text-green-600 dark:text-green-400" },
  vip: { label: "VIP", icon: TrendingUp, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  inactive: { label: "不活跃", icon: UserX, color: "bg-gray-500/10 text-gray-600 dark:text-gray-400" },
  new: { label: "新客户", icon: User, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
};

type CustomerFormData = {
  name: string;
  email: string;
  phone: string;
  location: string;
  status: string;
  avatar: string;
  total_orders: number;
  total_spent: number;
};

const defaultCustomer: CustomerFormData = {
  name: "",
  email: "",
  phone: "",
  location: "",
  status: "new",
  avatar: "",
  total_orders: 0,
  total_spent: 0,
};

export function CustomersPage() {
  const [selectedTab, setSelectedTab] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingCustomer, setEditingCustomer] = React.useState<Customer | null>(null);
  const [formData, setFormData] = React.useState<CustomerFormData>(defaultCustomer);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await api.customers.getAll();
      setCustomers(data);
    } catch (error) {
      console.error("Failed to load customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setFormData(defaultCustomer);
    setDialogOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || "",
      location: customer.location || "",
      status: customer.status,
      avatar: customer.avatar || "",
      total_orders: customer.total_orders,
      total_spent: customer.total_spent,
    });
    setDialogOpen(true);
  };

  const handleSaveCustomer = async () => {
    if (!formData.name || !formData.email) {
      alert("请输入客户姓名和邮箱");
      return;
    }
    try {
      setSaving(true);
      if (editingCustomer) {
        await api.customers.update(editingCustomer.id, formData as Partial<Customer>);
      } else {
        await api.customers.create(formData as Omit<Customer, 'id' | 'created_at' | 'updated_at'>);
      }
      await loadCustomers();
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to save customer:", error);
      alert("保存失败，请重试");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm("确定要删除这个客户吗？")) return;
    try {
      await api.customers.delete(id);
      await loadCustomers();
    } catch (error) {
      console.error("Failed to delete customer:", error);
      alert("删除失败，请重试");
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedTab === "all" || customer.status === selectedTab;
    return matchesSearch && matchesTab;
  });

  const stats = [
    { label: "总客户数", value: customers.length, icon: User },
    { label: "活跃客户", value: customers.filter(c => c.status === "active" || c.status === "vip").length, icon: UserCheck },
    { label: "VIP客户", value: customers.filter(c => c.status === "vip").length, icon: TrendingUp },
    { label: "总消费额", value: `¥${(customers.reduce((a, c) => a + Number(c.total_spent || 0), 0) / 10000).toFixed(1)}万`, icon: ShoppingBag },
  ];

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
          <h1 className="text-2xl font-bold text-[var(--foreground)] font-display">客户管理</h1>
          <p className="text-[var(--foreground-muted)] mt-1 font-sans">管理您的客户关系</p>
        </div>
        <Button className="gap-2" onClick={handleAddCustomer}>
          <Plus className="h-4 w-4" />
          <span>添加客户</span>
        </Button>
      </div>

      {/* Stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={staggerItem}
            className="bg-[var(--background-card)] rounded-xl border border-[var(--border)] p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--foreground-muted)] font-sans">{stat.label}</span>
              <stat.icon className="h-4 w-4 text-[var(--foreground-muted)]" />
            </div>
            <p className="mt-2 text-2xl font-bold text-[var(--foreground)] font-display">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--foreground-muted)]" />
          <Input
            placeholder="搜索客户姓名、邮箱..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          筛选
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="bg-[var(--background-muted)]">
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="active">活跃</TabsTrigger>
          <TabsTrigger value="vip">VIP</TabsTrigger>
          <TabsTrigger value="inactive">不活跃</TabsTrigger>
          <TabsTrigger value="new">新客户</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Customer List */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filteredCustomers.map((customer) => {
          const status = statusConfig[customer.status] || statusConfig.active;
          const StatusIcon = status.icon;
          return (
            <motion.div
              key={customer.id}
              variants={staggerItem}
              className="bg-[var(--background-card)] rounded-xl border border-[var(--border)] p-5 hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent-primary)] flex items-center justify-center text-lg font-bold" style={{ color: 'var(--accent-primary-foreground)' }}>
                    {customer.avatar || customer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-[var(--foreground)]">{customer.name}</h3>
                    <Badge className={`${status.color} mt-1`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    className="p-1.5 rounded-lg hover:bg-[var(--state-hover)]"
                    onClick={() => handleEditCustomer(customer)}
                  >
                    <Edit className="h-4 w-4 text-[var(--foreground-muted)]" />
                  </button>
                  <button 
                    className="p-1.5 rounded-lg hover:bg-[var(--state-hover)]"
                    onClick={() => handleDeleteCustomer(customer.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-[var(--state-hover)]">
                    <MoreHorizontal className="h-4 w-4 text-[var(--foreground-muted)]" />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{customer.email}</span>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
                    <Phone className="h-4 w-4" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                {customer.location && (
                  <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{customer.location}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between text-sm">
                <div>
                  <span className="text-[var(--foreground-muted)]">订单: </span>
                  <span className="font-medium text-[var(--foreground)]">{customer.total_orders}</span>
                </div>
                <div>
                  <span className="text-[var(--foreground-muted)]">消费: </span>
                  <span className="font-mono font-medium text-[var(--foreground)]">¥{Number(customer.total_spent || 0).toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCustomer ? "编辑客户" : "添加客户"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">客户姓名 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="输入客户姓名"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱 *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="customer@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">电话</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="138****1234"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">地址</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="北京市朝阳区"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">状态</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
              >
                <option value="new">新客户</option>
                <option value="active">活跃</option>
                <option value="vip">VIP</option>
                <option value="inactive">不活跃</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={handleSaveCustomer} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {saving ? "保存中..." : "保存"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CustomersPage;
