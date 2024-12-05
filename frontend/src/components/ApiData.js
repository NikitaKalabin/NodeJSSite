import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";

const ApiData = () => {
  const { theme } = useContext(ThemeContext);
  const [bitcoinPrice, setBitcoinPrice] = useState(null);
  const [ethereumPrice, setEthereumPrice] = useState(null);
  const [litecoinPrice, setLitecoinPrice] = useState(null);
  const [catImage, setCatImage] = useState(null);

  useEffect(() => {
    // Fetch Bitcoin price
    const fetchBitcoinPrice = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
        );
        const data = response.data;
        console.log("Bitcoin data:", data);
        if (data.bitcoin && data.bitcoin.usd) {
          setBitcoinPrice(data.bitcoin.usd);
        } else {
          console.error("Bitcoin price data is not available");
        }
      } catch (error) {
        console.error("Error fetching Bitcoin price:", error);
      }
    };

    // Fetch Ethereum price
    const fetchEthereumPrice = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const data = response.data;
        console.log("Ethereum data:", data);
        if (data.ethereum && data.ethereum.usd) {
          setEthereumPrice(data.ethereum.usd);
        } else {
          console.error("Ethereum price data is not available");
        }
      } catch (error) {
        console.error("Error fetching Ethereum price:", error);
      }
    };

    // Fetch Litecoin price
    const fetchLitecoinPrice = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd"
        );
        const data = response.data;
        console.log("Litecoin data:", data);
        if (data.litecoin && data.litecoin.usd) {
          setLitecoinPrice(data.litecoin.usd);
        } else {
          console.error("Litecoin price data is not available");
        }
      } catch (error) {
        console.error("Error fetching Litecoin price:", error);
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
    fetchEthereumPrice();
    fetchLitecoinPrice();
    fetchCatImage();
  }, []);

  const containerStyles = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    padding: "20px",
    backgroundColor: theme === "light" ? "#f9f9f9" : "#333",
    color: theme === "light" ? "#000" : "#fff",
  };

  const cardStyles = {
    backgroundColor: theme === "light" ? "#fff" : "#444",
    padding: "20px",
    borderRadius: "10px",
    boxShadow:
      theme === "light"
        ? "0 0 15px rgba(0, 0, 0, 0.1)"
        : "0 0 15px rgba(255, 255, 255, 0.1)",
    textAlign: "center",
  };

  const imageStyles = {
    width: "50px",
    height: "50px",
    marginBottom: "10px",
  };

  return (
    <div>
      <h2>Cryptocurrency Prices</h2>
      <div style={containerStyles}>
        <div style={cardStyles}>
          <h3>Bitcoin</h3>
          {bitcoinPrice ? (
            <div>
              <img
                src="https://cryptologos.cc/logos/bitcoin-btc-logo.png"
                alt="Bitcoin"
                style={imageStyles}
              />
              <p>{bitcoinPrice} USD</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div style={cardStyles}>
          <h3>Ethereum</h3>
          {ethereumPrice ? (
            <div>
              <img
                src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
                alt="Ethereum"
                style={imageStyles}
              />
              <p>{ethereumPrice} USD</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div style={cardStyles}>
          <h3>Litecoin</h3>
          {litecoinPrice ? (
            <div>
              <img
                src="https://cryptologos.cc/logos/litecoin-ltc-logo.png"
                alt="Litecoin"
                style={imageStyles}
              />
              <p>{litecoinPrice} USD</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
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
