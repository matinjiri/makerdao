
The **`Dog` contract** is managing the liquidation process for undercollateralized vaults.

### **Key Methods**

#### **1. `file`**
- Used for administrative updates to global or collateral-specific parameters.

#### **2. `bark`**

Initiates the liquidation of an undercollateralized vault.

- **Parameters:**
    
    - `ilk`: Collateral type.
    - `urn`: Address of the vault to be liquidated.
    - `kpr`: Address of the keeper triggering the liquidation will receive the reward, if any..
- **Process:**
    
    1. Validates that the vault is undercollateralized.
    2. Calculates the amount of collateral and debt to liquidate, ensuring:
        - System-wide (`Hole`) and collateral-specific (`hole`) auction limits are respected.
        - Auctioned debt exceeds the dust threshold.
    3. Transfers collateral and debt to the `Clipper` and `Vow`.
    4. Starts a Dutch auction via the `Clipper` contract.
    5. Emits the `Bark` event with liquidation details.
- **Returns:** Auction ID (`id`) for the initiated auction.

#### **3. `digs`**

Reduces the recorded debt for a specific collateral type and the system as a whole.

- **Parameters:**
    - `ilk`: Collateral type.
    - `rad`: Amount of debt to reduce.

### **Parameters**

- `Hole`: Maximum DAI allowed for active liquidation auctions across the system. 
- `Dirt`: Current DAI allocated for active liquidation auctions.
- `clip`: Reference to the `Clipper` contract for collateral liquidation.
- `chop`: Liquidation penalty. 
- `hole`: Maximum DAI allowed for active liquidation auctions for a specific collateral type. `
- `dirt`: Current DAI allocated for active liquidation auctions for a specific collateral type. 