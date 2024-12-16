### **1. VoteProxy Contract**

#### **Overview**

The `VoteProxy` contract is designed to enable secure delegation of voting rights between two wallets: a cold wallet and a hot wallet. The cold wallet stores tokens securely, while the hot wallet has the ability to vote on governance proposals on behalf of the cold wallet.

#### **Key Features**

- Allows the cold wallet to lock and unlock governance tokens.
- Enables voting on governance proposals via the hot wallet.
- Supports creation of a proxy relationship between a cold and a hot wallet.

#### **State Variables**

- `cold`: The address of the cold wallet.
- `hot`: The address of the hot wallet.
- `gov`: The governance token (`TokenLike` contract).
- `iou`: The IOU token (`TokenLike` contract).
- `chief`: The `ChiefLike` contract responsible for governance and token management.


#### **Functions**

1. **lock(uint256 wad)**:
    
    - Locks a specified amount of governance tokens (`wad`) from the cold wallet to participate in governance.
    
1. **free(uint256 wad)**:
    
    - Frees a specified amount of IOU tokens and returns the corresponding amount of governance tokens to the cold wallet.
    
3. **freeAll()**:
    
    - Frees all tokens held by the `VoteProxy` contract and sends all remaining governance tokens to the cold wallet.
    
4. **vote(address[] memory yays)**:
    
    - Allows the hot wallet to vote on multiple governance proposals.
    
5. **vote(bytes32 slate)**:
    
    - Allows the hot wallet to vote on a governance proposal represented by a `bytes32` slate.
    

---

### **2. VoteProxyFactory Contract**

#### **Overview**

The `VoteProxyFactory` contract manages the creation, approval, and linking of `VoteProxy` contracts between cold and hot wallets. It allows users to initiate and approve links between their cold and hot wallets and provides a method to break links or self-link wallets.

#### **Key Features**

- Allows cold wallets to request a link to a hot wallet.
- Allows hot wallets to approve the link request and create a new `VoteProxy` contract.
- Allows users to break existing links and remove associated `VoteProxy` contracts.
- Supports self-linking where a user links their own cold and hot wallets.


#### **State Variables**

- `chief`: The address of the `ChiefLike` contract used for governance and token management.
- `hotMap`: A mapping of hot wallet addresses to their associated `VoteProxy`.
- `coldMap`: A mapping of cold wallet addresses to their associated `VoteProxy`.
- `linkRequests`: A mapping of cold wallets that have pending link requests from hot wallets.

#### **Functions**

1. **hasProxy(address guy)**:
    
    - Returns a boolean indicating whether the specified address has an associated `VoteProxy` contract.
    
2. **initiateLink(address hot)**:
    
    - Allows a cold wallet to request a link to a hot wallet. It ensures that neither wallet is already linked to another `VoteProxy`.
    
3. **approveLink(address cold)**:
    
    - Allows the hot wallet to approve a link request initiated by the cold wallet. Once approved, a new `VoteProxy` contract is created for the pair.
    
4. **breakLink()**:
    
    - Allows a user (cold or hot wallet) to break the link between them and the associated `VoteProxy`. The contract ensures no funds are left in the `VoteProxy` before it is deleted.
    
5. **linkSelf()**:
    
    - Allows a user to link themselves by initiating and approving a link between their own cold and hot wallets. It combines the `initiateLink` and `approveLink` functions for self-linking.



### Usage Flow
1. **Link Request**: The cold wallet requests to link with a hot wallet by calling `initiateLink(hotAddress)`. The hot wallet is notified via the `LinkRequested` event.
    
2. **Link Approval**: The hot wallet approves the link by calling `approveLink(coldAddress)`, which creates a `VoteProxy` contract and associates both wallets with it. The `LinkConfirmed` event is emitted.
    
3. **Locking MKR**: The cold wallet locks MKR tokens by calling the `lock(wad)` function. This action transfers MKR from the cold wallet to the `VoteProxy`, making it available for governance voting.
    
4. **Vote Delegation**: Once the MKR is locked, the hot wallet can use the `vote` function in the `VoteProxy` to vote on behalf of the cold wallet using the locked MKR.
    
5. **Freeing MKR**: The cold wallet can unlock and withdraw MKR by calling the `free(wad)` function. This action removes the MKR from the proxy and returns it to the cold wallet.
    
6. **Breaking the Link**: Either wallet can unlink by calling `breakLink()`, ensuring no funds are left in the `VoteProxy` before unlinking.
    
7. **Self-Linking**: A wallet can self-link using `linkSelf()`, creating both cold and hot wallet associations with a `VoteProxy`.