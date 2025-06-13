import { Outlet } from "react-router-dom";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <UserHeader />
      <div className="flex-grow bg-gray-100">
        <Outlet />
      </div>
      <UserFooter />
    </div>
  );
};

export default UserLayout;
