import { describe, test, expect, beforeAll } from '@jest/globals';
import Transaction from '../src/lib/transaction';
import TransactionType from '../src/lib/transactionType';
import TransactionInput from '../src/lib/transactionInput';

jest.mock('../src/lib/transactionInput');

describe('Transaction Tests', () =>{
    
    test('Should be valid (REGULAR)', () => {
        const tx = new Transaction({
                txInput : new TransactionInput(),
                to: "wallet"
            } as Transaction);

        const result = tx.isValid();

        expect(result.success).toBeTruthy();
    });

    test('Should NOT be valid (REGULAR empty)', () => {
        const tx = new Transaction();

        const result = tx.isValid();

        expect(result.success).toBeFalsy();
    });

    test('Should be valid (REGULAR complete)', () => {
        const tx = new Transaction({
                type: TransactionType.REGULAR,
                txInput : new TransactionInput(),
                to: "wallet",
                timestamp: Date.now()
            } as Transaction);

        const result = tx.isValid();
        expect(result.success).toBeTruthy();
    });


    test('Should be valid (FEE)', () => {
        const tx = new Transaction({
                txInput : new TransactionInput(),
                to: "wallet"
            } as Transaction);

        const result = tx.isValid();

        expect(result.success).toBeTruthy();
    });

    test('Should NOT be valid (invalid hash)', () => {
        const tx = new Transaction({
                txInput : new TransactionInput()
            } as Transaction);
        
        tx.hash = "abc";
        const result = tx.isValid();

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid (invalid tx input)', () => {
        
        const txInput = new TransactionInput()
        txInput.amount = -10;

        const tx = new Transaction({
                txInput : new TransactionInput(),
                to: "wallet"
            } as Transaction);
        
        tx.txInput.amount = -10;
        
        const result = tx.isValid();
        expect(result.success).toBeFalsy();
    });
})