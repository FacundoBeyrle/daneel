import { useState } from "react";
import "./App.css";
import { Head } from "@impalajs/react/head";
import { ConditionContext } from "./utils/CondContext";

interface AppProps {
  title: string;
  condition: string | null;
}

export const App: React.FC<React.PropsWithChildren<AppProps>> = ({
  children,
  title,
  condition,
}) => {
  return (
    <>
    <ConditionContext.Provider value={condition ?? "CONTROL"}>
      <Head>
        <title>{`${title} ${condition}`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Create your own AI chat bot" />
      </Head>
      {children}
    </ConditionContext.Provider>
    </>
  );
};
