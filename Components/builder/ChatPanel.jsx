import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, Loader2, Trash2, Wand2, Zap, Image as ImageIcon } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";

export default function ChatPanel({ messages, onSendMessage, isLoading, onClearChat }) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim());
            setInput('');
        }
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };
    
    const suggestions = [
        { text: "Create a modern landing page for a SaaS product", icon: Sparkles },
        { text: "Build an e-commerce product page with cart", icon: ImageIcon },
        { text: "Make a playable space shooter game", icon: Zap },
        { text: "Design a portfolio with 3D effects", icon: Wand2 }
    ];
    
    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-white">AI Builder</h2>
                        <p className="text-xs text-gray-400">Powered by Advanced AI</p>
                    </div>
                </div>
                {messages.length > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearChat}
                        className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center mb-6 shadow-2xl shadow-cyan-500/20">
                            <Sparkles className="h-10 w-10 text-cyan-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Welcome to Cool Website Builder</h3>
                        <p className="text-gray-400 text-sm mb-6 max-w-sm">
                            Describe the website you want to create, and I'll generate the code for you instantly.
                        </p>
                        <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
                            {suggestions.map((suggestion, i) => {
                                const Icon = suggestion.icon;
                                return (
                                    <motion.button
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        onClick={() => setInput(suggestion.text)}
                                        className="group text-left px-4 py-3 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-cyan-500/50 hover:from-cyan-500/10 hover:to-purple-500/5 transition-all duration-300 flex items-center gap-3"
                                    >
                                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                                            <Icon className="h-5 w-5 text-cyan-400" />
                                        </div>
                                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{suggestion.text}</span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <>
                        <AnimatePresence>
                            {messages.filter(m => m.role !== 'system').map((message, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <MessageBubble message={message} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
                                    <Bot className="h-5 w-5 text-cyan-400" />
                                </div>
                                <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 text-cyan-400 animate-spin" />
                                        <span className="text-sm text-gray-400">Generating your website...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
                <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-[#0a0a0f]/95 backdrop-blur-xl">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <div className="flex-1 relative">
                        <Textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Describe your website in detail..."
                            className="min-h-[52px] max-h-32 resize-none bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-cyan-500/50 focus:ring-cyan-500/20 rounded-xl pr-12"
                            rows={1}
                            maxLength={2000}
                        />
                        <div className="absolute bottom-2 right-2 text-xs text-gray-600">
                            {input.length}/2000
                        </div>
                    </div>
                    <Button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="h-[52px] w-[52px] rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Send className="h-5 w-5" />
                        )}
                    </Button>
                </form>
                <p className="text-xs text-gray-600 mt-2">Press Enter to send • Shift+Enter for new line</p>
            </div>
        </div>
    );
}

const Bot = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v4" />
        <line x1="8" y1="16" x2="8" y2="16" />
        <line x1="16" y1="16" x2="16" y2="16" />
    </svg>
);
