import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Bug, CheckCircle, AlertTriangle, Code } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function DebugModal({ isOpen, onClose, debugInfo, isLoading, onApplyFix }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-[#0f1219] border-white/20 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center">
                            <Bug className="h-4 w-4 text-red-400" />
                        </div>
                        AI Debugging Assistant
                    </DialogTitle>
                </DialogHeader>
                
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-12 w-12 text-red-400 animate-spin mb-4" />
                        <p className="text-gray-400">Analyzing error and generating fixes...</p>
                    </div>
                ) : debugInfo ? (
                    <div className="space-y-6">
                        <ReactMarkdown 
                            className="prose prose-invert prose-sm max-w-none"
                            components={{
                                h1: ({ children }) => (
                                    <h1 className="text-xl font-bold text-red-400 mt-4 mb-2 flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5" />
                                        {children}
                                    </h1>
                                ),
                                h2: ({ children }) => (
                                    <h2 className="text-lg font-semibold text-orange-400 mt-4 mb-2 flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4" />
                                        {children}
                                    </h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className="text-base font-semibold text-cyan-400 mt-3 mb-2">
                                        {children}
                                    </h3>
                                ),
                                p: ({ children }) => <p className="text-gray-300 leading-relaxed my-2">{children}</p>,
                                code: ({ inline, children }) => inline ? (
                                    <code className="px-1.5 py-0.5 rounded bg-white/10 text-green-300 text-sm font-mono">
                                        {children}
                                    </code>
                                ) : (
                                    <code className="block p-4 rounded-lg bg-black/50 text-gray-300 text-sm font-mono overflow-x-auto my-3 border border-white/10">
                                        {children}
                                    </code>
                                ),
                                ul: ({ children }) => <ul className="list-disc list-inside space-y-2 my-3 text-gray-300">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 my-3 text-gray-300">{children}</ol>,
                                li: ({ children }) => <li className="ml-4">{children}</li>,
                                strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                            }}
                        >
                            {debugInfo}
                        </ReactMarkdown>
                        
                        {onApplyFix && (
                            <div className="flex gap-3 pt-4 border-t border-white/10">
                                <Button
                                    onClick={onApplyFix}
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400"
                                >
                                    <Code className="h-4 w-4 mr-2" />
                                    Apply AI Fix
                                </Button>
                                <Button
                                    onClick={onClose}
                                    variant="outline"
                                    className="border-white/20 text-gray-300 hover:bg-white/5"
                                >
                                    Close
                                </Button>
                            </div>
                        )}
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
