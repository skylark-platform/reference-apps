import { CarouselItem, Skeleton } from "@skylark-reference-apps/react";
import { FC, ReactNode } from "react";
import { useInView } from "react-intersection-observer";
import { useSlider } from "../hooks/useSlider";
import {
  convertTypenameToEntertainmentType,
  getGraphQLImageSrc,
  getTitleByOrderForGraphQLObject,
} from "../lib/utils";
import {
  Brand,
  Episode,
  ImageType,
  Movie,
  Season,
  SetContent,
} from "../types/gql";

export const SliderDataFetcher: FC<{
  children(data: CarouselItem[]): ReactNode;
  uid: string;
}> = (props) => {
  const { children, uid } = props;
  const { ref, inView } = useInView({ triggerOnce: true });

  const { slider, isLoading } = useSlider(uid);

  if (!uid) return <></>;

  const setContent = (slider?.content?.objects as SetContent[])?.map(
    ({ object }) => object as Episode | Season | Movie | Brand
  );

  return (
    <div className="h-full w-full" ref={ref}>
      {inView ? (
        <>
          {!isLoading &&
            slider &&
            children(
              setContent.map((object) => ({
                uid: object.uid,
                title: getTitleByOrderForGraphQLObject(object, [
                  "title", "title_short"
                ]),
                href: `/${convertTypenameToEntertainmentType(
                  object.__typename
                )}/${object.uid}`,
                image: getGraphQLImageSrc(object.images, ImageType.Main),
                type: convertTypenameToEntertainmentType(object.__typename),
                releaseDate: (object.release_date as string | undefined) || "",
              }))
            )}
        </>
      ) : (
        <Skeleton show />
      )}
    </div>
  );
};
