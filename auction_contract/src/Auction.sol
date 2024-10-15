// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
### DoDo：公开拍卖

每个购买者在拍卖期间发送他们的竞标到智能合约。 竞标包括发送资金，以便将购买者与他们的竞标绑定。 如果最高出价被提高，之前的出价者就可以拿回他们的竞标资金。 竞价期结束后，出售人可以手动调用合约，收到他们的收益。
**公开拍卖**
1.每个购买者在拍卖期间发送他们的竞标到智能合约。
2.竞标包括发送资金，以便将购买者与他们的竞标绑定。
3.如果最高出价被提高，之前的出价者就可以拿回他们的竞标资金。
4.竞价期结束后，出售人可以手动调用合约，收到他们的收益。
- 5 时间加权出价奖励机制(在拍卖即将结束时，出价者的出价会根据距离拍卖结束
的时间权重进行调整。例如，在拍卖最后5分钟内的出价可以按某个倍数进行加
权，使得临近结束的出价会更有竞争力。)
- 6 竞拍冷却机制(为防止竞拍者连续快速出价，可以设置一个竞拍冷却期。每个出
价者在一次出价后，需要等待一段时间后才能再次出价，让拍卖过程更具策略性。)
- 7 拍卖终局延长(如果在拍卖快要结束的最后几分钟内有人出价，则拍卖时间会自
动延长一定的时间（例如5分钟），避免“最后一秒出价”的情况，并让竞拍更加激烈。

除了1，2，3，4基础拍卖功能外，还需要从5，6，7三个附加功能中选择任意一个实现。
 */

// auction contract
contract Auction is Ownable{

    uint private call_down_time = 5 minutes;

    uint private delay_time = 5 minutes;

    // 出价时间， 用来处理冷静期
    mapping(address => uint) private bid_time;

    // 拍卖创建者
    address private seller;

    // 记录需要退款的信息
    mapping(address => uint) pendingReturns;

    // start time, before this time, the action can not start
    uint private start_at;

    // end time
    uint private expire_at;

    // 当前最高出价
    uint private current_bid;

    uint private last_days = 30 days;

    // 当前最高出价人
    address payable private current_max_bidder;

    enum AuctionState { NotStarted, Active, Ended }

    // 当前拍卖状态
    AuctionState public auctionState;

    event Bidding_msg(address addr, uint price);
    event AuctionEnded(address indexed winner, uint winningBid);



    // init with the msg.sender as the owner
    constructor(uint _initPrice) Ownable(msg.sender) {
        start_at = block.timestamp;
        expire_at = block.timestamp + last_days;
        current_bid = _initPrice;
        seller = msg.sender;
        auctionState = AuctionState.NotStarted;
    }


    // 开始拍卖, 只有owner才可以执行
    function startAuction() external onlyOwner {
        require(auctionState == AuctionState.NotStarted, "Auction has already started or ended.");
        auctionState = AuctionState.Active;
        start_at = block.timestamp; // 有了竞价状态，感觉这个都有点多余了
    }

    // 发送竞价价格
    function bidding() external payable{
        require(auctionState == AuctionState.Active, "Auction is not active.");

        // 检查是否在竞价期内
        require(block.timestamp > start_at, "the auction is not start");
        require(block.timestamp < expire_at, "the anction is ended");

        // 竞标价格需要大于当前的价格
        require(msg.value > current_bid, "price must higher than current price");

        // 冷静期
        require((block.timestamp - bid_time[msg.sender]) > call_down_time, "call down, you biding just now, try it 5 min later");


        // 自动延期, 在5分钟内有竞标，则在延迟5分钟
        if ((expire_at - block.timestamp) < delay_time) {
            expire_at = expire_at + delay_time;
        }
        
         // 退回上一个最高价的竞标价格
        if (current_max_bidder != address(0)) {
            // (bool success, ) = current_max_bidder.call{value: current_bid}("");
            // require(success, "Refund previous bidder failed");
            pendingReturns[current_max_bidder] += current_bid;
        }

        // 竞价后的新的价格
        current_bid = msg.value;
        current_max_bidder = payable(msg.sender);
        bid_time[msg.sender] = block.timestamp;

        // 提交一个事件
        emit Bidding_msg(msg.sender, msg.value);

    }

    // 用户主动来退款/提款
    function withdraw() external {
        uint amount = pendingReturns[msg.sender];
        require(amount > 0, "No funds to withdraw");

        // 防止重入操作
        pendingReturns[msg.sender] = 0;
    
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");
    }

    // 获取当前的最高价
    function highestBid() public view returns(uint){
        return current_bid;
    }


    // 只有合约的拥有者才可以调用
    function endAuction() external onlyOwner{
        // 只有合约结束了才可以获取收益
        require(block.timestamp > expire_at, "auction is not ended");
        require(auctionState == AuctionState.Active, "Auction is not active.");

        auctionState = AuctionState.Ended;

        // 获取收益
        (bool success, ) = seller.call{value: current_bid}("");
        require(success, "transfer faile");

        emit AuctionEnded(current_max_bidder, current_bid);
    }

}

