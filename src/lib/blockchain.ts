import Block from "./block";
import Validation from "./validation";
import BlockInfo from "./blockInfo";
import Transaction from "./transaction";
import TransactionType from "./transactionType";


export default class Blockchain {
    blocks: Block[];
    mempool: Transaction[];
    nextIndex: number = 0;
    static readonly TX_PER_BLOCK = 2;
    static readonly DIFFICULTY_FACTOR = 5;
    static readonly MAX_DIFFICULTY = 62;

    constructor(){
        this.mempool = [];
        this.blocks = [new Block(
            {
                index:this.nextIndex, 
                transactions: [new Transaction({
                    type: TransactionType.FEE,
                    data: new Date().toString()
                } as Transaction)]
            } as Block)];
        this.nextIndex++;
    }

    getLastBlock() : Block {
        return this.blocks[this.blocks.length - 1];
    }

    getBlock(hash: string) : Block | undefined{
        return this.blocks.find(x => x.hash === hash);
    }

    addTransaction(transaction: Transaction) : Validation {
        const validation = transaction.isValid();
        if(!validation.success) return new Validation(false, `Invalid TX -> ${validation.message}`);

        if(this.blocks.some(b => b.transactions.some(tx => tx.hash === transaction.hash)))
            return new Validation(false, "Duplicated TX -> Blockchain");

        if(this.mempool.some(tx => tx.hash === transaction.hash))
            return new Validation(false, "Duplicated TX -> Mempool");

        this.mempool.push(transaction);
        
        return new Validation(true, transaction.hash);
    }

    addBlock(block: Block) : Validation {
        const lastBlock = this.getLastBlock();

        const result = block.isValid(lastBlock.hash, lastBlock.index, this.getDifficult());
        if(!result.success) return new Validation(false, `Invalid Block -> ${result.message}`);
        
        const txs = block.transactions.filter(tx => tx.type !== TransactionType.FEE).map(tx => tx.hash);
        const newMempool = this.mempool.filter(tx => !txs.includes(tx.hash));

        if(newMempool.length + txs.length !== this.mempool.length)
            return new Validation(false, "Invalid transaction in Block -> mempool");

        this.mempool = newMempool;

        this.blocks.push(block);
        
        this.nextIndex++;
        return new Validation(true, block.hash);
    }

    getDifficult() {
        return Math.ceil(this.blocks.length / Blockchain.DIFFICULTY_FACTOR);
    }

    isValid(): Validation {
        for(let i = this.blocks.length -1; i > 0; i--) {
            const currentBlock = this.blocks[i];
            const previousBlock = this.blocks[i-1];
            const result = currentBlock.isValid(previousBlock.hash, previousBlock.index, this.getDifficult());
            if(!result.success) return new Validation(false, `Invalid Block #${currentBlock.index}: ${result.message}`);
        }

        return new Validation();
    }

    getFeePerTx() : number {
        return 1;
    }

    getNextBlock() : BlockInfo | null {
        
        const transactions = this.mempool.slice(0, Blockchain.TX_PER_BLOCK);

        if(!this.mempool || !this.mempool.length)
            return null;
        
        const difficulty = this.getDifficult();
        const previousHash = this.getLastBlock().hash;
        const index = this.blocks.length;
        const feePerTx = this.getFeePerTx();
        const maxDifficulty = Blockchain.MAX_DIFFICULTY;

        return {
            transactions,
            difficulty,
            previousHash,
            index,
            feePerTx,
            maxDifficulty
        } as BlockInfo;
    }
}
