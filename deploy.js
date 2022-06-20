const ethers = require("ethers");
const fs = require("fs");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:7545"
  );
  const wallet = new ethers.Wallet(
    // Ganace PKey
    "500bebfc6af8505d39ca7262ddcb645d5acee1839208a02acd4151170627f31c",
    provider
  );

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying....");
  const contract = await contractFactory.deploy();
  console.log("cc", contract);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.log("err", error);
    process.exit(1);
  });
