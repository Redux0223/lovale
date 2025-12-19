import React from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// 模型图标导入
import geminiIcon from "@/assets/google-gemini.webp";
import claudeIcon from "@/assets/claude-ai.webp";
import grokIcon from "@/assets/grok.webp";
import chatgptIcon from "@/assets/chatgpt.webp";

// 模型映射：显示名称 -> API名称
export const MODEL_MAP = {
  "gemini-3-pro": "gemini-3-pro-preview",
  "claude-opus-4.5-thinking": "claude-opus-4-5-20251101-thinking",
  "grok-4.1-thinking": "grok-4-1-thinking-1129",
  "gpt-5-thinking": "gpt-5",
} as const;

export type ModelDisplayName = keyof typeof MODEL_MAP;
export type ModelAPIName = (typeof MODEL_MAP)[ModelDisplayName];

interface ModelInfo {
  displayName: ModelDisplayName;
  apiName: ModelAPIName;
  description: string;
  iconSrc: string;
}

export const MODELS: ModelInfo[] = [
  {
    displayName: "gemini-3-pro",
    apiName: "gemini-3-pro-preview",
    description: "Google最新多模态模型",
    iconSrc: geminiIcon,
  },
  {
    displayName: "claude-opus-4.5-thinking",
    apiName: "claude-opus-4-5-20251101-thinking",
    description: "Anthropic深度推理模型",
    iconSrc: claudeIcon,
  },
  {
    displayName: "grok-4.1-thinking",
    apiName: "grok-4-1-thinking-1129",
    description: "xAI推理增强模型",
    iconSrc: grokIcon,
  },
  {
    displayName: "gpt-5-thinking",
    apiName: "gpt-5",
    description: "OpenAI最新一代模型",
    iconSrc: chatgptIcon,
  },
];

interface ModelSelectorProps {
  selectedModel: ModelDisplayName;
  onModelChange: (displayName: ModelDisplayName, apiName: ModelAPIName) => void;
  className?: string;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const currentModel = MODELS.find((m) => m.displayName === selectedModel) || MODELS[0];

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background-card)] hover:bg-[var(--state-hover)] transition-all font-sans text-sm",
          isOpen && "ring-2 ring-[var(--border-strong)]"
        )}
      >
        <img src={currentModel.iconSrc} alt={currentModel.displayName} className="w-5 h-5 rounded object-cover" />
        <span className="text-[var(--foreground)] font-medium">{currentModel.displayName}</span>
        <ChevronDown className={cn("h-4 w-4 text-[var(--foreground-muted)] transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute top-full left-0 mt-2 w-72 rounded-xl border border-[var(--border)] bg-[var(--background-card)] shadow-xl z-50 overflow-hidden"
        >
          <div className="p-2 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 px-2 py-1">
              <Sparkles className="h-4 w-4 text-[var(--foreground-muted)]" />
              <span className="text-xs text-[var(--foreground-muted)] font-sans">选择AI模型</span>
            </div>
          </div>
          <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
            {MODELS.map((model) => (
              <button
                key={model.displayName}
                onClick={() => {
                  onModelChange(model.displayName, model.apiName);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-left",
                  selectedModel === model.displayName
                    ? "bg-[var(--background-muted)] border border-[var(--border-strong)]"
                    : "hover:bg-[var(--state-hover)] border border-transparent"
                )}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--background-muted)] overflow-hidden">
                  <img src={model.iconSrc} alt={model.displayName} className="w-8 h-8 rounded object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--foreground)] font-sans">{model.displayName}</span>
                    {selectedModel === model.displayName && (
                      <Check className="h-4 w-4 text-[var(--foreground)]" />
                    )}
                  </div>
                  <p className="text-xs text-[var(--foreground-muted)] truncate font-sans">{model.description}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="p-2 border-t border-[var(--border)] bg-[var(--background-muted)]/50">
            <p className="text-[10px] text-[var(--foreground-muted)] text-center font-sans">
              当前API: <code className="px-1 py-0.5 rounded bg-[var(--background-muted)] text-[var(--foreground-muted)]">{currentModel.apiName}</code>
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ModelSelector;
