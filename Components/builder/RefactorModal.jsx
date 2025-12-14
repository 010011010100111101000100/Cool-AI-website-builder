import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Code2, CheckCircle2, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function RefactorModal({ isOpen, onClose, refactorSuggestions, isLoading, onApplyRefactor }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-[#0f1219] border-white/20 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                            <Code2 className="h-4 w-4 text-purple-400" />
                        </div>
                        Code Refactoring Analysis
                    </DialogTitle>
                    <p className="text-sm text-gray-400 mt-2">
                        AI-powered code quality improvements and optimizations
                    </p>
                </DialogHeader>
                
                <div className="py-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-12 w-12 text-cyan-400 animate-spin mb-4" />
                            <p className="text-gray-400">Analyzing code structure and patterns...</p>
                        </div>
                    ) : refactorSuggestions ? (
                        <div className="space-y-4">
                            <ReactMarkdown
                                className="prose prose-sm prose-invert max-w-none"
                                components={{
                                    h1: ({ children }) => (
                                        <h1 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                            <Code2 className="h-5 w-5 text-purple-400" />
                                            {children}
                                        </h1>
                                    ),
                                    h2: ({ children }) => (
                                        <h2 className="text-lg font-semibold text-white mb-2 mt-6">{children}</h2>
                                    ),
                                    h3: ({ children }) => (
                                        <h3 className="text-base font-semibold text-cyan-400 mb-2 mt-4">{children}</h3>
                                    ),
                                    p: ({ children }) => (
                                        <p className="text-gray-300 mb-3 leading-relaxed">{children}</p>
                                    ),
                                    ul: ({ children }) => (
                                        <ul className="space-y-2 mb-4">{children}</ul>
                                    ),
                                    li: ({ children }) => (
                                        <li className="flex items-start gap-2 text-gray-300">
                                            <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                                            <span>{children}</span>
                                        </li>
                                    ),
                                    code: ({ inline, children }) => (
                                        inline ? (
                                            <code className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-400 text-xs">
                                                {children}
                                            </code>
                                        ) : (
                                            <pre className="bg-black/40 rounded-lg p-4 overflow-x-auto my-3 border border-white/10">
                                                <code className="text-sm text-gray-300">{children}</code>
                                            </pre>
                                        )
                                    ),
                                    blockquote: ({ children }) => (
                                        <blockquote className="border-l-4 border-yellow-500/50 pl-4 py-2 my-3 bg-yellow-500/5">
                                            <div className="flex items-start gap-2">
                                                <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                                                <div className="text-yellow-200 text-sm">{children}</div>
                                            </div>
                                        </blockquote>
                                    ),
                                }}
                            >
                                {refactorSuggestions}
                            </ReactMarkdown>
                            
                            <div className="flex gap-3 pt-4 border-t border-white/10">
                                <Button
                                    onClick={onApplyRefactor}
                                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400"
                                >
                                    Apply All Refactors
                                </Button>
                                <Button
                                    onClick={onClose}
                                    variant="ghost"
                                    className="text-gray-400 hover:text-white"
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            No refactoring suggestions available
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
