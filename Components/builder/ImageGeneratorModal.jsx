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
 
