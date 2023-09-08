import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDimensions } from "../contexts";

type HTMLDir = "ltr" | "rtl" | undefined;

// https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir
export const useHtmlDirection = (
  forceRtl?: boolean
): {
  dir: HTMLDir;
  isRtl: boolean;
  isLtr: boolean;
} => {
  const [documentDir, setDocumentDir] = useState<HTMLDir>(undefined);

  const { query } = useRouter();

  const {
    dimensions: { language },
  } = useDimensions();

  useEffect(() => {
    setDocumentDir((document.dir as HTMLDir) || "ltr");
  }, []);

  let dir: HTMLDir = documentDir;

  const queryDir = query.dir;
  if (typeof queryDir === "string" && ["ltr", "rtl"].includes(queryDir)) {
    dir = queryDir as HTMLDir;
  }

  if (forceRtl) {
    dir = "rtl";
  }

  useEffect(() => {
    const htmlTag = document.getElementsByTagName("html")[0];

    let updatedDir: "ltr" | "rtl" = "ltr";

    if (
      typeof queryDir === "string" &&
      (queryDir === "rtl" || queryDir === "ltr")
    ) {
      updatedDir = queryDir;
    } else if (language.toLowerCase().startsWith("ar")) {
      updatedDir = "rtl";
    } else {
      updatedDir = "ltr";
    }

    if (!forceRtl && documentDir !== updatedDir) {
      htmlTag.setAttribute("dir", updatedDir);
      setDocumentDir(updatedDir);
    }
  }, [queryDir, language, documentDir]);

  return {
    dir,
    isRtl: dir === "rtl",
    isLtr: dir === "ltr",
  };
};
