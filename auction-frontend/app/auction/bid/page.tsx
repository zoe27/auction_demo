"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/compat/router'; // 使用兼容路由钩子
import { ethers } from 'ethers';
import AuctionAbi from '../../../artifacts/contracts/Auction.json'; // 确保路径正确

const auctionAddress = "0x90ee2862690D7223b6C00F0Ec3f543e768B16408"; // 替换为你的合约地址

export default function BidAuction() {
    const router = useRouter();
    const [id, setId] = useState<string | null>(null); // 处理 id 的状态
    const [currentBid, setCurrentBid] = useState(0);
    const [newBid, setNewBid] = useState("");

    useEffect(() => {
        // 检查 router 是否已经初始化
        if (router && router.query && router.query.id) {
            setId(router.query.id as string); // 设置 id
            fetchCurrentBid();
        }
    }, [router]);

    async function fetchCurrentBid() {
        if (!id) return; // 确保 id 存在后再调用
        // 保持获取出价逻辑不变
    }

    const placeBid = async () => {
        // 处理出价逻辑
    };

    return (
        <div>
            <h1>竞价拍卖</h1>
            <p>当前最高出价: {currentBid} ETH</p>
            <input
                type="text"
                value={newBid}
                onChange={(e) => setNewBid(e.target.value)}
                placeholder="输入出价 (ETH)"
            />
            <button onClick={placeBid}>出价</button>
        </div>
    );
}
