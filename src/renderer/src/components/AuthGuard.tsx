import SignIn from "@renderer/containers/Auth/SignIn";

const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = false;

  if (!isLoggedIn) {
    return <SignIn />;
  }

  return <div>{children}</div>;
};

export default AuthGuard;
