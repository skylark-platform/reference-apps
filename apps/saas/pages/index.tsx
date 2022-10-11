import type { NextPage } from "next";
import { useHomepageSet } from "../hooks/useHomepageSet";

const Home: NextPage = () => {
  const { data } = useHomepageSet();
  console.log("Homepage", data);

  return <div>{`Content count: ${data?.content?.count || ""}`}</div>;
};

export default Home;
