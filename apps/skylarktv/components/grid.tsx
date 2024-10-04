import { hasProperty } from "@skylark-reference-apps/lib";
import { ReactNode } from "react";
import { RailHeader } from "./generic/rail";
import {
  Episode,
  Metadata,
  Movie,
  ObjectTypes,
  SetContent,
  SkylarkSet,
} from "../types";
import {
  Thumbnail,
  ThumbnailVariant,
  ThumbnailWithSelfFetch,
} from "./thumbnail";
import { useObject } from "../hooks/useObject";
import { GET_SET_FOR_RAIL } from "../graphql/queries";

interface GridProps {
  header?: string;
  displayCount?: boolean;
  objects: (Metadata | Movie | Episode)[];
  variant: ThumbnailVariant;
  className?: string;
  fetchAdditionalRelationships?: boolean;
}

type SkylarkSetGridProps = Omit<GridProps, "objects"> & { set: SkylarkSet };

const GridContainer = ({
  children,
  className,
  count,
  displayCount,
  header,
}: Pick<GridProps, "className" | "displayCount" | "header"> & {
  count: number;
  children: ReactNode;
}) => (
  <div className={className}>
    <RailHeader count={count} displayCount={displayCount} header={header} />
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 px-gutter py-2 sm:px-sm-gutter md:grid-cols-3 md:px-md-gutter md:py-4 lg:grid-cols-4 lg:px-lg-gutter xl:px-xl-gutter 2xl:grid-cols-6">
      {children}
    </div>
  </div>
);

export const Grid = ({
  header,
  displayCount,
  objects,
  variant,
  className,
}: GridProps) => (
  <GridContainer
    className={className}
    count={objects.length}
    displayCount={displayCount}
    header={header}
  >
    {objects?.map((object) =>
      object ? (
        <Thumbnail
          data={object}
          externalId={object.external_id}
          key={object.uid}
          slug={object.slug}
          uid={object.uid}
          variant={variant}
        />
      ) : (
        <></>
      ),
    )}
  </GridContainer>
);

export const GridWithSelfFetch = ({
  header,
  displayCount,
  objects,
  variant,
  className,
  fetchAdditionalRelationships,
}: GridProps) => (
  <GridContainer
    className={className}
    count={objects.length}
    displayCount={displayCount}
    header={header}
  >
    {objects?.map((object) =>
      object && hasProperty(object, "__typename") ? (
        <ThumbnailWithSelfFetch
          externalId={object.external_id}
          fetchAdditionalRelationships={fetchAdditionalRelationships}
          key={object.uid}
          objectType={object.__typename as ObjectTypes}
          slug={object.slug}
          uid={object.uid}
          variant={variant}
        />
      ) : (
        <></>
      ),
    )}
  </GridContainer>
);

export const SkylarkSetGrid = ({
  set,
  variant,
  ...props
}: SkylarkSetGridProps) => {
  const { data, isLoading } = useObject<SkylarkSet>(GET_SET_FOR_RAIL, set.uid);

  const setContent = (data?.content?.objects || set.content?.objects) as
    | SetContent[]
    | undefined;

  return (
    <GridContainer
      {...props}
      count={setContent?.length || 0}
      displayCount={!!setContent}
    >
      {setContent?.map(({ object }) =>
        object ? (
          <Thumbnail
            data={object}
            externalId={object.external_id}
            isLoading={isLoading}
            key={object.uid}
            slug={object.slug}
            uid={object.uid}
            variant={variant}
          />
        ) : null,
      )}
    </GridContainer>
  );
};
