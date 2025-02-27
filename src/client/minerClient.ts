import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import BlockInfo from '../lib/blockInfo';
import Block from '../lib/block';
import Wallet from '../lib/wallet';
import Transaction from '../lib/transaction';
import TransactionType from '../lib/transactionType';
import TransactionOutput from '../lib/transactionOutput';

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER;
const minerWallet = new Wallet(process.env.MINER_WALLET);

let totalMined = 0;

function getRewardTx() : Transaction {
    const txo = new TransactionOutput({
        toAddress: minerWallet.publicKey,
        amount: 10
    } as TransactionOutput);

    const tx = new Transaction({
        txOutputs: [txo],
        type: TransactionType.FEE
    } as Transaction);

    tx.hash = tx.getHash();
    tx.txOutputs[0].tx = tx.hash;

    return tx;
}

async function mine() {
    
    console.log('---------------------------------------------------------------');
    log('Getting new block info');

    const { data } = await axios.get(`${BLOCKCHAIN_SERVER}/block/next`);

    if(!data){
        log('No tx to mining. Waiting next...')
        return setTimeout(() => {
            mine();
         }, 5000);
    }

    const blockInfo = data as BlockInfo;
    const newBlock = Block.fromBlockInfo(blockInfo);

    newBlock.transactions.push(
        getRewardTx()
    );

    newBlock.miner = minerWallet.publicKey;
    newBlock.hash = newBlock.getHash();

    log("Start mining block " + blockInfo.index);
    newBlock.mine(blockInfo.difficulty, minerWallet.publicKey);

    log("Block mined! Send to Blockchain...");
    
    try {
        await axios.post(`${BLOCKCHAIN_SERVER}/block`, newBlock);

        log("Block sent and accepted.");
        totalMined++;

        log("Total mined blocks: " + totalMined);
    } catch (error: any) {
        console.error(error.response ? error.response.data : error.message);
    }

    setTimeout(() => {
       mine();
    }, 1000);
}

console.clear();
log("Logged as " + minerWallet.publicKey);
mine();

function log(message: string) {
    console.log(`${new Date().toLocaleString()} - ${message}`);
}