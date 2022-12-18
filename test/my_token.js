
const MyToken = artifacts.require("MyToken");

require("dotenv").config({path:"../.env"});

contract("MyToken", function (accounts) {
  let myToken;
  // We use this beforeEach to test exclusively the working of MyToken contract without crowdsale contract 
  // To do this we just need to deploy MyToken but in the migrations we've added both the contracts
  // So beforeEach function is used so that only this is deployed so that it can be tested exclusively.
 
  beforeEach( async()=>{
    myToken = await MyToken.new(1000);
  })

  it("should add all tokens in my account1", async function () {
    const instance = myToken;
    console.log(await instance.totalSupply());
    let totalSupply = await instance.totalSupply();
    let balance = await instance.balanceOf(accounts[0]);
   
    
    assert.equal(totalSupply,1000,"not equal totalSupply");
    assert.equal(balance,1000,"not equal balance");
    assert.equal(totalSupply.toNumber(),balance.toNumber(),"not equal total supply and balance");
  });
  it("should be able to transfer tokens between accounts",async ()=>{
    const instance =myToken;
    await instance.transfer(accounts[1],100);
    
    let balance1 = await instance.balanceOf(accounts[1]);
    let balance = await instance.balanceOf(accounts[0]);
    assert.equal(balance1,100,"not equal");
    assert.equal(balance,900,"not equal ");
    //console.log("the balance in account 1 is now "+balance1+ " and that in account 0 is "+ balance);
  });

});

