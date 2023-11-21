import { useRouter } from "next/router";
import { MdArrowBack } from "react-icons/md";

export const BackButton = () => {
  const { asPath, back } = useRouter();

  return asPath !== "/" ? (
    <button className="fixed left-2 p-1 md:hidden" onClick={back}>
      <MdArrowBack className="text-3xl" />
    </button>
  ) : (
    <></>
  );
};
