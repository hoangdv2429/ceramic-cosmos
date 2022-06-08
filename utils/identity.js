import { Core } from '@self.id/core'
const SID = require('@self.id/web')
const { OraiAuthProvider, SelfID, WebClient } = SID
import { CosmosAuthProvider } from '@3id/connect';

const chainId = "cosmoshub-4";

async function webClient({
  ceramicNetwork = 'testnet-clay',
  connectNetwork = 'testnet-clay',
  address = '',
  provider = null,
  client = null
} = {}) {
  let keplr = await window.keplr.enable(chainId);

  if (!window.keplr) return {
    error: "No keplr wallet detected"
  }

  if (!client) {
    client = new WebClient({
      ceramic: ceramicNetwork,
      connectNetwork
    })
  }

  if (!address) {
    const offlineSigner = window.keplr.getOfflineSigner(chainId);
    [address] = await offlineSigner.getAccounts();
  }

  if (!provider) {
    provider = new CosmosAuthProvider(window.keplr, address[0], chainId);
  }

  await client.authenticate(provider)

  const selfId = new SelfID({ client })
  const id = selfId.did._id

  return {
    client, id, selfId, error: null
  }
}

const networks = {
  ethereum: 'ethereum',
  bitcoin: 'bitcoin',
  cosmos: 'cosmos',
  kusama: 'kusama'
}

const caip10Links = {
  ethereum: "@eip155:1",
  bitcoin: '@bip122:000000000019d6689c085ae165831e93',
  cosmos: '@cosmos:Oraichain-testnet',
  kusama: '@polkadot:b0a8d493285c2df73290dfb7e61f870f'
}

/*
CAIP-10 Account IDs is a blockchain agnostic way to describe an account on any blockchain. This may be an externally owned key-pair account, or a smart contract account. Ceramic uses CAIP-10s as a way to lookup the DID of a user using a caip10-link streamType in Ceramic. Learn more in the Ceramic documentation.
*/
async function getRecord({
  ceramicNetwork = 'testnet-clay',
  network = 'Oraichain-testnet',
  client = null,
  schema = 'basicProfile',
  address = null
} = {}) {
  let keplr = await window.keplr.enable(chainId);
  let record;

  if (!window.keplr) return {
    error: "No keplr wallet detected"
  }

  if (!client) {
    client = new Core({ ceramic: ceramicNetwork })
  }

  if (!address) {
    const offlineSigner = window.keplr.getOfflineSigner(chainId);
    [address] = await offlineSigner.getAccounts();
  }

  const capLink = caip10Links[network]
  const did = await client.getAccountDID(`${address}${capLink}`)

  record = await client.get(schema, did)
  console.log('record: ', record)
  return {
    record, error: null
  }
}

export {
  webClient,
  getRecord
}