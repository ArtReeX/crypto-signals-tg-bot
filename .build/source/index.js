"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getHistory_1 = __importDefault(require("./getHistory"));
(async () => {
    console.log(await getHistory_1.default("BTCUSDT", "12h"));
})();
//# sourceMappingURL=index.js.map