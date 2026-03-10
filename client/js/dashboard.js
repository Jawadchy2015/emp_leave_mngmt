const storedUser = localStorage.getItem("loggedInUser");

if (!storedUser) {
  window.location.href = "./index.html";
}

const user = JSON.parse(storedUser);

const sidebarUserName = document.getElementById("sidebarUserName");
const sidebarUserRole = document.getElementById("sidebarUserRole");
const topbarUserName = document.getElementById("topbarUserName");
const topbarUserRole = document.getElementById("topbarUserRole");
const userInitials = document.getElementById("userInitials");
const welcomeHeading = document.getElementById("welcomeHeading");
const welcomeSubtext = document.getElementById("welcomeSubtext");
const heroRole = document.getElementById("heroRole");
const summaryCards = document.getElementById("summaryCards");
const sidebarNav = document.getElementById("sidebarNav");
const pageContent = document.getElementById("pageContent");
const topbarTitle = document.getElementById("topbarTitle");
const logoutBtnDesktop = document.getElementById("logoutBtnDesktop");
const logoutBtnMobile = document.getElementById("logoutBtnMobile");

const role = (user.role || "employee").toLowerCase();

const employeePages = [
  { id: "employee-dashboard", label: "Dashboard" },
  { id: "apply-leave", label: "Apply Leave" },
  { id: "my-requests", label: "My Leave Requests" },
  { id: "leave-balance", label: "Leave Balance" },
];

const managerPages = [
  { id: "manager-dashboard", label: "Dashboard" },
  { id: "pending-approvals", label: "Pending Approvals" },
  { id: "team-calendar", label: "Team Calendar" },
];

const adminPages = [
  { id: "admin-dashboard", label: "Dashboard" },
  { id: "employees", label: "Employees" },
  { id: "leave-types", label: "Leave Types" },
  { id: "all-requests", label: "All Leave Requests" },
  { id: "holidays", label: "Holidays" },
  { id: "leave-balances", label: "Leave Balances" },
];

const roleConfig = {
  employee: {
    pages: employeePages,
    summary: [
      { title: "Available Leave", value: "12 Days", note: "Annual + casual balance" },
      { title: "Pending Requests", value: "2", note: "Awaiting manager review" },
      { title: "Approved This Year", value: "5", note: "Requests fully approved" },
      { title: "Next Holiday", value: "Apr 12", note: "Company holiday preview" },
    ],
    welcome:
      "Submit requests, review your leave history, and stay on top of your remaining balance.",
  },
  manager: {
    pages: managerPages,
    summary: [
      { title: "Pending Approvals", value: "6", note: "Requests awaiting action" },
      { title: "Team On Leave", value: "3", note: "Employees currently away" },
      { title: "This Week's Requests", value: "9", note: "New submissions received" },
      { title: "Team Capacity", value: "87%", note: "Current availability snapshot" },
    ],
    welcome:
      "Review team leave requests, monitor scheduling impact, and keep team availability visible.",
  },
  admin: {
    pages: adminPages,
    summary: [
      { title: "Employees", value: "48", note: "Active workforce records" },
      { title: "Open Requests", value: "14", note: "Across all departments" },
      { title: "Leave Types", value: "6", note: "Configured leave policies" },
      { title: "Upcoming Holidays", value: "4", note: "Scheduled company holidays" },
    ],
    welcome:
      "Manage employees, leave policies, balances, requests, and organization-wide leave settings.",
  },
};

