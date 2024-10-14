"use client";

import { useState } from 'react';

export default function CreateAuction() {
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // 处理创建拍卖逻辑
    };

    return (
        <div>
            <h1>创建拍卖</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="上传拍卖品图片"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="拍卖品描述"
                />
                <input
                    type="text"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="最低价格 (ETH)"
                />
                <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                />
                <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                />
                <button type="submit">创建拍卖</button>
            </form>
        </div>
    );
}
