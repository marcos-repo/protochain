import { describe, test, expect, beforeAll, jest } from '@jest/globals';
import Block from '../src/lib/block';
import BlockInfo from '../src/lib/blockInfo';
import Transaction from '../src/lib/transaction';
import TransactionType from '../src/lib/transactionType';
import TransactionInput from '../src/lib/transactionInput';

jest.mock('../src/lib/transaction');
jest.mock('../src/lib/transactionInput');


describe('Block Tests', () =>{
    
    let genesis: Block;
    const DIFFICULTY = 1;
    const MINER = "miner";

    beforeAll(() => {
        genesis = new Block({
            transactions: [new Transaction({
                txInput : new TransactionInput() 
            } as Transaction)]            
        } as Block);        
    });

    test('Should be valid', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            transactions: [new Transaction({
                txInput : new TransactionInput(),
                to: "wallet"
            } as Transaction)] 
        } as Block);

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: MINER
        } as Transaction));

        block.hash = block.getHash();

        block.mine(DIFFICULTY, MINER);

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);

        expect(result.success).toBeTruthy();
    });

    test('Should create from blockinfo', () => {
        const block = Block.fromBlockInfo({
            index: 1,
            transactions: [new Transaction({
                txInput : new TransactionInput(),
                to: "wallet"
            } as Transaction)],
            difficulty: 0,
            feePerTx: 1,
            maxDifficulty: 16,
            previousHash: genesis.hash
        } as BlockInfo);

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: MINER
        } as Transaction));

        block.hash = block.getHash();

        block.mine(DIFFICULTY, MINER);

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);

        expect(result.success).toBeTruthy();
    });

    test('Should NOT be valid(fallbacks)', () => {
        const block = new Block();

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: MINER
        } as Transaction));
        
        block.hash = block.getHash();

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(empty hash)', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            transactions: [new Transaction({
                txInput : new TransactionInput()  
            } as Transaction)],
        } as Block);

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: MINER
        } as Transaction));
        

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
                txInput : new TransactionInput()  
            } as Transaction)],
        } as Block);

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: MINER
        } as Transaction));
        
        block.hash = block.getHash();

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(timestamp)', () => {
        const block = new Block({
            index: 1,
            timestamp: -1,
            previousHash: genesis.hash,
            transactions: [new Transaction({
                txInput : new TransactionInput(),
                to: "wallet"
            } as Transaction)],
        } as Block);
        
        block.timestamp = -1;

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: MINER
        } as Transaction));
        
        block.hash = block.getHash();

        block.mine(DIFFICULTY, MINER);

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(previousHash)', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            transactions: [new Transaction({
                txInput : new TransactionInput(),
                to: "wallet"
            } as Transaction)],
        } as Block);

        block.previousHash = "";

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: MINER
        } as Transaction));
        
        block.mine(DIFFICULTY, MINER);

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(index)', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            transactions: [new Transaction({
                txInput : new TransactionInput(),
                to: "wallet"
            } as Transaction)],
        } as Block);

        block.index = -1;

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: MINER
        } as Transaction));
        
        block.mine(DIFFICULTY, MINER);

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(no mined)', () => {
        const block = new Block({
            index: 1,
            nonce: 0,
            miner: MINER,
            previousHash: genesis.hash,
            transactions: [new Transaction({
                txInput : new TransactionInput(),
                to: "wallet"
            } as Transaction)],
        } as Block);

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: MINER
        } as Transaction));

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(hash)', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            transactions: [new Transaction({
                txInput : new TransactionInput(),
                to: "wallet"
            } as Transaction)],
        } as Block);

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: MINER
        } as Transaction));

        block.mine(DIFFICULTY, MINER);
        block.hash = "hash";

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);
        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(tx input)', () => {
        
        const txInput = new TransactionInput();
        txInput.amount = -10;

        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            transactions: [new Transaction({
               txInput: txInput,
               to: "wallet"
            } as Transaction)],
        } as Block);

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: MINER
        } as Transaction));

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(duplicated fee transaction)', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            transactions: [new Transaction({
                txInput : new TransactionInput(),
                type: TransactionType.FEE
            } as Transaction),
            new Transaction({
                txInput : new TransactionInput(),
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

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: MINER
        } as Transaction));
        
        block.hash = block.getHash();

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);
        

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(no fee transaction)', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            transactions: [new Transaction()],
        } as Block);

        block.hash = block.getHash();

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);
        

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(different from miner)', () => {
        const block = new Block({
            index: 1,
            previousHash: genesis.hash,
            transactions: [new Transaction()],
        } as Block);

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            to: MINER
        } as Transaction));
        
        block.hash = block.getHash();

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY);

        expect(result.success).toBeFalsy();
    });

})