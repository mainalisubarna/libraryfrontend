import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
const PrivateRoute = () => {
  const { Role } = useSelector((state: any) => state.userDetails);
  return (
    <>{Role === "admin" ? <Outlet /> : <Navigate to={"/PageNotFound"} />}</>
  );
};

export default PrivateRoute;
