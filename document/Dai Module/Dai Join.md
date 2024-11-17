`DaiJoin` allows users to withdraw their Dai from the system into a standard ERC20 token.

This implementation of the **DaiJoin contract** provides an adapter for connecting internal Dai balances in the **Vat** (MakerDAO’s core engine) to the external **DSToken**(Dai stablecoin token) implementation, which represents the Dai stablecoin.

Adapters need to implement two main methods:

- **`join`**: Brings an asset (Dai) into the system.
- **`exit`**: Removes the asset from the system.

#### **Core Operations**

1. **`join(address usr, uint wad)`**:
    
    - Deposits Dai tokens into the system and credits the user’s internal balance in the Vat.
    - Steps:
        1. Calculates the equivalent internal Dai amount using `mul(ONE, wad)`.
        2. Calls `vat.move` to transfer the calculated amount to `usr` in the Vat.
        3. Burns the deposited Dai tokens from `msg.sender` via `dai.burn`.
        4. Emits a `Join` event.
    
    **Use Case**: Allows users to deposit external Dai into the MakerDAO system for purposes like paying down [[CDP]](Collateralized Debt Position) debt.
    
2. **`exit(address usr, uint wad)`**:
    
    - Withdraws Dai from the system and credits the user’s external balance.
    - Steps:
        1. Verifies that the contract is active (`live == 1`).
        2. Calculates the equivalent internal Dai amount using `mul(ONE, wad)`.
        3. Calls `vat.move` to debit the internal balance from `msg.sender`.
        4. Mints the withdrawn Dai tokens to `usr` via `dai.mint`.
        5. Emits an `Exit` event.
    
    **Use Case**: Allows users to withdraw Dai from the MakerDAO system.


## Parameters: 
`ONE` (10^27) to convert external Dai (18 decimals) to the Vat’s internal precision (27 decimals).
`live` flag ensures that the contract can only process withdrawals (`exit`) when active.
The `cage` function deactivates the contract, setting `live` to `0`.
