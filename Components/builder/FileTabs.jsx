import React from 'react';
import { Button } from "@/components/ui/button";
import { X, Plus, FileCode } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useState } from 'react';

export default function FileTabs({ files, activeFile, onSelectFile, onAddFile, onDeleteFile }) {
    const [isAdding, setIsAdding] = useState(false);
    const [newFileName, setNewFileName] = useState('');
    
    const handleAddFile = () => {
        if (newFileName.trim()) {
            onAddFile(newFileName.trim());
            setNewFileName('');
            setIsAdding(false);
        }
    };
    
    const fileIcons = {
        html: '🌐',
        css: '🎨',
        js: '⚡',
        json: '📋'
    };
    
    const getFileIcon = (filename) => {
        const ext = filename.split('.').pop();
        return fileIcons[ext] || '📄';
    };
    
    return (
        <div className="flex items-center gap-1 px-2 py-2 bg-[#0a0a0f]/50 border-b border-white/10 overflow-x-auto">
            {Object.keys(files).map((filename) => (
                <div
                    key={filename}
                    className={cn(
                        "group flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-sm",
                        activeFile === filename
                            ? "bg-white/10 border-cyan-500/30 text-white"
                            : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                    )}
                >
                    <button
                        onClick={() => onSelectFile(filename)}
                        className="flex items-center gap-2"
                    >
                        <span>{getFileIcon(filename)}</span>
                        <span className="font-mono text-xs">{filename}</span>
                    </button>
                    {Object.keys(files).length > 1 && (
                        <button
                            onClick={() => onDeleteFile(filename)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="h-3 w-3 text-gray-400 hover:text-red-400" />
                        </button>
                    )}
                </div>
            ))}
 
