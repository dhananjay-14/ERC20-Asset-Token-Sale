const MyToken = artifacts.require("MyToken");
const MyTokenSale = artifacts.require("MyTokenSale");
const KycContract = artifacts.require("KycContract");
const Wallet = artifacts.require("Wallet");
require("dotenv").config({path:"../.env"});
//console.log(process.env.INITIAL_TOKENS);
module.exports = async function(deployer){
    await deployer.deploy(MyToken,1000);
    let addr = await web3.eth.getAccounts();
    await deployer.deploy(KycContract);
    await deployer.deploy(Wallet);
    await deployer.deploy(MyTokenSale,1,Wallet.address,MyToken.address,KycContract.address);

    let instance = await MyToken.deployed();
    await instance.transfer(MyTokenSale.address,1000);
} 