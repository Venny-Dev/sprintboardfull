import { useState } from "react";

const PHASES = [
  {
    id: 1,
    title: "Phase 1",
    subtitle: "Foundation",
    color: "bg-blue-600",
    light: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    tag: "Users · Tasks · Attendance · Approvals · Performance",
  },
  {
    id: 2,
    title: "Phase 2",
    subtitle: "Enforcement",
    color: "bg-purple-600",
    light: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    tag: "Two-Gate System · Recurring Tasks · Emergencies",
  },
  {
    id: 3,
    title: "Phase 3",
    subtitle: "Projects",
    color: "bg-teal-600",
    light: "bg-teal-50",
    border: "border-teal-200",
    text: "text-teal-700",
    tag: "Project Hub · Phase Gates · KPIs · CEO View",
  },
  {
    id: 4,
    title: "Phase 4",
    subtitle: "Governance",
    color: "bg-orange-600",
    light: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    tag: "Feature Flags · Staged Rollouts · Health Monitoring",
  },
  {
    id: 5,
    title: "Phase 5",
    subtitle: "AI Coworkers",
    color: "bg-pink-600",
    light: "bg-pink-50",
    border: "border-pink-200",
    text: "text-pink-700",
    tag: "Memory Layer · Batch 1 · Output Review",
  },
];

