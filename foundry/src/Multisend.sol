// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract Multisend {
    function send(
        address payable[] calldata recipient,
        uint[] calldata amounts
    ) external payable {
        require(
            recipient.length == amounts.length,
            "Recipients and Amounts should have smae length"
        );

        for (uint i = 0; i < recipient.length; i++) {
            recipient[i].call{value: amounts[i]}("");
        }
    }
}
