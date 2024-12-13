

The **`Spotter` contract** acts as a liaison between the oracles and MakerDAO's core contracts. It facilitates the integration of price feeds into the system by storing and updating collateral-specific parameters, including liquidation ratios` mat` and current spot prices `spot`.

The `Spotter` is responsible for:
- Updating the [[Vat]] (MakerDAO's core engine) with the computed spot price by `poke` function.

### **Key Methods**

#### **1. `poke(bytes32 ilk)`**

- **Purpose**: Fetches the latest price for a collateral type, calculates the spot price, and updates the `Vat`.
    
- **Steps**:
    
    1. Calls the `peek` function on the price feed (`ilk.pip`) to fetch the current price (`val`) and a validity flag (`has`).
    2. If the price is valid (`has == true`), calculates the `spot` price
    3. Calls `vat.file` to update the `Vat` with the calculated `spot` price for the collateral type.
    4. Emits a `Poke` event containing the collateral type, price, and spot.
- **Use Case**: Ensures the system's internal price for collateral is up-to-date and reflects market conditions.

#### **2. File(...)`**
- **Purpose**: Updates the `pip` or `mat` for the collateral type by admin.

### **Parameters**

1. **`par`**: The reference value of 1 DAI (e.g., $1).
2. **`ilk`**: Represents a specific type of collateral.
    - **`ilk.pip`**: The contract which holds the current price of a given `ilk`.
    - (e.g, 3000 * 10^18)
    - **`ilk.mat`**: Liquidation ratio for the collateral, defining how much collateral must back the debt.(e.g., 1.5 * 10^27 => 150%)
4. **`live`**: Indicates if the contract is active (1) or shut down (0).

