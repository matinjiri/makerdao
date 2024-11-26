The `Median` contract in the MakerDAO ecosystem acts as the trusted price reference mechanism for the protocol.

#### **Core Functions**

- **`read`**: Returns the most recent valid price, or reverts if the price is invalid.
- **`peek`**: Returns the latest price and a boolean indicating validity.
- **`poke`**: Updates the price by submitting new data from whitelisted price feed contracts.
- **`lift`**: Adds addresses to the writer (oracle) whitelist.
- **`drop`**: Removes addresses from the writer whitelist.
- **`setBar`**: Sets the minimum quorum of oracle submissions required for `poke`.
- **`kiss`**: Adds addresses to the reader whitelist.
- **`diss`**: Removes addresses from the reader whitelist.
