import { createContext, useContext } from "react";

export const ConditionContext = createContext<string>("CONTROL");
export const useCondition = () => useContext(ConditionContext);