The `dss-proxy-actions` contract is like a _toolbox_ with functions that help users interact with the Maker Protocol.

It is **not used directly** by users. Instead, it's used by something called a **[[DSProxy]]**.

### DssProxyActions

- `open()`: creates an `UrnHandler` (`cdp`) for the address `usr` (for a specific `ilk`) and allows the user to manage it via the internal registry of the `manager`.
    
- `give()`: transfers the ownership of the `cdp` to the `usr` address in the `manager` registry.
    
- `giveToProxy()`: transfers the ownership of `cdp` to the proxy of `usr` address (via `proxyRegistry`) in the `manager` registry.
    
- `cdpAllow()`: allows/denies `usr` address to manage the `cdp`.
    
- `urnAllow()`: allows/denies `usr` address to manage the `msg.sender` address as `dst` for `quit`.
    
- `flux()`: moves `wad` amount of collateral from `cdp` address to `dst` address.
    
- `move()`: moves `rad` amount of DAI from `cdp` address to `dst` address.
    
- `frob()`: executes `frob` to `cdp` address assigning the collateral freed and/or DAI drawn to the same address.
    
- `quit()`: moves `cdp` collateral balance and debt to `dst` address.
    
- `enter()`: moves `src` collateral balance and debt to `cdp`.
    
- `shift()`: moves `cdpSrc` collateral balance and debt to `cdpDst`.
    
- `lockETH()`: deposits `msg.value` amount of ETH in `ethJoin` adapter and executes `frob` to `cdp` increasing the locked value.
    
- `safeLockETH()`: same than `lockETH` but requiring `owner == cdp owner`.
    
- `lockGem()`: deposits `wad` amount of collateral in `gemJoin` adapter and executes `frob` to `cdp` increasing the locked value. Gets funds from `msg.sender` if `transferFrom == true`.
    
- `safeLockGem()`: same than `lockGem` but requiring `owner == cdp owner`.
    
- `freeETH()`: executes `frob` to `cdp` decreasing locked collateral and withdraws `wad` amount of ETH from `ethJoin` adapter.
    
- `freeGem()`: executes `frob` to `cdp` decreasing locked collateral and withdraws `wad` amount of collateral from `gemJoin` adapter.
    
- `draw()`: updates collateral fee rate, executes `frob` to `cdp` increasing debt and exits `wad` amount of DAI token (minting it) from `daiJoin` adapter.
    
- `wipe()`: joins `wad` amount of DAI token to `daiJoin` adapter (burning it) and executes `frob` to `cdp` for decreasing debt.
    
- `safeWipe()`: same as `wipe` but requiring `owner == cdp owner`.
    
- `wipeAll()`: joins all the necessary amount of DAI token to `daiJoin` adapter (burning it) and executes `frob` to `cdp` setting the debt to zero.
    
- `safeWipeAll()`: same as `wipeAll` but requiring `owner == cdp owner`.
    
- `lockETHAndDraw()`: combines `lockETH` and `draw`.
    
- `openLockETHAndDraw()`: combines `open`, `lockETH` and `draw`.
    
- `lockGemAndDraw()`: combines `lockGem` and `draw`.
    
- `openLockGemAndDraw()`: combines `open`, `lockGem` and `draw`.
    
- `wipeAndFreeETH()`: combines `wipe` and `freeETH`.
    
- `wipeAllAndFreeETH()`: combines `wipeAll` and `freeETH`.
    
- `wipeAndFreeGem()`: combines `wipe` and `freeGem`.
    
- `wipeAllAndFreeGem()`: combines `wipeAll` and `freeGem`.
    

### **DssProxyActionsFlip**

- `exitETH()`: exits `wad` amount of ETH from `ethJoin` adapter. This is received in the `cdp` urn after the liquidation auction is over.
    
- `exitGem()`: exits `wad` amount of collateral from `gemJoin` adapter. This is received in the `cdp` urn after the liquidation auction is over.
    

### **DssProxyActionsEnd**

- `freeETH()`: once the system is caged, this recovers the remaining ETH from `cdp` (pays the remaining debt if exists).
    
- `freeGem()`: once the system is caged, this recovers the remaining token from `cdp` (pays remaining debt if exists).
    
- `pack()`: once the system is caged, this packs `wad` amount of DAI to be ready for cashing.
    
- `cashETH()`: once the system is caged, this cashes `wad` amount of previously packed DAI and returns the equivalent in ETH.
    
- `cashGem()`: once the system is caged, this cashes `wad` amount of previously packed DAI and returns the equivalent in gem token.
    

### **DssProxyActionsDsr**

- `join()`: joins `wad` amount of DAI token to `daiJoin` adapter (burning it) and moves the balance to `pot` for DAI Saving Rates.
    
- `exit()`: retrieves `wad` amount of DAI from `pot` and exits DAI token from `daiJoin` adapter (minting it).
    
- `exitAll()`: performs the same actions as `exit` but for all of the available amount.
    