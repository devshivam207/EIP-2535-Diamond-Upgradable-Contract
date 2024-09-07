# Diamond Proxy Smart Contract System

This project implements a Diamond Proxy pattern for upgradeable smart contracts, along with an access registry for admin management. It consists of four main contracts and two deployment/interaction scripts.

## Contracts

1. **LibStorage.sol**: A library that manages shared storage for the Diamond Proxy pattern.
2. **DiamondProxy.sol**: The main proxy contract that implements the Diamond pattern for upgradeable contracts.
3. **AccessRegistry.sol**: Manages admin roles and permissions for the system.
4. **FacetA.sol**: An example facet contract that provides functionality to the Diamond Proxy.

## Deployment Scripts

1. **deploy.js**: Deploys all contracts and sets up the initial state of the system.
2. **interact_deployed.js**: Interacts with the deployed contracts to verify functionality.

## Prerequisites

- Node.js (v12.0.0 or later)
- Hardhat

## Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd <project-directory>
   ```

3. Install dependencies:
   ```
   npm install
   ```

## Deployment

To deploy the contracts to the Sepolia testnet:

```
npx hardhat run scripts/deploy.js --network bscTestnet
```

This script will:
- Deploy FacetA, DiamondProxy, and AccessRegistry contracts
- Add FacetA to the DiamondProxy
- Set initial values and admin

Make sure to note the deployed contract addresses printed in the console.

## Interaction

To interact with the deployed contracts:

1. Update the contract addresses in `scripts/deployed-newAdmin.js` with the addresses from the deployment step.

2.
```
npx hardhat run scripts/deploy-newAdmin.js --network bscTestnet
```

This script will:
- Get and set values in FacetA through the DiamondProxy
- Check and attempt to change the admin
- Verify the final state of the contracts

## Testing

To run the tests:

```
npx hardhat test
```

This will run all test files in the `test` directory.

## Verifying Deployment

After running both `deploy.js` and `deploy-newAdmin.js`, verify that:

1. The initial value in FacetA is set correctly
2. You can update the value in FacetA through the DiamondProxy
3. The admin address is changed successfully
4. Only the admin can perform restricted actions

If all these checks pass, your deployment is working correctly.

## Troubleshooting
- If you encounter errors related to nonce, try resetting your account nonce in MetaMask.
- Ensure you have enough ETH in your account for gas fees.
- Double-check that all contract addresses in `deploy-newAdmin.js` match the deployed addresses.

## License
This project is licensed under the MIT License.
