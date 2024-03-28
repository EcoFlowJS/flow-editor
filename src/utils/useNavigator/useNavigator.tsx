import { NavigateOptions, useLocation, useNavigate } from "react-router-dom";

const useNavigator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (to: string, options?: NavigateOptions) => {
    if (!to.startsWith("/editor/flow")) to = "/editor/flow/" + to;
    if (location.pathname !== to) navigate(to, options);
  };
};

export default useNavigator;
