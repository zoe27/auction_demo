// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {AuctionItem} from "../src/AuctionV2/AuctionItem.sol";
import {AuctionManager} from "../src/AuctionV2/AuctionManager.sol";

contract AuctionV2Script is Script {
    AuctionItem public auctionItem;

    AuctionManager public auctionManager;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        auctionManager = new AuctionManager();

        auctionItem = new AuctionItem(10000,1000,"test","test","test",1,10000, payable(address(auctionManager)));

        

        vm.stopBroadcast();
    }
}
