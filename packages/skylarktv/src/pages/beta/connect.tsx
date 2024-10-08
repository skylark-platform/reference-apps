import { useRouter } from "next/router";
import { useEffect } from "react";

export default function BetaConnect() {
  const router = useRouter();

  useEffect(() => {
    void router.push(
      router.asPath.replace("/beta/connect", "/skylark/connect"),
    );
  }, [router]);

  return <></>;
}
