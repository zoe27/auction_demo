"use client";

import AuctionPage from './auction/components/AuctionPage'; // 引入 AuctionPage 组件
import AuctionItemAbi from '../artifacts/contracts/AuctionManager.json';


// import Nft from './views/Nft'
import Home from './auction/views/Home'
import Header from './auction/components/Header'
import Footer from './auction/components/Footer'
import { useEffect, useState } from 'react'
import PlaceBid from './auction/components/PlaceBid'
// import Collections from './views/Collections'
import CreateAuction from './auction/components/CreateAuction'
import { ToastContainer } from 'react-toastify';
// import { ToastContainer } from 'react-toastify'
import { Route, Routes } from 'react-router-dom'
import { isWallectConnected, loadAuctions} from './auction/blockchain/blockchain'
import { setGlobalState, useGlobalState } from './auction/cache'
// import OfferItem from './components/OfferItem'
// import ChangePrice from './components/ChangePrice'
// import { checkAuthState } from './services/chat'

import { createContext, useContext} from 'react';


import { ethers } from 'ethers'


function App() {

  // try{

  //   const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545", {
  //     chainId: 31337,
  //     name: "anvil"
  //   });
  //   console.log(provider)
  //   const signer = provider.getSigner()
  //   const ContractAddress = '0x46b142dd1e924fab83ecc3c08e4d46e82f005e0e'

  //   const contract = new ethers.Contract(ContractAddress, AuctionItemAbi.abi, signer)
  //   console.log(contract)

  //   // return contract
  // }catch (error) {
  //   console.error("Error initializing provider or signer:", error);
  // }


  const [loaded, setLoaded] = useState(false)
  const [auction] = useGlobalState('auction')

  useEffect(() => {
    // 定义一个异步函数
    const loadBlockchainData = async () => {
      await isWallectConnected();
      await loadAuctions().finally(() => setLoaded(true));
      console.log('Blockchain Loaded');
    };
  
    // 调用异步函数
    loadBlockchainData();
  }, []);

  return (
    <div
      className="min-h-screen bg-gradient-to-t from-gray-800 bg-repeat
    via-[#25bd9c] to-gray-900 bg-center subpixel-antialiased"
    >
      {<Header />/* 
      {loaded ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/nft/:id" element={<Nft />} />
        </Routes>
      ) : null}
      <CreateNFT />
      {auction ? (
        <>
          <PlaceBid />
          <OfferItem />
          <ChangePrice />
        </>
      ) : null}
     */}

    
    
    <Home></Home>
    <CreateAuction />
    {/* <PlaceBid /> */}
    <Footer/>



      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>

  )
}
export default App
