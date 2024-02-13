import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
const StudentRoute = () => {
  const { Role } = useSelector((state: any) => state.userDetails);
  return (
    <>{Role === "student" ? <Outlet /> : <Navigate to={"/PageNotFound"} />}</>
  );
};

export default StudentRoute;
