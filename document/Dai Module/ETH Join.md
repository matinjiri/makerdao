The **`ETHJoin`** contract in MakerDAO is an adapter for handling **ETH** as collateral. It allows users to deposit and withdraw **ETH** in the MakerDAO system, where it is tracked as an internal balance in the **Vat**.

### **Core Operations**

1. **`join(address usr)`**:
    
    - **Deposits ETH into the system and credits the user’s internal balance in the Vat.**
    - **Steps**:
        1. Verifies that the contract is active (`live == 1`).
        2. Ensures the deposit amount is valid (`int(msg.value) >= 0`).
        3. Calls `vat.slip(ilk, usr, int(msg.value))` to credit the user’s internal balance in the **Vat** for the specified **ilk** (collateral type).
        4. Does not need to transfer ETH explicitly (since the ETH is sent to the contract directly by the user).
        5. Emits a `Join` event to log the deposit.
    
    **Use Case**: Allows users to deposit ETH into the MakerDAO system, increasing their collateral balance in the Vat. This is typically used to collateralize a [[CDP]] (Collateralized Debt Position) or to pay down debt.
    
2. **`exit(address payable usr, uint wad)`**:
    
    - **Withdraws ETH from the system and credits the user’s external balance.**
    - **Steps**:
        1. Verifies that the withdrawal amount is valid (`wad`).
        2. Calls `vat.slip(ilk, msg.sender, -int(wad))` to debit the user’s internal balance of collateral in the **Vat** for the specified **ilk**.
        3. Transfers the specified amount of ETH to the user (`usr.transfer(wad)`).
        4. Emits an `Exit` event to log the withdrawal.
    
    **Use Case**: Allows users to withdraw ETH from the MakerDAO system and decrease their collateral balance in the Vat. This is typically done when users want to reclaim collateral from their positions.

### **Key Variables**

- **`vat`**: The core MakerDAO system that tracks collateral and debt positions.
- **`ilk`**: Identifier for the collateral type this adapter manages (typically `ETH` for ETH collateral).
- **`live`**: Flag indicating whether the contract is active (`1`) or deactivated (`0`).
- **`wards`**: A mapping that keeps track of addresses with special permissions to perform administrative functions (like calling `rely` or `deny`).