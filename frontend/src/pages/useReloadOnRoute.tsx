import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useReloadOnRoute = (targetPath: string) => {
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname === targetPath &&
      !sessionStorage.getItem("reloaded")
    ) {
      sessionStorage.setItem("reloaded", "true");
      window.location.reload();
    }
  }, [location, targetPath]);
};

export default useReloadOnRoute;
