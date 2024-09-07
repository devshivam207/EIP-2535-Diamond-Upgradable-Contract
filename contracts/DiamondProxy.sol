// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LibStorage.sol";

contract DiamondProxy {
    struct Facet {
        address facetAddress;
        bytes4[] functionSelectors;
    }

    mapping(bytes4 => address) public selectorToFacet;
    mapping(address => bool) public authorizedFacets;

    event FacetAdded(address indexed facetAddress, bytes4[] functionSelectors);
    event FacetRemoved(address indexed facetAddress, bytes4[] functionSelectors);

    modifier onlyAdmin() {
        require(msg.sender == LibStorage.getAdmin(), "Not admin");
        _;
    }

    constructor() {
        // Set the deployer as the admin in shared storage
        LibStorage.setAdmin(msg.sender);
    }

    function addFacet(address _facetAddress, bytes4[] memory _selectors) external onlyAdmin {
        require(!authorizedFacets[_facetAddress], "Facet already added");
        for (uint256 i = 0; i < _selectors.length; i++) {
            selectorToFacet[_selectors[i]] = _facetAddress;
        }
        authorizedFacets[_facetAddress] = true;
        emit FacetAdded(_facetAddress, _selectors);
    }

    function removeFacet(address _facetAddress, bytes4[] memory _selectors) external onlyAdmin {
        require(authorizedFacets[_facetAddress], "Facet not found");
        for (uint256 i = 0; i < _selectors.length; i++) {
            delete selectorToFacet[_selectors[i]];
        }
        authorizedFacets[_facetAddress] = false;
        emit FacetRemoved(_facetAddress, _selectors);
    }

    function getFacetAddress(bytes4 _selector) external view returns (address) {
        return selectorToFacet[_selector];
    }

    // Expose the admin function through the proxy
    function getAdmin() external view returns (address) {
        return LibStorage.getAdmin();
    }

    // New function to set admin
    function setAdmin(address _newAdmin) external onlyAdmin {
        LibStorage.setAdmin(_newAdmin);
        emit AdminChanged(LibStorage.getAdmin(), _newAdmin);
    }

    event AdminChanged(address oldAdmin, address newAdmin);

    fallback() external payable {
        address facet = selectorToFacet[msg.sig];
        require(facet != address(0), "Function does not exist");

        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), facet, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    receive() external payable {}
}