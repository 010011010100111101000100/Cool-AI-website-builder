import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles, Loader2, Globe, Gamepad2, ShoppingBag, Briefcase, Camera, Music, BookOpen, Pizza } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

const TEMPLATES = [
    { 
        icon: Briefcase, 
        name: 'Portfolio', 
        description: 'Professional portfolio showcase',
        color: 'from-blue-500/20 to-indigo-500/20',
        borderColor: 'border-blue-500/30',
        prompt: 'Create a stunning professional portfolio website with animated hero section, about me with typing effect, interactive skills showcase with progress bars and icons, project gallery with 3D card flip effects on hover, testimonials slider, contact form with validation, smooth parallax scrolling, modern glassmorphism design, and floating particle background'
    },
    { 
        icon: ShoppingBag, 
        name: 'E-Commerce', 
        description: 'Modern online store',
        color: 'from-emerald-500/20 to-green-500/20',
        borderColor: 'border-emerald-500/30',
        prompt: 'Create a beautiful e-commerce product page with image gallery carousel, zoom on hover, add to cart with animation, product details with tabs, size and color selector with visual feedback, star ratings with reviews section, related products with lazy loading, wishlist functionality, shopping cart sidebar, quantity selector, and smooth checkout flow UI'
    },
    { 
        icon: Gamepad2, 
        name: 'Game', 
        description: 'Playable browser game',
        color: 'from-purple-500/20 to-pink-500/20',
        borderColor: 'border-purple-500/30',
        prompt: 'Create a fully playable browser game (choose: space shooter with enemy waves, snake with power-ups, or breakout with special bricks) featuring: score tracking with combo system, lives/health display, multiple power-ups, increasing difficulty levels, boss battles, particle effects, sound effects (visual indicators), game over screen with retry, high score leaderboard saved to localStorage, smooth 60fps animations using requestAnimationFrame, retro pixel art style with scanline effects'
    },
    { 
        icon: Globe, 
        name: 'Landing Page', 
        description: 'High-converting marketing',
        color: 'from-cyan-500/20 to-blue-500/20',
        borderColor: 'border-cyan-500/30',
        prompt: 'Create a high-converting SaaS landing page with: animated hero section with gradient background and CTA buttons, features section with animated icons and hover effects, testimonials carousel with auto-play, pricing tables with toggle for monthly/yearly, FAQ accordion, email capture form with validation, trust badges, stats counter animation on scroll, footer with social links, smooth scroll animations throughout, modern gradient design, and sticky navigation'
    },
    { 
        icon: Camera, 
        name: 'Photography', 
        description: 'Stunning image gallery',
        color: 'from-amber-500/20 to-orange-500/20',
        borderColor: 'border-amber-500/30',
        prompt: 'Create a stunning photography portfolio with: masonry grid layout with infinite scroll, lightbox image viewer with zoom and pan, category filters with smooth transitions, full-width parallax hero banner, photographer bio with animated timeline, Instagram-style grid, image lazy loading, smooth hover effects with overlay, search functionality, elegant dark theme with gold accents, and gallery statistics'
    },
    { 
        icon: Music, 
        name: 'Music Player', 
        description: 'Audio player UI',
        color: 'from-rose-500/20 to-red-500/20',
        borderColor: 'border-rose-500/30',
        prompt: 'Create a beautiful Spotify-style music player with: album art display with blur background, animated play/pause button, progress bar with draggable scrubber, volume control with slider, dynamic playlist with queue, skip/previous buttons, shuffle and repeat modes, audio visualizer with canvas animation, search songs, like/favorite functionality, dark theme with neon glow effects, and smooth transitions'
    },
    { 
        icon: BookOpen, 
        name: 'Blog', 
        description: 'Modern blogging platform',
        color: 'from-slate-500/20 to-gray-500/20',
        borderColor: 'border-slate-500/30',
        prompt: 'Create a modern blog website with: featured post hero with overlay, article cards grid with hover effects, category tags with filtering, sidebar with recent posts and trending, author bio with social links, comment section with nested replies, search bar with live results, newsletter signup with validation, reading time and progress indicator, table of contents, code syntax highlighting, share buttons, and minimalist typography-focused design'
    },
    { 
        icon: Pizza, 
        name: 'Restaurant', 
        description: 'Restaurant website',
        color: 'from-orange-500/20 to-red-500/20',
        borderColor: 'border-orange-500/30',
        prompt: 'Create an appetizing restaurant website with: full-screen hero with food video/images, interactive menu with categories and filters, dish cards with images and prices, dietary tags (vegan, gluten-free), order online modal, table reservation system with calendar, embedded Google Maps, hours of operation, customer reviews with star ratings, chef profiles, Instagram feed integration, newsletter signup, and warm inviting color scheme with food photography'
    },
    {
        icon: Briefcase,
        name: 'Dashboard',
        description: 'Analytics dashboard',
        color: 'from-violet-500/20 to-purple-500/20',
        borderColor: 'border-violet-500/30',
        prompt: 'Create a professional analytics dashboard with: sidebar navigation, stat cards with icons and trends, interactive charts (line, bar, pie, area) using canvas, data tables with sorting and filtering, date range picker, export to CSV/PDF buttons, user profile dropdown, notifications panel, dark/light mode toggle, responsive grid layout, real-time data updates animation, and modern glassmorphism design'
    },
    {
        icon: Globe,
        name: 'Social Media',
        description: 'Social network UI',
        color: 'from-pink-500/20 to-rose-500/20',
        borderColor: 'border-pink-500/30',
        prompt: 'Create a social media feed interface with: user profile section with avatar and stats, create post modal with image upload UI, feed with posts (text, images), like/comment/share buttons with animations, comment section with nested replies, follow/unfollow buttons, trending sidebar, notifications dropdown, search users, infinite scroll loading, story circles at top, dark theme, and smooth animations throughout'
    },
    {
        icon: BookOpen,
        name: 'Documentation',
        description: 'Developer docs site',
        color: 'from-teal-500/20 to-cyan-500/20',
        borderColor: 'border-teal-500/30',
        prompt: 'Create a developer documentation website with: collapsible sidebar navigation with sections, search bar with autocomplete, code blocks with syntax highlighting and copy button, table of contents with active section highlighting, prev/next navigation, dark/light mode toggle, breadcrumb navigation, API reference section, live code examples, version selector, edit on GitHub link, responsive layout, and clean typography'
    },
    {
        icon: Gamepad2,
        name: 'Quiz App',
        description: 'Interactive quiz game',
        color: 'from-indigo-500/20 to-blue-500/20',
        borderColor: 'border-indigo-500/30',
        prompt: 'Create an interactive quiz/trivia game with: welcome screen with start button, multiple choice questions with 4 options, timer countdown with progress bar, score tracking, correct/incorrect feedback animations, question progress indicator, skip question option, lifelines (50/50, hint), final score screen with percentage, leaderboard, restart button, category selection, difficulty levels, and engaging animations'
    }
];

