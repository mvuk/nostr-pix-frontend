"use client";

import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface BitcoinPriceProps {
  // You can pass props to customize the component if needed.
  label?: string;
}

export default function BitcoinPrice({ label = "Bitcoin Price:" }: BitcoinPriceProps) {
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null); 

  useEffect(() => {
    const fetchBtcPrice = async () => {
      try {
        const res = await fetch("http://localhost:3001/bitcoinpricebrl");
        if (!res.ok) {
          throw new Error("Error fetching Bitcoin price");
        }
        const data = await res.json();
        setBtcPrice(data.btc_price_brl);
      } catch (err: any) {
        setError(err.message || "Failed to fetch Bitcoin price");
      } finally {
        setLoading(false);
      }
    };

    fetchBtcPrice();
  }, []);

  // Configuração do socket.io para atualização em tempo real
  useEffect(() => {
    // Conecta no servidor socket.io
    const socketClient = io("http://localhost:3001");
    setSocket(socketClient);

    // Quando receber o evento "btc-price-update", atualiza o estado
    socketClient.on("btc-price-update", (price: number) => {
      setBtcPrice(price);
    });

    // Lida com erros na conexão
    socketClient.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setError("Unable to connect to price update server.");
    });

    // Desconecta ao desmontar o componente
    return () => {
      socketClient.disconnect();
    };
  }, []);

  // Calcula o preço com 5% de taxa
  const priceWithFee = btcPrice ? btcPrice * 1.05 : null;

  return (
    <p className="text-lg">
      {label}{" "}
      {loading
        ? "Loading..."
        : error
        ? error
        : `R$ ${priceWithFee !== null ? priceWithFee.toFixed(2) : "N/A"}`}
    </p>
  );
}

