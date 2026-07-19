import { describe, expect, it } from "vitest";
import { projects } from "./data.js";
import { createSummary, filterProjects } from "./portfolio.js";

describe("portfolio helpers", () => {
  it("filters across project content", () => {
    const result = filterProjects(projects, { search: "security" });
    expect(result.map((project) => project.id)).toEqual([
      "permissions-redesign",
      "audit-log"
    ]);
  });

  it("combines status and team filters", () => {
    const result = filterProjects(projects, { status: "active", team: "Data" });
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("analytics-export");
  });

  it("creates a stable workshop summary", () => {
    expect(createSummary(projects)).toMatchObject({
      totalProjects: 7,
      activeProjects: 6,
      blockedTasks: 6,
      dueSoon: 2,
      openBugs: 13,
      activeTeams: 6
    });
  });
});
