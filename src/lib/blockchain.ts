import Block from "./block";
import Validation from "./validation";
import BlockInfo from "./blockInfo";


/**
 * Blockchain class
 */
export default class Blockchain {
    blocks: Block[];
    nextIndex: number = 0;
    static readonly DIFFICULTY_FACTOR = 5;
    static readonly MAX_DIFFICULTY = 62;

    /**
     * Creates a new Blockchain
     */
    constructor(){
        this.blocks = [new Block({index:this.nextIndex, data: "Genesis Block"} as Block)];
        this.nextIndex++;
    }

    getLastBlock() : Block {
        return this.blocks[this.blocks.length - 1];
    }

    getBlock(hash: string) : Block | undefined{
        return this.blocks.find(x => x.hash === hash);
    }

    addBlock(block: Block) : Validation {
        const lastBlock = this.getLastBlock();

        const result = block.isValid(lastBlock.hash, lastBlock.index, this.getDifficult());
        if(!result.success) return new Validation(false, `Invalid Block -> ${result.message}`);
        
        this.blocks.push(block);
        
        this.nextIndex++;
        return new Validation();
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

    getNextBlock() : BlockInfo {
        const data = new Date().toString();
        const difficulty = this.getDifficult();
        const previousHash = this.getLastBlock().hash;
        const index = this.blocks.length;
        const feePerTx = this.getFeePerTx();
        const maxDifficulty = Blockchain.MAX_DIFFICULTY;

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
