import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
const SecureRoute = () => {
  const { jwtToken, isLogged } = useSelector((state: any) => state.auth);
  return <>{jwtToken && isLogged ? <Outlet /> : <Navigate to={"/login"} />}</>;
};

export default SecureRoute;
