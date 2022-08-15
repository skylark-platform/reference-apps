import React, { ReactNode } from "react";
// import { useSingleObjectByUid } from "../hooks/useSingleObjectByUid";
import { AllEntertainment } from "@skylark-reference-apps/lib";
import { useSingleObjectBySelf } from "../hooks/useSingleObjectBySelf";

export const Card: React.FC<{
  children(data: AllEntertainment): ReactNode;
  inView?: boolean;
  self: string;
}> = (props) => {
  const { children, self } = props;
  console.log("## self", self);
  const { data, isLoading } = useSingleObjectBySelf(self);
  console.log("## SINGLE DATA", data);

  if (!isLoading && data) return <div>{children(data)}</div>;
  // TODO NETWORK loading
  return <></>;
};
