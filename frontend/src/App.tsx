import * as React from "react";
import { DashboardLayout } from "@/components/layout";
import { DashboardPage } from "@/features/dashboard";
import { OrdersPage } from "@/features/orders";
import { ProductsPage } from "@/features/products";
import { CustomersPage } from "@/features/customers";
import { AnalyticsPage } from "@/features/analytics";
import { AIAssistantPage } from "@/features/ai-assistant";
import { SettingsPage } from "@/features/settings";
import { LoginPage, RegisterPage } from "@/features/auth";
import { AuthProvider, useAuth } from "@/lib/auth";

// 路由类型
type Route = "login" | "register" | "dashboard" | "orders" | "products" | "customers" | "analytics" | "ai" | "settings";

// 简单的路由解析
function getRouteFromPath(): Route {
  const path = window.location.pathname;
  if (path === "/login") return "login";
  if (path === "/register") return "register";
  if (path === "/orders") return "orders";
  if (path === "/products") return "products";
  if (path === "/customers") return "customers";
  if (path === "/analytics") return "analytics";
  if (path === "/ai") return "ai";
  if (path === "/settings") return "settings";
  return "dashboard";
}

// 主应用内容
function AppContent() {
  const { user, loading } = useAuth();
  const [currentRoute, setCurrentRoute] = React.useState<Route>(getRouteFromPath);

  // 监听路由变化
  React.useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getRouteFromPath());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // 导航函数
  const navigate = (route: Route) => {
    const path = route === "dashboard" ? "/" : `/${route}`;
    window.history.pushState({}, "", path);
    setCurrentRoute(route);
  };

  // 加载状态
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-accent-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-foreground-muted">加载中...</p>
        </div>
      </div>
    );
  }

  // 未登录时显示登录/注册页面
  if (!user) {
    if (currentRoute === "register") {
      return <RegisterPage />;
    }
    return <LoginPage />;
  }

  // 已登录用户访问登录/注册页面时重定向到仪表盘
  if (currentRoute === "login" || currentRoute === "register") {
    navigate("dashboard");
    return null;
  }

  // 主应用布局
  return (
    <DashboardLayout activeNav={currentRoute} onNavigate={(id) => navigate(id as Route)}>
      {currentRoute === "dashboard" && <DashboardPage />}
      {currentRoute === "orders" && <OrdersPage />}
      {currentRoute === "products" && <ProductsPage />}
      {currentRoute === "customers" && <CustomersPage />}
      {currentRoute === "analytics" && <AnalyticsPage />}
      {currentRoute === "ai" && <AIAssistantPage />}
      {currentRoute === "settings" && <SettingsPage />}
    </DashboardLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
