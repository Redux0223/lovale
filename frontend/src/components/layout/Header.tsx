import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Search, Bell, Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
  className?: string;
}

export function Header({ onMenuClick, className }: HeaderProps) {
  const [searchFocused, setSearchFocused] = React.useState(false);

  return (
    <header
      className={cn(
        "h-16 border-b border-border bg-[var(--background-card)] flex items-center justify-between px-4 lg:px-6",
        className
      )}
    >
      {/* Left: Menu & Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-[var(--state-hover)] transition-colors"
        >
          <Menu className="h-5 w-5 text-[var(--foreground)]" />
        </button>

        <motion.div
          animate={{ width: searchFocused ? 320 : 240 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative hidden sm:block"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--foreground-muted)]" />
          <Input
            placeholder="搜索订单、产品、客户..."
            className="pl-9 bg-[var(--background-muted)] border-transparent focus:border-[var(--border)] focus:bg-[var(--background)]"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </motion.div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-[var(--state-hover)] transition-colors">
          <Bell className="h-5 w-5 text-[var(--foreground)]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--accent-error)] rounded-full animate-pulse" />
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Avatar */}
        <button className="p-1 rounded-full hover:bg-[var(--state-hover)] transition-colors">
          <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)] flex items-center justify-center">
            <span style={{ color: 'var(--accent-primary-foreground)' }} className="text-sm font-medium">A</span>
          </div>
        </button>
      </div>
    </header>
  );
}

export default Header;
