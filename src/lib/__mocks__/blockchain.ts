import Block from "./block";
import Validation from "../validation";
import BlockInfo from "../blockInfo";


/**
 * Blockchain mock class
 */
export default class Blockchain {
    blocks: Block[];
    nextIndex: number = 0;
    /**
     * Creates a new mock Blockchain
     */
    constructor(){
        this.blocks = [new Block({
            index: 0, 
            hash: 'abc',
            data: "Genesis Block",
            timestamp: Date.now()
        } as Block)];
        this.nextIndex++;
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
        const data = new Date().toString();
        const difficulty = 0;
        const previousHash = this.getLastBlock().hash;
        const index = this.blocks.length;
        const feePerTx = this.getFeePerTx();
        const maxDifficulty = 62;

        return {
            data,
            difficulty,
            previousHash,
            index,
            feePerTx,
            maxDifficulty
        } as BlockInfo;
    }
}
