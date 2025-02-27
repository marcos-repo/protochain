import Validation from '../validation';

export default class TransactionInput {

    fromAddress: string;
    amount: number;
    signature: string;
    previousTx: string;

    constructor(txInput?: TransactionInput){
        this.fromAddress = txInput?.fromAddress || 'wallet';
        this.amount = txInput?.amount || 10;
        this.signature = txInput?.signature || 'signature';
        this.previousTx = txInput?.previousTx || 'previousTx';
    }

    sign(privateKey: string): void {

        this.signature = 'signature';

    }

    getHash(): string {
        return 'hash';
    }

    isValid(): Validation{
        if(!this.previousTx || !this.signature)
                    return new Validation(false, 'Signature and previous Tx are required');

        if(this.amount < 1)
            return new Validation(false, 'Invalid amount. Must be greater than zero');

        return new Validation();
    }
}