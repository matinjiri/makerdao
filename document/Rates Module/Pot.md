The `Pot` contract allows users to deposit Dai into a savings account and earn interest at the Dai Savings Rate (DSR).

- **Core Functionality**: Deposit, withdraw, and calculate accrued interest.

`pie` : User's normalized savings balance (Savings Dai).
`Pie` : Total normalized savings balance across all users.
`dsr`: Dai Savings Rate in `ray` (27 decimal precision).
`chi`: Rate accumulator used to scale normalized balances for interest accrual.
`rho`: Timestamp of the last `drip`.


#### `drip() -> uint`

- **Purpose**: Update the interest rate and apply accrued interest since the last update.
- **Returns**: The updated value of `chi`.
- **Effects**:
    - Computes `chi` using the formula:
    - Transfers accrued interest (based on `Pie`) to the `Vow` contract using the `Vat` contract's `suck` function.
    - Updates `rho` to the current timestamp.

#### `join(uint wad)`

- **Purpose**: Deposit Dai to earn interest.
- **Parameters**:
    - `wad`: Amount of Dai (in `wad` units, 18 decimals) to deposit.
- **Effects**:
    - Increases the user's `pie` (normalized balance).
    - Scales the deposit by `chi` and moves Dai from the user to the `Pot` contract in the `Vat`.

#### `exit(uint wad)`

- **Purpose**: Withdraw Dai, including accrued interest.
- **Parameters**:
    - `wad`: Amount of Dai (in `wad` units) to withdraw.
- **Effects**:
    - Reduces the user's `pie` balance.
    - Scales the withdrawal by `chi` and moves Dai from the `Pot` contract in the `Vat` back to the user.


In MakerDAO, `drip()` is called periodically by keepers or users to ensure the `chi` value reflects the latest accrued interest.