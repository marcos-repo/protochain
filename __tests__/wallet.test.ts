import { describe, test, expect, beforeAll, jest } from '@jest/globals';
import Block from '../src/lib/block';
import BlockInfo from '../src/lib/blockInfo';
import Transaction from '../src/lib/transaction';
import TransactionType from '../src/lib/transactionType';
import TransactionInput from '../src/lib/transactionInput';

import Wallet from '../src/lib/wallet';

describe('Wallet Tests', () =>{

    let alice: Wallet;
        
    beforeAll(() => {
        alice = new Wallet();
    });

    test('Should generate wallet', () => {
        
        const wallet = new Wallet();
       
        expect(wallet.privateKey).toBeTruthy();
        expect(wallet.publicKey).toBeTruthy();

    });

    test('Should recover wallet - Private Key', () => {
        
        const wallet = new Wallet(alice.privateKey);
       
        expect(wallet.privateKey).toEqual(alice.privateKey);
    });

    test('Should recover wallet - WIF', () => {
        
        const wallet = new Wallet("5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ");
       
        expect(wallet.privateKey).toEqual("0c28fca386c7a227600b2fe50b7cae11ec86d3bf1fbe471be89827e19d72aa1d");
    });

})