"use client";

import '../../index.css';
import AuctionPage from './components/AuctionPage'; // 引入 AuctionPage 组件


import { useEffect, useState } from 'react';
import { ethers , Web3Provider} from 'ethers';
import AuctionAbi from '../../artifacts/contracts/Auction.json';

const auctionAddress = "0x90ee2862690D7223b6C00F0Ec3f543e768B16408";// "0xa9980B4d1Cb97aC01D4DD94A33D687861b3D75A9";


export default function Auction() {
    const [highestBid, setHighestBid] = useState(0);
    const [newBid, setNewBid] = useState("");

    useEffect(() => {

        console.log("**************************************");
    
        console.log(AuctionAbi);

        if (typeof window !== "undefined" && window.ethereum) {
            fetchHighestBid();
        }
    }, []);

    async function fetchHighestBid() {

        console.log("==================");
        console.log(ethers); // 这应该输出 ethers 对象，如果为 undefined，则表示导入有问题

        if (!window.ethereum) {
            console.error("MetaMask is not installed or not available");
            return;
        }

        if (typeof window !== 'undefined' && window.ethereum) {
            console.log("Ethereum is available");
        } else {
            console.log("Ethereum is not available");
        }


         // 检测是否已连接账户
         const accounts = await window.ethereum.request({ method: 'eth_accounts' });
         if (accounts.length > 0) {
             console.log("Wallet is already connected with account:", accounts[0]);
         } else {
             console.log("No wallet connected. Requesting connection...");
             await connectWallet(); // 请求连接钱包
         }


        try {
            // ethers.Web3Provider
            const provider = new ethers.providers.Web3Provider(window.ethereum, {
                chainId: 59141, // 以太坊主网
                name: "Linea Sepolia" // 网络名称
            });
            console.log("Provider created:", provider); // 检查 provider 对象

            const auctionContract = new ethers.Contract(auctionAddress, AuctionAbi.abi, provider);

            const bid = await auctionContract.highestBid();
            setHighestBid(ethers.utils.formatEther(bid));
        } catch (error) {
            console.error("Error creating provider:", error);
        }
        

        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        // console.log(window.ethereum);
        
    }

    async function connectWallet() {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Wallet connected with account:", accounts[0]);
            return accounts[0]; // 返回已连接的第一个账户地址
        } catch (error) {
            console.error("Error connecting wallet:", error);
            return null;
        }
    }

    async function placeBid() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const auctionContract = new ethers.Contract(auctionAddress, AuctionAbi.abi, signer);

        const tx = await auctionContract.bidding({ value: ethers.utils.parseEther(newBid) });
        await tx.wait();

        fetchHighestBid();
    }

    return (
        <div>
            <h1>拍卖 DApp</h1>
            <p>当前最高出价: {highestBid} ETH</p>
            <input
                type="text"
                value={newBid}
                onChange={(e) => setNewBid(e.target.value)}
                placeholder="输入出价 (ETH)"
            />
            <button onClick={placeBid}>出价</button>

            <AuctionPage currentBid={highestBid}/> {/* 使用 AuctionPage 组件 */}
        </div>
    );
}
