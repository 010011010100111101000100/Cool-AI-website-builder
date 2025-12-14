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
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-white font-medium">{filename}</span>
                        {code && (
                            <>
                                <span className="text-xs text-gray-500">
                                    {lineNumbers} lines
                                </span>
                                <div className="flex gap-1 ml-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleCopy}
                                        className={cn(
                                            "h-7 px-2 text-xs text-gray-400 hover:text-white transition-all",
                                            copied && "text-green-400 hover:text-green-400"
                                        )}
                                    >
                                        {copied ? (
                                            <Check className="h-3 w-3 mr-1" />
                                        ) : (
                                            <Copy className="h-3 w-3 mr-1" />
                                        )}
                                        {copied ? 'Copied' : 'Copy'}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleDownload}
                                        className="h-7 px-2 text-xs text-gray-400 hover:text-white"
                                    >
                                        <Download className="h-3 w-3 mr-1" />
                                        Export
                                    </Button>
                                    {onExplainCode && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onExplainCode(code)}
                                            className="h-7 px-2 text-xs text-gray-400 hover:text-white"
                                        >
                                            <Lightbulb className="h-3 w-3 mr-1" />
                                            Explain All
                                        </Button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
                </div>

                {/* Search Bar */}
                {showSearch && (
                <div className="px-4 py-2 border-b border-white/10 bg-[#0d1117] flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search in code..."
                        className="h-8 bg-white/5 border-white/10 text-white text-sm flex-1"
                        autoFocus
                    />
                    {searchResults.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">
                                {currentSearchIndex + 1} of {searchResults.length}
                            </span>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setCurrentSearchIndex(Math.max(0, currentSearchIndex - 1))}
                                className="h-6 w-6 text-gray-400"
                                disabled={currentSearchIndex === 0}
                            >
                                <ChevronUp className="h-3 w-3" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setCurrentSearchIndex(Math.min(searchResults.length - 1, currentSearchIndex + 1))}
                                className="h-6 w-6 text-gray-400"
                                disabled={currentSearchIndex === searchResults.length - 1}
                            >
                                <ChevronDown className="h-3 w-3" />
                            </Button>
                        </div>
                    )}
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                            setShowSearch(false);
                            setSearchTerm('');
                        }}
                        className="h-6 w-6 text-gray-400"
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
                )}

                {/* Code Area */}
            <div ref={containerRef} className="flex-1 overflow-auto bg-[#0d1117] relative" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                {/* Selection Explain Button */}
                {selectedText && selectionPosition && onExplainCode && (
                    <div
                        className="absolute z-50"
                        style={{
                            top: selectionPosition.top - 40,
                            left: selectionPosition.left,
                        }}
                    >
                        <Button
                            onClick={() => {
                                onExplainCode(selectedText);
                                setSelectedText('');
                                setSelectionPosition(null);
                            }}
                            size="sm"
                            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 shadow-lg h-8 text-xs"
                        >
                            <Lightbulb className="h-3 w-3 mr-1" />
                            Explain Selection
                        </Button>
                    </div>
                )}
                
                {/* Coding Animation Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-[#0d1117]/80 backdrop-blur-sm z-10 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <div className="relative mb-6">
                                {/* Animated Code Brackets */}
                                <div className="text-6xl font-mono text-cyan-400 animate-pulse">
                                    <span className="inline-block animate-bounce" style={{ animationDelay: '0s' }}>&lt;</span>
                                    <span className="inline-block animate-bounce" style={{ animationDelay: '0.1s' }}>/</span>
                                    <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>&gt;</span>
                                </div>
                                {/* Glow Effect */}
                                <div className="absolute inset-0 blur-2xl bg-cyan-500/30 animate-pulse" />
                            </div>
                            <div className="flex items-center gap-3 text-cyan-400">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span className="text-lg font-medium">AI Coding</span>
                                <div className="flex gap-1">
                                    <span className="animate-bounce" style={{ animationDelay: '0s' }}>.</span>
                                    <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                                    <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm mt-2">Generating your website...</p>
                        </div>
                    </div>
                )}
                
                {code ? (
                    <div className="flex">
                        {/* Line Numbers */}
                        <div className="flex-shrink-0 px-4 py-4 text-right select-none border-r border-white/5">
                            {Array.from({ length: lineNumbers }, (_, i) => (
                                <div key={i} className="text-xs text-gray-600 font-mono leading-6">
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                        
                        {/* Code Content */}
                        <pre className="flex-1 p-4" style={{ whiteSpace: 'pre', overflowWrap: 'normal', overflow: 'visible' }}>
                            <code 
                                className="text-sm font-mono leading-6 text-gray-300"
                                style={{ display: 'inline-block', minWidth: 'max-content' }}
                                dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
                            />
                            <div ref={codeEndRef} />
                        </pre>
                    </div>
                ) : !isLoading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="h-24 w-24 mx-auto rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 flex items-center justify-center mb-4">
                                <FileCode className="h-12 w-12 text-gray-600" />
                            </div>
                            <p className="text-gray-500">Generated code will appear here</p>
                            <p className="text-gray-600 text-sm mt-1">Copy or export when ready</p>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
