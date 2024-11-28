#### **Instant Settlement with Dutch Auctions**

- **Dutch Auctions** replace the English auctions of Liquidation 1.2.
- Pricing decreases over time, enabling instant settlement without locking participant capital.
- Reduces price volatility risk and allows rapid capital recycling for participants.

#### **Flash Lending of Collateral**

- Enables **bidder access to all DeFi DAI liquidity**
- Participants can direct collateral sales to external protocols for DAI.

#### **Price as a Function of Time**

- Auction prices decrease based on predefined **price-versus-time curves**, including:
    - Linear
    - Step-wise exponential
    - Continuous exponential
    
- Prices may increase occasionally due to:
    1. Auction resets (via the **redo** function).
    2. Governance changes to price calculator parameters.

#### **Resetting an Auction**

- Auctions reset if:
    1. Time since start exceeds the **tail** governance parameter.
    2. The price ratio falls below the **cusp** governance parameter.
- The reset process:
    - Updates the starting time and price.
    - Repeats until all collateral is sold, the debt is cleared, or an auction is canceled (e.g., during **Emergency Shutdown**).

#### **Improved Keeper Wallet Security**

- By adopting the **clipperCallee** pattern, keepers can avoid holding DAI or collateral directly.
- Keepers only need enough ETH for transaction execution, reducing wallet exposure.
- Remaining assets can be directed to cold wallets for added security.