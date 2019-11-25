"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const tf = __importStar(require("@tensorflow/tfjs-node"));
const exist = () => fs_1.default.existsSync("./model");
const save = async (model) => model.save("file://./model");
const load = () => tf.loadLayersModel("file://./model/model.json");
exports.default = { exist, load, save };
//# sourceMappingURL=images.js.map