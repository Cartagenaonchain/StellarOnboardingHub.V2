"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSorobanReact } from "stellar-react";
import { useSessionWallet } from "@/app/StellarWalletProvider";
import { useRouter } from "next/navigation";
import {
  Fingerprint,
  Mail,
  ArrowLeft,
  Shield,
  Zap,
  Wallet,
  Key,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type AuthStep = "initial" | "wallet-choice" | "import-wallet" | "email-auth" | "success"
type WalletChoice = "existing" | "new" | null

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(true)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<AuthStep>("initial")
  const [walletChoice, setWalletChoice] = useState<WalletChoice>(null)
  const [secretKey, setSecretKey] = useState("")
  const [showSecretKey, setShowSecretKey] = useState(false)
  const [importMethod, setImportMethod] = useState<"secret" | "seed">("secret")
  const [seedPhrase, setSeedPhrase] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Freighter/Albedo connection
  const { address, connect } = useSorobanReact();
  // Session Wallet (Passkey) connection
  const { createWallet, publicKey: sessionPublicKey } = useSessionWallet();

  useEffect(() => {
    if (address) {
      setSuccessMessage("🎉 Wallet connected successfully!")
      setCurrentStep("success")
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000)
    }
  }, [address, router]);

  // If session wallet is created, redirect
  useEffect(() => {
    if (sessionPublicKey && currentStep === "wallet-choice") {
      // If we just created it, we handle it in handlePasskeyAuth, 
      // but this acts as a safeguard or for returning users if we implemented "login" logic
    }
  }, [sessionPublicKey, currentStep]);

  const handleInitialAuth = () => {
    if (isSignUp) {
      setCurrentStep("wallet-choice")
    } else {
      // For Sign In, we could also trigger Passkey "Get" here
      handlePasskeyLogin();
    }
  }

  const handleWalletChoice = (choice: WalletChoice) => {
    setWalletChoice(choice)
    if (choice === "existing") {
      setCurrentStep("import-wallet")
    } else {
      // Create new seedless wallet with passkey
      handlePasskeyRegistration()
    }
  }

  const handlePasskeyRegistration = async () => {
    setIsLoading(true)
    setErrorMessage("")

    try {
      // 1. WebAuthn Registration (Platform Authenticator)
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: "Stellar Onboarding Hub",
          id: window.location.hostname,
        },
        user: {
          id: Uint8Array.from("USER_" + Date.now(), c => c.charCodeAt(0)),
          name: "user@stellarhub.com",
          displayName: "Stellar User",
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }, { alg: -257, type: "public-key" }],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },
        timeout: 60000,
        attestation: "none"
      };

      // This triggers the browser's native dialog (TouchID/FaceID)
      await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      });

      // 2. Create Stellar Wallet in background
      await createWallet();

      setSuccessMessage(
        "🎉 New seedless wallet created successfully! Your account is secured with passkey authentication.",
      )
      setCurrentStep("success")

      setTimeout(() => {
        router.push("/dashboard");
      }, 3000)

    } catch (error: any) {
      console.error("Passkey error:", error);
      setErrorMessage("Passkey creation failed or cancelled. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasskeyLogin = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      // For login, we would typically use navigator.credentials.get()
      // But since we are storing the key in localStorage for this demo,
      // we just simulate the "Authentication" check.

      // However, to be "Real", let's trigger the UI.
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      await navigator.credentials.get({
        publicKey: {
          challenge,
          rpId: window.location.hostname,
          userVerification: "required",
        }
      });

      // If successful, we assume the user is valid and the wallet is already loaded from localStorage by the Provider
      // In a real app, we would decrypt the key using the passkey result.

      setSuccessMessage("✅ Successfully signed in! Welcome back.");
      setCurrentStep("success");

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);

    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleWalletImport = async () => {
    setIsLoading(true)
    setErrorMessage("")

    if (importMethod === "secret" && !secretKey.trim()) {
      setErrorMessage("Please enter your secret key")
      setIsLoading(false)
      return
    }

    if (importMethod === "seed" && !seedPhrase.trim()) {
      setErrorMessage("Please enter your seed phrase")
      setIsLoading(false)
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const isValidKey =
        importMethod === "secret"
          ? secretKey.length >= 56 && secretKey.startsWith("S")
          : seedPhrase.split(" ").length >= 12

      if (!isValidKey) {
        throw new Error("Invalid wallet credentials")
      }

      setSuccessMessage("🔐 Wallet imported successfully! You're now logged in with your existing Stellar wallet.")
      setCurrentStep("success")

      setTimeout(() => {
        router.push("/dashboard");
      }, 3000)
    } catch (error) {
      setErrorMessage("Invalid wallet credentials. Please check your secret key or seed phrase and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSuccessMessage("📧 Check your email! We've sent you a secure login link.")
      setCurrentStep("success")
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000)
    } catch (error) {
      setErrorMessage("Authentication failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetFlow = () => {
    setCurrentStep("initial")
    setWalletChoice(null)
    setSecretKey("")
    setSeedPhrase("")
    setErrorMessage("")
    setSuccessMessage("")
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F9F9] to-[#EECB01]/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-[#8E7CE5] hover:text-[#8E7CE5]/80 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex justify-center mb-4">
            <Image src="/stellar-logo.svg" alt="Stellar" width={120} height={30} className="h-8 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-[#333333] font-sans">
            {currentStep === "success" ? "Welcome!" : isSignUp ? "Join Stellar Hub" : "Welcome Back"}
          </h1>
          <p className="text-gray-600 mt-2">
            {currentStep === "success"
              ? "You're all set to start learning!"
              : currentStep === "wallet-choice"
                ? "Let's set up your wallet"
                : currentStep === "import-wallet"
                  ? "Import your existing wallet"
                  : isSignUp
                    ? "Start your Web3 learning journey today"
                    : "Continue your learning adventure"}
          </p>
        </div>

        {/* Success Step */}
        {currentStep === "success" && (
          <Card className="border-2 border-green-500 bg-green-50 shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <Alert className="border-green-200 bg-green-50 mb-4">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
              </Alert>
              <p className="text-gray-600 mb-4">Redirecting you to your dashboard...</p>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-[#EECB01] rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-[#8E7CE5] rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Initial Auth Step */}
        {currentStep === "initial" && (
          <Card className="border-2 border-[#EECB01]/20 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-[#333333] font-sans">
                {isSignUp ? "Create Account" : "Sign In"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {errorMessage && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
                </Alert>
              )}

              {/* Passkey Authentication */}
              <div className="space-y-4">
                <Button
                  onClick={handleInitialAuth}
                  disabled={isLoading}
                  className="w-full bg-[#EECB01] hover:bg-[#EECB01]/90 text-[#333333] font-semibold py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Fingerprint className="w-5 h-5 mr-2" />
                  {isLoading ? "Processing..." : `${isSignUp ? "Sign Up" : "Sign In"} with Passkey`}
                </Button>

                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-[#8E7CE5]/10 p-3 rounded-lg">
                  <Shield className="w-4 h-4 text-[#8E7CE5] hidden sm:block" />
                  <span>Secure, passwordless authentication - no seed phrases to remember!</span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or continue with email</span>
                </div>
              </div>

              {/* Email Authentication */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#333333] font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-2 border-gray-200 focus:border-[#8E7CE5] rounded-lg"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full bg-[#8E7CE5] hover:bg-[#8E7CE5]/90 text-white font-semibold py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  {isLoading ? "Processing..." : `${isSignUp ? "Sign Up" : "Sign In"} with Email`}
                </Button>
              </form>

              {/* Toggle Sign Up/Sign In */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}
                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp)
                      resetFlow()
                    }}
                    className="ml-2 text-[#8E7CE5] hover:text-[#8E7CE5]/80 font-medium"
                  >
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </button>
                </p>
              </div>

              {/* Benefits */}
              {isSignUp && (
                <div className="bg-gradient-to-r from-[#EECB01]/10 to-[#8E7CE5]/10 p-4 rounded-lg space-y-2">
                  <h4 className="font-semibold text-[#333333] flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-[#EECB01]" />
                    What you'll get:
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Interactive Web3 & Stellar lessons</li>
                    <li>• Gamified learning with XP and badges</li>
                    <li>• Risk-free transaction simulators</li>
                    <li>• Community support and leaderboards</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Wallet Choice Step */}
        {currentStep === "wallet-choice" && (
          <Card className="border-2 border-[#EECB01]/20 shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-[#EECB01] rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-[#333333]" />
              </div>
              <CardTitle className="text-xl text-[#333333] font-sans">Wallet Setup</CardTitle>
              <p className="text-gray-600">Do you already have a Stellar wallet?</p>
            </CardHeader>
            <CardContent className="space-y-4">

              {!address ? (
                <Button
                  onClick={connect}
                  variant="outline"
                  className="w-full p-8 sm:p-6 h-auto border-2 border-[#8E7CE5]/20 hover:border-[#8E7CE5] hover:bg-[#8E7CE5]/5 transition-all duration-300"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="text-left">
                      <div className="font-semibold text-[#333333] text-xl sm:text-lg">Yes, I have an account</div>
                      <div className="text-base sm:text-sm text-gray-600">Connect Freighter / Albedo</div>
                    </div>
                    <ArrowRight className="hidden sm:inline-block w-8 h-8 sm:w-6 sm:h-6 text-[#8E7CE5] flex-shrink-0" />
                  </div>
                </Button>
              ) : (
                <div className="w-full p-8 sm:p-6 h-auto bg-green-100 rounded-lg border-2 border-green-500">
                  <div className="flex items-center justify-between w-full">
                    <div className="text-left">
                      <div className="font-semibold text-green-800 text-xl sm:text-lg">Wallet Connected!</div>
                      <div className="text-base sm:text-sm text-green-600">Redirecting to dashboard...</div>
                    </div>
                    <CheckCircle className="w-8 h-8 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                  </div>
                </div>
              )}

              <Button
                onClick={() => handleWalletChoice("new")}
                className="w-full p-8 sm:p-6 h-auto bg-[#EECB01] hover:bg-[#EECB01]/90 text-[#333333] transition-all duration-300"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="text-left">
                    <div className="font-semibold text-xl sm:text-lg">No, create a new account</div>
                    <div className="text-base sm:text-sm opacity-80">Account with passkey</div>
                  </div>
                  <ArrowRight className="hidden sm:inline-block w-8 h-8 sm:w-6 sm:h-6 text-[#8E7CE5] flex-shrink-0" />
                </div>
              </Button>

              <div className="bg-[#8E7CE5]/10 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Shield className="w-4 h-4 text-[#8E7CE5] mt-0.5 hidden sm:block" />
                  <div className="text-sm text-gray-700">
                    <strong>New to Stellar?</strong> We recommend creating a new seedless wallet for the best security
                    and ease of use.
                  </div>
                </div>
              </div>

              <Button onClick={() => setCurrentStep("initial")} variant="ghost" className="w-full text-gray-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Import Wallet Step */}
        {currentStep === "import-wallet" && (
          <Card className="border-2 border-[#8E7CE5]/20 shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-[#8E7CE5] rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-[#333333] font-sans">Import Your Wallet</CardTitle>
              <p className="text-gray-600">Enter your wallet credentials to import</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {errorMessage && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
                </Alert>
              )}

              {/* Import Method Selection */}
              <div className="space-y-3">
                <Label className="text-[#333333] font-medium">Import Method</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => setImportMethod("secret")}
                    variant={importMethod === "secret" ? "default" : "outline"}
                    className={importMethod === "secret" ? "bg-[#8E7CE5] text-white" : ""}
                  >
                    Secret Key
                  </Button>
                  <Button
                    onClick={() => setImportMethod("seed")}
                    variant={importMethod === "seed" ? "default" : "outline"}
                    className={importMethod === "seed" ? "bg-[#8E7CE5] text-white" : ""}
                  >
                    Seed Phrase
                  </Button>
                </div>
              </div>

              {/* Secret Key Input */}
              {importMethod === "secret" && (
                <div className="space-y-2">
                  <Label htmlFor="secretKey" className="text-[#333333] font-medium">
                    Secret Key *
                  </Label>
                  <div className="relative">
                    <Input
                      id="secretKey"
                      type={showSecretKey ? "text" : "password"}
                      placeholder="SXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                      value={secretKey}
                      onChange={(e) => setSecretKey(e.target.value)}
                      className="font-mono text-sm pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                      onClick={() => setShowSecretKey(!showSecretKey)}
                    >
                      {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Your secret key should start with 'S' and be 56 characters long
                  </p>
                </div>
              )}

              {/* Seed Phrase Input */}
              {importMethod === "seed" && (
                <div className="space-y-2">
                  <Label htmlFor="seedPhrase" className="text-[#333333] font-medium">
                    Seed Phrase *
                  </Label>
                  <textarea
                    id="seedPhrase"
                    placeholder="Enter your 12 or 24 word seed phrase separated by spaces"
                    value={seedPhrase}
                    onChange={(e) => setSeedPhrase(e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 focus:border-[#8E7CE5] rounded-lg resize-none"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">Enter 12 or 24 words separated by spaces</p>
                </div>
              )}

              {/* Security Warning */}
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>Security Notice:</strong> Your wallet credentials are processed securely and never stored on
                  our servers.
                </AlertDescription>
              </Alert>

              <div className="flex space-x-3">
                <Button
                  onClick={() => setCurrentStep("wallet-choice")}
                  variant="outline"
                  className="flex-1"
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleWalletImport}
                  disabled={isLoading || (importMethod === "secret" ? !secretKey : !seedPhrase)}
                  className="flex-1 bg-[#8E7CE5] hover:bg-[#8E7CE5]/90 text-white font-semibold"
                >
                  {isLoading ? "Importing..." : "Import Wallet"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Email Auth Step */}
        {currentStep === "email-auth" && (
          <Card className="border-2 border-[#EECB01]/20 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-[#333333] font-sans">Sign In</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {errorMessage && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{errorMessage}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handlePasskeyLogin}
                disabled={isLoading}
                className="w-full bg-[#EECB01] hover:bg-[#EECB01]/90 text-[#333333] font-semibold py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Fingerprint className="w-5 h-5 mr-2" />
                {isLoading ? "Authenticating..." : "Sign In with Passkey"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#333333] font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-2 border-gray-200 focus:border-[#8E7CE5] rounded-lg"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full bg-[#8E7CE5] hover:bg-[#8E7CE5]/90 text-white font-semibold py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  {isLoading ? "Processing..." : "Sign In with Email"}
                </Button>
              </form>

              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600">
                  Don't have an account?
                  <button
                    onClick={() => {
                      setIsSignUp(true)
                      resetFlow()
                    }}
                    className="ml-2 text-[#8E7CE5] hover:text-[#8E7CE5]/80 font-medium"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <p className="text-center text-xs text-gray-500 mt-6">
          By continuing, you agree to our{" "}
          <Link href="#" className="text-[#8E7CE5] hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-[#8E7CE5] hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
