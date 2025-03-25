"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Image from "next/image";
import { RootState } from "@/lib/store/store";
import { fetchUserProfile, fetchUserRepos } from "@/lib/github";
import { User, Repository } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [topRepos, setTopRepos] = useState<Repository[]>([]);

  const githubUsername = useSelector(
    (state: RootState) => state.settings.githubUsername
  );

  useEffect(() => {
    // Check both Redux state and localStorage as well as cookie
    const localAuth = localStorage.getItem("isAuthenticated") === "true";
    const cookieAuth = document.cookie.includes("isAuthenticated=true");

    if (!isAuthenticated && !localAuth && !cookieAuth) {
      router.push("/");
    } else if (!isAuthenticated && (localAuth || cookieAuth)) {
      // If localStorage or cookie has auth but Redux doesn't (after page refresh)
      const username = localStorage.getItem("githubUsername") || "";
      // If you have a restore auth action in your Redux store
      // dispatch(restoreAuth(username));
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const userProfile = await fetchUserProfile(githubUsername);
        const repos = await fetchUserRepos(githubUsername);
        const sortedRepos = repos
          .sort(
            (a: Repository, b: Repository) =>
              b.stargazers_count - a.stargazers_count
          )
          .slice(0, 3);

        setProfile(userProfile);
        setTopRepos(sortedRepos);
      } catch (err) {
        setError("Failed to fetch GitHub data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [githubUsername]);

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="space-y-6">
        {profile && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center space-x-6">
                <Image
                  src={profile.avatar_url}
                  alt={profile.login}
                  width={100}
                  height={100}
                  className="rounded-full"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile.name || profile.login}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {profile.bio}
                  </p>
                  <div className="mt-4 flex space-x-6">
                    <div>
                      <span className="font-medium">
                        {profile.public_repos}
                      </span>
                      <span className="text-gray-500 ml-1">repositories</span>
                    </div>
                    <div>
                      <span className="font-medium">{profile.followers}</span>
                      <span className="text-gray-500 ml-1">followers</span>
                    </div>
                    <div>
                      <span className="font-medium">{profile.following}</span>
                      <span className="text-gray-500 ml-1">following</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Top Repositories
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                {topRepos.map((repo) => (
                  <div
                    key={repo.id}
                    className="border dark:border-gray-700 rounded-lg p-4"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {repo.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {repo.description || "No description"}
                    </p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span>⭐ {repo.stargazers_count}</span>
                      {repo.language && (
                        <span className="ml-4">🔵 {repo.language}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
