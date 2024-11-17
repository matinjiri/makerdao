// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

interface DSTokenLike {
    function mint(address, uint) external;
    function burn(address, uint) external;
}

interface VatLike {
    function slip(bytes32, address, int) external;
    function move(address, address, uint) external;
}

contract ETHJoin is LibNote {
    // --- Auth ---
    mapping (address => uint) public wards;
    function rely(address usr) external note auth { wards[usr] = 1; }
    function deny(address usr) external note auth { wards[usr] = 0; }
    modifier auth {
        require(wards[msg.sender] == 1, "ETHJoin/not-authorized");
        _;
    }

    VatLike public vat;
    bytes32 public ilk;
    uint    public live;  // Access Flag

    constructor(address vat_, bytes32 ilk_) public {
        wards[msg.sender] = 1;
        live = 1;
        vat = VatLike(vat_);
        ilk = ilk_;
    }
    function cage() external note auth {
        live = 0;
    }
    function join(address usr) external payable note {
        require(live == 1, "ETHJoin/not-live");
        require(int(msg.value) >= 0, "ETHJoin/overflow");
        vat.slip(ilk, usr, int(msg.value));
    }
    function exit(address payable usr, uint wad) external note {
        require(int(wad) >= 0, "ETHJoin/overflow");
        vat.slip(ilk, msg.sender, -int(wad));
        usr.transfer(wad);
    }
}
