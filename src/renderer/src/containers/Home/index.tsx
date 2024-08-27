import AdminPage from "@renderer/components/Admin";
import UserPage from "@renderer/components/User";

const Homepage = () => {
  const isAdmin = false;
  return isAdmin ? <AdminPage /> : <UserPage />;
};

export default Homepage;
