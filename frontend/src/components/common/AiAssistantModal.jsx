import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Bot, X, Send, ArrowRight, CornerDownLeft, 
  RefreshCw, MessageSquare, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { aiService } from '../../services/api';

export const AiAssistantModal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "👋 Hi there! I'm your **CPM Placement Copilot**. I can help you practice mock interviews, polish your ATS resume, analyze job requirements, or prepare for visiting tech recruiters (Google, Microsoft, Amazon). How can I assist you today?",
      suggestions: [
        'How do I optimize my resume for ATS?',
        'Start an AI Mock Interview',
        'Google campus drive hiring pattern',
        'Top 5 DSA patterns to know'
      ]
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await aiService.chat({
        message: textToSend,
        role: user?.role || 'STUDENT',
        context: 'general_copilot'
      });

      if (res.success && res.data) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: res.data.reply,
            suggestions: res.data.suggestions || [],
            actionType: res.data.actionType,
            actionUrl: res.data.actionUrl
          }
        ]);
      } else {
        throw new Error('No response from AI engine');
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: "I'm currently connected in offline guidance mode. Here's a tip: Focus on quantifying project achievements using the Google XYZ formula: *Accomplished [X], measured by [Y], by doing [Z]*, and practice algorithmic problems daily in our Mock Interview section!",
          suggestions: ['Start an AI Mock Interview', 'Open Resume Builder']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50 no-print">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 px-4 py-3 text-white shadow-2xl shadow-indigo-600/40 hover:scale-105 hover:shadow-indigo-600/60 transition-all duration-300 ring-2 ring-white/50"
            title="Open AI Placement Copilot"
          >
            <div className="relative">
              <Sparkles className="h-5 w-5 animate-pulse text-amber-300" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <span className="text-xs font-black tracking-wide hidden sm:inline">AI Copilot</span>
          </button>
        )}
      </div>

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[620px] w-[92vw] sm:w-[420px] flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200 no-print">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-indigo-700/20 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-amber-300 shadow-inner">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black tracking-tight leading-none">AI Placement Copilot</h3>
                  <span className="rounded-full bg-emerald-400/20 text-emerald-300 px-2 py-0.5 text-[9px] font-extrabold uppercase">
                    Active
                  </span>
                </div>
                <p className="text-[10px] text-indigo-200 mt-0.5">Career & Placement Intelligence</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-xl p-1.5 text-white/70 hover:bg-white/15 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none font-medium'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-line prose prose-xs">
                    {msg.text}
                  </div>

                  {/* Action Link Button if AI recommended navigating */}
                  {msg.actionUrl && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          navigate(msg.actionUrl);
                        }}
                        className="flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-1.5 text-[11px] font-bold text-indigo-700 hover:bg-indigo-100 transition w-full justify-center"
                      >
                        Go to Recommended Tool <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Suggestions Pills */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                    {msg.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSendMessage(sug)}
                        className="rounded-full border border-indigo-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400 transition shadow-xs text-left"
                      >
                        ✨ {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 rounded-2xl bg-white border border-slate-200 p-3 text-xs text-slate-500 w-fit">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600 animate-spin" />
                <span>AI Copilot is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="border-t border-slate-200 bg-white p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about resume tips, mock interviews, Google OA..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition shrink-0 shadow-sm"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AiAssistantModal;
