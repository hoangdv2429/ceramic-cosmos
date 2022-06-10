export interface LinkProof {
    version: number;
    message: string;
    signature: string;
    account: string;
    did?: string;
    timestamp?: number;
    address?: string;
    type?: string;
    chainId?: number;
}

export interface RpcMessage {
    jsonrpc: string;
    id: number;
    method: string;
    params: any;
}

export interface ConsentMessage {
    message: string;
    timestamp?: number;
}

export declare function getConsentMessage(did: string, addTimestamp?: boolean): ConsentMessage;
export declare function encodeRpcMessage(method: string, params?: any): any;
//# sourceMappingURL=util.d.ts.map