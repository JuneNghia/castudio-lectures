import JWTContext from "@renderer/provider/JWTProvider";
import { useContext } from "react";

const useAuth = () => useContext(JWTContext);

export default useAuth;
