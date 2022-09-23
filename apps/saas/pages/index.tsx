import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useHomepageSet } from "../hooks/useHomepageSet";

import { request, GraphQLClient, gql } from "graphql-request";
import useSWR from "swr";

import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  // const homepageItems = main();

  const homepage = useHomepageSet();
  console.log("home", homepage);
  return (
    <div className={styles.container}>
      {/*homepageItems?.map((item, index) => {
        console.log("item", item);
        return <></>;
      })*/}
    </div>
  );
};

export default Home;
