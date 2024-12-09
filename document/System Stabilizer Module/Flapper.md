The **`Flapper`** contract is part of the MakerDAO system and facilitates **surplus auctions**. These auctions occur when the Maker Protocol generates excess Dai. The system uses this Dai to repurchase and burn MKR tokens, reducing the MKR supply and stabilizing the protocol.

### Functions

1. **`kick(address gal, uint lot, uint bid)`**  
    Starts a new surplus auction.
    
    - `gal`: Recipient of the Dai proceeds.
    - `lot`: Fixed MKR lot.
    - `bid`: Initial Dai bid.  
        Emits a `Kick` event.
2. **`tend(uint id, uint lot, uint bid)`**  
    Allows bidders to place a bid by increasing the Dai offer (`bid`).  
    Requirements:
    
    - The bid must exceed the previous bid by at least `beg`.
3. **`deal(uint id)`**  
    Finalizes the auction, transfers Dai to the `gal`, and burns the MKR tokens.
    

### **Auction Parameters**

- `beg`: Minimum bid increase percentage (default: 5%).
- `ttl`: Single bid lifetime (default: 3 hours).
- `tau`: Maximum auction duration (default: 2 days).

### **Auction Data**

- `kicks`: Counter for the number of auctions started.
- `bids`: Mapping of auction ID to `Bid` structs:
    - `bid`: Dai offered for the MKR lot.
    - `lot`: Fixed MKR amount.
    - `guy`: Current highest bidder.
    - `tic`: Expiry time for the current bid.
    - `end`: Expiry time for the auction.

