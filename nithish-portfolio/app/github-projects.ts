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
  demoUrl: string | null
  qualityScore: number
}

const GITHUB_USERNAME = "Nithish464"

const DEMO_DOMAINS = [
  "vercel.app",
  "netlify.app",
  "onrender.com",
  "railway.app",
  "pages.dev",
  "web.app",
  "firebaseapp.com",
  "streamlit.app",
  "hf.space",
]

function isValidUrl(value: string) {
  try {
    const url = new URL(value)

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    )
  } catch {
    return false
  }
}

function cleanUrl(value: string) {
  return value
    .trim()
    .replace(/[),.;]+$/, "")
    .replace(/^<|>$/g, "")
}

function isDemoUrl(value: string) {
  const url = cleanUrl(value)

  if (!isValidUrl(url)) {
    return false
  }

  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname.toLowerCase()

    return DEMO_DOMAINS.some(
      (domain) =>
        hostname === domain ||
        hostname.endsWith(`.${domain}`)
    )
  } catch {
    return false
  }
}

function extractDemoUrl(readme: string): string | null {
  if (!readme) {
    return null
  }

  /*
   * Examples:
   *
   * [Live Demo](https://...)
   * [Demo](https://...)
   * [View Demo](https://...)
   * [Website](https://...)
   */
  const markdownLinkRegex =
    /\[(?:live\s*demo|demo|live|view\s*demo|website|live\s*site|deployed\s*app)\]\(\s*(https?:\/\/[^\s)]+)\s*\)/gi

  const markdownMatches = [
    ...readme.matchAll(markdownLinkRegex),
  ]

  for (const match of markdownMatches) {
    const url = cleanUrl(match[1])

    if (isValidUrl(url)) {
      return url
    }
  }

  /*
   * Examples:
   *
   * Live Demo: https://...
   * Demo: https://...
   * Live URL: https://...
   * Deployed App: https://...
   */
  const labelledUrlRegex =
    /(?:live\s*demo|demo|live\s*url|live\s*site|website|deployed\s*app|deployment|try\s*it\s*live)\s*[:\-]\s*(https?:\/\/[^\s<>"')]+)\b/gi

  const labelledMatches = [
    ...readme.matchAll(labelledUrlRegex),
  ]

  for (const match of labelledMatches) {
    const url = cleanUrl(match[1])

    if (isValidUrl(url)) {
      return url
    }
  }

  /*
   * Search common deployment URLs anywhere
   * inside README.
   */
  const genericUrlRegex =
    /https?:\/\/[^\s<>"')]+/gi

  const urls = [
    ...readme.matchAll(genericUrlRegex),
  ]

  for (const match of urls) {
    const url = cleanUrl(match[0])

    if (isDemoUrl(url)) {
      return url
    }
  }

  return null
}

async function fetchReadme(
  owner: string,
  repo: string
): Promise<string> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        next: {
          revalidate: 3600,
        },
        headers: {
          Accept: "application/vnd.github.raw+json",
        },
      }
    )

    if (!response.ok) {
      return ""
    }

    return await response.text()
  } catch {
    return ""
  }
}

function calculateQualityScore(
  repo: GitHubProject,
  demoUrl: string | null,
  readme: string
) {
  let score = 0

  const text = readme.toLowerCase()

  /*
   * ==========================================
   * LIVE / DEMO
   * ==========================================
   */

  if (demoUrl) {
    score += 100
  }

  /*
   * ==========================================
   * PROJECT COMPLETENESS
   * ==========================================
   */

  if (repo.description?.trim()) {
    score += 15
  }

  if (repo.language) {
    score += 5
  }

  if (repo.topics?.length) {
    score += Math.min(
      repo.topics.length * 2,
      10
    )
  }

  /*
   * ==========================================
   * README QUALITY
   * ==========================================
   */

  if (readme.length >= 500) {
    score += 10
  }

  if (readme.length >= 1500) {
    score += 10
  }

  /*
   * README important sections
   */

  if (
    /installation|setup|getting started/.test(text)
  ) {
    score += 5
  }

  if (
    /features|key features/.test(text)
  ) {
    score += 5
  }

  if (
    /architecture|system architecture/.test(text)
  ) {
    score += 8
  }

  if (
    /testing|test cases|pytest|selenium|playwright|cypress/.test(
      text
    )
  ) {
    score += 5
  }

  /*
   * ==========================================
   * ENGINEERING SIGNALS
   * ==========================================
   */

  const engineeringKeywords = [
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
    "mongodb",
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
  ]

  const matchedKeywords =
    engineeringKeywords.filter(
      (keyword) => text.includes(keyword)
    ).length

  score += Math.min(
    matchedKeywords * 2,
    20
  )

  /*
   * ==========================================
   * GITHUB POPULARITY
   * ==========================================
   */

  score += Math.min(
    repo.stargazers_count * 8,
    40
  )

  score += Math.min(
    repo.forks_count * 5,
    25
  )

  /*
   * ==========================================
   * RECENT ACTIVITY
   * ==========================================
   */

  const updatedTime =
    new Date(repo.updated_at).getTime()

  const now = Date.now()

  const daysSinceUpdate =
    Math.max(now - updatedTime, 0) /
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

export async function getGitHubProjects(): Promise<
  GitHubProject[]
> {
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
      throw new Error(
        `GitHub API error: ${response.status}`
      )
    }

    const repos: GitHubProject[] =
      await response.json()

    const filteredRepos = repos.filter(
      (repo) =>
        !repo.fork &&
        !repo.archived &&
        repo.name !==
          "nithishkumar-portfolio"
    )

    /*
     * Analyze every repository.
     *
     * README is checked for:
     * - Live Demo
     * - Deployment URL
     * - Features
     * - Architecture
     * - Testing
     * - Technologies
     */
    const projects = await Promise.all(
      filteredRepos.map(async (repo) => {
        const readme = await fetchReadme(
          GITHUB_USERNAME,
          repo.name
        )

        const homepage =
          repo.homepage?.trim() &&
          isValidUrl(repo.homepage.trim())
            ? repo.homepage.trim()
            : null

        const demoUrl =
          homepage ||
          extractDemoUrl(readme)

        const qualityScore =
          calculateQualityScore(
            repo,
            demoUrl,
            readme
          )

        return {
          ...repo,
          demoUrl,
          qualityScore,
        }
      })
    )

    /*
     * Keep normal repository order by latest update.
     *
     * Selected Projects are sorted separately
     * in page.tsx using qualityScore.
     */
    return projects.sort(
      (a, b) =>
        new Date(
          b.updated_at
        ).getTime() -
        new Date(
          a.updated_at
        ).getTime()
    )
  } catch (error) {
    console.error(
      "Failed to fetch GitHub repositories:",
      error
    )

    return []
  }
}