const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config();

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(
    // Ganache PKey
    process.env.PRIVATE_KEY,
    provider
  );

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.json", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying....");
  const contract = await contractFactory.deploy();
  await contract.deployTransaction.wait(1);

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
