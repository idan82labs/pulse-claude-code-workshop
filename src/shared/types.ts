export type ProjectStatus = "planning" | "active" | "blocked" | "complete";

export interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  ownerInitials: string;
  team: string;
  status: ProjectStatus;
  deadline: string;
  progress: number;
  completedTasks: number;
  totalTasks: number;
  blockedTasks: number;
  openBugs: number;
  lastActivityAt: string;
  tags: string[];
}

export interface Activity {
  id: string;
  projectId: string;
  projectName: string;
  actor: string;
  verb: string;
  detail: string;
  createdAt: string;
}

export interface PortfolioSummary {
  totalProjects: number;
  activeProjects: number;
  blockedTasks: number;
  dueSoon: number;
  openBugs: number;
  activeTeams: number;
  asOf: string;
}

export interface ProjectsResponse {
  projects: Project[];
  meta: {
    total: number;
    asOf: string;
  };
}
