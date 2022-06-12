import '../styles/globals.css'
import Image from 'next/image'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav>
        <div
          className="pt-4 pb-2 px-10 border-b"
        >
          <Image src="/icon.svg" height={50} width={50} />
        </div>
      </nav>
      <div style={{ height: 'calc(100vh - 172px)', overflow: 'scroll', paddingBottom: 80 }}>
        <Component {...pageProps} />
      </div>
      <footer className="pt-4 pb-2 px-10 border-t flex flex-col justify-center" style={{ height: '86px' }}>
      
      </footer>
    </div>
  )
}

export default MyApp
