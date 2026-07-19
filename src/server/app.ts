import express from "express";
import { activities, projects, WORKSHOP_NOW } from "./data.js";
import { createSummary, filterProjects } from "./portfolio.js";
import type { ProjectStatus } from "../shared/types.js";

const validStatuses = new Set<ProjectStatus>(["planning", "active", "blocked", "complete"]);

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get("/api/health", (_request, response) => {
    response.json({ status: "ok", asOf: WORKSHOP_NOW });
  });

  app.get("/api/summary", (_request, response) => {
    response.json(createSummary(projects));
  });

  app.get("/api/projects", (request, response) => {
    const rawStatus = typeof request.query.status === "string" ? request.query.status : undefined;
    if (rawStatus && !validStatuses.has(rawStatus as ProjectStatus)) {
      response.status(400).json({ error: `Unknown project status: ${rawStatus}` });
      return;
    }

    const result = filterProjects(projects, {
      search: typeof request.query.search === "string" ? request.query.search : undefined,
      status: rawStatus as ProjectStatus | undefined,
      team: typeof request.query.team === "string" ? request.query.team : undefined
    });

    response.json({ projects: result, meta: { total: result.length, asOf: WORKSHOP_NOW } });
  });

  app.get("/api/projects/:projectId", (request, response) => {
    const project = projects.find((candidate) => candidate.id === request.params.projectId);
    if (!project) {
      response.status(404).json({ error: "Project not found" });
      return;
    }
    response.json(project);
  });

  app.get("/api/activity", (_request, response) => {
    response.json({ activities, asOf: WORKSHOP_NOW });
  });

  return app;
}
