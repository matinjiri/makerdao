// SPDX-License-Identifier: MIT
pragma solidity 0.5.12;

contract DSThing {
    function S(string memory s) internal pure returns (bytes4) {
        return bytes4(keccak256(abi.encodePacked(s)));
    }

}