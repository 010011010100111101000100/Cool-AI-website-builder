import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, Zap, Eye, TrendingUp, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function WebsiteAuditModal({ isOpen, onClose, code, onApplyFix }) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [auditResults, setAuditResults] = useState(null);
    
    const categories = [
        { id: 'performance', label: 'Performance', icon: Zap, color: 'text-yellow-400' },
        { id: 'accessibility', label: 'Accessibility', icon: Eye, color: 'text-blue-400' },
        { id: 'seo', label: 'SEO', icon: TrendingUp, color: 'text-green-400' },
        { id: 'bestPractices', label: 'Best Practices', icon: Shield, color: 'text-purple-400' }
    ];
    
    const handleAnalyze = async () => {
        if (!code) {
            toast.error('No code to analyze');
            return;
        }
        
        setIsAnalyzing(true);
        
        const prompt = `You are a senior web development auditor and performance expert. Perform a comprehensive audit of this website code:

\`\`\`html
${code}
\`\`\`

Provide a detailed audit report in the following format:

# Overall Score
Rate the website from 0-100 with a breakdown by category.

# Performance Analysis (Score: X/100)
## Issues Found:
- ⚠️ Issue 1 with severity (Critical/High/Medium/Low)
- ⚠️ Issue 2

## Recommendations:
1. Specific recommendation with code example
2. Another recommendation

## Code Fixes:
\`\`\`html
<!-- Show exact code changes needed -->
\`\`\`

# Accessibility Analysis (Score: X/100)
## Issues Found:
- ❌ Missing alt text on images
- ❌ Poor color contrast
- ⚠️ Missing ARIA labels

## Recommendations:
1. Add proper alt attributes to all images
2. Improve color contrast to meet WCAG AA standards
3. Add ARIA labels to interactive elements

## Code Fixes:
\`\`\`html
<!-- Accessibility improvements -->
\`\`\`

# SEO Analysis (Score: X/100)
## Issues Found:
- ❌ Missing meta description
- ⚠️ No Open Graph tags
- ⚠️ Missing structured data

## Recommendations:
1. Add comprehensive meta tags
2. Implement Open Graph for social sharing
3. Add JSON-LD structured data

## Code Fixes:
\`\`\`html
<!-- SEO improvements -->
\`\`\`

# Best Practices Analysis (Score: X/100)
## Issues Found:
- ⚠️ Inline styles instead of CSS classes
- ⚠️ Missing DOCTYPE
- ⚠️ Non-semantic HTML

## Recommendations:
1. Use external CSS or style tags
2. Add proper HTML structure
3. Use semantic HTML5 elements

## Code Fixes:
\`\`\`html
<!-- Best practice improvements -->
\`\`\`

# Priority Action Items
1. Most critical fix (High Priority)
2. Second priority fix
3. Third priority fix

Use ✅ for good, ❌ for critical issues, ⚠️ for warnings. Be specific with code examples.`;

        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt,
                response_json_schema: null
            });
            
            setAuditResults(response);
            toast.success('Audit complete!');
        } catch (error) {
            console.error('Audit failed:', error);
            toast.error('Failed to analyze website');
            setAuditResults('Failed to perform audit. Please try again.');
        }
        
        setIsAnalyzing(false);
    };
    
    React.useEffect(() => {
        if (isOpen && !auditResults) {
            handleAnalyze();
        }
    }, [isOpen]);
    
    const getScoreColor = (score) => {
        if (score >= 90) return 'text-green-400';
        if (score >= 70) return 'text-yellow-400';
        if (score >= 50) return 'text-orange-400';
        return 'text-red-400';
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-[#0f1219] border-white/20 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center">
                            <Shield className="h-4 w-4 text-purple-400" />
                        </div>
                        Website Audit Report
                    </DialogTitle>
                    <p className="text-sm text-gray-400 mt-2">
                        AI-powered analysis of performance, accessibility, SEO, and best practices
                    </p>
                </DialogHeader>
                
                <div className="py-4">
                    {/* Category Pills */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {categories.map(cat => (
                            <div key={cat.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                                <cat.icon className={`h-4 w-4 ${cat.color}`} />
                                <span className="text-sm text-gray-300">{cat.label}</span>
                            </div>
                        ))}
                    </div>
                    
                    {isAnalyzing ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="h-12 w-12 text-purple-400 animate-spin mb-4" />
                            <p className="text-gray-400">Analyzing website code...</p>
                            <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                        </div>
                    ) : auditResults ? (
                        <div className="space-y-4">
                            <ReactMarkdown
                                className="prose prose-sm prose-invert max-w-none"
                                components={{
                                    h1: ({ children }) => (
                                        <h1 className="text-2xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
                                            <Shield className="h-6 w-6 text-purple-400" />
                                            {children}
                                        </h1>
                                    ),
                                    h2: ({ children }) => {
                                        const text = String(children);
                                        const scoreMatch = text.match(/Score:\s*(\d+)/);
                                        const score = scoreMatch ? parseInt(scoreMatch[1]) : null;
                                        
                                        return (
                                            <h2 className="text-xl font-semibold text-white mb-3 mt-6 flex items-center justify-between">
                                                <span>{children}</span>
                                                {score !== null && (
                                                    <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                                                        {score}
                                                    </span>
                                                )}
                                            </h2>
                                        );
                                    },
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
                                        const icon = text.includes('✅') || text.includes('✓') ? (
                                            <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                                        ) : text.includes('❌') || text.includes('Critical') ? (
                                            <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                                        ) : (
                                            <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                                        );
                                        
                                        return (
                                            <li className="flex items-start gap-2 text-gray-300 text-sm">
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
                                    ol: ({ children }) => (
                                        <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-300">{children}</ol>
                                    ),
                                }}
                            >
                                {auditResults}
                            </ReactMarkdown>
                            
                            <div className="flex gap-3 pt-4 border-t border-white/10 sticky bottom-0 bg-[#0f1219] pb-4">
                                <Button
                                    onClick={() => {
                                        onApplyFix();
                                        onClose();
                                    }}
                                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500"
                                >
                                    Apply All Fixes
                                </Button>
                                <Button
                                    onClick={handleAnalyze}
                                    variant="ghost"
                                    className="text-gray-400 hover:text-white"
                                >
                                    Re-analyze
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            Click Analyze to start the audit
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
