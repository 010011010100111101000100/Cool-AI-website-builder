import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Code2, Wand2, Image as ImageIcon, Palette, Smartphone, Zap, FileCode, Globe, Download, Sparkles, Clock, Maximize2, Command, Boxes, BookOpen, TrendingUp, RefreshCw, Shield, Server, Users, BarChart3, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ChatPanel from '@/components/builder/ChatPanel';
import PreviewPanel from '@/components/builder/PreviewPanel';
import CodePanel from '@/components/builder/CodePanel';
import FileTabs from '@/components/builder/FileTabs';
import ChatMenu from '@/components/builder/ChatMenu';
import ErrorDetector from '@/components/builder/ErrorDetector';
import ExplanationModal from '@/components/builder/ExplanationModal';
import DebugModal from '@/components/builder/DebugModal';
import TemplateGallery from '@/components/builder/TemplateGallery';
import VersionHistory from '@/components/builder/VersionHistory';
import KeyboardShortcuts from '@/components/builder/KeyboardShortcuts';
import CodeSnippets from '@/components/builder/CodeSnippets';
import TutorialModal from '@/components/builder/TutorialModal';
import RefactorModal from '@/components/builder/RefactorModal';
import SEOModal from '@/components/builder/SEOModal';
import ImageGeneratorModal from '@/components/builder/ImageGeneratorModal';
import ImageEditorModal from '@/components/builder/ImageEditorModal';
import DeploymentModal from '@/components/builder/DeploymentModal';
import WebsiteAuditModal from '@/components/builder/WebsiteAuditModal';
import PersonalizationModal from '@/components/builder/PersonalizationModal';
import AnalyticsModal from '@/components/builder/AnalyticsModal';
import FeedbackAnalysisModal from '@/components/builder/FeedbackAnalysisModal';
import { motion, AnimatePresence } from 'framer-motion';
import JSZip from 'jszip';
import { toast } from 'sonner';

const SYSTEM_PROMPT = `You are an elite, world-class web developer and UI/UX designer with 15+ years of experience. You create stunning, production-ready, FULLY FUNCTIONAL websites and web applications that rival the best sites on the internet.

CRITICAL EXCELLENCE STANDARDS:
1. OUTPUT: Only HTML code - no explanations, no markdown blocks, no extra text
2. STRUCTURE: All CSS in <style>, all JavaScript in <script> - self-contained and complete
3. FUNCTIONALITY: Every interactive element MUST work flawlessly - games are fully playable, forms validate, animations are smooth
4. CODE QUALITY: Write professional, clean, optimized code with proper architecture and best practices
5. GAMES: Complete game engines with physics, collision detection, scoring, levels, sound effects (if requested), polished UI, pause/restart
6. DESIGN: Use cutting-edge design trends - glassmorphism, neumorphism, subtle gradients, micro-interactions, perfect spacing
7. RESPONSIVENESS: Flawless on all devices - mobile-first approach with perfect breakpoints
8. COLORS: Sophisticated color palettes with proper contrast, accessibility (WCAG AA), harmonious combinations
9. TYPOGRAPHY: Professional font pairings, proper hierarchy, perfect line-height and letter-spacing
10. ANIMATIONS: Smooth 60fps animations using CSS transforms and requestAnimationFrame, proper easing functions
11. IMAGES: Use high-quality Unsplash images with specific, relevant search terms
12. INTERACTIVITY: Advanced user interactions - drag and drop, keyboard shortcuts, touch gestures, smooth scrolling
13. PERFORMANCE: Optimized JavaScript, efficient DOM manipulation, lazy loading where appropriate
14. ACCESSIBILITY: Semantic HTML5, ARIA labels, keyboard navigation, screen reader friendly
15. CONTEXT MEMORY: Remember ALL previous conversation and incrementally improve the code
16. ERROR HANDLING: Comprehensive error prevention, input validation, edge case handling
17. MODERN FEATURES: Use latest CSS (container queries, :has(), accent-color), modern JS (ES6+, optional chaining)
18. POLISH: Add loading states, success/error feedback, empty states, tooltips, and delightful details

Think like a senior developer at a top tech company. Every detail matters. Create experiences users love.`;

