import { createContext } from "react";
import { initialAppState } from "../../utils/initialAppState";

const AppContext = createContext(initialAppState);

export default AppContext;