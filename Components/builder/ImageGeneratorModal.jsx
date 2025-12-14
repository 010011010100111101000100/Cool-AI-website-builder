import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Wand2, Download, Copy, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ImageGeneratorModal({ isOpen, onClose, onInsertImage }) {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [copied, setCopied] = useState(false);
    
    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast.error('Please describe the image you want');
            return;
        }
        
        setIsGenerating(true);
        try {
            const result = await base44.integrations.Core.GenerateImage({
                prompt: prompt
            });
            
            setGeneratedImage(result.url);
            toast.success('Image generated!');
        } catch (error) {
            console.error('Image generation failed:', error);
            toast.error('Failed to generate image');
        }
        setIsGenerating(false);
    };
    
    const handleCopyUrl = () => {
        if (generatedImage) {
            navigator.clipboard.writeText(generatedImage);
            setCopied(true);
            toast.success('Image URL copied!');
            setTimeout(() => setCopied(false), 2000);
        }
    };
    
    const handleDownload = () => {
        if (generatedImage) {
            const a = document.createElement('a');
            a.href = generatedImage;
            a.download = 'generated-image.png';
            a.click();
            toast.success('Image downloaded!');
        }
    };
    
    const handleInsert = () => {
        if (generatedImage) {
            onInsertImage(generatedImage);
            toast.success('Image inserted into code!');
            onClose();
        }
    };
    
    const quickPrompts = [
        'Modern minimalist hero background with geometric shapes',
        'Abstract gradient wave pattern for website header',
        'Professional business team photo placeholder',
        'Product showcase with clean white background',
        'Colorful abstract art for blog post featured image',
        'Tech-themed background with circuit patterns'
    ];
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0f1219] border-white/20 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center">
                            <Wand2 className="h-4 w-4 text-pink-400" />
                        </div>
                        AI Image Generator
                    </DialogTitle>
                    <p className="text-sm text-gray-400 mt-2">
                        Describe the image you want and AI will generate it for your website
                    </p>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                    {/* Prompt Input */}
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">Image Description</label>
                        <Textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe the image in detail... e.g., 'A modern abstract background with blue and purple gradients, geometric shapes, and a minimalist style'"
                            className="min-h-[100px] bg-white/5 border-white/10 text-white"
                            disabled={isGenerating}
                        />
                    </div>
                    
                    {/* Quick Prompts */}
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">Quick Ideas</label>
                        <div className="flex flex-wrap gap-2">
                            {quickPrompts.map((quickPrompt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setPrompt(quickPrompt)}
                                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-pink-500/30 hover:bg-pink-500/10 text-xs text-gray-300 transition-all"
                                >
                                    {quickPrompt}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Generate Button */}
                    <Button
                        onClick={handleGenerate}
                        disabled={!prompt.trim() || isGenerating}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Generating Image...
                            </>
                        ) : (
                            <>
                                <Wand2 className="h-4 w-4 mr-2" />
                                Generate Image
                            </>
                        )}
                    </Button>
                    
                    {/* Generated Image Preview */}
                    {generatedImage && (
                        <div className="space-y-3">
                            <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
                                <img 
                                    src={generatedImage} 
                                    alt="Generated" 
                                    className="w-full h-auto"
                                />
                            </div>
                            
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleCopyUrl}
                                    variant="ghost"
                                    className="flex-1 text-gray-400 hover:text-white"
                                >
                                    {copied ? (
                                        <Check className="h-4 w-4 mr-2 text-green-400" />
                                    ) : (
                                        <Copy className="h-4 w-4 mr-2" />
                                    )}
                                    Copy URL
                                </Button>
                                <Button
                                    onClick={handleDownload}
                                    variant="ghost"
                                    className="flex-1 text-gray-400 hover:text-white"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                </Button>
                                <Button
                                    onClick={handleInsert}
                                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500"
                                >
                                    Insert into Code
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
