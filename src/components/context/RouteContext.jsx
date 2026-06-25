import { createContext } from "react";
import { initialRouteState } from "../../utils/initialRouteState";

const RouteContext = createContext(initialRouteState);

export default RouteContext;