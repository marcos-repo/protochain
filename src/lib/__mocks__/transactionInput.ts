import Validation from "../validation";

export default class TransactionInput {

    fromAddress: string;
    amount: number;
    signature: string;

    constructor(txInput?: TransactionInput){
        this.fromAddress = txInput?.fromAddress || "wallet";
        this.amount = txInput?.amount || 10;
        this.signature = txInput?.signature || "signature";
    }

    sign(privateKey: string): void {

        this.signature = "signature";

    }

    getHash(): string {
        return "hash";
    }

    isValid(): Validation{
        if(!this.signature)
            return new Validation(false, "Signature is required");

        if(this.amount < 1)
            return new Validation(false, "Invalid amount. Must be greater than zero");

        return new Validation();
    }
}