const CONTENT = {
  1: {
    why: `Phase 1 is the data foundation for everything that follows. Every metric, every enforcement gate, every AI Coworker output in Phase 5 is only as good as the data produced here. If tasks aren't logged accurately, performance metrics are meaningless. If clock-ins aren't tied to geolocation, attendance data is untrustworthy. If approvals aren't routed correctly, financial compliance breaks down.

The goal of Phase 1 is simple: every person in the company has an identity in the system, every hour of work is logged as a task, every attendance event is recorded, and every financial request flows through the right approval chain. Nothing intelligent can be built on top of sloppy operational data.`,
    sections: [
      {
        title: "1.1 Database Foundation",
        who: "Backend Dev — starts Day 1, no blockers",
        what: `Three schema tickets run in parallel and unblock everything else. They must be the first things built.

F-001 — Users, Departments, Roles
Creates the identity layer. Every person in the system has a role (Admin, Department Head, Manager/Team Lead, Employee) that controls what they can see and do. The role hierarchy is enforced at the middleware level — every endpoint checks it.

Who benefits: Every feature in every phase depends on knowing who is making a request and what they're allowed to do.

F-002 — Tasks Table
The atomic unit of the entire system. A task answers five questions: What was done? Which project? How long did it take? What was produced? What was the quality? The category field (Project / Operational / Administrative / Professional Development) enables later analysis of how time is actually spent across the organisation.

Who benefits: Employees own their task log. Managers rate and approve. The performance service reads tasks to calculate every metric. AI Coworkers (Phase 5) read task history to detect patterns.

F-003 — Attendance, Task Logs, Approval Requests
Three supporting tables. Attendance records every clock-in and clock-out with geolocation. Task_logs track weekly log submission status and gate compliance (used heavily in Phase 2). Approval_requests store every financial request with its routing state and policy violation flag.

Who benefits: Attendance feeds the punctuality and attendance rate metrics. Task_logs are the backbone of the Phase 2 gate system. Approval_requests feed the financial compliance metrics and LEDGER's payroll scans in Phase 5.`,
        endpoints: [
          {
            method: "POST",
            path: "/api/auth/register",
            who: "Admin",
            why: "Creates a new user account. Only Admin can register users — employees don't self-register.",
            how: "Hashes password with bcrypt. Assigns role and department. Returns user record (no password).",
          },
          {
            method: "POST",
            path: "/api/auth/login",
            who: "Anyone",
            why: "Authenticates a user and returns a JWT for all subsequent requests.",
            how: "Verifies email + password hash. Returns signed JWT with user_id, role, department_id. JWT expires in 24 hours.",
          },
          {
            method: "GET",
            path: "/api/users/me",
            who: "Authenticated user",
            why: "Returns the current user's profile. Used by the frontend to personalise the experience.",
            how: "Reads from JWT. Returns user record including role, department, hire_date.",
          },
        ],
        links:
          "F-001 → F-004 (auth needs users table) → F-005 (clock-in needs auth) → all subsequent endpoints",
      },
      {
        title: "1.2 Authentication & Clock-In",
        who: "Backend Dev — starts after F-001. Frontend Dev — starts after F-005",
        what: `Authentication is the gateway to the system. Every subsequent endpoint is protected by JWT middleware that reads the token, verifies it, and attaches the user and role to the request. Build this correctly once and it protects everything automatically.

Clock-in is the first action most employees take every working day. It must be fast (under 200ms), reliable, and geolocation-validated. The geolocation check ensures attendance data is trustworthy — an employee cannot clock in from home and claim they were in the office.

Why geolocation matters for Phase 5: SIGNAL's incident escalation paths and LEDGER's attendance anomaly detection both rely on the attendance record being accurate. If geolocation is skipped, the data feeding those coworkers is compromised.`,
        endpoints: [
          {
            method: "POST",
            path: "/api/clock-in",
            who: "Employee",
            why: "Records the start of the working day. Validates the employee is physically at the office. In Phase 2, also checks gate compliance before allowing clock-in.",
            how: "Validates JWT. Gets current coordinates from request body. Calculates distance from office coordinates. If within radius: creates attendance record with clock_in timestamp. Returns 200. If outside radius: returns 403. Phase 2 adds gate checks before the geolocation check.",
          },
          {
            method: "POST",
            path: "/api/clock-out",
            who: "Employee",
            why: "Records the end of the working day. Required for accurate hours calculations.",
            how: "Finds today's open attendance record. Sets clock_out timestamp. Calculates total hours. Returns updated record.",
          },
          {
            method: "GET",
            path: "/api/attendance/me",
            who: "Employee",
            why: "Employee can see their own attendance history.",
            how: "Returns attendance records for the authenticated user, filtered by date range.",
          },
          {
            method: "GET",
            path: "/api/attendance/:userId",
            who: "Manager / Admin",
            why: "Managers can view attendance for their team members.",
            how: "Role check: Manager can only view users in their department. Admin can view all.",
          },
        ],
        links:
          "F-004 → F-005 → F-006 (frontend clock-in UI) → E-003 (Phase 2 modifies this endpoint to add gate checks)",
      },
      {
        title: "1.3 Task Management",
        who: "Backend Dev — starts after F-002. Frontend Dev — starts after F-007",
        what: `Tasks are the core record of work at Publica AI. Every employee creates tasks, moves them through statuses, logs hours, and submits them for manager review. This is not optional overhead — it is the primary data source for every performance metric, every AI Coworker pattern, and every appraisal decision.

The Minimum Meaningful Task rule: a task must represent at least 30 minutes of work. "Checked emails" is not a task — it is operational overhead. This rule is enforced culturally (HR training) and detected technically (FORGE's vague description detector in Phase 5).

Status flow matters: To Do → In Progress → Blocked (optional) → Submitted for Review → Done. You cannot skip from To Do to Done. The validation logic enforces this — it prevents employees from gaming completion rates by marking everything Done at the end of the week without genuinely moving it through the workflow.

Task categories determine how the data is analysed:
- Project Tasks → tracked against project KPIs (Phase 3)
- Operational/Routine → feeds recurring task templates (Phase 2)
- Administrative → tracked separately so it doesn't inflate billable metrics
- Professional Development → tracked for HR appraisals`,
        endpoints: [
          {
            method: "POST",
            path: "/api/tasks",
            who: "Employee / Manager",
            why: "Creates a new task. The employee plans their week by creating tasks before Tuesday midnight (Phase 2 enforces this via Gate 1).",
            how: "Validates required fields. Sets status to 'To Do'. Sets assignee_id to current user unless manager is creating on behalf of someone. Returns created task.",
          },
          {
            method: "GET",
            path: "/api/tasks",
            who: "Employee / Manager",
            why: "Employees see their own tasks. Managers see all tasks for their department, filterable by assignee, project, status, week.",
            how: "Applies role-based filter. Accepts query params: ?assignee_id=, ?project_id=, ?status=, ?week_start=. Returns paginated list.",
          },
          {
            method: "PUT",
            path: "/api/tasks/:id",
            who: "Employee (own tasks), Manager (any)",
            why: "Updates task status, actual hours, deliverable URL. The primary action employees take throughout the day.",
            how: "Validates status transition is legal. If status changes to Done: sets completion_date. Updates updated_at. Triggers Phase 2 gate recalculation.",
          },
          {
            method: "PUT",
            path: "/api/tasks/:id/rate",
            who: "Manager only",
            why: "Manager rates the quality of a completed task (1–5). This rating feeds the Task Quality Score metric.",
            how: "Role check: must be manager of the task's assignee. Validates rating is 1–5. Saves manager_rating and manager comment.",
          },
          {
            method: "POST",
            path: "/api/tasks/log",
            who: "Employee",
            why: "Creates the weekly task log record for the current week. This is what Gate 1 checks — does a log exist? Distinct from submitting individual tasks.",
            how: "Creates task_log record with week_start_date (must be a Monday). Sets gate_1_compliant=TRUE. Status starts as 'pending'.",
          },
          {
            method: "PUT",
            path: "/api/tasks/log/weekly",
            who: "Employee",
            why: "Finalises and submits the weekly log for manager review by Saturday midnight.",
            how: "Updates task_log status to 'submitted'. Sets submission_date. Triggers manager notification.",
          },
          {
            method: "POST",
            path: "/api/tasks/log/:logId/approve",
            who: "Manager only",
            why: "Manager reviews and approves or returns the weekly log.",
            how: "Status → 'approved' or 'returned'. Sets approval_date. If returned: manager_notes required. Employee notified either way.",
          },
        ],
        links:
          "F-007 → F-008 (log submission) → F-009 (task board UI) → F-010 (manager rating) → F-013 (feeds performance metrics) → E-003 (Phase 2 gate checks task_log) → AI-004 (Phase 5 FORGE reads tasks)",
      },
      {
        title: "1.4 Approval Workflow",
        who: "Backend Dev — starts after F-003. Frontend Dev — starts after F-011",
        what: `Every financial request at Publica AI flows through the same approval chain. This is not bureaucracy — it is financial accountability. Without this system, there is no way to know whether spending is authorised, policy-compliant, or within budget.

The routing logic is rule-based and automatic. The employee submits a request. The system calculates the correct approver based on the request amount and type. The approver receives a notification. No one has to manually route anything.

The three-tier routing:
- Below department threshold → goes to Department Head
- Above department threshold → goes to Martha (Head of Business Support)
- Above Martha's threshold → goes to Willie (CEO)

The policy_violation flag is critical for Phase 5: LEDGER reads this flag when scanning for payroll anomalies, and GUARD monitors it for compliance patterns. Every time an approver marks a request as a policy violation, they are training GUARD's compliance model.

Who touches this: Every employee who incurs expenses, requests cash advances, or needs to purchase tools. Every manager who approves. Martha and Willie for high-value items.`,
        endpoints: [
          {
            method: "POST",
            path: "/api/approvals",
            who: "Employee",
            why: "Submits a new financial request (expense, cash advance, purchase, vendor payment).",
            how: "Creates approval_request record. Routing logic runs: calculates correct approver_id based on amount + type + threshold config. Sends notification to approver. Sets status to 'pending'.",
          },
          {
            method: "GET",
            path: "/api/approvals",
            who: "Employee / Manager / Admin",
            why: "Employee sees their own requests. Manager sees pending requests in their approval queue.",
            how: "Employee filter: WHERE requester_id = current_user. Manager filter: WHERE approver_id = current_user AND status = 'pending'. Admin: all records.",
          },
          {
            method: "PUT",
            path: "/api/approvals/:id",
            who: "Assigned approver only",
            why: "Approves or rejects the request. Can flag as policy violation.",
            how: "Validates current user is the assigned approver. Status → 'approved' or 'rejected'. Notes required on rejection. policy_violation flag saved. Requester notified.",
          },
        ],
        links:
          "F-011 → F-012 (approvals UI) → F-013 (expense compliance metric) → P-003 (Phase 3 phase gates reuse this system) → AI-002 (ROUTER coworker, Batch 2)",
      },
      {
        title: "1.5 Performance Dashboard",
        who: "Backend Dev — starts after F-007 and F-005 are both live. Frontend Dev — starts after F-013",
        what: `The performance metrics service is the payoff of Phases 1 through 1.4. All the data that's been collected — task logs, attendance records, approval requests — gets synthesised into five objective categories that tell every employee and every manager exactly how performance is tracking.

The critical design principle: metrics are calculated from system data, not manager memory. This eliminates subjective appraisals. When Confidence sits down with an employee for their quarterly review, the numbers are already there — agreed upon, objective, and real-time.

The five categories and what they measure:

A — Task & Project Performance (50% weight): Are you completing what you say you'll do, on time, at quality?
B — Productivity & Efficiency (25%): Are your time estimates accurate? Are you resolving overdue work quickly?
C — Attendance & Punctuality (15%): Are you present and on time? Are you submitting logs by deadline?
D — Financial Responsibility (10%): Are your expense claims compliant? Are you retiring advances promptly?
E — Collaboration & Initiative: Qualitative — peer feedback and manager assessment during appraisal.

The Hours Integrity Score deserves special explanation. It compares the hours logged in tasks for a given day against the hours recorded by the attendance system (clock-out minus clock-in). A 1-hour buffer is included for meetings and breaks. If an employee claims 9 hours of task work on a day they were only clocked in for 6 hours, that's flagged. This isn't punitive — it's a signal that estimates may be inaccurate or that tasks are being backdated.`,
        endpoints: [
          {
            method: "GET",
            path: "/api/performance/metrics/me",
            who: "Employee",
            why: "Returns all performance metrics for the authenticated user for the current period. This is the personal dashboard data.",
            how: "Calls the metrics calculation service. Reads from tasks, attendance, task_logs, approval_requests tables. Calculates all formulas. Returns structured object with score and breakdown per category. Response must be under 300ms p95.",
          },
          {
            method: "GET",
            path: "/api/performance/metrics/:userId",
            who: "Manager / Admin",
            why: "Manager views metrics for a specific team member. Used for appraisals and one-on-ones.",
            how: "Role check: Manager can only view users in their department. Admin can view all. Same calculation as /me but for specified user.",
          },
          {
            method: "GET",
            path: "/api/performance/team",
            who: "Manager",
            why: "Aggregated team performance overview. Manager sees how the whole team is trending.",
            how: "Runs metrics calculation for all users in manager's department. Returns team average per category plus individual summaries.",
          },
        ],
        links:
          "F-013 → F-014 (dashboard UI) → Phase 5: GROVE reads trainee metrics, LEDGER reads payroll anomalies from same data, PIKE reads project completion rates",
      },
    ],
    schema: [
      {
        table: "users",
        key_fields:
          "id, name, email, role, department_id, is_active, hire_date",
        why: "Identity and access control for the entire system",
      },
      {
        table: "departments",
        key_fields: "id, name, head_user_id",
        why: "Organisational structure. Approval routing and role scoping depend on this",
      },
      {
        table: "tasks",
        key_fields:
          "id, title, assignee_id, project_id, category, status, estimated_hours, actual_hours, story_points, manager_rating, due_date, completion_date",
        why: "Core work record. Read by metrics service, enforcement gates, and AI Coworkers",
      },
      {
        table: "attendance",
        key_fields:
          "id, user_id, clock_in, clock_out, latitude, longitude, date",
        why: "Feeds attendance rate, punctuality score, and hours integrity score",
      },
      {
        table: "task_logs",
        key_fields:
          "id, user_id, week_start_date, submission_date, status, gate_1_compliant, gate_2_compliant, manager_notes",
        why: "Tracks weekly log submission. The enforcement gate system reads this table directly",
      },
      {
        table: "approval_requests",
        key_fields:
          "id, requester_id, type, amount, approver_id, status, policy_violation",
        why: "All financial requests. Feeds expense compliance metrics and LEDGER/GUARD coworker scans",
      },
    ],
    gateNote:
      "Phase 1 ends with F-REG — a full end-to-end regression test covering all role types. Confidence (PM) and Mercy (QA) must both sign off before Phase 2 begins.",
  },

  2: {
    why: `Phase 1 built the data. Phase 2 makes the system self-governing.

Here's the problem Phase 2 solves: a task management system only works if people actually use it consistently. If employees log tasks inconsistently, the performance metrics become meaningless. If managers have to manually chase every team member every week to submit their logs, the management overhead outweighs the benefit. The system collapses into a compliance exercise that everyone resents.

The Two-Gate Enforcement System removes the human chasing from the equation. Compliance is structural. The system enforces it automatically, and the consequences are immediate and self-resolving — no manager action required. Employees are always in control: they can lift any gate themselves by completing the required action.

The second goal of Phase 2 is reducing manual task creation overhead through recurring task templates. For any work that repeats weekly — the sales report, payroll processing, community updates — a template auto-generates the task every Monday. This removes 10–20 minutes of manual setup per employee per week and ensures recurring work is never forgotten.`,
    sections: [
      {
        title: "2.1 The Two-Gate System",
        who: "Backend Dev — starts after F-REG sign-off. Frontend Dev — starts after E-003",
        what: `Gate 1 — Task Logging Gate
Enforces planning. If you haven't logged your tasks by Tuesday midnight, you can't clock in Wednesday morning. The message is simple: if you haven't planned your week, you're not ready to work.

How it works: A scheduled job runs every Wednesday at 1AM. It iterates through all active employees. For each employee it checks (in order):
1. Is there an active emergency declaration? → Waive gate, skip.
2. Is the employee on approved leave this week? → Waive gate, skip.
3. Is this a new employee (hire_date within last 14 days)? → Waive gate, skip.
4. Were any tasks assigned to this employee this week? → If no: waive gate, notify manager instead.
5. Does a task_log record exist for this employee for this week? → If yes: gate_1_compliant=TRUE. If no: gate_1_compliant=FALSE.

When the employee tries to clock in on Wednesday, the clock-in endpoint checks gate_1_compliant. If FALSE: returns 403 GATE_1_FAILED. The employee logs their tasks. The gate rechecks — gate_1_compliant is now TRUE. They clock in immediately. No manager needed.

Gate 2 — Task Update Gate
Enforces execution. If fewer than 50% of the week's assigned tasks are marked Done by Saturday midnight, you can't clock in Monday morning. The message: you committed to work this week — you need to have done it.

How it works: A scheduled job runs every Sunday at 1AM. Same waiver logic as Gate 1. Then calculates: (COUNT of Done tasks this week / COUNT of all assigned tasks) * 100. If >= 50%: gate_2_compliant=TRUE. If < 50%: gate_2_compliant=FALSE.

When Monday clock-in runs: checks gate_2_compliant for the previous week. If FALSE: 403 GATE_2_FAILED. Employee updates their task statuses. Gate rechecks immediately. They clock in.

What counts as a valid blocker: If a task is blocked by an external dependency, the employee should mark it as Blocked and write a comment explaining why. The gate calculation excludes tasks in Blocked status from the denominator — you're not penalised for work that was genuinely blocked by circumstances outside your control. This is how the system stays fair.`,
        endpoints: [
          {
            method: "POST",
            path: "/api/clock-in (modified)",
            who: "Employee",
            why: "Extended from Phase 1. Now checks gate compliance before geolocation validation.",
            how: "Step 1: Authenticate. Step 2: Get day of week. If Wednesday: query task_logs WHERE user_id=current AND week_start=current_week. If gate_1_compliant=FALSE: return 403 GATE_1_FAILED with message. If Monday: query task_logs WHERE user_id=current AND week_start=previous_week. If gate_2_compliant=FALSE: return 403 GATE_2_FAILED with message. Step 3 (if gate passes): geolocation check. Step 4: create attendance record.",
          },
          {
            method: "POST",
            path: "/api/emergencies",
            who: "Employee or their Manager",
            why: "Declares a medical, family, or personal emergency. Suspends both gates immediately.",
            how: "Creates emergency_declarations record with user_id, reason, start_date, declared_by. Sets is_active=TRUE. Side effects: gate waiver applies immediately on next clock-in check. All employee tasks flagged as Blocked-Emergency. Compliance score protected for duration.",
          },
          {
            method: "PUT",
            path: "/api/emergencies/:id/close",
            who: "Employee or their Manager",
            why: "Closes an emergency when the person is ready to return.",
            how: "Sets end_date=NOW(), is_active=FALSE. Gates re-enable on the next cycle. Tasks unflagged from Blocked-Emergency.",
          },
        ],
        links:
          "E-003 modifies POST /api/clock-in from F-005. E-004 adds /api/emergencies. These endpoints depend on task_logs (F-003) and the gate compliance calculation jobs.",
      },
      {
        title: "2.2 Recurring Task Templates",
        who: "Backend Dev — starts after E-001. Frontend: manager UI after E-005",
        what: `Some work happens every week without variation. The Finance Officer processes payroll every week. The Community Manager posts a weekly digest. The Lead Instructor grades assignments every week. Creating these tasks manually from scratch every Monday is overhead that serves no one.

Task templates solve this. A manager or team lead creates a template once. Every Monday at 6AM, the system auto-generates a new task from every active template. The employee opens their task board and the week's recurring work is already there.

The carry-over logic is important: if last week's recurring task wasn't completed, the system does NOT create a new task this week. It rolls the existing task over to the new week's due date. This keeps the task board honest — if a task wasn't done, it stays visible as overdue rather than being replaced by a fresh copy that makes the backlog look clean.

Who benefits: Employees with predictable weekly responsibilities. Managers who used to chase recurring task creation. The metrics service — recurring tasks that are always completed on time improve the on-time delivery rate automatically.`,
        endpoints: [
          {
            method: "POST",
            path: "/api/task-templates",
            who: "Manager / Team Lead",
            why: "Creates a new recurring task template. The manager defines the task once and it auto-generates forever.",
            how: "Accepts title, description, category, assignee_id, project_id, estimated_hours, story_points, recurrence_rule (iCal RRULE format e.g. FREQ=WEEKLY;BYDAY=MO). Creates task_templates record with is_active=TRUE.",
          },
          {
            method: "GET",
            path: "/api/task-templates",
            who: "Manager / Team Lead",
            why: "Lists all templates for the manager's department.",
            how: "Filters by department via assignee's department. Returns active and inactive templates.",
          },
          {
            method: "PUT",
            path: "/api/task-templates/:id",
            who: "Manager / Team Lead",
            why: "Updates or deactivates a template. Deactivating stops new tasks being generated from it.",
            how: "Updates specified fields. If is_active changes to FALSE: stops Monday job from generating tasks from this template. Does not affect previously generated tasks.",
          },
        ],
        links:
          "E-001 (task_templates table) → E-002 (Monday generation job) → E-005 (template CRUD endpoints) → Phase 5: GROVE:recurring_task_generation is this same Monday job, renamed with job_log writes",
      },
      {
        title: "2.3 Notification Jobs",
        who: "Backend Dev — runs after E-003 is stable",
        what: `Two scheduled notification jobs keep the team informed without manager overhead.

Stale Task Reminder (Wednesday 9AM): Finds all tasks that are In Progress but haven't been updated in 48 hours. Sends a notification to both the employee and their manager. This catches work that has silently stalled — the employee may have moved on to something else and forgotten to update the status, or there's a real blocker that hasn't been declared. The manager finding out via notification is far better than finding out at the end-of-week review.

Manager Approval Reminder (Daily): Finds all submitted task_logs where the submission_date is more than 2 business days ago and status is still 'submitted'. Sends a reminder to the manager. If the manager is a top-level manager with no manager above them, the reminder goes to the CEO. Managers sitting on log approvals create a bottleneck — employees can't close out their week correctly if their log is stuck in limbo.

Both jobs are named with coworker convention from Phase 5: FORGE:stale_task_reminder and PIKE:manager_approval_reminder. In Phase 5, they simply get job_log writes added — the logic doesn't change.`,
        endpoints: [],
        links:
          "E-007 → Phase 5: renamed to FORGE:stale_task_reminder and PIKE:manager_approval_reminder with job_log writes added",
      },
    ],
    schema: [
      {
        table: "task_templates",
        key_fields:
          "id, title, assignee_id, recurrence_rule, is_active, created_by",
        why: "Stores recurring task definitions. The Monday generation job reads this table.",
      },
      {
        table: "emergency_declarations",
        key_fields:
          "id, user_id, start_date, end_date, reason, declared_by, is_active",
        why: "Gate waiver records. Clock-in endpoint checks for active emergency before applying gate logic.",
      },
    ],
    gateNote:
      "Phase 2 ends with E-REG. Key regression: verify gate enforcement on Wednesday and Monday doesn't affect clock-in on other days. Phase 1 full flow must still pass.",
  },

  3: {
    why: `Phase 1 shows what one person did this week. Phase 2 ensures they did it consistently. Phase 3 shows whether the whole organisation is building the right things and whether those things are on track.

Without a project layer, Publica AI's task data is a collection of individual activities with no connective tissue. A developer completing 5 tasks this week looks identical whether those tasks are part of a strategic client project or disconnected maintenance work. The Project Execution Hub changes this — it groups tasks into phases, phases into projects, and projects into a portfolio that Willie can see at a glance.

The phase gate system is the most important governance mechanism in Phase 3. It makes it structurally impossible to start new work until previous work is formally signed off. This prevents the most common project failure: teams that are perpetually "90% done" on multiple things simultaneously rather than fully completing work sequentially.`,
    sections: [
      {
        title: "3.1 Project Setup & Phase Management",
        who: "Backend Dev — starts after E-REG. Frontend Dev — starts after P-002",
        what: `Every project at Publica AI is structured the same way: a name, a type (internal or client-facing), an owner, a team, a timeline, and a sequence of phases with phase gates. This consistency means every project can be measured against the same criteria and every stakeholder knows what to expect.

Phases must be defined upfront. A phase has a name, an order number, start and end dates, and a gate_required flag. If gate_required is TRUE, the phase cannot end and the next one cannot start until a formal phase gate approval is completed.

Mid-project imports: existing projects don't need their full history recreated. A manager can import a project by defining its current phase and moving forward from there. This was a deliberate design choice — forcing teams to recreate historical data creates resentment and delays adoption.

The RACI matrix (Responsible, Accountable, Supervised by, Informed) is defined per deliverable. This answers the most common cause of project failure: "I thought you were handling that." With RACI defined, there is no ambiguity about ownership.`,
        endpoints: [
          {
            method: "POST",
            path: "/api/projects",
            who: "Manager / Admin",
            why: "Creates a new project with phases.",
            how: "Validates required fields. Creates project record. Creates associated phase records in the defined order. Sets first phase status to 'active'.",
          },
          {
            method: "GET",
            path: "/api/projects",
            who: "All authenticated users",
            why: "Employees see projects they are members of. Managers see all projects in their department. Admin/CEO see all.",
            how: "Role-based filter. Returns project list with current phase, health score, member count.",
          },
          {
            method: "PUT",
            path: "/api/projects/:id",
            who: "Project Owner / Admin",
            why: "Updates project details, adds new team members, updates phase dates.",
            how: "Validates ownership. All changes logged in audit trail. KPIs auto-recalculate.",
          },
          {
            method: "POST",
            path: "/api/projects/import",
            who: "Manager / Admin",
            why: "Imports an existing project without recreating full history.",
            how: "Creates project record with current_phase_id set. Previous phases marked as 'approved' without requiring gate sign-offs. Team notified.",
          },
          {
            method: "POST",
            path: "/api/phases/:id/complete",
            who: "Project Owner / PM",
            why: "Marks a phase as complete and triggers the phase gate approval process.",
            how: "Sets phase status to 'completed'. Auto-generates an approval_request of type 'phase_gate'. Routes to Project Owner and Head of Product. Next phase locked until approval received.",
          },
        ],
        links:
          "P-001 (schema) → P-002 (CRUD) → P-003 (phase gates, reuses F-011 approval system) → P-004 (KPI calculations read tasks) → tasks.project_id links task data to projects",
      },
      {
        title: "3.2 Phase Gate Approvals",
        who: "Backend Dev — starts after P-002 and F-011 are both live",
        what: `The phase gate is the structural guarantee that work is truly finished before new work begins. When a PM marks a phase complete, the system creates an approval request (using the same approval system from Phase 1) routed to the Project Owner and Head of Product. Until that request is approved, the next phase cannot be activated.

Two mandatory checklists gate the approval submission:

QA Checklist — required for any phase with a software deliverable. Must cover unit tests, integration tests, user acceptance tests, regression tests, performance tests, and security tests. The PM cannot submit the phase gate until every item is checked by the QA engineer.

GDPR/NDPR Compliance Checklist — triggered automatically for any phase that touches personal data. Checks: data mapping completed, legal basis defined, retention policies set, user consent mechanisms in place.

Why this matters: without these checklists as hard gates, they become suggestions. Teams under deadline pressure skip them. The phase gate system makes skipping impossible — the approval request cannot be submitted until both checklists are complete.`,
        endpoints: [
          {
            method: "POST",
            path: "/api/qa/checklists",
            who: "QA Engineer (Mercy)",
            why: "Auto-generates a regression testing checklist based on the feature dependency map.",
            how: "Reads declared dependencies for the feature/phase. Creates checklist with one item per stable feature that the new work touches.",
          },
          {
            method: "PUT",
            path: "/api/qa/checklists/:id/items/:itemId",
            who: "QA Engineer",
            why: "Marks a checklist item as Pass or Fail.",
            how: "Updates item status. If any item is Fail: phase gate approval submission is blocked until resolved.",
          },
        ],
        links:
          "P-003 uses F-011 (approval_requests table) — phase gate approvals are stored as approval_requests with type='phase_gate'. Same routing and approval logic applies.",
      },
      {
        title: "3.3 KPI Dashboard & Health Score",
        who: "Backend Dev — starts after P-002 and F-013 are live",
        what: `Every project has a Health Score — a single number from 0 to 100 that tells stakeholders whether the project is on track. It is calculated weekly from five weighted metrics:

- Task Completion Rate (30%): What percentage of tasks assigned this week are Done?
- On-Time Delivery Rate (25%): What percentage of completed tasks were finished by their due date?
- Blocker Age (20%): How many days on average have tasks been sitting in Blocked status?
- Budget Variance (15%): How much has actual spend deviated from approved budget?
- Milestone Status (10%): How many milestones are On Track vs At Risk vs Missed?

Score → Status: 80–100 is Green (On Track). 60–79 is Amber (At Risk). 0–59 is Red (Critical).

PIKE reads this Health Score in Phase 5. When PIKE detects two consecutive weeks of score decline, it pre-emptively flags the project as a risk — before it hits Red — giving the PM time to intervene. This is the most direct example of Phase 3 data feeding Phase 5 intelligence.

Custom KPIs sit alongside the operational ones. A PM can define project-specific KPIs (e.g., "Contracts Signed," "Client Approval Received") and update them manually. These are displayed on the same dashboard but labelled differently so stakeholders always know what's calculated vs what's reported.`,
        endpoints: [
          {
            method: "GET",
            path: "/api/projects/:id/health",
            who: "Project team, Manager, CEO",
            why: "Returns the current Health Score with breakdown per component. The primary project status signal.",
            how: "Reads tasks (completion rate, on-time delivery, blocker age), approval_requests (budget variance), milestones (status counts). Calculates weighted score. Returns score, status (Green/Amber/Red), and per-component breakdown.",
          },
          {
            method: "POST",
            path: "/api/projects/:id/kpis",
            who: "PM / Project Owner",
            why: "Creates a custom KPI for this project.",
            how: "Stores KPI name, target value, current value, unit. Linked to project_id.",
          },
          {
            method: "PUT",
            path: "/api/projects/:id/kpis/:kpiId",
            who: "PM / Project Owner",
            why: "Updates the current value of a custom KPI.",
            how: "Updates current_value. Timestamps the update. Returns updated KPI with progress percentage toward target.",
          },
          {
            method: "GET",
            path: "/api/projects/:id/reports/weekly",
            who: "PM, Manager, CEO",
            why: "Auto-generated weekly sprint review. PM adds qualitative notes — all quantitative data auto-fills.",
            how: "Aggregates week's task completions, KPI progress, blocker summaries, phase status. Returns structured report object. PM can PATCH to add qualitative_notes.",
          },
        ],
        links:
          "P-004 reads tasks (F-002) for completion rates and approval_requests (F-003) for budget variance. Phase 5: PIKE reads GET /api/projects/:id/health weekly to generate health score narratives and detect decline trajectories.",
      },
      {
        title: "3.4 CEO Command View",
        who: "Frontend Dev — starts after P-004 is live",
        what: `Willie needs to see every active project's status in one place without reading six different reports. The CEO Command View is a portfolio dashboard that shows every project as a card with: project name, owner, current phase, Health Score with RAG colour, any pending phase gate approvals with days overdue, and critical alerts.

This is the data that ARIA will synthesise in Phase 5 for the Monday CEO Briefing. The Command View is the human-readable version. ARIA's briefing is the narrative version, adding context and flagging what Willie needs to decide.

The Command View is read-only for Willie — he can see everything but can only act through the approval queue. This is intentional: the CEO's role is to be informed and to approve, not to directly edit project data.`,
        endpoints: [
          {
            method: "GET",
            path: "/api/dashboard/ceo",
            who: "CEO / Admin",
            why: "Returns portfolio-level view of all active projects.",
            how: "Aggregates health scores, pending approvals (with days overdue), active incidents from SIGNAL (Phase 5), and critical budget variances. Filtered by active projects only.",
          },
        ],
        links:
          "P-007 (CEO Command View frontend) reads GET /api/dashboard/ceo. Phase 5: ARIA reads the same data to generate the Monday CEO Briefing.",
      },
    ],
    schema: [
      {
        table: "projects",
        key_fields: "id, name, type, owner_id, start_date, end_date, status",
        why: "Top-level project record. All phases, milestones, and RACI entries link here.",
      },
      {
        table: "phases",
        key_fields: "id, project_id, name, order, status, gate_required",
        why: "Phase order enforced by order field. Status transitions validated by API.",
      },
      {
        table: "milestones",
        key_fields: "id, phase_id, title, due_date, status",
        why: "Feeds the Health Score milestone component and the Execution Calendar milestone view.",
      },
      {
        table: "project_raci",
        key_fields:
          "id, project_id, deliverable, responsible_id, accountable_id, supervised_by_id, informed_ids[]",
        why: "Clarity of ownership per deliverable. Prevents the 'I thought you were doing that' problem.",
      },
      {
        table: "project_members",
        key_fields: "project_id, user_id, role",
        why: "Controls who can see and interact with each project.",
      },
    ],
    gateNote:
      "Phase 3 ends with P-REG. Key checks: project creation to final report end-to-end. Verify gate enforcement and approval routing both work. CEO Command View renders correctly.",
  },

  4: {
    why: `By Phase 3, Publica AI has a live platform with real users and real data. This creates a new risk: deploying new features can break existing ones. A bug in a new attendance feature could prevent employees from clocking in. A regression in the approval routing could stop financial requests from reaching the right approvers. On a platform that people depend on daily, these failures have immediate real-world consequences.

Phase 4 builds the safety layer around deployment. It makes it impossible to break existing features accidentally, and it makes it possible to deploy new features incrementally — showing them to a small group first, verifying they work, then expanding to everyone.

This same infrastructure — feature flags and staged rollouts — is also how AI Coworkers are activated in Phase 5. GROVE doesn't go live for the whole company on day one. It activates for Kelly first (Alpha), then the full Engineering team (Beta), then everyone (Full Release). The exact same mechanism that protects product features protects coworker activations.`,
    sections: [
      {
        title: "4.1 Feature Flag System",
        who: "Backend Dev + DevOps — starts after P-REG",
        what: `Every new feature is deployed "dark" — wrapped in a feature flag that is turned off by default. The feature exists in production but is invisible to users. When it's ready to test, DevOps enables it for a specific group via the Feature Flag Dashboard. If something goes wrong, one toggle turns it off for everyone instantly — no deployment, no rollback, no downtime.

The feature_flags table has two types (added in Phase 5 preparation):
- feature: standard product feature flag
- coworker: AI Coworker activation flag

The allowed_user_ids and allowed_department_ids arrays enable precision targeting. You can enable a feature for just the HR department, or just three specific users, or 20% of all users (rollout_percentage). This is how staged rollouts work mechanically.

Who manages this: DevOps engineer and Head of Products have access to the Feature Flag Dashboard. No developer can toggle their own feature flag in production — that's a governance rule, not a technical one.`,
        endpoints: [
          {
            method: "GET",
            path: "/api/feature-flags",
            who: "Admin / DevOps / Head of Products",
            why: "Lists all feature flags and their current state.",
            how: "Returns all records from feature_flags table with current status and rollout percentage.",
          },
          {
            method: "PUT",
            path: "/api/feature-flags/:id",
            who: "Admin / DevOps",
            why: "Toggles a feature on/off or updates its rollout scope.",
            how: "Updates is_active, rollout_percentage, allowed_user_ids, or allowed_department_ids. Change logged with timestamp and actor.",
          },
        ],
        links:
          "G-001 (feature_flags schema) → G-003 (staged rollout protocol using flags) → Phase 5: flag_type='coworker' added to same table for coworker activations",
      },
      {
        title: "4.2 Stable Features Registry & Regression Framework",
        who: "Mercy (QA) — ongoing from Phase 4 forward",
        what: `The Stable Features Registry is a living document of every production-ready feature. After every deployment, newly released features are added and any features they depend on are re-verified. This prevents the most common regression failure: a developer changes Feature A without knowing it powers Feature B.

How the regression checklist system works:
1. When a developer starts a new feature, they declare which existing features it touches (the dependency map).
2. The system auto-generates a regression checklist — one item per declared dependency.
3. Before the new feature can progress through its phase gate, Mercy must mark every checklist item as Pass or Fail.
4. A single Fail blocks the gate until the bug is fixed.

This makes regression testing mandatory and targeted rather than optional and exhaustive. You test the things that could have broken — not everything.

Post-deployment health monitoring: after every deployment, automated checks run against the 10 most critical features every 10 minutes for 24 hours. If a check fails — clock-in endpoint returns non-200, task submission breaks — DevOps and the on-call backend developer are notified immediately. The stable features registry updates the health_status field for the affected feature.`,
        endpoints: [
          {
            method: "POST",
            path: "/api/qa/checklists",
            who: "QA Engineer",
            why: "Generates a regression checklist from the feature dependency map.",
            how: "Already built in Phase 3 for phase gate checklists. Same endpoint — extended to also support feature deployment checklists.",
          },
          {
            method: "GET",
            path: "/api/stable-features",
            who: "QA / Admin",
            why: "Returns the full stable features registry with health status.",
            how: "Returns all stable_features records including monitoring_coworker (null until Phase 5), last_automated_check, health_status.",
          },
          {
            method: "PUT",
            path: "/api/stable-features/:id",
            who: "QA Engineer",
            why: "Updates a feature's verification date or assigns a monitoring coworker (Phase 5).",
            how: "Updates last_verified_date, dependencies, monitoring_coworker fields.",
          },
        ],
        links:
          "G-002 (stable features registry) → G-004 (regression checklist from dependency map — extends Phase 3 QA checklist) → G-005 (health monitoring writes to stable_features.health_status) → Phase 5: monitoring_coworker column used by FORGE and GUARD",
      },
      {
        title: "4.3 Staged Rollout Protocol",
        who: "DevOps — applies to all Phase 4+ deployments and all Phase 5 coworker activations",
        what: `No feature goes from development to all users in one step. Every new feature and every AI Coworker follows the same three-stage protocol:

Alpha (2–3 days): Internal dev and QA team only. Pass criterion: no critical bugs. This is where you catch the obvious failures before real users see them.

Beta (3–5 days): One selected department. Pass criterion: no regression in existing features reported by the beta group. The beta group is picked strategically — choose a department that will actually use the feature, not the most forgiving one.

Full Release: All users. Monitored for 7 days (30 days for AI Coworkers — their outputs need longer to prove they're adding value, not noise).

If any stage fails: the feature flag is turned off. The feature goes back to development. The PM (Confidence) signs off each stage transition — not the developer, not DevOps. The PM is accountable for the user experience, so they own the rollout gates.

For AI Coworkers specifically:
- Alpha: The coworker's primary user only (e.g., GROVE Alpha is Kelly-only for 1–2 weeks)
- Beta: Full department (e.g., GROVE Beta is all of Engineering)
- Full Release: All intended users

The reason coworkers have longer monitoring: a coworker that generates high false-positive alerts will train its primary user to ignore all alerts, including real ones. It's better to discover this in Beta and fix the detection logic than to discover it after full rollout.`,
        endpoints: [],
        links:
          "G-001 (feature_flags) + G-003 (rollout protocol) → Phase 5: same mechanism activates AI Coworkers via flag_type='coworker' flags",
      },
    ],
    schema: [
      {
        table: "feature_flags",
        key_fields:
          "id, name, is_active, rollout_percentage, allowed_user_ids[], allowed_department_ids[], flag_type, coworker_id",
        why: "Controls feature visibility. Same table used for both product features and AI Coworker activations in Phase 5.",
      },
      {
        table: "stable_features",
        key_fields:
          "id, feature_name, last_verified_date, dependencies[], monitoring_coworker, last_automated_check, health_status",
        why: "Registry of production-ready features. Regression checklist auto-generated from dependencies[].",
      },
    ],
    gateNote:
      "Phase 4 ends with G-REG. Key check: existing feature flags don't gate any Phase 1–3 features. Health monitoring runs silently — no user disruption.",
  },

  5: {
    why: `Phases 1 through 4 have produced something valuable: a disciplined, data-rich operational platform. Every task logged, every attendance record, every approval decision, every project health score — this is structured, timestamped, trusted data.

Phase 5 puts intelligence on top of that data.

The insight behind the AI Coworker design: every knowledge worker at Publica AI spends a significant portion of their time on preparation work — compiling reports, scanning for anomalies, drafting communications, checking compliance. This preparation work is valuable but not differentiating. The AI Coworkers take it over, and the humans spend their time on the decisions that preparation was meant to inform.

The critical principle that separates this from simple automation: AI Coworkers do not make decisions. They prepare. Every output — a draft report, a risk flag, a contract annotation — goes into a review queue. The responsible human reviews it, approves it, edits it, or dismisses it. Nothing is published without a human vouching for it. This is not a limitation of the technology. It is a deliberate governance choice that keeps humans accountable and coworkers trustworthy.`,
    sections: [
      {
        title: "5.1 The AI Coworker Infrastructure (Schema)",
        who: "Backend Dev + Halima + Martha — GOV-001 must be signed before ai_coworker_memory goes to production",
        what: `Four new tables power the entire AI Coworker system. They are independent of the Phase 1–4 tables — the coworker layer sits on top of, and reads from, the existing platform data.

ai_coworker_registry: The identity table. Every coworker must be registered here before it can operate. Defines the coworker's name, department, primary human reviewer, email read scope, and whether it can send internal notifications. The can_send_internal flag is TRUE for only SIGNAL and ROUTER — every other coworker can draft but never send.

ai_coworker_memory: The learning layer. Every time a coworker processes data, it writes a memory record here. Memory types map to what the coworker is learning: task_pattern (FORGE, GROVE, PIKE), metric_trend (LEDGER, GUARD), incident_pattern (SIGNAL), output_standard (all — the worked examples of good/bad outputs that Confidence creates before activation).

The expires_at field implements the retention policy required by NDPR. Performance memories about named employees expire after 12 months. Email context expires after 90 days. Output standards never expire — they are permanent ground truth. This is not optional: ai_coworker_memory cannot go to production until Halima and Martha have signed off the retention policy document (GOV-001).

ai_coworker_outputs: The review queue. Every draft report, alert, and recommendation a coworker generates lands here with status=pending_review, assigned to the responsible human. The human has three options: Approve (publishes as-is), Edit & Approve (human edits then publishes), Dismiss (removes with a required reason, which feeds back as a learning signal). The recalled status handles the case where an approved output later turns out to be wrong — it removes the output from all surfaces and queues a corrected re-run.

ai_coworker_job_log: The audit trail. Every scheduled job run is logged — coworker name, job name, records processed, outputs generated, memories written, errors. This is the equivalent of the human task log system, applied to AI Coworkers. It enables performance review: if FORGE is generating too many false positives, the job log shows you exactly when it started happening and on which data.`,
        endpoints: [
          {
            method: "GET",
            path: "/api/coworkers",
            who: "Admin / Department Head",
            why: "Lists all registered coworkers and their active/inactive status.",
            how: "Returns ai_coworker_registry records. Employees cannot see this — coworkers are an infrastructure concern, not a user-facing feature list.",
          },
          {
            method: "GET",
            path: "/api/coworkers/:id/outputs",
            who: "Assigned reviewer and their manager",
            why: "Returns the review queue for a specific coworker. The reviewer sees everything assigned to them pending review.",
            how: "Filters by assigned_to = current_user OR assigned_to IN (manager's direct reports). Default: ?status=pending_review. Supports ?status=all.",
          },
          {
            method: "PUT",
            path: "/api/coworkers/:id/outputs/:outputId/review",
            who: "Assigned reviewer only",
            why: "The core human-in-the-loop action. Approve, edit+approve, or dismiss.",
            how: "Status → approved / edited_and_approved / rejected. Dismiss requires edit_notes (the reason). reviewed_by and reviewed_at set automatically. For COUNSEL outputs: secondary_reviewer_id must be set before approval — 400 if missing. NEVER sets sent_at — that is set only when a human manually sends a draft email.",
          },
          {
            method: "PUT",
            path: "/api/coworkers/:id/outputs/:outputId/recall",
            who: "Original reviewer or their manager",
            why: "Retracts an approved output that turns out to be wrong. Removes from all published surfaces.",
            how: "Status → recalled. Sets recalled_by, recalled_at, recall_reason. Fires output.recalled propagation event: UI re-renders removing the content, correction_pending=TRUE set on source record, correction notice notification sent to all prior viewers.",
          },
          {
            method: "GET",
            path: "/api/coworkers/:id/memory",
            who: "Admin / Head of Engineering / Head of Business Support",
            why: "Audit access to a coworker's memory records. Used for debugging and governance review.",
            how: "Returns ai_coworker_memory records. Supports ?memory_type= and ?limit= filters.",
          },
          {
            method: "GET",
            path: "/api/coworkers/:id/job-log",
            who: "Admin / Head of Engineering",
            why: "Returns job execution history. Used to diagnose false positives and performance issues.",
            how: "Returns ai_coworker_job_log records. Supports ?status=failed to filter for errors only.",
          },
        ],
        links:
          "AI-001 (all four tables) → GOV-001 (Halima + Martha retention policy sign-off, blocks ai_coworker_memory production deploy) → AI-002 (seeds Batch 1, builds these endpoints)",
      },
      {
        title: "5.2 Output Quality Standards — Before Any Coworker Goes Live",
        who: "Confidence (PM) — must complete before AI-006 (activation)",
        what: `This is the most important step in Phase 5 and the one most likely to be skipped under time pressure. Do not skip it.

Before any coworker is activated, the person who will review its outputs must write down what a good output looks like and what a bad one looks like. These examples are stored in ai_coworker_memory as output_standard records with confidence_score=1.0. They are the coworker's ground truth — the reference point it measures its own outputs against.

Without these standards, a coworker learns from whatever it sees first. If the first few outputs are mediocre and the reviewer approves them without editing (because it's a new system and expectations aren't calibrated), the coworker's memory records "mediocre = acceptable." The quality floor never rises.

With the standards set correctly, the coworker has a clear benchmark from day one. Every edit a reviewer makes is measured against the standard. Every dismissed suggestion is compared against what the standard says should be flagged. Over time, the coworker's output quality converges on the standard.

Confidence must write standards for all 6 Batch 1 coworkers:
- PIKE: what does a good health score narrative look like vs a vague one?
- GROVE: what does a useful trainee progress report look like vs a data dump?
- FORGE: what does an actionable code review annotation look like vs a generic warning?
- LEDGER: what does a well-described payroll anomaly flag look like vs a false positive?
- GUARD: what does a genuine compliance risk flag look like vs noise?
- SIGNAL: what does a correctly classified incident severity look like?

The weekly status report Confidence writes to Willie manually (PM-007) serves as the PIKE output standard — she writes the report she wants PIKE to eventually write, and that becomes the ground truth.`,
        endpoints: [],
        links:
          "AI-003 (this task) → stored as ai_coworker_memory records with memory_type='output_standard', confidence_score=1.0, expires_at=NULL → AI-006 (activation cannot start until these records exist)",
      },
      {
        title: "5.3 Coworker Job Naming & Activation",
        who: "Backend Dev — starts after AI-001 and AI-003 complete. DevOps — activation after AI-004 and AI-005",
        what: `All existing scheduled jobs from Phase 2 are renamed with the coworker naming convention: COWORKER:job_description. This is not a logic change — it's an identity change. The jobs do exactly what they did before, but now they write to ai_coworker_job_log at the start and end of every run.

Why this matters: once jobs are named to their coworker and writing to the job log, you can measure how each coworker is performing. How many records did FORGE process this week? How many outputs did it generate? How many of those outputs were approved vs dismissed? The job log is the coworker's timesheet.

The activation sequence for Batch 1 is ordered by risk:
1. GROVE first — reads existing task data, outputs go to Kelly only in Alpha. Lowest risk because it's read-only on data that's already well-understood.
2. FORGE — read-only on PR data. Team Lead already does this review manually, so they can easily verify FORGE's accuracy.
3. SIGNAL — already implicit in the gate logic. Formalising it as a coworker with named outputs adds visibility.
4. LEDGER — runs before payroll, Finance Officer reviews. Low risk because the human double-checks everything anyway.
5. GUARD — webhook-driven expense monitoring. Mercy reviews all flags.
6. PIKE last — highest visibility. PIKE's health scores and sprint reviews go to Confidence, Willie, and department heads. Only activate after the others have proven the output review workflow works smoothly.`,
        endpoints: [],
        links:
          "AI-004 (job tagging) → AI-005 (output review UI) → AI-006 (activation through feature flags from Phase 4) → each coworker's Alpha activation goes to primary user only, controlled by allowed_user_ids in feature_flags",
      },
      {
        title: "5.4 Batch 1 Coworkers — Who, What, and Why",
        who: "Reference for all team members — understanding what each coworker does",
        what: `SIGNAL — Incident & Escalation Coworker (reports to CEO)
Reads: all department incident reports. Activated by: any team member reporting an incident.
What it does: classifies incident severity (Low/Medium/High/Critical) and routes to the correct escalation path automatically.
Escalation paths:
- Technical incident: Developer → Team Lead → Kelly → CEO (if client-impacting)
- Client complaint: PM → Head of Product → CEO
- Compliance breach: Mercy → Martha → Halima → CEO
- Legal risk: Halima → CEO directly
Why it matters: without SIGNAL, incidents are reported inconsistently. Some go straight to the CEO as a Slack message. Some never get escalated until they become crises. SIGNAL makes escalation uniform and traceable.

GROVE — Trainee Development Coworker (reports to Kelly)
Reads: trainee task logs, story point data, quality scores.
What it does: generates weekly trainee progress reports with anonymised peer comparisons. When a rotation nears completion, produces a promotion/exit recommendation.
Why it matters: Kelly currently reviews trainee performance from memory and ad-hoc task spot-checks. GROVE provides a structured, data-driven picture every week — no memory required.

FORGE — Code Quality Coworker (reports to Engineering Team Lead)
Reads: PR submissions, code repository, bug tracker.
What it does: first-pass code review flagging security vulnerabilities, style violations, missing tests, regression risks. Bug triage with root cause suggestions and fix time estimates.
Why it matters: Team Lead reviews every PR manually. FORGE does the mechanical checks first, so the Team Lead's review focuses on architecture and logic rather than style and coverage.

LEDGER — Finance Intelligence Coworker (reports to Finance Officers and Martha)
Reads: Zoho Books (via webhook), payroll records, vendor contracts.
What it does: pre-payroll anomaly scan (unusual overtime, expired contracts, missing new employees). Monthly financial narrative for the CEO dashboard. Vendor contract renewal alerts.
Why it matters: payroll anomalies discovered after processing are expensive to correct. LEDGER catches them before the run, every time.

GUARD — Compliance & QA Coworker (reports to Mercy)
Reads: expense claims, cash advances, vendor payments (via Zoho webhook).
What it does: continuous compliance monitoring — high severity in real time, medium/low batched weekly. Post-deployment health checks for finance-related platform features.
Why it matters: Mercy currently reviews compliance manually on a sampling basis. GUARD checks everything, continuously, and surfaces only the genuine risks for Mercy's review.

PIKE — Project Intelligence Coworker (reports to Confidence)
Reads: project board, task data, KPI dashboard, client communication history.
What it does: weekly Health Score calculation and narrative, sprint review drafts, risk register auto-suggestions, client update email drafts, auto-flags projects with two consecutive weeks of score decline.
Why it matters: the full payoff of Phases 1–3. PIKE can only do its job because the task system (Phase 1), the enforcement gates (Phase 2), and the project KPI system (Phase 3) are producing reliable data. This is the coworker that demonstrates most clearly why the phases are ordered the way they are.`,
        endpoints: [],
        links:
          "All Batch 1 coworkers read from Phase 1–3 tables. Their outputs write to ai_coworker_outputs (Phase 5 schema). Their jobs write to ai_coworker_job_log. Activation controlled by feature_flags (Phase 4).",
      },
    ],
    schema: [
      {
        table: "ai_coworker_registry",
        key_fields:
          "id, coworker_name, primary_user_id, email_read_scope[], can_send_internal, is_active",
        why: "Identity and access control for every coworker. Same role it plays as the users table plays for humans.",
      },
      {
        table: "ai_coworker_memory",
        key_fields:
          "id, coworker_id, memory_type, summary_text, confidence_score, expires_at",
        why: "Learning layer. Accumulates patterns, standards, and context over time. Governed by retention policy (GOV-001).",
      },
      {
        table: "ai_coworker_outputs",
        key_fields:
          "id, coworker_id, output_type, output_content, assigned_to, status, reviewed_by, recalled_by, correction_pending, low_confidence_flagged",
        why: "Every output a coworker generates, with its full review lifecycle. The audit trail for human-in-the-loop governance.",
      },
      {
        table: "ai_coworker_job_log",
        key_fields:
          "id, coworker_id, job_name, status, records_processed, outputs_generated, memories_written, error_message",
        why: "The coworker's timesheet. Enables performance review and debugging of each coworker's jobs.",
      },
    ],
    gateNote:
      "Phase 5 ends with AI-REG — the most comprehensive regression in the build. All Phase 1–4 features must still work. No coworker output may be auto-published. PIKE health score outputs must not replace human-entered KPIs until approved.",
  },
};

