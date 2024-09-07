// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library LibStorage {
    // Use a fixed storage slot for the Diamond's storage to ensure consistency
    bytes32 constant DIAMOND_STORAGE_POSITION = keccak256("diamond.storage.position");

    struct DiamondStorage {
        address admin;
        uint256 value;
        // Additional state variables
    }

    // This retrieves the diamond storage
    function diamondStorage() internal pure returns (DiamondStorage storage ds) {
        bytes32 position = DIAMOND_STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }

    // Function to set the admin
    function setAdmin(address _admin) internal {
        DiamondStorage storage ds = diamondStorage();
        ds.admin = _admin;
    }

    // Function to get the current admin
    function getAdmin() internal view returns (address) {
        return diamondStorage().admin;
    }
}