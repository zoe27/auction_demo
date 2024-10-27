// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

// 拍卖升级， 这个是一个单独的拍卖项目
import "@openzeppelin/contracts/access/Ownable.sol";

contract AuctionItem{

    enum AuctionState { NotStarted, Active, Ended }

    uint256 public duration = 2 days; // 持续时间
    string public description; // 描述
    string public name; // 名字
    string public url; // 地址
    uint256 public current_bid; // 最高报价
    address payable public current_max_bidder;
    // 出价时间， 用来处理冷静期
    mapping(address => uint) private bid_time;

    // 记录需要退款的信息
    mapping(address => uint) pendingReturns;

    uint private call_down_time = 5 minutes;

    uint private delay_time = 5 minutes;

    uint public token_id;

    uint256 public start_at; // 开始时间
    uint256 public expire_at; // 结束时间

    AuctionState public auctionState;

    address payable public owner;

    event Bidding_msg(address addr, uint price);
    event AuctionEnded(address indexed winner, uint winningBid);

    constructor( 
        uint256 _duration,
        uint256 _startingPrice,
        string memory _name,
        string memory _description,
        string memory _url,
        uint256 _token_id,
        uint256 _delay_time,
        address payable creater
        ) payable {
        
        duration = _duration;
        current_bid = _startingPrice;

        start_at = block.timestamp;
        expire_at = start_at + duration * 1 days;
        current_max_bidder = creater;

        delay_time = _delay_time;

        name = _name;
        description = _description;
        url = _url;

        auctionState = AuctionState.NotStarted;
        owner = creater;
        token_id = _token_id;
    }

    // 开始拍卖, 只有owner才可以执行
    function startAuction(address _starter) external{
        require(_starter == owner, "only onwer can start it");
        require(auctionState == AuctionState.NotStarted, "Auction has already started or ended.");
        auctionState = AuctionState.Active;
        start_at = block.timestamp; // 有了竞价状态，感觉这个都有点多余了
    }

    // 发送竞价价格
    function bidding(address sender, uint price) external payable{
        require(auctionState == AuctionState.Active, "Auction is not active.");

        // 检查是否在竞价期内
        require(block.timestamp > start_at, "the auction is not start");
        require(block.timestamp < expire_at, "the anction is ended");

        // 竞标价格需要大于当前的价格
        require(price > current_bid, "price must higher than current price");

        // 冷静期
        require((block.timestamp - bid_time[sender]) > call_down_time, "call down, you biding just now, try it 5 min later");


        // 自动延期, 在5分钟内有竞标，则在延迟5分钟
        if ((expire_at - block.timestamp) < delay_time) {
            expire_at = expire_at + delay_time;
        }
        
        if (current_max_bidder != address(0) && current_max_bidder != sender) {
            // (bool success, ) = current_max_bidder.call{value: current_bid}("");
            // require(success, "Refund previous bidder failed");
            pendingReturns[current_max_bidder] += current_bid;
        }

        // 竞价后的新的价格
        current_bid = price;
        current_max_bidder = payable(sender);
        bid_time[sender] = block.timestamp;

        // 提交一个事件
        emit Bidding_msg(sender, price);

    }

    // 用户主动来退款/提款
    function withdraw(address drawer) external {
        uint amount = pendingReturns[drawer];
        require(amount > 0, "No funds to withdraw");

        // 防止重入操作
        pendingReturns[drawer] = 0;
    
        (bool success, ) = payable(drawer).call{value: amount}("");
        require(success, "Withdrawal failed");
    }

    // 获取当前的最高价
    function highestBid() public view returns(uint){
        return current_bid;
    }


    // 只有合约的拥有者才可以调用
    function endAuction(address ender) external{
        require(owner == ender, "this is not belong to you");
        // 只有合约结束了才可以获取收益
        require(block.timestamp > expire_at, "auction is not ended");
        require(auctionState == AuctionState.Active, "Auction is not active.");

        auctionState = AuctionState.Ended;

        // 获取收益
        (bool success, ) = owner.call{value: current_bid}("");
        require(success, "transfer faile");

        emit AuctionEnded(current_max_bidder, current_bid);
    }

}