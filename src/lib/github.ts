const GITHUB_API_BASE = "https://api.github.com";

export async function fetchUserProfile(username: string) {
  const response = await fetch(`${GITHUB_API_BASE}/users/${username}`);
  if (!response.ok) throw new Error("Failed to fetch user profile");
  return response.json();
}

export async function fetchUserRepos(username: string, page = 1, perPage = 30) {
  const response = await fetch(
    `${GITHUB_API_BASE}/users/${username}/repos?page=${page}&per_page=${perPage}&sort=updated`
  );
  if (!response.ok) throw new Error("Failed to fetch repositories");
  return response.json();
}

export async function fetchUserEvents(username: string) {
  const response = await fetch(
    `${GITHUB_API_BASE}/users/${username}/events/public`
  );
  if (!response.ok) throw new Error("Failed to fetch user events");
  return response.json();
}
