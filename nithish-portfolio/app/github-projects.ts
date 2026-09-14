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
  default_branch: string
  demoUrl: string | null
  qualityScore: number
}

type GitHubRepo = {
  id: number
  name: string
  html_url: string
  homepage: string | null
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  topics?: string[]
  updated_at: string
  fork: boolean
  archived: boolean
  default_branch: string
}

const GITHUB_USERNAME = "Nithish464"

const DEPLOYMENT_DOMAINS = [
  "vercel.app",
  "netlify.app",
  "github.io",
  "pages.dev",
  "onrender.com",
  "render.com",
  "railway.app",
  "fly.dev",
  "herokuapp.com",
  "azurewebsites.net",
]

const ENGINEERING_KEYWORDS = [
  "typescript",
  "javascript",
  "react",
  "next.js",
  "nextjs",
  "node.js",
  "nodejs",
  "express",
  "fastapi",
  "flask",
  "postgresql",
  "postgres",
  "mongodb",
  "mysql",
  "docker",
  "docker-compose",
  "redis",
  "kafka",
  "ci/cd",
  "github actions",
  "jwt",
  "selenium",
  "pytest",
  "playwright",
  "cypress",
  "machine learning",
  "deep learning",
  "generative ai",
  "genai",
  "rag",
  "llm",
  "artificial intelligence",
  "data engineering",
  "etl",
  "rest api",
  "api",
]

function normalizeUrl(url: string): string {
  const value = url.trim()

  if (/^https?:\/\//i.test(value)) {
    return value
  }

  return `https://${value}`
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(normalizeUrl(url))

    return (
      parsed.protocol === "http:" ||
      parsed.protocol === "https:"
    )
  } catch {
    return false
  }
}

function isDeploymentUrl(url: string): boolean {
  if (!isValidUrl(url)) {
    return false
  }

  try {
    const hostname = new URL(
      normalizeUrl(url)
    ).hostname.toLowerCase()

    return DEPLOYMENT_DOMAINS.some(
      domain =>
        hostname === domain ||
        hostname.endsWith(`.${domain}`)
    )
  } catch {
    return false
  }
}

function extractUrls(text: string): string[] {
  const matches = text.match(
    /https?:\/\/[^\s<>"')\]]+/gi
  )

  return matches || []
}

function findDemoUrl(
  repo: GitHubRepo,
  readme: string
): string | null {
  // 1. Repository homepage
  if (
    repo.homepage &&
    isDeploymentUrl(repo.homepage)
  ) {
    return normalizeUrl(repo.homepage)
  }

  // 2. Explicit README demo links
  const patterns = [
    /\[live\s*demo\]\((https?:\/\/[^)\s]+)\)/i,
    /\[demo\]\((https?:\/\/[^)\s]+)\)/i,
    /\[live\s*site\]\((https?:\/\/[^)\s]+)\)/i,
    /\[deployed\]\((https?:\/\/[^)\s]+)\)/i,
    /live\s*demo\s*[:\-]\s*(https?:\/\/[^\s]+)/i,
    /live\s*site\s*[:\-]\s*(https?:\/\/[^\s]+)/i,
    /demo\s*url\s*[:\-]\s*(https?:\/\/[^\s]+)/i,
    /demo\s*[:\-]\s*(https?:\/\/[^\s]+)/i,
    /deployment\s*[:\-]\s*(https?:\/\/[^\s]+)/i,
  ]

  for (const pattern of patterns) {
    const match = readme.match(pattern)

    if (match?.[1]) {
      const url = match[1].replace(
        /[.,;:]+$/,
        ""
      )

      if (isDeploymentUrl(url)) {
        return normalizeUrl(url)
      }
    }
  }

  // 3. Search README for deployment URLs
  const urls = extractUrls(readme)

  for (const url of urls) {
    const cleanedUrl = url.replace(
      /[.,;:]+$/,
      ""
    )

    if (isDeploymentUrl(cleanedUrl)) {
      return normalizeUrl(cleanedUrl)
    }
  }

  return null
}

