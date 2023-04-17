import { hasProperty } from "@skylark-reference-apps/lib"
import { Carousel as ReactCarousel, CarouselItem } from "@skylark-reference-apps/react"
import { useCarousel } from "../hooks/useCarousel"
import { convertGraphQLSetType, convertTypenameToEntertainmentType, getGraphQLImageSrc } from "../lib/utils"
import { Entertainment, ImageType, SetContent } from "../types"

interface CarouselProps {
  uid: string
}

export const Carousel = ({uid}: CarouselProps) => {
  const {data } = useCarousel(uid)

  const items: CarouselItem[] = data?.content?.objects ? (data?.content?.objects as SetContent[]).map((item): CarouselItem => {
    const object = item.object as Entertainment
    const parsedType = object.__typename === "SkylarkSet"
      ? convertGraphQLSetType(object?.type || "")
      : convertTypenameToEntertainmentType(object.__typename);

    return {
      title: object.title_short || object.title || "",
      href: `/${parsedType}/${object.uid}`,
      releaseDate: object && hasProperty(object, "release_date") && (object.release_date as string) || "",
      type: parsedType,
      image: getGraphQLImageSrc(object.images, ImageType.Main),
    }
  }) : []

  return <ReactCarousel items={items} />
}
