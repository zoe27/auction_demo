import { ethers } from 'ethers'
import { getGlobalState, setGlobalState } from '../cache'

// check if the wallet is connected
const isWallectConnected = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    setGlobalState('connectedAccount', accounts[0]?.toLowerCase())

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload()
    })

    window.ethereum.on('accountsChanged', async () => {
      setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
      await isWallectConnected()
      await loadCollections()
      await logOutWithCometChat()
      await checkAuthState()
        .then((user) => setGlobalState('currentUser', user))
        .catch((error) => setGlobalState('currentUser', null))
    })

    if (accounts.length) {
      setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
    } else {
      alert('Please connect wallet.')
      console.log('No accounts found.')
    }
  } catch (error) {
    reportError(error)
  }
}


// collect to the wallet
const connectWallet = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
  } catch (error) {
    reportError(error)
  }
}


const bidPrice = async ({ tokenId, price }) => {

}



export {
  isWallectConnected,
  connectWallet,
  // createNftItem,
  // loadAuctions,
  // loadAuction,
  // loadCollections,
  // offerItemOnMarket,
  // buyNFTItem,
  bidPrice,
  // getBidders,
  // claimPrize,
  // updatePrice,
}