function calculateQualityScore(
  repo: GitHubRepo,
  readme: string,
  demoUrl: string | null
): number {
  let score = 0

  const combinedText = `
    ${repo.name}
    ${repo.description || ""}
    ${repo.language || ""}
    ${(repo.topics || []).join(" ")}
    ${readme}
  `.toLowerCase()

  // Live demo
  if (demoUrl) {
    score += 100
  }

  // Description
  if (repo.description?.trim()) {
    score += 15
  }

  // Language
  if (repo.language) {
    score += 5
  }

  // Topics
  score += Math.min(
    (repo.topics?.length || 0) * 2,
    10
  )

  // README quality
  if (readme.length >= 500) {
    score += 10
  }

  if (readme.length >= 1500) {
    score += 10
  }

  // Documentation
  if (
    /installation|install|setup|getting started|usage/i.test(
      readme
    )
  ) {
    score += 5
  }

  if (/features|feature/i.test(readme)) {
    score += 5
  }

  if (
    /architecture|system architecture|workflow|system design/i.test(
      readme
    )
  ) {
    score += 8
  }

  // Testing
  if (
    /testing|tests|test cases|pytest|selenium|playwright|cypress/i.test(
      readme
    )
  ) {
    score += 5
  }

  // Engineering technologies
  const matchedKeywords = new Set<string>()

  for (const keyword of ENGINEERING_KEYWORDS) {
    if (combinedText.includes(keyword)) {
      matchedKeywords.add(keyword)
    }
  }

  score += Math.min(
    matchedKeywords.size,
    20
  )

  // Stars
  score += Math.min(
    repo.stargazers_count * 5,
    40
  )

  // Forks
  score += Math.min(
    repo.forks_count * 5,
    25
  )

  // Recent activity
  const updatedAt = new Date(
    repo.updated_at
  ).getTime()

  const daysSinceUpdate =
    (Date.now() - updatedAt) /
    (1000 * 60 * 60 * 24)

  if (daysSinceUpdate <= 30) {
    score += 20
  } else if (daysSinceUpdate <= 90) {
    score += 15
  } else if (daysSinceUpdate <= 180) {
    score += 10
  } else if (daysSinceUpdate <= 365) {
    score += 5
  }

  return score
}

async function fetchRepositories(): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
      {
        headers: {
          Accept:
            "application/vnd.github+json",
          "X-GitHub-Api-Version":
            "2022-11-28",
        },
        next: {
          revalidate: 3600,
        },
      }
    )

    console.log(
      "GitHub API status:",
      response.status
    )

    if (!response.ok) {
      const errorText =
        await response.text()

      console.error(
        "GitHub API error:",
        response.status,
        errorText
      )

      return []
    }

    const repos: GitHubRepo[] =
      await response.json()

    console.log(
      "GitHub repos received:",
      repos.length
    )

    return repos
      .filter(
        repo =>
          !repo.fork &&
          !repo.archived &&
          repo.name !==
            "nithishkumar-portfolio"
      )
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() -
          new Date(a.updated_at).getTime()
      )
  } catch (error) {
    console.error(
      "GitHub repository fetch failed:",
      error
    )

    return []
  }
}

async function fetchReadme(
  repo: GitHubRepo
): Promise<string> {
  const branch =
    repo.default_branch || "main"

  const url =
    `https://raw.githubusercontent.com/` +
    `${GITHUB_USERNAME}/` +
    `${repo.name}/` +
    `${branch}/README.md`

  try {
    const response = await fetch(url, {
      next: {
        revalidate: 3600,
      },
    })

    if (!response.ok) {
      return ""
    }

    return await response.text()
  } catch {
    return ""
  }
}

async function enrichRepository(
  repo: GitHubRepo
): Promise<GitHubProject> {
  const readme =
    await fetchReadme(repo)

  const demoUrl =
    findDemoUrl(repo, readme)

  const qualityScore =
    calculateQualityScore(
      repo,
      readme,
      demoUrl
    )

  return {
    id: repo.id,
    name: repo.name,
    html_url: repo.html_url,
    homepage: repo.homepage,
    description: repo.description,
    language: repo.language,
    stargazers_count:
      repo.stargazers_count,
    forks_count:
      repo.forks_count,
    topics:
      repo.topics || [],
    updated_at:
      repo.updated_at,
    fork: repo.fork,
    archived:
      repo.archived,
    default_branch:
      repo.default_branch,
    demoUrl,
    qualityScore,
  }
}

export async function getGitHubProjects(): Promise<
  GitHubProject[]
> {
  const repositories =
    await fetchRepositories()

  if (repositories.length === 0) {
    return []
  }

  const results =
    await Promise.allSettled(
      repositories.map(repo =>
        enrichRepository(repo)
      )
    )

  const projects: GitHubProject[] = []

  for (const result of results) {
    if (
      result.status === "fulfilled"
    ) {
      projects.push(result.value)
    }
  }

  return projects.sort(
    (a, b) =>
      new Date(b.updated_at).getTime() -
      new Date(a.updated_at).getTime()
  )
}