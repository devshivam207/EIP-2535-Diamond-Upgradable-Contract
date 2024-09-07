const hre = require("hardhat");

async function main() {
  try {
    // Addresses of deployed contracts
    const facetAAddress = "0x5E9896aD4bf0faf0Eb57434DD8BeD366F6aD9638";
    const diamondProxyAddress = "0x98f4D35aBDCB678B30AAfFF68e6b67716A714D8a";
    const accessRegistryAddress = "0xCce0e5A48003c0bF71E1A9c8482FF79bF1e9Dd2A";

    // Get the deployer signer
    const [deployer] = await hre.ethers.getSigners();
    console.log("Interacting with contracts using address:", deployer.address);

    // Get contract factories
    const FacetA = await hre.ethers.getContractFactory("FacetA");
    const DiamondProxy = await hre.ethers.getContractFactory("DiamondProxy");
    const AccessRegistry = await hre.ethers.getContractFactory(
      "AccessRegistry"
    );

    // Attach to deployed contracts
    const facetA = FacetA.attach(facetAAddress);
    const diamondProxy = DiamondProxy.attach(diamondProxyAddress);
    const accessRegistry = AccessRegistry.attach(accessRegistryAddress);

    // Interact with FacetA through DiamondProxy
    const proxyFacetA = FacetA.attach(diamondProxyAddress);

    // Step 1: Get current value
    const initialValue = await proxyFacetA.getValue();
    console.log("Current value:", initialValue.toString());

    // Step 2: Set new value
    console.log("Updating value by 42...");
    const setValueTx = await proxyFacetA.setValue(42);
    await setValueTx.wait();

    // Step 3: Get updated value
    const updatedValue = await proxyFacetA.getValue();
    console.log("Updated value:", updatedValue.toString());

    // Step 4: Get current admin
    const currentAdmin = await diamondProxy.getAdmin();
    console.log("Current admin:", currentAdmin);

    // Completed
    console.log("Interaction with deployed contracts completed.");
  } catch (error) {
    console.error("Error during interaction:", error);
    process.exitCode = 1;
  }
}

main();
