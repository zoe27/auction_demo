// import { Link } from 'react-router-dom'
import { connectWallet } from '../blockchain/blockchain.jsx'
import { setGlobalState, truncate, useGlobalState } from '../cache'
import Link from 'next/link';



const Header = () => {
  const [connectedAccount] = useGlobalState('connectedAccount')
  
  return (
    <nav className="w-4/5 flex flex-row md:justify-center justify-between items-center py-4 mx-auto">
      <div className="md:flex-[0.5] flex-initial justify-center items-center">
        {<Link href="/" className="text-white">
          <span className="px-2 py-1 font-bold text-3xl italic">Dapp</span>
          <span className="py-1 font-semibold italic">Auction-NFT</span>
        </Link> }

      </div>

      <ul
        className="md:flex-[0.5] text-white md:flex
      hidden list-none flex-row justify-between 
      items-center flex-initial"
      >
        <Link href="/" className="mx-4 cursor-pointer">Market</Link>
        <Link href="/collections" className="mx-4 cursor-pointer">Collection</Link>
        <Link href="/artists" className="mx-4 cursor-pointer">Artists</Link>
        <Link href="/community" className="mx-4 cursor-pointer">Community</Link>
        <Link href="/" className="mx-4 cursor-pointer" onClick={() => setGlobalState('boxModal', 'scale-100')}>Create Auction</Link>

      </ul>

      {connectedAccount ? (
        <button
          className="shadow-xl shadow-black text-white
          bg-green-500 hover:bg-green-700 md:text-xs p-2
          rounded-full cursor-pointer text-xs sm:text-base"
        >
          {truncate(connectedAccount, 4, 4, 11)}
        </button>
      ) : (
        <button
          className="shadow-xl shadow-black text-white
          bg-green-500 hover:bg-green-700 md:text-xs p-2
          rounded-full cursor-pointer text-xs sm:text-base"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}

        {/* <button
          className="shadow-xl shadow-black text-white
          bg-green-500 hover:bg-green-700 md:text-xs p-2
          rounded-full cursor-pointer text-xs sm:text-base"
          >
          create auction
        </button> */}

    </nav>
  )
}
export default Header
