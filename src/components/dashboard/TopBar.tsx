"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { RootState } from "@/lib/store/store";
import { logout } from "@/lib/store/authSlice";

export default function TopBar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const username = useSelector((state: RootState) => state.auth.username);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              GitHub Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
            >
              {theme === "dark" ? "🌞" : "🌙"}
            </button>
            <span className="text-gray-700 dark:text-gray-300">{username}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
