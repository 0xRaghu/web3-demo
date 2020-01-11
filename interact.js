Web3 = require("web3");
fs = require("fs");
solc = require("solc");
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
let accounts, defaultAccount;
fileContent = fs.readFileSync("Add.sol").toString();
var input = {
  language: "Solidity",
  sources: {
    "Add.sol": {
      content: fileContent
    }
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"]
      }
    }
  }
};

var output = JSON.parse(solc.compile(JSON.stringify(input)));

ABI = output.contracts["Add.sol"]["Add"].abi;
bytecode = output.contracts["Add.sol"]["Add"].evm.bytecode.object;

contract = new web3.eth.Contract(ABI);

web3.eth.getAccounts().then(result => {
  accounts = result;
  defaultAccount = accounts[0];
  deployed = contract
    .deploy({ data: bytecode })
    .send({ from: defaultAccount, gas: 470000 }, function(
      error,
      transactionHash
    ) {
      console.log("Error: " + error, " Transaction Hash: " + transactionHash);
    })
    .on("error", function(error) {
      console.log("Error: " + error);
    })
    .on("transactionHash", function(transactionHash) {
      console.log("Transaction Hash: ", transactionHash);
    })
    .on("receipt", function(receipt) {
      console.log("Contract Address: ", receipt.contractAddress); // contains the new contract address
    })
    .on("confirmation", function(confirmationNumber, receipt) {})
    .then(function(newContractInstance) {
      newContractInstance.methods.getSum().call((err, balance) => {
        console.log("Initial Balance: " + balance);
      });
      newContractInstance.methods
        .Sum(1, 2)
        .send({ from: defaultAccount }, function() {
          newContractInstance.methods.getSum().call((err, balance) => {
            console.log("Balance: " + balance);
          });
        });
    });
});
