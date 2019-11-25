# crypto-signals-tg-bot

A bot for Telegram based on a neural network that displays signals for the purchase/sale of cryptocurrency.

## Options

### tensorflow

- **sequence** - interval for forecasting (in the candlelight)
  > after changing this parameter, it is necessary to retrain the network, for this you need to delete the "models" folder and run the application again

```json
"tensorflow": {
    "sequence": 10
},
```

### directions

- **pair** - name of the pair to track
- **intervals** - tracking intervals

```json
"directions": [
    {
      "pair": "BTCUSDT",
      "intervals": ["1m, 5m"]
    },
    {
      "pair": "ETHUSDT",
      "intervals": ["1d, 1w"]
    },
    ...
  ]
},
```
