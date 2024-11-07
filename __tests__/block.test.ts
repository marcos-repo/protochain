import { describe, test, expect, beforeAll, jest } from '@jest/globals';
import Block from '../src/lib/block';
import BlockInfo from '../src/lib/blockInfo';
import Transaction from '../src/lib/transaction';
import TransactionType from '../src/lib/transactionType';

jest.mock('../src/lib/transaction');


describe('Block Tests', () =>{
    
    let genesis: Block;
    const DIFFICULTY = 0;
    const MINER = "miner";

    beforeAll(() => {
        genesis = new Block({
            transactions: [new Transaction({
                data : "Genesis Block"  
            } as Transaction)]            
        } as Block);        
    });

    test('Should be valid', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            transactions: [new Transaction({
                data : "Block - Should be valid"  
            } as Transaction)] 
        } as Block);

        block.mine(DIFFICULTY, MINER);

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);

        expect(result.success).toBeTruthy();
    });

    test('Should create by blockinfo', () => {
        const block = Block.fromBlockInfo({
            index: 1,
            transactions: [new Transaction({
                data : "Block - Should create by blockinfo"  
            } as Transaction)],
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
            transactions: [new Transaction({
                data : "Block - Should NOT be valid(empty hash)"  
            } as Transaction)],
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
            transactions: [new Transaction({
                data : "Block - Should NOT be valid(previous hash)" 
            } as Transaction)],
        } as Block);

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(timestamp)', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            transactions: [new Transaction({
                data : "Block - Should NOT be valid(timestamp)"
            } as Transaction)],
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
            transactions: [new Transaction({
                data : "Block - Should NOT be valid(hash)"
            } as Transaction)],
        } as Block);

        block.hash = "";

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(transactions)', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            transactions: [new Transaction({
                data : ""
            } as Transaction)],
        } as Block);
        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(duplicated fee transaction)', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            transactions: [new Transaction({
                data : "FEE - 1",
                type: TransactionType.FEE
            } as Transaction),
            new Transaction({
                data : "FEE - 2",
                type: TransactionType.FEE
            } as Transaction)],
        } as Block);
        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(duplicated fee transaction)', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            transactions: [new Transaction({
                data : "FEE - 1",
                type: TransactionType.FEE
            } as Transaction),
            new Transaction({
                data : "FEE - 2",
                type: TransactionType.FEE
            } as Transaction)],
        } as Block);
        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(invalid transaction)', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            transactions: [new Transaction()],
        } as Block);
        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);

        expect(result.success).toBeFalsy();
    });

})