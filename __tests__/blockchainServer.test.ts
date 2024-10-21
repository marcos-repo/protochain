import request from 'supertest';
import {describe, expect, jest, test} from '@jest/globals';
import {app} from '../src/server/blockchainServer'
import Block from '../src/lib/block';

jest.mock('../src/lib/block');
jest.mock('../src/lib/blockchain');

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
            .get('/block/abc');

        expect(response.status).toEqual(200);
        expect(response.body.hash).toEqual('abc');
    });

    test('GET /block/:index - Should NOT get genesis block', async () => {
        const response = await request(app)
            .get('/block/-1');

        expect(response.status).toEqual(404);
    });

    test('POST /block/ - Should create a new block', async () => {
        const block = new Block({
            index: 1,
            previousHash: 'abc'
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
            previousHash: 'abc'
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
})