import { describe, test, expect, beforeAll, jest } from '@jest/globals';
import Block from '../src/lib/block';
import BlockInfo from '../src/lib/blockInfo';
import Transaction from '../src/lib/transaction';
import TransactionType from '../src/lib/transactionType';
import TransactionInput from '../src/lib/transactionInput';
import TransactionOutput from '../src/lib/transactionOutput';
import Wallet from '../src/lib/wallet';

jest.mock('../src/lib/transaction');
jest.mock('../src/lib/transactionInput');
jest.mock('../src/lib/transactionOutput');


describe('Block Tests', () =>{
    
    let genesis: Block;
    let alice: Wallet;
    let bob: Wallet;
    
    const DIFFICULTY = 1;
    const exampleTx = '4c28bf17482284e8cb56ba2abb56b5393a4795413f90bb4b952a9b3095ec3908';
    const exampleFee = 1;

    beforeAll(() => {
        alice = new Wallet();
        bob = new Wallet();

        genesis = new Block({
            transactions: [new Transaction({
                txInputs : [new TransactionInput()],
            } as Transaction)]            
        } as Block);        
    });

    function getFullBlock(): Block {
        const txIn = new TransactionInput({
            amount: 10,
            fromAddress: alice.publicKey,
            previousTx: exampleTx
        } as TransactionInput);

        txIn.sign(alice.privateKey);

        const txOut = new TransactionOutput({
            amount: 10,
            toAddress: bob.publicKey
        } as TransactionOutput);

        const tx = new Transaction({
            txInputs: [txIn],
            txOutputs: [txOut]
        } as Transaction);

        const txFee = new Transaction({
            type: TransactionType.FEE,
            txOutputs: [
                new TransactionOutput({
                    amount: 1,
                    toAddress: alice.publicKey
                } as TransactionOutput)
            ]
        } as Transaction);

        const block = new Block({
            index: 1,
            transactions: [
                tx,
                txFee
            ],
            previousHash: genesis.hash
        } as Block);

        block.mine(DIFFICULTY, alice.publicKey);

        return block;
    }

    test('Should be valid', () => {
        const block = getFullBlock();

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY, exampleFee);

        expect(result.success).toBeTruthy();
    });

    test('Should create from blockinfo', () => {
        const block = Block.fromBlockInfo({
            index: 1,
            transactions: [new Transaction({
                txInputs : [new TransactionInput()],
                txOutputs: [new TransactionOutput()],
            } as Transaction)],
            difficulty: 0,
            feePerTx: 1,
            maxDifficulty: 16,
            previousHash: genesis.hash
        } as BlockInfo);

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            txOutputs: [new TransactionOutput({
                toAddress: alice.publicKey
            } as TransactionOutput)],
        } as Transaction));

        block.hash = block.getHash();

        block.mine(DIFFICULTY, alice.publicKey);

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY, exampleFee);

        expect(result.success).toBeTruthy();
    });

    test('Should NOT be valid(fallbacks)', () => {
        const block = new Block();

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            txOutputs: [new TransactionOutput({
                toAddress: alice.publicKey
            } as TransactionOutput)],
        } as Transaction));
        
        block.hash = block.getHash();

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY, exampleFee);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(empty hash)', () => {
        const block = getFullBlock();

        block.hash = "";
        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY, exampleFee);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(previous hash)', () => {
        const block = getFullBlock();
        block.previousHash = "";

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY, exampleFee);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(timestamp)', () => {
        const block = getFullBlock();
        block.timestamp = -1;

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY, exampleFee);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(index)', () => {
        const block = getFullBlock();
        block.index = -1;

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY, exampleFee);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(no mined)', () => {
        const block = new Block({
            index: 1,
            nonce: 0,
            miner: alice.publicKey,
            previousHash: genesis.hash,
            transactions: [new Transaction({
                txInputs : [new TransactionInput()],
                txOutputs: [new TransactionOutput()],
            } as Transaction)],
        } as Block);

        block.transactions.push(new Transaction({
            type: TransactionType.FEE,
            txOutputs: [new TransactionOutput({
                toAddress: alice.publicKey
            } as TransactionOutput)],
        } as Transaction));

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY, exampleFee);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(hash)', () => {
        const block = getFullBlock();
        block.hash = "hash";

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY, exampleFee);
        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(invalid tx)', () => {
        
        const block = getFullBlock();
        block.transactions[0].timestamp = -1;
        
        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY, exampleFee);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(duplicated fee transaction)', () => {

        const block = getFullBlock();

        block.transactions.push(new Transaction({
            txInputs : [new TransactionInput()],
            type: TransactionType.FEE
        } as Transaction));

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY, exampleFee);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(invalid transaction)', () => {
        const block = getFullBlock();
        
        block.transactions.push(new Transaction({
            txInputs : [new TransactionInput({
                amount: -10
            } as TransactionInput)],
            type: TransactionType.FEE
        } as Transaction));

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY, exampleFee);
        
        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(no fee transaction)', () => {
        const block = getFullBlock();
        block.transactions[1].type = TransactionType.REGULAR;

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY, exampleFee);
        

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid(different from miner)', () => {
        const block = getFullBlock();
        block.transactions[1].txOutputs![0].toAddress = "";

        const result = block.isValid(genesis.hash, genesis.index, DIFFICULTY, exampleFee);

        expect(result.success).toBeFalsy();
    });

})