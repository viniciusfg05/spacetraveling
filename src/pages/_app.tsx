import { AppProps } from 'next/app';
import Header from '../components/Header';
import '../styles/globals.scss';
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <title>vLive</title>
      </Head>
      <Header />
      <Component {...pageProps} />
    </>
  )
  
}

export default MyApp;
