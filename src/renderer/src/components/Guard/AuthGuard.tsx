import SignIn from "@renderer/containers/Auth/SignIn";

const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = true;

  if (!isLoggedIn) {
    return <SignIn />;
  }

  return <div>{children}</div>;
};

export default AuthGuard;
