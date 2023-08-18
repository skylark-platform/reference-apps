import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type HTMLDir = "ltr" | "rtl" | undefined;

// https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir
export const useHtmlDirection = (): {
  dir: HTMLDir;
  isRtl: boolean;
  isLtr: boolean;
} => {
  const [documentDir, setDocumentDir] = useState<HTMLDir>(undefined);

  const { query } = useRouter();

  useEffect(() => {
    setDocumentDir((document.dir as HTMLDir) || "ltr");
  }, []);

  let dir: HTMLDir = documentDir;

  const queryDir = query.dir;
  if (typeof queryDir === "string" && ["ltr", "rtl"].includes(queryDir)) {
    dir = queryDir as HTMLDir;
  }

  useEffect(() => {
    const htmlTag = document.getElementsByTagName("html")[0];
    if (typeof queryDir === "string") {
      htmlTag.setAttribute("dir", queryDir);
    } else {
      htmlTag.removeAttribute("dir");
    }
  }, [queryDir]);

  return {
    dir,
    isRtl: dir === "rtl",
    isLtr: dir === "ltr",
  };
};
