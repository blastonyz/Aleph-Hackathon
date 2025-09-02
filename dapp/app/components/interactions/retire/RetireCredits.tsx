'use client'
import { Contract } from "ethers"
import { useWallet } from "@/app/context/ConnectionProvider"
import { addrCarbonRetire } from "@/contracts/adresses"
import CarbonProjectNFT from '@contracts/CarbonProjectNFT.sol/CarbonProjectNFT.json'

type Props = {
    tokenAddress: string;
}

const RetireCredits = ({tokenAddress}:Props) => {
    const {mainSigner,account,contracts} = useWallet()

       if (!mainSigner || !account) {
       return <div className="alert">🔒 Connect your wallet to continue</div>;

    }

    const carbonToken = new Contract(tokenAddress,CarbonProjectNFT.abi,mainSigner)
    const retireContract = contracts.CarbonRetireNFT

      const getRole = async () => {   
    const roleResponse = await fetch("/api/retire", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokenAddress: tokenAddress }),
    });
    
    const roleData = await roleResponse.json();
    console.log("Role assignment result:", roleData);

    if (!roleData.success) {
      throw new Error(roleData.error || "Failed to assign role");

    }

    const tokenId = 1; // Example tokenId, replace with actual logic to get the tokenId
    const retireTx = await carbonToken.retire(tokenId, "ipfs://bafkreibl6xwqyw3psaxlw6r3sq5arvjj5ye5oya7seb3taadxzyglulvma");
    const retireReceipt = await retireTx.wait();
    console.log("Retire transaction receipt:", retireReceipt);
  }

   return(
        <button onClick={getRole}>Retire Credits</button>
    )
}