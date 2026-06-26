import { createContext } from "react";
import { initialPayState } from "./utils/initialPayState";

const PayContext = createContext(initialPayState);

export default PayContext;