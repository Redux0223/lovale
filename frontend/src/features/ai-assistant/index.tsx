import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Lightbulb, TrendingUp, Package, AlertCircle, Copy, RotateCcw, Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import { ModelSelector, MODELS, type ModelDisplayName, type ModelAPIName } from "@/components/ui/model-selector";
import { CanvasEditor } from "@/components/ui/canvas-editor";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  model?: string;
}

const suggestions = [
  { icon: TrendingUp, text: "分析本月销售趋势", color: "text-green-500" },
  { icon: Package, text: "查看库存预警产品", color: "text-amber-500" },
  { icon: Lightbulb, text: "推荐营销策略", color: "text-blue-500" },
  { icon: AlertCircle, text: "识别潜在风险客户", color: "text-red-500" },
];

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "您好！我是您的AI商业助手。我可以帮助您分析销售数据、预测趋势、优化库存管理，以及提供个性化的商业建议。请问有什么可以帮您的？",
    timestamp: new Date(),
  },
];

// Supabase Edge Function API
const SUPABASE_URL = "https://ahfsqtexhxthstxkbnpa.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoZnNxdGV4aHh0aHN0eGtibnBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMTA4NjMsImV4cCI6MjA4MTY4Njg2M30.Mp_zRKsmuLdjK6WU5k_8Bi2CqQz-FQHK4kpu_bEW-ak";

