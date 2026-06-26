import { createContext } from "react";
import { initialOrderState } from "../../utils/initialOrderState";

const OrderContext = createContext(initialOrderState);

export default OrderContext;