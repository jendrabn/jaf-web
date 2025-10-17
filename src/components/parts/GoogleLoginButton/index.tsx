import type { LoginTypes } from "@/types/auth";
import fetchApi from "@/utils/api";
import { setAuthToken, setSelectedCartIds } from "@/utils/functions";
import { useGoogleLogin } from "@react-oauth/google";
import { Button, Image } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router";

const GoogleLoginButton = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const login = useGoogleLogin({
    onError: (error) => console.log("Login Failed:", error),
    onSuccess: (codeResponse) => {
      fetchApi()
        .post<LoginTypes, LoginTypes>("/auth/google", {
          token: codeResponse.access_token,
        })
        .then((data) => {
          setAuthToken(data.auth_token);

          setSelectedCartIds([]);

          navigate(location.state?.from || "/", { replace: true });

          window.location.reload();
        });
    },
  });

  return (
    <Button
      variant="outline-light"
      type="button"
      className="d-flex justify-content-center align-items-center gap-2"
      onClick={() => login()}
    >
      <Image
        src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
        alt="Google"
      />
      Log in dengan Google
    </Button>
  );
};

export default GoogleLoginButton;
