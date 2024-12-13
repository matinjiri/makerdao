// SPDX-License-Identifier: MIT
import "./DsExec.sol";
pragma solidity 0.5.12;

contract DSSpell is DSExec {
    address public whom;
    uint256 public mana;
    bytes   public data;
    bool    public done;

    constructor(address whom_, uint256 mana_, bytes memory data_) public {
        whom = whom_;
        mana = mana_;
        data = data_;
    }
    // Only marked 'done' if CALL succeeds (not exceptional condition).
    function cast() public {
        require(!done, "ds-spell-already-cast");
        exec(whom, data, mana);
        done = true;
    }
}

contract DSSpellBook {
    function make(address whom, uint256 mana, bytes memory data) public returns (DSSpell) {
        return new DSSpell(whom, mana, data);
    }
}