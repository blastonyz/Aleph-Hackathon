import {ethers} from 'hardhat'

async function main(){
    const [deployer] = await ethers.getSigners();
    console.log(`🚀 Deploying contracts with account: ${deployer.address}`);

    const factory = await ethers.getContractFactory('CarbonFactory')
    const factoryDeployed = await factory.deploy(
        '0x0571235134DC15a00f02916987C2c16b5fC52E2A',
        '0xAb15A885922d5B7183CEc713162cF878089C18F3',
        '0x566aF61A5a0D58201221B99C503d5b1B434f0820',
        '0x6FeD3c8e713AD97faEc3E1aBB46cec4c9Fa574A8'
    );

    await factoryDeployed.waitForDeployment()
    const factoryAddress = await factoryDeployed.getAddress()
     console.log(`Factory deployed at: ${factoryAddress}`);
}
main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});
//0xC018B88f78691d2Fd31c8168a7d60884E6e6F074