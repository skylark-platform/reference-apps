import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/700.css";
import "@fontsource/inter";

import "./index.css";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { AvailabilityModifier } from "./components/availabilityModifier";

export const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen flex-grow flex-col items-start justify-start bg-white font-body">
        <Header />
        <main className="flex h-full w-full flex-grow px-4">
          <AvailabilityModifier className="mb-10" />
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
};

export default App;
