import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Download, Code2, FileCode, Loader2, Lightbulb, Search, X, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function CodePanel({ code, isLoading, filename = 'index.html', onExplainCode }) {
    const codeEndRef = useRef(null);
    const containerRef = useRef(null);
    const [copied, setCopied] = useState(false);
    const [selectedText, setSelectedText] = useState('');
    const [selectionPosition, setSelectionPosition] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
    
    // Auto-scroll to bottom when code updates
    useEffect(() => {
        if (code && isLoading && containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [code, isLoading]);
    
    // Handle text selection
    const handleTextSelection = () => {
        const selection = window.getSelection();
        const text = selection.toString().trim();
        
        if (text && containerRef.current?.contains(selection.anchorNode)) {
            setSelectedText(text);
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();
            
            setSelectionPosition({
                top: rect.top - containerRect.top + containerRef.current.scrollTop,
                left: rect.left - containerRect.left + containerRef.current.scrollLeft
            });
        } else {
            setSelectedText('');
            setSelectionPosition(null);
        }
    };
    
    useEffect(() => {
        document.addEventListener('selectionchange', handleTextSelection);
        return () => document.removeEventListener('selectionchange', handleTextSelection);
    }, []);
    
    // Search functionality
    useEffect(() => {
        if (searchTerm && code) {
            const matches = [];
            const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            let match;
            while ((match = regex.exec(code)) !== null) {
                matches.push(match.index);
            }
            setSearchResults(matches);
            setCurrentSearchIndex(0);
        } else {
            setSearchResults([]);
            setCurrentSearchIndex(0);
        }
    }, [searchTerm, code]);
    
    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                setShowSearch(true);
            }
            if (e.key === 'Escape') {
                setShowSearch(false);
            }
        };
        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, []);
    
    const handleCopy = async () => {
        if (!code) return;
        await navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success('Code copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };
    
    const handleDownload = () => {
        if (!code) return;
        
        const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
</head>
<body>
${code}
</body>
</html>`;
        
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'website.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('File downloaded!');
    };
    
    // Simple syntax highlighting
    const highlightCode = (code) => {
        if (!code) return '';
        
        return code
            .replace(/(&lt;|<)(\/?)([\w-]+)/g, '<span class="text-pink-400">&lt;$2$3</span>')
            .replace(/(\s)([\w-]+)(=)/g, '$1<span class="text-cyan-300">$2</span>$3')
            .replace(/(=)(".*?")/g, '$1<span class="text-amber-300">$2</span>')
            .replace(/(&gt;|>)/g, '<span class="text-pink-400">&gt;</span>')
            .replace(/(\/\*[\s\S]*?\*\/|\/\/.*$)/gm, '<span class="text-gray-500">$1</span>');
    };
    
    const lineNumbers = code ? code.split('\n').length : 0;
    
    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center">
                        <Code2 className="h-4 w-4 text-emerald-400" />
                    </div>
 
