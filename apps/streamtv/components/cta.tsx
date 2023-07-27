import { Fragment } from "react";
import clsx from "clsx";
import { GET_CTA } from "../graphql/queries/getCTA";
import { useObject } from "../hooks/useObject";
import { CallToAction } from "../types";

interface CallToActionProps {
  uid: string;
}

export const CTA = ({ uid }: CallToActionProps) => {
  const { data: cta, isLoading } = useObject<CallToAction>(GET_CTA, uid);

  return (
    <div className="my-6 flex w-full items-center justify-center">
      {!isLoading && cta && (
        <a
          className="flex w-full items-center justify-center gap-8 rounded bg-gray-700 px-4 py-4 md:max-w-xl md:px-8 lg:max-w-2xl lg:px-12"
          href={cta?.url_path || (cta?.url as string) || ""}
          rel="noreferrer"
          target="_blank"
        >
          <p className="rounded border-2 bg-purple-500 p-2 px-4 text-center text-white">
            {cta?.text?.split(" ").map((word) => (
              <span className="block" key={word}>
                {word}
              </span>
            ))}
          </p>
          <div>
            {/* TODO change this to support parsing HTML */}
            {cta?.description?.split("\n").map((line, index) => (
              <Fragment key={line || index}>
                {line === "" ? (
                  <br />
                ) : (
                  <p
                    className={clsx(
                      "text-center text-gray-200",
                      index === 0 && "text-center text-2xl font-medium",
                      index === 0 ? "mb-2" : "mb-1"
                    )}
                  >
                    {line}
                  </p>
                )}
              </Fragment>
            ))}
          </div>
        </a>
      )}
    </div>
  );
};
