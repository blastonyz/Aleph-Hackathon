import {ethers} from 'hardhat'

async function main(){
    const [deployer] = await ethers.getSigners();
    console.log(`🚀 Deploying contracts with account: ${deployer.address}`);

    const factory = await ethers.getContractFactory('CarbonFactory')
    const factoryDeployed = await factory.deploy(
        '0x0571235134DC15a00f02916987C2c16b5fC52E2A',
        '0x6dD981011635aB024661610BceA9DA8b0586e4d6',
        '0x8C6B1ffE600721eA0bdB782D18f2fB904d0b8E9b',
        '0xF4AD022E2D3D8a4d5c63cd10A588D35aF047d53d'
    );

    await factoryDeployed.waitForDeployment()
    const factoryAddress = await factoryDeployed.getAddress()
     console.log(`Factory deployed at: ${factoryAddress}`);
}
main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});
