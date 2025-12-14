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
                            <Input
                                value={repoUrl}
                                onChange={(e) => setRepoUrl(e.target.value)}
                                placeholder="https://github.com/username/repo.git"
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>
                        
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block">Branch</label>
                            <Input
                                value={branch}
                                onChange={(e) => setBranch(e.target.value)}
                                placeholder="main"
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>
                        
                        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-blue-300 font-medium">Authentication Required</p>
                                    <p className="text-xs text-blue-200 mt-1">
                                        You'll need to authenticate with {selectedProvider} to push code. Make sure you have write access to the repository.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <Button
                            onClick={handleGitPush}
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        >
                            <Github className="h-4 w-4 mr-2" />
                            Push to {gitProviders.find(p => p.id === selectedProvider)?.name}
                        </Button>
                    </TabsContent>
                    
                    {/* CI/CD */}
                    <TabsContent value="cicd" className="space-y-4 mt-4">
                        <div className="space-y-3">
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-medium text-white">Build Pipeline</h3>
                                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                                </div>
                                <p className="text-xs text-gray-400 mb-3">Automated build on every push</p>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <div className="w-2 h-2 rounded-full bg-green-400" />
                                        Install dependencies
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <div className="w-2 h-2 rounded-full bg-green-400" />
                                        Run tests
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <div className="w-2 h-2 rounded-full bg-green-400" />
                                        Build production bundle
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-medium text-white">Deployment Pipeline</h3>
                                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                                </div>
                                <p className="text-xs text-gray-400 mb-3">Auto-deploy on successful build</p>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <div className="w-2 h-2 rounded-full bg-green-400" />
                                        Deploy to staging
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                        Run smoke tests
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                                        Deploy to production (manual approval)
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <h3 className="font-medium text-white mb-2">Recent Deployments</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-400">#42 - Production</span>
                                        <span className="text-green-400">Success</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-400">#41 - Staging</span>
                                        <span className="text-green-400">Success</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <Button variant="ghost" className="w-full text-gray-400 hover:text-white">
                            <Settings className="h-4 w-4 mr-2" />
                            Configure Pipeline
                        </Button>
                    </TabsContent>
                    
                    {/* Hosting */}
                    <TabsContent value="hosting" className="space-y-4 mt-4">
                        <div>
                            <label className="text-sm text-gray-400 mb-2 block">Custom Domain</label>
                            <Input
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                placeholder="www.yourdomain.com"
                                className="bg-white/5 border-white/10 text-white"
                            />
                        </div>
                        
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium text-white flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-green-400" />
                                    SSL Certificate
                                </h3>
                                <span className="text-xs text-green-400">Active</span>
                            </div>
                            <p className="text-xs text-gray-400">Automatic HTTPS with Let's Encrypt</p>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <h3 className="font-medium text-white mb-3">DNS Configuration</h3>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Type: A</span>
                                    <span className="text-gray-300">76.76.21.21</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Type: CNAME</span>
                                    <span className="text-gray-300">www → yourdomain.com</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                <p className="text-xs text-gray-400 mb-1">Current Domain</p>
                                <p className="text-sm text-white">mysite.base44.app</p>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                <p className="text-xs text-gray-400 mb-1">Status</p>
                                <p className="text-sm text-green-400 flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-green-400" />
                                    Live
                                </p>
                            </div>
                        </div>
                        
                        <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500">
                            <Globe className="h-4 w-4 mr-2" />
                            Update Domain Settings
                        </Button>
                    </TabsContent>
                    
                    {/* Environments */}
                    <TabsContent value="environments" className="space-y-4 mt-4">
                        <div className="space-y-3">
                            <button
                                onClick={() => setEnvironment('production')}
                                className={`w-full p-4 rounded-lg border transition-all text-left ${
                                    environment === 'production'
                                        ? 'border-green-500/50 bg-green-500/10'
                                        : 'border-white/10 bg-white/5'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-medium text-white">Production</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-400" />
                                        <span className="text-xs text-green-400">Live</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400">www.mysite.com</p>
                                <div className="flex gap-2 mt-2">
                                    <span className="text-xs px-2 py-1 rounded bg-white/10 text-gray-300">main branch</span>
                                    <span className="text-xs px-2 py-1 rounded bg-white/10 text-gray-300">Auto-deploy OFF</span>
                                </div>
                            </button>
                            
                            <button
                                onClick={() => setEnvironment('staging')}
                                className={`w-full p-4 rounded-lg border transition-all text-left ${
                                    environment === 'staging'
                                        ? 'border-yellow-500/50 bg-yellow-500/10'
                                        : 'border-white/10 bg-white/5'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-medium text-white">Staging</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                        <span className="text-xs text-yellow-400">Active</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400">staging.mysite.com</p>
                                <div className="flex gap-2 mt-2">
                                    <span className="text-xs px-2 py-1 rounded bg-white/10 text-gray-300">develop branch</span>
                                    <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">Auto-deploy ON</span>
                                </div>
                            </button>
                            
                            <button
                                onClick={() => setEnvironment('development')}
                                className={`w-full p-4 rounded-lg border transition-all text-left ${
                                    environment === 'development'
                                        ? 'border-blue-500/50 bg-blue-500/10'
                                        : 'border-white/10 bg-white/5'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-medium text-white">Development</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                                        <span className="text-xs text-blue-400">Active</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400">dev.mysite.com</p>
                                <div className="flex gap-2 mt-2">
                                    <span className="text-xs px-2 py-1 rounded bg-white/10 text-gray-300">* branches</span>
                                    <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">Auto-deploy ON</span>
                                </div>
                            </button>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                            <p className="text-sm text-blue-300 mb-2">Environment Variables</p>
                            <p className="text-xs text-blue-200">Configure API keys, database URLs, and other environment-specific settings.</p>
                            <Button variant="ghost" size="sm" className="mt-2 text-blue-400 hover:text-blue-300">
                                Manage Variables
                            </Button>
                        </div>
                        
                        <Button
                            onClick={handleDeploy}
                            disabled={isDeploying}
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        >
                            {isDeploying ? (
                                <>Deploying...</>
                            ) : (
                                <>
                                    <Rocket className="h-4 w-4 mr-2" />
                                    Deploy to {environment}
                                </>
                            )}
                        </Button>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
