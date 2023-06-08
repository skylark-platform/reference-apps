import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/700.css";
import "@fontsource/inter";

import "./index.css";
import { AvailabilityModifier } from "./components/availabilityModifier";
import { Header } from "./components/header";
import { Footer } from "./components/footer";

export const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-full flex-grow flex-col items-start justify-start bg-white font-body">
        <Header />
        <main className="flex h-full w-full flex-grow px-4">
          <AvailabilityModifier />
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
};

export default App;
