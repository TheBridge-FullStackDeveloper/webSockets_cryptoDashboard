import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import { io } from "socket.io-client";


const App = () => {

  
  // // configuración principal del WebSocket
  // const [info, setInfo] = useState(false)
  // const ws = useRef(null);
  // const socket = io.socket("wss://ws-feed.pro.coinbase.com"); // main namespace
  // ws.current = new WebSocket("wss://ws-feed.pro.coinbase.com");
  // // ws.current = new WebSocket("wss://ws-feed.exchange.coinbase.com"); for if the flyes

  

  // useEffect(()=>{

  //   socket.on("connect", () => {

  //     console.log(socket?.connected); // connection id

  //     console.log("eeeeehhhhh"+socket.id); // connection id

  //   });
    

  // },[])

  // useEffect(()=>{

  //   // pedir suscripción al servidor
  //   let msg = {
  //     type: "subscribe",
  //     product_ids: [pair],
  //     channels: ["ticker"]
  //   };
  //   let jsonMsg = JSON.stringify(msg);
  //   socket.send(jsonMsg);

    
  //   // procesar la entrada de datos del socket
  //   // socket.onmessage = (e) => { // el método es el propio de la API, no de socket.io
  //   socket.on = (e) => {
  //     let data = JSON.parse(e.data);
  //     if (data.type !== "ticker") {
  //       return;
  //     }

  //     if (data.product_id === pair) {
  //       setprice(data.price);
  //     }
  //   };

  // },[info])

  // const handleAsk = () =>{
  //   setInfo(!info)
  // }

    return (
      <div className="App">
        <Header/>
        <h1>¿Se ve?</h1>
        <button onClick={handleAsk}>Pedir</button>
        <Footer/>
      </div>
    );
  
}

export default App;
