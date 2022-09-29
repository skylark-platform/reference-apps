import type { NextPage } from "next";
import { useHomepageSet } from "../hooks/useHomepageSet";

const Home: NextPage = () => {
  const data = useHomepageSet();
  const homepageItems = data.homepage?.content?.objects;

  return (
    <div>
      {homepageItems?.map((item) => {
        return <div key={`${item.slug}`}>{item?.slug}</div>;
      })}
    </div>
  );
};

export default Home;
