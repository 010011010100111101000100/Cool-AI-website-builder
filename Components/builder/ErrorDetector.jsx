import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, Zap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ErrorDetector({ code, onFixError }) {
    const [error, setError] = useState(null);
    const [isFixing, setIsFixing] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    
    useEffect(() => {
        if (!code) {
            setError(null);
            return;
        }
        
        // Create iframe to detect runtime errors
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        const iframeWindow = iframe.contentWindow;
        let detectedError = null;
        
        // Override console.error
        iframeWindow.console.error = (...args) => {
            detectedError = args.join(' ');
        };
        
        // Catch runtime errors
        iframeWindow.onerror = (msg, url, line, col, error) => {
            detectedError = `${msg} at line ${line}:${col}`;
            return true;
        };
        
        try {
            const doc = iframeWindow.document;
            doc.open();
            doc.write(code);
            doc.close();
            
            // Check for syntax errors in scripts
            const scripts = doc.querySelectorAll('script');
            scripts.forEach((script, idx) => {
                try {
                    new Function(script.textContent);
                } catch (e) {
                    detectedError = `JavaScript Error in script ${idx + 1}: ${e.message}`;
                }
            });
            
        } catch (e) {
            detectedError = e.message;
        }
        
        setTimeout(() => {
            document.body.removeChild(iframe);
            if (detectedError) {
                setError(detectedError);
                setIsVisible(true);
            } else {
                setError(null);
            }
        }, 100);
        
    }, [code]);
    
    const handleFix = async () => {
        setIsFixing(true);
        await onFixError(error);
        setIsFixing(false);
    };
    
    if (!error || !isVisible) return null;
    
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500/10 border border-red-500/50 backdrop-blur-xl rounded-xl p-4 shadow-2xl max-w-2xl"
            >
                <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-red-400 animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0">
 
