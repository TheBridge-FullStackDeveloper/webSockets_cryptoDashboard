import React, { useState, useEffect, useRef } from 'react';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import { io } from "socket.io-client";

const App = () => {
  const [info, setInfo] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [pair, setPair] = useState("");
  const [price, setprice] = useState("0.00");

  
  const socket = io("wss://ws-feed.exchange.coinbase.com");

  const url = "https://api.pro.coinbase.com";
  let first = useRef(false);


  // opcion 2 que no funciona
  // const socket = io("https://api.pro.coinbase.com", {
  //   withCredentials: true,
  //   mode: 'cors',
  //   credentials: 'include',
  //   extraHeaders: {
  //     'Access-Control-Allow-Credentials': 'true',
  //   }
  // });

  // const url = "https://api.pro.coinbase.com";
  let pairs = [];
  let flag = useRef(false);

  ///////////////////////////
  // SERVER'S MESSAGE REQUEST
  ///////////////////////////
  let subMsg = 
  {
    "type": "subscribe",
    "product_ids": ["ETH-USD","ETH-EUR"],
    "channels": [
        "level2",
        "heartbeat",
        {
            "name": "ticker",
            "product_ids": ["ETH-BTC","ETH-USD"]
        }
    ]
  };

  let unSubMsg = {
    "type": "unsubscribe",
    "channels": ["heartbeat"]
  }
  
  useEffect(()=>{ // maneja la primera petición al servidor
  console.log("entra 1")
  ////////////////////
  // SOCKET CONNECTION
  ////////////////////

    // forma 1
    // socket = io.connect("wss://ws-feed.exchange.coinbase.com")
    // ("Access-Control-Allow-Origin",{
    // // mis problemas con cors
    //   cors: {
    //     origin: "http://localhost:3000",
    //     methods: ["GET", "POST"]
    //   }
    // });

    // forma 2
    // socket = io.connect("wss://ws-feed.exchange.coinbase.com")

    // forma 3
    socket.on("connect", () => {
      console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    });

  //////////////
  // API REQUEST
  //////////////
  const apiCall = async ()=> {

    // seteamos la primera petición al webSocket

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

    // ordenar por nombre el array filtrado de criptos
    filtered = filtered.sort((a, b) => {
      if( a.base_currency == b.base_currency ) { return 0; }
      else return ( a.base_currency > b.base_currency ? 1 : -1 )
    });

    // console.log(filtered)
    setCurrencies(filtered);
    
    // evitar la conexion al socket si no hay un fetch previo
    flag.current = true;
  };
  apiCall();

  },[]) // render en la primera carga


  useEffect(()=>{
    console.log("entra 2")

    // esto evita peticionar al socket si no hay fetch previo
    // if (!flag.current) {
    //   return;
    // }

    let jsonMsg = JSON.stringify(subMsg);
    // socket.on("message", jsonMsg);
    socket.emit(jsonMsg);
    // configuración principal del WebSocket
    // socket.on("connect", (data) => {
    //   console.log(`is my socket connected? +${socket.connected} \n the id is ${socket.id}`);
    //   console.log(data)
    // });
    
    //////////////////////
    // EXTRACT SOCKET DATA
    //////////////////////
    socket.on("connect", (e) => {
      let data = JSON.parse(e.data);
      setprice(data.price);

      // if (data.type !== "ticker") {
      //   return;
      // }

      // if (data.product_id === pair) {
      //   setprice(data.price);
      // }
    });

    // no tengo ni idea de qué hace esto
    // let historicalDataURL = `${url}/products/${pair}/candles?granularity=86400`;
    // const fetchHistoricalData = async () => {
    //   let dataArr = [];
    //   await fetch(historicalDataURL)
    //     .then((res) => res.json())
    //     .then((data) => (dataArr = data));
      
    //   let formattedData = formatData(dataArr);
    //   setpastData(formattedData);
    // };
    // fetchHistoricalData();





  },[currencies])

    
    // pedir suscripción al servidor






  // estto maneja el selector de criptos
  const handleSelect = (e) => {

    // pedir la baja del socket
    // let unSub = JSON.stringify(unSubMsg);
    // socket.send(unSub);

    // setPair cambiará el estado de pair y lanzará el useEffect para una nueva conexion
    setPair(e.target.value);
  };

    return (
      <div className="App">
        <Header/>
        <h1>`€{price}`</h1>

        <select name="currency" value={pair} onChange={handleSelect}>
          {currencies.map((e, i) => {
            return (
              <option key={i} value={e.id}>
                {e.display_name}
              </option>
            );
          })}
        </select>
        <Footer/>
      </div>
    );
  
}

export default App;
