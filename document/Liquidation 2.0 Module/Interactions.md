`Dog`, `Clipper`, and `Abacus` components work together to handle liquidations of undercollateralized positions (vaults).

### Interaction Flow:

1. **Liquidation Triggered**: The `Dog` monitors the collateral value and identifies when a vault becomes undercollateralized (i.e., its debt exceeds the value of its collateral).
    
2. **Auction Start**: Once the `Dog` determines the vault is undercollateralized, it triggers the `Clipper` contract to initiate an auction.
    
3. **Auction Process**: The `Clipper` starts the auction, selling off the collateral to raise the required DAI to cover the vault's debt. If incentives are set (through the `chip` and `tip` parameters), the `Clipper` may transfer funds to incentivize external actors to participate in the auction.
    
4. **Auction Completion**: The auction continues until the required debt (`tab`) is raised, and the collateral is sold. If the auction is successful, the liquidator is rewarded, and the vault is cleared of its debt.