import { ThreeIdConnect } from '@3id/connect'
import { CeramicClient } from '@ceramicnetwork/http-client'
import { DID } from 'dids'
import { getResolver as getKeyResolver } from 'key-did-resolver'
import { getResolver as get3IDResolver } from '@ceramicnetwork/3id-did-resolver'
import { CosmosAuthProvider } from '@ceramicnetwork/blockchain-utils-linking'


const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com")

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

  const chainId = 'Oraichain-testnet';

  if (!window.keplr) return {
    error: "No keplr wallet detected"
  }

  await window.keplr.enable(chainId);
  let record;

  if (!client) {
    client = new Core({ ceramic: ceramicNetwork })
  }

  if (!address) {
    const offlineSigner = window.keplr.getOfflineSigner(chainId);
    [address] = await offlineSigner.getAccounts();
  }

  const capLink = caip10Links[network]
  const did = await client.getAccountDID(`${address[0]}${capLink}`)

  record = await client.get(schema, did)
  console.log('record: ', record)
  return {
    record, error: null
  }
}

// --------------


async function authenticateWithCosmos(keplrWallet) {

  const threeID = new ThreeIdConnect()

  const chainId = 'Oraichain-testnet';

  await keplrWallet.enable(chainId)
  const offlineSigner = keplrWallet.getOfflineSigner(chainId);

  const accounts = await offlineSigner.getAccounts();

  console.log("Offline signer: ", offlineSigner);
  console.log("account: ", accounts);

  let authProvider = new CosmosAuthProvider(offlineSigner, accounts[0].address, chainId);

  console.log(authProvider)
  console.log("1:", chainId)
  await threeID.connect(authProvider);
  console.log("2")
  const did = new DID({
    provider: threeID.getDidProvider(),
    resolver: {
      ...get3IDResolver(ceramic),
      ...getKeyResolver()
    }
  })
  console.log("3:", did)
  await did.authenticate()

  console.log("4")
  ceramic.did = did

  console.log(ceramic);
  // return {

  // }
}

async function webClient() {
  if (window.keplr == undefined) {
    throw new Error('No injected Cosmos provider')
  }
  await authenticateWithCosmos(window.keplr)
}

export {
  webClient,
  getRecord
}

