import { describe, test, expect, beforeAll, jest } from '@jest/globals';
import TransactionInput from '../src/lib/transactionInput';
import Wallet from '../src/lib/wallet';

describe('Transaction Input Tests', () => {

    let alice: Wallet, bob: Wallet; 
    
    beforeAll(() => {
        alice = new Wallet();
        bob = new Wallet();
    });

    test('Should be valid', () => {
        
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: alice.publicKey,
            previousTx: 'previousTx'
        } as TransactionInput);

        txInput.sign(alice.privateKey);

        const result = txInput.isValid();
        expect(result.success).toBeTruthy();

    });

    test('Should NOT be valid(defaults)', () => {
        
        const txInput = new TransactionInput();

        txInput.sign(alice.privateKey);

        const result = txInput.isValid();
        expect(result.success).toBeFalsy();

    });

    test('Should NOT be valid(signature required)', () => {
        
        const txInput = new TransactionInput({
            amount: 10
        } as TransactionInput);

        const result = txInput.isValid();
        expect(result.success).toBeFalsy();

    });

    test('Should NOT be valid(invalid signature)', () => {
        
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: bob.publicKey,
            previousTx: 'previousTx'
        } as TransactionInput);

        txInput.sign(alice.privateKey);

        const result = txInput.isValid();
        expect(result.success).toBeFalsy();

    });

    test('Should NOT be valid(invalid amount)', () => {
        
        const txInput = new TransactionInput({
            amount: -1,
            fromAddress: bob.publicKey
        } as TransactionInput);

        txInput.previousTx = "previousTx";
        txInput.sign(alice.privateKey);

        const result = txInput.isValid();
        expect(result.success).toBeFalsy();

    });

})