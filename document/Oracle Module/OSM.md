#### Oracle Security Module

The **OSM contract** is deployed for each collateral type and allows only whitelisted contracts to read the current price.

### **Contract Functions**

#### **`poke()`**

- **Purpose**: Updates the current price and sets the next price.
- **Steps**:
    1. Checks if the required time delay (`hop`) has passed.
    2. Calls the `peek()` function of the price feed contract (`src`).
    3. If the price is valid, updates the `cur` and `nxt` values accordingly.
    4. Emits the `LogValue` event containing the updated price.

#### **`peek()`**

- **Purpose**: Allows whitelisted addresses to view the current price.
- **Returns**:
    - The current price (`val`).
    - A boolean indicating whether the price is valid (`has`).

#### **`peep()`**

- **Purpose**: Allows whitelisted addresses to view the next price, which will be used in the next update.

#### **`read()`**

- **Purpose**: Returns the current price, reverting if the value is not valid (i.e., not set by a legitimate process).


#### Parameters

- **`src`**: The address of the `DSValue` contract, where the price feed is fetched from.
- **`hop`**: The time delay between updates in seconds. By default, it is set to 3600 seconds (1 hour).
- **`cur`**: The current price of the collateral type.
- **`nxt`**: The next price that will become the current price upon the next `poke()` call.
- **`bud`**: The list of whitelisted addresses that can read the price feed.

