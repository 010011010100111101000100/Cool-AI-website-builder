import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export default function TutorialModal({ isOpen, onClose, tutorial, onApplyToChat }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState(new Set());
    
    if (!tutorial) return null;
    
    const steps = tutorial.steps || [];
    const currentStepData = steps[currentStep];
    
    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCompletedSteps(new Set([...completedSteps, currentStep]));
            setCurrentStep(currentStep + 1);
        }
    };
    
    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    
    const handleApply = () => {
        if (currentStepData?.action) {
            onApplyToChat(currentStepData.action);
        }
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[85vh] bg-[#0f1219] border-white/20 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-blue-400" />
                        </div>
                        {tutorial.title}
                    </DialogTitle>
                    <p className="text-sm text-gray-400 mt-2">{tutorial.description}</p>
                </DialogHeader>
                
                <div className="py-4">
                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-400">
                                Step {currentStep + 1} of {steps.length}
                            </span>
                            <span className="text-xs text-cyan-400">
                                {Math.round(((completedSteps.size) / steps.length) * 100)}% Complete
                            </span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${((completedSteps.size) / steps.length) * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>
                    
                    {/* Step Navigation Dots */}
                    <div className="flex gap-2 mb-6 justify-center">
                        {steps.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentStep(idx)}
                                className={`h-2 rounded-full transition-all ${
                                    idx === currentStep
                                        ? 'w-8 bg-cyan-500'
                                        : completedSteps.has(idx)
                                        ? 'w-2 bg-green-500'
                                        : 'w-2 bg-white/20'
                                }`}
                            />
                        ))}
                    </div>
                    
                    {/* Step Content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white/5 rounded-xl p-6 border border-white/10 min-h-[300px]"
                        >
                            <h3 className="text-lg font-semibold text-white mb-3">
                                {currentStepData?.title}
                            </h3>
                            
                            <div className="prose prose-sm prose-invert max-w-none">
                                <ReactMarkdown
                                    components={{
                                        code: ({ inline, children }) => (
                                            inline ? (
                                                <code className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-400 text-xs">
                                                    {children}
                                                </code>
                                            ) : (
                                                <pre className="bg-black/40 rounded-lg p-3 overflow-x-auto text-xs border border-white/10">
                                                    <code className="text-gray-300">{children}</code>
                                                </pre>
                                            )
                                        ),
                                        p: ({ children }) => <p className="text-gray-300 mb-3 leading-relaxed">{children}</p>,
                                        ul: ({ children }) => <ul className="list-disc list-inside text-gray-300 space-y-1 mb-3">{children}</ul>,
                                        li: ({ children }) => <li className="text-sm">{children}</li>,
                                    }}
                                >
                                    {currentStepData?.content}
                                </ReactMarkdown>
                            </div>
                            
                            {currentStepData?.tip && (
                                <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                                    <p className="text-xs text-blue-400">
                                        💡 <strong>Tip:</strong> {currentStepData.tip}
                                    </p>
                                </div>
                            )}
                            
                            {currentStepData?.action && (
                                <Button
                                    onClick={handleApply}
                                    className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"
                                >
                                    Apply This Step
                                </Button>
                            )}
                        </motion.div>
                    </AnimatePresence>
                    
                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-6">
                        <Button
                            onClick={handlePrev}
                            disabled={currentStep === 0}
                            variant="ghost"
                            className="text-gray-400 hover:text-white"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </Button>
                        
                        {currentStep === steps.length - 1 ? (
                            <Button
                                onClick={onClose}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400"
                            >
                                <Check className="h-4 w-4 mr-1" />
                                Complete Tutorial
                            </Button>
                        ) : (
                            <Button
                                onClick={handleNext}
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