function getInitials(name) {
  if (!name) return "U";
  return name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function cardHTML(title, value, note) {
  return `
    <div class="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl">
      <p class="text-sm text-slate-400">${title}</p>
      <h3 class="mt-3 text-3xl font-bold text-white">${value}</h3>
      <p class="mt-2 text-sm text-slate-500">${note}</p>
    </div>
  `;
}

function sectionWrapper(title, description, content) {
  return `
    <section class="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl">
      <div class="mb-6">
        <h3 class="text-2xl font-semibold">${title}</h3>
        <p class="mt-2 text-slate-400">${description}</p>
      </div>
      ${content}
    </section>
  `;
}

function tableHTML(headers, rows) {
  const head = headers
    .map(
      (header) =>
        `<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">${header}</th>`
    )
    .join("");

  const body = rows
    .map(
      (row) => `
      <tr class="border-t border-white/5">
        ${row
          .map(
            (cell) =>
              `<td class="px-4 py-4 text-sm text-slate-200">${cell}</td>`
          )
          .join("")}
      </tr>
    `
    )
    .join("");

  return `
    <div class="overflow-hidden rounded-2xl border border-white/10">
      <div class="overflow-x-auto">
        <table class="min-w-full bg-slate-950/40">
          <thead class="bg-white/5">
            <tr>${head}</tr>
          </thead>
          <tbody>${body}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderSidebar(pages) {
  sidebarNav.innerHTML = pages
    .map(
      (page, index) => `
        <button
          class="nav-btn w-full text-left rounded-2xl px-4 py-3 transition border ${
            index === 0
              ? "bg-cyan-500/15 border-cyan-400/20 text-cyan-300"
              : "bg-transparent border-transparent hover:bg-white/5 text-slate-300"
          }"
          data-page="${page.id}"
          data-label="${page.label}"
        >
          <span class="font-medium">${page.label}</span>
        </button>
      `
    )
    .join("");

  document.querySelectorAll(".nav-btn").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".nav-btn").forEach((btn) => {
        btn.className =
          "nav-btn w-full text-left rounded-2xl px-4 py-3 transition border bg-transparent border-transparent hover:bg-white/5 text-slate-300";
      });

      button.className =
        "nav-btn w-full text-left rounded-2xl px-4 py-3 transition border bg-cyan-500/15 border-cyan-400/20 text-cyan-300";

      const pageId = button.dataset.page;
      const label = button.dataset.label;
      topbarTitle.textContent = label;
      renderPage(pageId);
    });
  });
}

function renderSummary(summary) {
  summaryCards.innerHTML = summary
    .map((item) => cardHTML(item.title, item.value, item.note))
    .join("");
}

function employeeDashboardPage() {
  return sectionWrapper(
    "Employee Dashboard",
    "A quick snapshot of your current leave activity and personal leave overview.",
    `
      <div class="grid gap-6 lg:grid-cols-2">
        <div class="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
          <h4 class="text-lg font-semibold">Upcoming Leave</h4>
          <div class="mt-4 space-y-4">
            <div class="rounded-2xl bg-white/5 p-4 border border-white/10">
              <p class="font-medium">Annual Leave</p>
              <p class="text-sm text-slate-400 mt-1">May 14, 2026 to May 16, 2026</p>
            </div>
            <div class="rounded-2xl bg-white/5 p-4 border border-white/10">
              <p class="font-medium">Medical Leave</p>
              <p class="text-sm text-slate-400 mt-1">No upcoming requests scheduled</p>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
          <h4 class="text-lg font-semibold">Recent Activity</h4>
          <div class="mt-4 space-y-4">
            <div class="flex items-start gap-3">
              <div class="h-3 w-3 mt-2 rounded-full bg-emerald-400"></div>
              <div>
                <p class="font-medium">Annual leave approved</p>
                <p class="text-sm text-slate-400">2 days approved by your manager.</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="h-3 w-3 mt-2 rounded-full bg-amber-400"></div>
              <div>
                <p class="font-medium">Request pending</p>
                <p class="text-sm text-slate-400">Your casual leave request is under review.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  );
}

function applyLeavePage() {
  return sectionWrapper(
    "Apply Leave",
    "A clean starter form for creating leave requests. Backend submission can be connected later.",
    `
      <form class="grid gap-5 lg:grid-cols-2">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Leave Type</label>
          <select class="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-200 outline-none">
            <option>Annual Leave</option>
            <option>Casual Leave</option>
            <option>Sick Leave</option>
            <option>Work From Home</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Duration</label>
          <select class="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-200 outline-none">
            <option>Full Day</option>
            <option>Half Day</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
          <input type="date" class="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-200 outline-none" />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">End Date</label>
          <input type="date" class="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-200 outline-none" />
        </div>

        <div class="lg:col-span-2">
          <label class="block text-sm font-medium text-slate-300 mb-2">Reason</label>
          <textarea rows="5" class="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-200 outline-none" placeholder="Briefly explain your leave request"></textarea>
        </div>

        <div class="lg:col-span-2 flex justify-end">
          <button type="button" class="rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-6 py-3 transition">
            Submit Request
          </button>
        </div>
      </form>
    `
  );
}

function myRequestsPage() {
  return sectionWrapper(
    "My Leave Requests",
    "Review all your submitted leave requests and their current approval status.",
    tableHTML(
      ["Type", "Start", "End", "Days", "Status"],
      [
        ["Annual Leave", "2026-05-14", "2026-05-16", "3", "<span class='text-emerald-300'>Approved</span>"],
        ["Casual Leave", "2026-04-02", "2026-04-02", "1", "<span class='text-amber-300'>Pending</span>"],
        ["Sick Leave", "2026-03-11", "2026-03-11", "1", "<span class='text-rose-300'>Rejected</span>"],
      ]
    )
  );
}

