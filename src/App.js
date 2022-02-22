import React, { useState, useEffect, useRef } from 'react';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import { io } from "socket.io-client";


const App = () => {
  const [info, setInfo] = useState(false);
  const [currencies, setcurrencies] = useState([]);


  const url = "https://api.pro.coinbase.com";
  let pairs = [];

  
  useEffect(()=>{ // maneja la primera petición al servidor
    
    // peticion a la api
    const apiCall = async ()=> {
      // peticion
      await fetch(url + "/products")
      .then((res) => res.json())
      .then((data) => (pairs = data));
      console.log(pairs)
      
      // filtrar las criptos cruzadas con el euro
      let filtered = pairs.filter((pair) => {
        if (pair.quote_currency === "EUR") {
          return pair;
        }
      });
      console.log(filtered)

      
      // ordenar el array filtrado de criptos en base a su valor
      filtered = filtered.sort((a, b) => {
        if( a.base_currency == b.base_currency ) { return 0; }
        else return ( a.base_currency > b.base_currency ? 1 : -1 )
    });
    console.log(filtered)
    

    setcurrencies(filtered);
    
    // first.current = true;

    


  };
  apiCall();


    // configuración principal del WebSocket
    const socket = io.connect("wss://ws-feed.pro.coinbase.com");
    socket.on("connect", (data) => {
      console.log(`is my socket connected? +${socket.connected} \n the id is ${socket.id}`);
      console.log(data)
    });
    
    // pedir suscripción al servidor
    let msg = 
    {
      "type": "subscribe",
      "product_ids": [
          "ETH-USD",
          "ETH-EUR"
      ],
      "channels": [
          "level2",
          "heartbeat",
          {
              "name": "ticker",
              "product_ids": [
                  "ETH-BTC",
                  "ETH-USD"
              ]
          }
      ]
    };

    // esto es lo que tiene el ejemplo:
    // {
    // type: "subscribe",
    // product_ids: [pair],
    // channels: ["ticker"]
    // };

    let jsonMsg = JSON.stringify(msg);
    
    // de aquí, una u otra
    // socket.on("message", jsonMsg);
    socket.send(jsonMsg);

  },[])

  // useEffect(()=>{


    
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
