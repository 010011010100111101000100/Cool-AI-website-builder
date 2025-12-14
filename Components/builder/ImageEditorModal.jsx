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
 
