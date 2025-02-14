import { describe, test, expect, jest } from '@jest/globals';
import Blockchain from '../src/lib/blockchain';
import Block from '../src/lib/block';
import Transaction from '../src/lib/transaction';
import TransactionInput from '../src/lib/transactionInput';

jest.mock('../src/lib/block');
jest.mock('../src/lib/transaction');
jest.mock('../src/lib/transactionInput');

describe('Blockchain Tests', () =>{
    
    test('Should has genesis block', () => {
        const blockchain = new Blockchain();
        expect(blockchain.blocks.length).toBeGreaterThan(0);
    });

    test('Should be valid(genesis)', () => {
        const blockchain = new Blockchain();
        expect(blockchain.isValid().success).toBeTruthy();
    });

    test('Should NOT be valid', () => {
        const blockchain = new Blockchain();
        const txInput = new TransactionInput();
        txInput.amount = -10; 
        
        const tx = new Transaction({
            txInput : new TransactionInput()
        } as Transaction);

        blockchain.mempool.push(tx);

        blockchain.addBlock(new Block({
            index: 1,
            previousHash: blockchain.blocks[0].hash,
            transactions: [tx],
        } as Block));

        blockchain.blocks[1].index = -1;

        expect(blockchain.isValid().success).toEqual(false);
    });

    test('Should be valid(two blocks)', () => {
        const blockchain = new Blockchain();
        blockchain.addBlock(new Block({
            index: 1,
            previousHash: blockchain.blocks[0].hash,
            transactions: [new Transaction({
                txInput : new TransactionInput()
            } as Transaction)],
        } as Block))
        expect(blockchain.isValid().success).toEqual(true);
    });

    test('Should add block', () => {
        const blockchain = new Blockchain();
        const result = blockchain.addBlock(new Block({
            index: 1,
            previousHash: blockchain.getLastBlock().hash,
            transactions: [new Transaction({
                txInput : new TransactionInput()
            } as Transaction)],
        } as Block));

        expect(result).toBeTruthy();
    });

    test('Should get block', () => {
        const blockchain = new Blockchain();
        const result = blockchain.getBlock(blockchain.blocks[0].hash);
        expect(result).toBeTruthy();
    });

    test('Should NOT add block', () => {
        const blockchain = new Blockchain();
        const result = blockchain.addBlock(new Block({
            index: -1,
            previousHash: blockchain.getLastBlock().hash,
            transactions: [new Transaction({
                txInput : new TransactionInput()
            } as Transaction)],
        } as Block));

        expect(result.success).toEqual(false);
    });

    test('Should get next block info', () => {
        const blockchain = new Blockchain();
        blockchain.mempool.push(new Transaction());
        const info = blockchain.getNextBlock();
        expect(info ? info.index : 0).toEqual(1);
    });

    test('Should NOT get next block info', () => {
        const blockchain = new Blockchain();
        const info = blockchain.getNextBlock();
        expect(info).toBeNull();
    });

    test('Should add transaction', () => {
        const blockchain = new Blockchain();

        const tx = new Transaction({
            txInput : new TransactionInput(),
            to: "wallet",
            hash: "hash"
        } as Transaction);

        const result = blockchain.addTransaction(tx);
        expect(result.success).toBeTruthy()
    });

    test('Should NOT add transaction', () => {
        const blockchain = new Blockchain();

        const tx = new Transaction({
       
        } as Transaction);

        const validation = blockchain.addTransaction(tx);

        expect(validation.success).toBeFalsy()
    });

    test('Should NOT add transaction(duplicated in block)', () => {
        const blockchain = new Blockchain();

        const tx = new Transaction({
            txInput : new TransactionInput(),
            hash: "xyz",
            to: "wallet"
        } as Transaction);

        blockchain.blocks.push(new Block({
            transactions: [tx]
        } as Block));

        const validation = blockchain.addTransaction(tx);

        expect(validation.success).toBeFalsy()
    });

    test('Should NOT add transaction(duplicated in mempool)', () => {
        const blockchain = new Blockchain();

        const tx = new Transaction({
            txInput : new TransactionInput(),
            hash: "xyz",
            to: "wallet"
        } as Transaction);

        blockchain.mempool.push(tx);

        const result = blockchain.addTransaction(tx);
        expect(result.success).toBeFalsy()
    });

    test('Should get transaction(mempool)', () => {
        const blockchain = new Blockchain();

        const tx = new Transaction({
            txInput : new TransactionInput(),
            hash: "xyz"
        } as Transaction);

        blockchain.mempool.push(tx);

        const result = blockchain.getTransaction("xyz");
        expect(result.mempoolIndex).toBeGreaterThan(-1);
    });

    test('Should get transaction(block)', () => {
        const blockchain = new Blockchain();

        const tx = new Transaction({
            txInput : new TransactionInput(),
            hash: "xyz"
        } as Transaction);

        blockchain.blocks.push(new Block({
            transactions: [tx]
        } as Block));

        const result = blockchain.getTransaction("xyz");
        expect(result.blockIndex).toBeGreaterThan(-1);
    });

    test('Should NOT get transaction', () => {
        const blockchain = new Blockchain();

        const tx = new Transaction({
            txInput : new TransactionInput(),
            hash: "xyz"
        } as Transaction);

        blockchain.blocks.push(new Block({
            transactions: [tx]
        } as Block));

        const result = blockchain.getTransaction("abc");
        expect(result.mempoolIndex).toEqual(-1);
        expect(result.blockIndex).toEqual(-1);
    });

})