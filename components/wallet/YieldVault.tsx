"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TrendingUp, ArrowUpRight, ArrowDownLeft, Lock, Info } from "lucide-react";
import { useSessionWallet } from "@/app/StellarWalletProvider";

export function YieldVault() {
    const { balance } = useSessionWallet();
    const [vaultBalance, setVaultBalance] = useState<number>(0);
    const [amount, setAmount] = useState("");
    const [isDepositing, setIsDepositing] = useState(true);
    const [simulatedApy, setSimulatedApy] = useState(5.5); // Initial APY
    const [fedRate, setFedRate] = useState(5.33); // Base FED Rate

    // Load initial vault balance from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("simulated_vault_balance");
        if (stored) {
            setVaultBalance(parseFloat(stored));
        }
    }, []);

    // Save to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("simulated_vault_balance", vaultBalance.toString());
    }, [vaultBalance]);

    // Simulate FED Rate Fluctuations
    useEffect(() => {
        const interval = setInterval(() => {
            // Fluctuate between 5.25 and 5.50
            const fluctuation = (Math.random() * 0.25) - 0.125;
            const newRate = 5.33 + fluctuation;
            setFedRate(newRate);

            // DeFi Yield is typically FED Rate + Risk Premium (e.g., 1-3%)
            setSimulatedApy(newRate + 2.5);
        }, 5000); // Update rate every 5 seconds

        return () => clearInterval(interval);
    }, []);

    // Simulate Yield Generation (every 3 seconds)
    useEffect(() => {
        if (vaultBalance <= 0) return;

        const interval = setInterval(() => {
            // Calculate yield for 3 seconds at current dynamic APY
            // Accelerated for demo: 1 day of yield every 3 seconds
            const dailyRate = simulatedApy / 100 / 365;
            const yieldEarned = vaultBalance * dailyRate;

            setVaultBalance(prev => prev + yieldEarned);
        }, 3000);

        return () => clearInterval(interval);
    }, [vaultBalance, simulatedApy]);

    const handleAction = () => {
        const val = parseFloat(amount);
        if (isNaN(val) || val <= 0) return;

        if (isDepositing) {
            // In a real app, this would send XLM to a contract
            // Here we just "move" it visually (we don't actually deduct from real testnet wallet for the simulation simplicity, 
            // or we could if we wanted to be very strict, but keeping it simple for "Simulation" inside the modal)
            // To make it feel real, let's just track the "Vault" balance. 
            // Deducting from real wallet would require signing a tx, which we can do, but for this "Yield Simulator" requested as "Defindex style",
            // we focus on the Vault mechanics.
            setVaultBalance(prev => prev + val);
        } else {
            if (val > vaultBalance) return;
            setVaultBalance(prev => prev - val);
        }
        setAmount("");
    };

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#8E7CE5] to-[#6C5DD3] rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10">
                    <TrendingUp className="w-32 h-32" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center space-x-2 mb-1 opacity-90">
                        <Lock className="w-4 h-4" />
                        <span className="text-sm font-medium">Stellar Yield Vault</span>
                    </div>
                    <div className="text-4xl font-bold mb-2">
                        {vaultBalance.toFixed(7)} <span className="text-lg opacity-80">XLM</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/20 w-fit px-3 py-1 rounded-full text-sm">
                        <TrendingUp className="w-4 h-4" />
                        <span>+{simulatedApy.toFixed(2)}% APY</span>
                        <span className="text-xs opacity-70 ml-1">(FED Rate: {fedRate.toFixed(2)}% + 2.5%)</span>
                    </div>
                </div>
            </div>

            <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                <button
                    onClick={() => setIsDepositing(true)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isDepositing ? "bg-white shadow text-[#8E7CE5]" : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Deposit
                </button>
                <button
                    onClick={() => setIsDepositing(false)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isDepositing ? "bg-white shadow text-[#8E7CE5]" : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Withdraw
                </button>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-gray-600">Amount to {isDepositing ? "Deposit" : "Withdraw"}</Label>
                    <div className="relative">
                        <Input
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="pr-16 text-lg"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">
                            XLM
                        </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>
                            {isDepositing
                                ? `Wallet Balance: ${parseFloat(balance).toFixed(2)} XLM`
                                : `Vault Balance: ${vaultBalance.toFixed(2)} XLM`
                            }
                        </span>
                        {isDepositing && (
                            <button
                                onClick={() => setAmount(balance)}
                                className="text-[#8E7CE5] hover:underline"
                            >
                                Max
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-700">
                        <p className="font-semibold mb-1">How it works</p>
                        <p>
                            This is a simulation of a DeFi vault. In a real scenario, your assets are locked in a smart contract
                            and earn yield from lending or liquidity provision protocols like Defindex or Aqua.
                        </p>
                    </div>
                </div>

                <Button
                    onClick={handleAction}
                    disabled={!amount || parseFloat(amount) <= 0}
                    className="w-full bg-[#8E7CE5] hover:bg-[#8E7CE5]/90 text-white font-semibold py-6 text-lg"
                >
                    {isDepositing ? (
                        <>
                            <ArrowUpRight className="w-5 h-5 mr-2" />
                            Deposit to Vault
                        </>
                    ) : (
                        <>
                            <ArrowDownLeft className="w-5 h-5 mr-2" />
                            Withdraw from Vault
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
