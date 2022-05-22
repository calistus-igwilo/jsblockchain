const sha256 = require("crypto-js/sha256");

class Block {
    constructor(index, timestamp, data, previoushash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previoushash = previoushash;
        this.hash = this.calculateHash;

    }

    calculateHash() {
        // Use SHA256 cryptographic function to generate the hash of this block
        return SHA256(this.index + this.timestamp + this.previoushash + JSON.stringify(this.data).toString);
    }
}