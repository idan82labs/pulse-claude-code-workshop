import {
  ArrowRight,
  Briefcase,
  Bug,
  CalendarBlank,
  CheckCircle,
  CircleNotch,
  ClockCounterClockwise,
  FolderOpen,
  MagnifyingGlass,
  Pulse,
  SlidersHorizontal,
  WarningCircle
} from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { loadDashboard } from "./api";
import type { Activity, PortfolioSummary, Project, ProjectStatus } from "../shared/types";

type DashboardData = {
  summary: PortfolioSummary;
  projects: Project[];
  activities: Activity[];
};

const statusLabels: Record<ProjectStatus, string> = {
  planning: "Planning",
  active: "Active",
  blocked: "Blocked",
  complete: "Complete"
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(
    new Date(`${value}T12:00:00.000Z`)
  );
}

function formatActivityTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "all">("all");

  useEffect(() => {
    loadDashboard().then(setData).catch((reason: unknown) => {
      setError(reason instanceof Error ? reason.message : "Unable to load the dashboard");
    });
  }, []);

  const visibleProjects = useMemo(() => {
    if (!data) return [];
    const query = search.trim().toLocaleLowerCase();
    return data.projects.filter((project) => {
      const matchesQuery =
        !query ||
        [project.name, project.owner, project.team, ...project.tags]
          .join(" ")
          .toLocaleLowerCase()
          .includes(query);
      const matchesStatus = status === "all" || project.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [data, search, status]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Skip to main content</a>
      <header className="topbar">
        <a className="brand" href="#main" aria-label="Pulse home">
          <span className="brand-mark" aria-hidden="true">
            <Pulse weight="bold" />
          </span>
          <span>Pulse</span>
        </a>
        <span className="environment-label">Workshop starter</span>
        <div className="user-chip" aria-label="Signed in as Alex Morgan">
          <span className="avatar">AM</span>
          <span className="user-name">Alex Morgan</span>
        </div>
      </header>

      <aside className="sidebar" aria-label="Primary navigation">
        <nav>
          <a className="nav-item active" href="#overview" aria-current="page">
            <Briefcase /> Overview
          </a>
          <a className="nav-item" href="#projects">
            <FolderOpen /> Projects
          </a>
          <a className="nav-item" href="#activity">
            <ClockCounterClockwise /> Activity
          </a>
        </nav>
        <div className="sidebar-note">
          <strong>Portfolio review</strong>
          <span>Wednesday, July 22</span>
        </div>
      </aside>

      <main id="main" className="main-content">
        <section className="page-heading" id="overview">
          <div>
            <p className="kicker">Delivery portfolio</p>
            <h1>See the work. Decide what matters.</h1>
            <p className="page-summary">
              A shared view of delivery progress, constraints and recent movement across teams.
            </p>
          </div>
          <button className="secondary-button" type="button">
            <CalendarBlank /> Jul 22, 2026
          </button>
        </section>

        {error ? <ErrorState message={error} /> : null}
        {!data && !error ? <LoadingState /> : null}

        {data ? (
          <>
            <SummaryStrip summary={data.summary} />
            <div className="content-grid">
              <section className="projects-panel" id="projects" aria-labelledby="projects-title">
                <div className="panel-heading">
                  <div>
                    <h2 id="projects-title">Projects</h2>
                    <p>{visibleProjects.length} shown across the portfolio</p>
                  </div>
                  <div className="filter-bar">
                    <label className="search-field">
                      <span className="sr-only">Search projects</span>
                      <MagnifyingGlass aria-hidden="true" />
                      <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search projects"
                      />
                    </label>
                    <label className="select-field">
                      <SlidersHorizontal aria-hidden="true" />
                      <span className="sr-only">Filter by status</span>
                      <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value as ProjectStatus | "all")}
                      >
                        <option value="all">All statuses</option>
                        <option value="planning">Planning</option>
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                        <option value="complete">Complete</option>
                      </select>
                    </label>
                  </div>
                </div>
                <ProjectTable projects={visibleProjects} />
              </section>

              <section className="activity-panel" id="activity" aria-labelledby="activity-title">
                <div className="panel-heading compact">
                  <div>
                    <h2 id="activity-title">Recent movement</h2>
                    <p>Latest recorded updates</p>
                  </div>
                </div>
                <ol className="activity-list">
                  {data.activities.map((activity) => (
                    <li key={activity.id}>
                      <span className="activity-marker" aria-hidden="true" />
                      <div>
                        <p>
                          <strong>{activity.actor}</strong> {activity.verb} {activity.detail}
                        </p>
                        <a href={`#${activity.projectId}`}>{activity.projectName}</a>
                        <time dateTime={activity.createdAt}>{formatActivityTime(activity.createdAt)}</time>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}

function SummaryStrip({ summary }: { summary: PortfolioSummary }) {
  const metrics = [
    { label: "Active projects", value: summary.activeProjects, icon: Briefcase },
    { label: "Due in 7 days", value: summary.dueSoon, icon: CalendarBlank },
    { label: "Blocked tasks", value: summary.blockedTasks, icon: WarningCircle },
    { label: "Open bugs", value: summary.openBugs, icon: Bug }
  ];

  return (
    <section className="summary-strip" aria-label="Portfolio summary">
      {metrics.map(({ label, value, icon: Icon }) => (
        <div className="metric" key={label}>
          <span className="metric-icon" aria-hidden="true"><Icon /></span>
          <div>
            <span className="metric-label">{label}</span>
            <strong>{value}</strong>
          </div>
        </div>
      ))}
    </section>
  );
}

function ProjectTable({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <div className="empty-state">
        <MagnifyingGlass aria-hidden="true" />
        <h3>No matching projects</h3>
        <p>Try a different search term or status.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">Project</th>
            <th scope="col">Status</th>
            <th scope="col">Progress</th>
            <th scope="col">Deadline</th>
            <th scope="col">Blocked</th>
            <th scope="col"><span className="sr-only">Open project</span></th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} id={project.id}>
              <td>
                <div className="project-cell">
                  <span className="avatar small">{project.ownerInitials}</span>
                  <div>
                    <strong>{project.name}</strong>
                    <span>{project.team} · {project.owner}</span>
                  </div>
                </div>
              </td>
              <td><StatusBadge status={project.status} /></td>
              <td>
                <div className="progress-cell">
                  <div className="progress-track" aria-hidden="true">
                    <span style={{ width: `${project.progress}%` }} />
                  </div>
                  <span>{project.progress}%</span>
                </div>
              </td>
              <td><time dateTime={project.deadline}>{formatDate(project.deadline)}</time></td>
              <td>
                <span className={project.blockedTasks > 0 ? "blocked-count" : "muted-count"}>
                  {project.blockedTasks}
                </span>
              </td>
              <td>
                <button className="icon-button" type="button" aria-label={`Open ${project.name}`}>
                  <ArrowRight />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  const Icon = status === "complete" ? CheckCircle : status === "blocked" ? WarningCircle : CircleNotch;
  return (
    <span className={`status-badge ${status}`}>
      <Icon weight="fill" aria-hidden="true" /> {statusLabels[status]}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="loading-state" aria-live="polite" aria-busy="true">
      <CircleNotch className="spin" aria-hidden="true" /> Loading portfolio…
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="error-state" role="alert">
      <WarningCircle aria-hidden="true" />
      <div><strong>Dashboard unavailable</strong><span>{message}</span></div>
    </div>
  );
}
