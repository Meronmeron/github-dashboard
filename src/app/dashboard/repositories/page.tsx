"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { fetchUserRepos } from "@/lib/github";
import { Repository } from "@/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

export default function RepositoriesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const githubUsername = useSelector(
    (state: RootState) => state.settings.githubUsername
  );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const fetchRepos = async () => {
    try {
      setLoading(true);
      const newRepos = await fetchUserRepos(githubUsername, page);
      setRepos((prev) => [...prev, ...newRepos]);
      setHasMore(newRepos.length === 30);
    } catch (err) {
      setError("Failed to fetch repositories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, [page, githubUsername]);

  const languageStats = repos.reduce((acc: { [key: string]: number }, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {});

  const chartData = Object.entries(languageStats).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Language Distribution
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Repository List
          </h2>
          <div className="space-y-4">
            {repos.map((repo) => (
              <div
                key={repo.id}
                className="border dark:border-gray-700 rounded-lg p-4"
              >
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {repo.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {repo.description || "No description"}
                </p>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4 text-gray-500">
                    <span>⭐ {repo.stargazers_count}</span>
                    {repo.language && <span>🔵 {repo.language}</span>}
                  </div>
                  <span className="text-gray-400">
                    Updated: {new Date(repo.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {hasMore && !loading && (
            <button
              onClick={() => setPage((p) => p + 1)}
              className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Load More
            </button>
          )}
          {loading && (
            <div className="mt-4 text-center text-gray-500">Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
}
