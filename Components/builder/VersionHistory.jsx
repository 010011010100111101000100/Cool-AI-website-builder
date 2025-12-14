import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, RotateCcw, Eye, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

export default function VersionHistory({ isOpen, onClose, versions, onRestore, onPreview, onDelete }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-[#0f1219] border-white/20 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-blue-400" />
                        </div>
                        Version History
                    </DialogTitle>
                    <p className="text-sm text-gray-400 mt-2">
                        Restore or preview previous versions of your code
                    </p>
                </DialogHeader>
                
                <div className="space-y-2 py-4">
                    {versions.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No version history yet</p>
                            <p className="text-xs mt-1">Versions are saved automatically as you make changes</p>
                        </div>
                    ) : (
                        versions.map((version, idx) => (
                            <motion.div
                                key={version.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-medium text-white">
                                                Version {versions.length - idx}
                                            </span>
                                            {idx === 0 && (
                                                <span className="px-2 py-0.5 rounded text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 mb-2">
                                            {formatDistanceToNow(new Date(version.timestamp), { addSuffix: true })}
                                        </p>
                                        {version.description && (
                                            <p className="text-sm text-gray-300 truncate">{version.description}</p>
                                        )}
                                    </div>
                                    
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => onPreview(version)}
                                            className="h-8 w-8 text-gray-400 hover:text-cyan-400"
                                        >
                                            <Eye className="h-3 w-3" />
                                        </Button>
                                        {idx !== 0 && (
                                            <>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => onRestore(version)}
                                                    className="h-8 w-8 text-gray-400 hover:text-green-400"
                                                >
                                                    <RotateCcw className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => onDelete(version.id)}
                                                    className="h-8 w-8 text-gray-400 hover:text-red-400"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
