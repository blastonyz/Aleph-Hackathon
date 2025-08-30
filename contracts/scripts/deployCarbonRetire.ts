import { ethers } from "hardhat";

async function main(){
    const [deployer] = await ethers.getSigners();
  console.log(`🚀 Deploying contracts with account: ${deployer.address}`);

    const carbonRetire = await ethers.getContractFactory("CarbonRetireNFT")
    const carbonRetireToken = await carbonRetire.deploy('ipfs://bafkreibl6xwqyw3psaxlw6r3sq5arvjj5ye5oya7seb3taadxzyglulvma')
    await carbonRetireToken.waitForDeployment();
    const address = await carbonRetireToken.getAddress()

     console.log(`CarbonRetireNFT deployed at: ${address}`);

}

 main().catch((error) => {
        console.error(error);
        process.exitCode = 1;
});