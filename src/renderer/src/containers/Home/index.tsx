import { RoleEnum } from "@renderer/common/enum";
import AdminPage from "@renderer/components/Admin";
import SupportPage from "@renderer/components/Support";
import UserPage from "@renderer/components/User";
import useAuth from "@renderer/hooks/useAuth";

const Homepage = () => {
  const { user } = useAuth();
  return user?.role === RoleEnum.ADMIN ? (
    <AdminPage />
  ) : user?.role === RoleEnum.SUPPORT ? (
    <SupportPage />
  ) : (
    <UserPage />
  );
};

export default Homepage;
