"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Loader2 } from "lucide-react";
import { useSessionWallet } from "@/app/StellarWalletProvider";
import { WalletModal } from "./WalletModal";

export function WalletButton() {
    const { publicKey, balance, isLoading } = useSessionWallet();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoading && !publicKey) {
        return (
            <Button variant="outline" disabled className="rounded-full border-[#8E7CE5]/20">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Loading...
            </Button>
        );
    }

    if (!publicKey) {
        return null; // Or a "Connect" button if we want to allow manual connection here
    }

    return (
        <>
            <Button
                onClick={() => setIsModalOpen(true)}
                variant="outline"
                className="rounded-full border-[#8E7CE5]/20 hover:bg-[#8E7CE5]/10 hover:border-[#8E7CE5] transition-all duration-300"
            >
                <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-[#8E7CE5] rounded-full flex items-center justify-center">
                        <Wallet className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-semibold text-[#333333] hidden sm:inline">
                        {parseFloat(balance).toFixed(2)} XLM
                    </span>
                </div>
            </Button>

            <WalletModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}
