import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Lightbulb, Code2, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ExplanationModal({ isOpen, onClose, explanation, isLoading }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-[#0f1219] border-white/20 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
                            <Lightbulb className="h-4 w-4 text-cyan-400" />
                        </div>
                        AI Code Explanation
                    </DialogTitle>
                </DialogHeader>
                
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-12 w-12 text-cyan-400 animate-spin mb-4" />
                        <p className="text-gray-400">Analyzing code...</p>
                    </div>
                ) : explanation ? (
                    <div className="space-y-4">
                        <ReactMarkdown 
                            className="prose prose-invert prose-sm max-w-none"
                            components={{
                                h1: ({ children }) => <h1 className="text-xl font-bold text-cyan-400 mt-4 mb-2">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-lg font-semibold text-purple-400 mt-3 mb-2">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-base font-semibold text-gray-300 mt-2 mb-1">{children}</h3>,
                                p: ({ children }) => <p className="text-gray-300 leading-relaxed my-2">{children}</p>,
                                code: ({ inline, children }) => inline ? (
                                    <code className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 text-sm font-mono">
                                        {children}
                                    </code>
                                ) : (
                                    <code className="block p-3 rounded-lg bg-black/40 text-gray-300 text-sm font-mono overflow-x-auto my-2">
                                        {children}
                                    </code>
                                ),
                                ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2 text-gray-300">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2 text-gray-300">{children}</ol>,
                                li: ({ children }) => <li className="ml-4">{children}</li>,
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-cyan-500/50 pl-4 italic text-gray-400 my-2">
                                        {children}
                                    </blockquote>
                                ),
                                strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                            }}
                        >
                            {explanation}
                        </ReactMarkdown>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
