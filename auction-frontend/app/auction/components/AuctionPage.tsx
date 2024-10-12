import React, { useState } from 'react';
import Image from 'next/image';


const itemImage = 'https://pic.616pic.com/ys_bnew_img/00/06/64/Kq4JmzmDSS.jpg'; // 拍卖物品图片URL
// const currentBid = 0.001; // 当前最高出价，单位为 ETH

const AuctionPage = ({ currentBid }) => {
  const [bidAmount, setBidAmount] = useState('0.1'); // 默认出价

  const handleBid = () => {
    if (bidAmount) {
      alert(`你已成功出价: ${bidAmount} ETH`);
    } else {
      alert('请输入出价金额');
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* 拍卖物品图片 */}
      <img src={itemImage} alt="Auction Item" style={styles.itemImage} />
      
      {/* 当前最高出价 */}
      <h2 style={styles.bidText}>当前最高出价: {currentBid} ETH</h2>
      
      {/* 用户输入框和出价按钮 */}
      <div style={styles.bidContainer}>
        <input
          type="text"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          placeholder="输入出价金额"
          style={styles.bidInput}
        />
        <button style={styles.bidButton} onClick={handleBid}>
          出价
        </button>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '10px',
    width: '400px',
    margin: '50px auto',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  },
  itemImage: {
    width: '300px',
    height: '300px',
    borderRadius: '10px',
    objectFit: 'cover',
    marginBottom: '20px',
  },
  bidText: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  bidContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  bidInput: {
    fontSize: '18px',
    padding: '10px',
    marginRight: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100px',
  },
  bidButton: {
    fontSize: '18px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default AuctionPage;
