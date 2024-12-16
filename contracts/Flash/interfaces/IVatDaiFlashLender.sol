// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.6.12;

import "./IVatDaiFlashBorrower.sol";

interface IVatDaiFlashLender {

    /**
     * @dev Initiate a flash loan.
     * @param receiver The receiver of the tokens in the loan, and the receiver of the callback.
     * @param amount The amount of tokens lent. [rad]
     * @param data Arbitrary data structure, intended to contain user-defined parameters.
     */
    function vatDaiFlashLoan(
        IVatDaiFlashBorrower receiver,
        uint256 amount,
        bytes calldata data
    ) external returns (bool);
}