import {NextResponse} from 'next/server';
import {JsonRpcProvider, Wallet, Contract} from 'ethers';
import { addrCarbonProject } from '@/contracts/adresses';
import CarbonRetireNFT from '@contracts/CarbonRetireNFT.sol/CarbonRetireNFT.json';
import { keccak256, toUtf8Bytes} from 'ethers';

export async function POST(request: Request) {
  const { tokenAddress} = await request.json();
  console.log('tokenAddress: ',tokenAddress);
  
  const provider = new JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = new Wallet(process.env.SEPOLIA_PRIVATE_KEY || '', provider);
  const retireContract = new Contract(addrCarbonProject, CarbonRetireNFT.abi, wallet);

  const role = keccak256(toUtf8Bytes('MINTER_ROLE'));

  try {
    const tx = await retireContract.grantRole(
        role,
        tokenAddress
    );
    await tx.wait();
    return NextResponse.json({ success: true, txHash: tx.hash });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}