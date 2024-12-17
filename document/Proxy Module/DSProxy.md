The **DSProxy** is a smart contract that belongs to a specific user (your wallet). It acts as your personal assistant for handling transactions in the Maker Protocol.
- Your wallet doesn’t directly own the Vault. **Your DSProxy owns it**.
- It also allows you to **bundle multiple actions** (e.g., deposit collateral, generate DAI, and pay back debt) into one transaction.

`proxy.execute( dssProxyActions, abi.encodeWithSignature( "open(address,bytes32,address)", address(manager), bytes32("ETH-A"), address(0x123) ) )`