export function AIAssistantPage() {
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = React.useState(false);
  const [selectedModel, setSelectedModel] = React.useState<ModelDisplayName>("gemini-3-pro");
  const [currentAPIModel, setCurrentAPIModel] = React.useState<ModelAPIName>("gemini-3-pro-preview");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  // Canvas state
  const [isCanvasOpen, setIsCanvasOpen] = React.useState(false);
  const [canvasContent, setCanvasContent] = React.useState("");
  const [canvasTitle, setCanvasTitle] = React.useState("未命名文档");
  const [isCanvasGenerating, setIsCanvasGenerating] = React.useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleModelChange = (displayName: ModelDisplayName, apiName: ModelAPIName) => {
    setSelectedModel(displayName);
    setCurrentAPIModel(apiName);
    console.log(`模型已切换: 显示名称=${displayName}, API名称=${apiName}`);
  };

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (message: string, files?: File[]) => {
    if (!message.trim() && (!files || files.length === 0)) return;

    // Check for Canvas mode
    const isCanvasMode = message.startsWith('[Canvas] ');
    const cleanMessage = isCanvasMode ? message.replace('[Canvas] ', '') : message;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    
    // Handle Canvas mode - first show thinking, then open canvas when content arrives
    if (isCanvasMode) {
      // Step 1: Show thinking status (canvas stays closed)
      setIsTyping(true);
      setCanvasContent("");
      
      try {
        // Call Edge Function for real-time document generation
        const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            message: message,
            model: currentAPIModel,
            session_id: `session_${Date.now()}`,
          }),
        });

        let fullContent = "";
        if (response.ok) {
          const data = await response.json();
          fullContent = data.response || `# ${cleanMessage}\n\n正在生成内容...`;
        } else {
          throw new Error("API request failed");
        }

        // Step 2: Content received, now open canvas and start streaming
        setIsTyping(false);
        setIsCanvasOpen(true);
        setIsCanvasGenerating(true);
        setCanvasTitle(cleanMessage.slice(0, 30));
        
        // Simulate streaming effect for better UX
        const chars = fullContent.split('');
        let currentContent = '';
        
        for (let i = 0; i < chars.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 3));
          currentContent += chars[i];
          setCanvasContent(currentContent);
        }
        
        setIsCanvasGenerating(false);
        
        // Add assistant message
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `✅ 已为您生成文档『${cleanMessage}』，请在右侧画布中查看和编辑。`,
          timestamp: new Date(),
          model: selectedModel,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error("Canvas generation failed:", error);
        setIsTyping(false);
        setIsCanvasGenerating(false);
        
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `❌ 文档生成失败，请重试。`,
          timestamp: new Date(),
          model: selectedModel,
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
      return;
    }

    setIsTyping(true);

    try {
      // Supabase Edge Function API调用
      const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          message: message,
          model: currentAPIModel,
          session_id: `session_${Date.now()}`,
          context: messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response || "抱歉，我暂时无法处理您的请求。",
          timestamp: new Date(),
          model: selectedModel,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);
        return;
      } else {
        throw new Error("API request failed");
      }
    } catch (error) {
      console.log("使用模拟响应 (后端未连接或请求失败)", error);
      // 模拟响应 - 当后端不可用时
      setTimeout(() => {
        const modelResponses: Record<ModelDisplayName, string[]> = {
          "gemini-3-pro": [
            "🔍 基于Gemini分析，您的销售数据显示过去30天内有显著增长。主要增长来源于手机配件类目，建议增加该类目的库存。",
            "📊 Gemini多模态分析完成：您的产品图片质量评分为87/100，建议优化主图的光线和角度以提升点击率。",
          ],
          "claude-opus-4.5-thinking": [
            "🧠 [深度思考中...]\n\n经过多维度分析，我发现您的业务存在以下优化空间：\n1. VIP客户复购率可提升12%\n2. 库存周转率有15%改善空间\n3. 建议在Q1推出会员升级计划",
            "💡 Claude深度推理结果：基于客户行为模式，建议实施个性化推荐系统，预计可提升转化率18-22%。",
          ],
          "grok-4.1-thinking": [
            "⚡ Grok快速分析：检测到5款产品库存低于安全线，其中AirPods Pro 2最为紧急，预计48小时内售罄。建议立即启动补货流程。",
            "🚀 实时市场洞察：竞品在本周推出了新促销活动，建议您考虑差异化策略，重点突出售后服务优势。",
          ],
          "gpt-5-thinking": [
            "🎯 GPT-5综合分析报告：\n\n• 销售趋势：环比增长23%\n• 客户满意度：4.6/5.0\n• 运营效率：优化空间18%\n\n建议重点关注客户留存策略。",
            "📈 预测模型显示：如果维持当前增长势头，Q2营收预计可达上季度的135%。建议提前规划供应链扩容。",
          ],
        };

        const responses = modelResponses[selectedModel] || modelResponses["gemini-3-pro"];
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          model: selectedModel,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1500);
      return;
    }

    setIsTyping(false);
  };

  // Handle AI requests from Canvas
  const handleCanvasAIRequest = (action: string, selection?: string) => {
    if (!selection) return;
    setIsCanvasGenerating(true);
    
    let result = '';
    switch (action) {
      case 'improve':
        result = `【优化后】${selection.replace(/。/g, '，同时').replace(/，/g, '、')}`;
        break;
      case 'expand':
        result = `${selection}\n\n更进一步地说，这个观点可以从以下几个角度来理解：\n- 第一，从数据层面来看...\n- 第二，从实践经验来看...\n- 第三，从行业趋势来看...`;
        break;
      case 'simplify':
        result = selection.split('。')[0] + '。';
        break;
      default:
        result = selection;
    }
    
    // Simulate processing delay
    setTimeout(() => {
      const newContent = canvasContent.replace(selection, result);
      setCanvasContent(newContent);
      setIsCanvasGenerating(false);
    }, 500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const currentModelInfo = MODELS.find(m => m.displayName === selectedModel);

  return (
    <div className={`h-[calc(100vh-8rem)] flex flex-col transition-all duration-300 ${isCanvasOpen ? 'mr-[50vw]' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[var(--primary)]">
            <Bot className="h-6 w-6" style={{ color: 'var(--primary-foreground)' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)] font-display">AI 商业助手</h1>
            <p className="text-sm text-[var(--foreground-muted)] font-sans">智能分析 · 精准预测 · 策略建议</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ModelSelector selectedModel={selectedModel} onModelChange={handleModelChange} />
          {isCanvasOpen && (
            <Button variant="outline" size="sm" className="gap-2 font-sans" onClick={() => setIsCanvasOpen(false)}>
              <FileText className="h-4 w-4" />
              <span>关闭画布</span>
            </Button>
          )}
          <Button variant="outline" size="sm" className="gap-2 font-sans" onClick={() => setMessages(initialMessages)}>
            <RotateCcw className="h-4 w-4" />
            <span>重置</span>
          </Button>
        </div>
      </div>

      {/* Model Info Banner */}
      {currentModelInfo && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 px-3 py-2 rounded-lg bg-[var(--background-muted)] border border-[var(--border)] flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <img src={currentModelInfo.iconSrc} alt={selectedModel} className="w-5 h-5 rounded object-cover" />
            <span className="text-sm text-[var(--foreground)] font-sans">当前模型: <strong>{selectedModel}</strong></span>
          </div>
          <code className="text-xs px-2 py-1 rounded bg-[var(--background-muted)] text-[var(--foreground)] font-mono">
            API: {currentAPIModel}
          </code>
        </motion.div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${message.role === "assistant" ? "bg-[var(--primary)]" : "bg-[var(--foreground-muted)]"}`}>
                {message.role === "assistant" ? <Bot className="h-5 w-5" style={{ color: 'var(--primary-foreground)' }} /> : <User className="h-5 w-5" style={{ color: 'var(--primary-foreground)' }} />}
              </div>
              <div className={`flex-1 max-w-[80%] ${message.role === "user" ? "text-right" : ""}`}>
                <div className={`inline-block p-4 rounded-2xl ${message.role === "assistant" ? "bg-[var(--background-card)] border border-[var(--border)]" : "bg-[var(--primary)] text-[var(--primary-foreground)]"}`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-sans">{message.content}</p>
                </div>
                <div className={`flex items-center gap-2 mt-2 text-xs text-[var(--foreground-muted)] ${message.role === "user" ? "justify-end" : ""}`}>
                  {message.model && <span className="px-1.5 py-0.5 rounded bg-[var(--background-muted)] text-[var(--foreground-muted)] font-sans">{message.model}</span>}
                  <span className="font-sans">{message.timestamp.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}</span>
                  {message.role === "assistant" && (
                    <button onClick={() => handleCopy(message.content, message.id)} className="p-1 hover:bg-[var(--state-hover)] rounded transition-colors">
                      {copiedId === message.id ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center">
              <Bot className="h-5 w-5" style={{ color: 'var(--primary-foreground)' }} />
            </div>
            <div className="bg-[var(--background-card)] border border-[var(--border)] rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--foreground-muted)] font-sans">{selectedModel} 思考中</span>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-[var(--foreground-muted)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-[var(--foreground-muted)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-[var(--foreground-muted)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-4">
          <p className="text-sm text-[var(--foreground-muted)] mb-3 font-sans">试试这些问题：</p>
          <div className="grid grid-cols-2 gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.text}
                onClick={() => handleSuggestionClick(suggestion.text)}
                className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--background-card)] hover:bg-[var(--state-hover)] transition-colors text-left"
              >
                <suggestion.icon className={`h-5 w-5 ${suggestion.color}`} />
                <span className="text-sm text-[var(--foreground)] font-sans">{suggestion.text}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input - New PromptInputBox */}
      <div className="pt-4">
        <PromptInputBox onSend={handleSend} isLoading={isTyping} placeholder="输入您的问题..." />
        <p className="text-xs text-[var(--foreground-muted)] mt-2 text-center font-sans">
          AI助手基于您的业务数据提供建议，仅供参考 · 当前使用 <strong>{currentAPIModel}</strong>
        </p>
      </div>

      {/* Canvas Editor */}
      <CanvasEditor
        isOpen={isCanvasOpen}
        onClose={() => setIsCanvasOpen(false)}
        content={canvasContent}
        onContentChange={setCanvasContent}
        title={canvasTitle}
        onTitleChange={setCanvasTitle}
        isGenerating={isCanvasGenerating}
        onRequestAI={handleCanvasAIRequest}
      />
    </div>
  );
}

export default AIAssistantPage;
