 ## Websockets criptodashboard

Este daschboard se nutre principalmente de un websocket feed del que rescata la cotización en tiempo real de la cripto deseada, así como una API de la que extrae el los datos históricos de su cotización.

[Coinbase Websocket page](https://docs.cloud.coinbase.com/exchange/docs/websocket-overview).
wss://ws-feed.exchange.coinbase.com

A esta conexión hay que acompañarle un mensaje que confirme la suscripción al WS.

[Coinbase product candles](https://docs.cloud.coinbase.com/exchange/reference/exchangerestapi_getproductcandles).
https://api.exchange.coinbase.com/products/{product_id}/candles

A esta url hay que sustituir {product_id} por el producto a pedir 