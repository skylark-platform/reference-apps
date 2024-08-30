import { hasProperty } from "@skylark-reference-apps/lib";
import { useEffect } from "react";

interface WhiskProps {
  uid: string;
  recipeUrl: string;
  title?: string;
}

export const Whisk = ({ uid, recipeUrl }: WhiskProps) => {
  const whiskId = `whisk-${uid}`;

  const whisk =
    typeof window !== "undefined" && hasProperty(global, "whisk")
      ? (global.whisk as {
          queue: unknown[];
          display: (id: string) => void;
          shoppingList: {
            defineWidget: (id: string, opts: object) => void;
          };
          config: {
            set: (s: string, o: object) => void;
          };
        })
      : null;

  const triggerWhiskWidget = () => {
    console.log("triggerWhiskWidget", whisk);
    if (whisk) {
      whisk.queue = whisk.queue || [];

      whisk.config.set("shoppingList", {
        recipeUrl,
      });

      // eslint-disable-next-line prefer-arrow-callback, func-names
      whisk.queue.push(function () {
        whisk.shoppingList.defineWidget(whiskId, {
          styles: {
            type: "save-recipe",
            size: "large",
          },
        });
      });

      // eslint-disable-next-line prefer-arrow-callback, func-names
      whisk.queue.push(function () {
        whisk?.display(whiskId);
      });
    }
  };

  useEffect(() => {
    console.log("WHISK IS HERE", whisk);
    if (whisk) {
      triggerWhiskWidget();
    }

    // return () => {
    //   if (whisk) {
    //     whisk.remove(whiskId);
    //   }
    // };
  }, [whisk]);

  return (
    <div className="w-full" key={recipeUrl}>
      {/* {title && <p className="mb-1">{title}</p>} */}
      <div
        className="rounded bg-white p-2"
        data-whiskid={recipeUrl}
        id={whiskId}
      ></div>
    </div>
  );
};
