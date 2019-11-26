"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Scaler {
    constructor(array) {
        this.array = array;
        this.min = Math.min(...this.array.flat(Infinity));
        this.max = Math.max(...this.array.flat(Infinity));
    }
    normalize1d(array = this.array) {
        return array.map((value) => (value - this.min) / (this.max - this.min));
    }
    normalize2d(array = this.array) {
        return array.map((depthOne) => depthOne.map((value) => (value - this.min) / (this.max - this.min)));
    }
    normalize3d(array = this.array) {
        return array.map((depthOne) => depthOne.map((depthTwo) => depthTwo.map((value) => (value - this.min) / (this.max - this.min))));
    }
    denormalize1d(array) {
        return array.map((value) => value * (this.max - this.min) + this.min);
    }
    denormalize2d(array) {
        return array.map((depthOne) => depthOne.map((value) => value * (this.max - this.min) + this.min));
    }
    denormalize3d(array) {
        return array.map((depthOne) => depthOne.map((depthTwo) => depthTwo.map((value) => value * (this.max - this.min) + this.min)));
    }
}
exports.default = Scaler;
//# sourceMappingURL=normalization.js.map