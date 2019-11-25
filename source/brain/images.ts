import fs from "fs";
import * as tf from "@tensorflow/tfjs-node";
import { SaveResult } from "@tensorflow/tfjs-core/dist/io/io";

const exist = (): boolean => fs.existsSync("./model");

const save = async (model: tf.Sequential): Promise<SaveResult> =>
  model.save("file://./model");

const load = (): Promise<tf.LayersModel> =>
  tf.loadLayersModel("file://./model/model.json");

export default { exist, load, save };