function leaveBalancePage() {
  return sectionWrapper(
    "Leave Balance",
    "Your current leave allocation and remaining balance.",
    `
      <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        ${cardHTML("Annual Leave", "8 Days", "Remaining from 15 allocated")}
        ${cardHTML("Casual Leave", "3 Days", "Remaining from 5 allocated")}
        ${cardHTML("Sick Leave", "5 Days", "Remaining from 7 allocated")}
        ${cardHTML("Work From Home", "6 Days", "Flexible arrangement allowance")}
      </div>
    `
  );
}

function managerDashboardPage() {
  return sectionWrapper(
    "Manager Dashboard",
    "A manager-focused overview for team leave visibility and pending actions.",
    `
      <div class="grid gap-6 lg:grid-cols-2">
        <div class="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
          <h4 class="text-lg font-semibold">Approval Queue Summary</h4>
          <div class="mt-4 space-y-4">
            <div class="rounded-2xl bg-white/5 p-4 border border-white/10">
              <p class="font-medium">Urgent review needed</p>
              <p class="text-sm text-slate-400 mt-1">2 requests start within 48 hours.</p>
            </div>
            <div class="rounded-2xl bg-white/5 p-4 border border-white/10">
              <p class="font-medium">Coverage warning</p>
              <p class="text-sm text-slate-400 mt-1">Engineering team has multiple overlapping leave days.</p>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
          <h4 class="text-lg font-semibold">Team Snapshot</h4>
          <div class="mt-4 grid grid-cols-2 gap-4">
            <div class="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p class="text-sm text-slate-400">Team Size</p>
              <p class="mt-2 text-2xl font-bold">14</p>
            </div>
            <div class="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p class="text-sm text-slate-400">On Leave Today</p>
              <p class="mt-2 text-2xl font-bold">3</p>
            </div>
          </div>
        </div>
      </div>
    `
  );
}

function pendingApprovalsPage() {
  return sectionWrapper(
    "Pending Approvals",
    "Review and take action on leave requests submitted by your team.",
    tableHTML(
      ["Employee", "Type", "Start", "End", "Reason", "Action"],
      [
        ["Sarah Khan", "Annual Leave", "2026-04-12", "2026-04-14", "Family trip", "<span class='text-cyan-300'>Approve / Reject</span>"],
        ["David Lee", "Sick Leave", "2026-04-03", "2026-04-03", "Medical appointment", "<span class='text-cyan-300'>Approve / Reject</span>"],
        ["Amina Rahman", "Casual Leave", "2026-04-21", "2026-04-21", "Personal matter", "<span class='text-cyan-300'>Approve / Reject</span>"],
      ]
    )
  );
}

function teamCalendarPage() {
  return sectionWrapper(
    "Team Calendar",
    "A simple visual MVP view of team availability and planned time away.",
    `
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div class="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
          <p class="text-sm text-slate-400">Apr 12</p>
          <h4 class="mt-2 text-lg font-semibold">Sarah Khan</h4>
          <p class="mt-1 text-slate-400">Annual Leave</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
          <p class="text-sm text-slate-400">Apr 13</p>
          <h4 class="mt-2 text-lg font-semibold">David Lee</h4>
          <p class="mt-1 text-slate-400">Sick Leave</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
          <p class="text-sm text-slate-400">Apr 21</p>
          <h4 class="mt-2 text-lg font-semibold">Amina Rahman</h4>
          <p class="mt-1 text-slate-400">Casual Leave</p>
        </div>
      </div>
    `
  );
}

function adminDashboardPage() {
  return sectionWrapper(
    "Admin / HR Dashboard",
    "A central operational view for workforce, policies, leave requests, and balance administration.",
    `
      <div class="grid gap-6 lg:grid-cols-2">
        <div class="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
          <h4 class="text-lg font-semibold">Operational Highlights</h4>
          <div class="mt-4 space-y-4">
            <div class="rounded-2xl bg-white/5 p-4 border border-white/10">
              <p class="font-medium">Policy update needed</p>
              <p class="text-sm text-slate-400 mt-1">One leave type has no current annual quota configured.</p>
            </div>
            <div class="rounded-2xl bg-white/5 p-4 border border-white/10">
              <p class="font-medium">Holiday reminder</p>
              <p class="text-sm text-slate-400 mt-1">Quarterly holiday calendar should be published this week.</p>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
          <h4 class="text-lg font-semibold">Department Overview</h4>
          <div class="mt-4 space-y-3">
            <div class="flex justify-between rounded-2xl bg-white/5 border border-white/10 p-4">
              <span>Engineering</span><span class="text-slate-400">18 employees</span>
            </div>
            <div class="flex justify-between rounded-2xl bg-white/5 border border-white/10 p-4">
              <span>Operations</span><span class="text-slate-400">10 employees</span>
            </div>
            <div class="flex justify-between rounded-2xl bg-white/5 border border-white/10 p-4">
              <span>HR</span><span class="text-slate-400">6 employees</span>
            </div>
          </div>
        </div>
      </div>
    `
  );
}

