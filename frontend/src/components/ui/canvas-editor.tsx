import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Download, Copy, Check, X, Maximize2, Minimize2,
  Bold, Italic, List, ListOrdered, Heading1, Heading2, Quote, 
  Undo, Redo, Save, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CanvasEditorProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onContentChange: (content: string) => void;
  title?: string;
  onTitleChange?: (title: string) => void;
  isGenerating?: boolean;
  onRequestAI?: (action: string, selection?: string) => void;
}

type EditorMode = "edit" | "preview" | "split";

export function CanvasEditor({
  isOpen,
  onClose,
  content,
  onContentChange,
  title = "未命名文档",
  onTitleChange,
  isGenerating = false,
  onRequestAI,
}: CanvasEditorProps) {
  const [mode, setMode] = React.useState<EditorMode>("edit");
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [history, setHistory] = React.useState<string[]>([content]);
  const [historyIndex, setHistoryIndex] = React.useState(0);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [selection, setSelection] = React.useState<{start: number; end: number; text: string} | null>(null);

  // Update history when content changes externally
  React.useEffect(() => {
    if (content !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(content);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [content]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      onContentChange(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      onContentChange(history[historyIndex + 1]);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    localStorage.setItem('canvas_draft', JSON.stringify({ title, content, timestamp: Date.now() }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = (format: 'md' | 'txt') => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);
    
    onContentChange(newText);
    
    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const handleSelectionChange = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start !== end) {
      setSelection({
        start,
        end,
        text: content.substring(start, end)
      });
    } else {
      setSelection(null);
    }
  };

  // Markdown to HTML converter (simplified)
  const renderMarkdown = (text: string): string => {
    let html = text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-5 mb-2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>')
      // Bold & Italic
      .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // Lists
      .replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^\s*[-*]\s+(.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
      // Blockquote
      .replace(/^>\s+(.*$)/gim, '<blockquote class="border-l-4 border-[var(--border)] pl-4 italic text-[var(--foreground-muted)]">$1</blockquote>')
      // Code blocks
      .replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre class="bg-[var(--background-muted)] rounded-lg p-3 overflow-x-auto my-2"><code>$2</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/gim, '<code class="bg-[var(--background-muted)] px-1.5 py-0.5 rounded text-sm">$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-[var(--primary)] hover:underline">$1</a>')
      // Tables
      .replace(/\|(.+)\|/g, (match) => {
        const cells = match.split('|').filter(c => c.trim());
        if (cells.every(c => c.trim().match(/^[-:]+$/))) {
          return ''; // Skip separator row
        }
        const isHeader = match.includes('---');
        const tag = isHeader ? 'th' : 'td';
        return `<tr>${cells.map(c => `<${tag} class="border border-[var(--border)] px-3 py-2">${c.trim()}</${tag}>`).join('')}</tr>`;
      })
      // Line breaks
      .replace(/\n/gim, '<br/>');

    return html;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={cn(
          "fixed top-0 right-0 h-full bg-[var(--background)] border-l border-[var(--border)] shadow-2xl z-50 flex flex-col",
          isFullscreen ? "w-full" : "w-[50vw] min-w-[500px]"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--background-card)]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--primary)]/10">
              <FileText className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange?.(e.target.value)}
              className="text-lg font-semibold bg-transparent border-none outline-none text-[var(--foreground)] font-display"
              placeholder="文档标题..."
            />
            {isGenerating && (
              <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-[var(--primary)]/10">
                <Sparkles className="h-4 w-4 text-[var(--primary)] animate-pulse" />
                <span className="text-xs text-[var(--primary)]">AI生成中...</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg hover:bg-[var(--state-hover)] transition-colors"
              title={isFullscreen ? "退出全屏" : "全屏"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--state-hover)] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--background-muted)]/50">
          <div className="flex items-center gap-1">
            {/* Format buttons */}
            <button onClick={() => insertMarkdown("**", "**")} className="p-2 rounded hover:bg-[var(--state-hover)]" title="粗体">
              <Bold className="h-4 w-4" />
            </button>
            <button onClick={() => insertMarkdown("*", "*")} className="p-2 rounded hover:bg-[var(--state-hover)]" title="斜体">
              <Italic className="h-4 w-4" />
            </button>
            <div className="w-px h-5 bg-[var(--border)] mx-1" />
            <button onClick={() => insertMarkdown("# ")} className="p-2 rounded hover:bg-[var(--state-hover)]" title="标题1">
              <Heading1 className="h-4 w-4" />
            </button>
            <button onClick={() => insertMarkdown("## ")} className="p-2 rounded hover:bg-[var(--state-hover)]" title="标题2">
              <Heading2 className="h-4 w-4" />
            </button>
            <div className="w-px h-5 bg-[var(--border)] mx-1" />
            <button onClick={() => insertMarkdown("- ")} className="p-2 rounded hover:bg-[var(--state-hover)]" title="无序列表">
              <List className="h-4 w-4" />
            </button>
            <button onClick={() => insertMarkdown("1. ")} className="p-2 rounded hover:bg-[var(--state-hover)]" title="有序列表">
              <ListOrdered className="h-4 w-4" />
            </button>
            <button onClick={() => insertMarkdown("> ")} className="p-2 rounded hover:bg-[var(--state-hover)]" title="引用">
              <Quote className="h-4 w-4" />
            </button>
            <div className="w-px h-5 bg-[var(--border)] mx-1" />
            <button onClick={handleUndo} disabled={historyIndex === 0} className="p-2 rounded hover:bg-[var(--state-hover)] disabled:opacity-30" title="撤销">
              <Undo className="h-4 w-4" />
            </button>
            <button onClick={handleRedo} disabled={historyIndex === history.length - 1} className="p-2 rounded hover:bg-[var(--state-hover)] disabled:opacity-30" title="重做">
              <Redo className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            {/* View mode */}
            <div className="flex items-center bg-[var(--background-muted)] rounded-lg p-0.5">
              {(["edit", "split", "preview"] as EditorMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "px-3 py-1 text-xs rounded-md transition-colors",
                    mode === m ? "bg-[var(--background-card)] text-[var(--foreground)] shadow-sm" : "text-[var(--foreground-muted)]"
                  )}
                >
                  {m === "edit" ? "编辑" : m === "split" ? "分屏" : "预览"}
                </button>
              ))}
            </div>
            <div className="w-px h-5 bg-[var(--border)] mx-2" />
            {/* Actions */}
            <button onClick={handleSave} className="p-2 rounded hover:bg-[var(--state-hover)]" title="保存草稿">
              {saved ? <Check className="h-4 w-4 text-green-500" /> : <Save className="h-4 w-4" />}
            </button>
            <button onClick={handleCopy} className="p-2 rounded hover:bg-[var(--state-hover)]" title="复制">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </button>
            <button onClick={() => handleExport('md')} className="p-2 rounded hover:bg-[var(--state-hover)]" title="导出Markdown">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* AI Quick Actions (when text is selected) */}
        <AnimatePresence>
          {selection && selection.text.length > 0 && onRequestAI && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-4 mt-2 p-2 rounded-lg bg-[var(--primary)]/5 border border-[var(--primary)]/20 flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-[var(--primary)]" />
              <span className="text-xs text-[var(--foreground-muted)]">已选中 {selection.text.length} 字符</span>
              <div className="flex-1" />
              <button
                onClick={() => onRequestAI("improve", selection.text)}
                className="px-2 py-1 text-xs rounded bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-80"
              >
                优化
              </button>
              <button
                onClick={() => onRequestAI("expand", selection.text)}
                className="px-2 py-1 text-xs rounded bg-[var(--background-muted)] hover:bg-[var(--state-hover)]"
              >
                扩展
              </button>
              <button
                onClick={() => onRequestAI("simplify", selection.text)}
                className="px-2 py-1 text-xs rounded bg-[var(--background-muted)] hover:bg-[var(--state-hover)]"
              >
                精简
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editor Area */}
        <div className="flex-1 overflow-hidden flex">
          {/* Edit Panel */}
          {(mode === "edit" || mode === "split") && (
            <div className={cn("flex-1 flex flex-col", mode === "split" && "border-r border-[var(--border)]")}>
              <div className="px-4 py-2 text-xs text-[var(--foreground-muted)] bg-[var(--background-muted)]/30">
                Markdown 编辑器
              </div>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                onSelect={handleSelectionChange}
                className="flex-1 p-4 bg-transparent resize-none outline-none font-mono text-sm text-[var(--foreground)] leading-relaxed"
                placeholder="开始输入内容，或让AI为您生成..."
                spellCheck={false}
              />
            </div>
          )}

          {/* Preview Panel */}
          {(mode === "preview" || mode === "split") && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="px-4 py-2 text-xs text-[var(--foreground-muted)] bg-[var(--background-muted)]/30">
                实时预览
              </div>
              <div 
                className="flex-1 p-4 overflow-y-auto prose prose-sm max-w-none text-[var(--foreground)]"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[var(--border)] bg-[var(--background-muted)]/30 flex items-center justify-between text-xs text-[var(--foreground-muted)]">
          <span>{content.length} 字符 · {content.split(/\s+/).filter(Boolean).length} 词</span>
          <span>自动保存已启用</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default CanvasEditor;
