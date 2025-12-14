import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Users, Target, Eye, TrendingUp, Loader2, Plus, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function PersonalizationModal({ isOpen, onClose, onApplyPersonalization }) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedAudience, setSelectedAudience] = useState('first-time');
    const [customRules, setCustomRules] = useState([]);
    const [newRule, setNewRule] = useState({ trigger: '', action: '' });
    
    const audiences = [
        { id: 'first-time', name: 'First-time Visitors', desc: 'Never visited before', icon: Eye },
        { id: 'returning', name: 'Returning Users', desc: 'Visited 2+ times', icon: Users },
        { id: 'engaged', name: 'Engaged Users', desc: 'High interaction', icon: TrendingUp },
        { id: 'converting', name: 'Ready to Convert', desc: 'Showing buying signals', icon: Target }
    ];
    
    const handleGeneratePersonalization = async () => {
        setIsGenerating(true);
        
        const prompt = `Generate AI-powered personalization code for a website targeting ${selectedAudience} visitors.

Create JavaScript code that:
1. Detects visitor type using localStorage and cookies
2. Dynamically personalizes content based on behavior
3. Adjusts headlines, images, and CTAs
4. Tracks engagement metrics
5. Uses smooth animations for content changes

Include these personalization strategies:
- First-time visitors: Welcome message, product highlights, explainer content
- Returning users: "Welcome back", personalized recommendations, saved progress
- Engaged users: Advanced features, exclusive content, loyalty rewards
- Converting users: Urgency messaging, testimonials, limited-time offers

Output complete, production-ready JavaScript code with:
- Visitor detection logic
- Content personalization functions
- Dynamic text/image replacement
- CTA optimization
- Analytics tracking

Format as a complete <script> tag that can be inserted into HTML.`;

        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt,
                response_json_schema: null
            });
            
            onApplyPersonalization(response);
            toast.success('Personalization code generated!');
            onClose();
        } catch (error) {
            console.error('Generation failed:', error);
            toast.error('Failed to generate personalization');
        }
        
        setIsGenerating(false);
    };
    
    const addCustomRule = () => {
        if (newRule.trigger && newRule.action) {
            setCustomRules([...customRules, { ...newRule, id: Date.now() }]);
            setNewRule({ trigger: '', action: '' });
        }
    };
    
    const removeRule = (id) => {
        setCustomRules(customRules.filter(r => r.id !== id));
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0f1219] border-white/20 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-pink-400" />
                        </div>
                        AI Personalization Engine
                    </DialogTitle>
                    <p className="text-sm text-gray-400 mt-2">
                        Dynamically adapt content based on visitor behavior and preferences
                    </p>
                </DialogHeader>
                
                <Tabs defaultValue="audience" className="py-4">
                    <TabsList className="grid w-full grid-cols-3 bg-white/5">
                        <TabsTrigger value="audience">Target Audience</TabsTrigger>
                        <TabsTrigger value="rules">Custom Rules</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    
                    {/* Audience Selection */}
                    <TabsContent value="audience" className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-3">
                            {audiences.map(audience => (
                                <button
                                    key={audience.id}
                                    onClick={() => setSelectedAudience(audience.id)}
                                    className={`p-4 rounded-lg border transition-all text-left ${
                                        selectedAudience === audience.id
                                            ? 'border-pink-500/50 bg-pink-500/10'
                                            : 'border-white/10 bg-white/5 hover:border-white/20'
                                    }`}
                                >
                                    <audience.icon className={`h-6 w-6 mb-2 ${
                                        selectedAudience === audience.id ? 'text-pink-400' : 'text-gray-400'
                                    }`} />
                                    <h3 className="font-medium text-white mb-1">{audience.name}</h3>
                                    <p className="text-xs text-gray-400">{audience.desc}</p>
                                </button>
                            ))}
                        </div>
                        
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <h3 className="font-medium text-white mb-3">Personalization Strategy</h3>
                            <div className="space-y-2 text-sm text-gray-300">
                                {selectedAudience === 'first-time' && (
                                    <>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5" />
                                            <span>Welcome message with clear value proposition</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5" />
                                            <span>Highlight key features and benefits</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5" />
                                            <span>Educational content and tutorials</span>
                                        </div>
                                    </>
                                )}
                                {selectedAudience === 'returning' && (
                                    <>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5" />
                                            <span>"Welcome back" personalized greeting</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5" />
                                            <span>Show recently viewed items</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5" />
                                            <span>Personalized recommendations</span>
                                        </div>
                                    </>
                                )}
                                {selectedAudience === 'engaged' && (
                                    <>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5" />
                                            <span>Exclusive content and features</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5" />
                                            <span>Advanced tips and power user guides</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5" />
                                            <span>Community and social proof</span>
                                        </div>
                                    </>
                                )}
                                {selectedAudience === 'converting' && (
                                    <>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5" />
                                            <span>Urgency messaging and limited-time offers</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5" />
                                            <span>Customer testimonials and reviews</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-1.5" />
                                            <span>Clear call-to-action with incentives</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                    
                    {/* Custom Rules */}
                    <TabsContent value="rules" className="space-y-4 mt-4">
                        <div className="space-y-3">
                            {customRules.map(rule => (
                                <div key={rule.id} className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm text-white mb-1"><span className="text-pink-400">When:</span> {rule.trigger}</p>
                                        <p className="text-sm text-gray-400"><span className="text-purple-400">Then:</span> {rule.action}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeRule(rule.id)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        
                        <div className="space-y-3 p-4 rounded-lg bg-white/5 border border-white/10">
                            <h3 className="font-medium text-white">Add Custom Rule</h3>
                            <Input
                                placeholder="Trigger condition (e.g., 'User scrolls 50%')"
                                value={newRule.trigger}
                                onChange={(e) => setNewRule({ ...newRule, trigger: e.target.value })}
                                className="bg-white/5 border-white/10 text-white"
                            />
                            <Input
                                placeholder="Action (e.g., 'Show special offer popup')"
                                value={newRule.action}
                                onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
                                className="bg-white/5 border-white/10 text-white"
                            />
                            <Button
                                onClick={addCustomRule}
                                variant="ghost"
                                size="sm"
                                className="w-full text-pink-400 hover:text-pink-300"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Rule
                            </Button>
                        </div>
                    </TabsContent>
                    
                    {/* Preview */}
                    <TabsContent value="preview" className="space-y-4 mt-4">
                        <div className="p-4 rounded-lg bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/30">
                            <h3 className="font-medium text-white mb-2">Personalization Features</h3>
                            <div className="space-y-2 text-sm text-gray-300">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-400" />
                                    <span>Visitor behavior tracking</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-400" />
                                    <span>Dynamic content replacement</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-400" />
                                    <span>A/B testing capabilities</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-400" />
                                    <span>Real-time analytics integration</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-sm text-gray-400 space-y-2">
                            <p>The personalization engine will:</p>
                            <ul className="list-disc list-inside space-y-1 text-gray-500">
                                <li>Automatically detect visitor type on page load</li>
                                <li>Apply personalized content without page reload</li>
                                <li>Track engagement and conversion metrics</li>
                                <li>Learn from visitor behavior over time</li>
                            </ul>
                        </div>
                    </TabsContent>
                </Tabs>
                
                <div className="flex gap-3 pt-4 border-t border-white/10">
                    <Button
                        onClick={handleGeneratePersonalization}
                        disabled={isGenerating}
                        className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4 mr-2" />
                                Generate Personalization
                            </>
                        )}
                    </Button>
                    <Button variant="ghost" onClick={onClose} className="text-gray-400">
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
