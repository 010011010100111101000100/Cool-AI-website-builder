import React from 'react';
import { Toaster } from "sonner";

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-[#0a0a0f]" style={{ background: '#0a0a0f' }}>
            <style>{`
                body, html {
                    background: #0a0a0f !important;
                    margin: 0;
                    padding: 0;
                }
                
                #root {
                    background: #0a0a0f !important;
                }
                :root {
                    --background: 0 0% 4%;
                    --foreground: 0 0% 98%;
                }
                
                * {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255,255,255,0.1) transparent;
                }
                
                *::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                
                *::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                *::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.1);
                    border-radius: 3px;
                }
                
                *::-webkit-scrollbar-thumb:hover {
                    background: rgba(255,255,255,0.2);
                }

                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 1; }
                }

                .glow-pulse {
                    animation: pulse-glow 2s ease-in-out infinite;
                }

                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-slide-in-up {
                    animation: slideInUp 0.3s ease-out;
                }
                
                /* Enhanced button hover glow effects */
                button, .button, a[role="button"] {
                    position: relative;
                    transition: all 0.3s ease;
                }
                
                button:hover:not(:disabled), .button:hover, a[role="button"]:hover {
                    transform: translateY(-1px);
                    filter: brightness(1.1);
                }
                
                button:not(:disabled)::before, .button::before {
                    content: '';
                    position: absolute;
                    inset: -2px;
                    border-radius: inherit;
                    background: linear-gradient(45deg, rgba(6, 182, 212, 0.4), rgba(168, 85, 247, 0.4));
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    z-index: -1;
                    filter: blur(8px);
                }
                
                button:hover:not(:disabled)::before, .button:hover::before {
                    opacity: 1;
                }
                
                /* Enhanced glow for primary buttons */
                button[class*="bg-gradient"]:hover:not(:disabled),
                button[class*="from-cyan"]:hover:not(:disabled),
                button[class*="from-purple"]:hover:not(:disabled) {
                    box-shadow: 0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(168, 85, 247, 0.3);
                }
                
                /* Subtle glow for ghost buttons */
                button[class*="ghost"]:hover:not(:disabled) {
                    box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
                }
                
                /* ULTRA AGGRESSIVE: Hide "Edit with base44" button - 15+ Methods */
                
                /* Method 1-5: Target all possible link variations */
                a[href*="base44"],
                a[href*="edit"],
                a[target="_blank"][href*="app"],
                [href*="base44.app"],
                [class*="edit-button"] {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                    position: fixed !important;
                    left: -99999px !important;
                    top: -99999px !important;
                }
                
                /* Method 6-8: Target by position */
                [style*="position: fixed"][style*="bottom"],
                [style*="position: fixed"][style*="right"],
                div[style*="z-index: 999"],
                div[style*="z-index: 9999"] {
                    display: none !important;
                }
                
                /* Method 9-11: Nuclear options */
                body > div:last-child:not(#root),
                body > a:last-child,
                body > div > a[target="_blank"] {
                    display: none !important;
                    visibility: hidden !important;
                }
                
                /* Method 12-14: Extreme targeting */
                * [href*="base44"] {
                    width: 0 !important;
                    height: 0 !important;
                    overflow: hidden !important;
                    clip: rect(0,0,0,0) !important;
                    clip-path: inset(100%) !important;
                }
                
                /* Method 15-17: Transform and filter */
                a[href*="base44"],
                a[href*="edit"] {
                    transform: scale(0) translateX(-9999px) !important;
                    filter: opacity(0) blur(999px) !important;
                    font-size: 0 !important;
                }
                
                /* Method 18-20: Content and display tricks */
                [href*="base44"]::before,
                [href*="base44"]::after {
                    content: none !important;
                }
                
                a[href*="edit"] {
                    content-visibility: hidden !important;
                    max-height: 0 !important;
                    max-width: 0 !important;
                }
                
                /* Ultra specific: bottom right patterns */
                .fixed.bottom-4.right-4,
                .fixed.bottom-6.right-6,
                div[class*="bottom"][class*="right"],
                [style*="bottom: 1rem"][style*="right: 1rem"],
                [style*="bottom: 20px"][style*="right: 20px"] {
                    display: none !important;
                }
                
                /* Catch all external links in bottom right */
                body > *[style*="position"][style*="fixed"] a,
                body > div[style*="fixed"] > a {
                    display: none !important;
                }
            `}</style>
            
            <Toaster 
                position="top-right"
                toastOptions={{
                    style: {
                        background: 'rgba(15, 18, 25, 0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white',
                        backdropFilter: 'blur(12px)'
                    }
                }}
            />
            
            {children}
        </div>
    );
}
