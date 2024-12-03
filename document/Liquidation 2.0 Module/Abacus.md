The **`Abacus`** interface and its implementation, such as **`LinearDecrease`**, manage price decay mechanisms for auctions in MakerDAO. It defines how collateral prices decrease over time during auctions, ensuring fair price discovery.

calculates the current price based on:
    - The initial price.
    - Time elapsed since the auction started.


#### **Parameters**

- **`tau`**: Defines the auction duration after which the price reaches zero (in seconds).
    - This parameter controls how quickly prices decay during an auction.

#### **1. `price`**

- **Purpose**: Calculates the current auction price using linear price decay.
- **Inputs**:
    - `top`: Initial price [RAY].
    - `dur`: Time elapsed since auction start [seconds].
- **Outputs**:
    - Current price [RAY].
- **Behavior**:
    - If `dur` ≥ `tau`: returns `0`.
    - Otherwise: calculates a proportionally reduced price based on `dur`.

#### **2. `file`**

- **Purpose**: Updates configuration parameters.
- **Inputs**:
    - `what`: The parameter name (`tau`).
    - `data`: New value for the parameter.
- **Security**:
    - Restricted to authorized users (`auth` modifier).
- **Events**:
    - Emits `File` upon successful parameter update.
