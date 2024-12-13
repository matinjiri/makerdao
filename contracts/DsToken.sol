// SPDX-License-Identifier: MIT
pragma solidity 0.5.12;
import "./DsTokenBase.sol";

contract DSToken is DSTokenBase(0)  {

    bytes32  public  symbol;
    uint256  public  decimals = 18; // standard token precision. override to customize
    address      public  owner;

    constructor(bytes32 symbol_) public {
        symbol = symbol_;
                owner = msg.sender;
        emit LogSetOwner(msg.sender);

    }
    // --- Auth ---
    mapping(address => uint) public wards;
    function rely(address usr) external auth {
        wards[usr] = 1;
    }
    function deny(address usr) external auth {
        wards[usr] = 0;
    }
    modifier auth() {
        require(wards[msg.sender] == 1, "OSM/not-authorized");
        _;
    }
        function setOwner(address owner_)
        public
        auth
    {
        owner = owner_;
        emit LogSetOwner(owner);
    }

        event LogSetAuthority (address indexed authority);
    event LogSetOwner     (address indexed owner);

    // --- Stop ---
    uint256 public stopped;
    modifier stoppable() {
        require(stopped == 0, "OSM/is-stopped");
        _;
    }

    function stop() external auth {
        stopped = 1;
    }
    function start() external auth {
        stopped = 0;
    }
    // --- Math ---
    function add(uint x, uint y) internal pure returns (uint z) {
        require((z = x + y) >= x);
    }
    function add256(uint x, uint y) internal pure returns (uint z) {
        require((z = x + y) >= x);
    }
    function sub(uint x, uint y) internal pure returns (uint z) {
        require((z = x - y) <= x);
    }
    function mul(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }
    event Mint(address indexed guy, uint wad);
    event Burn(address indexed guy, uint wad);

    function approve(address guy) public stoppable returns (bool) {
        return super.approve(guy, uint(-1));
    }

    function approve(address guy, uint wad) public stoppable returns (bool) {
        return super.approve(guy, wad);
    }

    function transferFrom(address src, address dst, uint wad)
        public
        stoppable
        returns (bool)
    {
        if (src != msg.sender && _approvals[src][msg.sender] != uint(-1)) {
            require(_approvals[src][msg.sender] >= wad, "ds-token-insufficient-approval");
            _approvals[src][msg.sender] = sub(_approvals[src][msg.sender], wad);
        }

        require(_balances[src] >= wad, "ds-token-insufficient-balance");
        _balances[src] = sub(_balances[src], wad);
        _balances[dst] = add(_balances[dst], wad);

        emit Transfer(src, dst, wad);

        return true;
    }

    function push(address dst, uint wad) public {
        transferFrom(msg.sender, dst, wad);
    }
    function pull(address src, uint wad) public {
        transferFrom(src, msg.sender, wad);
    }
    function move(address src, address dst, uint wad) public {
        transferFrom(src, dst, wad);
    }

    function mint(uint wad) public {
        mint(msg.sender, wad);
    }
    function burn(uint wad) public {
        burn(msg.sender, wad);
    }
    function mint(address guy, uint wad) public auth stoppable {
        _balances[guy] = add(_balances[guy], wad);
        _supply = add(_supply, wad);
        emit Mint(guy, wad);
    }
    function burn(address guy, uint wad) public auth stoppable {
        if (guy != msg.sender && _approvals[guy][msg.sender] != uint(-1)) {
            require(_approvals[guy][msg.sender] >= wad, "ds-token-insufficient-approval");
            _approvals[guy][msg.sender] = sub(_approvals[guy][msg.sender], wad);
        }

        require(_balances[guy] >= wad, "ds-token-insufficient-balance");
        _balances[guy] = sub(_balances[guy], wad);
        _supply = sub(_supply, wad);
        emit Burn(guy, wad);
    }

    // Optional token name
    bytes32   public  name = "";

    function setName(bytes32 name_) public auth {
        name = name_;
    }
}