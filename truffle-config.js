const path = require("path");
require('dotenv').config({path: './.env'});
const HDWalletProvider = require("@truffle/hdwallet-provider");
const MetaMaskAccountIndex = 0;

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: 5777
    },
    dashboard: {
      port: 24012
    },
    HDWalletProvider_ganache: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, "http://127.0.0.1:7545", MetaMaskAccountIndex )
    },
    network_id: 5777
    },
    goerli_infura:{
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, "https://goerli.infura.io/v3/aee1dcec410e48a5b7b69e94139c419d", MetaMaskAccountIndex )
    },
    network_id: 5
    },

  },
  mocha: {},
  compilers: {
    solc: {
      version: "^0.6.0"
    }
  },
  db: {
    enabled: false
  }
};
