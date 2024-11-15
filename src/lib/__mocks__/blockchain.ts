import Block from "./block";
import Validation from "../validation";
import BlockInfo from "../blockInfo";
import Transaction from "../transaction";
import TransactionType from "../transactionType";
import TransactionSearch from "../transactionSearch";


export default class Blockchain {
    blocks: Block[];
    mempool: Transaction[];
    nextIndex: number = 0;

    constructor(){
        this.blocks = [new Block({
            index: 0, 
            hash: 'abc',
            transactions: 
            [new Transaction({
                data :"Genesis Block",
                type: TransactionType.FEE
            } as Transaction)],
            timestamp: Date.now()
        } as Block)];
        this.nextIndex++;

        this.mempool = [new Transaction({
            data:"tx1",
            hash: "abc",
            type: TransactionType.REGULAR
        } as Transaction),
        new Transaction({
            data :"tx2",
            hash: "xyz",
            type: TransactionType.REGULAR
        } as Transaction)]
    }

    getLastBlock() : Block {
        return this.blocks[this.blocks.length - 1];
    }

    getBlock(hash: string) : Block | undefined{
        return this.blocks.find(x => x.hash === hash);
    }

    addBlock(block: Block) : Validation {
        if(block.index < 0)
            return new Validation(false, 'Invalid mock block')

        this.blocks.push(block);
        this.nextIndex++; 
        return new Validation();
    }

    isValid(): Validation {
        return new Validation();
    }

    getFeePerTx() : number {
        return 1;
    }

    getNextBlock() : BlockInfo {
        const transactions = [new Transaction({
            data : new Date().toString()
        } as Transaction)];
        const difficulty = 0;
        const previousHash = this.getLastBlock().hash;
        const index = this.blocks.length;
        const feePerTx = this.getFeePerTx();
        const maxDifficulty = 62;

        return {
            transactions,
            difficulty,
            previousHash,
            index,
            feePerTx,
            maxDifficulty
        } as BlockInfo;
    }

    getTransaction(hash: string) : TransactionSearch {

        this.mempool[0].hash = "mempool";
        const mempoolIndex = this.mempool.findIndex(tx => tx.hash === hash);
        if(mempoolIndex !== -1)
            return {
                mempoolIndex: mempoolIndex,
                transaction: this.mempool[mempoolIndex]
         } as TransactionSearch;

        this.blocks[0].transactions[0].hash = "blocks";
        const blockIndex = this.blocks.findIndex(b => b.transactions.some(tx => tx.hash === hash));
        if(blockIndex !== -1)
            return {
                blockIndex: blockIndex,
                transaction: this.blocks[blockIndex].transactions.find(tx => tx.hash)
         } as TransactionSearch;

         return {mempoolIndex: -1, blockIndex: -1} as TransactionSearch
    }

    addTransaction(transaction: Transaction) : Validation {
        
        if(transaction.data === "") return new Validation(false, "Invalid data");
        
        this.mempool.push(transaction);
        
        return new Validation(true, transaction.hash);
    }
}
