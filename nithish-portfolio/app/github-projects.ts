export type GitHubProject = {
  id: number
  name: string
  html_url: string
  homepage: string | null
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  topics: string[]
  updated_at: string
  fork: boolean
  archived: boolean
}

const GITHUB_USERNAME = "Nithish464"

export async function getGitHubProjects(): Promise<GitHubProject[]> {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
      {
        next: {
          revalidate: 3600,
        },
        headers: {
          Accept: "application/vnd.github+json",
        },
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const repos: GitHubProject[] = await response.json()

    return repos
      .filter(
        (repo) =>
          !repo.fork &&
          !repo.archived &&
          repo.name !== "nithishkumar-portfolio"
      )
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() -
          new Date(a.updated_at).getTime()
      )
  } catch (error) {
    console.error("Failed to fetch GitHub repositories:", error)

    return []
  }
}