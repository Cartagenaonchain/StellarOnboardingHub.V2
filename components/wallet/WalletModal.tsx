"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSessionWallet } from "@/app/StellarWalletProvider";
import { Copy, ExternalLink, RefreshCw, Send, Wallet as WalletIcon, TrendingUp } from "lucide-react";
import { YieldVault } from "./YieldVault";

interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
    const { publicKey, balance, fundWallet, isLoading, walletType } = useSessionWallet();
    const [copied, setCopied] = useState(false);

    const copyAddress = () => {
        if (publicKey) {
            navigator.clipboard.writeText(publicKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const truncateAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-xl border-[#EECB01]/20">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2 text-[#333333]">
                        <WalletIcon className="w-5 h-5 text-[#8E7CE5]" />
                        <span>My Stellar Wallet</span>
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="wallet" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="wallet">Wallet</TabsTrigger>
                        <TabsTrigger value="earn" className="flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>Earn</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="wallet" className="space-y-6">
                        {/* Balance Card */}
                        <div className="bg-gradient-to-r from-[#EECB01] to-[#F4D03F] rounded-xl p-6 text-[#333333] shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 opacity-10">
                                <WalletIcon className="w-32 h-32" />
                            </div>
                            <div className="relative z-10">
                                <div className="text-sm font-medium opacity-80 mb-1">Total Balance</div>
                                <div className="text-4xl font-bold mb-4">
                                    {parseFloat(balance).toFixed(2)} <span className="text-lg">XLM</span>
                                </div>
                                <div className="flex items-center space-x-2 bg-white/20 w-fit px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <span>Stellar Testnet</span>
                                    <span className="opacity-50">|</span>
                                    <span className="font-semibold">{walletType === "freighter" ? "Freighter" : "Passkey Wallet"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-gray-500">Wallet Address</div>
                            <div className="flex items-center space-x-2">
                                <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm flex-1 text-gray-600 truncate">
                                    {publicKey ? truncateAddress(publicKey) : "Loading..."}
                                </div>
                                <Button variant="outline" size="icon" onClick={copyAddress}>
                                    {copied ? <span className="text-green-600 font-bold">✓</span> : <Copy className="w-4 h-4" />}
                                </Button>
                                <Button variant="outline" size="icon" asChild>
                                    <a
                                        href={`https://stellar.expert/explorer/testnet/account/${publicKey}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </Button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                className="border-[#8E7CE5] text-[#8E7CE5] hover:bg-[#8E7CE5]/10"
                                onClick={() => fundWallet()}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                )}
                                Get Test XLM
                            </Button>
                            <Button className="bg-[#8E7CE5] hover:bg-[#8E7CE5]/90 text-white">
                                <Send className="w-4 h-4 mr-2" />
                                Send
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="earn">
                        <YieldVault />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
