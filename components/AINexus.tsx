
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Maximize2, Minimize2, Terminal, Shield, Zap } from 'lucide-react';
import { getStreamingChat } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AINexus: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const result = await getStreamingChat(userMsg);
      let fullResponse = '';
      
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of result) {
        const chunkText = chunk.text;
        if (chunkText) {
          fullResponse += chunkText;
          setMessages(prev => {
            const next = [...prev];
            next[next.length - 1].text = fullResponse;
            return next;
          });
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "SYSTEM_ERROR: Neural gateway timeout. Re-initialize probe." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-mono">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-110 transition-all duration-300 border border-blue-400/30"
        >
          <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping opacity-20"></div>
          <MessageSquare className="w-6 h-6 text-white" />
          <span className="absolute right-full mr-4 px-3 py-1 bg-slate-900 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-blue-500/20">
            Nexus_AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`flex flex-col bg-[#0a0a0c]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden ${
          isExpanded ? 'w-[80vw] h-[80vh] md:w-[600px] md:h-[700px]' : 'w-[320px] h-[450px] md:w-[380px] md:h-[500px]'
        }`}>
          {/* Header */}
          <div className="px-5 py-3 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Orion_Nexus v4.2</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors"
              >
                {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar bg-black/40">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                <Shield className="w-10 h-10 text-blue-500" strokeWidth={1} />
                <p className="text-[10px] font-bold text-white uppercase tracking-widest leading-relaxed px-10">
                  Awaiting operational input. Ask about threat actors, IOCs, or grid status.
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col gap-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 px-1">
                  <span className={`text-[8px] font-black uppercase tracking-widest ${msg.role === 'user' ? 'text-white/20' : 'text-blue-500/60'}`}>
                    {msg.role === 'user' ? 'USER_PROBE' : 'SYSTEM_INTEL'}
                  </span>
                </div>
                <div className={`max-w-[85%] px-4 py-3 rounded-xl text-[11px] leading-relaxed transition-all ${
                  msg.role === 'user' 
                    ? 'bg-blue-600/10 border border-blue-500/20 text-white' 
                    : 'bg-white/[0.03] border border-white/5 text-white/80'
                }`}>
                  {msg.text || (isTyping && i === messages.length - 1 ? <Loader2 className="w-3 h-3 animate-spin" /> : null)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-4 bg-white/[0.01] border-t border-white/5">
            <div className="relative flex items-center">
              <Terminal className="absolute left-3 w-3.5 h-3.5 text-blue-500/40" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="EXECUTE COMMAND..."
                className="w-full bg-black/60 border border-white/10 rounded-xl py-3 pl-10 pr-12 text-[10px] text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-white/10 uppercase tracking-widest"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 p-2 rounded-lg text-blue-500 hover:text-blue-400 disabled:text-white/10 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Footer Status */}
          <div className="px-4 py-2 border-t border-white/5 bg-black flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.3em]">Neural_Link: Active</span>
            </div>
            <Zap className="w-3 h-3 text-white/10" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AINexus;
