
The `DsrManager` simplifies the process of depositing and withdrawing Dai to earn the Dai Savings Rate. It enables service providers to interact with the DSR contract without requiring a DS-Proxy. This feature is particularly useful for smart contracts integrating DSR functionalities.

**supply**: Current supply of Dai in the DsrManager.
**pieOf**: Mapping of user addresses to normalized Dai balances (amount of Dai divided by `chi`).
**chi**: Rate accumulator deciding Dai returns when `drip()` is called.
**rho**: Timestamp of the last `drip()` call.

#### Functions

- `daiBalance(address usr) returns (uint wad)`: Returns Dai balance (existing balance + accrued DSR) of a user.
    
- `join(address dst, uint wad):
    
    - Deposits `wad` amount of Dai into the pot and assigns it to `dst`.
        
    - Calculates normalized balance (`pie = wad / chi`).
        
    - Updates `dst`'s `pieOf` mapping and the total supply.
        
    - Transfers Dai to the DsrManager, joins Dai into the MCD system through `daiJoin`, and into the pot.
        
- `exit(address dst, uint wad)`:
    
    - Withdraws `wad` amount of Dai from the pot to `dst`.
        
    - Calculates normalized balance (`pie = wad / chi`).
        
    - Updates `msg.sender`’s `pieOf` mapping and the total supply.
        
    - Exits Dai from the pot and MCD system, transferring it to `dst`.
        
- `exitAll(address dst)`:
    
    - Withdraws the entire Dai balance of `msg.sender` and sends it to `dst`.
        
    - Reads the `pieOf` mapping to determine the full balance and exits all Dai.