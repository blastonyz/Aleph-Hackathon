import { parseUnits } from 'ethers';
import { Project } from '@/types/types';
import { Contract } from 'ethers';



export async function deployProject({
  name,
  symbol,
  projectId,
  owner,
  paymentToken,
  retireContract,
  treasury,
  price,
  maxSupply,
  enforceNoResale,
  metadataURI,
  factoryContract, // 👈 instancia del contrato
}: {
  name: string;
  symbol: string;
  projectId: number;
  owner: string;
  paymentToken: string;
  retireContract: string;
  treasury: string;
  price: BigInt;
  maxSupply: BigInt;
  enforceNoResale: boolean;
  metadataURI: string;
  factoryContract: any;
}) {

  const tx = await factoryContract.createProjectClone(
    name,
    symbol,
    projectId,
    owner,
    paymentToken,
    retireContract,
    treasury,
    price,
    maxSupply,
    enforceNoResale,
    metadataURI
  );

  const receipt = await tx.wait();
  if (!receipt) throw new Error("❌ No transaction receipt found");

  const filter = factoryContract.filters.ProjectDeployed();
  const events = await factoryContract.queryFilter(filter, receipt.blockNumber, receipt.blockNumber);
  if (events.length === 0) throw new Error("❌ No ProjectDeployed events found");

  const parsed = events[0];
  if ("args" in parsed) {
    return {
      address: parsed.args.clone,
      projectId: parsed.args.projectId,
      owner: parsed.args.owner,
      txHash: receipt.hash,
    };
  } else {
    throw new Error("❌ Event does not contain args");
  }
}


export function buildDeployParamsFromProject(
  project: Project,
  account: string,
  cid: string,
  erc20address: string,
  retireAddress: string,
  factoryContract: Contract
) {

  const maxSupply = BigInt(Math.floor(project.stats.totalSupply - project.stats.totalRetired));
  const price = toWeiDecimal(project.price);

  console.log('maxSUp: ',maxSupply);
  
  return {
    name: project.name,
    symbol: project.symbol || project.registry,
    projectId: parseInt(project.projectID.toString()),
    owner: account,
    paymentToken: erc20address,
    retireContract: retireAddress,
    treasury: account,
    price,
    maxSupply,
    enforceNoResale: false,
    metadataURI: `ipfs://${cid}`,
    factoryContract
  };
}


export function  buildMetadata(project: Project,imageCID: string = "bafkreiawez4ufmfkuijtf7rsxxbicx7sbrufdihmpnnydf3h6b7jnctupe") {
  return {
    name: `Carbon Credit #1`,
    description: `1 ton of CO₂ offset from ${project.name}`,
    image: `ipfs://${imageCID}`,
    attributes: [
      { trait_type: "Project", value: project.name },
      { trait_type: "Carbon Offset", value: "1 ton" },
      { trait_type: "Retirable", value: true },
    ],
  };
}

export function toWeiDecimal(str: string): bigint {
  const [whole, fraction = ""] = str.split(".");
  const paddedFraction = (fraction + "0".repeat(18)).slice(0, 18);
  return BigInt(whole) * BigInt(10 ** 18) + BigInt(paddedFraction);
}
