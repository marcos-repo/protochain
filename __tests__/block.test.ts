import { describe, test, expect, beforeAll } from '@jest/globals';
import Block from '../src/lib/block';
import BlockInfo from '../src/lib/blockInfo';

describe('Block Tests', () =>{
    
    let genesis: Block;
    const DIFFICULTY = 0;
    const MINER = "miner";

    beforeAll(() => {
        genesis = new Block({
            data : "Genesis Block"
        } as Block);
        
    });

    test('Should be valid', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            data : "Bloco - Should be valid"
        } as Block);

        block.mine(DIFFICULTY, MINER);

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);

        expect(result.success).toBeTruthy();
    });

    test('Should create by blockinfo', () => {
        const block = Block.fromBlockInfo({
            index: 1,
            data: "Block - Should create by blockinfo",
            difficulty: 0,
            feePerTx: 1,
            maxDifficulty: 16,
            previousHash: genesis.hash
        } as BlockInfo);

        block.mine(DIFFICULTY, MINER);

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);

        expect(result.success).toBeTruthy();
    });

    test('Should NOT be valid(fallbacks)', () => {
        const block = new Block();

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(empty hash)', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            data : "Bloco - Should NOT be valid(empty hash)"
        } as Block);

        block.mine(DIFFICULTY, MINER);

        block.hash = "";
        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(previous hash)', () => {
        const block = new Block({
            index: 1,
            previousHash: "genesis.hash",
            data : "Bloco - Should NOT be valid(previous hash)"
        } as Block);

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(timestamp)', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            data : "Bloco - Should NOT be valid(timestamp)"
        } as Block);
        block.timestamp = -1;
        block.hash = block.getHash();
        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(hash)', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            data : "Bloco - Should NOT be valid(hash)"
        } as Block);

        block.hash = "";

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(data)', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
        } as Block);
        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);

        expect(result.success).toBeFalsy();
    });
})