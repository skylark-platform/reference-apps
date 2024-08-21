import { hasProperty } from "@skylark-reference-apps/lib";
import { useEffect } from "react";

const whiskScriptId = "shoppable-whisk-script";

interface WhiskProps {
  whiskId: string;
}

export const Whisk = ({ whiskId }: WhiskProps) => {
  const whisk =
    typeof window !== "undefined" && hasProperty(global, "whisk")
      ? (global.whisk as {
          queue: unknown[];
          display: (id: string) => void;
          shoppingList: {
            defineWidget: (id: string, opts: object) => void;
          };
        })
      : null;

  const triggerWhiskWidget = () => {
    console.log("triggerWhiskWidget", whisk);
    if (whisk) {
      whisk.queue = whisk.queue || [];

      whisk.queue.push(() => {
        whisk.shoppingList.defineWidget(whiskId, {
          styles: {
            type: "save-recipe",
            size: "large",
          },
        });
      });

      whisk.queue.push(() => {
        whisk?.display(whiskId);
      });
    }
  };

  useEffect(() => {
    console.log("WHISK IS HERE", whisk);
    if (whisk) {
      triggerWhiskWidget();
    }
  }, [whisk]);

  useEffect(() => {
    //     <script async="true" src="https://cdn.whisk.com/sdk/shopping-list.js" type="text/javascript"></script>
    // <script>
    //   var whisk = whisk || {};
    //   whisk.queue = whisk.queue || [];

    //   whisk.queue.push(function () {
    //    whisk.shoppingList.defineWidget("VNRH-NWDX-OCCU-NMLG", {
    //       styles: {
    //         type: "save-recipe",
    //         size: "large"
    //       }
    //     })
    //    });

    // </script>

    console.log({ whisk, queue: whisk?.queue });

    const body = document.getElementsByTagName("body")?.[0];
    const scriptExists = Boolean(document.getElementById(whiskScriptId));

    if (!whisk && !scriptExists) {
      if (!scriptExists) {
        const script = document.createElement("script");
        script.id = whiskScriptId;
        script.src = "https://cdn.whisk.com/sdk/shopping-list.js";
        script.type = "text/javascript";

        body.appendChild(script);
        script.onload = () => triggerWhiskWidget();
      }

      // if(whisk !== null) {

      //   triggerWhiskWidget()

      // }

      console.log({ body, whisk });
    }

    return () => {
      const whiskScript = document.getElementById(whiskScriptId);

      whiskScript?.remove();
    };
  }, [whiskId, whisk]);

  return (
    <div className="h-52 w-full">
      <div id={whiskId}>
        {/* <script>
    {``}
  </script> */}
      </div>
    </div>
  );
};
