import React, { FC, ReactNode } from "react";
import { useInView } from "react-intersection-observer";
import { AllEntertainment } from "@skylark-reference-apps/lib";
import { Skeleton } from "@skylark-reference-apps/react";
import { useSingleObjectBySelf } from "../hooks/useSingleObjectBySelf";

const Data: FC<{
  children(data: AllEntertainment): ReactNode;
  self: string;
}> = ({ children, self }) => {
  const { data, isLoading } = useSingleObjectBySelf(self);

  return <>{!isLoading && data ? children(data) : <Skeleton show />}</>;
};

export const Card: FC<{
  children(data: AllEntertainment): ReactNode;
  self: string;
}> = (props) => {
  const { children, self } = props;
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <div ref={ref}>
      {inView ? <Data self={self}>{children}</Data> : <Skeleton show />}
    </div>
  );
};
