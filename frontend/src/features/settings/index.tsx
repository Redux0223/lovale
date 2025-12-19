import * as React from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Key,
  Mail,
  Smartphone,
  Save,
  Camera,
  LogOut,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useAuth } from "@/lib/auth";
import { settingsApi, type UserSettings } from "@/lib/supabase";

const settingsSections = [
  { id: "profile", label: "个人资料", icon: User },
  { id: "notifications", label: "通知设置", icon: Bell },
  { id: "security", label: "安全设置", icon: Shield },
  { id: "appearance", label: "外观主题", icon: Palette },
  { id: "language", label: "语言地区", icon: Globe },
  { id: "billing", label: "账单支付", icon: CreditCard },
];

export function SettingsPage() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = React.useState("profile");
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [settings, setSettings] = React.useState<Partial<UserSettings>>({
    full_name: "",
    phone: "",
    language: "zh-CN",
    timezone: "Asia/Shanghai",
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
  });

  // 加载用户设置
  React.useEffect(() => {
    if (user?.id) {
      loadSettings();
    }
  }, [user?.id]);

  const loadSettings = async () => {
    if (!user?.id) return;
    try {
      const data = await settingsApi.get(user.id);
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  // 保存设置
  const handleSaveSettings = async () => {
    if (!user?.id) return;
    setSaving(true);
    setSaved(false);
    try {
      await settingsApi.upsert(user.id, settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("保存失败，请重试");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/login";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] font-display">系统设置</h1>
        <p className="text-[var(--foreground-muted)] mt-1 font-sans">管理您的账户和系统偏好</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="lg:col-span-1 space-y-1">
          {settingsSections.map((section) => (
            <motion.button
              key={section.id}
              variants={staggerItem}
              onClick={() => setActiveTab(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                activeTab === section.id
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "hover:bg-[var(--state-hover)] text-[var(--foreground)]"
              }`}
            >
              <section.icon className="h-5 w-5" />
              <span className="font-medium font-sans">{section.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[var(--background-card)] rounded-xl border border-[var(--border)] p-6"
          >
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-[var(--foreground)] font-display">个人资料</h2>
                
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-3xl font-bold">
                      {settings.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 rounded-full bg-[var(--background)] border border-[var(--border)] hover:bg-[var(--state-hover)] transition-colors">
                      <Camera className="h-4 w-4 text-[var(--foreground)]" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--foreground)] font-sans">{settings.full_name || '未设置姓名'}</h3>
                    <p className="text-sm text-[var(--foreground-muted)] font-sans">{user?.email}</p>
                    <Button variant="outline" size="sm" className="mt-2">更换头像</Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">姓名</Label>
                    <Input 
                      id="fullName" 
                      value={settings.full_name || ''} 
                      onChange={(e) => setSettings({ ...settings, full_name: e.target.value })}
                      placeholder="输入您的姓名"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">手机号码</Label>
                    <Input 
                      id="phone" 
                      value={settings.phone || ''} 
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      placeholder="输入您的手机号码"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">邮箱地址</Label>
                    <Input id="email" type="email" value={user?.email || ''} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">语言</Label>
                    <select
                      id="language"
                      value={settings.language || 'zh-CN'}
                      onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
                    >
                      <option value="zh-CN">简体中文</option>
                      <option value="en-US">English</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  {saved && (
                    <span className="flex items-center gap-1 text-green-600">
                      <Check className="h-4 w-4" />
                      已保存
                    </span>
                  )}
                  <Button className="gap-2" onClick={handleSaveSettings} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? '保存中...' : '保存更改'}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-[var(--foreground)] font-display">通知设置</h2>
                
                <div className="space-y-4">
                  {[
                    { icon: Mail, title: "邮件通知", desc: "接收订单更新、促销活动等邮件", enabled: true },
                    { icon: Smartphone, title: "推送通知", desc: "接收实时订单和库存预警", enabled: true },
                    { icon: Bell, title: "系统通知", desc: "接收系统更新和维护通知", enabled: false },
                  ].map((item) => (
                    <div key={item.title} className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)]">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-[var(--background-muted)]">
                          <item.icon className="h-5 w-5 text-[var(--foreground-muted)]" />
                        </div>
                        <div>
                          <p className="font-medium text-[var(--foreground)] font-sans">{item.title}</p>
                          <p className="text-sm text-[var(--foreground-muted)] font-sans">{item.desc}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                        <div className="w-11 h-6 bg-[var(--background-muted)] peer-focus:ring-2 peer-focus:ring-[var(--ring)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-[var(--foreground)] font-display">安全设置</h2>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-[var(--border)]">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 rounded-lg bg-[var(--background-muted)]">
                        <Key className="h-5 w-5 text-[var(--foreground-muted)]" />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--foreground)] font-sans">修改密码</p>
                        <p className="text-sm text-[var(--foreground-muted)] font-sans">上次修改于 30 天前</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>当前密码</Label>
                        <Input type="password" placeholder="请输入当前密码" />
                      </div>
                      <div className="space-y-2">
                        <Label>新密码</Label>
                        <Input type="password" placeholder="请输入新密码" />
                      </div>
                      <div className="space-y-2">
                        <Label>确认新密码</Label>
                        <Input type="password" placeholder="请再次输入新密码" />
                      </div>
                      <Button>更新密码</Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-[var(--border)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-[var(--background-muted)]">
                          <Shield className="h-5 w-5 text-[var(--foreground-muted)]" />
                        </div>
                        <div>
                          <p className="font-medium text-[var(--foreground)] font-sans">双重认证</p>
                          <p className="text-sm text-[var(--foreground-muted)] font-sans">为您的账户添加额外安全保护</p>
                        </div>
                      </div>
                      <Button variant="outline">启用</Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-red-500/10">
                          <LogOut className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                          <p className="font-medium text-[var(--foreground)] font-sans">退出登录</p>
                          <p className="text-sm text-[var(--foreground-muted)] font-sans">当前登录：{user?.email}</p>
                        </div>
                      </div>
                      <Button variant="destructive" onClick={handleLogout}>退出</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-[var(--foreground)] font-display">外观主题</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: "light", label: "浅色模式", bg: "bg-white", border: "border-gray-200" },
                    { id: "dark", label: "深色模式", bg: "bg-gray-900", border: "border-gray-700" },
                    { id: "system", label: "跟随系统", bg: "bg-gradient-to-r from-white to-gray-900", border: "border-gray-400" },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      className="p-4 rounded-xl border-2 border-[var(--border)] hover:border-[var(--primary)] transition-colors"
                    >
                      <div className={`h-20 rounded-lg ${theme.bg} ${theme.border} border mb-3`} />
                      <p className="font-medium text-[var(--foreground)] font-sans">{theme.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "language" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-[var(--foreground)] font-display">语言和地区</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>显示语言</Label>
                    <select className="w-full h-10 px-3 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]">
                      <option value="zh-CN">简体中文</option>
                      <option value="zh-TW">繁體中文</option>
                      <option value="en-US">English (US)</option>
                      <option value="ja-JP">日本語</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>时区</Label>
                    <select className="w-full h-10 px-3 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]">
                      <option value="Asia/Shanghai">中国标准时间 (GMT+8)</option>
                      <option value="Asia/Tokyo">日本标准时间 (GMT+9)</option>
                      <option value="America/New_York">美国东部时间 (GMT-5)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>货币单位</Label>
                    <select className="w-full h-10 px-3 rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]">
                      <option value="CNY">人民币 (¥)</option>
                      <option value="USD">美元 ($)</option>
                      <option value="EUR">欧元 (€)</option>
                      <option value="JPY">日元 (¥)</option>
                    </select>
                  </div>
                </div>

                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  保存设置
                </Button>
              </div>
            )}

            {activeTab === "billing" && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-[var(--foreground)] font-display">账单与支付</h2>
                
                <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background-muted)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[var(--foreground-muted)] font-sans">当前套餐</p>
                      <p className="text-xl font-bold text-[var(--foreground)] font-display">专业版</p>
                      <p className="text-sm text-[var(--foreground-muted)] mt-1 font-sans">¥299/月 · 下次续费 2025-01-19</p>
                    </div>
                    <Button variant="outline">升级套餐</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-[var(--foreground)] font-sans">支付方式</h3>
                  <div className="p-4 rounded-xl border border-[var(--border)] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-[var(--background-muted)]">
                        <CreditCard className="h-5 w-5 text-[var(--foreground-muted)]" />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--foreground)] font-sans">**** **** **** 4242</p>
                        <p className="text-sm text-[var(--foreground-muted)] font-sans">有效期至 12/26</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">编辑</Button>
                  </div>
                  <Button variant="outline" className="w-full">添加支付方式</Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
