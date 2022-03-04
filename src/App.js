import React, { useState, useEffect, useRef } from 'react';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import { io } from "socket.io-client";

const App = () => {
  const [info, setInfo] = useState("I don't know");
  const [currencies, setCurrencies] = useState([]);
  const [pair, setPair] = useState("");
  const [price, setprice] = useState("0.00");

  // así se setea la direccion a la que pedir el socket
  const socket = io("wss://ws-feed.exchange.coinbase.com");

  const url = "https://api.pro.coinbase.com";
  let first = useRef(false);
  let flag = useRef(false);
  let pairs = [];

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
            "product_ids": [pair]
        }
    ]
  };

  let unSubMsg = {
    "type": "unsubscribe",
    "channels": ["heartbeat"]
  }
  
  useEffect(()=>{ // maneja la primera petición al servidor
    
    console.log("entra 1");

    ////////////////////
    // SOCKET CONNECTION
    ////////////////////
    socket.on("connect", () => {
      console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    });

    //////////////
    // API REQUEST
    //////////////
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

    let jsonMsg = JSON.stringify(subMsg);
    // socket.on("message", jsonMsg);
    socket.emit(jsonMsg);
    
    
    //////////////////////
    // EXTRACT SOCKET DATA
    //////////////////////
    socket.on("connect", (e) => {
      let data = JSON.parse(e.data);
      console.log(data);
      // setprice(data.price);
      if (data.type !== "ticker") {
        return;
      }
      if (data.product_id === pair) {
        setprice(data.price);
      }
    });
    
    socket.on("connect", () => {
      console.log(socket.connected);
    });
    
    /////////////////////////////////////////////////////////////////////////////////////////
    // esto te trae la información anterior a la última cotización para alimientar la gráfica
    /////////////////////////////////////////////////////////////////////////////////////////

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

    /////////////////////////////////////////////////////////////////////////////////////////

    
    console.log(socket.connected); 
  },[pair])

  /////////////////
  // CRYPT SELECTOR
  /////////////////
  const handleSelect = (e) => {
    // pedir la baja del socket
    socket.emit(unSubMsg);

    // setPair cambiará el estado de pair y lanzará el useEffect para una nueva petición de criptos
    setPair(e.target.value);
  };
  /////////////////


  const handleAskForConnect = () => {
    setInfo(socket.connected ? "I'm connected": "I'm not connected") // true
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
        <button onClick={handleAskForConnect}>¿Estoy conectado?</button>
        <h2>{info}</h2>
        <Footer/>
      </div>
    );
  
}

export default App;
