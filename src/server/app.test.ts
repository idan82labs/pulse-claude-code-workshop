import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";

describe("Pulse API", () => {
  const app = createApp();

  it("reports service health", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  it("returns project filters and metadata", async () => {
    const response = await request(app).get("/api/projects?status=blocked");
    expect(response.status).toBe(200);
    expect(response.body.meta.total).toBe(1);
    expect(response.body.projects[0].id).toBe("permissions-redesign");
  });

  it("rejects an unknown status", async () => {
    const response = await request(app).get("/api/projects?status=delayed");
    expect(response.status).toBe(400);
    expect(response.body.error).toContain("Unknown project status");
  });

  it("returns 404 for an unknown project", async () => {
    const response = await request(app).get("/api/projects/missing");
    expect(response.status).toBe(404);
  });
});
