"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { setLayout, setGithubUsername } from "@/lib/store/settingsSlice";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();
  const settings = useSelector((state: RootState) => state.settings);
  const [username, setUsername] = useState(settings.githubUsername);
  const [showNotification, setShowNotification] = useState(false);

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setGithubUsername(username));
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000); // Hide after 3 seconds
  };

  return (
    <div className="space-y-6">
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transition-all">
          Username updated successfully!
        </div>
      )}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Appearance
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Theme
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Layout Density
            </label>
            <select
              value={settings.layout}
              onChange={(e) =>
                dispatch(setLayout(e.target.value as "compact" | "comfortable"))
              }
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="compact">Compact</option>
              <option value="comfortable">Comfortable</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          GitHub Settings
        </h2>
        <form onSubmit={handleUsernameSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              GitHub Username
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter GitHub username"
              />
              <button
                type="submit"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
