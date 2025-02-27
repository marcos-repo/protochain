import dotenv from 'dotenv';
dotenv.config();

import express, { NextFunction } from 'express'
import morgan from 'morgan';
import Blockchain from '../lib/blockchain';
import Block from '../lib/block';
import Transaction from '../lib/transaction';
import Wallet from '../lib/wallet';
import TransactionOutput from '../lib/transactionOutput';

/* c8 ignore next */
const PORT = process.env.BLOCKCHAIN_PORT || '3000';

const app = express();

/* c8 ignore next */
if(process.argv.includes('--run')) app.use(morgan('tiny'));    

app.use(express.json());

const wallet = new Wallet(process.env.BLOCKCHAIN_WALLET);

const blockchain = new Blockchain(wallet.publicKey);

app.get('/status', (req, res, next) => {
    res.json({
        mempool: blockchain.mempool.length,
        blocks: blockchain.blocks.length,
        valid: blockchain.isValid(),
        lastBlock: blockchain.getLastBlock()
    });
});

app.get('/blocks', (req, res, next) => {
    res.json(blockchain.blocks);
});

app.get('/block/next', (req, res, next) => {
    res.json(blockchain.getNextBlock());
});

app.get('/block/:indexOrHash', (req, res, next) => {
    const indexOrHash = req.params.indexOrHash;
    let block;

    if(/^[0-9]+$/.test(indexOrHash)){
        block = blockchain.blocks[parseInt(indexOrHash)];
    }
    else {
        block =  blockchain.getBlock(indexOrHash);
    }

    if(!block)
        res.sendStatus(404);
    else
        res.json(block);
});

app.post('/block', (req, res, next) => {
    if(!req.body.previousHash) {
        res.sendStatus(422); 
        return;
    }

    const block = new Block(req.body as Block);
    const validation = blockchain.addBlock(block);

    if(validation.success) {
        res.status(201).json(block);
    }
    else {
        res.status(400).json(validation);
    }
});

app.get('/transactions/:hash?', (req, res, next) => {
    if(req.params.hash){
        res.json(blockchain.getTransaction(req.params.hash));
    }
    else {
        res.json({
            size: blockchain.mempool.length,
            next: blockchain.mempool.slice(0, Blockchain.TX_PER_BLOCK)            
        });
    }
});

app.post('/transactions', (req, res, next) => {
    if(req.body.txInputs === undefined) {
        res.sendStatus(422); 
        return;
    }

    const transaction = new Transaction(req.body as Transaction);
    const validation = blockchain.addTransaction(transaction);

    if(validation.success) {
        res.status(201).json(transaction);
    }
    else {
        res.status(400).json(validation);
    }
});

app.get('/wallets/:wallet', (req, res, next) => {
    const wallet = req.params.wallet;

    res.json({
        balance: 10,
        fee: blockchain.getFeePerTx(),
        utxo: [new TransactionOutput({
            amount: 10,
            toAddress: wallet,
            tx: 'tx'
        } as TransactionOutput)]
    });
})

/* c8 ignore start */
if(process.argv.includes('--run')) 
    app.listen(PORT, () => { console.log(`Blockchain server is listening at port ${PORT}. \nWallet:${wallet.publicKey}`);}); 
/* c8 ignore stop */

export {
    app
};