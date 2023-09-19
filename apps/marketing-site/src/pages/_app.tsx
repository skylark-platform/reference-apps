import "src/styles/globals.css";
import type { AppProps } from "next/app";
import { Footer } from "src/components/footer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
