import Transaction from '../transaction';
import Validation from '../validation';

export default class Block {

    index: number;
    timestamp: number;
    hash: string;
    previousHash: string; 
    transactions: Transaction[];
    miner: string;

    constructor(block?:  Block){
        this.index = block?.index || 0;
        this.timestamp = block?.timestamp || Date.now();
        this.previousHash = block?.previousHash || '';
        this.transactions = block?.transactions || [] as Transaction[];
        this.miner = block?.miner || 'miner';
        this.hash = block?.hash || this.getHash();
    }

    mine(difficulty: number, miner: string) {
        this.miner = this.miner;
    }

    getHash(): string {
        return this.hash || 'block-hash';
    }

   isValid(previousHash: string, previousIndex: number, difficulty: number, feePerTx: number) : Validation {
        if(!previousHash || previousIndex < 0 || this.index < 0 || feePerTx < 1)
            return new Validation(false, 'Invalid mock block');

        return new Validation();
    } 

}