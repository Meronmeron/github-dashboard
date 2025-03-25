export interface User {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
}

export interface Repository {
  id: number;
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  updated_at: string;
}

export interface GithubEvent {
  id: string;
  type: string;
  created_at: string;
  actor: {
    login: string;
  };
  repo: {
    name: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  username: string;
}

export interface SettingsState {
  layout: "compact" | "comfortable";
  githubUsername: string;
}
