"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Send, Bot, User, Sparkles, TrendingUp, BarChart2, Activity } from "lucide-react"
import Link from "next/link"

type Message = {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

export default function TradingAdvisorPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "Hello! I'm your AI Trading Advisor. I can help you understand technical analysis concepts like RSI, MACD, and Moving Averages. I can also explain **Blockchain Basics** like wallets, smart contracts, and consensus. What would you like to learn about today?",
            timestamp: new Date(),
        },
    ])
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isTyping])

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!inputValue.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue,
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInputValue("")
        setIsTyping(true)

        // Simulate AI processing delay
        setTimeout(() => {
            const response = generateResponse(userMessage.content)
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: response,
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, aiMessage])
            setIsTyping(false)
        }, 1000)
    }

    const generateResponse = (query: string): string => {
        const lowerQuery = query.toLowerCase()

        // Technical Analysis
        if (lowerQuery.includes("rsi") || lowerQuery.includes("relative strength index")) {
            return "The Relative Strength Index (RSI) is a momentum indicator used in technical analysis. It measures the speed and magnitude of a security's recent price changes to evaluate overvalued or undervalued conditions.\n\n**Key levels:**\n- **Above 70**: Considered 'Overbought' (potential sell signal).\n- **Below 30**: Considered 'Oversold' (potential buy signal)."
        }

        if (lowerQuery.includes("macd") || lowerQuery.includes("moving average convergence divergence")) {
            return "MACD (Moving Average Convergence Divergence) is a trend-following momentum indicator that shows the relationship between two moving averages of a security's price.\n\n**How to read it:**\n- **Signal Line Crossover**: When the MACD line crosses above the signal line, it's a bullish signal (Buy). When it crosses below, it's bearish (Sell)."
        }

        if (lowerQuery.includes("moving average") || lowerQuery.includes("ma") || lowerQuery.includes("sma") || lowerQuery.includes("ema")) {
            return "Moving Averages (MA) smooth out price data to identify the direction of the trend.\n\n- **SMA (Simple Moving Average)**: The average price over a specific period.\n- **EMA (Exponential Moving Average)**: Gives more weight to recent prices.\n\n**Golden Cross**: When a short-term MA (e.g., 50-day) crosses above a long-term MA (e.g., 200-day). Bullish! 🚀"
        }

        if (lowerQuery.includes("support") || lowerQuery.includes("resistance")) {
            return "**Support and Resistance** are key concepts in technical analysis:\n\n- **Support**: A price level where a downtrend tends to pause due to a concentration of demand (buying interest).\n- **Resistance**: A price level where an uptrend tends to pause due to a concentration of supply (selling interest)."
        }

        if (lowerQuery.includes("candle") || lowerQuery.includes("candlestick")) {
            return "Japanese Candlesticks provide more information than a simple line chart. Each candle shows the Open, High, Low, and Close (OHLC) prices for a specific period.\n\n- **Green/White Candle**: Close > Open (Bullish)\n- **Red/Black Candle**: Close < Open (Bearish)\n\nPatterns like 'Doji', 'Hammer', or 'Engulfing' can signal potential reversals."
        }

        if (lowerQuery.includes("trend")) {
            return "A **Trend** is the general direction in which a market is moving.\n\n- **Uptrend**: Higher highs and higher lows.\n- **Downtrend**: Lower highs and lower lows.\n- **Sideways/Ranging**: Price moves within a horizontal range.\n\n'The trend is your friend' - trading with the trend is generally considered safer."
        }

        if (lowerQuery.includes("volume")) {
            return "**Volume** is the number of shares or contracts traded in a security or an entire market during a given period. It is often used to confirm trends and chart patterns. High volume on a breakout suggests a stronger move."
        }

        // Blockchain Basics
        if (lowerQuery.includes("blockchain")) {
            return "A **Blockchain** is a distributed, immutable ledger that records transactions across a network of computers. \n\n- **Decentralized**: No single entity controls it.\n- **Immutable**: Once data is written, it cannot be changed.\n- **Transparent**: Everyone can verify the data."
        }

        if (lowerQuery.includes("wallet")) {
            return "A **Crypto Wallet** stores your public and private keys, allowing you to interact with the blockchain.\n\n- **Public Key**: Your address (like an email) to receive funds.\n- **Private Key**: Your password (keep it secret!) to sign transactions.\n- **Hot Wallet**: Connected to the internet (convenient).\n- **Cold Wallet**: Offline (secure)."
        }

        if (lowerQuery.includes("smart contract")) {
            return "A **Smart Contract** is a self-executing contract with the terms of the agreement directly written into code. It runs on the blockchain and automatically executes when conditions are met, without intermediaries."
        }

        if (lowerQuery.includes("mining") || lowerQuery.includes("consensus") || lowerQuery.includes("proof of")) {
            return "**Consensus Mechanisms** are how a blockchain agrees on the state of the ledger.\n\n- **Proof of Work (Mining)**: Solving complex puzzles to validate blocks (e.g., Bitcoin).\n- **Proof of Stake**: Validators stake coins to secure the network (e.g., Ethereum, Stellar uses SCP - Stellar Consensus Protocol)."
        }

        if (lowerQuery.includes("defi")) {
            return "**DeFi (Decentralized Finance)** refers to financial services (lending, borrowing, trading) built on blockchain technology without traditional intermediaries like banks."
        }

        return "That's a great question! I specialize in technical analysis and blockchain basics. Try asking me about:\n- RSI, MACD, Trends\n- What is a Blockchain?\n- How do Wallets work?\n- Smart Contracts\n- DeFi"
    }

    const suggestions = [
        "What is RSI?",
        "Explain MACD",
        "What is a Blockchain?",
        "How do Wallets work?",
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F9F9F9] to-[#EECB01]/10 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-[#EECB01]/20 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="sm" className="text-[#8E7CE5]">
                                <ArrowLeft className="w-4 h-4" />
                                <span className="hidden sm:inline ml-2">Dashboard</span>
                            </Button>
                        </Link>
                        <div className="w-px h-6 bg-gray-300" />
                        <div className="flex items-center space-x-2">
                            <Bot className="w-6 h-6 text-[#8E7CE5]" />
                            <div>
                                <h1 className="text-lg font-bold text-[#333333] font-sans">AI Trading Advisor</h1>
                                <p className="text-xs text-gray-500">Technical Analysis Expert</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 container mx-auto px-4 py-6 max-w-4xl flex flex-col h-[calc(100vh-80px)]">
                <Card className="flex-1 flex flex-col border-2 border-[#8E7CE5]/20 shadow-xl overflow-hidden bg-white/80 backdrop-blur-sm">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`flex items-start max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                        }`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mx-2 ${msg.role === "user" ? "bg-[#EECB01]" : "bg-[#8E7CE5]"
                                            }`}
                                    >
                                        {msg.role === "user" ? (
                                            <User className="w-5 h-5 text-[#333333]" />
                                        ) : (
                                            <Bot className="w-5 h-5 text-white" />
                                        )}
                                    </div>
                                    <div
                                        className={`p-3 rounded-2xl ${msg.role === "user"
                                            ? "bg-[#EECB01]/20 text-[#333333] rounded-tr-none"
                                            : "bg-gray-100 text-gray-800 rounded-tl-none"
                                            }`}
                                    >
                                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                            {msg.content.split('\n').map((line, i) => (
                                                <span key={i}>
                                                    {line}
                                                    {i < msg.content.split('\n').length - 1 && <br />}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="text-[10px] opacity-50 mt-1 text-right">
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="flex items-center space-x-2 ml-12 bg-gray-100 p-3 rounded-2xl rounded-tl-none">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t bg-white">
                        {/* Suggestions */}
                        {messages.length === 1 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {suggestions.map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => {
                                            setInputValue(suggestion)
                                            // Optional: Auto-send
                                            // handleSendMessage() 
                                        }}
                                        className="text-xs bg-gray-100 hover:bg-[#8E7CE5]/10 hover:text-[#8E7CE5] text-gray-600 px-3 py-1.5 rounded-full transition-colors border border-gray-200"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask about RSI, MACD, trends..."
                                className="flex-1 border-[#8E7CE5]/30 focus:border-[#8E7CE5]"
                            />
                            <Button
                                type="submit"
                                disabled={!inputValue.trim() || isTyping}
                                className="bg-[#8E7CE5] hover:bg-[#8E7CE5]/90 text-white"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </Card>
            </div>
        </div>
    )
}
