import { describe, test, expect, beforeAll } from '@jest/globals';
import Block from '../src/lib/block';

describe('Block Tests', () =>{
    
    let genesis: Block;

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
        const result = block.isValid(genesis.hash, genesis.index);

        expect(result.success).toBeTruthy();
    });

    test('Should NOT be valid(fallbacks)', () => {
        const block = new Block();

        const result = block.isValid(genesis.hash, genesis.index);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(hash)', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            data : "Bloco - Should NOT be valid(hash)"
        } as Block);

        block.hash = "";
        const result = block.isValid(genesis.hash, genesis.index);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(previous hash)', () => {
        const block = new Block({
            index: 1,
            previousHash: "genesis.hash",
            data : "Bloco - Should NOT be valid(previous hash)"
        } as Block);

        const result = block.isValid(genesis.hash, genesis.index);

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
        const result = block.isValid(genesis.hash, genesis.index);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(hash)', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            data : "Bloco - Should NOT be valid(hash)"
        } as Block);

        block.hash = "";

        const result = block.isValid(genesis.hash, genesis.index);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(data)', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
        } as Block);
        const result = block.isValid(genesis.hash, genesis.index);

        expect(result.success).toBeFalsy();
    });
})