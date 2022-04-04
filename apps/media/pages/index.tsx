import type { NextPage } from "next";
import Head from "next/head";
import { HelloWorld } from "@skylark-reference-apps/react";

const Home: NextPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center py-2">
    <Head>
      <title>{`Skylark Media Reference App`}</title>
      <link href="/favicon.ico" rel="icon" />
    </Head>

    <HelloWorld pulse />
  </div>
);

export default Home;
