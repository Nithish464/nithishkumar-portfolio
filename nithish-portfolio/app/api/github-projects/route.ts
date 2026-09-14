import { NextResponse } from "next/server"
import { getGitHubProjects } from "../../github-projects"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const projects = await getGitHubProjects()

    return NextResponse.json(projects, {
      status: 200,
      headers: {
        "Cache-Control":
          "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    console.error(
      "GitHub projects API route error:",
      error
    )

    return NextResponse.json(
      {
        error: "Failed to load GitHub projects",
        projects: [],
      },
      { status: 500 }
    )
  }
}