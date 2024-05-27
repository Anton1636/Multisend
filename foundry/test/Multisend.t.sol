// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Multisend} from "../src/Multisend.sol";

contract MultisendTest is Test {
    Multisend public multisend;

    function setUp() public {
        multisend = new Multisend();
    }

    function test_send() public {
        address payable[] memory recipients = new address payable[](2);
        uint[] memory amounts = new uint[](2);
        recipients[0] = payable(0x24EFE2394077b3AC27a0775E74F00D8bf37EcA0C);
        recipients[1] = payable(0x177fF889Ecf1176Bf0626f17B8A227369c29D810);
        amounts[0] = 50;
        amounts[1] = 100;
        multisend.send{value: 150}(recipients, amounts);
        assertEq(address(recipients[0]).balance, amounts[0]);
        assertEq(address(recipients[1]).balance, amounts[1]);
    }
}
