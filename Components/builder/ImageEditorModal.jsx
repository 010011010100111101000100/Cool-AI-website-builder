import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Crop, Image as ImageIcon, Maximize2, Minimize2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ImageEditorModal({ isOpen, onClose, imageUrl, onSave }) {
    const canvasRef = useRef(null);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);
    const [blur, setBlur] = useState(0);
    const [scale, setScale] = useState(100);
    
    useEffect(() => {
        if (isOpen && imageUrl) {
            loadImage();
        }
    }, [isOpen, imageUrl]);
    
    useEffect(() => {
        if (canvasRef.current) {
            applyFilters();
        }
    }, [brightness, contrast, saturation, blur, scale]);
    
    const loadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = imageUrl;
    };
    
    const applyFilters = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;
        
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const scaleFactor = scale / 100;
            const scaledWidth = img.width * scaleFactor;
            const scaledHeight = img.height * scaleFactor;
            const x = (canvas.width - scaledWidth) / 2;
            const y = (canvas.height - scaledHeight) / 2;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        };
        img.src = imageUrl;
    };
    
    const handleSave = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            onSave(url);
            toast.success('Image edited and saved!');
            onClose();
        });
    };
    
    const handleReset = () => {
        setBrightness(100);
        setContrast(100);
        setSaturation(100);
        setBlur(0);
        setScale(100);
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-[#0f1219] border-white/20 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30 flex items-center justify-center">
                            <ImageIcon className="h-4 w-4 text-orange-400" />
                        </div>
                        Image Editor
                    </DialogTitle>
                </DialogHeader>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-4">
                    {/* Controls */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block">Brightness</label>
                            <Slider
                                value={[brightness]}
                                onValueChange={(v) => setBrightness(v[0])}
                                min={0}
                                max={200}
                                step={1}
                                className="mb-1"
                            />
                            <span className="text-xs text-gray-500">{brightness}%</span>
                        </div>
                        
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block">Contrast</label>
                            <Slider
                                value={[contrast]}
                                onValueChange={(v) => setContrast(v[0])}
                                min={0}
                                max={200}
                                step={1}
                                className="mb-1"
                            />
                            <span className="text-xs text-gray-500">{contrast}%</span>
                        </div>
                        
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block">Saturation</label>
                            <Slider
                                value={[saturation]}
                                onValueChange={(v) => setSaturation(v[0])}
                                min={0}
                                max={200}
                                step={1}
                                className="mb-1"
                            />
                            <span className="text-xs text-gray-500">{saturation}%</span>
                        </div>
                        
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block">Blur</label>
                            <Slider
                                value={[blur]}
                                onValueChange={(v) => setBlur(v[0])}
                                min={0}
                                max={10}
                                step={0.1}
                                className="mb-1"
                            />
                            <span className="text-xs text-gray-500">{blur}px</span>
                        </div>
                        
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block">Scale</label>
                            <Slider
                                value={[scale]}
                                onValueChange={(v) => setScale(v[0])}
                                min={50}
                                max={150}
                                step={1}
                                className="mb-1"
                            />
                            <span className="text-xs text-gray-500">{scale}%</span>
                        </div>
                        
                        <Button
                            onClick={handleReset}
                            variant="ghost"
                            className="w-full text-gray-400 hover:text-white"
                        >
                            Reset All
                        </Button>
                    </div>
                    
                    {/* Canvas Preview */}
                    <div className="lg:col-span-2">
                        <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center" style={{ minHeight: '400px' }}>
                            <canvas ref={canvasRef} className="max-w-full h-auto" />
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                            <Button
                                onClick={handleSave}
                                className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500"
                            >
                                Save & Insert
                            </Button>
                            <Button
                                onClick={onClose}
                                variant="ghost"
                                className="text-gray-400 hover:text-white"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
