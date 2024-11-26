// SPDX-License-Identifier: MIT
pragma solidity 0.5.12;

contract MessageVerifier {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    function verifySignature(string memory message, bytes memory signature) public view returns (bool) {
        bytes32 messageHash = getMessageHash(message);

        address recoveredAddress = recoverSigner(messageHash, signature);

        return recoveredAddress == owner;
    }

    function recoverSigner(bytes32 messageHash, bytes memory signature) public pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(signature);

        return ecrecover(messageHash, v, r, s);
    }

    function splitSignature(bytes memory sig) public pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }

    // Function to create the EIP-191 compliant message hash
    function getMessageHash(string memory message) public pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", message));
    }
}
