It is a `fungible token` contract which implements main **ERC20** functionalities like `transfer`, `approve`, `transferFrom`, and `allowance`.  

Customisation:
- Includes safe addition and subtraction (`add` and `sub`) functions.
- Includes authorization mechanism (`rely` and `deny` functions) .
-  `push`, `pull` & `move` are aliases for `transferFrom` calls in the form of `transferFrom(msg.sender, usr, amount)` , `transferFrom(usr, msg.sender, amount)` & `transferFrom(src, dst, amount)` .
- Permit Functionality: Users can sign messages off-chain to authorize allowances without directly interacting with the blockchain.
	`PERMIT_TYPEHASH`: It represents the **structure** of the data being signed.
	`DOMAIN_SEPARATOR`: This is part of the **EIP-712** standard used for signing typed data     (like `permit`) off-chain securely. Ensures that the signed data is bound to a specific domain to avoid replay attacks across different smart contracts or networks. Calculated once during contract deployment.
- Only addresses with `wards` set to `1` are authorized to perform specific functions (`mint`, `rely`, `deny`).