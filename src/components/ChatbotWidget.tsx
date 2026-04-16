'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { usePathname } from 'next/navigation';
import type { Policy } from '@/data/policies';
import type { PersonalizedScore } from '@/data/scoring';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatbotWidget({ currentPolicy, personalized }: { currentPolicy?: Policy; personalized?: PersonalizedScore | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: currentPolicy 
        ? `Hi! Ask me anything about ${currentPolicy.name} or how it compares to others.`
        : 'Welcome to PolicyLens! Need help finding the right health insurance policy?',
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Reset chat if policy context changes
  useEffect(() => {
    if (currentPolicy) {
      setMessages([{
        id: Date.now().toString(),
        role: 'assistant',
        content: `I'm analyzing ${currentPolicy.name}. What would you like to know about its clauses?`
      }]);
    }
  }, [currentPolicy, pathname]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build a comprehensive context object explicitly informing the AI of the personalized calculations
      const contextBundle = currentPolicy ? {
        basePolicy: currentPolicy,
        userPersonalizedScore: personalized ? personalized.personalizedScore : null,
        personalizedLoopholesRisk: personalized ? personalized.personalizedLoopholes : null,
        personalizedDimensionAdjustments: personalized ? personalized.dimensionDeltas : null,
      } : null;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          context: contextBundle, // Pass the bundled context!
          history: messages.slice(1).map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!res.ok) throw new Error('API Error');

      const data = await res.json();
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: data.response }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: "I'm having trouble connecting to the server. Try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-6 right-6 h-14 w-14 bg-brand text-white rounded-full shadow-xl flex items-center justify-center z-50 hover:scale-105 transition-transform"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }}>
              <MessageSquare className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-bg-surface border border-border rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-brand text-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">PolicyLens AI</h3>
                  <p className="text-[11px] text-white/80">{currentPolicy ? 'Analyzing current policy' : 'Ready to help'}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg scrollbar-hide">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="h-6 w-6 rounded-full bg-brand/10 flex items-center justify-center shrink-0 mb-1">
                      <Bot className="h-3 w-3 text-brand" />
                    </div>
                  )}
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-brand text-white rounded-br-none' : 'bg-bg-muted text-text rounded-bl-none overflow-hidden'}`}>
                    {msg.role === 'user' ? (
                      msg.content
                    ) : (
                      <div className="space-y-2 leading-relaxed">
                        <ReactMarkdown 
                          components={{
                            p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 last:mb-0 space-y-1" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 last:mb-0 space-y-1" {...props} />,
                            li: ({node, ...props}) => <li className="marker:text-brand" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold text-brand" {...props} />,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-end gap-2 justify-start">
                  <div className="h-6 w-6 rounded-full bg-brand/10 flex items-center justify-center shrink-0 mb-1">
                    <Bot className="h-3 w-3 text-brand" />
                  </div>
                  <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-bg-muted text-text rounded-bl-none flex items-center gap-1.5">
                    <motion.div className="w-1.5 h-1.5 bg-brand/60 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                    <motion.div className="w-1.5 h-1.5 bg-brand/60 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                    <motion.div className="w-1.5 h-1.5 bg-brand/60 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-bg-surface border-t border-border">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full bg-bg-muted border-none pr-10 pl-4 py-3 text-sm text-text placeholder:text-text-muted focus:outline-none rounded-xl"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1.5 bottom-1.5 p-1.5 rounded-lg bg-brand text-white disabled:opacity-50 disabled:bg-bg-muted disabled:text-text-muted transition-colors flex items-center justify-center"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
