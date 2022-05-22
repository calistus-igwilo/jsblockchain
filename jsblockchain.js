const SHA256 = require("crypto-js/sha256");

class Block {
    constructor(index, timestamp, data, previousHash = "") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previoushash = previousHash;
        this.hash = this.calculateHash;
    }

    calculateHash() {
        // Use SHA256 cryptographic function to generate the hash of this block
        return SHA256(
            this.index +
            this.timestamp +
            this.previousHash +
            JSON.stringify(this.data)
        ).toString();
    }
}

class Blockchain {
    constructor() {
        // the first variable of the array is the genesis block, created mannually
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, "05/22/2022", "this is the genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash; //get previous block hash
        newBlock.hash = newBlock.calculateHash(); //calculate current block hash
        this.chain.push(newBlock); //add new block to the blockchain
    }

    checkBlockChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

// create 2 new blocks
let block1 = new Block(1, "05/23/2022", { mybalance: 100 });
let block2 = new Block(2, "05/24/2022", { mybalance: 50 });

//create a new blockchain
let myBlockChain = new Blockchain();

//add the new blocks to the blockchain
myBlockChain.addBlock(block1);
myBlockChain.addBlock(block2);

console.log(JSON.stringify(myBlockChain, null, 4));
console.log(
    "Validation check for Block Chain before hacking: " +
    myBlockChain.checkBlockChainValid()
);

myBlockChain.chain[1].data = { mybalance: 5000 }; // a hacker changes data on the blockchain
console.log(
    "Validation check for Block Chain after hacking: " +
    myBlockChain.checkBlockChainValid()
);