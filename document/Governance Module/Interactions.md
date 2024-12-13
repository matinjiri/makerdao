**In conclusion**, the **cast** (execution of the spell) occurs during the **`exec`** function, where the planned governance action (spell) is executed via **`delegatecall`** in the **`DSPauseProxy`** contract.

The **`delegatecall`** function is used in the **`ds-pause`** mechanism to allow a contract (like the **`DSPause`** contract) to call a function (like the `cast()` function) on another contract (like a **spell contract**), while preserving the state of the calling contract (the **`ds-pause`** contract).

### **Key Point: Upgradable Spell Contracts**

The main idea behind using **`delegatecall`** and the **`DSPauseProxy`** is to provide **upgradability** for the governance-related functions (like the `cast()` function). Here's how this works in the context of the **MakerDAO** governance system:

1. **Spell Contracts**:
    
    - A **spell contract** in MakerDAO is typically a contract that contains one or more governance actions that can change the protocol's state (like changing interest rates, modifying collateral parameters, etc.).
    - **Spell contracts** can be written to encapsulate a series of changes, and the governance system needs a mechanism to execute these changes.
2. **`ds-pause` and `delegatecall`**:
    
    - The **`ds-pause`** contract acts as a governance manager that controls when specific functions (like `cast()`) in the **spell contracts** can be executed.
    - **`delegatecall`** allows **`ds-pause`** to call functions in external contracts (e.g., **spell contracts**) while preserving the **`ds-pause`**'s context and state (such as storage). This is why **`ds-pause`** needs a **proxy** to execute these calls without changing its own internal state.
3. **Upgradability**:
    
    - Using **delegatecall** through **`DSPauseProxy`** provides flexibility because the **`ds-pause`** contract itself doesn't need to know the specific implementation details of the **spell contract**.
    - If the **spell contract** logic needs to be changed or upgraded (for example, if there are new governance actions to be added or an existing action needs modification), a new version of the **spell contract** can be deployed, and the **`ds-pause`** contract can delegate calls to this new contract. This avoids having to update the **`ds-pause`** contract itself.
    - The **`ds-pause`** contract doesn't directly modify the storage of the **spell contract**, it simply delegates the execution, allowing the **spell contract** to remain upgradable and maintain backward compatibility with the governance system.
4. **Why `cast()`?**
    
    - The **`cast()`** function is an example of a function in a **spell contract** that can be called through the **`ds-pause`** mechanism. The `cast()` function is typically responsible for executing some critical governance change in MakerDAO, like adjusting parameters or performing state changes.
    - By using **`ds-pause`** with **delegatecall**, MakerDAO can ensure that the **`cast()`** function is executed in a controlled and delayed manner, giving the governance participants time to respond to changes before they are enacted.

### **Benefits:**

- **Upgradability**: The **`ds-pause`** contract can interact with the latest **spell contract** without needing to change its own code, making the governance system more flexible and adaptable.
- **Security**: Since the execution of governance actions is delayed, it ensures that stakeholders have time to review and respond to proposed changes.
- **Isolation**: The use of **delegatecall** ensures that the **`ds-pause`** contract does not risk changing the storage of the **spell contract**, keeping the execution safe and controlled.