import { describe, test, expect } from '@jest/globals';
import Transaction from '../src/lib/transaction';
import TransactionInput from '../src/lib/transactionInput';
import TransactionOutput from '../src/lib/transactionOutput';
import TransactionType from '../src/lib/transactionType';

jest.mock('../src/lib/transactionInput');
jest.mock('../src/lib/transactionOutput');

describe('Transaction Tests', () => {
    
    const DIFFICULTY = 1;
    const TOTAL_FEES = 1;

    test('Should be valid (REGULAR)', () => {
        
        const tx = new Transaction({
                txInputs : [new TransactionInput()],
                txOutputs: [new TransactionOutput()]
            } as Transaction);

        const result = tx.isValid(DIFFICULTY, TOTAL_FEES);

        expect(result.success).toBeTruthy();
    });

    test('Should NOT be valid (REGULAR empty)', () => {
        const tx = new Transaction();

        const result = tx.isValid(DIFFICULTY, TOTAL_FEES);

        expect(result.success).toBeFalsy();
    });

    test('Should be valid (REGULAR complete)', () => {
        const tx = new Transaction({
                type: TransactionType.REGULAR,
                txInputs : [new TransactionInput()],
                txOutputs: [new TransactionOutput()],
                timestamp: Date.now()
            } as Transaction);

        const result = tx.isValid(DIFFICULTY, TOTAL_FEES);
        expect(result.success).toBeTruthy();
    });


    test('Should be valid (FEE)', () => {
        const tx = new Transaction({
                txInputs : [new TransactionInput()],
                txOutputs: [new TransactionOutput()],
            } as Transaction);

        const result = tx.isValid(DIFFICULTY, TOTAL_FEES);

        expect(result.success).toBeTruthy();
    });

    test('Should NOT be valid (invalid hash)', () => {
        const tx = new Transaction({
                txInputs : [new TransactionInput()],
            } as Transaction);
        
        tx.hash = "abc";
        const result = tx.isValid(DIFFICULTY, TOTAL_FEES);

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid (invalid tx input)', () => {
        
        const txInput = new TransactionInput()
        txInput.amount = -10;

        const tx = new Transaction({
                txInputs : [new TransactionInput()],
                txOutputs: [new TransactionOutput()],
            } as Transaction);
        
        tx.txInputs![0].amount = -10;
        
        const result = tx.isValid(DIFFICULTY, TOTAL_FEES);
        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid (inputs amounts less than outputs)', () => {
        
        const txInput = new TransactionInput()
        txInput.amount = -10;

        const tx = new Transaction({
                txInputs : [new TransactionInput({
                    amount: 5
                } as TransactionInput)],
                txOutputs: [new TransactionOutput({
                    amount: 10
                } as TransactionOutput)],
            } as Transaction);
        
        const result = tx.isValid(DIFFICULTY, TOTAL_FEES);
        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid (Invalid TXO reference hash)', () => {
        
        const txInput = new TransactionInput()
        txInput.amount = -10;

        const tx = new Transaction({
                txInputs : [new TransactionInput({
                    amount: 10
                } as TransactionInput)],
                txOutputs: [new TransactionOutput({
                    amount: 10,
                } as TransactionOutput)],
            } as Transaction);
        
        tx.hash = tx.getHash();
        tx.txOutputs[0].tx = 'hash';

        const result = tx.isValid(DIFFICULTY, TOTAL_FEES);
        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid (Invalid tx reward)', () => {
        
        const tx = new Transaction({
                type: TransactionType.FEE,
                txInputs : [new TransactionInput({
                    amount: 10
                } as TransactionInput)],
                txOutputs: [new TransactionOutput({
                    amount: 632,
                } as TransactionOutput)],
            } as Transaction);

        const result = tx.isValid(DIFFICULTY, TOTAL_FEES);
        expect(result.success).toBeFalsy();
    });

    test('Should get FEE', () => {

        const tx = new Transaction({
            txInputs : [new TransactionInput({
                amount: 15
            } as TransactionInput)],
            txOutputs: [new TransactionOutput({
                amount: 10
            } as TransactionOutput)],
        } as Transaction);

        const fee = tx.getFee();

        expect(fee).toEqual(5);
    });

    test('Should get FEE(zero)', () => {

        const tx = new Transaction({
            txInputs : undefined,
            txOutputs: [] as TransactionOutput[]
        } as Transaction);

        const fee = tx.getFee();
        expect(fee).toEqual(0);
    });

    test('Should get from reward valid', () => {

        const tx = Transaction.fromReward(new TransactionOutput());
        const result = tx.isValid(DIFFICULTY, TOTAL_FEES);

        expect(result.success).toBeTruthy();
    });

    
})