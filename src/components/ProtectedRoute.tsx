import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const { token, user } = useSelector((state: any) => state.auth);

  return token && user ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
