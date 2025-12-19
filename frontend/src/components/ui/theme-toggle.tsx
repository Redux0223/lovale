import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isAnimating) return;
    
    const newTheme = theme === "light" ? "dark" : "light";
    const x = event.clientX;
    const y = event.clientY;
    
    // 计算圆形揭示动画的最大半径
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // 检查是否支持 View Transitions API
    if ((document as any).startViewTransition) {
      setIsAnimating(true);
      
      const transition = (document as any).startViewTransition(() => {
        setTheme(newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        localStorage.setItem("theme", newTheme);
      });

      transition.ready.then(() => {
        // 圆形揭示动画
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 800,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });

      transition.finished.then(() => {
        setIsAnimating(false);
      });
    } else {
      // 降级方案：涟漪扩散效果
      setIsAnimating(true);
      
      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: fixed;
        top: ${y}px;
        left: ${x}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        background-color: ${newTheme === "dark" ? "oklch(0.15 0.01 270)" : "oklch(0.985 0.005 85)"};
        pointer-events: none;
        z-index: 9999;
        transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
                    height 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      `;
      document.body.appendChild(ripple);
      
      // 触发动画
      requestAnimationFrame(() => {
        ripple.style.width = `${endRadius * 2}px`;
        ripple.style.height = `${endRadius * 2}px`;
      });

      setTimeout(() => {
        setTheme(newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        localStorage.setItem("theme", newTheme);
        
        setTimeout(() => {
          ripple.remove();
          setIsAnimating(false);
        }, 100);
      }, 400);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      disabled={isAnimating}
      className={cn(
        "relative w-10 h-10 rounded-full flex items-center justify-center",
        "bg-background-muted hover:bg-state-hover",
        "border border-border hover:border-border-strong",
        "transition-all duration-300",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      aria-label={theme === "light" ? "切换到暗色模式" : "切换到亮色模式"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "light" ? (
          <motion.div
            key="sun"
            initial={{ scale: 0, rotate: -90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 90, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
          >
            <Sun className="w-5 h-5 text-foreground" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ scale: 0, rotate: 90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: -90, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
          >
            <Moon className="w-5 h-5 text-foreground" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

export default ThemeToggle;
