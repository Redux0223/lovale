import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "仪表盘", icon: LayoutDashboard, href: "/" },
  { id: "orders", label: "订单管理", icon: ShoppingCart, href: "/orders", badge: 12 },
  { id: "products", label: "产品管理", icon: Package, href: "/products" },
  { id: "customers", label: "客户管理", icon: Users, href: "/customers" },
  { id: "analytics", label: "数据分析", icon: BarChart3, href: "/analytics" },
  { id: "ai", label: "AI 助手", icon: MessageSquare, href: "/ai" },
  { id: "settings", label: "系统设置", icon: Settings, href: "/settings" },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  activeId?: string;
  onNavigate?: (id: string) => void;
}

export function Sidebar({ 
  collapsed = false, 
  onToggle,
  activeId = "dashboard",
  onNavigate 
}: SidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "h-full bg-card border-r border-border flex flex-col",
        "transition-colors duration-200"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <motion.div
          initial={false}
          animate={{ opacity: collapsed ? 0 : 1 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center">
            <span style={{ color: 'var(--accent-primary-foreground)' }} className="font-bold text-sm">L</span>
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-lg text-foreground">
              Lovale
            </span>
          )}
        </motion.div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-state-hover transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-foreground-muted" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-foreground-muted" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.id === activeId;
          const Icon = item.icon;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "text-sm font-medium",
                isActive
                  ? "bg-accent-primary shadow-md"
                  : "text-foreground-muted hover:bg-state-hover hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" style={isActive ? { color: 'var(--accent-primary-foreground)' } : undefined} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left" style={isActive ? { color: 'var(--accent-primary-foreground)' } : undefined}>{item.label}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        "px-2 py-0.5 text-xs rounded-full",
                        isActive
                          ? "bg-black/20"
                          : "bg-accent-error text-white"
                      )}
                    style={isActive ? { color: 'var(--accent-primary-foreground)' } : undefined}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-lg bg-background-muted",
          collapsed && "justify-center"
        )}>
          <div className="w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center flex-shrink-0">
            <span style={{ color: 'var(--accent-primary-foreground)' }} className="text-sm font-medium">A</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Admin</p>
              <p className="text-xs text-foreground-muted truncate">admin@saleor.io</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

export default Sidebar;
