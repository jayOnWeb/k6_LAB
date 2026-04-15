import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;