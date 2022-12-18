import React, { Component } from "react";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KycContract from "./contracts/KycContract.json";
import Crowdsale from "./contracts/Crowdsale.json";
import Wallet from "./contracts/Wallet.json";
import getWeb3 from "./getWeb3";
import "./App.css";

class App extends Component {
  state = { loaded: false, kycAddress: "0x00...", tokenSaleAddress: "", userTokens: 0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();

      this.MyToken = new this.web3.eth.Contract(
        MyToken.abi,
        MyToken.networks[this.networkId] && MyToken.networks[this.networkId].address,
      );
      this.MyTokenSale = new this.web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSale.networks[this.networkId] && MyTokenSale.networks[this.networkId].address,
      );
      this.KycContract = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address,
      );
      this.Wallet = new this.web3.eth.Contract(
        Wallet.abi,
        Wallet.networks[this.networkId] && Wallet.networks[this.networkId].address,);
      this.listenToTokenTransfer();
      // this.getWalletBalance();
      this.setState({ loaded: true, tokenSaleAddress: MyTokenSale.networks[this.networkId].address, }, this.updateUserTokens);

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (

      <div className="App">
        <h1>ERC20 Asset Token Sale</h1>
        <p class="welmessage">Get your Tokens now!!!</p>
        <div className="box">

          <h2>Enable your account</h2>
          <span class="addresstext">Address to allow:</span> <input type="text" class="input_text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange} />
          <button type="button" class="btn" onClick={this.handleKycSubmit}>Complete KYC</button>
          <button type="button" class="btn" onClick={this.getWalletBalance}>Wallet Balance</button>
        </div>
        <div class="box2">
          <h2>User Tokens</h2>
          <p class="info">To buy Tokens, send Ether to this address: {this.state.tokenSaleAddress}</p>
          <p class="info">You have: {this.state.userTokens} Tokens</p>

          <button type="button" class="btn" onClick={this.handleBuyToken}>Buy Tokens</button>
        </div>

      </div>
    );
  }
  handleBuyToken = async () => {
    await this.MyTokenSale.methods.buyTokens(this.accounts[0]).send({ from: this.accounts[0], value: 1 });
  }
  getWalletBalance = async () => {
    let walletBalance = await this.Wallet.methods.viewBalance().call();
    alert("Your wallet balance is " + walletBalance);
  }


  updateUserTokens = async () => {
    let userTokens = await this.MyToken.methods.balanceOf(this.accounts[0]).call();
    this.setState({ userTokens: userTokens });
  }

  listenToTokenTransfer = async () => {
    this.MyToken.events.Transfer({ to: this.accounts[0] }).on("data", this.updateUserTokens);
  }



  handleKycSubmit = async () => {
    const { kycAddress } = this.state;
    let result = await this.KycContract.methods.setKycCompleted(kycAddress).send({ from: this.accounts[0] });
    alert("KYC Completed! Account " + kycAddress + " is now whitelisted");
    this.setState({ kycAddress: "0x00..." });
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }
}
export default App;