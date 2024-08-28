import SignIn from "@renderer/containers/Auth/SignIn";
import useAuth from "@renderer/hooks/useAuth";

const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <SignIn />;
  }
  
  return <div>{children}</div>;
};

export default AuthGuard;
