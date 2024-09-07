// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LibStorage.sol";

contract FacetA {
    modifier onlyAdmin() {
        require(msg.sender == LibStorage.getAdmin(), "Not admin");
        _;
    }

   function setValue(uint256 _value) external onlyAdmin {
        LibStorage.DiamondStorage storage ds = LibStorage.diamondStorage();
        uint256 currentValue = ds.value;
        ds.value += _value;
        emit ValueChanged(currentValue, ds.value);
    }

    function getValue() external view returns (uint256) {
        return LibStorage.diamondStorage().value;
    }

    event ValueChanged(uint256 oldValue, uint256 newValue);
}