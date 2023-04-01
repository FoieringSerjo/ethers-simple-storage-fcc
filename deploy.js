const ethers = require('ethers');
// const solc = require("solc")
const fs = require('fs-extra');
require('dotenv').config();

async function main() {
  // First, compile this!
  // And make sure to have your ganache network up!
  let provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  let wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  // const encryptedJson = fs.readFileSync('./.encryptedKey.json', 'utf8');
  // let wallet = new ethers.Wallet.fromEncryptedJsonSync(
  //   encryptedJson,
  //   process.env.PRIVATE_KEY_PASSWORD
  // );
  // wallet = wallet.connect(provider);

  const abi = fs.readFileSync(
    './SimpleStorage_sol_SimpleStorage.abi',
    'utf8'
  );
  const binary = fs.readFileSync(
    './SimpleStorage_sol_SimpleStorage.bin',
    'utf8'
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log('Deploying, please wait...');
  const contract = await contractFactory.deploy();

  const deploymentReceipt = await contract.deployTransaction.wait(1);
  // console.log(`Contract deployed to ${contract.address}`);
  // console.log('Here is the transaction:');
  // console.log(contract.deployTransaction);
  // console.log('Here is the receipt:');
  // console.log(deploymentReceipt);

  //  Additionally, there is a v,r,and s variable that ethers handles for us.
  //  This is the signature of the transaction.
  //  There is a lot of math going on with those values, but that's how it's gaurenteed that the transaction is signed!
  //  https://ethereum.stackexchange.com/questions/15766/what-does-v-r-s-in-eth-gettransactionbyhash-mean
  //   };

  let currentFavoriteNumber = await contract.retrieve();
  console.log(`Current Favorite Number: ${currentFavoriteNumber}`);
  console.log('Updating favorite number...');
  let transactionResponse = await contract.store(7);
  let transactionReceipt = await transactionResponse.wait(1);
  currentFavoriteNumber = await contract.retrieve();
  console.log(`New Favorite Number: ${currentFavoriteNumber}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
