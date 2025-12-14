import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Code2, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const SNIPPETS = [
    {
        name: 'Responsive Navbar',
        category: 'Navigation',
        code: `<nav style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1rem; display: flex; justify-content: space-between; align-items: center;">
    <div style="color: white; font-size: 1.5rem; font-weight: bold;">Logo</div>
    <div style="display: flex; gap: 2rem;">
        <a href="#" style="color: white; text-decoration: none;">Home</a>
        <a href="#" style="color: white; text-decoration: none;">About</a>
        <a href="#" style="color: white; text-decoration: none;">Contact</a>
    </div>
</nav>`
    },
    {
        name: 'Card with Hover Effect',
        category: 'Components',
        code: `<div style="width: 300px; padding: 2rem; background: white; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: all 0.3s;" onmouseover="this.style.transform='translateY(-10px) scale(1.02)'; this.style.boxShadow='0 20px 40px rgba(0,0,0,0.2)'" onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.1)'">
    <h3 style="margin: 0 0 1rem 0;">Card Title</h3>
    <p style="color: #666;">This is a beautiful card with smooth hover effects.</p>
</div>`
    },
    {
        name: 'Gradient Button',
        category: 'Buttons',
        code: `<button style="padding: 0.75rem 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 0.5rem; font-size: 1rem; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);" onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.6)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 15px rgba(102, 126, 234, 0.4)'">
    Click Me
</button>`
    },
    {
        name: 'Loading Spinner',
        category: 'Animations',
        code: `<div style="width: 50px; height: 50px; border: 4px solid #f3f3f3; border-top: 4px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite;"></div>
<style>
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>`
    },
    {
        name: 'Glassmorphism Card',
        category: 'Components',
        code: `<div style="padding: 2rem; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 1rem; border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);">
    <h3 style="color: white; margin: 0 0 1rem 0;">Glassmorphism</h3>
    <p style="color: rgba(255, 255, 255, 0.8);">Modern glass effect design.</p>
</div>`
    },
    {
        name: 'Hero Section',
        category: 'Sections',
        code: `<div style="min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; text-align: center;">
    <h1 style="color: white; font-size: 3rem; margin: 0 0 1rem 0;">Welcome to Our Website</h1>
    <p style="color: rgba(255,255,255,0.9); font-size: 1.25rem; margin: 0 0 2rem 0;">Create amazing experiences with beautiful design</p>
    <button style="padding: 1rem 3rem; background: white; color: #667eea; border: none; border-radius: 0.5rem; font-size: 1.1rem; font-weight: bold; cursor: pointer;">Get Started</button>
</div>`
    }
];

export default function CodeSnippets({ isOpen, onClose, onInsertSnippet }) {
    const [copied, setCopied] = useState(null);
    
    const handleCopy = (code, idx) => {
        navigator.clipboard.writeText(code);
        setCopied(idx);
        toast.success('Snippet copied!');
        setTimeout(() => setCopied(null), 2000);
    };
    
    const handleInsert = (code) => {
        onInsertSnippet(code);
        toast.success('Snippet inserted!');
        onClose();
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-[#0f1219] border-white/20 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
                            <Code2 className="h-4 w-4 text-emerald-400" />
                        </div>
                        Code Snippets Library
                    </DialogTitle>
                    <p className="text-sm text-gray-400 mt-2">
                        Ready-to-use code snippets for common UI patterns
                    </p>
                </DialogHeader>
                
                <div className="space-y-3 py-4">
                    {SNIPPETS.map((snippet, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="p-4 rounded-xl bg-white/5 border border-white/10"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="font-semibold text-white">{snippet.name}</h3>
                                    <span className="text-xs text-cyan-400">{snippet.category}</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleCopy(snippet.code, idx)}
                                        className="h-8 text-gray-400 hover:text-white"
                                    >
                                        {copied === idx ? (
                                            <Check className="h-3 w-3 text-green-400" />
                                        ) : (
                                            <Copy className="h-3 w-3" />
                                        )}
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => handleInsert(snippet.code)}
                                        className="h-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400"
                                    >
                                        Insert
                                    </Button>
                                </div>
                            </div>
                            <pre className="bg-black/40 rounded-lg p-3 overflow-x-auto text-xs text-gray-300 border border-white/10">
                                <code>{snippet.code}</code>
                            </pre>
                        </motion.div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
