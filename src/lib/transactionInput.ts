import * as ecc from 'tiny-secp256k1';
import ECPairFactory from 'ecpair';
import { SHA256 } from 'crypto-js';
import Validation from './validation';

const ECPair = ECPairFactory(ecc);

export default class TransactionInput {

    fromAddress: string;
    amount: number;
    signature: string;

    constructor(txInput?: TransactionInput){
        this.fromAddress = txInput?.fromAddress || "";
        this.amount = txInput?.amount || 0;
        this.signature = txInput?.signature || "";
    }

    sign(privateKey: string): void {

        this.signature = Buffer.from(
        ECPair.fromPrivateKey(Buffer.from(privateKey, "hex"))
            .sign(Buffer.from(this.getHash(), "hex")))
            .toString("hex");

    }

    getHash(): string {
        return SHA256(this.fromAddress + this.amount).toString();
    }

    isValid(): Validation{
        if(!this.signature)
            return new Validation(false, "Signature is required");

        if(this.amount < 1)
            return new Validation(false, "Invalid amount. Must be greater than zero");

        const hash = Buffer.from(this.getHash(), "hex");
        const isValid = ECPair.fromPublicKey(
            Buffer.from(this.fromAddress, "hex")
        ).verify(hash, Buffer.from(this.signature, "hex"));

        return isValid ? new Validation() : new Validation(false, "Invalid tx signature");
    }
}