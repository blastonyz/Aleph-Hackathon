'use client'
import { useWallet } from "@/app/context/ConnectionProvider"
import { parseUnits } from "ethers"
import { addrGHToken } from "@/contracts/adresses"

const GetTokensERC20 = () => {
    const { account } = useWallet()
    const amount = parseUnits("25000", 18)

    const mintTokens = async () => {
        const res = await fetch("/api/tokens", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ to: account, amount: amount.toString() }),
        });
        const data = await res.json();
        console.log("Mint result:", data);
        if (res.ok) {
            await addTokenToMetaMask();
        }
    };

    const addTokenToMetaMask = async () => {
        try {
            await window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20",
                    options: {
                        address: addrGHToken,
                        symbol: "GHT",
                        decimals: 18
                    },
                },
            });
        } catch (error) {
            console.error("Error adding token:", error);
        }
    };


    return (
        <button
            onClick={mintTokens}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-200"
        >
            Get 25,000 GHT Tokens
        </button>

    );
}

export default GetTokensERC20