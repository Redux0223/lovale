import * as React from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  Grid3X3,
  List,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { api, type Product } from "@/lib/supabase";

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: "在售", color: "bg-green-500/10 text-green-600 dark:text-green-400" },
  out_of_stock: { label: "缺货", color: "bg-red-500/10 text-red-600 dark:text-red-400" },
  inactive: { label: "下架", color: "bg-gray-500/10 text-gray-600 dark:text-gray-400" },
};

type ProductFormData = {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  status: string;
  image_url: string;
};

const defaultProduct: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  category: "",
  stock: 0,
  status: "active",
  image_url: "",
};

export function ProductsPage() {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [formData, setFormData] = React.useState<ProductFormData>(defaultProduct);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.products.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData(defaultProduct);
    setDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      category: product.category || "",
      stock: product.stock,
      status: product.status,
      image_url: product.image_url || "",
    });
    setDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!formData.name) {
      alert("请输入产品名称");
      return;
    }
    try {
      setSaving(true);
      if (editingProduct) {
        await api.products.update(editingProduct.id, formData as Partial<Product>);
      } else {
        await api.products.create(formData as Omit<Product, 'id' | 'created_at' | 'updated_at'>);
      }
      await loadProducts();
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("保存失败，请重试");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("确定要删除这个产品吗？")) return;
    try {
      await api.products.delete(id);
      await loadProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("删除失败，请重试");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(products.map((p) => p.category).filter(Boolean))];

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
          <h1 className="text-2xl font-bold text-[var(--foreground)] font-display">产品管理</h1>
          <p className="text-[var(--foreground-muted)] mt-1 font-sans">管理您的产品目录</p>
        </div>
        <Button className="gap-2" onClick={handleAddProduct}>
          <Plus className="h-4 w-4" />
          添加产品
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--foreground-muted)]" />
          <Input
            placeholder="搜索产品名称..."
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
          <div className="flex border border-[var(--border)] rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "hover:bg-[var(--state-hover)]"}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "hover:bg-[var(--state-hover)]"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="bg-[var(--background-muted)]">
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {cat === "all" ? "全部" : cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Products Grid/List */}
      {viewMode === "grid" ? (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filteredProducts.map((product) => {
            const status = statusConfig[product.status] || statusConfig.active;
            return (
              <motion.div
                key={product.id}
                variants={staggerItem}
                className="bg-[var(--background-card)] rounded-xl border border-[var(--border)] overflow-hidden hover:shadow-lg transition-all group"
              >
                <div className="aspect-square relative overflow-hidden bg-[var(--background-muted)]">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--foreground-muted)]">
                      无图片
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Badge className={status.color}>{status.label}</Badge>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors">
                      <Eye className="h-4 w-4 text-gray-700" />
                    </button>
                    <button 
                      className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit className="h-4 w-4 text-gray-700" />
                    </button>
                    <button 
                      className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-[var(--foreground)] truncate">{product.name}</h3>
                      <p className="text-xs text-[var(--foreground-muted)] mt-0.5">{product.category}</p>
                    </div>
                    <button className="p-1 hover:bg-[var(--state-hover)] rounded">
                      <MoreHorizontal className="h-4 w-4 text-[var(--foreground-muted)]" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
                    <span className="font-mono font-semibold text-[var(--foreground)]">¥{Number(product.price).toLocaleString()}</span>
                    <span className="text-sm text-[var(--foreground-muted)]">库存: {product.stock}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="bg-[var(--background-card)] rounded-xl border border-[var(--border)] overflow-hidden"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-4 px-6 text-xs font-medium text-[var(--foreground-muted)] uppercase">产品</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-[var(--foreground-muted)] uppercase">分类</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-[var(--foreground-muted)] uppercase">价格</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-[var(--foreground-muted)] uppercase">库存</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-[var(--foreground-muted)] uppercase">状态</th>
                <th className="text-left py-4 px-6 text-xs font-medium text-[var(--foreground-muted)] uppercase">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const status = statusConfig[product.status] || statusConfig.active;
                return (
                  <motion.tr
                    key={product.id}
                    variants={staggerItem}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--state-hover)] transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-[var(--background-muted)] flex items-center justify-center text-xs text-[var(--foreground-muted)]">无</div>
                        )}
                        <span className="font-medium text-[var(--foreground)]">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-[var(--foreground-muted)]">{product.category || "-"}</td>
                    <td className="py-4 px-6 font-mono font-medium text-[var(--foreground)]">¥{Number(product.price).toLocaleString()}</td>
                    <td className="py-4 px-6 text-sm text-[var(--foreground-muted)]">{product.stock}</td>
                    <td className="py-4 px-6"><Badge className={status.color}>{status.label}</Badge></td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-[var(--background-muted)]"><Eye className="h-4 w-4 text-[var(--foreground-muted)]" /></button>
                        <button className="p-1.5 rounded-lg hover:bg-[var(--background-muted)]" onClick={() => handleEditProduct(product)}><Edit className="h-4 w-4 text-[var(--foreground-muted)]" /></button>
                        <button className="p-1.5 rounded-lg hover:bg-[var(--background-muted)]" onClick={() => handleDeleteProduct(product.id)}><Trash2 className="h-4 w-4 text-red-500" /></button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "编辑产品" : "添加产品"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">产品名称 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="输入产品名称"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">分类</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="如：手机、电脑、配件"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">价格 (元)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">库存</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">状态</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
              >
                <option value="active">在售</option>
                <option value="inactive">下架</option>
                <option value="out_of_stock">缺货</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">图片链接</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">描述</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="产品描述..."
                className="w-full h-20 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={handleSaveProduct} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {saving ? "保存中..." : "保存"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProductsPage;
