import { ethers } from 'hardhat';

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`🚀 Deploying contracts with account: ${deployer.address}`);
    // Deploy CarbonProjectNFT
    const CarbonProjectNFT = await ethers.getContractFactory("CarbonProjectNFT");
    const carbonNFT = await CarbonProjectNFT.deploy();
    await carbonNFT.waitForDeployment();
    const address = await carbonNFT.getAddress();

    console.log(`CarbonProjectNFT deployed at: ${address}`);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});