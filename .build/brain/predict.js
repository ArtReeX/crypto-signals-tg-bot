"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tf = __importStar(require("@tensorflow/tfjs-node"));
const types_1 = require("./types");
const utilities_1 = require("./utilities");
const getConfig_1 = __importDefault(require("../getConfig"));
const normalization_1 = __importDefault(require("./normalization"));
exports.default = (model, candles) => {
    const candlesPart = candles
        .map(candle => utilities_1.toArray(candle))
        .slice(candles.length - getConfig_1.default().tensorflow.sequence + 1, candles.length);
    const scaler = new normalization_1.default(candlesPart);
    const result = model.predict(tf.tensor3d([scaler.normalized2d()])).arraySync();
    if (result[0][0] > result[0][1] &&
        result[0][0] > result[0][2] &&
        result[0][0] > result[0][3] &&
        result[0][0] > result[0][4]) {
        return types_1.Decision.ConfidentSale;
    }
    else if (result[0][1] > result[0][0] &&
        result[0][1] > result[0][2] &&
        result[0][1] > result[0][3] &&
        result[0][1] > result[0][4]) {
        return types_1.Decision.InsecureSale;
    }
    else if (result[0][3] > result[0][0] &&
        result[0][3] > result[0][1] &&
        result[0][3] > result[0][2] &&
        result[0][3] > result[0][4]) {
        return types_1.Decision.InsecurePurchase;
    }
    else if (result[0][4] > result[0][0] &&
        result[0][4] > result[0][1] &&
        result[0][4] > result[0][2] &&
        result[0][4] > result[0][3]) {
        return types_1.Decision.ConfidentPurchase;
    }
    return types_1.Decision.Neutral;
};
//# sourceMappingURL=predict.js.map