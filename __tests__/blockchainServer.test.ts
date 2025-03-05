import request from 'supertest';
import {describe, expect, jest, test} from '@jest/globals';
import {app} from '../src/server/blockchainServer'
import Block from '../src/lib/block';
import Transaction from '../src/lib/transaction';
import TransactionInput from '../src/lib/transactionInput';
import TransactionOutput from '../src/lib/transactionOutput';

jest.mock('../src/lib/block');
jest.mock('../src/lib/blockchain');
jest.mock('../src/lib/transactionInput');
jest.mock('../src/lib/transactionOutput');

describe('Blockchain Server tests', () => {

    
    test('GET /status -> Should return blockchain status', async () => {
        const response = await request(app)
            .get('/status/');

        expect(response.status).toEqual(200);
        expect(response.body.valid.success).toBeTruthy();
    });

    test('GET /blocks/ - Should get all blocks', async () => {
        const response = await request(app)
            .get('/blocks/');

        expect(response.status).toEqual(200);
        expect(response.body).toBeTruthy();
    });

    test('GET /block/:index - Should get genesis block', async () => {
        const response = await request(app)
            .get('/block/0');

        expect(response.status).toEqual(200);
        expect(response.body.index).toEqual(0);
    });

    test('GET /block/:hash - Should get block', async () => {
        const response = await request(app)
            .get('/block/block-hash');

            expect(response.status).toEqual(200);
        expect(response.body.hash).toEqual('block-hash');
    });

    test('GET /block/next - Should get next block info', async () => {
        const response = await request(app)
            .get('/block/next');

        expect(response.status).toEqual(200);
        expect(response.body.index).toEqual(1);
    });

    test('GET /block/:index - Should NOT get genesis block', async () => {
        const response = await request(app)
            .get('/block/-1');

        expect(response.status).toEqual(404);
    });

    test('POST /block/ - Should create a new block', async () => {
        const block = new Block({
            index: 1,
            previousHash: 'block-hash'
        } as Block);

        const response = await request(app)
            .post('/block/')
            .send(block);

        expect(response.status).toEqual(201);
        expect(response.body.index).toEqual(1);
    });

    test('POST /block/ - Should NOT create a new block - 400 - Bad Request', async () => {
        const block = new Block({
            index: -1,
            previousHash: 'block-hash'
        } as Block);

        const response = await request(app)
            .post('/block/')
            .send(block);

        expect(response.status).toEqual(400);
    });

    test('POST /block/ - Should NOT create a new block - 422 - Unprocessable Entity', async () => {
        const block = new Block();
        const response = await request(app)
            .post('/block/')
            .send(block);

        expect(response.status).toEqual(422);
    });

    test('GET /transactions/ - Should get transactions info', async () => {
        const response = await request(app)
            .get('/transactions');

        expect(response.status).toEqual(200);
        expect(response.body.size).toBeGreaterThan(0);
    });

    test('GET /transactions/ - Should get transactions(blocks)', async () => {
        const response = await request(app)
            .get('/transactions/block-hash');

        expect(response.status).toEqual(200);
        expect(response.body.blockIndex).toBeGreaterThan(-1);
    });

    test('GET /transactions/ - Should get transactions(mempool)', async () => {
        const response = await request(app)
            .get('/transactions/mempool');

        expect(response.status).toEqual(200);
        expect(response.body.mempoolIndex).toBeGreaterThan(-1);
    });

    test('GET /transactions/ - Should NOT get transactions', async () => {
        const response = await request(app)
            .get('/transactions/-1');

        expect(response.status).toEqual(200);
        expect(response.body.mempoolIndex).toEqual(-1);
        expect(response.body.blockIndex).toEqual(-1);
    });

    test('POST /transactions/ - Should create a new transaction', async () => {
        const transaction = new Transaction({
            txInputs : [new TransactionInput()],
            txOutputs: [new TransactionOutput()],
        } as Transaction);

        const response = await request(app)
            .post('/transactions/')
            .send(transaction);

        expect(response.status).toEqual(201);
        expect(response.body.txInputs).toEqual(transaction.txInputs);
    });

    test('POST /transactions/ - Should NOT create a new transaction(undefined)', async () => {

        const transaction = new Transaction();
        transaction.txInputs == undefined;

        const response = await request(app)
            .post('/transactions/')
            .send(undefined);

        expect(response.status).toEqual(422);
    });

    test('POST /transactions/ - Should NOT create a new transaction(invalid data)', async () => {
        var transaction = new Transaction({
            hash: "",
            timestamp: -1,
            txInputs : [new TransactionInput()]
        } as Transaction);

        const response = await request(app)
            .post('/transactions/')
            .send(transaction);

        expect(response.status).toEqual(400);
    });

    test('GET /wallet/ - Should get wallet', async () => {
        const response = await request(app)
            .get('/wallets/toaddress');

        expect(response.status).toEqual(200);
        expect(response.body.balance).toEqual(10);
    });
})