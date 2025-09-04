'use client'
import { useWallet } from "@/app/context/ConnectionProvider";
import { parseUnits } from "ethers";
import { Contract } from "ethers";
import CarbonProjectNFT from "@contracts/CarbonProjectNFT.sol/CarbonProjectNFT.json"
import { useState } from "react";
import { toWeiDecimal } from "../deploy721/DeployFunctions";

type Props = {
    nftAddress: string;
    price: string;
}

const BuyNFT = ({ nftAddress, price }: Props) => {
    const { mainSigner, account, contracts } = useWallet()
    const [error, setError] = useState<string | null>(null);


    const paymentToken = contracts.GHToken
    const carbonToken = new Contract(nftAddress, CarbonProjectNFT.abi, mainSigner)




    const buy = async () => {
        console.log('buying');
        console.log("Raw price string:", price);
        if (!mainSigner || !account || !paymentToken || !carbonToken) {
            return setError("🔒 Connect your wallet to continue");
        }

        const amount = toWeiDecimal(price);
        console.log('amount: ', amount);
        const max = await carbonToken.maxSupply()
        console.log("maxSupply:", max.toString());


        const balance = await paymentToken.balanceOf(account);
        if (balance <= amount) {
            setError("❌ Insufficient token balance to proceed with purchase");
            return;
        }

        try {
            console.log('cast tx');
            const allowance = await paymentToken.allowance(account, nftAddress);
            console.log('allowance: ', allowance);


            if (allowance < amount) {
                const grantAllowance = await paymentToken.approve(nftAddress, amount);
                console.log("✅ Approved", amount.toString());
                const grantReceipt = await grantAllowance.wait();
                console.log("Grant transaction receipt:", grantReceipt);

            } else {
                console.log("✅ Allowance already sufficient");
            }

            try {
                console.log('prev buy');

                try {
                    await carbonToken.buy.staticCall();
                    console.log("✅ buy puede ejecutarse");
                } catch (err) {
                    console.error("❌ buy revertiría:", err);
                }
                const buyResponse = await carbonToken.buy();
                const buyReceipt = await buyResponse.wait();
                console.log("buy receipt:", buyReceipt);
            } catch (err: any) {
                console.error("❌ Buy failed:", err);
                setError("Buy transaction reverted");
                if (err.error && err.error.message) {
                    console.error("Revert reason:", err.error.message)
                } else {
                    console.error("Error object:", err)
                }
            }


        } catch (error) {
            console.error("Error during approval:", error);
        }
    }

    return (
        <div>
            <button
                onClick={buy}
                disabled={!account}
                className={`px-4 py-2 rounded font-semibold transition ${!account
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
            >
                BuyNft
            </button>

            {error && <p>{error}</p>}

        </div>
    );

}

export default BuyNFT