const QUICK_ACTIONS = [
    { icon: Wand2, label: 'AI Enhance', prompt: 'Enhance the design with better colors, animations, and modern UI elements' },
    { icon: Palette, label: 'New Theme', prompt: 'Apply a completely new modern color theme with gradients' },
    { icon: Smartphone, label: 'Mobile First', prompt: 'Optimize for mobile devices with perfect responsive design' },
    { icon: Zap, label: 'Add Animations', prompt: 'Add smooth animations and transitions throughout' },
];

export default function Home() {
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [files, setFiles] = useState({ 'index.html': '' });
    const [activeFile, setActiveFile] = useState('index.html');
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('preview');
    const [showExplanation, setShowExplanation] = useState(false);
    const [explanation, setExplanation] = useState('');
    const [isExplaining, setIsExplaining] = useState(false);
    const [showDebugModal, setShowDebugModal] = useState(false);
    const [debugInfo, setDebugInfo] = useState('');
    const [isDebugging, setIsDebugging] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const [showVersionHistory, setShowVersionHistory] = useState(false);
    const [versions, setVersions] = useState([]);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [showSnippets, setShowSnippets] = useState(false);
    const [commandPalette, setCommandPalette] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);
    const [currentTutorial, setCurrentTutorial] = useState(null);
    const [showRefactor, setShowRefactor] = useState(false);
    const [refactorSuggestions, setRefactorSuggestions] = useState('');
    const [isRefactoring, setIsRefactoring] = useState(false);
    const [showSEO, setShowSEO] = useState(false);
    const [seoAnalysis, setSeoAnalysis] = useState('');
    const [isAnalyzingSEO, setIsAnalyzingSEO] = useState(false);
    const [showImageGenerator, setShowImageGenerator] = useState(false);
    const [showImageEditor, setShowImageEditor] = useState(false);
    const [editingImageUrl, setEditingImageUrl] = useState(null);
    const [showDeployment, setShowDeployment] = useState(false);
    const [showAudit, setShowAudit] = useState(false);
    const [localHostUrl, setLocalHostUrl] = useState(null);
    const [showPersonalization, setShowPersonalization] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    
    const queryClient = useQueryClient();
    
    // Fetch conversations
    const { data: conversations = [] } = useQuery({
        queryKey: ['conversations'],
        queryFn: () => base44.entities.Conversation.list('-updated_date'),
        initialData: [],
    });
    
    // Get active conversation
    const activeConversation = conversations.find(c => c.id === activeConversationId);
    const messages = activeConversation?.messages || [{ role: 'system', content: SYSTEM_PROMPT }];
    
    // Create conversation
    const createConversation = useMutation({
        mutationFn: () => base44.entities.Conversation.create({
            name: `Chat ${new Date().toLocaleTimeString()}`,
            messages: [{ role: 'system', content: SYSTEM_PROMPT }],
            files: { 'index.html': '' },
            active_file: 'index.html'
        }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            setActiveConversationId(data.id);
            setFiles({ 'index.html': '' });
            setActiveFile('index.html');
        },
    });
    
    // Update conversation
    const updateConversation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.Conversation.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
    });
    
    // Delete conversation
    const deleteConversation = useMutation({
        mutationFn: (id) => base44.entities.Conversation.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
    });
    
    // Initialize first conversation
    useEffect(() => {
        if (conversations.length === 0 && !createConversation.isPending) {
            createConversation.mutate();
        } else if (conversations.length > 0 && !activeConversationId) {
            const conv = conversations[0];
            setActiveConversationId(conv.id);
            setFiles(conv.files || { 'index.html': '' });
            setActiveFile(conv.active_file || 'index.html');
        }
    }, [conversations.length]);
    
    // Update files when switching conversations
    useEffect(() => {
        if (activeConversation) {
            setFiles(activeConversation.files || { 'index.html': '' });
            setActiveFile(activeConversation.active_file || 'index.html');
            setVersions(activeConversation.versions || []);
        }
    }, [activeConversationId]);
    
    // Save version when code changes
    useEffect(() => {
        if (files['index.html'] && activeConversationId && !isLoading) {
            const timer = setTimeout(() => {
                const newVersion = {
                    id: Date.now(),
                    timestamp: new Date().toISOString(),
                    code: files['index.html'],
                    description: messages[messages.length - 1]?.content?.substring(0, 100) || 'Code update'
                };
                const updatedVersions = [newVersion, ...versions].slice(0, 20);
                setVersions(updatedVersions);
                updateConversation.mutate({
                    id: activeConversationId,
                    data: { versions: updatedVersions }
                });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [files['index.html']]);
    
    // Global keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            if ((e.ctrlKey || e.metaKey)) {
                if (e.key === 'k') {
                    e.preventDefault();
                    setCommandPalette(true);
                }
                if (e.key === 's') {
                    e.preventDefault();
                    handleExportProject();
                }
                if (e.key === 'e') {
                    e.preventDefault();
                    setActiveTab('code');
                }
                if (e.key === 'p') {
                    e.preventDefault();
                    setActiveTab('preview');
                }
                if (e.key === '/') {
                    e.preventDefault();
                    setShowShortcuts(true);
                }
            }
        };
        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, []);
    
    const handleSendMessage = async (content) => {
        if (!activeConversationId) return;
        
        const userMessage = { role: 'user', content, timestamp: new Date().toISOString() };
        const newMessages = [...messages, userMessage];
        
        // Save user message immediately
        await updateConversation.mutateAsync({
            id: activeConversationId,
            data: { messages: newMessages }
        });
        
        setIsLoading(true);
        setActiveTab('code');
        
        const conversationHistory = newMessages
            .filter(m => m.role !== 'system')
            .map(m => `${m.role.toUpperCase()}: ${m.content}`)
            .join('\n\n');
        
        const enhancedPrompt = `${SYSTEM_PROMPT}

CONVERSATION CONTEXT:
${conversationHistory}

TASK: Based on the full conversation above, generate or update the website code. If this is an update to existing code, remember EVERYTHING from before and make ONLY the requested changes while keeping all other functionality intact.

REQUIREMENTS:
- Output ONLY raw HTML code (no markdown, no explanations)
- Include complete, working CSS and JavaScript
- Make it production-quality and pixel-perfect
- Ensure flawless functionality on all interactions
- Use modern, sophisticated design patterns
- Optimize for performance and user experience

BEGIN CODE OUTPUT NOW:`;
        
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: enhancedPrompt,
                response_json_schema: null
            });
            
            let code = response;
            if (typeof code === 'string') {
                code = code.replace(/```html\n?/gi, '').replace(/```\n?/g, '').trim();
            }
            
            const chunkSize = 50;
            for (let i = 0; i < code.length; i += chunkSize) {
                const currentCode = code.substring(0, Math.min(i + chunkSize, code.length));
                setFiles({ 'index.html': currentCode });
                await new Promise(resolve => setTimeout(resolve, 10));
            }
            
            setFiles({ 'index.html': code });
            
            // Generate preview blob URL
            const fullHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${code}</body></html>`;
            const blob = new Blob([fullHtml], { type: 'text/html' });
            const previewUrl = URL.createObjectURL(blob);
            
            const assistantMessage = { 
                role: 'assistant', 
                content: "I've generated your website! Check the Preview tab to see it live. Let me know if you'd like any changes!",
                timestamp: new Date().toISOString()
            };
            
            // Save complete conversation with preview
            await updateConversation.mutateAsync({
                id: activeConversationId,
                data: { 
                    messages: [...newMessages, assistantMessage],
                    files: { 'index.html': code },
                    active_file: 'index.html',
                    preview_url: previewUrl
                }
            });
            
        } catch (error) {
            console.error('Generation failed:', error);
            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, there was an error generating the code. Please try again.',
                timestamp: new Date().toISOString()
            };
            await updateConversation.mutateAsync({
                id: activeConversationId,
                data: { messages: [...newMessages, errorMessage] }
            });
        }
        
        setIsLoading(false);
    };
    
    const handleClearChat = () => {
        if (!activeConversationId) return;
        updateConversation.mutate({
            id: activeConversationId,
            data: { 
                messages: [{ role: 'system', content: SYSTEM_PROMPT }],
                files: { 'index.html': '' }
            }
        });
        setFiles({ 'index.html': '' });
    };
    
    const handleAddFile = (filename) => {
        setFiles(prev => ({ ...prev, [filename]: '' }));
        setActiveFile(filename);
    };
    
    const handleDeleteFile = (filename) => {
        if (Object.keys(files).length === 1) return;
        const newFiles = { ...files };
        delete newFiles[filename];
        setFiles(newFiles);
        if (activeFile === filename) {
            setActiveFile(Object.keys(newFiles)[0]);
        }
    };
    
    const handleFixError = async (error, showDebug = false) => {
        if (!activeConversationId) return;
        
        if (showDebug) {
            setShowDebugModal(true);
            setIsDebugging(true);
            setDebugInfo('');
            
            const debugPrompt = `You are an expert debugging specialist and senior software engineer. Perform a comprehensive error analysis:

