# crypto-signals-tg-bot

A bot for Telegram based on a neural network that displays signals for the purchase/sale of cryptocurrency.

## Options

### tensorflow

- **sequence** - interval for forecasting in the candlelight (after changing this parameter, it is necessary to retrain the network, for this you need to delete the "models" folder and run the application again)

- **epochs** - number of training iterations

```json
"tensorflow": {
    "sequence": 10,
    "epochs": 50
},
```

### telegram

- **token** - token bot
- **chat** - chat ID (api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getUpdates)

```json
"telegram": {
  "token": "1017355485:AAH2YMpsw6c-iTZhU8BEAabvduHSpQ2SvXE",
  "chat": -1001158670090
},
```

### directions

- **intervals** - tracking intervals

```json
"directions": {
    "BTCUSDT": {
      "intervals": ["1m", "5m"]
    },
    "ETHUSD": {
      "intervals": ["1d", "1w"]
    },
    ...
  }
},
```
