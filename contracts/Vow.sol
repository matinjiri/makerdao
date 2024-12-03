// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.5.12;
// FAKE!
interface VatLike {
    function dai (address) external view returns (uint);
    function sin (address) external view returns (uint);
    function heal(uint256) external;
    function hope(address) external;
    function nope(address) external;
}

contract Vow {

    // --- Data ---
    VatLike public vat;        // CDP Engine
    uint256 public live;  // Active Flag
    uint256 public Ash;   // On-auction debt        [rad]
    mapping (uint256 => uint256) public sin;  // debt queue
    uint256 public Sin;   // Queued debt            [rad]
    // --- Init ---
    constructor(address vat_) public {
        vat     = VatLike(vat_);
        live = 1;
    }

    // --- Math ---
    function add(uint x, uint y) internal pure returns (uint z) {
        require((z = x + y) >= x);
    }
    function sub(uint x, uint y) internal pure returns (uint z) {
        require((z = x - y) <= x);
    }
    function min(uint x, uint y) internal pure returns (uint z) {
        return x <= y ? x : y;
    }

    // Push to debt-queue
    function fess(uint tab) external {
        sin[now] = add(sin[now], tab);
        Sin = add(Sin, tab);
    }

    function kiss(uint rad) external {
        require(rad <= Ash, "Vow/not-enough-ash");
        require(rad <= vat.dai(address(this)), "Vow/insufficient-surplus");
        Ash = sub(Ash, rad);
        vat.heal(rad);
    }


}