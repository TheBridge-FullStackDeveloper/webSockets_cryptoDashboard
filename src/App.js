import React, { useState, useEffect, useRef } from 'react';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import Dashboard from './components/dashboard/dashboard';

import processData from './utils/data.js';

const App = () => {
  const [pastData, setPastData] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [pair, setPair] = useState("");
  const [price, setprice] = useState("0.00");
  const url = "https://api.pro.coinbase.com";
  const ws = useRef(null);
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
  
  useEffect(()=>{ // pide datos a la api para alimentar la petición al socket
    ////////////////////
    // SOCKET SETUP ////
    ////////////////////
    ws.current = new WebSocket("wss://ws-feed.exchange.coinbase.com");

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


  useEffect(()=>{ // establece la conexión al socket siempre que haya una petición previa a la api
    // anula la petición si no hay fetch previo
    if (!flag.current) {
      return; 
    };

    ///////////////////////
    // SOCKET CONNECTION //
    ///////////////////////
    let jsonMsg = JSON.stringify(subMsg);
    ws.current.send(jsonMsg);
    
    //////////////////////
    // EXTRACT SOCKET DATA
    //////////////////////
    ws.current.onmessage = (e) => {
      let data = JSON.parse(e.data);

      if (data.type !== "ticker") {
        return;
      }
      if (data.product_id === pair) {
        setprice(data.price);
      }
    };
  
    /////////////////////////////////////////////////////////////////////////////////////////
    // esto te trae la información anterior a la última cotización para alimientar la gráfica
    /////////////////////////////////////////////////////////////////////////////////////////

    let historicalDataURL = `${url}/products/${pair}/candles?granularity=86400`;
    const fetchHistoricalData = async () => {
      let dataArr = [];
      await fetch(historicalDataURL)
        .then((res) => res.json())
        .then((data) => (dataArr = data));
    
      let formattedData = processData(dataArr);

      let dataTable = [
        {
          id: pair,
          data: formattedData
        }
      ]

      setPastData(dataTable);
    };
    fetchHistoricalData();

    /////////////////////////////////////////////////////////////////////////////////////////
  },[pair])
  
  ////////////////////
  // CRYPT SELECTOR //
  ////////////////////
  const handleSelect = (e) => {
    // pedir la baja del socket
    let jsonUnsub = JSON.stringify(unSubMsg);
    ws.current.send(jsonUnsub);
    // setPair cambiará el estado de pair y lanzará el useEffect para una nueva petición de criptos
    setPair(e.target.value);
  };
  
  const handleAskForConnect = () => {
    console.log(ws.current);// true
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
        <button onClick={handleAskForConnect}>Dame datos</button>
        <div style={{ height: 500 }}>
          <Dashboard value={pastData}/>
        </div>
        <Footer/>
      </div>
    );
};
export default App;
