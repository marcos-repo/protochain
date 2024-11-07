import { describe, test, expect, beforeAll } from '@jest/globals';
import Transaction from '../src/lib/transaction';
import TransactionType from '../src/lib/transactionType';

describe('Transaction Tests', () =>{
    
    test('Should be valid (REGULAR)', () => {
        const tx = new Transaction({
                data : "Transaction - Should be valid (REGULAR)"  
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
                data : "Transaction - Should be valid (REGULAR complete)",
                timestamp: Date.now(),
                hash: "abc"
            } as Transaction);

        const result = tx.isValid();

        expect(result.success).toBeTruthy();
    });


    test('Should be valid (FEE)', () => {
        const tx = new Transaction({
                data : "Transaction - Should be valid (REGULAR)"  
            } as Transaction);

        const result = tx.isValid();

        expect(result.success).toBeTruthy();
    });

    test('Should NOT be valid (invalid hash)', () => {
        const tx = new Transaction({
                data : "Transaction - Should NOT be valid (invalid hash)"  
            } as Transaction);
        
        tx.hash = "abc";
        const result = tx.isValid();

        expect(result.success).toBeFalsy();
    });

    test('Should NOT be valid (invalid data)', () => {
        const tx = new Transaction({
                data : ""  
            } as Transaction);
        
        tx.hash = "abc";
        const result = tx.isValid();

        expect(result.success).toBeFalsy();
    });
})