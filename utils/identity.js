import { CeramicClient } from '@ceramicnetwork/http-client'
import { DID } from 'dids'
import { getResolver as getKeyResolver } from 'key-did-resolver'
import { getResolver as get3IDResolver } from '@ceramicnetwork/3id-did-resolver'
import { CosmosAuthProvider } from '@ceramicnetwork/blockchain-utils-linking'
import { ThreeIdConnect } from '@3id/connect'

const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com")

async function authenticateWithCosmos(keplrWallet) {

  const threeID = new ThreeIdConnect()

  const chainId = "Oraichain-testnet";
  await keplrWallet.enable(chainId)
  const offlineSigner = keplrWallet.getOfflineSigner(chainId);
  const accounts = await offlineSigner.getAccounts();
  console.log(accounts[0].address);

  const authProvider = new CosmosAuthProvider(offlineSigner, accounts[0].address, chainId);
  console.log(authProvider)

  await threeID.connect(authProvider);

  const did = new DID({
    provider: threeID.getDidProvider(),
    // provider: authProvider,
    resolver: {
      ...get3IDResolver(ceramic),
      ...getKeyResolver()
    }
  })

  console.log("this is DID:", did);

  await authProvider.authenticate();
  await did.authenticate();

  console.log("dm cuoc doi");

  ceramic.did = did
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
  network = 'cosmos',
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
    console.log(address);
  }

  const capLink = caip10Links[network]
  const did = await client.getAccountDID(`${address}${capLink}`)

  record = await client.get(schema, did)
  console.log('record: ', record)
  return {
    record, error: null
  }
}

async function webClient() {
  if (window.keplr == undefined) {
    throw new Error('No injected Cosmos provider')
  }
  await authenticateWithCosmos(window.keplr);
}

export {
  webClient,
  getRecord
}