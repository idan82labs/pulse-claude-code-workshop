import type { Activity, Project } from "../shared/types.js";

export const WORKSHOP_NOW = "2026-07-22T09:30:00.000Z";

export const projects: Project[] = [
  {
    id: "payments-modernization",
    name: "Payments modernization",
    description: "Move recurring billing to the new payment orchestration layer.",
    owner: "Maya Cohen",
    ownerInitials: "MC",
    team: "Commerce",
    status: "active",
    deadline: "2026-07-24",
    progress: 62,
    completedTasks: 18,
    totalTasks: 29,
    blockedTasks: 2,
    openBugs: 4,
    lastActivityAt: "2026-07-22T07:42:00.000Z",
    tags: ["payments", "migration"]
  },
  {
    id: "mobile-onboarding",
    name: "Mobile onboarding",
    description: "Reduce first-session abandonment across the mobile signup flow.",
    owner: "Noam Levi",
    ownerInitials: "NL",
    team: "Growth",
    status: "active",
    deadline: "2026-07-30",
    progress: 78,
    completedTasks: 21,
    totalTasks: 27,
    blockedTasks: 0,
    openBugs: 1,
    lastActivityAt: "2026-07-22T08:15:00.000Z",
    tags: ["mobile", "conversion"]
  },
  {
    id: "permissions-redesign",
    name: "Permissions redesign",
    description: "Replace role checks with auditable, policy-based access control.",
    owner: "Dana Shalev",
    ownerInitials: "DS",
    team: "Platform",
    status: "blocked",
    deadline: "2026-07-21",
    progress: 45,
    completedTasks: 9,
    totalTasks: 20,
    blockedTasks: 3,
    openBugs: 2,
    lastActivityAt: "2026-07-18T13:20:00.000Z",
    tags: ["security", "platform"]
  },
  {
    id: "search-migration",
    name: "Search migration",
    description: "Move catalog search to the managed indexing service.",
    owner: "Omer Katz",
    ownerInitials: "OK",
    team: "Discovery",
    status: "active",
    deadline: "2026-08-12",
    progress: 30,
    completedTasks: 8,
    totalTasks: 26,
    blockedTasks: 1,
    openBugs: 0,
    lastActivityAt: "2026-07-21T16:05:00.000Z",
    tags: ["search", "infrastructure"]
  },
  {
    id: "analytics-export",
    name: "Analytics export",
    description: "Let enterprise customers schedule secure exports to cloud storage.",
    owner: "Roni Bar",
    ownerInitials: "RB",
    team: "Data",
    status: "active",
    deadline: "2026-07-23",
    progress: 90,
    completedTasks: 18,
    totalTasks: 20,
    blockedTasks: 0,
    openBugs: 6,
    lastActivityAt: "2026-07-15T10:10:00.000Z",
    tags: ["enterprise", "data"]
  },
  {
    id: "audit-log",
    name: "Audit log v2",
    description: "Create a searchable compliance trail for administrative actions.",
    owner: "Gal Amir",
    ownerInitials: "GA",
    team: "Trust",
    status: "planning",
    deadline: "2026-08-28",
    progress: 12,
    completedTasks: 2,
    totalTasks: 17,
    blockedTasks: 0,
    openBugs: 0,
    lastActivityAt: "2026-07-20T14:25:00.000Z",
    tags: ["compliance", "security"]
  },
  {
    id: "support-console",
    name: "Support console",
    description: "Unify account diagnostics and safe recovery actions for support.",
    owner: "Yael Ron",
    ownerInitials: "YR",
    team: "Customer Ops",
    status: "complete",
    deadline: "2026-07-16",
    progress: 100,
    completedTasks: 24,
    totalTasks: 24,
    blockedTasks: 0,
    openBugs: 1,
    lastActivityAt: "2026-07-21T09:05:00.000Z",
    tags: ["support", "operations"]
  }
];

export const activities: Activity[] = [
  {
    id: "activity-1",
    projectId: "payments-modernization",
    projectName: "Payments modernization",
    actor: "Maya",
    verb: "updated",
    detail: "the rollout checklist",
    createdAt: "2026-07-22T07:42:00.000Z"
  },
  {
    id: "activity-2",
    projectId: "mobile-onboarding",
    projectName: "Mobile onboarding",
    actor: "Noam",
    verb: "completed",
    detail: "the accessibility review",
    createdAt: "2026-07-22T08:15:00.000Z"
  },
  {
    id: "activity-3",
    projectId: "permissions-redesign",
    projectName: "Permissions redesign",
    actor: "Dana",
    verb: "flagged",
    detail: "a dependency on the identity migration",
    createdAt: "2026-07-18T13:20:00.000Z"
  },
  {
    id: "activity-4",
    projectId: "analytics-export",
    projectName: "Analytics export",
    actor: "CI",
    verb: "reported",
    detail: "six open regression failures",
    createdAt: "2026-07-21T12:30:00.000Z"
  }
];
