
"use client";

import { useRouter } from 'next/compat/router'; // 使用兼容路由钩子
import { useEffect, useState } from 'react'
import { setGlobalState, truncate, useGlobalState } from '../cache'
import { ethers , Web3Provider} from 'ethers';
import Countdown from '../components/Countdown'

import Header from '../components/Header'
import Footer from '../components/Footer'
import PlaceBid from '../components/PlaceBid'


import {
  loadAuction,
  startAuction,
} from '../blockchain/blockchain'



const Detail = ({ params }) => {
  const { id } = params;
  const [currentBid, setCurrentBid] = useState(0);
  const [newBid, setNewBid] = useState("");

  const [auction] = useGlobalState('auction')
  const [currentUser] = useGlobalState('currentUser')
  const [connectedAccount] = useGlobalState('connectedAccount')

  useEffect(() => {
    // 定义一个异步函数
    const loadAuctionData = async () => {
        await loadAuction(id)
        // await startAuction(id)
    };
  
    // 调用异步函数
    loadAuctionData();
    
    
    }, [id]);

    return (
      <>
      <div
      className="min-h-screen bg-gradient-to-t from-gray-800 bg-repeat
    via-[#25bd9c] to-gray-900 bg-center subpixel-antialiased"
    >
      <Header />
        <div
          className="grid sm:flex-row md:flex-row lg:grid-cols-2 gap-6
          md:gap-4 lg:gap-3 py-2.5 text-white font-sans capitalize
          w-4/5 mx-auto mt-5 justify-between items-center"
        >
          <div
            className=" text-white h-[400px] bg-gray-800 rounded-md shadow-xl 
          shadow-black md:w-4/5 md:items-center lg:w-4/5 md:mt-0"
          >
            <img
              src={auction?.url}
              alt={auction?.name}
              className="object-contain w-full h-80 mt-10"
            />
          </div>
          <div className="">
            <Details auction={auction} account={connectedAccount} />

            <CountdownNPrice auction={auction} />
  
            <ActionButton auction={auction} account={connectedAccount} />
          </div>
        </div>
        {/* <div className="w-4/5 mx-auto">
          {currentUser ? <Chat id={id} group={group} /> : null}
        </div> */}
      <PlaceBid />
      <Footer/>
      </div>
      </>
    )
}

const Details = ({ auction, account }) => (
  <div className="py-2">
    <h1 className="font-bold text-lg mb-1">{auction?.name}</h1>
    <p className="font-semibold text-sm">
      <span className="text-green-500">
        @
        {auction?.owner == account
          ? 'you'
          : auction?.owner
          ? truncate(auction?.owner, 4, 4, 11)
          : ''}
      </span>
    </p>
    <p className="text-sm py-2">{auction?.description}</p>
  </div>
)



const CountdownNPrice = ({ auction }) => {
  return (
    <div className="flex justify-between items-center py-5 ">
      <div>
        <span className="font-bold">Current Price</span>
        <p className="text-sm font-light">{ethers.utils.formatEther(String(auction?.max_price || '0'))}ETH</p>
      </div>

      <div className="lowercase">
        <span className="font-bold">
          {auction?.expire_at * 1000 > Date.now() ? (
            <Countdown timestamp={auction?.expire_at * 1000}
            />  
          ) : (
            '00:00:00'
          )}

 
            {/* <Countdown timestamp='1730764800000'
            />   */}
          
        </span>
      </div>
    </div>
  )
}


const ActionButton = ({ auction, account }) => {
  // const [group] = useGlobalState('group')
  const [currentUser] = useGlobalState('currentUser')
  // const navigate = useNavigate()

  const onPlaceBid = () => {
    setGlobalState('auction', auction)
    setGlobalState('bidBox', 'scale-100')
  }

  const startAuc = async () => {
    await startAuction(String(auction.token_id))
    await loadAuction(String(auction.token_id))
  }

  const handleNFTpurchase = async () => {
    await toast.promise(
      new Promise(async (resolve, reject) => {
        await buyNFTItem(auction)
          .then(() => resolve())
          .catch(() => reject())
      }),
      {
        pending: 'Processing...',
        success: 'Purchase successful, will reflect within 30sec 👌',
        error: 'Encountered error 🤯',
      },
    )
  }

  return (
    <div className="flex justify-start items-center space-x-2 mt-2">

      { auction?.status == 0 ? (<button
          type="button"
          className="shadow-sm shadow-black text-white
          bg-gray-500 hover:bg-gray-700 md:text-xs p-2.5
          rounded-sm cursor-pointer font-light"
          onClick={startAuc}
        >
          Start auction
        </button> ): auction?.expire_at * 1000 > Date.now() ? (
        <button
          type="button"
          className="shadow-sm shadow-black text-white
          bg-gray-500 hover:bg-gray-700 md:text-xs p-2.5
          rounded-sm cursor-pointer font-light"
          onClick={onPlaceBid}
        >
          Place a Bid
        </button>
      ) : null }
    </div>
  )
}


export default Detail