ERROR DETECTED: ${error}

FULL CODE CONTEXT:
\`\`\`html
${files['index.html']}
\`\`\`

Provide a detailed debugging report:

# 🐛 Error Analysis
- What this error means technically
- Why this error occurs in JavaScript/HTML/CSS
- Impact on functionality and user experience

# 📍 Root Cause Investigation
- Exact line/section causing the issue (with line numbers if possible)
- Chain of events leading to the error
- Related code that may be contributing

# ✅ Step-by-Step Fix Guide
Detailed, numbered steps to resolve:
1. First diagnostic step
2. Implementation step
3. Testing step
4. Validation step

# 💡 Complete Code Solution
Provide the FULL corrected code section (not just snippet) that replaces the problematic area, with clear comments explaining the fix.

# 🛡️ Prevention Strategies
- Coding practices to avoid this issue
- Validation techniques
- Error handling patterns
- Testing recommendations

# 🔄 Advanced Alternatives
- Better architectural approaches
- Modern best practices
- Performance optimizations
- Scalability considerations

Provide professional, production-ready solutions with detailed explanations.`;

            try {
                const response = await base44.integrations.Core.InvokeLLM({
                    prompt: debugPrompt,
                    response_json_schema: null
                });
                setDebugInfo(response);
            } catch (error) {
                setDebugInfo('Failed to generate debug information.');
            }
            setIsDebugging(false);
        } else {
            const fixPrompt = `There is an error in the code: "${error}". Please fix this error and output the corrected complete HTML code.`;
            await handleSendMessage(fixPrompt);
        }
    };
    
    const handleQuickAction = async (prompt) => {
        if (!files['index.html']) {
            toast.error('Please generate a website first!');
            return;
        }
        await handleSendMessage(prompt);
    };
    
    const handleExportProject = async () => {
        const zip = new JSZip();
        
        Object.entries(files).forEach(([filename, content]) => {
            zip.file(filename, content);
        });
        
        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'website-project.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Project exported!');
    };
    
    const handleGenerateFromScreenshot = async () => {
        toast.info('Upload a screenshot and I\'ll recreate it!');
    };
    
    const handleAIImageGeneration = async () => {
        const prompt = 'Generate custom AI images for this website';
        await handleSendMessage(prompt);
    };
    
    const handleRestoreVersion = (version) => {
        setFiles({ 'index.html': version.code });
        if (activeConversationId) {
            updateConversation.mutate({
                id: activeConversationId,
                data: { files: { 'index.html': version.code } }
            });
        }
        setShowVersionHistory(false);
        toast.success('Version restored!');
    };
    
    const handleExplainCode = async (codeToExplain) => {
        setShowExplanation(true);
        setIsExplaining(true);
        setExplanation('');
        
        const prompt = `You are a senior software engineer and technical educator. Analyze this code comprehensively:

\`\`\`
${codeToExplain}
\`\`\`

Provide a detailed, structured analysis:

1. **Overview**: Clear explanation of purpose and functionality
2. **Architecture & Components**: Break down structure and key parts with technical depth
3. **Logic Breakdown**: Detailed explanation of algorithms, data flow, and complex operations
4. **Code Quality Assessment**: Identify bugs, anti-patterns, performance bottlenecks, security issues
5. **Optimization Opportunities**: Specific, actionable improvements with code examples
6. **Best Practices**: Modern standards, accessibility, maintainability recommendations
7. **Learning Points**: Key takeaways and advanced concepts demonstrated

Use professional yet accessible language. Include specific examples and code snippets where helpful.`;

        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt,
                response_json_schema: null
            });
            
            setExplanation(response);
        } catch (error) {
            console.error('Explanation failed:', error);
            setExplanation('Failed to generate explanation. Please try again.');
        }
        
        setIsExplaining(false);
    };
    
    const handleGenerateTutorial = async (templateName) => {
        const prompt = `Create a comprehensive step-by-step tutorial for building a ${templateName} website. 
        
        Generate a detailed tutorial with 5-7 steps covering:
        1. Project setup and structure
        2. Building the core components
        3. Styling and design
        4. Adding interactivity
        5. Optimization and polish
        
        For each step provide:
        - Clear title
        - Detailed explanation (2-3 paragraphs)
        - Code examples
        - Practical tips
        - An action prompt that can be sent to the AI to implement that step
        
        Format as JSON with this structure:
        {
            "title": "Building a ${templateName} Website",
            "description": "Complete guide description",
            "steps": [
                {
                    "title": "Step title",
                    "content": "Markdown content with explanations",
                    "tip": "Helpful tip",
                    "action": "AI prompt to implement this step"
                }
            ]
        }`;
        
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt,
                response_json_schema: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        steps: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    title: { type: "string" },
                                    content: { type: "string" },
                                    tip: { type: "string" },
                                    action: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });
            
            setCurrentTutorial(response);
            setShowTutorial(true);
        } catch (error) {
            console.error('Tutorial generation failed:', error);
            toast.error('Failed to generate tutorial');
        }
    };
    
    const handleRefactorCode = async () => {
        if (!files['index.html']) {
            toast.error('No code to refactor');
            return;
        }
        
        setShowRefactor(true);
        setIsRefactoring(true);
        setRefactorSuggestions('');
        
        const prompt = `You are a senior software architect and code quality expert. Analyze this code and provide comprehensive refactoring recommendations:

\`\`\`html
${files['index.html']}
\`\`\`

Provide a detailed analysis with:

# Code Quality Assessment
- Overall code structure evaluation
- Maintainability score and rationale
- Performance bottlenecks

# Critical Issues
- Anti-patterns detected
- Security vulnerabilities
- Accessibility problems
- Browser compatibility concerns

# Refactoring Recommendations
For each recommendation provide:
1. What to change and why
2. Before/after code examples
3. Expected impact on performance/maintainability

# Architecture Improvements
- Suggest better component structure
- CSS organization improvements
- JavaScript optimization opportunities

# Best Practices
- Modern HTML5 semantic elements
- CSS best practices (BEM, modules, etc.)
- JavaScript patterns (ES6+, async/await, etc.)

# Action Plan
Priority-ordered list of refactoring tasks with estimated impact.

Use markdown formatting with code blocks.`;

        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt,
                response_json_schema: null
            });
            
            setRefactorSuggestions(response);
        } catch (error) {
            console.error('Refactoring analysis failed:', error);
            setRefactorSuggestions('Failed to generate refactoring suggestions.');
        }
        
        setIsRefactoring(false);
    };
    
    const handleHostLocally = () => {
        if (!files['index.html']) {
            toast.error('No code to host');
            return;
        }
        
        const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
</head>
<body>
${files['index.html']}
</body>
</html>`;
        
        const blob = new Blob([fullHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        setLocalHostUrl(url);
        window.open(url, '_blank');
        toast.success('Website hosted locally! Opening in new tab...');
    };
    
    const handleSEOOptimize = async () => {
        if (!files['index.html']) {
            toast.error('No code to analyze');
            return;
        }
        
        setShowSEO(true);
        setIsAnalyzingSEO(true);
        setSeoAnalysis('');
        
        const prompt = `You are an SEO specialist and web performance expert. Analyze this website code for SEO optimization:

\`\`\`html
${files['index.html']}
\`\`\`

Provide a comprehensive SEO analysis:

# SEO Score Overview
Rate the current SEO implementation (0-100) with breakdown by category.

# Critical SEO Issues
- ❌ Missing or inadequate elements
- Title tags, meta descriptions, headings hierarchy
- Open Graph tags for social media
- Structured data (JSON-LD)

# Technical SEO
- Page load performance concerns
- Mobile-friendliness
- Image optimization (alt tags, sizes)
- Semantic HTML usage

# Content SEO
- Heading structure (H1-H6)
- Keyword placement opportunities
- Content accessibility
- Internal linking structure

# Recommended Optimizations
For each optimization:
1. What's missing or wrong
2. Why it matters for SEO
3. Exact code to add/change
4. Expected SEO impact

# Meta Tags to Add
Provide complete meta tag implementations:
- Essential meta tags
- Open Graph tags
- Twitter Card tags
- Schema.org structured data

# Performance Recommendations
- Image lazy loading
- CSS/JS optimization
- Critical rendering path
- Core Web Vitals improvements

Format with markdown, use ✅ for good, ❌ for missing, ⚠️ for needs improvement.`;

        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt,
                response_json_schema: null
            });
            
            setSeoAnalysis(response);
        } catch (error) {
            console.error('SEO analysis failed:', error);
            setSeoAnalysis('Failed to generate SEO analysis.');
        }
        
        setIsAnalyzingSEO(false);
    };
    
    return (
        <div className="h-screen w-screen bg-[#0a0a0f] overflow-hidden flex" style={{ background: '#0a0a0f' }}>
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl" />
            </div>
            
            {/* Chat Menu */}
            <ChatMenu
                conversations={conversations}
                activeConversationId={activeConversationId}
                onSelectConversation={setActiveConversationId}
                onCreateConversation={() => createConversation.mutate()}
                onDeleteConversation={(id) => {
                    deleteConversation.mutate(id);
                    if (activeConversationId === id) {
                        setActiveConversationId(conversations.find(c => c.id !== id)?.id || null);
                    }
                }}
                onRenameConversation={(id, name) => updateConversation.mutate({ id, data: { name } })}
            />
            
            {/* Chat Panel */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full sm:w-[400px] flex-shrink-0 border-r border-white/10 bg-[#0f1219]/80 backdrop-blur-xl relative z-10 overflow-hidden"
            >
                <ChatPanel 
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    onClearChat={handleClearChat}
                />
            </motion.div>
            
            {/* Preview/Code Panel - Right Side */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 flex flex-col relative z-10 min-w-0 overflow-hidden"
            >
                {/* Error Detector */}
                <ErrorDetector code={files['index.html']} onFixError={handleFixError} />
                
                {/* Quick Actions Bar */}
                <div className="px-4 py-2 border-b border-white/10 bg-[#0a0a0f]/95 backdrop-blur-xl">
                    <div className="flex items-center gap-2 overflow-x-auto">
                        {!files['index.html'] && (
                            <Button
                                onClick={() => setShowTemplates(true)}
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 flex-shrink-0"
                            >
                                <Sparkles className="h-3 w-3 mr-1" />
                                Start with Template
                            </Button>
                        )}
                        {files['index.html'] && (
                            <>
                                <span className="text-xs text-gray-400 mr-2">Quick Actions:</span>
                            {QUICK_ACTIONS.map((action, idx) => (
                                <Button
                                    key={idx}
                                    onClick={() => handleQuickAction(action.prompt)}
                                    disabled={isLoading}
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-cyan-500/30 hover:bg-white/5 flex-shrink-0"
                                >
                                    <action.icon className="h-3 w-3 mr-1" />
                                    {action.label}
                                </Button>
                            ))}
                            <Button
                                onClick={handleExportProject}
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-green-500/30 hover:bg-white/5 flex-shrink-0"
                            >
                                <Download className="h-3 w-3 mr-1" />
                                Export ZIP
                            </Button>
                            <Button
                                onClick={() => setShowAudit(true)}
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-purple-500/30 hover:bg-white/5 flex-shrink-0"
                            >
                                <Shield className="h-3 w-3 mr-1" />
                                Audit
                            </Button>
                            <Button
                                onClick={handleHostLocally}
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-400 hover:text-orange-300 flex-shrink-0"
                            >
                                <Server className="h-3 w-3 mr-1" />
                                Host
                            </Button>
                            <Button
                                onClick={() => setShowDeployment(true)}
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-400 hover:text-blue-300 flex-shrink-0"
                            >
                                <Sparkles className="h-3 w-3 mr-1" />
                                Deploy
                            </Button>
                            <Button
                                onClick={() => setShowVersionHistory(true)}
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-blue-500/30 hover:bg-white/5 flex-shrink-0"
                            >
                                <Clock className="h-3 w-3 mr-1" />
                                History
                            </Button>
                            <Button
                                onClick={() => setShowSnippets(true)}
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-emerald-500/30 hover:bg-white/5 flex-shrink-0"
                            >
                                <Boxes className="h-3 w-3 mr-1" />
                                Snippets
                            </Button>
                            <Button
                                onClick={() => setShowImageGenerator(true)}
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-pink-500/30 hover:bg-white/5 flex-shrink-0"
                            >
                                <ImageIcon className="h-3 w-3 mr-1" />
                                Generate Image
                            </Button>
                            <Button
                                onClick={handleRefactorCode}
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-purple-500/30 hover:bg-white/5 flex-shrink-0"
                            >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Refactor
                            </Button>
                            <Button
                                onClick={handleSEOOptimize}
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-green-500/30 hover:bg-white/5 flex-shrink-0"
                            >
                                <TrendingUp className="h-3 w-3 mr-1" />
                                SEO
                            </Button>
                            <Button
                                onClick={() => setShowPersonalization(true)}
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-pink-500/30 hover:bg-white/5 flex-shrink-0"
                            >
                                <Users className="h-3 w-3 mr-1" />
                                Personalize
                            </Button>
                            <Button
                                onClick={() => setShowAnalytics(true)}
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-cyan-500/30 hover:bg-white/5 flex-shrink-0"
                            >
                                <BarChart3 className="h-3 w-3 mr-1" />
                                Analytics
                            </Button>
                            <Button
                                onClick={() => setShowFeedback(true)}
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-blue-500/30 hover:bg-white/5 flex-shrink-0"
                            >
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Feedback
                            </Button>
                            <Button
                                onClick={() => setShowShortcuts(true)}
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-purple-500/30 hover:bg-white/5 flex-shrink-0"
                            >
                                <Command className="h-3 w-3 mr-1" />
                                Shortcuts
                            </Button>
                            </>
                        )}
                    </div>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                    {/* Tab Header */}
                    <div className="px-4 py-3 border-b border-white/10 bg-[#0f1219]/80 backdrop-blur-xl flex-shrink-0">
                        <TabsList className="bg-white/5 border border-white/10">
                            <TabsTrigger 
                                value="preview" 
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white text-gray-400"
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                            </TabsTrigger>
                            <TabsTrigger 
                                value="code"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white text-gray-400"
                            >
                                <Code2 className="h-4 w-4 mr-2" />
                                Code
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    
                    {/* Tab Content */}
                    <TabsContent value="preview" className="flex-1 m-0 bg-[#0f1219]/50 overflow-hidden" style={{ height: '100%' }}>
                        <PreviewPanel code={files['index.html'] || ''} />
                    </TabsContent>
                    <TabsContent value="code" className="flex-1 m-0 bg-[#0f1219]/50 flex flex-col overflow-hidden" style={{ height: '100%' }}>
                        <FileTabs
                            files={files}
                            activeFile={activeFile}
                            onSelectFile={setActiveFile}
                            onAddFile={handleAddFile}
                            onDeleteFile={handleDeleteFile}
                        />
                        <CodePanel 
                            code={files[activeFile] || ''} 
                            isLoading={isLoading}
                            filename={activeFile}
                            onExplainCode={handleExplainCode}
                        />
                    </TabsContent>
                </Tabs>
            </motion.div>
            
            {/* Modals */}
            <ExplanationModal
                isOpen={showExplanation}
                onClose={() => setShowExplanation(false)}
                explanation={explanation}
                isLoading={isExplaining}
            />
            
            <DebugModal
                isOpen={showDebugModal}
                onClose={() => setShowDebugModal(false)}
                debugInfo={debugInfo}
                isLoading={isDebugging}
                onApplyFix={() => {
                    setShowDebugModal(false);
                    handleSendMessage('Apply the fix you just suggested');
                }}
            />
            
            <TemplateGallery
                isOpen={showTemplates}
                onClose={() => setShowTemplates(false)}
                onSelectTemplate={(prompt, templateName) => {
                    handleSendMessage(prompt);
                    if (templateName) {
                        setTimeout(() => {
                            handleGenerateTutorial(templateName);
                        }, 1000);
                    }
                }}
            />
            
            <VersionHistory
                isOpen={showVersionHistory}
                onClose={() => setShowVersionHistory(false)}
                versions={versions}
                onRestore={handleRestoreVersion}
                onPreview={(version) => {
                    setFiles({ 'index.html': version.code });
                    setActiveTab('preview');
                }}
                onDelete={(id) => {
                    const updated = versions.filter(v => v.id !== id);
                    setVersions(updated);
                    if (activeConversationId) {
                        updateConversation.mutate({
                            id: activeConversationId,
                            data: { versions: updated }
                        });
                    }
                }}
            />
            
            <KeyboardShortcuts
                isOpen={showShortcuts}
                onClose={() => setShowShortcuts(false)}
            />
            
            <CodeSnippets
                isOpen={showSnippets}
                onClose={() => setShowSnippets(false)}
                onInsertSnippet={(code) => {
                    handleSendMessage(`Add this code snippet to the website:\n\n${code}`);
                }}
            />
            
            <TutorialModal
                isOpen={showTutorial}
                onClose={() => setShowTutorial(false)}
                tutorial={currentTutorial}
                onApplyToChat={handleSendMessage}
            />
            
            <RefactorModal
                isOpen={showRefactor}
                onClose={() => setShowRefactor(false)}
                refactorSuggestions={refactorSuggestions}
                isLoading={isRefactoring}
                onApplyRefactor={() => {
                    setShowRefactor(false);
                    handleSendMessage('Apply all the refactoring recommendations you just suggested to improve code quality, performance, and maintainability');
                }}
            />
            
            <SEOModal
                isOpen={showSEO}
                onClose={() => setShowSEO(false)}
                seoAnalysis={seoAnalysis}
                isLoading={isAnalyzingSEO}
                onApplyOptimizations={() => {
                    setShowSEO(false);
                    handleSendMessage('Apply all the SEO optimizations you just recommended including meta tags, structured data, semantic HTML, and accessibility improvements');
                }}
            />
            
            <ImageGeneratorModal
                isOpen={showImageGenerator}
                onClose={() => setShowImageGenerator(false)}
                onInsertImage={(imageUrl) => {
                    handleSendMessage(`Add this image to the website with proper styling: ${imageUrl}`);
                }}
            />
            
            <ImageEditorModal
                isOpen={showImageEditor}
                onClose={() => setShowImageEditor(false)}
                imageUrl={editingImageUrl}
                onSave={(editedUrl) => {
                    handleSendMessage(`Replace the image with this edited version: ${editedUrl}`);
                }}
            />
            
            <DeploymentModal
                isOpen={showDeployment}
                onClose={() => setShowDeployment(false)}
                code={files['index.html']}
            />
            
            <WebsiteAuditModal
                isOpen={showAudit}
                onClose={() => setShowAudit(false)}
                code={files['index.html']}
                onApplyFix={() => {
                    handleSendMessage('Apply all the improvements and fixes recommended in the audit report to optimize performance, accessibility, SEO, and best practices');
                }}
            />
            
            <PersonalizationModal
                isOpen={showPersonalization}
                onClose={() => setShowPersonalization(false)}
                onApplyPersonalization={(code) => {
                    handleSendMessage(`Add this AI personalization code to the website:\n\n${code}`);
                }}
            />
            
            <AnalyticsModal
                isOpen={showAnalytics}
                onClose={() => setShowAnalytics(false)}
                code={files['index.html']}
            />
            
            <FeedbackAnalysisModal
                isOpen={showFeedback}
                onClose={() => setShowFeedback(false)}
                onApplySuggestions={(analysis) => {
                    handleSendMessage(`Based on this user feedback analysis, apply the high-priority recommendations:\n\n${analysis}`);
                }}
            />
        </div>
    );
}
