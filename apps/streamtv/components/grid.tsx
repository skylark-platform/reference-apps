import { hasProperty } from "@skylark-reference-apps/lib";
import { Metadata, Movie, ObjectTypes } from "../types";
import { Thumbnail, ThumbnailVariant } from "./thumbnail";

interface GridProps {
  header?: string;
  displayCount?: boolean;
  objects: (Metadata | Movie)[];
  variant: ThumbnailVariant;
  className?: string;
}

export const Grid = ({
  header,
  displayCount,
  objects,
  variant,
  className,
}: GridProps) => (
  <div className={className}>
    {header && (
      <h2 className="ml-sm-gutter text-2xl font-normal text-white md:ml-md-gutter lg:ml-lg-gutter xl:ml-xl-gutter">
        {header}
        {displayCount && (
          <span className="ml-1 text-gray-500 lg:ml-2">{`(${objects.length})`}</span>
        )}
      </h2>
    )}
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 px-gutter py-2 sm:px-sm-gutter md:grid-cols-3 md:py-4 lg:grid-cols-4 lg:px-lg-gutter xl:px-xl-gutter 2xl:grid-cols-6">
      {objects?.map((object) =>
        object && hasProperty(object, "__typename") ? (
          <Thumbnail
            key={object.uid}
            objectType={object.__typename as ObjectTypes}
            uid={object.uid}
            variant={variant}
          />
        ) : (
          <></>
        )
      )}
    </div>
  </div>
);
