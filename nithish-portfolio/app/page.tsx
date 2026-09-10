"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import {
  featured,
  profile,
  skills,
  experience,
  education,
} from "../data/portfolio"
import {
  getGitHubProjects,
  type GitHubProject,
} from "./github-projects"

const cats = ["All", "AI / ML", "GenAI", "Full Stack", "Backend", "Data"]

function infer(repo: GitHubProject) {
  const text = (
    repo.name +
    " " +
    (repo.description || "") +
    " " +
    (repo.topics || []).join(" ")
  ).toLowerCase()

  if (
    /rag|llm|gemini|genai|agent|voicebot|nlp|resume-screener/.test(text)
  ) {
    return "GenAI"
  }

  if (
    /react|next|node|mern|portal|shop|chat|scheduler|hms/.test(text)
  ) {
    return "Full Stack"
  }

  if (/flask|fastapi|api|backend|pipeline|docker/.test(text)) {
    return "Backend"
  }

  if (
    /pandas|analysis|analytics|forecast|prediction|stock|fraud|retinopathy|sentiment|ipl|supply|churn|attrition|ml/.test(
      text
    )
  ) {
    return "AI / ML"
  }

  return "Data"
}

export default function Home() {
  const emailHref = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${encodeURIComponent(
    profile.email
  )}`

  const phoneHref = `tel:${profile.phone.replace(/[^+\d]/g, "")}`

  const whatsappHref = `https://wa.me/${profile.phone.replace(/\D/g, "")}`

  const [repos, setRepos] = useState<GitHubProject[]>([])
  const [filter, setFilter] = useState("All")
  const [q, setQ] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadProjects() {
      try {
        const projects = await getGitHubProjects()

        if (mounted) {
          setRepos(projects)
        }
      } catch (error) {
        console.error("Failed to load GitHub projects:", error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadProjects()

    return () => {
      mounted = false
    }
  }, [])

  const list = useMemo(() => {
    const search = q.toLowerCase().trim()

    return repos.filter((repo) => {
      const categoryMatch =
        filter === "All" || infer(repo) === filter

      const searchText = (
        repo.name +
        " " +
        (repo.description || "") +
        " " +
        (repo.language || "") +
        " " +
        (repo.topics || []).join(" ")
      ).toLowerCase()

      const searchMatch =
        search === "" || searchText.includes(search)

      return categoryMatch && searchMatch
    })
  }, [repos, filter, q])

  return (
    <main>
      {/* NAVIGATION */}
      <nav className="nav">
        <a className="brand" href="#home">
          NK<span>.</span>
        </a>

        <div className="navlinks">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>

        <a
          className="navcta"
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Resume ↗
        </a>
      </nav>

      {/* HERO */}
      <section id="home" className="hero wrap">
        <div className="heroCopy">
          <div className="eyebrow">
            AVAILABLE FOR OPPORTUNITIES · 2026
          </div>

          <h1>
            Building <span>intelligent</span>
            <br />
            products that ship.
          </h1>

          <p className="lead">
            I’m Nithishkumar — a Full-Stack Developer and Data Science
            graduate focused on AI, GenAI, scalable APIs and polished
            product experiences.
          </p>

          <div className="actions">
            <a className="primary" href="#projects">
              Explore Projects ↓
            </a>

            <a
              className="ghost"
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
          </div>

          <div className="miniStats">
            <div>
              <b>{repos.length || "40+"}</b>
              <small>Repositories</small>
            </div>

            <div>
              <b>4</b>
              <small>Featured Builds</small>
            </div>

            <div>
              <b>AI + Web</b>
              <small>Core Focus</small>
            </div>
          </div>
        </div>

        <div className="portraitWrap">
          <div className="orb orb1" />
          <div className="orb orb2" />

          <div className="portrait">
            <Image
              src="/profile.jpg"
              alt="Nithishkumar K"
              fill
              priority
              sizes="420px"
            />
          </div>

          <div className="floatCard">
            <span>✦</span>

            <div>
              <b>AI × Full Stack</b>
              <small>Build · Integrate · Ship</small>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section wrap">
        <div className="sectionHead">
          <span>01</span>
          <h2>About</h2>
        </div>

        <div className="aboutGrid">
          <div>
            <p className="bigText">
              I turn ideas into usable software — from responsive interfaces
              and REST APIs to RAG systems, LLM workflows and data-driven
              applications.
            </p>

            <p className="aboutSummary">
              I’m a Data Science graduate with hands-on experience across
              full-stack development, backend engineering, analytics, AI and
              GenAI. I enjoy designing reliable APIs, building responsive
              products, integrating LLMs and turning complex data into
              practical solutions. My projects span asynchronous systems,
              RAG-based knowledge assistants, AI-powered applications,
              authentication and role-based platforms.
            </p>

            <p className="aboutSummary">
              I’m currently focused on opportunities where I can contribute
              as a Full-Stack, Backend, AI or GenAI Developer while
              continuing to build production-minded software.
            </p>
          </div>

          <div className="aboutCard">
            <div>
              <b>Based in</b>
              <span>Coimbatore, India</span>
            </div>

            <div>
              <b>Education</b>
              <span>Integrated M.Sc. Data Science</span>
            </div>

            <div>
              <b>Focus</b>
              <span>Full Stack · AI · GenAI</span>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="section wrap">
        <div className="sectionHead">
          <span>02</span>
          <h2>Technical Stack</h2>
        </div>

        <div className="skillGrid">
          {Object.entries(skills).map(([k, v]) => (
            <div className="skillCard" key={k}>
              <h3>{k}</h3>

              <div className="chips">
                {v.map((x) => (
                  <span key={x}>{x}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="section wrap">
        <div className="sectionHead">
          <span>03</span>
          <h2>Experience</h2>
        </div>

        <div className="timeline">
          {experience.map((e, i) => (
            <article className="exp" key={e.company}>
              <div className="dot">0{i + 1}</div>

              <div className="expBody">
                <div className="expTop">
                  <div>
                    <h3>{e.role}</h3>
                    <p>{e.company}</p>
                  </div>

                  <time>{e.period}</time>
                </div>

                <p className="muted">{e.text}</p>

                <div className="chips">
                  {e.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="section wrap">
        <div className="sectionHead">
          <span>04</span>
          <h2>Selected Projects</h2>

          <p>
            Featured builds first. Every project links directly to GitHub.
          </p>
        </div>

        {/* FEATURED PROJECTS */}
        <div className="featuredGrid">
          {featured.map((p, i) => (
            <a
              className="projectCard"
              href={`https://github.com/Nithish464/${p.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              key={p.repo}
            >
              <div className="projectNum">
                0{i + 1}
              </div>

              <div className="projectArrow">
                ↗
              </div>

              <div className="projectMeta">
                {p.category}
              </div>

              <h3>
                {p.title}
              </h3>

              <p>
                {p.desc}
              </p>

              <div className="chips">
                {p.tech.map((t) => (
                  <span key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>

        {/* ALL GITHUB PROJECTS */}
        <div className="allProjects">
          <div className="allTop">
            <div>
              <div className="eyebrow">
                FULL REPOSITORY SHOWCASE
              </div>

              <h3>
                All GitHub Projects
              </h3>
            </div>

            <div className="repoCount">
              {loading
                ? "Loading..."
                : `${repos.length} repos`}
            </div>
          </div>

          {/* FILTERS */}
          <div className="filters">
            {cats.map((category) => (
              <button
                type="button"
                className={
                  filter === category
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter(category)
                }
                key={category}
              >
                {category}
              </button>
            ))}

            <input
              value={q}
              onChange={(e) =>
                setQ(e.target.value)
              }
              placeholder="Search projects..."
              aria-label="Search projects"
            />
          </div>

          {/* LOADING */}
          {loading && (
            <div className="projectsEmpty">
              Loading GitHub projects...
            </div>
          )}

          {/* REPOSITORIES */}
          {!loading && (
            <div className="repoGrid">
              {list.map((repo) => (
                <a
                  className="repoCard"
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={repo.id}
                >
                  <div className="repoTop">
                    <span className="langDot" />

                    {repo.language || "Project"}

                    <span>
                      ↗
                    </span>
                  </div>

                  <h4>
                    {repo.name
                      .replaceAll("-", " ")
                      .replace(
                        /\b\w/g,
                        (char) =>
                          char.toUpperCase()
                      )}
                  </h4>

                  <p>
                    {repo.description ||
                      "Explore this repository on GitHub."}
                  </p>

                  <div className="repoFoot">
                    <span>
                      ★ {repo.stargazers_count}
                    </span>

                    <span>
                      ⑂ {repo.forks_count}
                    </span>

                    <span>
                      {infer(repo)}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* NO RESULTS */}
          {!loading && list.length === 0 && (
            <div className="projectsEmpty">
              No projects found for this search or category.
            </div>
          )}
        </div>
      </section>

      {/* EDUCATION */}
      <section className="section wrap">
        <div className="sectionHead">
          <span>05</span>
          <h2>Education</h2>
        </div>

        <div className="education">
          {education.map((e) => (
            <div
              className="edu"
              key={e[0]}
            >
              <div>
                <h3>{e[0]}</h3>
                <p>{e[1]}</p>
              </div>

              <span>
                {e[2]}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact wrap">
        <div className="eyebrow">
          LET’S BUILD SOMETHING
        </div>

        <h2>
          Have a problem worth solving?
        </h2>

        <p>
          Open to full-stack, backend, AI and GenAI opportunities.
        </p>

        <div className="contactActions">
          <a
            className="primary"
            href={emailHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            Email Me ↗
          </a>

          <a
            className="ghost"
            href={phoneHref}
          >
            Call Me ↗
          </a>

          <a
            className="ghost"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp ↗
          </a>

          <a
            className="ghost"
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn ↗
          </a>

          <a
            className="ghost"
            href={profile.leetcode}
            target="_blank"
            rel="noopener noreferrer"
          >
            LeetCode ↗
          </a>
        </div>

        <div className="contactDetails">
          <a
            href={emailHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            ✉ {profile.email}
          </a>

          <a href={phoneHref}>
            ☎ {profile.phone}
          </a>

          <span>
            ⌖ {profile.location}
          </span>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <span>
          © 2026 Nithishkumar K
        </span>

        <span>
          Designed & built with intent.
        </span>

        <span>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>

          {" · "}

          <a
            href={emailHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            Email
          </a>
        </span>
      </footer>
    </main>
  )
}