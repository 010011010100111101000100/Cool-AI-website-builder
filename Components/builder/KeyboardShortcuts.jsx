import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Command } from 'lucide-react';

const shortcuts = [
    { keys: ['⌘/Ctrl', 'F'], description: 'Search in code' },
    { keys: ['⌘/Ctrl', 'K'], description: 'Open command palette' },
    { keys: ['⌘/Ctrl', 'S'], description: 'Save/Export project' },
    { keys: ['⌘/Ctrl', 'E'], description: 'Switch to code view' },
    { keys: ['⌘/Ctrl', 'P'], description: 'Switch to preview' },
    { keys: ['Enter'], description: 'Send message' },
    { keys: ['Shift', 'Enter'], description: 'New line in chat' },
    { keys: ['Esc'], description: 'Close modal/search' },
    { keys: ['⌘/Ctrl', '/'], description: 'Show shortcuts' },
];

export default function KeyboardShortcuts({ isOpen, onClose }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-[#0f1219] border-white/20 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
                            <Command className="h-4 w-4 text-cyan-400" />
                        </div>
                        Keyboard Shortcuts
                    </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-2 py-4">
                    {shortcuts.map((shortcut, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                            <span className="text-sm text-gray-300">{shortcut.description}</span>
                            <div className="flex gap-1">
                                {shortcut.keys.map((key, i) => (
                                    <React.Fragment key={i}>
                                        {i > 0 && <span className="text-gray-600 mx-1">+</span>}
                                        <kbd className="px-2 py-1 rounded bg-white/10 border border-white/20 text-xs font-mono text-cyan-400">
                                            {key}
                                        </kbd>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
