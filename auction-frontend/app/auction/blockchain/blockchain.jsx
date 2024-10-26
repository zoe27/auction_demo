import { ethers } from 'ethers'
import { getGlobalState, setGlobalState } from '../cache'
import AuctionItemAbi from '../../../artifacts/contracts/AuctionManager.json';


const ContractAddress = '0x46b142dd1e924fab83ecc3c08e4d46e82f005e0e'

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


// get the conctact
const getEthereumContract = async () => {
  const connectedAccount = getGlobalState('connectedAccount')
  if (connectedAccount) {
    // const provider = new ethers.providers.Web3Provider(ethereum, {
    //   chainId: 31337, // 以太坊主网
    //   name: "anvil Sepolia" // 网络名称
    // })
    try{

      const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545", {
        chainId: 31337,
        name: "anvil"
      });
      // alert(provider)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(ContractAddress, AuctionItemAbi.abi, signer)

      return contract
    }catch (error) {
      console.error("Error initializing provider or signer:", error);
    }
  } else {
    return getGlobalState('contract')
  }
}


// create auction
const createAuction = async ({
  name,
  description,
  days,
  item_url,
  start_price,
}) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEthereumContract()
    // alert(contract)

    await contract.createAuction(
      days,
      ethers.utils.parseEther(String(start_price)),
      name,
      description,
      item_url,
      0,
      // toWei(price),
      // {
      //   value: ethers.utils.parseEther(start_price.toString()),
      // },
    )
    // await tx.wait()
    await loadAuctions()
  } catch (error) {
    reportError(error)
  }
}


// load all the auctions
const loadAuctions = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const contract = await getEthereumContract()
    const auctions = await contract.getAcutions()
    // alert(auctions.length)
    // alert(auctions[0].duration)
    // alert(ethers.utils.formatEther(auctions[0].max_price))
    setGlobalState('auctions', auctions)
    // setGlobalState(
    //   'auction',
    //   structuredAuctions(auctions).sort(() => 0.5 - Math.random())[0],
    // )
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
  createAuction,
  loadAuctions,
  // loadAuction,
  // loadCollections,
  // offerItemOnMarket,
  // buyNFTItem,
  bidPrice,
  // getBidders,
  // claimPrize,
  // updatePrice,
}