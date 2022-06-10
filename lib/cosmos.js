import { AccountID } from "caip";
import { getConsentMessage } from "./util";
import { hash } from "@stablelib/sha256";
import { uint8arrays } from 'uint8arrays';
const stringEncode = (str) => uint8arrays.toString(uint8arrays.fromString(str), 'base64pad');

class CosmosAuthProvider {
    constructor(provider, address, chainRef) {
        this.provider = provider;
        this.address = address;
        this.chainRef = chainRef;
        this.isAuthProvider = true;
    }
    async authenticate(message) {
        const accountID = await this.accountId();
        const encodedMsg = stringEncode(message);
        const res = await this.provider.sign(asTransaction(accountID.address, encodedMsg), getMetaData());
        const digest = hash(uint8arrays.fromString(JSON.stringify(res.signatures[0])));
        return `0x${uint8arrays.toString(digest, 'base16')}`;
    }
    async createLink(did) {
        const { message, timestamp } = getConsentMessage(did);
        const accountID = await this.accountId();
        const encodedMsg = stringEncode(message);
        const res = await this.provider.sign(asTransaction(accountID.address, encodedMsg), getMetaData());
        const signature = stringEncode(JSON.stringify(res.signatures[0]));
        return {
            version: 2,
            message,
            signature,
            account: accountID.toString(),
            timestamp,
        };
    }
    async accountId() {
        return new AccountID({
            address: this.address,
            chainId: `cosmos:${this.chainRef}`,
        });
    }
    withAddress(address) {
        return new CosmosAuthProvider(this.provider, address, this.chainRef);
    }
}

function asTransaction(address, message) {
    return {
        fee: {
            amount: [{ amount: '0', denom: '' }],
            gas: '0',
        },
        memo: message,
        msg: [
            {
                type: 'cosmos-sdk/MsgSend',
                value: {
                    from_address: address,
                    to_address: address,
                    amount: [{ amount: '0', denom: '0' }],
                },
            },
        ],
    };
}

function getMetaData() {
    return {
        account_number: '1',
        chain_id: 'cosmos',
        sequence: '0',
    };
}

export default {
    asTransaction,
    getMetaData,
    CosmosAuthProvider
}
//# sourceMappingURL=cosmos.js.map