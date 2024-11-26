pragma solidity 0.5.12;

contract DSValue  {
    // --- Auth ---
    mapping(address => uint) public wards;
    function rely(address usr) external auth {
        wards[usr] = 1;
    }
    function deny(address usr) external auth {
        wards[usr] = 0;
    }
    modifier auth() {
        require(wards[msg.sender] == 1, "DaiJoin/not-authorized");
        _;
    }
    bool has;
    bytes32 val;
    function peek() public view returns (bytes32, bool) {
        return (val, has);
    }
    function read() public view returns (bytes32) {
        bytes32 wut;
        bool haz;
        (wut, haz) = peek();
        require(haz, "haz-not");
        return wut;
    }
    function poke(bytes32 wut) public auth {
        val = wut;
        has = true;
    }
    function void() public auth {
        // unset the value
        has = false;
    }
}
