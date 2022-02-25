import React, { useState, useEffect, useRef } from 'react';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import { io } from "socket.io-client";


const App = () => {
  const [info, setInfo] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [pair, setPair] = useState("")

  const url = "https://api.pro.coinbase.com";
  let pairs = [];
  let flag = useRef(false);

  const socket ="";

  // informacion necesaria para la conexion al socket
  let subMsg = 
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

  let unSubMsg = {
    "type": "unsubscribe",
    "channels": ["heartbeat"]
  }
  
  useEffect(()=>{ // maneja la primera petición al servidor
    
    socket = io.connect("wss://ws-feed.pro.coinbase.com")("httpClient",{
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });
  // peticion a la api
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
    if (!flag.current) { return; };

    // configuración principal del WebSocket
    socket.on("connect", (data) => {
      console.log(`is my socket connected? +${socket.connected} \n the id is ${socket.id}`);
      console.log(data)
    });
    
    let jsonMsg = JSON.stringify(subMsg);
    // socket.on("message", jsonMsg);
    socket.send(jsonMsg);


    // no tengo ni idea de qué hace esto
    let historicalDataURL = `${url}/products/${pair}/candles?granularity=86400`;
    const fetchHistoricalData = async () => {
      let dataArr = [];
      await fetch(historicalDataURL)
        .then((res) => res.json())
        .then((data) => (dataArr = data));
      
      let formattedData = formatData(dataArr);
      setpastData(formattedData);
    };
    fetchHistoricalData();


    socket.on("message", (e) => {
      let data = JSON.parse(e.data);
      if (data.type !== "ticker") {
        return;
      }
      if (data.product_id === pair) {
        setprice(data.price);
      }
    });



  },[pair])

    
    // pedir suscripción al servidor






  // estto maneja el selector de criptos
  const handleSelect = (e) => {

    // pedir la baja del socket
    let unSub = JSON.stringify(unSubMsg);
    socket.send(unSub);

    // setPair cambiará el estado de pair y lanzará el useEffect para una nueva conexion
    setPair(e.target.value);
  };

    return (
      <div className="App">
        <Header/>
        <h1>¿Se ve?</h1>
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
