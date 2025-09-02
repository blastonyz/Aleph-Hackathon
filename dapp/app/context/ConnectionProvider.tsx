'use client'
import { useState, createContext, useContext, useEffect } from 'react'
import { BrowserProvider } from 'ethers'
import { JsonRpcSigner } from 'ethers'
import { Contract } from 'ethers'
import GHToken from '@contracts/GHToken.sol/GHToken.json'
import CarbonRetire from '@contracts/CarbonRetireNFT.sol/CarbonRetireNFT.json'
import CarbonProject from "@contracts/CarbonProjectNFT.sol/CarbonProjectNFT.json"
import CarbonFactory from "@contracts/CarbonFactory.sol/CarbonFactory.json"
import { addrGHToken } from '@contracts/adresses'
import { addrCarbonFactory } from '@/contracts/adresses'
import { addrCarbonRetire } from '@/contracts/adresses'
import { addrCarbonProject } from '@/contracts/adresses'


type WalletContextType = {
    account: WalletAddress;
    contracts: {
        GHToken?: Contract;
        CarbonProjectNFT?: Contract;
        CarbonRetireNFT?: Contract;
        CarbonFactory?: Contract;
    };
    connectWallet: () => Promise<void>;
    mainProvider: BrowserProvider | null;
    mainSigner: JsonRpcSigner | null;
};



const WalletContext = createContext<WalletContextType | null>(null)

type Props = {
    children: React.ReactNode;
};

export const ConnectionProvider = ({ children }: Props) => {
    const [account, setAccount] = useState<WalletAddress>(null);
    const [contracts, setContracts] = useState<{
        GHToken?: Contract;
        CarbonProjectNFT?: Contract;
        CarbonRetireNFT?: Contract;
        CarbonFactory?: Contract;
    }>({});

    const [mainProvider, setMainProvider] = useState<BrowserProvider | null>(null);

    const [mainSigner, setMainSigner] = useState<JsonRpcSigner | null>(null);



    useEffect(() => {
        if (mainSigner) {
            setContracts({
                GHToken: new Contract(addrGHToken, GHToken.abi, mainSigner),
                CarbonProjectNFT: new Contract(addrCarbonProject, CarbonProject.abi, mainSigner),
                CarbonRetireNFT: new Contract(addrCarbonRetire, CarbonRetire.abi, mainSigner),
                CarbonFactory: new Contract(addrCarbonFactory, CarbonFactory.abi, mainSigner),
            });
        }
    }, [mainSigner]);


    useEffect(() => {
        const storedAddress = localStorage.getItem('walletAddress');
        if (storedAddress) {
            setAccount(storedAddress);
        }
    }, []);

    useEffect(() => {
        const initProvider = async () => {
            if (typeof window !== 'undefined' && window.ethereum && account && !mainProvider) {
                const provider = new BrowserProvider(window.ethereum);
                setMainProvider(provider);

                const signer = await provider.getSigner();
                setMainSigner(signer);

            }
        };

        initProvider();
    }, [account]);


    const connectWallet = async () => {
        try {
            if (typeof window !== 'undefined' && window.ethereum) {
                const provider = new BrowserProvider(window.ethereum);
                console.log('browser: ', provider);

                setMainProvider(provider);
                const signer = await provider.getSigner();
                const address = await signer.getAddress();
                setAccount(address);
                console.log("Connected account:", address);
                localStorage.setItem('walletAddress', address);


            }



        } catch (error) {
            console.error("Error connecting wallet:", error);

        }
    }
    return (
        <WalletContext.Provider
            value={{
                account,
                contracts,
                connectWallet,
                mainProvider,
                mainSigner
            }}>
            {children}
        </WalletContext.Provider>
    );
}

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error("useWallet must be used within a ConnectionProvider");
    }
    return context;
};