import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function SEOModal({ isOpen, onClose, seoAnalysis, isLoading, onApplyOptimizations }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-[#0f1219] border-white/20 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-green-400" />
                        </div>
                        SEO Optimization Analysis
                    </DialogTitle>
                    <p className="text-sm text-gray-400 mt-2">
                        AI-powered SEO recommendations and improvements
                    </p>
                </DialogHeader>
                
                <div className="py-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-12 w-12 text-green-400 animate-spin mb-4" />
                            <p className="text-gray-400">Analyzing SEO factors and generating recommendations...</p>
                        </div>
                    ) : seoAnalysis ? (
                        <div className="space-y-4">
                            <ReactMarkdown
                                className="prose prose-sm prose-invert max-w-none"
                                components={{
                                    h1: ({ children }) => (
                                        <h1 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5 text-green-400" />
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
                                    li: ({ children }) => {
                                        const text = String(children);
                                        const icon = text.includes('✅') ? (
                                            <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                                        ) : text.includes('❌') ? (
                                            <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                                        ) : (
                                            <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                                        );
                                        
                                        return (
                                            <li className="flex items-start gap-2 text-gray-300">
                                                {icon}
                                                <span>{children}</span>
                                            </li>
                                        );
                                    },
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
                                        <blockquote className="border-l-4 border-blue-500/50 pl-4 py-2 my-3 bg-blue-500/5">
                                            <div className="text-blue-200 text-sm">{children}</div>
                                        </blockquote>
                                    ),
                                }}
                            >
                                {seoAnalysis}
                            </ReactMarkdown>
                            
                            <div className="flex gap-3 pt-4 border-t border-white/10">
                                <Button
                                    onClick={onApplyOptimizations}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400"
                                >
                                    Apply SEO Optimizations
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
                            No SEO analysis available
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
