import { hasProperty } from "@skylark-reference-apps/lib";
import {
  Carousel as ReactCarousel,
  CarouselItem,
} from "@skylark-reference-apps/react";
import { GET_SET_FOR_CAROUSEL } from "../graphql/queries";
import { useObject } from "../hooks/useObject";
import {
  convertGraphQLSetType,
  convertTypenameToObjectType,
  getGraphQLImageSrc,
} from "../lib/utils";
import {
  Entertainment,
  ImageType,
  SetContent,
  SkylarkSet,
  StreamTVSupportCallToActionType,
} from "../types";

interface CarouselProps {
  uid: string;
}

const getFirstCallToAction = (
  callToActions: Entertainment["call_to_actions"]
): CarouselItem["callToAction"] => {
  if (!callToActions?.objects?.[0]?.type) {
    return undefined;
  }

  const callToAction = callToActions.objects[0];

  return {
    text: callToAction.text || callToAction.text_short || null,
    description:
      callToAction.description || callToAction.description_short || null,
    type: callToAction.type as StreamTVSupportCallToActionType,
    url: callToAction.url as string | undefined,
    urlPath: callToAction.url_path as string | undefined,
  };
};

export const Carousel = ({ uid }: CarouselProps) => {
  const { data } = useObject<SkylarkSet>(GET_SET_FOR_CAROUSEL, uid);

  const items: CarouselItem[] = data?.content?.objects
    ? (data?.content?.objects as SetContent[]).map((item): CarouselItem => {
        const object = item.object as Entertainment;
        const parsedType =
          object.__typename === "SkylarkSet"
            ? convertGraphQLSetType(object?.type || "")
            : convertTypenameToObjectType(object.__typename);

        return {
          title: object.title_short || object.title || "",
          href: `/${parsedType}/${object.uid}`,
          releaseDate:
            (object &&
              hasProperty(object, "release_date") &&
              (object.release_date as string)) ||
            "",
          type: parsedType,
          image: getGraphQLImageSrc(object.images, ImageType.Main),
          callToAction: getFirstCallToAction(object.call_to_actions),
        };
      })
    : [];

  return <ReactCarousel changeInterval={8} items={items} />;
};
