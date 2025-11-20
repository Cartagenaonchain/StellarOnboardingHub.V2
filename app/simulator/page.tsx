"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Send,
  Wallet,
  Shield,
  CheckCircle,
  AlertTriangle,
  Copy,
  Eye,
  EyeOff,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { WalletButton } from "@/components/wallet/WalletButton";

export default function SimulatorPage() {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [memo, setMemo] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionComplete, setTransactionComplete] = useState(false);

  // USD values instead of XLM
  const simulatorBalance = 125.06;
  const transactionFee = 0.000125;
  const exchangeRate = 0.125; // USD per unit

  const handleTransaction = async () => {
    setIsProcessing(true);
    // Simulate transaction processing
    setTimeout(() => {
      setIsProcessing(false);
      setTransactionComplete(true);
      setStep(4);
    }, 3000);
  };

  const resetSimulator = () => {
    setStep(1);
    setAmount("");
    setRecipient("");
    setMemo("");
    setTransactionComplete(false);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F9F9] to-[#EECB01]/10">
      {/* Header */}
      <header className="bg-white border-b border-[#EECB01]/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-[#8E7CE5]">
                  <ArrowLeft className="w-4 h-4" />
                  {/* Hide "Dashboard" text on mobile */}
                  <span className="sm:inline ml-2">Dashboard</span>
                </Button>
              </Link>
              <div className="hidden sm:block w-px h-6 bg-gray-300" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-[#333333] font-sans">
                  Transaction Simulator
                </h1>
                <p className="text-sm text-gray-600">
                  Practice safe transactions risk-free
                </p>
              </div>
            </div>

            {/* Desktop: Horizontal badge layout */}
            <div className="hidden sm:flex items-center space-x-4">
              <WalletButton />
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <Shield className="w-3 h-3 mr-1" />
                Safe Mode
              </Badge>
              <Badge className="bg-[#EECB01]/20 text-[#333333] border-[#EECB01]">
                <Target className="w-3 h-3 mr-1" />
                Learning
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8 overflow-x-auto px-4">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-max">
              {[1, 2, 3, 4].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base ${step >= stepNum
                      ? "bg-[#EECB01] text-[#333333]"
                      : "bg-gray-200 text-gray-500"
                      }`}
                  >
                    {stepNum}
                  </div>
                  {stepNum < 4 && (
                    <div
                      className={`w-8 sm:w-12 h-1 mx-1 sm:mx-2 ${step > stepNum ? "bg-[#EECB01]" : "bg-gray-200"
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Simulator */}
            <div className="lg:col-span-2 w-full">
              {step === 1 && (
                <Card className="w-full border-2 border-[#EECB01]/20 shadow-xl">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-[#EECB01] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Wallet className="w-8 h-8 text-[#333333]" />
                    </div>
                    <CardTitle className="text-2xl text-[#333333] font-sans">
                      Your Digital Wallet
                    </CardTitle>
                    <p className="text-gray-600">
                      This is a simulated wallet for learning purposes
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Balance */}
                    <div className="bg-gradient-to-r from-[#EECB01]/10 to-[#8E7CE5]/10 p-6 rounded-lg text-center">
                      <div className="text-sm text-gray-600 mb-2">
                        Available Balance
                      </div>
                      <div className="text-3xl font-bold text-[#333333] mb-1">
                        ${simulatorBalance.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">USD</div>
                    </div>

                    {/* Wallet Address */}
                    <div className="space-y-2">
                      <Label className="text-[#333333] font-medium">
                        Your Wallet Address
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          value="GCKFBEIYTKP74Q7LBJAML5RKJS37JHGJNF7VQJWVQXZQHCQBGJQRLPQV"
                          readOnly
                          className="font-mono text-sm w-full"
                        />
                        <Button size="sm" variant="outline">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      onClick={() => setStep(2)}
                      className="w-full bg-[#EECB01] hover:bg-[#EECB01]/90 text-[#333333] font-semibold py-3 rounded-full"
                    >
                      Start Transaction
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card className="w-full border-2 border-[#8E7CE5]/20 shadow-xl">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-[#8E7CE5] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-[#333333] font-sans">
                      Send Money
                    </CardTitle>
                    <p className="text-gray-600">Enter transaction details</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="recipient"
                        className="text-[#333333] font-medium"
                      >
                        Recipient Address *
                      </Label>
                      <Input
                        id="recipient"
                        placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="font-mono text-sm w-full"
                      />
                      <p className="text-xs text-gray-500">
                        Enter the destination wallet address
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="amount"
                        className="text-[#333333] font-medium"
                      >
                        Amount (USD) *
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-lg w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Available: ${simulatorBalance.toFixed(2)}</span>
                        <span>USD</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="memo"
                        className="text-[#333333] font-medium"
                      >
                        Memo (Optional)
                      </Label>
                      <Input
                        id="memo"
                        placeholder="Add a note for this transaction"
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        maxLength={28}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500">
                        {memo.length}/28 characters
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Transaction Fee:</span>
                        <span>${transactionFee.toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold">
                        <span>Total Cost:</span>
                        <span>
                          $
                          {(
                            Number.parseFloat(amount) + transactionFee ||
                            transactionFee
                          ).toFixed(6)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={() => setStep(3)}
                        disabled={!amount || !recipient}
                        className="flex-1 bg-[#8E7CE5] hover:bg-[#8E7CE5]/90 text-white font-semibold"
                      >
                        Review Transaction
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 3 && (
                <Card className="w-full border-2 border-orange-400/20 shadow-xl">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-[#333333] font-sans">
                      Review Transaction
                    </CardTitle>
                    <p className="text-gray-600">
                      Double-check all details before sending
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        <span className="font-semibold text-orange-800">
                          Important Reminder
                        </span>
                      </div>
                      <p className="text-sm text-orange-700">
                        Digital transactions are irreversible. Please verify all
                        details carefully.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between py-3 border-b">
                        <span className="text-gray-600">From:</span>
                        <span className="font-mono text-sm text-[#333333]">
                          GCKF...LPQV (Your Wallet)
                        </span>
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <span className="text-gray-600">To:</span>
                        <span className="font-mono text-sm text-[#333333]">
                          {recipient.slice(0, 8)}...{recipient.slice(-8)}
                        </span>
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <span className="text-gray-600">Amount:</span>
                        <span className="text-xl font-bold text-[#333333]">
                          ${amount}
                        </span>
                      </div>
                      <div className="flex justify-between py-3 border-b">
                        <span className="text-gray-600">Fee:</span>
                        <span className="text-[#333333]">
                          ${transactionFee.toFixed(6)}
                        </span>
                      </div>
                      {memo && (
                        <div className="flex justify-between py-3 border-b">
                          <span className="text-gray-600">Memo:</span>
                          <span className="text-[#333333]">{memo}</span>
                        </div>
                      )}
                      <div className="flex justify-between py-3 font-semibold text-lg">
                        <span className="text-gray-800">Total:</span>
                        <span className="text-[#333333]">
                          $
                          {(Number.parseFloat(amount) + transactionFee).toFixed(
                            6
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                      <Button
                        variant="outline"
                        onClick={() => setStep(2)}
                        className="flex-1"
                      >
                        Edit Transaction
                      </Button>
                      <Button
                        onClick={handleTransaction}
                        disabled={isProcessing}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
                      >
                        {isProcessing ? "Processing..." : "Confirm & Send"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {step === 4 && (
                <Card className="w-full border-2 border-green-500 bg-green-50 shadow-xl">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-green-800 font-sans">
                      Transaction Successful! 🎉
                    </CardTitle>
                    <p className="text-green-600">
                      Your simulated transaction has been completed
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <div className="text-center mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm text-gray-600">Transaction Hash</div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => navigator.clipboard.writeText("a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456")}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="font-mono text-sm text-[#333333] bg-gray-100 p-3 rounded break-all">
                          a1b2c3d4e5f6 7890 1234 5678 9012 3456 7890 abcd ef12 3456 7890 abcd ef12 3456
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Amount Sent</div>
                          <div className="font-semibold">${amount}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Transaction Fee</div>
                          <div className="font-semibold">
                            ${transactionFee.toFixed(6)}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">New Balance</div>
                          <div className="font-semibold">
                            $
                            {(
                              simulatorBalance -
                              Number.parseFloat(amount) -
                              transactionFee
                            ).toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Status</div>
                          <div className="font-semibold text-green-600">
                            Confirmed
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#EECB01]/20 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Zap className="w-5 h-5 text-[#EECB01]" />
                        <span className="font-semibold text-[#333333]">
                          Learning Reward
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Great job! You've earned 25 XP for completing the
                        transaction simulator.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                      <Button
                        onClick={resetSimulator}
                        variant="outline"
                        className="flex-1 bg-transparent"
                      >
                        Try Another Transaction
                      </Button>
                      <Link href="/dashboard" className="flex-1">
                        <Button className="w-full bg-[#8E7CE5] hover:bg-[#8E7CE5]/90 text-white font-semibold">
                          Back to Dashboard
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6 w-full">
              {/* Learning Tips */}
              <Card className="w-full border-2 border-[#8E7CE5]/20">
                <CardHeader>
                  <CardTitle className="text-lg text-[#333333] flex items-center">
                    <Shield className="w-5 h-5 text-[#8E7CE5] mr-2" />
                    Security Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Always double-check recipient addresses</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>
                      Keep your private keys secure and never share them
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Start with small amounts when learning</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Use memos for exchanges and services</span>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction Facts */}
              <Card className="w-full border-2 border-[#EECB01]/20">
                <CardHeader>
                  <CardTitle className="text-lg text-[#333333] flex items-center">
                    <TrendingUp className="w-5 h-5 text-[#EECB01] mr-2" />
                    Digital Payment Facts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <div className="font-semibold text-[#333333]">
                      Transaction Speed
                    </div>
                    <div className="text-gray-600">2-5 seconds average</div>
                  </div>
                  <div>
                    <div className="font-semibold text-[#333333]">
                      Network Fee
                    </div>
                    <div className="text-gray-600">$0.000125 (~0.0001%)</div>
                  </div>
                  <div>
                    <div className="font-semibold text-[#333333]">
                      Daily Volume
                    </div>
                    <div className="text-gray-600">$50M+ processed daily</div>
                  </div>
                  <div>
                    <div className="font-semibold text-[#333333]">
                      Energy Efficient
                    </div>
                    <div className="text-gray-600">Eco-friendly technology</div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress */}
              <Card className="w-full border-2 border-green-400/20">
                <CardHeader>
                  <CardTitle className="text-lg text-[#333333] flex items-center">
                    <Target className="w-5 h-5 text-green-600 mr-2" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Simulations Completed</span>
                    <span className="font-semibold">3/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>XP Earned Today</span>
                    <span className="font-semibold">75 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security Score</span>
                    <span className="font-semibold text-green-600">95%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
