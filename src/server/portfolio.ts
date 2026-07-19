import type { PortfolioSummary, Project, ProjectStatus } from "../shared/types.js";
import { WORKSHOP_NOW } from "./data.js";

export interface ProjectFilters {
  search?: string;
  status?: ProjectStatus;
  team?: string;
}

export function filterProjects(allProjects: Project[], filters: ProjectFilters): Project[] {
  const search = filters.search?.trim().toLocaleLowerCase();

  return allProjects.filter((project) => {
    const matchesSearch =
      !search ||
      [project.name, project.description, project.owner, project.team, ...project.tags]
        .join(" ")
        .toLocaleLowerCase()
        .includes(search);
    const matchesStatus = !filters.status || project.status === filters.status;
    const matchesTeam = !filters.team || project.team === filters.team;

    return matchesSearch && matchesStatus && matchesTeam;
  });
}

export function createSummary(allProjects: Project[]): PortfolioSummary {
  const now = new Date(WORKSHOP_NOW);
  const dueSoonThreshold = new Date(now);
  dueSoonThreshold.setUTCDate(dueSoonThreshold.getUTCDate() + 7);

  const openProjects = allProjects.filter((project) => project.status !== "complete");
  const dueSoon = openProjects.filter((project) => {
    const deadline = new Date(`${project.deadline}T23:59:59.000Z`);
    return deadline >= now && deadline <= dueSoonThreshold;
  }).length;

  return {
    totalProjects: allProjects.length,
    activeProjects: openProjects.length,
    blockedTasks: openProjects.reduce((total, project) => total + project.blockedTasks, 0),
    dueSoon,
    openBugs: openProjects.reduce((total, project) => total + project.openBugs, 0),
    activeTeams: new Set(openProjects.map((project) => project.team)).size,
    asOf: WORKSHOP_NOW
  };
}
