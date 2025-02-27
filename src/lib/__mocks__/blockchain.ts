import Block from './block';
import Validation from '../validation';
import BlockInfo from '../blockInfo';
import Transaction from '../transaction';
import TransactionType from '../transactionType';
import TransactionInput from './transactionInput';
import TransactionSearch from '../transactionSearch';


export default class Blockchain {
    blocks: Block[];
    mempool: Transaction[];
    nextIndex: number = 0;

    constructor(miner: string){
        this.blocks = [];
        this.mempool = [new Transaction()];

        this.blocks.push(new Block({
            index: 0,
            hash: '#hash#',
            previousHash: '',
            miner,
            timestamp: Date.now()
        } as Block));
    }

    getLastBlock() : Block {
        return this.blocks[this.blocks.length - 1];
    }

    getBlock(hash: string) : Block | undefined{
        if(!hash || hash === '-1')
                return undefined;

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
        return {
            transactions: this.mempool.slice(0, 2),
            difficulty: 1,
            previousHash: this.getLastBlock().hash,
            index: this.blocks.length,
            feePerTx: this.getFeePerTx(),
            maxDifficulty: 62
        } as BlockInfo;
    }

    getTransaction(hash: string) : TransactionSearch {
        if(hash === '-1')
            return {
                mempoolIndex: -1,
                blockIndex: -1
            } as TransactionSearch
        

        return {
            mempoolIndex: 0,
            transaction: new Transaction()
        } as TransactionSearch
    }

    addTransaction(transaction: Transaction) : Validation {
        
        if(!transaction.txInputs) return new Validation(false, 'Invalid data');
        
        this.mempool.push(transaction);
        
        return new Validation(true, transaction.hash);
    }
}
