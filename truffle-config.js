var HDWalletProvider = require('truffle-hdwallet-provider');

var mnemonic = 'foster scene ethics bacon trap win purpose dynamic worry danger negative page';

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: "*"
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/dc8f7b316a51477aa95b90492a7334fd')
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
    }
  }
};
