import { NextResponse } from "next/server";
import { JsonRpcProvider, Wallet, Contract } from "ethers";
import { addrGHToken } from "@/contracts/adresses";
import GHToken from "@contracts/GHToken.sol/GHToken.json";


export async function POST(request: Request) {
    const { to, amount } = await request.json();
    const provider = new JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet = new Wallet(process.env.SEPOLIA_PRIVATE_KEY || "", provider);
    const token = new Contract(addrGHToken, GHToken.abi, wallet);
    try {
    const tx = await token.mint(to, amount);
    await tx.wait();
    return NextResponse.json({ success: true, txHash: tx.hash });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }

}

