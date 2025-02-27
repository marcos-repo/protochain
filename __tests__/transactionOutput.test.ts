import { describe, test, expect, beforeAll, jest } from '@jest/globals';
import TransactionOutput from '../src/lib/transactionOutput';
import Wallet from '../src/lib/wallet';

describe('Transaction Output Tests', () => {

    let alice: Wallet, bob: Wallet; 
    
    beforeAll(() => {
        alice = new Wallet();
        bob = new Wallet();
    });

    test('Should be valid', () => {
        
        const txOutput = new TransactionOutput({
            amount: 10,
            toAddress: alice.publicKey
        } as TransactionOutput);

        txOutput.getHash();

        const result = txOutput.isValid();
        expect(result.success).toBeTruthy();
    });

    test('Should NOT be valid', () => {
        
        const txOutput = new TransactionOutput();

        const result = txOutput.isValid();
        expect(result.success).toBeFalsy();
    });


})