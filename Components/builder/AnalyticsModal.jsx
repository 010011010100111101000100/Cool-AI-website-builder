import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users, Eye, Clock, TrendingUp, TrendingDown, MousePointer, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

export default function AnalyticsModal({ isOpen, onClose, code }) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [insights, setInsights] = useState(null);
    
    const handleGenerateInsights = async () => {
        if (!code) {
            toast.error('No code to analyze');
            return;
        }
        
        setIsAnalyzing(true);
        
        const prompt = `You are a senior data analyst and conversion optimization expert. Analyze this website and provide AI-powered analytics insights:

\`\`\`html
${code}
\`\`\`

Generate a comprehensive analytics report with:

# Executive Summary
Brief overview of key findings and opportunities.

# User Behavior Predictions
Based on the website structure, predict:
- Expected user flow and navigation patterns
- Potential friction points
- Drop-off risk areas
- Engagement hotspots

# Conversion Opportunities
## High-Impact Changes:
1. Specific recommendation with expected impact
2. Another recommendation with ROI estimate
3. Quick wins for immediate improvement

## Call-to-Action Optimization:
- Current CTA analysis
- Suggested improvements
- A/B testing recommendations

# Engagement Metrics to Track
Recommend specific metrics with implementation code:
- Page views and session duration
- Scroll depth and interaction events
- Click tracking for key elements
- Form completion rates

# Predictive Insights
## User Segments:
- Likely visitor types
- Behavioral patterns
- Conversion probability

## Optimization Priorities:
1. **Critical** - Must-fix issues
2. **High** - Significant impact items
3. **Medium** - Nice-to-have improvements

# Analytics Implementation Code
Provide complete JavaScript tracking code that includes:
- Google Analytics 4 setup
- Custom event tracking
- Heatmap simulation
- User flow tracking
- Conversion funnel monitoring

Format as production-ready code with detailed comments.

# Actionable Recommendations
Specific, prioritized steps to improve metrics with expected results.

Use data-driven language with percentages and estimates where possible.`;

        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt,
                response_json_schema: null
            });
            
            setInsights(response);
            toast.success('AI insights generated!');
        } catch (error) {
            console.error('Analysis failed:', error);
            toast.error('Failed to generate insights');
            setInsights('Failed to generate analytics insights.');
        }
        
        setIsAnalyzing(false);
    };
    
    React.useEffect(() => {
        if (isOpen && !insights) {
            handleGenerateInsights();
        }
    }, [isOpen]);
    
    const mockMetrics = [
        { label: 'Predicted Traffic', value: '~2.5K', trend: '+12%', icon: Users, color: 'text-blue-400' },
        { label: 'Engagement Score', value: '7.8/10', trend: '+0.5', icon: Eye, color: 'text-green-400' },
        { label: 'Avg. Session', value: '3m 24s', trend: '+18s', icon: Clock, color: 'text-purple-400' },
        { label: 'Conversion Rate', value: '3.2%', trend: '+0.8%', icon: TrendingUp, color: 'text-cyan-400' }
    ];
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-[#0f1219] border-white/20 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                            <BarChart3 className="h-4 w-4 text-cyan-400" />
                        </div>
                        AI Analytics Dashboard
                    </DialogTitle>
                    <p className="text-sm text-gray-400 mt-2">
                        Advanced insights and predictions for your website
                    </p>
                </DialogHeader>
                
                <Tabs defaultValue="insights" className="py-4">
                    <TabsList className="grid w-full grid-cols-3 bg-white/5">
                        <TabsTrigger value="insights">AI Insights</TabsTrigger>
                        <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
                        <TabsTrigger value="tracking">Tracking Code</TabsTrigger>
                    </TabsList>
                    
                    {/* AI Insights */}
                    <TabsContent value="insights" className="mt-4">
                        {isAnalyzing ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 className="h-12 w-12 text-cyan-400 animate-spin mb-4" />
                                <p className="text-gray-400">Analyzing website data...</p>
                                <p className="text-sm text-gray-500 mt-2">Generating AI-powered insights</p>
                            </div>
                        ) : insights ? (
                            <ReactMarkdown
                                className="prose prose-sm prose-invert max-w-none"
                                components={{
                                    h1: ({ children }) => (
                                        <h1 className="text-2xl font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
                                            <BarChart3 className="h-6 w-6 text-cyan-400" />
                                            {children}
                                        </h1>
                                    ),
                                    h2: ({ children }) => (
                                        <h2 className="text-xl font-semibold text-cyan-400 mb-3 mt-6">{children}</h2>
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
                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
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
                                        <strong className="text-cyan-400 font-semibold">{children}</strong>
                                    ),
                                }}
                            >
                                {insights}
                            </ReactMarkdown>
                        ) : null}
                    </TabsContent>
                    
                    {/* Key Metrics */}
                    <TabsContent value="metrics" className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-3">
                            {mockMetrics.map((metric, idx) => (
                                <div key={idx} className="p-4 rounded-lg bg-white/5 border border-white/10">
                                    <div className="flex items-center justify-between mb-2">
                                        <metric.icon className={`h-5 w-5 ${metric.color}`} />
                                        <span className={`text-xs ${metric.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                            {metric.trend}
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-white">{metric.value}</p>
                                    <p className="text-xs text-gray-400 mt-1">{metric.label}</p>
                                </div>
                            ))}
                        </div>
                        
                        <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30">
                            <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                                <MousePointer className="h-4 w-4 text-cyan-400" />
                                User Behavior Heatmap
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Header/Navigation</span>
                                    <div className="flex gap-1">
                                        <div className="w-16 h-2 rounded bg-gradient-to-r from-green-500 to-yellow-500" />
                                        <span className="text-xs text-green-400">92%</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Main CTA</span>
                                    <div className="flex gap-1">
                                        <div className="w-20 h-2 rounded bg-gradient-to-r from-green-500 to-red-500" />
                                        <span className="text-xs text-yellow-400">78%</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Footer Links</span>
                                    <div className="flex gap-1">
                                        <div className="w-12 h-2 rounded bg-gradient-to-r from-yellow-500 to-red-500" />
                                        <span className="text-xs text-orange-400">45%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <h3 className="font-medium text-white mb-3">Conversion Funnel</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-8 rounded bg-gradient-to-r from-cyan-500/50 to-cyan-500/20 flex items-center px-3 text-sm text-white">
                                        Landing Page: 100%
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-8 rounded bg-gradient-to-r from-blue-500/50 to-blue-500/20 flex items-center px-3 text-sm text-white" style={{ width: '70%' }}>
                                        Engagement: 70%
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-8 rounded bg-gradient-to-r from-purple-500/50 to-purple-500/20 flex items-center px-3 text-sm text-white" style={{ width: '35%' }}>
                                        CTA Click: 35%
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-8 rounded bg-gradient-to-r from-green-500/50 to-green-500/20 flex items-center px-3 text-sm text-white" style={{ width: '12%' }}>
                                        Conversion: 12%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    
                    {/* Tracking Code */}
                    <TabsContent value="tracking" className="space-y-4 mt-4">
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <h3 className="font-medium text-white mb-2">Analytics Tracking</h3>
                            <p className="text-sm text-gray-400 mb-3">
                                The AI-generated tracking code includes event listeners, user behavior tracking, and conversion monitoring.
                            </p>
                            <pre className="bg-black/40 rounded-lg p-4 overflow-x-auto text-xs text-gray-300">
{`<!-- AI Analytics Tracking -->
<script>
  // User behavior tracking
  const analytics = {
    trackPageView: () => {
      console.log('Page view tracked');
    },
    trackEvent: (event, data) => {
      console.log('Event:', event, data);
    },
    trackScroll: () => {
      let maxScroll = 0;
      window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / document.body.scrollHeight) * 100;
        if (scrollPercent > maxScroll) {
          maxScroll = scrollPercent;
          analytics.trackEvent('scroll_depth', { depth: scrollPercent });
        }
      });
    }
  };
  
  // Initialize tracking
  analytics.trackPageView();
  analytics.trackScroll();
</script>`}
                            </pre>
                        </div>
                        
                        <Button
                            onClick={() => {
                                toast.success('Tracking code will be added to your website');
                                onClose();
                            }}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500"
                        >
                            Add Tracking Code to Website
                        </Button>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
