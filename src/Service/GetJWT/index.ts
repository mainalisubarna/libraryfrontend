import { useSelector } from "react-redux";

export const GET_JWT_TOKEN = () => {
  const { jwtToken } = useSelector((state: any) => state.auth);
  return jwtToken;
};
