
import express from 'express'
import morgan from 'morgan';
import Blockchain from '../lib/blockchain';
import Block from '../lib/block';

const PORT:number = 3000;
const app = express();

if(process.argv.includes("--run")) 
    app.use(morgan('tiny'));    

app.use(express.json());

const blockchain = new Blockchain();

app.get('/status', (req, res, next) => {
    res.json({
        numberOfBlocks: blockchain.blocks.length,
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

if(process.argv.includes("--run")) 
    app.listen(PORT, () => { console.log(`Blockchain server is listening at port ${PORT}`);}); 


export {
    app
};