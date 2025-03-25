"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { fetchUserEvents } from "@/lib/github";
import { GithubEvent } from "@/types";

export default function ActivityPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<GithubEvent[]>([]);

  const githubUsername = useSelector(
    (state: RootState) => state.settings.githubUsername
  );

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const data = await fetchUserEvents(githubUsername);
        setEvents(data.slice(0, 10));
      } catch (err) {
        setError("Failed to fetch activity");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [githubUsername]);

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border-b dark:border-gray-700 last:border-0 pb-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {event.type.replace("Event", "")}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">
                    on {event.repo.name}
                  </span>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(event.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
