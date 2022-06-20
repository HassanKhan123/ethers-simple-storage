const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://eth-rinkeby.alchemyapi.io/v2/FLr_rS1arer-acPtHw_oCwnCWxyEKxF_"
  );
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // const encryptedKey = fs.readFileSync("./encryptedKey.json", "utf8");
  // let wallet = new ethers.Wallet.fromEncryptedJsonSync(
  //   encryptedKey,
  //   process.env.PRIVATE_KEY_PASSWORD
  // );
  // wallet = wallet.connect(provider);

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.json", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying....");
  const contract = await contractFactory.deploy();
  await contract.deployTransaction.wait(1);
  console.log("contract deployed to:", contract.address);

  const currentFavoriteNumber = await contract.retrieve();
  console.log(currentFavoriteNumber.toString());

  const trResponse = await contract.store("7");
  await trResponse.wait(1);
  const updatedFavoriteNumber = await contract.retrieve();
  console.log(updatedFavoriteNumber.toString());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.log("err", error);
    process.exit(1);
  });
