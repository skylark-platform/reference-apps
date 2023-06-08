import React, { Fragment, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DimensionsDrawer } from "./dimensionsDrawer.component";

export const DimensionDrawer = () => {
  const queryClient = new QueryClient();

  console.log({ queryClient });

  return (
    <div id="skylark-dimensions-drawer">
      <QueryClientProvider client={queryClient}>
        <DimensionsDrawer />
      </QueryClientProvider>
    </div>
  );
};
