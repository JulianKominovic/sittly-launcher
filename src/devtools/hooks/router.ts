import { useLocation, useNavigate } from "react-router";

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  function goBack() {
    return navigate(-1);
  }
  function goForward() {
    return navigate(1);
  }
  function goTo(path: string) {
    return navigate(path);
  }
  function goToHome() {
    return navigate("/");
  }
  function reload() {
    return window.location.reload();
  }

  return {
    goBack,
    goForward,
    goTo,
    goToHome,
    location,
    reload,
  };
}
