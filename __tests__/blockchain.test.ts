import { describe, test, expect, jest } from '@jest/globals';
import Blockchain from '../src/lib/blockchain';
import Block from '../src/lib/block';
import Transaction from '../src/lib/transaction';
import TransactionInput from '../src/lib/transactionInput';
import Wallet from '../src/lib/wallet';
import TransactionOutput from '../src/lib/transactionOutput';

jest.mock('../src/lib/block');
jest.mock('../src/lib/transaction');
jest.mock('../src/lib/transactionInput');
jest.mock('../src/lib/transactionOutput');

describe('Blockchain Tests', () =>{
    
    let alice: Wallet;
    let bob: Wallet;

    beforeAll(() => {
        alice = new Wallet();
        bob = new Wallet();
    });

    test('Should has genesis block', () => {
        const blockchain = new Blockchain(alice.publicKey);
        expect(blockchain.blocks.length).toBeGreaterThan(0);
    });

    test('Should be valid(genesis)', () => {
        const blockchain = new Blockchain(alice.publicKey);
        expect(blockchain.isValid().success).toBeTruthy();
    });

    test('Should NOT be valid', () => {
        const blockchain = new Blockchain(alice.publicKey);
        const txInput = new TransactionInput();
        txInput.amount = -10; 
        
        const tx = new Transaction({
            txInputs : [new TransactionInput()]
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
        const blockchain = new Blockchain(alice.publicKey);
        blockchain.addBlock(new Block({
            index: 1,
            previousHash: blockchain.blocks[0].hash,
            transactions: [new Transaction({
                txInputs : [new TransactionInput()]
            } as Transaction)],
        } as Block))
        expect(blockchain.isValid().success).toEqual(true);
    });

    test('Should add block', () => {
        const blockchain = new Blockchain(alice.publicKey);
        const txInput = new TransactionInput();
        
        const tx = new Transaction({
            txInputs : [new TransactionInput()]
        } as Transaction);

        blockchain.mempool.push(tx);

        const result = blockchain.addBlock(new Block({
            index: 1,
            previousHash: blockchain.blocks[0].hash,
            transactions: [tx],
        } as Block));
        
        expect(result.success).toBeTruthy();
    });

    test('Should get block', () => {
        const blockchain = new Blockchain(alice.publicKey);
        const result = blockchain.getBlock(blockchain.blocks[0].hash);
        expect(result).toBeTruthy();
    });

    test('Should NOT add block', () => {
        const blockchain = new Blockchain(alice.publicKey);
        
        const tx = new Transaction({
            txInputs : [new TransactionInput()]
        } as Transaction);

        blockchain.mempool.push(tx);

        const result = blockchain.addBlock(new Block({
            index: -1,
            previousHash: blockchain.getLastBlock().hash,
            transactions: [new Transaction({
                txInputs : [new TransactionInput()]
            } as Transaction)],
        } as Block));

        expect(result.success).toEqual(false);
    });

    test('Should NOT add block(Invalid transaction in Block -> mempool)', () => {
        const blockchain = new Blockchain(alice.publicKey);
        
        const tx = new Transaction({
            timestamp: -1,
            hash: "error-hash",
            txInputs : [new TransactionInput()]
        } as Transaction);

        blockchain.mempool.push(tx);

        const result = blockchain.addBlock(new Block({
            previousHash: blockchain.getLastBlock().hash,
            transactions: [new Transaction({
                txInputs : [new TransactionInput()]
            } as Transaction)],
        } as Block));

        expect(result.success).toEqual(false);
    });

    test('Should get next block info', () => {
        const blockchain = new Blockchain(alice.publicKey);
        blockchain.mempool.push(new Transaction());
        const info = blockchain.getNextBlock();
        expect(info ? info.index : 0).toEqual(1);
    });

    test('Should NOT get next block info', () => {
        const blockchain = new Blockchain(alice.publicKey);
        const info = blockchain.getNextBlock();
        expect(info).toBeNull();
    });

    test('Should add transaction', () => {
        const blockchain = new Blockchain(alice.publicKey);
        const txo = blockchain.blocks[0].transactions[0];

        const tx = new Transaction();
        tx.hash = 'hash';
        tx.txInputs = [
            new TransactionInput({
                amount: 10,
                previousTx: txo.hash,
                fromAddress: alice.publicKey,
                signature: 'signature'
            } as TransactionInput)
        ];

        tx.txOutputs = [new TransactionOutput({
            amount: 10,
            toAddress: 'toAddress'
        } as TransactionOutput)]

        const result = blockchain.addTransaction(tx);
        expect(result.success).toBeTruthy()
    });

    test('Should NOT add transaction(pending transaction)', () => {
        const blockchain = new Blockchain(alice.publicKey);
        
        const tx1 = new Transaction({
            txInputs : [new TransactionInput({
                fromAddress: alice.publicKey
            } as TransactionInput)],
            txOutputs: [new TransactionOutput()],
            hash: 'hash'
        } as Transaction);

        blockchain.mempool.push(tx1);

        const tx2 = new Transaction({
            txInputs : [new TransactionInput({
                fromAddress: alice.publicKey
            } as TransactionInput)],
            txOutputs: [new TransactionOutput()],
            hash: "hash"
        } as Transaction);

        const result = blockchain.addTransaction(tx2);
        expect(result.success).toBeFalsy()
    });
    /////////////////////////////////////////////////////////////////////
    test('Should NOT add transaction(TXO is already spent or unexistent)', () => {
        const blockchain = new Blockchain(alice.publicKey);
        
        const tx1 = new Transaction({
            txInputs : [new TransactionInput()],
            txOutputs: [new TransactionOutput()],
        } as Transaction);

        const result = blockchain.addTransaction(tx1);
        
        expect(result.success).toBeFalsy()
    });
    /////////////////////////////////////////////////////////////////////
    
    test('Should NOT add transaction(invalid transaction)', () => {
        const blockchain = new Blockchain(alice.publicKey);

        const tx = new Transaction({
            timestamp: -1,
            txInputs:  [] as TransactionInput[]
        } as Transaction);

        const result = blockchain.addTransaction(tx);
        expect(result.success).toBeFalsy()
    });

    test('Should NOT add transaction(duplicated in block)', () => {
        const blockchain = new Blockchain(alice.publicKey);

        const tx = new Transaction({
            txInputs:  [] as TransactionInput[],
            hash: "xyz"
        } as Transaction);

        blockchain.blocks.push(new Block({
            transactions: [tx]
        } as Block));

        const result = blockchain.addTransaction(tx);

        expect(result.success).toBeFalsy()
    });

    test('Should get transaction(mempool)', () => {
        const blockchain = new Blockchain(alice.publicKey);

        const tx = new Transaction({
            txInputs : [new TransactionInput()],
            hash: "xyz"
        } as Transaction);

        blockchain.mempool.push(tx);

        const result = blockchain.getTransaction("xyz");
        expect(result.mempoolIndex).toBeGreaterThan(-1);
    });

    test('Should get transaction(block)', () => {
        const blockchain = new Blockchain(alice.publicKey);

        const tx = new Transaction({
            txInputs : [new TransactionInput()],
            hash: "xyz"
        } as Transaction);

        blockchain.blocks.push(new Block({
            transactions: [tx]
        } as Block));

        const result = blockchain.getTransaction("xyz");
        expect(result.blockIndex).toBeGreaterThan(-1);
    });

    test('Should NOT get transaction', () => {
        const blockchain = new Blockchain(alice.publicKey);

        const tx = new Transaction({
            txInputs : [new TransactionInput()],
            hash: "xyz"
        } as Transaction);

        blockchain.blocks.push(new Block({
            transactions: [tx]
        } as Block));

        const result = blockchain.getTransaction("abc");
        expect(result.mempoolIndex).toEqual(-1);
        expect(result.blockIndex).toEqual(-1);
    });

    test('Should get utxo', () => {
        const blockchain = new Blockchain(alice.publicKey);
        const tx = new Transaction({
            txInputs : [new TransactionInput({
                fromAddress: alice.publicKey,
                amount: 10
            } as TransactionInput)],
            txOutputs: [new TransactionOutput({
                toAddress: alice.publicKey,
                amount: 10
            } as TransactionOutput)]
        } as Transaction);

        blockchain.blocks.push(new Block({
            index: 1,
            previousHash: blockchain.blocks[0].hash,
            transactions: [tx,tx,tx],
        } as Block));

        const result = blockchain.getUtxo(alice.publicKey);
        expect(result.length).toBeGreaterThan(0);
    });

    test('Should get utxo(there is no txInputs)', () => {
        const blockchain = new Blockchain(alice.publicKey);


        const result = blockchain.getUtxo(bob.publicKey);
        expect(result.length).toBe(0);
    });

    test('Should get balance', () => {
        const blockchain = new Blockchain(alice.publicKey);

        const result = blockchain.getBalance(alice.publicKey);
        expect(result).toEqual(630);
    });

    test('Should get balance (zero)', () => {
        const blockchain = new Blockchain(alice.publicKey);

        const result = blockchain.getBalance(bob.publicKey);
        expect(result).toEqual(0);
    });

})