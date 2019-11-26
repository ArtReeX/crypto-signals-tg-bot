"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Scaler {
    constructor(array) {
        this.array = array;
        this.min = Math.min(...this.array.flat(Infinity));
        this.max = Math.max(...this.array.flat(Infinity));
    }
    normalized1d() {
        return this.array.map((value) => (value - this.min) / (this.max - this.min));
    }
    normalized2d() {
        return this.array.map((depthOne) => depthOne.map((value) => (value - this.min) / (this.max - this.min)));
    }
    normalized3d() {
        return this.array.map((depthOne) => depthOne.map((depthTwo) => depthTwo.map((value) => (value - this.min) / (this.max - this.min))));
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