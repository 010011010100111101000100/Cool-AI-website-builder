import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Monitor, Tablet, Smartphone, RefreshCw, ExternalLink, Maximize, Minimize, Maximize2 } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function PreviewPanel({ code }) {
    const [device, setDevice] = useState('desktop');
    const [key, setKey] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [autoFit, setAutoFit] = useState(false);
    
    const deviceSizes = {
        desktop: 'w-full',
        tablet: 'w-[768px]',
        mobile: 'w-[375px]'
    };
    
    const fullHtml = code ? `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
            </style>
        </head>
        <body>
            ${code}
        </body>
        </html>
    ` : '';
    
    const openInNewTab = () => {
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    };
    
    return (
        <div className={cn(
            "flex flex-col h-full transition-all duration-300 overflow-hidden",
            isFullscreen && "fixed inset-0 z-50 bg-[#0a0a0f]"
        )}>
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-red-500/80" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                        <div className="h-3 w-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-sm text-gray-400 ml-2">Live Preview</span>
                </div>
                
                <div className="flex items-center gap-2">
                    {/* Device Toggle */}
                    <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                        {[
                            { id: 'desktop', icon: Monitor },
                            { id: 'tablet', icon: Tablet },
                            { id: 'mobile', icon: Smartphone }
                        ].map(({ id, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setDevice(id)}
                                className={cn(
                                    "p-2 rounded-md transition-all",
                                    device === id 
                                        ? "bg-cyan-500/20 text-cyan-400" 
                                        : "text-gray-500 hover:text-gray-300"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                            </button>
                        ))}
                    </div>
                    
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setKey(k => k + 1)}
                        className="text-gray-400 hover:text-white"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    
                    {code && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setAutoFit(!autoFit)}
                                className={cn(
                                    "text-gray-400 hover:text-white",
                                    autoFit && "text-cyan-400"
                                )}
                            >
                                <Maximize2 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                className="text-gray-400 hover:text-white"
                            >
                                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={openInNewTab}
                                className="text-gray-400 hover:text-white"
                            >
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                </div>
            </div>
            
            {/* Preview Area */}
            <div className="flex-1 p-4 bg-[#0a0a0f]/50 flex justify-center items-center overflow-auto" style={{ minHeight: 0 }}>
                {code ? (
                    <div className={cn(
                        "transition-all duration-300 bg-white rounded-lg overflow-hidden shadow-2xl",
                        autoFit ? "w-full h-full" : deviceSizes[device],
                        !autoFit && device === 'desktop' && "w-full h-full",
                        !autoFit && device !== 'desktop' && "h-full"
                    )}>
                        <iframe
                            key={key}
                            srcDoc={fullHtml}
                            className="w-full h-full border-0"
                            sandbox="allow-scripts"
                            title="Website Preview"
                        />
                    </div>
                ) : (
                    <div className="h-full w-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="h-24 w-24 mx-auto rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 flex items-center justify-center mb-4">
                                <Monitor className="h-12 w-12 text-gray-600" />
                            </div>
                            <p className="text-gray-500">Your website preview will appear here</p>
                            <p className="text-gray-600 text-sm mt-1">Start by describing what you want to build</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
