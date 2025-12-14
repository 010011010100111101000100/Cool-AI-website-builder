import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Loader2, ThumbsUp, ThumbsDown, AlertCircle, Lightbulb } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

export default function FeedbackAnalysisModal({ isOpen, onClose, onApplySuggestions }) {
    const [feedback, setFeedback] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    
    const handleAnalyze = async () => {
        if (!feedback.trim()) {
            toast.error('Please enter feedback to analyze');
            return;
        }
        
        setIsAnalyzing(true);
        
        const prompt = `You are an expert UX researcher and product analyst. Analyze this user feedback and provide actionable insights:

USER FEEDBACK:
${feedback}

Provide a comprehensive analysis in this format:

# Sentiment Analysis
Overall sentiment: [Positive/Negative/Neutral/Mixed] (with confidence %)
Emotional tone: [Description]

# Key Themes Identified
1. **Theme 1**: Description
2. **Theme 2**: Description
3. **Theme 3**: Description

# Common Issues & Pain Points
- ❌ Issue 1 (Severity: High/Medium/Low)
- ❌ Issue 2
- ⚠️ Issue 3

# User Needs & Expectations
- What users want
- What's missing
- What's confusing

# Actionable Recommendations

## High Priority (Immediate Action):
1. **Recommendation 1**
   - Why: [Explanation]
   - Code Solution:
   \`\`\`html
   <!-- Specific code changes -->
   \`\`\`

2. **Recommendation 2**
   - Why: [Explanation]
   - Code Solution:
   \`\`\`html
   <!-- Code fix -->
   \`\`\`

## Medium Priority (Short Term):
- Improvement suggestions with code examples

## Low Priority (Nice to Have):
- Future enhancements

# Content Improvements
Specific text/copy changes to address feedback:
- Original: "..."
- Improved: "..."

# UX/UI Changes
Visual and interaction improvements with implementation details.

# Expected Impact
- User satisfaction: [Prediction]
- Conversion rate: [Estimate]
- Engagement: [Forecast]

Be specific with code examples and prioritize based on impact.`;

        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt,
                response_json_schema: null
            });
            
            setAnalysis(response);
            toast.success('Feedback analyzed!');
        } catch (error) {
            console.error('Analysis failed:', error);
            toast.error('Failed to analyze feedback');
        }
        
        setIsAnalyzing(false);
    };
    
    const getSentimentIcon = () => {
        if (!analysis) return MessageSquare;
        const text = analysis.toLowerCase();
        if (text.includes('positive')) return ThumbsUp;
        if (text.includes('negative')) return ThumbsDown;
        return AlertCircle;
    };
    
    const SentimentIcon = getSentimentIcon();
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-[#0f1219] border-white/20 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
                            <MessageSquare className="h-4 w-4 text-blue-400" />
                        </div>
                        AI Feedback Analysis
                    </DialogTitle>
                    <p className="text-sm text-gray-400 mt-2">
                        Analyze user feedback to identify issues and generate solutions
                    </p>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">User Feedback</label>
                        <Textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Paste user comments, reviews, or form responses here...&#10;&#10;Example:&#10;- 'The button is hard to find'&#10;- 'Love the design but checkout is confusing'&#10;- 'Too many steps to complete signup'"
                            className="bg-white/5 border-white/10 text-white min-h-[120px]"
                        />
                    </div>
                    
                    <Button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !feedback.trim()}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Lightbulb className="h-4 w-4 mr-2" />
                                Analyze Feedback
                            </>
                        )}
                    </Button>
                    
                    {analysis && (
                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-2 mb-4">
                                <SentimentIcon className={`h-5 w-5 ${
                                    SentimentIcon === ThumbsUp ? 'text-green-400' :
                                    SentimentIcon === ThumbsDown ? 'text-red-400' :
                                    'text-yellow-400'
                                }`} />
                                <span className="text-sm text-gray-400">Analysis Complete</span>
                            </div>
                            
                            <ReactMarkdown
                                className="prose prose-sm prose-invert max-w-none"
                                components={{
                                    h1: ({ children }) => (
                                        <h1 className="text-2xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
                                            {children}
                                        </h1>
                                    ),
                                    h2: ({ children }) => (
                                        <h2 className="text-xl font-semibold text-blue-400 mb-3 mt-6">{children}</h2>
                                    ),
                                    h3: ({ children }) => (
                                        <h3 className="text-base font-semibold text-purple-400 mb-2 mt-4">{children}</h3>
                                    ),
                                    p: ({ children }) => (
                                        <p className="text-gray-300 mb-3 leading-relaxed">{children}</p>
                                    ),
                                    ul: ({ children }) => (
                                        <ul className="space-y-2 mb-4">{children}</ul>
                                    ),
                                    li: ({ children }) => (
                                        <li className="flex items-start gap-2 text-gray-300 text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
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
                                    ol: ({ children }) => (
                                        <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-300">{children}</ol>
                                    ),
                                    strong: ({ children }) => (
                                        <strong className="text-blue-400 font-semibold">{children}</strong>
                                    ),
                                }}
                            >
                                {analysis}
                            </ReactMarkdown>
                            
                            <div className="flex gap-3 pt-4 border-t border-white/10 sticky bottom-0 bg-[#0f1219] pb-4">
                                <Button
                                    onClick={() => {
                                        onApplySuggestions(analysis);
                                        onClose();
                                    }}
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500"
                                >
                                    Apply Recommendations
                                </Button>
                                <Button
                                    onClick={() => setAnalysis(null)}
                                    variant="ghost"
                                    className="text-gray-400 hover:text-white"
                                >
                                    New Analysis
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
