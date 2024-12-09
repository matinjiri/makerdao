
The **`Flopper`** contract is a component of the MakerDAO system responsible for **debt auctions**. It mints new MKR tokens to settle system debt (Dai deficit).

### Functions**

1. **`kick(address gal, uint lot, uint bid)`**  
    Starts a new auction.
    
    - `gal`: Recipient of the Dai proceeds.
    - `lot`: Initial MKR lot.
    - `bid`: Dai amount to be paid.  
        Emits a `Kick` event.
2. **`dent(uint id, uint lot, uint bid)`**  
    Allows bidders to place a bid by reducing the MKR (`lot`) they receive.  
    Requirements:
    
    - The bidder must offer a lower `lot` than the current highest bid.
    - `beg` must ensure a sufficient lot decrease.
3. **`tick(uint id)`**  
    If no bids have been placed and the auction is near expiry, `tick` increases the MKR lot size (`pad`) and extends the auction duration.
    
4. **`deal(uint id)`**  
    Finalizes the auction, mints MKR for the highest bidder, and deletes the auction data.

### **Auction Parameters**

- `beg`: Minimum bid increase (default: 5%).
- `pad`: Lot size increase for `tick` (default: 50%).
- `ttl`: Single bid lifetime (default: 3 hours).
- `tau`: Maximum auction duration (default: 2 days).

### **Auction Data**

- `kicks`: Counter for the number of auctions started.
- `bids`: Mapping of auction ID to `Bid` structs:
    - `bid`: Fixed Dai bid amount.
    - `lot`: MKR lot offered.
    - `guy`: Current highest bidder.
    - `tic`: Expiry time for the current bid.
    - `end`: Expiry time for the auction.

The system prioritizes minimizing MKR minting to maintain its value. Therefore, the **`dent` function** allows bidders to decrease the MKR amount they receive while keeping their Dai bid constant. This reduces the MKR minted, which is beneficial for the system.

However, if no one places a bid and the auction nears expiration, the **`tick` function** can be called. This increases the MKR lot size (making the auction more attractive) and extends the auction duration. Importantly, `tick` can only be used **once per auction** to limit excessive MKR minting.
