import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import readline from 'readline';
import Wallet from "../lib/wallet";
import { read } from 'fs';
import Transaction from '../lib/transaction';
import TransactionType from '../lib/transactionType';
import TransactionInput from '../lib/transactionInput';

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER;

let myPrivateWallet = "";
let myPublicWallet = "";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


function menu(){
    setTimeout(() => {
        
        console.clear();

        if(myPublicWallet)
            console.log(`You are logged as ${myPublicWallet}`);
        else
        console.log("You aren't logged");

        console.log('');
        console.log('|----------------------------|');
        console.log('| 1 - Create Wallet          |');
        console.log('| 2 - Recover Wallet         |');
        console.log('| 3 - Balance                |');
        console.log('| 4 - Send Transaction       |');
        console.log('| 5 - Search Transaction     |');
        console.log('| 6 - Logout                 |');
        console.log('|----------------------------|');
        console.log('');

        rl.question('Choose one option: ', (answer) => {
            switch (answer) {
                case "1": createWallet(); break;
                case "2": recoverWallet(); break;
                case "3": getBalance(); break;
                case "4": sendTransaction(); break;
                case "5": searchTransaction(); break;
                case "6": logOut(); break;
                default:{
                    console.log('Wrong option.');
                    menu();
                    break;
                }
                    
            }
        });


    }, 1000);
}

function preMenu() {
    console.log();
    rl.question('Press any key to continue...', ()=>{
        menu();
    })
}

function createWallet(){
    console.clear();
    const wallet = new Wallet();
    console.log('Your new wallet:')
    console.log();
    console.log(wallet);

    myPublicWallet = wallet.publicKey;
    myPrivateWallet = wallet.privateKey;

    preMenu();
}

function recoverWallet() {
    console.clear();

    rl.question('Input your private key or WIF ', (answer)=>{
        const wallet = new Wallet(answer);

        console.log('Your wallet:')
        console.log();
        console.log(wallet);

        myPublicWallet = wallet.publicKey;
        myPrivateWallet = wallet.privateKey;
        preMenu();
    });

    
}

function getBalance() {
    console.clear();
    console.log();

    if(!myPublicWallet){
        console.log("You don't have a wallet yet.");
        return preMenu();
    }
        

    preMenu();
}

function sendTransaction() {
    console.clear();
    console.log();

    if(!myPublicWallet){
        console.log("You don't have a wallet yet.");
        return preMenu();
    }
    
    console.log(`Your wallet is ${myPublicWallet}`);
    console.log();

    rl.question('Input to wallet: ', (to) => {
        if(to.length < 66) {
            console.log('Invalid wallet address.');
            return preMenu();
        }

        rl.question('Input amount: ', async (amountStr) => {
            const amount = parseInt(amountStr);
            if(!amount){
                console.log('Invalid amount.');
                return preMenu();
            }

            const tx = new Transaction();
            tx.to = to;
            tx.type = TransactionType.REGULAR;
            tx.timestamp = Date.now();
            tx.txInput = new TransactionInput({
                amount,
                fromAddress: myPublicWallet,

            } as TransactionInput);

            tx.txInput.sign(myPrivateWallet);
            tx.hash = tx.getHash();

            try {
                const response = await axios.post(`${BLOCKCHAIN_SERVER}/transactions/`, tx);
                console.log('Transaction accepted in mempool. Waiting miners.');
                console.log(response.data.hash);

            } catch (error: any) {
                console.error(error.response ? error.response.data : error.message);
            }

            preMenu();
        });
    });

    preMenu();
}

function searchTransaction() {
    console.clear();
    console.log();

    rl.question('Input your tx hash ', async (hash) => {
        try {
            const response = await axios.get(`${BLOCKCHAIN_SERVER}/transactions/${hash}`);
            
            console.log(response.data);
    
        } catch (error: any) {
            console.error(error.response ? error.response.data : error.message);
        }
    });    

    preMenu();
}

function logOut(){
    console.clear();
    console.log();

    myPublicWallet = '';
    myPrivateWallet = '';

    preMenu();
}

menu();