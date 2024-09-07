// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LibStorage.sol";
import "./DiamondProxy.sol";

contract AccessRegistry {
    address public superAdmin;

    event AdminAdded(address indexed newAdmin);
    event AdminRemoved(address indexed admin);
    event AdminTransferred(address indexed oldAdmin, address indexed newAdmin);

    constructor() {
        superAdmin = msg.sender;
        LibStorage.setAdmin(msg.sender);  // Initialize the admin in shared storage
    }

    modifier onlySuperAdmin() {
        require(msg.sender == superAdmin, "Not super admin");
        _;
    }

    function addAdmin(address _admin) external onlySuperAdmin {
        LibStorage.setAdmin(_admin);  // Set new admin in shared storage
        emit AdminAdded(_admin);
    }

    function removeAdmin() external onlySuperAdmin {
        address oldAdmin = LibStorage.getAdmin();
        LibStorage.setAdmin(address(0));  // Remove the current admin
        emit AdminRemoved(oldAdmin);
    }

    function transferAdminRole(address _newAdmin) external onlySuperAdmin {
        address oldAdmin = LibStorage.getAdmin();
        require(_newAdmin != address(0), "New admin cannot be zero address");
        require(_newAdmin != oldAdmin, "New admin is the same as current admin");

        // Call setAdmin on DiamondProxy
        DiamondProxy(payable(msg.sender)).setAdmin(_newAdmin);
        emit AdminTransferred(oldAdmin, _newAdmin);
    }

    function getCurrentAdmin() external view returns (address) {
        return LibStorage.getAdmin();
    }
}