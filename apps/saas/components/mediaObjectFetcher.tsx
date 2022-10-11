import React, { FC, ReactNode } from "react";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@skylark-reference-apps/react";
import { GraphQLObjectTypes } from "@skylark-reference-apps/lib";
import { useSingleObject } from "../hooks/useSingleObject";
import { Brand, Episode, Movie, Season, Set } from "../types/gql";

const Data: FC<{
  children(data: Episode | Movie | Season | Brand | Set): ReactNode;
  type: GraphQLObjectTypes;
  uid: string;
  isPortrait: boolean;
}> = ({ children, uid, type, isPortrait }) => {
  const { data, isLoading } = useSingleObject(type, uid);

  return !isLoading && data ? (
    <>{children(data)}</>
  ) : (
    <Skeleton isPortrait={isPortrait} show />
  );
};

export const MediaObjectFetcher: FC<{
  children(data: Episode | Movie | Season | Brand | Set): ReactNode;
  uid: string;
  type: GraphQLObjectTypes;
  isPortrait?: boolean;
}> = (props) => {
  const { children, uid, type, isPortrait = false } = props;
  const { ref, inView } = useInView({ triggerOnce: true });

  if (!uid) return <></>;

  return (
    <div ref={ref}>
      {inView ? (
        <Data isPortrait={isPortrait} type={type} uid={uid}>
          {children}
        </Data>
      ) : (
        <Skeleton isPortrait={isPortrait} show />
      )}
    </div>
  );
};