export default function TeamGuide() {
  const [activePhase, setActivePhase] = useState(1);
  const [activeSection, setActiveSection] = useState(0);
  const [showSchema, setShowSchema] = useState(false);
  const [expandedEndpoint, setExpandedEndpoint] = useState(null);

  const phase = PHASES[activePhase - 1];
  const content = CONTENT[activePhase];
  const section = content.sections[activeSection];

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <h1 className="text-base font-bold text-gray-900">
          Publica AI — Team Build Guide
        </h1>
        <p className="text-xs text-gray-400">
          Phases 1–5 · Logic, Endpoints, and Connections
        </p>
      </div>

      {/* Phase Tabs */}
      <div className="flex gap-1.5 p-3 bg-white border-b overflow-x-auto">
        {PHASES.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setActivePhase(p.id);
              setActiveSection(0);
              setShowSchema(false);
            }}
            className={`flex-shrink-0 rounded-lg px-3 py-2 text-left transition-all ${activePhase === p.id ? `${p.color} text-white` : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            <p className="text-xs font-bold">{p.title}</p>
            <p
              className={`text-xs ${activePhase === p.id ? "text-white/80" : "text-gray-400"}`}
            >
              {p.subtitle}
            </p>
          </button>
        ))}
      </div>

      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-48 shrink-0 bg-white border-r border-gray-200 p-3 sticky top-20 self-start">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
            Sections
          </p>
          <button
            onClick={() => {
              setActiveSection(-1);
              setShowSchema(false);
            }}
            className={`w-full text-left text-xs px-2 py-1.5 rounded mb-1 ${activeSection === -1 ? `${phase.light} ${phase.text} font-semibold border ${phase.border}` : "text-gray-600 hover:bg-gray-50"}`}
          >
            Why This Phase?
          </button>
          {content.sections.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveSection(i);
                setShowSchema(false);
              }}
              className={`w-full text-left text-xs px-2 py-1.5 rounded mb-1 leading-tight ${activeSection === i && !showSchema ? `${phase.light} ${phase.text} font-semibold border ${phase.border}` : "text-gray-600 hover:bg-gray-50"}`}
            >
              {s.title}
            </button>
          ))}
          <button
            onClick={() => {
              setShowSchema(true);
              setActiveSection(-2);
            }}
            className={`w-full text-left text-xs px-2 py-1.5 rounded mb-1 ${showSchema ? `${phase.light} ${phase.text} font-semibold border ${phase.border}` : "text-gray-600 hover:bg-gray-50"}`}
          >
            📦 Schema Tables
          </button>
          <div
            className={`mt-3 p-2 rounded text-xs border ${phase.light} ${phase.border} ${phase.text}`}
          >
            <p className="font-bold mb-1">Phase tag</p>
            <p className="leading-relaxed">{phase.tag}</p>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 max-w-3xl">
          {/* Why This Phase */}
          {activeSection === -1 && (
            <div>
              <h2 className={`text-lg font-bold mb-3 ${phase.text}`}>
                Why Phase {activePhase}?
              </h2>
              <div className="bg-white rounded-lg p-4 border border-gray-200 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {content.why}
              </div>
              <div
                className={`mt-4 rounded-lg p-3 border ${phase.light} ${phase.border}`}
              >
                <p className={`text-xs font-bold ${phase.text} mb-1`}>
                  Phase Gate
                </p>
                <p className="text-xs text-gray-600">{content.gateNote}</p>
              </div>
            </div>
          )}

          {/* Schema */}
          {showSchema && (
            <div>
              <h2 className={`text-lg font-bold mb-3 ${phase.text}`}>
                Schema Tables — Phase {activePhase}
              </h2>
              <div className="space-y-3">
                {content.schema.map((s, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg p-4 border border-gray-200"
                  >
                    <p className="font-mono text-sm font-bold text-gray-800">
                      {s.table}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 font-mono">
                      {s.key_fields}
                    </p>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      {s.why}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section content */}
          {activeSection >= 0 && !showSchema && section && (
            <div>
              <h2 className={`text-lg font-bold mb-1 ${phase.text}`}>
                {section.title}
              </h2>
              <div
                className={`inline-block text-xs px-2 py-0.5 rounded-full mb-3 ${phase.light} ${phase.text} border ${phase.border}`}
              >
                {section.who}
              </div>

              {/* What / Why / How narrative */}
              <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                  The Logic
                </p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {section.what}
                </p>
              </div>

              {/* Endpoints */}
              {section.endpoints.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Endpoints
                  </p>
                  <div className="space-y-2">
                    {section.endpoints.map((ep, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                      >
                        <button
                          className="w-full text-left px-4 py-3 flex items-start gap-3"
                          onClick={() =>
                            setExpandedEndpoint(
                              expandedEndpoint === `${activeSection}-${i}`
                                ? null
                                : `${activeSection}-${i}`,
                            )
                          }
                        >
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded shrink-0 ${ep.method === "GET" ? "bg-blue-100 text-blue-700" : ep.method === "POST" ? "bg-green-100 text-green-700" : ep.method === "PUT" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}
                          >
                            {ep.method}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-mono text-gray-800 font-semibold">
                              {ep.path}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Initiated by: {ep.who}
                            </p>
                          </div>
                          <span className="text-gray-400 text-xs shrink-0">
                            {expandedEndpoint === `${activeSection}-${i}`
                              ? "▲"
                              : "▼"}
                          </span>
                        </button>
                        {expandedEndpoint === `${activeSection}-${i}` && (
                          <div className="px-4 pb-3 border-t border-gray-100 pt-3 space-y-2">
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Why it exists
                              </p>
                              <p className="text-xs text-gray-700 mt-0.5 leading-relaxed">
                                {ep.why}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                How it works
                              </p>
                              <p className="text-xs text-gray-700 mt-0.5 leading-relaxed">
                                {ep.how}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div
                className={`rounded-lg p-3 border ${phase.light} ${phase.border}`}
              >
                <p className={`text-xs font-bold ${phase.text} mb-1`}>
                  🔗 What this connects to
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {section.links}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
