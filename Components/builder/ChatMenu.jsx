import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquarePlus, Trash2, MessageSquare, ChevronLeft, Menu, Edit2, Check, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatMenu({ 
    conversations, 
    activeConversationId, 
    onSelectConversation,
    onCreateConversation,
    onDeleteConversation,
    onRenameConversation
}) {
    const [isOpen, setIsOpen] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    
    return (
        <>
            {/* Toggle Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute top-4 left-4 z-20 h-10 w-10 p-0 bg-white/5 hover:bg-white/10 border border-white/10"
                style={{ display: isOpen ? 'none' : 'flex' }}
            >
                <Menu className="h-5 w-5 text-gray-400" />
            </Button>
            
            {/* Chat Menu Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: -250 }}
                        animate={{ x: 0 }}
                        exit={{ x: -250 }}
                        className="w-64 border-r border-white/10 bg-[#0a0a0f]/95 backdrop-blur-xl flex flex-col relative"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                            <h2 className="text-white font-semibold">Chats</h2>
                            <Button
                                onClick={() => setIsOpen(false)}
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-white"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                        </div>
                        
                        {/* New Chat Button */}
                        <div className="p-3">
                            <Button
                                onClick={onCreateConversation}
                                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400"
                            >
                                <MessageSquarePlus className="h-4 w-4 mr-2" />
                                New Chat
                            </Button>
                        </div>
                        
                        {/* Conversations List */}
                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {conversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    className={cn(
                                        "group relative rounded-lg transition-all",
                                        activeConversationId === conv.id
                                            ? "bg-white/10 border border-cyan-500/30"
                                            : "hover:bg-white/5 border border-transparent"
                                    )}
                                >
                                    {editingId === conv.id ? (
                                        <div className="p-3 flex items-center gap-2">
                                            <Input
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="h-7 text-sm bg-white/5 border-white/20"
                                                autoFocus
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        onRenameConversation(conv.id, editName);
                                                        setEditingId(null);
                                                    } else if (e.key === 'Escape') {
                                                        setEditingId(null);
                                                    }
                                                }}
                                            />
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => {
                                                    onRenameConversation(conv.id, editName);
                                                    setEditingId(null);
                                                }}
                                                className="h-7 w-7 text-green-400 hover:text-green-300"
                                            >
                                                <Check className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => setEditingId(null)}
                                                className="h-7 w-7 text-gray-400 hover:text-white"
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div 
                                            className="p-3 flex items-start gap-2 cursor-pointer"
                                            onClick={() => onSelectConversation(conv.id)}
                                        >
                                            <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white truncate">{conv.name}</p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {conv.messages?.filter(m => m.role !== 'system').length || 0} messages
                                                </p>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingId(conv.id);
                                                        setEditName(conv.name);
                                                    }}
                                                    className="h-6 w-6 text-gray-400 hover:text-cyan-400"
                                                >
                                                    <Edit2 className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (confirm('Delete this chat?')) {
                                                            onDeleteConversation(conv.id);
                                                        }
                                                    }}
                                                    className="h-6 w-6 text-gray-400 hover:text-red-400"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            {conversations.length === 0 && (
                                <div className="text-center py-8 text-gray-500 text-sm">
                                    No chats yet
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
