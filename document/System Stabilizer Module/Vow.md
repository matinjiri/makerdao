Responsible for managing debt and surplus in relation to undercollateralized vaults.

### **Core Responsibilities**

1. **Debt Resolution**:
    
    - Tracks and processes bad debt in the system.
    - Initiates **debt auctions** to cover undercollateralized positions.
2. **Surplus Management**:
    
    - Handles system surplus balances.
    - Facilitates **surplus auctions** to maintain efficient Dai supply.
3. **Auction Scheduling**:
    
    - Manages the scheduling of debt and surplus auctions.
    - Prevents overlapping or excessive auction activity.


### **Core Operations**

#### **1. Debt Management**

##### **`fess(uint rad)`**

- **Purpose**: Records bad debt (`rad`) into the system.
- **Steps**:
    1. Adds `rad` to the total bad debt (`Sin`) of the system.
    2. Emits a `Fess` event logging the bad debt.
- **Use Case**: Called by the system when a liquidation leaves unresolved debt in the protocol.

##### **`flop()`**

- **Purpose**: Initiates a debt auction to cover bad debt.
- **Steps**:
    1. Verifies that the system has sufficient bad debt (`Sin > 0`).
    2. Checks that enough time has passed since the last debt auction (`wait`).
    3. Reduces the bad debt by the auctioned amount (`bump`).
    4. Triggers the **Flopper** contract to start a debt auction.
    5. Emits a `Flop` event for tracking purposes.
- **Use Case**: Used to auction newly minted MKR to resolve bad debt.

#### **2. Surplus Management**

##### **`flap()`**

- **Purpose**: Initiates a surplus auction to sell excess Dai for MKR.
- **Steps**:
    1. Verifies that the system has surplus Dai (`Dai > hump`).
    2. Checks that enough time has passed since the last surplus auction (`wait`).
    3. Reduces the surplus by the auctioned amount (`sump`).
    4. Triggers the **Flapper** contract to start a surplus auction.
    5. Emits a `Flap` event for tracking purposes.
- **Use Case**: Used to maintain a stable Dai supply and incentivize MKR burning.

#### **3. Settlement**

##### **`heal(uint rad)`**

- **Purpose**: Resolves excess debt and surplus balances without auctions.
- **Steps**:
    1. Determines the smaller of surplus (`Dai`) and bad debt (`Sin`).
    2. Reduces both `Dai` and `Sin` by this amount.
    3. Emits a `Heal` event to log the operation.
- **Use Case**: Used to directly clear imbalances in the system when auctions are unnecessary.

#### **4. System Administration**

##### **`file(bytes32 what, uint data)`**

- **Purpose**: Updates system-wide parameters.
- **Steps**:
    1. Verifies the system is active (`live == 1`).
    2. Checks the `what` parameter:
        - `"hump"`: Sets the surplus buffer threshold for initiating auctions.
        - `"sump"`: Sets the surplus auction lot size.
        - `"bump"`: Sets the debt auction lot size.
        - `"wait"`: Sets the minimum delay between auctions.
    3. Updates the specified parameter to the new value (`data`).
- **Use Case**: Called to adjust operational parameters based on market conditions or governance decisions.[[Vat]]

##### **`cage()`**

- **Purpose**: Shuts down the Vow contract during system shutdown.
- **Steps**:
    1. Sets the `live` flag to `0`.
    2. Transfers any remaining surplus (`Dai`) to the **End** contract for final settlement.
- **Use Case**: Used during emergency shutdown to wind down the protocol.


### **Parameters**

1. **Global Variables**:
    - `Sin`: Tracks the system-wide bad debt balance.
    - `Ash`: Tracks currently auctioned bad debt.
2. **Auction Settings**:
    
    - `hump`: Surplus buffer threshold before initiating a surplus auction.
    - `sump`: Lot size for surplus auctions.
    - `bump`: Lot size for debt auctions.
    - `wait`: Minimum delay between consecutive auctions.
3. **Status Flag**:
    
    - `live`: Indicates whether the Vow contract is active (`live == 1`) or shut down (`live == 0`).

### **Security Measures**

1. **Time Delays**:
    
    - Enforces a delay (`wait`) between auctions to prevent rapid, overlapping auctions.
2. **Parameter Constraints**:
    
    - Ensures surplus (`hump`) and auction sizes (`sump`, `bump`) are within governance-approved limits.
3. **Immutable Design**:
    
    - Core invariants are enforced by the contract to prevent unauthorized changes.

### **Key Points

1. **Debt (Sin) Queue:**
    
    - When a vault is liquidated, the seized debt is added to the queue as `sin[timestamp]`.
    - This debt is only available for auction (or healing) after it has been released using `flog` **after `Vow.wait` time has passed.**
2. **Eligible Debt for Auction or Healing:**
    
    - Debt eligible for action (e.g., a `flop` auction or `heal`) is **not directly stored.**  
        Instead, it is **calculated** as: Available Debt=Vat.sin[Vow]−(Vow.Sin+Vow.Ash)\text{Available Debt} = \text{Vat.sin[Vow]} - (\text{Vow.Sin} + \text{Vow.Ash})Available Debt=Vat.sin[Vow]−(Vow.Sin+Vow.Ash)
    - `Vat.sin[Vow]`: Total debt recorded in the Vat system for Vow.
    - `Vow.Sin`: Queued debt (in the debt queue).
    - `Vow.Ash`: Debt currently being auctioned.