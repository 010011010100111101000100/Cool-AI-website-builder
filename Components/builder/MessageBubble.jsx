import React from 'react';
import { Bot, User } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function MessageBubble({ message }) {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';
    
    if (isSystem) return null;
    
    return (
        <div className={cn(
            "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
            isUser ? "justify-end" : "justify-start"
        )}>
            {!isUser && (
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/10">
                    <Bot className="h-5 w-5 text-cyan-400" />
                </div>
            )}
            
            <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 backdrop-blur-xl",
                isUser 
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-white" 
                    : "bg-white/5 border border-white/10 text-gray-200"
            )}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
            
            {isUser && (
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/10">
                    <User className="h-5 w-5 text-purple-400" />
                </div>
            )}
        </div>
    );
}
