import React, { useState, useEffect, useRef } from 'react';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import { io } from "socket.io-client";


const App = () => {
  const [info, setInfo] = useState(false)

  
  useEffect(()=>{ // maneja la primera petición al servidor
    
    // configuración principal del WebSocket
    const socket = io.connect("wss://ws-feed.pro.coinbase.com");
    socket.on("connect", () => {
        
    });
    

  },[])

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

  // })

  const handleAsk = () =>{
    setInfo(!info)
  }

    return (
      <div className="App">
        <Header/>
        <h1>¿Se ve?</h1>
        {/* <button onClick={handleAsk}>Pedir</button> */}
        <Footer/>
      </div>
    );
  
}

export default App;
