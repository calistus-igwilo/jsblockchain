const SHA256 = require("crypto-js/sha256");

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}
class Block {
    constructor(timestamp, transactions, previousHash = "") {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previoushash = previousHash;
        this.hash = this.calculateHash();
        this.nounce = 0;
    }

    calculateHash() {
        // Use SHA256 cryptographic function to generate the hash of this block
        return SHA256(
            this.timestamp +
            this.previousHash +
            JSON.stringify(this.transactions) +
            this.nounce
        ).toString();
    }
    mineNewBlock(difficulty) {
        while (
            this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
        ) {
            this.nounce++;
            this.hash = this.calculateHash();
        }
        console.log("A new block was mined with hash " + this.hash);
    }
}

class Blockchain {
    constructor() {
        // the first variable of the array is the genesis block, created mannually
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3;
        this.pendingTransactions = [];
        this.miningReward = 10;
    }

    createGenesisBlock() {
        return new Block(0, "05/22/2022", "this is the genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(
            Date.now(),
            this.pendingTransactions,
            this.getLatestBlock().hash
        );
        block.mineNewBlock(this.difficulty);
        console.log("Block mined sucessfully");

        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward), //fromAddress is kept null for demo only. It should be the address to pay the miner
        ];
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance = balance - trans.amount;
                }
                if (trans.toAddress === address) {
                    balance = balance + trans.amount;
                }
            }
        }
        return balance;
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

let bittycoin = new Blockchain();

let transaction1 = new Transaction("tom", "jerry", 100);
bittycoin.createTransaction(transaction1);

let transaction2 = new Transaction("jerry", "tom", 30);
bittycoin.createTransaction(transaction2);

console.log("started mining by the miner");
bittycoin.minePendingTransactions("donald");

console.log("balance for tom is: " + bittycoin.getBalanceOfAddress("tom"));
console.log("balance for jerry is: " + bittycoin.getBalanceOfAddress("jerry"));
console.log(
    "balance of miner donald is: " + bittycoin.getBalanceOfAddress("donald")
);