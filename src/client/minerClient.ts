import axios from "axios";
import BlockInfo from "../lib/blockInfo";
import Block from "../lib/block";

const BLOCKCHAIN_SERVER = 'http://localhost:3000';
const minerWallet = {
    privateKey: "private-key",
    publicKey: "public-key"
}

let totalMined = 0;

async function mine() {
    
    console.log("---------------------------------------------------------------");
    log("Getting new block info");

    const {data} = await axios.get(`${BLOCKCHAIN_SERVER}/block/next`);
    const blockInfo = data as BlockInfo;
    const newBlock = Block.fromBlockInfo(blockInfo);

    log("Start mining block " + blockInfo.index);
    newBlock.mine(blockInfo.difficulty, minerWallet.publicKey);

    log("Block mined! Send to Blockchain...");
    
    try {
        await axios.post(`${BLOCKCHAIN_SERVER}/block`, newBlock);

        log("Block sent and accepted.");
        totalMined++;

        log("Total mined blocks: " + totalMined);
    } catch (error: any) {
        console.error(error.response ? error.response.data : error.message);
    }

    setTimeout(() => {
       mine();
    }, 1000);
}

console.clear();
mine();

function log(message: string) {
    console.log(`${new Date().toLocaleString()} - ${message}`);
}