import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAccessToken } from "../../auth";

export default function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      const token = await getAccessToken();
      setIsAuth(!!token);
    }
    checkAuth();
  }, []);

  if (isAuth === null) return <p>Loading...</p>;

  return isAuth ? children : <Navigate to="/login" replace />;
}
