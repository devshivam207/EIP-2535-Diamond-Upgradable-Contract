const hre = require("hardhat");

async function main() {
  try {
    // Manually set admin addresses or use ethers
    const deployerAddress = "Public-Address-Of-Signer";

    // Get the deployer signer
    const [deployer] = await hre.ethers.getSigners();
    if (deployer.address.toLowerCase() !== deployerAddress.toLowerCase()) {
      throw new Error("Deployer address doesn't match the expected address");
    }

    // Step 1: Deploy FacetA
    const FacetA = await hre.ethers.getContractFactory("FacetA");
    const facetA = await FacetA.deploy();
    await facetA.waitForDeployment();
    console.log(`FacetA deployed at: ${await facetA.getAddress()}`);

    // Step 2: Deploy DiamondProxy
    const DiamondProxy = await hre.ethers.getContractFactory("DiamondProxy");
    const diamondProxy = await DiamondProxy.deploy();
    await diamondProxy.waitForDeployment();
    console.log(`DiamondProxy deployed at: ${await diamondProxy.getAddress()}`);

    // Step 3: Deploy AccessRegistry
    const AccessRegistry = await hre.ethers.getContractFactory(
      "AccessRegistry"
    );
    const accessRegistry = await AccessRegistry.deploy();
    await accessRegistry.waitForDeployment();
    console.log(
      `AccessRegistry deployed at: ${await accessRegistry.getAddress()}`
    );

    // Step 4: Add FacetA to the proxy
    const selectors = FacetA.interface.fragments
      .filter((fragment) => fragment.type === "function")
      .map((fragment) => FacetA.interface.getFunction(fragment.name).selector);

    console.log("Selectors:", selectors);

    const facetAAddress = await facetA.getAddress();
    const diamondProxyAddress = await diamondProxy.getAddress();

    console.log(
      `Adding FacetA (${facetAAddress}) to DiamondProxy (${diamondProxyAddress})`
    );

    const addFacetTx = await diamondProxy.addFacet(facetAAddress, selectors);
    const receipt = await addFacetTx.wait();
    console.log(
      `FacetA added to DiamondProxy. Transaction hash: ${receipt.hash}`
    );

    // Verify selectors
    for (const selector of selectors) {
      const facetAddress = await diamondProxy.getFacetAddress(selector);
      console.log(`Selector ${selector} points to facet: ${facetAddress}`);
    }

    // Step 5: Interact with FacetA through the DiamondProxy
    const proxyFacetA = FacetA.attach(diamondProxyAddress);

    // Function call 1: Initial getter should return 0
    const initialValue = await proxyFacetA.getValue();
    console.log(`Initial value: ${initialValue.toString()}`);

    // Function call 2: Call the setter function with input 10
    console.log("Incrementing value by 10...");
    const setValueTx = await proxyFacetA.setValue(10);
    await setValueTx.wait();

    // Function call 3: Getter should now return 10
    const updatedValue = await proxyFacetA.getValue();
    console.log(`Value after setting to 10: ${updatedValue.toString()}`);

    // Step 6: Fetch initial admin address of DiamondProxy
    const initialAdminDiamond = await diamondProxy.getAdmin();
    console.log(`Initial admin (DiamondProxy): ${initialAdminDiamond}`);

    // Step 7: Change the admin address using AccessRegistry
    console.log(`Changing admin to: ${newAdminAddress}`);
    const changeAdminTx = await diamondProxy.setAdmin(newAdminAddress);
    await changeAdminTx.wait();

    // // Verify admin change
    // const updatedAdminDiamond = await diamondProxy.getAdmin();
    // console.log(`New admin (DiamondProxy): ${updatedAdminDiamond}`);
    // << Only work if our new transaction signer is out updated admin >>
    // Step 8: Set value to 81 (use the new admin address)
    // const newAdminSigner = await ethers.getSigner(newAdminAddress);
    // const proxyFacetAWithNewAdmin =
    //   FacetA.connect(newAdminSigner).attach(diamondProxyAddress);
    // const setValueTx2 = await proxyFacetAWithNewAdmin.setValue(81);
    // await setValueTx2.wait();

    // // Final getter should return 81
    // const finalValue = await proxyFacetA.getValue();
    // console.log(`Final value after setting 81: ${finalValue.toString()}`);
  } catch (error) {
    console.error("Error during deployment:", error);
    process.exitCode = 1;
  }
}

main();
