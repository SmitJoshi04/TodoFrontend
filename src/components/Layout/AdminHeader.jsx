import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { clearTokens, logoutApi } from "../../services/auth";
import { queryClient } from "../../lib/queryClient";
import { User, Settings, LogOut, Menu, X } from "lucide-react";

const AdminHeader = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const { mutate: logout, isLoading } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      clearTokens();
      queryClient.clear();
      navigate("/login");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      clearTokens();
      navigate("/login");
    },
  });

  const handleLogout = () => {
    logout();
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const NavLinks = ({ onClick }) => (
    <>
      <Link
        to="/admin"
        onClick={onClick}
        className="flex items-center text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition gap-2"
      >
        <User size={18} />
        User Management
      </Link>
      <Link
        to="/profile-admin"
        onClick={onClick}
        className="flex items-center text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition gap-2"
      >
        <Settings size={18} />
        Profile
      </Link>
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="flex items-center text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition w-full text-left gap-2"
      >
        <LogOut size={18} />
        {isLoading ? "Logging out..." : "Logout"}
      </button>
    </>
  );

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="ml-2 text-xl font-bold text-gray-900">Todos</h1>
          </div>

          <nav className="hidden md:flex space-x-4 items-center">
            <NavLinks />
          </nav>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="flex items-center text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition gap-1"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-white border-t border-gray-200">
          <NavLinks onClick={() => setMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
