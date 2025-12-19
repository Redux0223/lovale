import * as React from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  type LucideIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";

export type TrendType = "up" | "down" | "neutral";

export interface KPICardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: number;
  trendType?: TrendType;
  icon?: LucideIcon;
  format?: "number" | "currency" | "percent" | "compact";
  className?: string;
  delay?: number;
}

function AnimatedNumber({ 
  value, 
  format = "number",
  prefix = "",
  suffix = "" 
}: { 
  value: number; 
  format?: string;
  prefix?: string;
  suffix?: string;
}) {
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (current) => {
    let formatted: string;
    switch (format) {
      case "currency":
        formatted = new Intl.NumberFormat("zh-CN", {
          style: "currency",
          currency: "CNY",
          minimumFractionDigits: 0,
        }).format(Math.round(current));
        break;
      case "percent":
        formatted = `${current.toFixed(1)}%`;
        break;
      case "compact":
        if (current >= 1000000) {
          formatted = `${(current / 1000000).toFixed(1)}M`;
        } else if (current >= 1000) {
          formatted = `${(current / 1000).toFixed(1)}K`;
        } else {
          formatted = Math.round(current).toString();
        }
        break;
      default:
        formatted = Math.round(current).toLocaleString("zh-CN");
    }
    return `${prefix}${formatted}${suffix}`;
  });

  React.useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

function TrendIndicator({ value, type }: { value: number; type: TrendType }) {
  const config = {
    up: {
      icon: TrendingUp,
      color: "text-accent-success bg-accent-success/10",
      label: "增长",
    },
    down: {
      icon: TrendingDown,
      color: "text-accent-error bg-accent-error/10",
      label: "下降",
    },
    neutral: {
      icon: Minus,
      color: "text-foreground-muted bg-background-muted",
      label: "持平",
    },
  };

  const { icon: Icon, color, label } = config[type];

  return (
    <motion.div
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
        color
      )}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.3 }}
    >
      <Icon className="h-3 w-3" />
      <span>{Math.abs(value).toFixed(1)}%</span>
      <span className="sr-only">{label}</span>
    </motion.div>
  );
}

const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      delay: delay * 0.1,
    },
  }),
  hover: {
    y: -4,
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    transition: { duration: 0.2 },
  },
};

export function KPICard({
  title,
  value,
  prefix = "",
  suffix = "",
  trend,
  trendType = "neutral",
  icon: Icon,
  format = "number",
  className,
  delay = 0,
}: KPICardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      custom={delay}
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-md",
        "transition-colors duration-200",
        className
      )}
    >
      {/* 背景装饰 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent-primary/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-foreground-muted">{title}</span>
        {Icon && (
          <div className="p-2 rounded-lg bg-background-muted">
            <Icon className="h-4 w-4 text-foreground-muted" />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="text-3xl font-bold text-foreground font-display mb-2">
        <AnimatedNumber 
          value={value} 
          format={format} 
          prefix={format === "currency" ? "" : prefix}
          suffix={suffix}
        />
      </div>

      {/* Trend */}
      {trend !== undefined && (
        <TrendIndicator value={trend} type={trendType} />
      )}
    </motion.div>
  );
}

export default KPICard;
