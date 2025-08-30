import {ethers} from 'hardhat'

async function main(){
    const ghToken = await ethers.getContractFactory("GHToken")
    const token = await ghToken.deploy()
    await token.waitForDeployment()

    const address = await token.getAddress()

    console.log("token address: ",address);
    
}

main().catch((error)=>{
    console.error(error);
    process.exitCode = 1;
})