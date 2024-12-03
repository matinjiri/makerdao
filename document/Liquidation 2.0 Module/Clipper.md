The **`Clipper` contract** manages the auctioning of collateral from liquidated vaults. It conducts Dutch auctions where the price decreases over time until a buyer is found.

### **Key Methods**
#### **1. `file`**

Used for administrative updates to global or collateral-specific parameters.

- **Parameters:**
    
    - `what`: The parameter to update (e.g., `buf`, `tip`, `chip`, etc.).
    - `data`: The new value for the parameter.
- **Purpose:**  
    Allows governance to set parameters that control auction behavior, such as the auction buffer, incentives, and duration.


#### **2. `kick`**

Starts a new collateral auction.

- **Parameters:**
    
    - `tab`: The total debt associated with the auction (`rad`).
    - `lot`: The amount of collateral available for auction (`wad`).
    - `usr`: Address that will receive any leftover collateral.
    - `kpr`: Address of the keeper triggering the auction and receiving the incentive reward, if any.
- **Process:**
    
    1. Validates inputs:
        - Debt (`tab`) and collateral (`lot`) must be greater than zero.
        - `usr` cannot be the zero address.
    2. Creates a new auction (`id`):
        - Increments the `kicks` counter to generate a unique auction ID.
        - Adds the ID to the active auctions list (`active`).
        - Stores auction details (e.g., `tab`, `lot`, `usr`, timestamp) in the `sales` mapping.
    3. Determines the starting price:
        - Fetches the collateral price from `getFeedPrice()` and applies the auction buffer (`buf`).
    4. Provides incentives to the keeper:
        - Calculates a fixed incentive (`tip`) and a variable incentive (`chip`) based on the debt (`tab`).
        - Transfers these incentives from the system (`vat`) to the keeper (`kpr`).
    5. Emits the `Kick` event with auction details.
- **Returns:**
    
    - Auction ID (`id`) for the initiated auction.


#### **3. `redo`**

Restarts an ongoing auction to reset its price.

- **Parameters:**
    
    - `id`: The ID of the auction to restart.
    - `kpr`: Address of the keeper restarting the auction and receiving the incentive reward.
- **Process:**
    
    1. Ensures the auction is still active and has not reached its end time (`calc` price is non-zero).
    2. Updates the auction's timestamp (`tic`) to the current block time.
    3. Resets the auction price using the current collateral price and buffer.
    4. Provides a keeper incentive (`tip` and `chip`).
    5. Emits the `Redo` event.

#### **4. `take`**

Allows a bidder to purchase collateral from an active auction.

- **Parameters:**
    
    - `id`: The ID of the auction.
    - `amt`: The amount of collateral to purchase (`wad`).
    - `max`: The maximum acceptable price in DAI for the collateral (`ray`).
    - `who`: Address to receive the purchased collateral.
- **Process:**
    
    1. Validates that the auction is active.
    2. Ensures the purchase price does not exceed the buyer's maximum (`max`).
    3. Calculates the total cost in DAI and transfers it to the system (`vat`).
    4. Deducts the purchased collateral from the auction's `lot`.
    5. If the auction's collateral (`lot`) is fully purchased, removes the auction from the active list.
    6. Emits the `Take` event with purchase details.

#### **5. `yank`**

Cancels an active auction, returning unsold collateral to the original user.

- **Parameters:**
    
    - `id`: The ID of the auction to cancel.
- **Process:**
    
    1. Ensures the auction is active.
    2. Removes the auction from the active list.
    3. Transfers any unsold collateral back to the original user (`usr`).
    4. Emits the `Yank` event.


### **Parameters**

- **`buf`**: The multiplier applied to the collateral price to determine the initial auction price.
- **`tip`**: Fixed incentive paid to the keeper for initiating or restarting auctions.
- **`chip`**: Percentage-based incentive (on `tab`) paid to the keeper.
- **`cusp`**: Threshold (percentage) for when an auction becomes resettable.
- **`tail`**: Duration (in seconds) after which an auction becomes resettable.
- **`cut`**: Price decay factor applied per second during the auction.
- **`stopped`**: Status flag for pausing auctions (e.g., during emergencies).
- **`active`**: List of active auction IDs.
- **`sales`**: Mapping of auction IDs to their details, including debt, collateral, user address, and timestamps.
- `chost`, derived from `dust`, ensures that auctions avoid leaving small, uneconomical debts.