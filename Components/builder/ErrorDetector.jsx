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
                        <h3 className="text-red-400 font-semibold text-sm mb-1">
                            ⚠️ WARNING: ERROR DETECTED IN CODE
                        </h3>
                        <p className="text-red-300/80 text-xs mb-3 break-words">
                            {error}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleFix}
                                disabled={isFixing}
                                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white h-8 text-xs"
                            >
                                {isFixing ? (
                                    <>
                                        <Zap className="h-3 w-3 mr-2 animate-spin" />
                                        Fixing...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="h-3 w-3 mr-2" />
                                        Auto Fix
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={() => onFixError(error, true)}
                                disabled={isFixing}
                                variant="outline"
                                className="border-red-500/30 text-red-400 hover:bg-red-500/10 h-8 text-xs"
                            >
                                Debug Assistant
                            </Button>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsVisible(false)}
                        className="h-6 w-6 text-red-400 hover:text-red-300"
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
