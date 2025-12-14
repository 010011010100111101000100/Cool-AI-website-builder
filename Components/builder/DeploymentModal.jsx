import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket, Github, GitBranch, Globe, Lock, CheckCircle2, AlertCircle, Settings, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function DeploymentModal({ isOpen, onClose, code }) {
    const [selectedProvider, setSelectedProvider] = useState('github');
    const [repoUrl, setRepoUrl] = useState('');
    const [branch, setBranch] = useState('main');
    const [domain, setDomain] = useState('');
    const [environment, setEnvironment] = useState('production');
    const [isDeploying, setIsDeploying] = useState(false);
    
    const gitProviders = [
        { id: 'github', name: 'GitHub', icon: Github, color: 'text-gray-300' },
        { id: 'gitlab', name: 'GitLab', icon: GitBranch, color: 'text-orange-400' },
        { id: 'bitbucket', name: 'Bitbucket', icon: GitBranch, color: 'text-blue-400' }
    ];
    
    const handleDeploy = async () => {
        setIsDeploying(true);
        
        // Simulate deployment
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast.success(`Deployed to ${environment} environment!`);
        setIsDeploying(false);
    };
    
    const handleGitPush = async () => {
        if (!repoUrl) {
            toast.error('Please enter a repository URL');
            return;
        }
        
        toast.success(`Code pushed to ${selectedProvider} repository!`);
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0f1219] border-white/20 text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
                            <Rocket className="h-4 w-4 text-blue-400" />
                        </div>
                        Deployment Center
                    </DialogTitle>
                    <p className="text-sm text-gray-400 mt-2">
                        Deploy your website with Git integration, CI/CD, and custom domains
                    </p>
                </DialogHeader>
                
                <Tabs defaultValue="git" className="py-4">
                    <TabsList className="grid w-full grid-cols-4 bg-white/5">
                        <TabsTrigger value="git">Git Integration</TabsTrigger>
                        <TabsTrigger value="cicd">CI/CD</TabsTrigger>
                        <TabsTrigger value="hosting">Hosting</TabsTrigger>
                        <TabsTrigger value="environments">Environments</TabsTrigger>
                    </TabsList>
                    
                    {/* Git Integration */}
                    <TabsContent value="git" className="space-y-4 mt-4">
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block">Select Git Provider</label>
                            <div className="grid grid-cols-3 gap-3">
                                {gitProviders.map(provider => (
                                    <button
                                        key={provider.id}
                                        onClick={() => setSelectedProvider(provider.id)}
                                        className={`p-4 rounded-lg border transition-all ${
                                            selectedProvider === provider.id
                                                ? 'border-cyan-500/50 bg-cyan-500/10'
                                                : 'border-white/10 bg-white/5 hover:border-white/20'
                                        }`}
                                    >
                                        <provider.icon className={`h-8 w-8 mb-2 ${provider.color}`} />
                                        <p className="text-sm text-white">{provider.name}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block">Repository URL</label>
 