function employeesPage() {
  return sectionWrapper(
    "Employees",
    "Manage employee records, roles, and department assignments.",
    tableHTML(
      ["Name", "Email", "Department", "Role", "Status"],
      [
        ["System Administrator", "admin@leaveapp.com", "HR", "Admin", "Active"],
        ["Department Manager", "manager@leaveapp.com", "Operations", "Manager", "Active"],
        ["General Employee", "employee@leaveapp.com", "Engineering", "Employee", "Active"],
      ]
    )
  );
}

function leaveTypesPage() {
  return sectionWrapper(
    "Leave Types",
    "Manage the leave categories available across the organization.",
    tableHTML(
      ["Leave Type", "Default Allocation", "Paid/Unpaid", "Status"],
      [
        ["Annual Leave", "15 Days", "Paid", "Active"],
        ["Casual Leave", "5 Days", "Paid", "Active"],
        ["Sick Leave", "7 Days", "Paid", "Active"],
        ["Unpaid Leave", "-", "Unpaid", "Active"],
      ]
    )
  );
}

function allRequestsPage() {
  return sectionWrapper(
    "All Leave Requests",
    "A company-wide view of leave requests for audit, review, and future filtering.",
    tableHTML(
      ["Employee", "Type", "Department", "Start", "End", "Status"],
      [
        ["Sarah Khan", "Annual Leave", "Engineering", "2026-04-12", "2026-04-14", "Approved"],
        ["David Lee", "Sick Leave", "Operations", "2026-04-03", "2026-04-03", "Pending"],
        ["Amina Rahman", "Casual Leave", "HR", "2026-04-21", "2026-04-21", "Rejected"],
      ]
    )
  );
}

function holidaysPage() {
  return sectionWrapper(
    "Holidays",
    "Manage public and company holidays that affect leave scheduling.",
    tableHTML(
      ["Holiday", "Date", "Type", "Applies To"],
      [
        ["Spring Holiday", "2026-04-12", "Company", "All Employees"],
        ["Labour Day", "2026-05-01", "Public", "All Employees"],
        ["Founders Day", "2026-06-18", "Company", "Head Office"],
      ]
    )
  );
}

function leaveBalancesPage() {
  return sectionWrapper(
    "Leave Balances",
    "Track remaining leave balances across employees and departments.",
    tableHTML(
      ["Employee", "Annual", "Casual", "Sick", "WFH"],
      [
        ["System Administrator", "12", "4", "7", "6"],
        ["Department Manager", "10", "3", "6", "5"],
        ["General Employee", "8", "3", "5", "6"],
      ]
    )
  );
}

function renderPage(pageId) {
  let html = "";

  switch (pageId) {
    case "employee-dashboard":
      html = employeeDashboardPage();
      break;
    case "apply-leave":
      html = applyLeavePage();
      break;
    case "my-requests":
      html = myRequestsPage();
      break;
    case "leave-balance":
      html = leaveBalancePage();
      break;
    case "manager-dashboard":
      html = managerDashboardPage();
      break;
    case "pending-approvals":
      html = pendingApprovalsPage();
      break;
    case "team-calendar":
      html = teamCalendarPage();
      break;
    case "admin-dashboard":
      html = adminDashboardPage();
      break;
    case "employees":
      html = employeesPage();
      break;
    case "leave-types":
      html = leaveTypesPage();
      break;
    case "all-requests":
      html = allRequestsPage();
      break;
    case "holidays":
      html = holidaysPage();
      break;
    case "leave-balances":
      html = leaveBalancesPage();
      break;
    default:
      html = employeeDashboardPage();
  }

  pageContent.innerHTML = html;
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "./index.html";
}

function initDashboard() {
  const config = roleConfig[role] || roleConfig.employee;
  const fullName = user.fullName || user.username || "User";

  sidebarUserName.textContent = fullName;
  sidebarUserRole.textContent = role;
  topbarUserName.textContent = fullName;
  topbarUserRole.textContent = role;
  userInitials.textContent = getInitials(fullName);
  welcomeHeading.textContent = `Hello, ${fullName}`;
  welcomeSubtext.textContent = config.welcome;
  heroRole.textContent = role;

  renderSidebar(config.pages);
  renderSummary(config.summary);
  topbarTitle.textContent = config.pages[0].label;
  renderPage(config.pages[0].id);
}

logoutBtnDesktop.addEventListener("click", logout);
logoutBtnMobile.addEventListener("click", logout);

initDashboard();