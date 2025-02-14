import TransactionInput from "./transactionInput";
import TransactionType from "../transactionType";
import Validation from "../validation";


export default class Transaction {
    type: TransactionType;
    timestamp: number;
    hash: string;
    to: string;
    txInput: TransactionInput;

    constructor(tx?: Transaction) {
        this.type = tx?.type || TransactionType.REGULAR;
        this.timestamp = tx?.timestamp || Date.now();
        this.to = tx?.to || "";
        this.txInput = tx?.txInput ? new TransactionInput(tx?.txInput) : new TransactionInput();
        
        this.hash = tx?.hash || this.getHash();
    }

    getHash() : string {
        return "tx";
    }

    isValid(): Validation {
        if(!this.to) return new Validation(false, "Invalid mock transaction(to)");
        if(!this.txInput.isValid()) return new Validation(false, "Invalid mock transaction(txInput)");
        
        return new Validation();
    }
}