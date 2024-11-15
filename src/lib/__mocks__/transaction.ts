import TransactionType from "../transactionType";
import Validation from "../validation";


export default class Transaction {
    type: TransactionType;
    timestamp: number;
    hash: string;
    data: string;

    constructor(tx?: Transaction) {
        this.type = tx?.type || TransactionType.REGULAR;
        this.timestamp = tx?.timestamp || Date.now();
        this.data = tx?.data || "";
        this.hash = this.getHash();
    }

    getHash() : string {
        return "tx";
    }

    isValid(): Validation {
        if(!this.data) return new Validation(false, "Invalid mock transaction");

        return new Validation();
    }
}