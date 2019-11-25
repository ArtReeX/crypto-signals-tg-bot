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
const getConfig_1 = __importDefault(require("../getConfig"));
exports.default = async (samples, epochs = getConfig_1.default().tensorflow.epochs) => {
    const sizeTrain = samples.x.length * 0.7;
    const xTrain = tf.tensor3d(samples.x.slice(0, sizeTrain));
    const yTrain = tf.tensor2d(samples.y.slice(0, sizeTrain));
    const xTest = tf.tensor3d(samples.x.slice(sizeTrain, samples.x.length));
    const yTest = tf.tensor2d(samples.y.slice(sizeTrain, samples.y.length));
    const model = tf.sequential({
        layers: [
            tf.layers.lstm({
                inputShape: [samples.x[0][0].length, samples.x[0][0].length],
                units: samples.x[0].length * samples.x[0][0].length,
                returnSequences: true
            }),
            tf.layers.dropout({ rate: 0.2 }),
            tf.layers.lstm({
                units: samples.x[0].length * samples.x[0][0].length * 2,
                returnSequences: true
            }),
            tf.layers.dropout({ rate: 0.2 }),
            tf.layers.lstm({
                units: samples.x[0].length * samples.x[0][0].length,
                returnSequences: false
            }),
            tf.layers.dropout({ rate: 0.2 }),
            tf.layers.dense({ units: samples.x[0][0].length, activation: "linear" })
        ]
    });
    model.compile({
        optimizer: "adam",
        loss: tf.losses.meanSquaredError,
        metrics: tf.metrics.meanSquaredError
    });
    await model
        .fit(xTrain, yTrain, {
        epochs,
        shuffle: false,
        validationData: [xTest, yTest],
        callbacks: {
            onTrainBegin: () => console.log("Neural network training started."),
            onTrainEnd: () => console.log("Neural network training completed.")
        }
    })
        .then(async () => await saveModel(model))
        .catch(({ message }) => console.log(`Failed to train the neural network: ${message}`));
};
const saveModel = async (model) => await model
    .save("file://./model")
    .then(() => console.log("A snapshot of the neural network was successfully saved."))
    .catch(({ message }) => console.log(`Failed to save snapshot of neural network: ${message}`));
//# sourceMappingURL=train.js.map