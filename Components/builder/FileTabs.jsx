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
            
            {isAdding ? (
                <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1">
                    <Input
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddFile();
                            if (e.key === 'Escape') setIsAdding(false);
                        }}
                        placeholder="filename.ext"
                        className="h-6 w-32 text-xs bg-transparent border-none text-white px-1"
                        autoFocus
                    />
                    <Button
                        size="icon"
                        onClick={handleAddFile}
                        className="h-6 w-6 bg-green-500/20 hover:bg-green-500/30"
                    >
                        <FileCode className="h-3 w-3 text-green-400" />
                    </Button>
                </div>
            ) : (
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsAdding(true)}
                    className="h-7 text-gray-400 hover:text-white"
                >
                    <Plus className="h-3 w-3 mr-1" />
                    Add File
                </Button>
            )}
        </div>
    );
}
