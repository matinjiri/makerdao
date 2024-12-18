`End.sol`, appears to implement a global settlement system.


### functions

- **cage**: Locks the system and initiates shutdown by freezing user actions, canceling auctions, locking contracts, and starting the cool-down period.
- **cage(ilk)**: Sets the final price for a collateral type (`ilk`) at the time of shutdown.
- **skim**: Settles a Vault by canceling owed Dai and leaving excess collateral.
- **free**: Removes remaining collateral from a settled Vault after all debts are cleared.
- **thaw**: Fixes Dai supply after all Skims, adjusting the total outstanding supply.
- **flow**: Calculates and adjusts the cage price for an ilk based on system surplus or deficit.
- **pack**: Locks Dai in preparation for conversion to collateral.
- **cash**: Exchanges packed Dai for collateral from a "bag."
- **file**: Governance mechanism for adjusting system parameters.
- **skip**: Optionally cancels live auctions.



### Parameters:

1. **`when`**: The time the `cage` function was called (unix epoch time).
2. **`wait`**: Processing cooldown period in seconds.
3. **`debt`**: Total outstanding Dai following processing (in `rad` units).
4. **`tag`**: Mapping of `bytes32` to `uint256` to represent the cage price per collateral type (`ray`).
5. **`gap`**: Collateral shortfall for each collateral type (`wad`).
6.  **`Art`**: Total debt per collateral type (`wad`).
7. **`fix`**: Final price for each collateral type (`ray`).
8. **`bag`**: Maps addresses to amounts of Dai bags (used for packing Dai in preparation for `cash`).
9. **`out`**: Mapping of `bytes32` (ilk) to an address mapping, storing collateral amounts for specific users (`wad`).


### 1. **cage()**

- **Freeze the system**: The first step is to freeze the system and lock the prices for each collateral type (ilk). This action involves halting:
    - Deposits of collateral into Vaults
    - Dai borrowing from Vaults
    - Flap/Flop Auctions
    - Dai Savings Rate (DSR)
    - Governance entry points (rely/deny, file)
- **Cancel Auctions**: All Flap and Flop auctions are canceled to ensure surplus and debt are transferred to Dai holders.
    - Flap auctions stop as they no longer serve their purpose (surplus Dai is allocated to Dai holders).
    - Flop auctions are canceled as bad debt is passed to Dai holders if there’s no surplus available.
- **Flip Auctions Continue**: These auctions may continue to run, but they can be skipped or canceled as needed, and they do not affect debt after the shutdown.
- **Disable Liquidations**: The `cat.bite` function is disabled, stopping liquidations after shutdown.

### 2. **cage(ilk)**

- **Set Cage Price**: This step involves setting the cage price for each collateral type by reading the price feed. This is necessary to calculate the final Dai/collateral price, considering any collateral shortfalls (gap) and outstanding debt.

### 3. **skim(ilk, urn)**

- **Cancel Debt**: The `skim(ilk, urn)` function is called to cancel all of the outstanding Dai debt for each Vault. Any excess collateral remains in the Vault for the owner to claim, but the collateral used to back the debt is taken.
- **Prevent Further Debt Generation**: This step ensures no more Dai is generated by active auctions, especially in the tend phase of the flip auctions.

### 4. **wait or skip**

- **Cooldown Period (`wait`)**: The `wait` function is used to set a cooldown period, allowing time to process all undercollateralized Vaults and skip tend-phase auctions. This period can be short or long depending on factors like network congestion.
- **Skip Auctions (`skip`)**: Alternatively, `skip` can be used to cancel ongoing auctions and seize collateral, enabling faster processing but requiring more calls to be made.

### 5. **free(ilk)**

- **Free Collateral**: The `free(ilk)` function is used to remove any remaining collateral from the caller's Vault after the `skim` process. If no debt remains in the Vault, this step can be executed immediately.

### 6. **thaw()**

- **Finalize Debt and Collateral**: After the processing period, the `thaw()` function is called to finalize the price calculation for each collateral type. The system assumes that all undercollateralized Vaults are processed, and the debt from the Vow is healed if there is any surplus Dai to be covered.

### 7. **flow(ilk)**

- **Calculate Final Price**: The `flow(ilk)` function calculates the final price for each collateral type. At this stage, Dai holders can exchange their Dai for a fixed amount of collateral.

### 8. **pack(wad)**

- **Prepare Dai for Claim**: The `pack(wad)` function is called to place Dai into a "bag" in preparation for future redemption of collateral. The larger the bag, the more collateral can be released.

### 9. **cash(ilk, wad)**

- **Exchange Dai for Collateral**: Finally, the `cash(ilk, wad)` function allows Dai holders to exchange their packed Dai for collateral (gems) from a specified ilk. The amount of collateral is determined by the size of the bag and the collateral available.
