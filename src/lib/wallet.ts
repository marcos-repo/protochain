import * as ecc from 'tiny-secp256k1';
import ECPairFactory, { ECPairInterface } from 'ecpair';

const ECPair = ECPairFactory(ecc);


export default class Wallet {

    privateKey: string;
    publicKey: string;

    constructor(wifOrPrivateKey?: string) {
        let keys;

        if(wifOrPrivateKey){
            if(wifOrPrivateKey.length === 64)
                keys = ECPair.fromPrivateKey(Buffer.from(wifOrPrivateKey,"hex"));
            else
                keys = ECPair.fromWIF(wifOrPrivateKey);
        }
        else {
            keys = ECPair.makeRandom();
        }
        const _privateKey = keys.privateKey;

        /* c8 ignore next */
        this.privateKey = _privateKey !== undefined ? Buffer.from(_privateKey).toString('hex') : "";
        this.publicKey = Buffer.from(keys.publicKey).toString("hex");
    }
}