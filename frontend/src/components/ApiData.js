import React, { useEffect, useState } from "react";
import axios from "axios";

const ApiData = () => {
  const [bitcoinPrice, setBitcoinPrice] = useState(null);
  const [catImage, setCatImage] = useState(null);

  useEffect(() => {
    // Fetch Bitcoin price
    const fetchBitcoinPrice = async () => {
      try {
        const response = await axios.get(
          "https://api.coindesk.com/v1/bpi/currentprice/BTC.json"
        );
        setBitcoinPrice(response.data.bpi.USD.rate);
      } catch (error) {
        console.error("Error fetching Bitcoin price:", error);
      }
    };

    // Fetch cat image
    const fetchCatImage = async () => {
      try {
        const response = await axios.get(
          "https://api.thecatapi.com/v1/images/search"
        );
        setCatImage(response.data[0].url);
      } catch (error) {
        console.error("Error fetching cat image:", error);
      }
    };

    fetchBitcoinPrice();
    fetchCatImage();
  }, []);

  return (
    <div>
      <h2>API Data</h2>
      <div>
        <h3>Bitcoin Price</h3>
        {bitcoinPrice ? (
          <div>
            <img
              src="https://cryptologos.cc/logos/bitcoin-btc-logo.png"
              alt="Bitcoin"
              width="50"
            />
            <p>{bitcoinPrice} USD</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div>
        <h3>Cat Image</h3>
        {catImage ? (
          <img src={catImage} alt="Cat" width="200" />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ApiData;
