import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquarePlus, Trash2, Edit2, Check, X, MessageSquare } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatSidebar({ 
    conversations, 
    activeConversationId, 
    onSelectConversation,
    onCreateConversation,
    onDeleteConversation,
    onRenameConversation 
}) {
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    
    const startEdit = (conv) => {
        setEditingId(conv.id);
        setEditName(conv.name);
    };
    
    const saveEdit = () => {
        if (editName.trim()) {
            onRenameConversation(editingId, editName.trim());
        }
        setEditingId(null);
    };
    
    return (
        <div className="w-64 border-r border-white/10 bg-[#0a0a0f]/50 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/10">
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
                <AnimatePresence>
                    {conversations.map((conv) => (
                        <motion.div
                            key={conv.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className={cn(
                                "group relative rounded-lg transition-all",
                                activeConversationId === conv.id
                                    ? "bg-white/10 border border-cyan-500/30"
                                    : "hover:bg-white/5 border border-transparent"
                            )}
                        >
                            {editingId === conv.id ? (
                                <div className="flex items-center gap-1 p-2">
                                    <Input
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') saveEdit();
                                            if (e.key === 'Escape') setEditingId(null);
                                        }}
                                        className="h-7 text-xs bg-white/5 border-white/20 text-white"
                                        autoFocus
                                    />
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={saveEdit}
                                        className="h-7 w-7"
                                    >
                                        <Check className="h-3 w-3 text-green-400" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setEditingId(null)}
                                        className="h-7 w-7"
                                    >
                                        <X className="h-3 w-3 text-red-400" />
                                    </Button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => onSelectConversation(conv.id)}
                                    className="w-full text-left p-3 flex items-start gap-2"
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
                                                startEdit(conv);
                                            }}
                                            className="h-6 w-6 text-gray-400 hover:text-white"
                                        >
                                            <Edit2 className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm('Delete this conversation?')) {
                                                    onDeleteConversation(conv.id);
                                                }
                                            }}
                                            className="h-6 w-6 text-gray-400 hover:text-red-400"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </button>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
                
                {conversations.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        No conversations yet
                    </div>
                )}
            </div>
        </div>
    );
}
