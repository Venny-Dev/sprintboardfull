import { useState } from "react";

const CodeBlock = ({ code }: { code: string }) => (
  <pre className="bg-gray-900 text-green-300 text-xs rounded-lg p-4 overflow-x-auto leading-relaxed whitespace-pre">
    {code}
  </pre>
);

const InfoBox = ({
  color,
  title,
  children,
}: {
  color: "blue" | "amber" | "red" | "green" | "purple";
  title?: string;
  children: React.ReactNode;
}) => {
  const styles = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    amber: "bg-amber-50 border-amber-200 text-amber-800",
    red: "bg-red-50 border-red-200 text-red-800",
    green: "bg-green-50 border-green-200 text-green-800",
    purple: "bg-purple-50 border-purple-200 text-purple-800",
  };
  return (
    <div className={`rounded-lg border p-4 mb-4 ${styles[color]}`}>
      {title && <p className="font-bold text-sm mb-1">{title}</p>}
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
};

const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div className="overflow-x-auto mb-4">
    <table className="w-full text-xs border-collapse">
      <thead>
        <tr className="bg-gray-100">
          {headers.map((h, i) => (
            <th
              key={i}
              className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
            {row.map((cell, j) => (
              <td
                key={j}
                className="px-3 py-2 border border-gray-200 text-gray-700 leading-relaxed"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Step = ({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex gap-3 mb-4">
    <div className="w-7 h-7 rounded-full bg-gray-800 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
      {number}
    </div>
    <div>
      <p className="font-semibold text-sm text-gray-800 mb-1">{title}</p>
      <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
    </div>
  </div>
);

const SectionHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <div className="mb-6">
    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    <div className="w-12 h-1 bg-gray-800 rounded mt-2" />
  </div>
);

const SECTIONS = [
  { id: "overview", label: "What & Why", icon: "💡" },
  { id: "howworks", label: "How It Works", icon: "⚙️" },
  { id: "schema", label: "Schema & API", icon: "🗄️" },
  { id: "dashboard", label: "The Dashboard", icon: "🖥️" },
  { id: "rollout", label: "Staged Rollout", icon: "🚀" },
  { id: "coworkers", label: "Coworker Flags", icon: "🤖" },
  { id: "roles", label: "Who Does What", icon: "👥" },
  { id: "scenarios", label: "Real Scenarios", icon: "📋" },
  { id: "rules", label: "Rules & Governance", icon: "⚖️" },
  { id: "checklist", label: "Checklists", icon: "✅" },
];

const EndpointItem = ({ ep }: { ep: any }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-3">
      <button
        className="w-full text-left px-4 py-3 flex items-center gap-3"
        onClick={() => setOpen(!open)}
      >
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded ${
            ep.method === "GET"
              ? "bg-blue-100 text-blue-700"
              : ep.method === "POST"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {ep.method}
        </span>
        <span className="font-mono text-sm font-semibold text-gray-800">
          {ep.path}
        </span>
        <span className="text-xs text-gray-400 ml-auto">{ep.who}</span>
        <span className="text-gray-400 text-xs ml-2">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="border-t border-gray-100 px-4 py-3 space-y-3">
          <p className="text-xs text-gray-600">{ep.desc}</p>
          <CodeBlock code={ep.response} />
        </div>
      )}
    </div>
  );
};

export default function FeatureFlags() {
  const [active, setActive] = useState("overview");

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="bg-gray-900 text-white px-6 py-5">
        <h1 className="text-xl font-bold">Feature Flag System</h1>
        <p className="text-gray-400 text-sm mt-1">
          Complete Team Guide · Publica AI · Phase 4 Governance
        </p>
        <p className="text-gray-500 text-xs mt-1">
          Audience: All Engineers, DevOps, QA, PM, Department Heads
        </p>
      </div>

      {/* Nav */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex gap-1 overflow-x-auto sticky top-0 z-10">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full font-medium transition-all ${active === s.id ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* ── OVERVIEW ── */}
        {active === "overview" && (
          <div>
            <SectionHeader title="What Is a Feature Flag and Why Do We Need It?" />

            <InfoBox color="blue" title="The one-line explanation">
              A feature flag is an on/off switch that controls whether a feature
              is visible and active for users — without requiring a new code
              deployment.
            </InfoBox>

            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              Imagine you've just built a new payroll anomaly scanner. The code
              is written, tested, and sitting in production. But you don't want
              every Finance Officer in the company using it from day one — you
              want to test it with one person first, catch any edge cases, and
              expand gradually.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              Without feature flags, you have two options: deploy it for
              everyone at once (risky), or don't deploy it at all until you're
              certain (slow). Feature flags give you a third option: deploy it
              dark — live in production but invisible to users — and turn it on
              for exactly who you choose, when you choose.
            </p>

            <div className="bg-gray-900 rounded-lg p-4 mb-6 text-center">
              <p className="text-white text-sm font-semibold mb-3">
                The lifecycle without vs with feature flags
              </p>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-red-900/40 rounded p-3">
                  <p className="text-red-300 text-xs font-bold mb-2">
                    ❌ Without Feature Flags
                  </p>
                  <div className="text-xs text-gray-300 space-y-1 text-left">
                    <p>→ Build feature</p>
                    <p>→ Deploy to production</p>
                    <p>→ All users see it immediately</p>
                    <p>→ Bug found affecting everyone</p>
                    <p>→ Emergency rollback deployment</p>
                    <p>→ Downtime + damage</p>
                  </div>
                </div>
                <div className="flex-1 bg-green-900/40 rounded p-3">
                  <p className="text-green-300 text-xs font-bold mb-2">
                    ✅ With Feature Flags
                  </p>
                  <div className="text-xs text-gray-300 space-y-1 text-left">
                    <p>→ Build feature</p>
                    <p>→ Deploy dark (flag OFF)</p>
                    <p>→ Enable for internal team only</p>
                    <p>→ Bug found — flag OFF instantly</p>
                    <p>→ Fix bug, re-enable</p>
                    <p>→ Expand to everyone safely</p>
                  </div>
                </div>
              </div>
            </div>

            <SectionHeader
              title="Two Things Feature Flags Govern at Publica AI"
              subtitle="Product features AND AI Coworker activations"
            />

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="font-bold text-sm text-blue-700 mb-2">
                  🔧 Type 1 — Product Feature Flags
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Controls whether a platform feature is visible and active for
                  a user segment. Examples: the new Kanban view, the payroll
                  scanner, the phase gate checklist system. Every new product
                  feature is deployed behind a flag and activated gradually.
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <p className="font-bold text-sm text-pink-700 mb-2">
                  🤖 Type 2 — Coworker Activation Flags
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Controls whether an AI Coworker is actively running its jobs
                  and generating outputs. GROVE, FORGE, PIKE, LEDGER, GUARD,
                  SIGNAL — each has its own flag. They follow the exact same
                  Alpha → Beta → Full Release protocol as product features.
                </p>
              </div>
            </div>

            <InfoBox
              color="amber"
              title="Why coworkers use the same flag system"
            >
              An AI Coworker that generates too many false positive alerts will
              train its primary user to ignore all alerts — including real ones.
              The staged rollout exists to catch this before it becomes
              company-wide. GROVE going live for Kelly first (Alpha) means Kelly
              can calibrate whether GROVE's trainee progress reports are
              accurate before the whole Engineering team sees them.
            </InfoBox>
          </div>
        )}

        {/* ── HOW IT WORKS ── */}
        {active === "howworks" && (
          <div>
            <SectionHeader title="How Feature Flags Work — The Mechanics" />

            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              Every feature flag is a row in the{" "}
              <code className="bg-gray-100 px-1 rounded text-xs">
                feature_flags
              </code>{" "}
              database table. The flag has a name, an on/off state, and
              targeting rules that control exactly who can see the feature when
              it's on.
            </p>

            <p className="text-sm font-semibold text-gray-800 mb-2">
              The four targeting mechanisms
            </p>

            <Table
              headers={["Mechanism", "Field", "What It Does", "Example"]}
              rows={[
                [
                  "Global toggle",
                  "is_active",
                  "Turns the feature on or off for everyone in scope",
                  "is_active = FALSE → nobody sees it",
                ],
                [
                  "Percentage rollout",
                  "rollout_percentage",
                  "Activates for a random percentage of all users",
                  "rollout_percentage = 20 → 1 in 5 users sees it",
                ],
                [
                  "Specific users",
                  "allowed_user_ids[]",
                  "Activates for named individuals only",
                  "allowed_user_ids = [Kelly's ID] → only Kelly",
                ],
                [
                  "Specific departments",
                  "allowed_department_ids[]",
                  "Activates for everyone in a department",
                  "allowed_department_ids = [Engineering ID] → all of Engineering",
                ],
              ]}
            />

            <p className="text-sm font-semibold text-gray-800 mb-2 mt-4">
              How the check works at runtime
            </p>
            <p className="text-sm text-gray-600 mb-3">
              When a user tries to access a feature, the backend runs this check
              in order:
            </p>

            <CodeBlock
              code={`function canAccessFeature(userId, departmentId, flagName) {
  const flag = getFlag(flagName);

  // Step 1: Is the flag active at all?
  if (!flag.is_active) return false;

  // Step 2: Is the user explicitly allowed?
  if (flag.allowed_user_ids.includes(userId)) return true;

  // Step 3: Is the user's department allowed?
  if (flag.allowed_department_ids.includes(departmentId)) return true;

  // Step 4: Does the percentage rollout include this user?
  if (flag.rollout_percentage === 100) return true;
  if (flag.rollout_percentage > 0) {
    // Deterministic hash — same user always gets same result
    return deterministicHash(userId) % 100 < flag.rollout_percentage;
  }

  return false;
}`}
            />

            <InfoBox
              color="blue"
              title="Why deterministic hashing matters for rollout_percentage"
            >
              When rollout_percentage = 20, the same user must consistently see
              the feature or not see it. If it were random, the user's
              experience would change every page load — they'd see the feature,
              refresh, and it would disappear. The deterministic hash ensures a
              user either always falls in the 20% or never does, based on their
              user ID.
            </InfoBox>

            <p className="text-sm font-semibold text-gray-800 mb-2 mt-4">
              What happens when a flag is OFF
            </p>
            <p className="text-sm text-gray-600 mb-3">
              When a user tries to access an endpoint protected by a flag that's
              off or not targeted at them, the API returns:
            </p>
            <CodeBlock
              code={`// API response when flag is off for this user
HTTP 404 Not Found
{
  "error": "FEATURE_NOT_AVAILABLE",
  "message": "This feature is not available for your account."
}

// Note: 404, not 403. The feature doesn't exist for this user —
// it's not that they're forbidden, it just isn't there.
// This prevents information leakage about unreleased features.`}
            />
          </div>
        )}

        {/* ── SCHEMA & API ── */}
        {active === "schema" && (
          <div>
            <SectionHeader
              title="Schema & API Reference"
              subtitle="For backend developers"
            />

            <p className="text-sm font-semibold text-gray-800 mb-2">
              The feature_flags table
            </p>
            <CodeBlock
              code={`CREATE TABLE feature_flags (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  VARCHAR(100) NOT NULL UNIQUE,
  -- Naming convention: 'feature:module_name' or 'coworker:coworker_name'
  -- Examples: 'feature:payroll_scanner', 'coworker:grove', 'feature:kanban_view'

  is_active             BOOLEAN NOT NULL DEFAULT FALSE,
  -- Always starts FALSE. Never deploy a flag as TRUE.

  rollout_percentage    INTEGER NOT NULL DEFAULT 0,
  -- 0 = nobody. 100 = everyone. Values in between = partial rollout.
  -- Only meaningful when is_active = TRUE.

  allowed_user_ids      UUID[],
  -- Array of user IDs. These users see the feature regardless of percentage.
  -- Used for Alpha stage targeting.

  allowed_department_ids UUID[],
  -- Array of department IDs. All members of these departments see the feature.
  -- Used for Beta stage targeting.

  flag_type             VARCHAR(20) NOT NULL DEFAULT 'feature',
  -- Enum: 'feature' | 'coworker'
  -- Controls which section of the dashboard it appears in.

  coworker_id           UUID REFERENCES ai_coworker_registry(id),
  -- Only set when flag_type = 'coworker'. NULL for product features.

  created_by            UUID NOT NULL REFERENCES users(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`}
            />

            <p className="text-sm font-semibold text-gray-800 mb-2 mt-5">
              API Endpoints
            </p>

            <div className="space-y-3">
              {[
                {
                  method: "GET",
                  path: "/api/feature-flags",
                  who: "Admin / DevOps / Head of Products",
                  desc: "Returns all feature flags. Product feature flags and coworker activation flags returned separately.",
                  response: `{
  "product_features": [
    {
      "id": "uuid",
      "name": "feature:payroll_scanner",
      "is_active": true,
      "rollout_percentage": 20,
      "allowed_user_ids": [],
      "allowed_department_ids": ["finance-dept-id"],
      "flag_type": "feature"
    }
  ],
  "coworker_activations": [
    {
      "id": "uuid",
      "name": "coworker:grove",
      "is_active": true,
      "allowed_user_ids": ["kelly-id"],
      "flag_type": "coworker",
      "coworker_id": "grove-registry-id"
    }
  ]
}`,
                },
                {
                  method: "POST",
                  path: "/api/feature-flags",
                  who: "Admin / DevOps only",
                  desc: "Creates a new feature flag. Always created with is_active=FALSE.",
                  response: `// Request body
{
  "name": "feature:new_dashboard",
  "flag_type": "feature"
  // is_active defaults to FALSE — never pass TRUE on creation
}

// Response: created flag record`,
                },
                {
                  method: "PUT",
                  path: "/api/feature-flags/:id",
                  who: "Admin / DevOps only",
                  desc: "Updates flag state, targeting, or rollout percentage. All changes are logged with actor and timestamp.",
                  response: `// To activate for Alpha (specific users only):
{
  "is_active": true,
  "allowed_user_ids": ["user-id-1", "user-id-2"]
}

// To advance to Beta (department):
{
  "allowed_user_ids": [],
  "allowed_department_ids": ["dept-id"]
}

// To advance to Full Release:
{
  "allowed_department_ids": [],
  "rollout_percentage": 100
}

// Emergency rollback (instant, no deployment):
{
  "is_active": false
}`,
                },
                {
                  method: "GET",
                  path: "/api/feature-flags/check/:flagName",
                  who: "Any authenticated user",
                  desc: "Checks if the current user has access to a specific flag. Used by the frontend to show/hide UI elements.",
                  response: `// Response
{ "has_access": true }
// or
{ "has_access": false }`,
                },
                {
                  method: "GET",
                  path: "/api/feature-flags/:id/audit",
                  who: "Admin / DevOps",
                  desc: "Returns the full change history for a flag — who changed it, when, and what changed.",
                  response: `[
  {
    "changed_by": "DevOps Name",
    "changed_at": "2026-03-15T09:23:00Z",
    "change": "is_active: false → true",
    "stage": "Alpha"
  }
]`,
                },
              ].map((ep, i) => (
                <EndpointItem key={i} ep={ep} />
              ))}
            </div>

            <InfoBox color="amber" title="Naming convention — important">
              All flag names must follow the prefix convention:{" "}
              <code className="bg-amber-100 px-1 rounded">feature:</code> for
              product features,{" "}
              <code className="bg-amber-100 px-1 rounded">coworker:</code> for
              AI Coworker activations. Examples:{" "}
              <code className="bg-amber-100 px-1 rounded">
                feature:payroll_scanner
              </code>
              ,{" "}
              <code className="bg-amber-100 px-1 rounded">coworker:grove</code>.
              This naming drives how the dashboard organises flags and prevents
              confusion between the two types.
            </InfoBox>
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {active === "dashboard" && (
          <div>
            <SectionHeader
              title="The Feature Flag Dashboard"
              subtitle="How to use it — for DevOps, Admin, and Head of Products"
            />

            <InfoBox color="amber" title="Access control">
              The Feature Flag Dashboard is accessible to: Admin, DevOps
              Engineer, and Head of Products. No one else. Developers cannot
              toggle their own features in production. This is a governance
              rule, not a technical limitation — a developer who built a feature
              has a conflict of interest in deciding when it's ready for wider
              release.
            </InfoBox>

            <p className="text-sm font-semibold text-gray-800 mb-3">
              Dashboard layout
            </p>
            <p className="text-sm text-gray-600 mb-4">
              The dashboard has two sections, always displayed separately:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg border-2 border-blue-200 p-4">
                <p className="text-blue-700 font-bold text-sm mb-2">
                  🔧 Product Features
                </p>
                <p className="text-xs text-gray-600 mb-3">
                  All flags with flag_type = 'feature'. Sorted by most recently
                  updated. Each card shows:
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Flag name and description</li>
                  <li>• Current status (OFF / Alpha / Beta / Live)</li>
                  <li>• Current targeting (who can see it)</li>
                  <li>• Rollout percentage progress bar</li>
                  <li>• Last changed by / when</li>
                  <li>• Toggle button (DevOps/Admin only)</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg border-2 border-pink-200 p-4">
                <p className="text-pink-700 font-bold text-sm mb-2">
                  🤖 AI Coworker Activations
                </p>
                <p className="text-xs text-gray-600 mb-3">
                  All flags with flag_type = 'coworker'. Each card shows:
                </p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Coworker name and primary user</li>
                  <li>• Activation stage (Inactive / Alpha / Beta / Live)</li>
                  <li>• Current audience</li>
                  <li>• Outputs generated this week</li>
                  <li>• Approval rate (% approved vs dismissed)</li>
                  <li>• Toggle button (DevOps/Admin only)</li>
                </ul>
              </div>
            </div>

            <p className="text-sm font-semibold text-gray-800 mb-2">
              How to advance a feature through stages
            </p>
            <p className="text-sm text-gray-600 mb-3">
              Every stage transition follows the same four steps:
            </p>

            <Step number="1" title="Confirm the current stage has passed">
              The pass criteria for the current stage must be met. Alpha: no
              critical bugs found by the internal team. Beta: no regression in
              existing features reported by the beta group. You cannot advance a
              stage that has not passed — the PM (Confidence) must confirm
              sign-off before DevOps makes any change.
            </Step>
            <Step number="2" title="Update the targeting in the dashboard">
              Open the flag. Update allowed_user_ids (for Alpha),
              allowed_department_ids (for Beta), or rollout_percentage = 100
              (for Full Release). For stage transitions, clear the previous
              targeting — don't stack them.
            </Step>
            <Step number="3" title="Verify the targeting is correct">
              After saving, test with a user who should now have access and
              confirm they do. Test with a user who should not have access and
              confirm they don't. This takes 2 minutes and prevents silent
              misfires.
            </Step>
            <Step number="4" title="Log the stage change">
              Add a note to the flag's audit log: what stage, who approved,
              date. This creates the paper trail that shows the feature followed
              the correct governance process.
            </Step>

            <InfoBox
              color="red"
              title="Emergency rollback — how to do it in under 60 seconds"
            >
              If a feature causes a production issue after going live: open the
              Feature Flag Dashboard, find the flag, toggle is_active = FALSE.
              The feature disappears for all users instantly — no deployment, no
              rollback, no downtime. The code stays in production ready to
              re-enable once the issue is fixed. This is the single most
              important benefit of feature flags on a live platform.
            </InfoBox>
          </div>
        )}

        {/* ── STAGED ROLLOUT ── */}
        {active === "rollout" && (
          <div>
            <SectionHeader
              title="The Staged Rollout Protocol"
              subtitle="Every feature follows this path. No exceptions."
            />

            <InfoBox color="red" title="Non-negotiable">
              No feature goes from development to all users in one step. The
              staged rollout protocol is mandatory for every new feature and
              every AI Coworker activation. Bypassing a stage requires sign-off
              from the PM (Confidence) and a documented reason. "We're in a
              hurry" is not a documented reason.
            </InfoBox>

            <div className="space-y-4 mb-6">
              {[
                {
                  stage: "Pre-deployment",
                  color: "bg-gray-100 border-gray-300 text-gray-700",
                  badge: "bg-gray-200 text-gray-700",
                  audience: "Nobody — feature exists but is invisible",
                  duration: "N/A",
                  flag: "is_active = FALSE",
                  pass: "Code merged to production. Flag created. Feature confirmed invisible to all users.",
                  who: "Developer creates the flag with is_active=FALSE before or during the PR merge.",
                  action:
                    "Deploy the code. Create the flag. Confirm nobody can access the feature.",
                },
                {
                  stage: "Alpha",
                  color: "bg-blue-50 border-blue-300 text-blue-800",
                  badge: "bg-blue-600 text-white",
                  audience: "Internal dev and QA team only",
                  duration: "2–3 days (features) / 1–2 weeks (coworkers)",
                  flag: "is_active = TRUE, allowed_user_ids = [dev team + QA]",
                  pass: "No critical bugs found. Feature works as specified. QA has signed off.",
                  who: "DevOps activates. Developers and Mercy (QA) test. Tech Lead signs off. Confidence confirms.",
                  action:
                    "Set allowed_user_ids to dev team and QA. Test thoroughly. Fix any bugs found. Get sign-off from Mercy and Tech Lead before advancing.",
                },
                {
                  stage: "Beta",
                  color: "bg-purple-50 border-purple-300 text-purple-800",
                  badge: "bg-purple-600 text-white",
                  audience: "One selected department — chosen strategically",
                  duration: "3–5 days (features) / 2–3 weeks (coworkers)",
                  flag: "is_active = TRUE, allowed_department_ids = [selected dept]",
                  pass: "No regression in existing features. Beta group confirms value. No disruption to existing workflows.",
                  who: "DevOps activates. The beta department uses it naturally. Confidence monitors feedback. PM signs off to advance.",
                  action:
                    "Clear allowed_user_ids. Set allowed_department_ids to the chosen beta department. Monitor for regression and user complaints. Get PM sign-off before Full Release.",
                },
                {
                  stage: "Full Release",
                  color: "bg-green-50 border-green-300 text-green-800",
                  badge: "bg-green-600 text-white",
                  audience: "All users",
                  duration:
                    "Permanent — monitored for 7 days (30 days for coworkers)",
                  flag: "is_active = TRUE, rollout_percentage = 100",
                  pass: "Stable for full monitoring period. Automated health checks passing. No critical issues reported.",
                  who: "DevOps activates. FORGE and GUARD monitor automated health checks. Any critical issue triggers emergency rollback.",
                  action:
                    "Clear department targeting. Set rollout_percentage = 100. Monitor health checks for the full monitoring period. Document the feature in the Stable Features Registry.",
                },
              ].map((s, i) => (
                <div key={i} className={`rounded-lg border-2 p-4 ${s.color}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.badge}`}
                    >
                      {s.stage}
                    </span>
                    <span className="text-xs opacity-70">{s.duration}</span>
                  </div>
                  <Table
                    headers={["", ""]}
                    rows={[
                      ["Audience", s.audience],
                      ["Flag state", s.flag],
                      ["Pass criteria", s.pass],
                      ["Who is involved", s.who],
                      ["DevOps action", s.action],
                    ]}
                  />
                </div>
              ))}
            </div>

            <InfoBox color="amber" title="How to choose the Beta department">
              Don't choose the most forgiving department — choose the most
              representative one. If you're rolling out a task management
              improvement, beta it with Engineering (heavy task users), not
              Legal (light task users). The beta group needs to actually use the
              feature in their normal workflow to give you meaningful signal. A
              department that barely touches the feature won't catch edge cases.
            </InfoBox>

            <p className="text-sm font-semibold text-gray-800 mb-2">
              If a stage fails
            </p>
            <CodeBlock
              code={`// Stage failure protocol

1. Toggle is_active = FALSE immediately
   → Feature disappears for all users instantly

2. Document what failed
   → What was the bug / regression / complaint?
   → Which user / scenario triggered it?
   → Is it a code issue or a scope issue?

3. Fix the issue in development

4. Re-deploy the fix (the flag stays in place — no new flag needed)

5. Restart from Alpha
   → Even if Beta failed, restart from Alpha to re-verify the fix
   → Don't skip stages because "it was working before"`}
            />
          </div>
        )}

        {/* ── COWORKER FLAGS ── */}
        {active === "coworkers" && (
          <div>
            <SectionHeader
              title="AI Coworker Activation Flags"
              subtitle="How coworkers go live — same system, different stakes"
            />

            <InfoBox
              color="purple"
              title="Why coworkers need their own rollout protocol"
            >
              A buggy product feature causes user confusion. A miscalibrated AI
              Coworker causes something worse: it erodes trust in AI outputs
              across the entire organisation. If PIKE generates inaccurate
              health scores for two weeks and Confidence approves them without
              noticing, the health score becomes meaningless — not just for
              those two weeks, but going forward because trust is broken. The
              staged rollout for coworkers exists to prevent this.
            </InfoBox>

            <p className="text-sm font-semibold text-gray-800 mb-2">
              Coworker flag naming and structure
            </p>
            <CodeBlock
              code={`-- Coworker activation flag example
INSERT INTO feature_flags (
  name,                    -- 'coworker:grove'
  is_active,               -- FALSE (always starts inactive)
  flag_type,               -- 'coworker'
  coworker_id,             -- FK to ai_coworker_registry.id
  allowed_user_ids,        -- Start with primary user only (Alpha)
  allowed_department_ids,  -- Add full department in Beta
  rollout_percentage       -- 100 for Full Release
) VALUES (
  'coworker:grove', FALSE, 'coworker', '<grove-uuid>',
  '{"<kelly-uuid>"}', '{}', 0
);`}
            />

            <p className="text-sm font-semibold text-gray-800 mb-3 mt-4">
              Batch 1 coworkers — activation order and rationale
            </p>
            <Table
              headers={[
                "Order",
                "Coworker",
                "Primary User",
                "Alpha Audience",
                "Why This Order",
              ]}
              rows={[
                [
                  "1st",
                  "GROVE",
                  "Kelly",
                  "Kelly only",
                  "Read-only on existing task data. Output is a weekly report. Zero risk of affecting existing workflows.",
                ],
                [
                  "2nd",
                  "FORGE",
                  "Engineering Team Lead",
                  "Team Lead only",
                  "Read-only on PRs. Team Lead already reviews PRs manually — easy to verify FORGE's accuracy against their own judgement.",
                ],
                [
                  "3rd",
                  "SIGNAL",
                  "CEO (Willie)",
                  "All team leads",
                  "Gate logic already exists. SIGNAL formalises it with named outputs. Low new risk.",
                ],
                [
                  "4th",
                  "LEDGER",
                  "Finance Officers",
                  "Finance Officers only",
                  "Pre-payroll scan runs before Finance Officer reviews anyway. Easy human double-check in parallel.",
                ],
                [
                  "5th",
                  "GUARD",
                  "Mercy",
                  "Mercy only",
                  "Webhook-driven compliance flags. Mercy reviews everything — false positives are caught before escalation.",
                ],
                [
                  "6th (last)",
                  "PIKE",
                  "Confidence",
                  "Confidence only",
                  "Highest visibility outputs (health scores, sprint reviews go to Willie and dept heads). Activate last when output review workflow is proven.",
                ],
              ]}
            />

            <p className="text-sm font-semibold text-gray-800 mb-2 mt-4">
              What a coworker Alpha looks like in practice
            </p>
            <Step number="1" title="PM-002 must be complete first">
              Before the flag is toggled for Alpha, Confidence must have written
              the output quality standards — good and bad examples for each
              output type — stored in ai_coworker_memory. Without this, the
              coworker has no reference standard and can't be evaluated fairly
              during Alpha.
            </Step>
            <Step number="2" title="Toggle flag for primary user only">
              DevOps sets allowed_user_ids = [primary_user_id]. The coworker's
              jobs start running. Outputs start appearing in the primary user's
              review queue.
            </Step>
            <Step
              number="3"
              title="Primary user reviews every output for 1–2 weeks"
            >
              The primary user uses Approve / Edit & Approve / Dismiss on every
              output. They pay attention to: Is the data accurate? Are the flags
              genuine issues or noise? Does the output format match what they
              need? They record their verdict in a simple doc — not just
              approving and moving on.
            </Step>
            <Step number="4" title="Pass or fail Alpha">
              Pass criteria: outputs are accurate, false positive rate is below
              20%, primary user confirms the coworker is adding genuine value.
              If pass: advance to Beta. If fail: turn off the flag, review the
              job logic, restart from Alpha after the fix.
            </Step>

            <InfoBox
              color="blue"
              title="The approval rate metric — what to watch"
            >
              The Feature Flag Dashboard shows each active coworker's approval
              rate: what percentage of its outputs were Approved vs Dismissed.
              During Alpha, you want this above 80%. If it's below 60%, the
              coworker is generating too many low-quality outputs — investigate
              before advancing to Beta. If it's consistently 95%+ for several
              weeks, that's a signal the primary user may not be reading outputs
              carefully enough (rubber-stamping) — check whether edits are being
              made before approval.
            </InfoBox>
          </div>
        )}

        {/* ── ROLES ── */}
        {active === "roles" && (
          <div>
            <SectionHeader
              title="Who Does What"
              subtitle="Clear responsibilities for every person involved"
            />

            {[
              {
                role: "Developer",
                color: "text-blue-700",
                responsibilities: [
                  "Creates the feature flag before or during the PR merge — always with is_active = FALSE",
                  "Wraps new feature code in the flag check so the feature is invisible until the flag is active",
                  "Declares feature dependencies when starting a new feature (used for regression checklists)",
                  "Never toggles their own flag in production — this is not their decision to make",
                  "Notifies DevOps when a feature is ready for Alpha activation",
                ],
                canNotDo: [
                  "Toggle any flag in production",
                  "Advance a flag from one stage to the next",
                  "Create a flag with is_active = TRUE",
                ],
              },
              {
                role: "Tech Lead (Victor / Debby)",
                color: "text-blue-700",
                responsibilities: [
                  "Reviews and approves the declared feature dependencies before Alpha",
                  "Provides final technical sign-off that the implementation is solid before Alpha activation",
                  "Reviews FORGE's code review outputs during Alpha — verifies they're accurate",
                  "Coordinates with DevOps on Alpha timing",
                ],
                canNotDo: [
                  "Toggle flags in production without DevOps",
                  "Skip the dependency declaration step",
                ],
              },
              {
                role: "DevOps Engineer",
                color: "text-green-700",
                responsibilities: [
                  "Manages the Feature Flag Dashboard — the only person who toggles flags in production",
                  "Activates each stage (Alpha → Beta → Full Release) only after PM sign-off",
                  "Responds to automated health monitoring alerts post-deployment",
                  "Executes emergency rollbacks immediately when instructed or when critical alerts fire",
                  "Logs every stage change in the flag's audit trail",
                  "Manages coworker activation flags alongside product feature flags",
                ],
                canNotDo: [
                  "Advance a stage without PM sign-off",
                  "Create new flags with is_active = TRUE",
                ],
              },
              {
                role: "Mercy — QA / Compliance",
                color: "text-yellow-700",
                responsibilities: [
                  "Runs the regression testing checklist before any feature advances from Alpha",
                  "Signs off on the QA phase gate — this sign-off is required before Beta",
                  "Manages the Stable Features Registry — adds newly deployed features, re-verifies dependencies",
                  "Reviews GUARD's compliance outputs during GUARD's Alpha and Beta",
                  "Owns the GUARD coworker relationship post-Full Release",
                ],
                canNotDo: [
                  "Toggle flags",
                  "Skip QA sign-off to meet a deadline — there are no exceptions",
                ],
              },
              {
                role: "Confidence — PM",
                color: "text-teal-700",
                responsibilities: [
                  "Signs off each stage transition — no stage advances without PM approval",
                  "Blocks any attempt to bypass a stage, regardless of pressure",
                  "Monitors Beta feedback from the beta department",
                  "Owns the PM-002 output quality standards — must be done before any coworker Alpha",
                  "Writes the PIKE output quality standards (good/bad examples for each output type)",
                  "Reviews PIKE's outputs during PIKE Alpha and confirms whether they're adding value",
                ],
                canNotDo: [
                  "Toggle flags herself",
                  "Approve a stage transition before pass criteria are met",
                ],
              },
              {
                role: "Kelly — Head of Engineering",
                color: "text-orange-700",
                responsibilities: [
                  "Owns the FORGE and GROVE coworker relationships",
                  "Reviews FORGE and GROVE outputs during Alpha — provides honest assessment of quality",
                  "Approves FORGE and GROVE Full Release based on Alpha and Beta performance",
                  "Escalates to Confidence if a coworker is generating low-quality outputs",
                ],
                canNotDo: [
                  "Toggle coworker flags unilaterally — that goes through DevOps + PM sign-off",
                ],
              },
            ].map((r, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 p-4 mb-4"
              >
                <p className={`font-bold text-base mb-3 ${r.color}`}>
                  {r.role}
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Responsibilities
                    </p>
                    <ul className="space-y-1">
                      {r.responsibilities.map((item, j) => (
                        <li
                          key={j}
                          className="text-xs text-gray-700 flex gap-2"
                        >
                          <span className="text-green-500 shrink-0">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Cannot Do
                    </p>
                    <ul className="space-y-1">
                      {r.canNotDo.map((item, j) => (
                        <li
                          key={j}
                          className="text-xs text-gray-700 flex gap-2"
                        >
                          <span className="text-red-400 shrink-0">✕</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── SCENARIOS ── */}
        {active === "scenarios" && (
          <div>
            <SectionHeader title="Real Scenarios — What to Do in Each Situation" />

            {[
              {
                title: "Scenario 1: Shipping a new feature (normal flow)",
                color: "border-blue-300",
                steps: [
                  {
                    actor: "Developer",
                    action:
                      "Finishes building the payroll anomaly scanner. Creates flag 'feature:payroll_scanner' with is_active=FALSE. Merges PR.",
                  },
                  {
                    actor: "Developer",
                    action:
                      "Notifies DevOps and Confidence: 'payroll scanner is ready for Alpha. Flag is created.'",
                  },
                  {
                    actor: "DevOps",
                    action:
                      "Activates Alpha: sets is_active=TRUE, allowed_user_ids=[dev team + Mercy].",
                  },
                  {
                    actor: "Mercy",
                    action:
                      "Tests the scanner for 2–3 days. Finds one bug in the hours calculation. Developer fixes it.",
                  },
                  {
                    actor: "Mercy + Tech Lead",
                    action: "Sign off: no critical bugs. Notify Confidence.",
                  },
                  {
                    actor: "Confidence",
                    action:
                      "Approves Beta. Selects Finance as beta department.",
                  },
                  {
                    actor: "DevOps",
                    action:
                      "Advances to Beta: clears allowed_user_ids, sets allowed_department_ids=[Finance dept ID].",
                  },
                  {
                    actor: "Finance Officers",
                    action:
                      "Use the scanner for 4 days in their normal workflow. No regressions reported.",
                  },
                  { actor: "Confidence", action: "Approves Full Release." },
                  {
                    actor: "DevOps",
                    action:
                      "Sets rollout_percentage=100. Clears department targeting. Monitors health checks for 7 days.",
                  },
                  {
                    actor: "Mercy",
                    action:
                      "Adds 'payroll_anomaly_scanner' to the Stable Features Registry with LEDGER as monitoring coworker.",
                  },
                ],
              },
              {
                title: "Scenario 2: A bug is discovered during Beta",
                color: "border-amber-300",
                steps: [
                  {
                    actor: "Finance Officer (Beta)",
                    action:
                      "Reports: 'The scanner is flagging every payroll run as anomalous, even clean ones.'",
                  },
                  {
                    actor: "Confidence",
                    action: "Immediately contacts DevOps.",
                  },
                  {
                    actor: "DevOps",
                    action:
                      "Toggles is_active=FALSE. Feature disappears for Finance team instantly. No deployment.",
                  },
                  {
                    actor: "Developer",
                    action:
                      "Investigates. Finds the threshold calculation was using raw numbers instead of percentages.",
                  },
                  {
                    actor: "Developer",
                    action:
                      "Fixes and re-deploys. Flag remains FALSE during fix.",
                  },
                  {
                    actor: "Mercy",
                    action:
                      "Re-runs Alpha testing with the fix. Confirms clean.",
                  },
                  {
                    actor: "Confidence",
                    action:
                      "Approves returning to Beta — restarting from Beta, not Full Release.",
                  },
                  {
                    actor: "DevOps",
                    action:
                      "Re-enables for Finance Beta. 3 more days clean. Advances to Full Release.",
                  },
                ],
              },
              {
                title:
                  "Scenario 3: Activating GROVE (AI Coworker) for the first time",
                color: "border-pink-300",
                steps: [
                  {
                    actor: "Confidence",
                    action:
                      "Writes GROVE output quality standards: 2 examples of a good trainee progress report, 2 examples of a bad one. Stores in ai_coworker_memory.",
                  },
                  {
                    actor: "DevOps",
                    action:
                      "Sets GROVE flag: is_active=TRUE, allowed_user_ids=[Kelly's ID only].",
                  },
                  {
                    actor: "GROVE",
                    action:
                      "Starts running GROVE:weekly_trainee_progress_scan every Friday. Outputs appear in Kelly's review queue.",
                  },
                  {
                    actor: "Kelly",
                    action:
                      "Reviews every GROVE output for 2 weeks. Approves accurate ones, dismisses inaccurate ones with specific reasons.",
                  },
                  {
                    actor: "Kelly",
                    action:
                      "After 2 weeks: 'GROVE is flagging the right trainees and the format is useful. Approval rate around 85%.' Notifies Confidence.",
                  },
                  {
                    actor: "Confidence",
                    action: "Reviews Kelly's assessment. Approves Beta.",
                  },
                  {
                    actor: "DevOps",
                    action:
                      "Advances GROVE to Beta: adds allowed_department_ids=[Engineering dept ID]. GROVE now runs for all team leads.",
                  },
                  {
                    actor: "Team Leads",
                    action:
                      "Use GROVE outputs for 2 weeks. No disruption to existing workflows.",
                  },
                  { actor: "Confidence", action: "Approves Full Release." },
                  {
                    actor: "DevOps",
                    action:
                      "Sets rollout_percentage=100 for GROVE. Monitors for 30 days.",
                  },
                ],
              },
              {
                title:
                  "Scenario 4: Emergency production incident (fastest path)",
                color: "border-red-300",
                steps: [
                  {
                    actor: "User",
                    action:
                      "Reports: 'The new task board is crashing for everyone on mobile.'",
                  },
                  {
                    actor: "Anyone",
                    action:
                      "Contacts DevOps immediately via agreed urgent channel (Slack/call).",
                  },
                  {
                    actor: "DevOps",
                    action:
                      "Opens Feature Flag Dashboard. Finds 'feature:new_task_board'. Toggles is_active=FALSE.",
                  },
                  {
                    actor: "System",
                    action:
                      "Task board reverts to previous version for all users. No deployment. No downtime. Time elapsed: under 60 seconds.",
                  },
                  {
                    actor: "Developer",
                    action:
                      "Investigates mobile crash. Fixes. Re-deploys behind the existing flag (still FALSE).",
                  },
                  {
                    actor: "Mercy",
                    action: "Re-tests on mobile. Confirms fix.",
                  },
                  {
                    actor: "DevOps",
                    action: "Re-enables flag at rollout_percentage=100.",
                  },
                ],
              },
            ].map((scenario, i) => (
              <div
                key={i}
                className={`bg-white rounded-lg border-2 p-4 mb-5 ${scenario.color}`}
              >
                <p className="font-bold text-sm text-gray-800 mb-3">
                  {scenario.title}
                </p>
                <div className="space-y-2">
                  {scenario.steps.map((step, j) => (
                    <div key={j} className="flex gap-3">
                      <span className="text-xs font-bold text-gray-500 w-28 shrink-0 pt-0.5">
                        {step.actor}
                      </span>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        {step.action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── RULES ── */}
        {active === "rules" && (
          <div>
            <SectionHeader
              title="Rules & Governance"
              subtitle="Non-negotiable. No exceptions."
            />

            {[
              {
                rule: "Rule 1 — All flags start inactive",
                color: "border-red-400",
                detail:
                  "Every feature flag is created with is_active = FALSE. No flag is ever created with is_active = TRUE. This applies without exception — not for hotfixes, not for 'quick things', not for urgent features. The staging process exists precisely for things that feel urgent.",
              },
              {
                rule: "Rule 2 — No stage is skipped without documented PM approval",
                color: "border-red-400",
                detail:
                  "Alpha → Beta → Full Release. Every feature and every coworker follows this path. If a stage needs to be shortened (e.g., Alpha over 1 day instead of 3), Confidence must approve in writing with a documented reason. 'We're under time pressure' is not an acceptable reason.",
              },
              {
                rule: "Rule 3 — Developers do not toggle their own flags in production",
                color: "border-red-400",
                detail:
                  "This is a conflict of interest rule. A developer who built a feature has an incentive to get it live. The person toggling the flag in production must be DevOps or Admin — someone with no stake in the feature's release timeline. If DevOps is unavailable, the fallback is Admin. There is no other fallback.",
              },
              {
                rule: "Rule 4 — Coworker flags require PM-002 to be complete first",
                color: "border-pink-400",
                detail:
                  "No AI Coworker flag may be toggled to active until Confidence has completed the output quality standards (PM-002) for that coworker. These standards must be stored in ai_coworker_memory as output_standard records with confidence_score = 1.0. DevOps must verify this before activation.",
              },
              {
                rule: "Rule 5 — Every stage change is logged",
                color: "border-amber-400",
                detail:
                  "Every flag change — activation, stage advance, rollback — must be logged in the flag's audit trail with the actor's name, the timestamp, and the reason. 'Who changed this and when?' must always be answerable from the audit log alone.",
              },
              {
                rule: "Rule 6 — Emergency rollbacks are not failures",
                color: "border-green-400",
                detail:
                  "Using the emergency rollback is the system working correctly. A team that never rolls back is either building nothing new or not catching problems early enough. Rolling back is the right action when something is wrong. It should take under 60 seconds. It should happen without blame. The post-rollback debrief is where learning happens — not during the incident.",
              },
              {
                rule: "Rule 7 — Full Release is not the end",
                color: "border-blue-400",
                detail:
                  "After Full Release, the feature must be monitored for 7 days (product features) or 30 days (AI Coworkers). Automated health checks run continuously. FORGE and GUARD monitor their respective feature areas. At the end of the monitoring period, the feature is added to the Stable Features Registry. Only then is the feature lifecycle complete.",
              },
            ].map((r, i) => (
              <div
                key={i}
                className={`bg-white rounded-lg border-l-4 p-4 mb-3 shadow-sm ${r.color}`}
              >
                <p className="font-bold text-sm text-gray-800 mb-1">{r.rule}</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {r.detail}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── CHECKLISTS ── */}
        {active === "checklist" && (
          <div>
            <SectionHeader
              title="Checklists"
              subtitle="Use these at each stage — tick every item before proceeding"
            />

            {[
              {
                title: "✅ Before creating a feature flag (Developer)",
                color: "bg-blue-50 border-blue-200",
                items: [
                  "Feature code is complete and PR is ready to merge",
                  "Feature flag name follows convention: feature:[module_name] or coworker:[name]",
                  "Feature dependencies have been declared in the project setup",
                  "Flag will be created with is_active = FALSE",
                  "Backend endpoint checks for flag access before returning feature data",
                  "Frontend hides feature UI when GET /api/feature-flags/check/:flagName returns has_access: false",
                  "DevOps and Confidence have been notified that Alpha is ready",
                ],
              },
              {
                title:
                  "✅ Before Alpha activation (DevOps + Mercy + Tech Lead)",
                color: "bg-blue-50 border-blue-200",
                items: [
                  "PR has been merged to production",
                  "Feature is confirmed invisible to all users (flag is_active = FALSE)",
                  "Tech Lead has reviewed and signed off the implementation",
                  "For coworker flags: PM-002 output quality standards are stored in ai_coworker_memory",
                  "Alpha audience list is ready (dev team + Mercy user IDs)",
                  "DevOps logs the Alpha activation in the audit trail",
                ],
              },
              {
                title:
                  "✅ Alpha pass criteria — must all be true before advancing (Mercy + Tech Lead → Confidence)",
                color: "bg-purple-50 border-purple-200",
                items: [
                  "No critical bugs found during Alpha period",
                  "Feature works as specified across all tested scenarios",
                  "Regression testing checklist completed — all items Pass",
                  "For coworker flags: output approval rate is above 80%",
                  "For coworker flags: primary user has reviewed every output (not rubber-stamped)",
                  "Mercy has signed off QA",
                  "Tech Lead has signed off technical implementation",
                  "Confidence has approved advancement to Beta",
                ],
              },
              {
                title: "✅ Before Beta activation (DevOps)",
                color: "bg-purple-50 border-purple-200",
                items: [
                  "Alpha pass criteria confirmed and signed off",
                  "Beta department selected strategically (not the most forgiving — the most representative)",
                  "Beta department head informed that they will be receiving the feature",
                  "Previous Alpha targeting cleared (allowed_user_ids = [])",
                  "allowed_department_ids set to the beta department",
                  "DevOps logs the Beta activation in the audit trail",
                ],
              },
              {
                title:
                  "✅ Beta pass criteria — must all be true before Full Release (Confidence)",
                color: "bg-teal-50 border-teal-200",
                items: [
                  "Beta period completed (minimum 3 days for features, 2 weeks for coworkers)",
                  "No regression in any Phase 1–4 features reported by the beta group",
                  "No critical user complaints from the beta department",
                  "For coworker flags: no disruption to existing workflows reported",
                  "For coworker flags: output approval rate maintained above 80%",
                  "Automated health checks passing throughout beta period",
                  "Confidence has approved Full Release",
                ],
              },
              {
                title: "✅ Before Full Release (DevOps)",
                color: "bg-green-50 border-green-200",
                items: [
                  "Beta pass criteria confirmed and signed off by Confidence",
                  "Beta targeting cleared (allowed_department_ids = [])",
                  "rollout_percentage set to 100",
                  "Health monitoring period started (7 days for features, 30 days for coworkers)",
                  "DevOps logs the Full Release in the audit trail",
                ],
              },
              {
                title:
                  "✅ After monitoring period — feature lifecycle complete (Mercy)",
                color: "bg-green-50 border-green-200",
                items: [
                  "7-day (features) or 30-day (coworkers) monitoring period completed without critical issues",
                  "Feature added to Stable Features Registry with last_verified_date",
                  "Dependencies documented in the registry",
                  "Monitoring coworker assigned to the feature (FORGE for engineering features, GUARD for compliance, PIKE for project features)",
                  "Feature flag can now remain at rollout_percentage = 100 permanently — no further action needed unless rolled back",
                ],
              },
              {
                title:
                  "⚠️ Emergency rollback (anyone → DevOps immediate action)",
                color: "bg-red-50 border-red-200",
                items: [
                  "Contact DevOps immediately via agreed urgent channel",
                  "DevOps toggles is_active = FALSE — feature disappears for all users",
                  "Confirm with the reporter that the issue is resolved",
                  "Log the rollback in the audit trail with timestamp and reason",
                  "Developer investigates root cause — do not re-enable flag until fix is confirmed",
                  "Re-run Alpha testing after fix is deployed",
                  "Advance through stages again from Alpha — do not skip stages",
                ],
              },
            ].map((cl, i) => (
              <div key={i} className={`rounded-lg border p-4 mb-4 ${cl.color}`}>
                <p className="font-bold text-sm text-gray-800 mb-3">
                  {cl.title}
                </p>
                <ul className="space-y-1.5">
                  {cl.items.map((item, j) => (
                    <li key={j} className="flex gap-2 text-xs text-gray-700">
                      <span className="text-gray-400 shrink-0">☐</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