export default function TemplateGallery({ isOpen, onClose, onSelectTemplate }) {
    const [isGenerating, setIsGenerating] = useState(false);
    
    const handleSelect = async (template) => {
        setIsGenerating(true);
        await onSelectTemplate(template.prompt, template.name);
        setIsGenerating(false);
        onClose();
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto bg-[#0f1219] border-white/20 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-cyan-400" />
                        </div>
                        AI Template Generator
                    </DialogTitle>
                    <p className="text-sm text-gray-400 mt-2">
                        Choose a template and AI will generate a complete, functional website instantly
                    </p>
                </DialogHeader>
                
                {isGenerating ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-12 w-12 text-cyan-400 animate-spin mb-4" />
                        <p className="text-gray-400">Generating your template...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 py-4">
                        {TEMPLATES.map((template, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.03 }}
                            >
                                <button
                                    onClick={() => handleSelect(template)}
                                    className="w-full p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-cyan-500/50 hover:from-white/10 hover:to-white/5 transition-all duration-300 group text-left relative overflow-hidden"
                                >
                                    <div className={cn(
                                        "h-12 w-12 rounded-lg bg-gradient-to-br border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform",
                                        template.color,
                                        template.borderColor
                                    )}>
                                        <template.icon className="h-6 w-6 text-cyan-400" />
                                    </div>
                                    <h3 className="font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">{template.name}</h3>
                                    <p className="text-xs text-gray-400 line-clamp-2">{template.description}</p>
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
