import { AppProps } from 'next/app';
import '../styles/globals.scss';
import Head from 'next/head';
import Header from '../components/Header';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <title>vLive</title>
      </Head>
      <Header />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
