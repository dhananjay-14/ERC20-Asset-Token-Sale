

const Wallet = artifacts.require("Wallet");
const KycContract = artifacts.require("KycContract");
const MyTokenSale = artifacts.require("MyTokenSale");
require("dotenv").config({path:"../.env"});
const MyToken = artifacts.require("MyToken");
contract("MyTokenSale", function ( accounts ) {
  it("should have deployer's balance as zero", async function () {
    
    const instance = await MyToken.deployed();
    let ac = await web3.eth.getAccounts();
    let deployerBalance =await instance.balanceOf(ac[0]);
    return assert.equal(deployerBalance,0);
  });
  it("all Tokens should be in the tokensale smart contract", async () => {
    let instance = await MyToken.deployed();
    let balanceOfTokenSaleContract = await instance.balanceOf(MyTokenSale.address);
    let totalSupply = await instance.totalSupply();
    return assert.equal(balanceOfTokenSaleContract.toNumber(),totalSupply.toNumber(),"all Tokens are not transfered to sale contract");
});
  
  it("should be able to buy tokens", async()=>{
    let myTokenInstance =await MyToken.deployed();
    let TokensaleInstance = await MyTokenSale.deployed();
    let kycInstance = await KycContract.deployed();
    let WalletInstance = await Wallet.deployed();
    let ac = await web3.eth.getAccounts();
    // account[1] is purchasing tokens by paying some amount
    //console.log(ac[1]);
    let balanceOfAccountBeforePayement = await myTokenInstance.balanceOf(ac[1]);
    await kycInstance.setKycCompleted(ac[1],{from:ac[0]});
    console.log("the token balance of account 1 before payement was "+balanceOfAccountBeforePayement);
    let transaction = await TokensaleInstance.sendTransaction({from:ac[1],value:1});
    console.log(transaction);
    let balanceOfAccountAfterPayement = await myTokenInstance.balanceOf(ac[1]);
    let walletBalance = await WalletInstance.viewBalance({from: ac[0]});
    console.log("the wallet balance is "+ walletBalance);
    return assert.equal(balanceOfAccountAfterPayement.toNumber(),1,"error in fetching balance");
     
  })
  

});
