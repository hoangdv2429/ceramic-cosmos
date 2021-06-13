import Head from 'next/head'
import CeramicClient from '@ceramicnetwork/http-client'
import { useState } from 'react'
import { IDX } from '@ceramicstudio/idx'
import { EthereumAuthProvider, ThreeIdConnect } from '@3id/connect'
import { DID } from 'dids'
import Web3Modal from 'web3modal'
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'

const API_URL = "https://ceramic-clay.3boxlabs.com"
// const API_URL = "http://localhost:7007"
const ceramic = new CeramicClient(API_URL)

import { connectIdx } from '../components/identity'

export default function Home() {
  const [bio, setBio] = useState('')
  const [twitter, setTwitter] = useState('')
  const [name, setName] = useState('')
  const [profile, setProfile] = useState({})
  const [localDid, setDid] = useState(null)
  const [idxInstance, setIdxInstance] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)
  async function connect() {
    // const web3Modal = new Web3Modal({
    //   network: 'mainnet',
    //   cacheProvider: true,
    // })

    // const ethProvider = await web3Modal.connect()
    // const addresses = await ethProvider.enable()   
    // const authProvider = new EthereumAuthProvider(ethProvider, addresses[0])

    const addresses = await window.ethereum.request({ method: 'eth_requestAccounts' })
    
    const threeIdConnect = new ThreeIdConnect()
    const authProvider = new EthereumAuthProvider(window.ethereum, addresses[0])

    await threeIdConnect.connect(authProvider)
    
    const did = new DID({
      provider: threeIdConnect.getDidProvider(),
      resolver: ThreeIdResolver.getResolver(ceramic)
    })

    // set did in local state
    setDid(did)

    // attach did to ceramic instance
    ceramic.setDID(did)    
    // authenticate with ceramic
    await ceramic.did.authenticate()

    const idx = new IDX({ ceramic })
    setIdxInstance(idx)
    const data = await idx.get('basicProfile', did.id)
    setLoaded(true)
    if (data) {
      setProfile(data)
    } else {
      setShowGreeting(true)
    }
  }
  async function connect2() {
    const {
      did, idx
    } = await connectIdx()
    setDid(did)
    setIdxInstance(idx)
    setLoaded(true)
    const data = await idx.get('basicProfile', did.id)
    if (data) {
      setProfile(data)
    } else {
      setShowGreeting(true)
    }
  }
  async function updateProfile() {
    if (twitter) profile.twitter = twitter
    if (bio) profile.bio = bio
    if (name) profile.name = name
    await idxInstance.set('basicProfile', profile)
    setLocalProfileData()
  }
  async function readProfile() {
    if (!localDid) return
    const data = await idxInstance.get('basicProfile', localDid.id)
    console.log('data: ', data)
  }
  async function setLocalProfileData() {
    const data = await idxInstance.get('basicProfile', localDid.id)
    if (!data) return
    setProfile(data)
  }
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div style={{ paddingTop: 50, width: 500, margin: '0 auto', display: 'flex', flex: 1 }}>
          <div className="flex flex-1 flex-col justify-center">
            <h1 className="text-5xl text-center">
              Decentralized Identity
            </h1>
            <p className="text-xl text-center mt-2 text-gray-400">An authentication system built with Ceramic & IDX</p>

            {
              Object.keys(profile).length ? (
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold mt-6">{profile.name}</h2>
                  <p className="text-gray-500 text-sm my-1">{profile.bio}</p>
                  <p className="text-lg	text-gray-900">Follow me on Twitter - @{profile.twitter}</p>
                </div>
              ) : null
            }

          {
            !loaded && (
              <>
              <button
              onClick={connect}
              className="pt-4 shadow-md bg-purple-800 mt-4 mb-2 text-white font-bold py-2 px-4 rounded"
            >Connect Profile</button>
                          <button
              onClick={connect2}
              className="pt-4 shadow-md bg-purple-800 mt-4 mb-2 text-white font-bold py-2 px-4 rounded"
            >Connect With Provider</button>
            </>
            )
          }
          {
            loaded && showGreeting && (
              <p>You have no profile yet. Please create one!</p>
            )
          }
          {
            loaded && (
              <>
                <input className="pt-4 rounded bg-gray-100 px-3 py-2" placeholder="Name" onChange={e => setName(e.target.value)} />
                <input className="pt-4 rounded bg-gray-100 px-3 py-2 my-2" placeholder="Bio" onChange={e => setBio(e.target.value)} />
                <input className="pt-4 rounded bg-gray-100 px-3 py-2" placeholder="Twitter username" onChange={e => setTwitter(e.target.value)} />
                <button className="pt-4 shadow-md bg-green-500 mt-2 mb-2 text-white font-bold py-2 px-4 rounded" onClick={updateProfile}>Update Profile</button>
                <button className="pt-4 shadow-md bg-blue-500 mb-2 text-white font-bold py-2 px-4 rounded" onClick={readProfile}>Read Profile</button>
              </>
            )
          }
        </div>
      </div>
    </div>
  )
}
