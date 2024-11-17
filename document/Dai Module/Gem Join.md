The **`GemJoin`** contract in MakerDAO is an adapter used for handling ERC20 tokens as collateral. It connects the external ERC20 token (`GemLike`) with the MakerDAO core (`Vat`) to enable its use in the system as collateral.

### **Core Operations**

1. **`join(address usr, uint wad)`**:
    
    - **Deposits ERC20 tokens (gems) into the system and credits the user’s internal balance in the Vat.**
    - **Steps**:
        1. Verifies that the contract is active (`live == 1`).
        2. Ensures the deposit amount is valid (`int(wad) >= 0`).
        3. Calls `vat.slip(ilk, usr, int(wad))` to credit the user’s internal collateral balance in the Vat for the specified `ilk` (collateral type).
        4. Transfers the ERC20 tokens (gems) from the `msg.sender` to the contract using `gem.transferFrom(msg.sender, address(this), wad)`.
        5. Emits a `Join` event to log the deposit.
    
    **Use Case**: Allows users to deposit ERC20 tokens (like UNI) into the MakerDAO system, thereby increasing their collateral balance in the Vat. This is often used to pay down debt or as collateral for minting DAI.
    
2. **`exit(address usr, uint wad)`**:
    
    - **Withdraws ERC20 tokens from the system and credits the user’s external balance.**
    - **Steps**:
        1. Verifies that the withdrawal amount is valid (`wad <= 2 ** 255`).
        2. Calls `vat.slip(ilk, msg.sender, -int(wad))` to debit the user’s collateral balance in the Vat for the specified `ilk` (collateral type).
        3. Transfers the specified amount of ERC20 tokens to the user (`gem.transfer(usr, wad)`).
        4. Emits an `Exit` event to log the withdrawal.
    
    **Use Case**: Allows users to withdraw ERC20 tokens from the MakerDAO system, reducing their collateral balance in the Vat. This is often used when users wish to reclaim their collateral or to manage their positions in the MakerDAO system.
    

#### **Key Variables**

- **`vat`**: The core MakerDAO system that tracks collateral and debt positions.
- **`ilk`**: Identifier for the collateral type this adapter manages (e.g., `USDC` or `WBTC`).
- **`gem`**: The ERC20 token contract (`GemLike`) representing the collateral asset.
- **`dec`**: Decimals of the ERC20 token, used to ensure precision in calculations.
- **`live`**: Flag indicating if the contract is active (`1`) or deactivated (`0`).

``vat.slip(ilk, msg.sender, -+int(wad));``: It modifies the user’s internal balance of collateral for the specified **ilk** by the value of **`wad`**.