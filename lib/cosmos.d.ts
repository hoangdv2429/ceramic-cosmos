import { AccountID } from 'caip';
import { AuthProvider } from './auth-provider';
import { LinkProof } from './util';
import type { Tx, SignMeta } from '@tendermint/sig';
export declare function asTransaction(address: string, message: string): Tx;
export declare function getMetaData(): SignMeta;
export declare class CosmosAuthProvider implements AuthProvider {
    private readonly provider;
    private readonly address;
    private readonly chainRef;
    readonly isAuthProvider = true;
    constructor(provider: any, address: string, chainRef: string);
    authenticate(message: string): Promise<string>;
    createLink(did: string): Promise<LinkProof>;
    accountId(): Promise<AccountID>;
    withAddress(address: string): AuthProvider;
}
// # sourceMappingURL=cosmos.d.ts.map