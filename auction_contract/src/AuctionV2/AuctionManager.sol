// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

// 该合约进行升级， 可以支持创建多个拍卖
import "@openzeppelin/contracts/access/Ownable.sol";

// 导入 Auction 合约
import "./AuctionItem.sol";

contract AuctionManager{

    AuctionItem[] public auctionitems;

    mapping(uint => AuctionItem) public auctionMap;

    event AuctionCreated(address auctionAddress, string name);


    struct AuctionItemStruct {
        uint256 duration;
        uint256 max_price;
        string name;
        string description;
        string url;
        uint256 expire_at;
        address owner;
        uint token_id;
    }


    // 创建一个拍卖
    function createAuction(
        uint256 _duration,
        uint256 _startingPrice,
        string memory _name,
        string memory _description,
        string memory _url,
        uint256 _delay_time) external {
            _duration = _duration == 0 ? 2 days : _duration;
            _startingPrice = _startingPrice == 0 ? 100000000 : _startingPrice;
            _name = bytes(_name).length == 0 ? "auction item" : _name;
            _description = bytes(_description).length == 0 ? "nothing" : _description;
            _url = bytes(_url).length == 0 ? "https://pic.616pic.com/ys_bnew_img/00/06/64/Kq4JmzmDSS.jpg" : _url;
            _delay_time = _delay_time == 0 ? 5 minutes : _delay_time;

            uint idx = auctionitems.length + 1;
            AuctionItem auctionitem = new AuctionItem(_duration, _startingPrice, _name, _description, _url, idx, _delay_time, payable(msg.sender));

            auctionMap[idx] = auctionitem;
            auctionitems.push(auctionitem);
    }

    // 获取拍卖列表
    function getAcutions() external view returns(AuctionItemStruct[] memory) {
        AuctionItemStruct[] memory details = new AuctionItemStruct[](auctionitems.length);
        for (uint i = 0; i < auctionitems.length; i++) {
            AuctionItem auction = auctionitems[i];

            details[i] = AuctionItemStruct({
                            duration: auction.duration(),
                            max_price: auction.current_bid(), 
                            name: auction.name(), 
                            description: auction.description(), 
                            url: auction.url(), 
                            token_id: auction.token_id(), 
                            expire_at: auction.expire_at(), 
                            owner: auction.owner() 
                            });
        }
        return details;
    }

    // 获取某一个具体的拍卖
    function getCertainAcutions(uint idx) external view returns(AuctionItem) {
        return auctionMap[idx];
    }

    

}