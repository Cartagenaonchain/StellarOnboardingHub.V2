'use client';
import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import { NetworkDetails, SorobanReactProvider, WalletNetwork, useSorobanReact } from "stellar-react";
import deployments from './deployments.json';
import { Keypair, Horizon } from "@stellar/stellar-sdk";

// Definimos el contexto para la Session Wallet
interface SessionWalletContextType {
    secretKey: string | null;
    publicKey: string | null;
    balance: string;
    createWallet: () => Promise<void>;
    loadWallet: () => void;
    fundWallet: () => Promise<void>;
    isLoading: boolean;
    walletType: "freighter" | "local" | null;
}

const SessionWalletContext = createContext<SessionWalletContextType>({
    secretKey: null,
    publicKey: null,
    balance: "0",
    createWallet: async () => { },
    loadWallet: () => { },
    fundWallet: async () => { },
    isLoading: false,
    walletType: null,
});

export const useSessionWallet = () => useContext(SessionWalletContext);

// Componente interno que tiene acceso al contexto de Soroban
const UnifiedWalletProvider = ({ children }: { children: ReactNode }) => {
    const sorobanContext = useSorobanReact();
    const [secretKey, setSecretKey] = useState<string | null>(null);
    const [localPublicKey, setLocalPublicKey] = useState<string | null>(null);
    const [balance, setBalance] = useState<string>("0");
    const [isLoading, setIsLoading] = useState(false);

    const testnetNetworkDetails: NetworkDetails = {
        network: WalletNetwork.TESTNET,
        sorobanRpcUrl: 'https://soroban-testnet.stellar.org/',
        horizonRpcUrl: 'https://horizon-testnet.stellar.org'
    };

    const server = new Horizon.Server(testnetNetworkDetails.horizonRpcUrl);

    // Determinar cuál es la "Active Wallet"
    // Prioridad: Freighter > Local
    const activePublicKey = sorobanContext.address || localPublicKey;
    const walletType = sorobanContext.address ? "freighter" : (localPublicKey ? "local" : null);

    const loadWallet = () => {
        if (typeof window === 'undefined') return;
        const storedKey = localStorage.getItem("stellar_secret_key");
        if (storedKey) {
            setSecretKey(storedKey);
            try {
                const pair = Keypair.fromSecret(storedKey);
                setLocalPublicKey(pair.publicKey());
            } catch (e) {
                console.error("Invalid stored key", e);
                localStorage.removeItem("stellar_secret_key");
            }
        }
    };

    const createWallet = async () => {
        setIsLoading(true);
        try {
            const pair = Keypair.random();
            const secret = pair.secret();
            const pub = pair.publicKey();

            localStorage.setItem("stellar_secret_key", secret);

            setSecretKey(secret);
            setLocalPublicKey(pub);

            await fundAccount(pub);
            await fetchBalance(pub);
        } catch (error) {
            console.error("Error creating wallet:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fundWallet = async () => {
        if (!activePublicKey) return;
        setIsLoading(true);
        try {
            await fundAccount(activePublicKey);
            await fetchBalance(activePublicKey);
        } catch (error) {
            console.error("Error funding wallet:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fundAccount = async (pubKey: string) => {
        try {
            const response = await fetch(`https://friendbot.stellar.org?addr=${pubKey}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Friendbot error:", error);
        }
    };

    const fetchBalance = async (pubKey: string) => {
        try {
            const account = await server.loadAccount(pubKey);
            const xlmBalance = account.balances.find((b: any) => b.asset_type === "native");
            if (xlmBalance) {
                setBalance(xlmBalance.balance);
            }
        } catch (error) {
            console.error("Error fetching balance:", error);
            setBalance("0");
        }
    };

    // Cargar wallet local al inicio
    useEffect(() => {
        loadWallet();
    }, []);

    // Actualizar balance cuando cambia la wallet activa
    useEffect(() => {
        if (activePublicKey) {
            fetchBalance(activePublicKey);
            const interval = setInterval(() => fetchBalance(activePublicKey), 10000);
            return () => clearInterval(interval);
        } else {
            setBalance("0");
        }
    }, [activePublicKey]);

    return (
        <SessionWalletContext.Provider value={{
            secretKey,
            publicKey: activePublicKey,
            balance,
            createWallet,
            loadWallet,
            fundWallet,
            isLoading,
            walletType: walletType as "freighter" | "local" | null
        }}>
            {children}
        </SessionWalletContext.Provider>
    );
};

const StellarWalletProvider = ({ children }: { children: ReactNode }) => {
    const testnetNetworkDetails: NetworkDetails = {
        network: WalletNetwork.TESTNET,
        sorobanRpcUrl: 'https://soroban-testnet.stellar.org/',
        horizonRpcUrl: 'https://horizon-testnet.stellar.org'
    };

    return (
        <SorobanReactProvider
            appName={"Stellar Onboarding Hub"}
            allowedNetworkDetails={[testnetNetworkDetails]}
            activeNetwork={WalletNetwork.TESTNET}
            deployments={deployments}
        >
            <UnifiedWalletProvider>
                {children}
            </UnifiedWalletProvider>
        </SorobanReactProvider>
    );
};

export default StellarWalletProvider;