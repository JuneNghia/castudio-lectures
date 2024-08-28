import { RoleEnum } from "@renderer/common/enum";
import AdminPage from "@renderer/components/Admin";
import UserPage from "@renderer/components/User";
import useAuth from "@renderer/hooks/useAuth";

const Homepage = () => {
  const { user } = useAuth();
  return user?.role === RoleEnum.ADMIN ? <AdminPage /> : <UserPage />;
};

export default Homepage;
