import Validation from '../validation';

export default class TransactionOutput {
    toAddress: string;
    amount: number;
    tx?: string;

    constructor(txOutput?: TransactionOutput) {
        this.toAddress = txOutput?.toAddress || 'address';
        this.amount = txOutput?.amount || 10
        this.tx = txOutput?.tx || 'outputTx';
    }

    isValid(): Validation {
        if(this.amount < 1)
            return new Validation(false, 'Negative amout');

        return new Validation();
    }

    getHash(): string {
        return 'hash';
    }
}