
The **`DSValue`** contract is a lightweight oracle implementation used to manage and store price feeds securely within the MakerDAO system. It allows authorized users to update the stored price value, while other contracts and users can query the current price or determine if the price is valid.

DSValue vs OSM : OSM designed to provide a secure, delayed price feed for each collateral type while DSValue is a simple contract for storing and updating price data. It can be used as `src` in OSM.

- **`poke(bytes32 wut)`**:
    
    - Updates the stored price (`val`) and marks it as valid (`has = true`).
    - **Access**: Restricted to authorized users.
- **`peek()`**:
    
    - Returns the stored price value (`val`) and its validity (`has`).
    - **Access**: Public.
    - **Use Case**: Used when consumers need both the value and its validity.
- **`read()`**:
    
    - Returns the stored price value (`val`), reverting if the value is invalid (`has == false`).
    - **Access**: Public.
    - **Use Case**: Used when the value must be valid; otherwise, it triggers an exception.