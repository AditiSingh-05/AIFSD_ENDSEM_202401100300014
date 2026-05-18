import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronsLeft,
  ChevronsRight,
  Edit3,
  GraduationCap,
  Home,
  LineChart,
  Loader2,
  LogOut,
  Menu,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  UserRound,
  Users,
  WandSparkles,
  X
} from "lucide-react";
import api, { getErrorMessage } from "../api";

const emptyEmployee = {
  name: "",
  email: "",
  department: "Development",
  skills: [],
  performanceScore: 75,
  experience: 1
};

const departments = ["Development", "HR", "Marketing", "Sales", "Design", "Finance", "Operations"];
const scoreFilters = [
  { label: "All", minScore: "", maxScore: "" },
  { label: "High Performers", minScore: "85", maxScore: "" },
  { label: "70 - 84", minScore: "70", maxScore: "84" },
  { label: "Below 70", minScore: "", maxScore: "69" }
];
const experienceFilters = ["All", "2", "3", "5", "7"];

const pageConfigs = {
  dashboard: {
    title: "Performance Analytics",
    summary: "Overview of workforce performance, employee records, and AI insight readiness."
  },
  employees: {
    title: "Employees",
    summary: "Add, edit, search, filter, and remove employee performance records."
  },
  performance: {
    title: "Performance Analytics",
    summary: "Compare top performers and review score-based rankings across departments."
  },
  ai: {
    title: "AI Recommendations",
    summary: "Generate AI promotion, training, ranking, and feedback recommendations."
  },
  trainings: {
    title: "Trainings",
    summary: "Track suggested training areas based on performance scores and missing skills.",
    items: ["Leadership fundamentals", "System design", "Communication coaching", "Advanced specialization"]
  },
  reports: {
    title: "Reports",
    summary: "Review summaries for employee analytics, CRUD activity, and AI recommendation output.",
    items: ["Employee analytics summary", "AI recommendation log", "Performance score distribution", "Department-wise report"]
  },
  departments: {
    title: "Departments",
    summary: "Browse departments represented in the employee database.",
    items: departments
  },
  skills: {
    title: "Skills",
    summary: "Monitor common skills used for filtering and AI training recommendations.",
    items: ["React", "Node.js", "MongoDB", "TypeScript", "Figma", "Communication", "Analytics"]
  },
  users: {
    title: "Users",
    summary: "Authenticated HR/Admin users can access protected employee and AI routes.",
    items: ["JWT login", "bcrypt password hashing", "Protected dashboard", "Session logout"]
  },
  roles: {
    title: "Roles & Permissions",
    summary: "Protected routes are available to authenticated HR/Admin users.",
    items: ["Admin", "HR", "Protected employee APIs", "Protected AI APIs"]
  }
};

function initials(name = "Admin User") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function scoreStatus(score) {
  if (score >= 85) return "high";
  if (score >= 70) return "solid";
  return "watch";
}

function Sidebar({ user, logout }) {
  const location = useLocation();
  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: Home },
    { label: "Employees", path: "/employees", icon: Users },
    { label: "Performance Analytics", path: "/performance", icon: LineChart },
    { label: "AI Recommendations", path: "/ai", icon: WandSparkles },
    { label: "Trainings", path: "/trainings", icon: GraduationCap },
    { label: "Reports", path: "/reports", icon: BookOpen }
  ];
  const managementItems = [
    { label: "Departments", path: "/departments", icon: BriefcaseBusiness },
    { label: "Skills", path: "/skills", icon: Star },
    { label: "Users", path: "/users", icon: UserRound },
    { label: "Roles & Permissions", path: "/roles", icon: ShieldCheck }
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <BarChart3 size={19} />
        </div>
        <span>TalentIQ</span>
      </div>
      <p className="nav-label">Main</p>
      <nav className="nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link className={`nav-item ${location.pathname === item.path ? "active" : ""}`} key={item.label} to={item.path}>
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <p className="nav-label management">Management</p>
      <div className="nav-list">
        {managementItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link className={`nav-item muted ${location.pathname === item.path ? "active" : ""}`} key={item.label} to={item.path}>
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="sidebar-footer">
        <div className="user-chip dark">
          <div className="avatar">{initials(user?.name)}</div>
          <div>
            <strong>{user?.name || "Admin User"}</strong>
            <span>{user?.email || "admin@talentiq.com"}</span>
          </div>
        </div>
        <button className="collapse-button" onClick={logout} type="button">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

function Topbar({ user, globalSearch, setGlobalSearch, title }) {
  return (
    <header className="topbar">
      <div className="topbar-title">
        <button className="icon-button ghost" type="button">
          <Menu size={21} />
        </button>
        <h1>{title}</h1>
      </div>
      <div className="topbar-actions">
        <label className="global-search">
          <Search size={18} />
          <input
            aria-label="Global employee search"
            placeholder="Search..."
            value={globalSearch}
            onChange={(event) => setGlobalSearch(event.target.value)}
          />
          <kbd>⌘K</kbd>
        </label>
        <div className="user-chip light">
          <div className="avatar photo">{initials(user?.name)}</div>
          <div>
            <strong>{user?.name || "Admin User"}</strong>
            <span>Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function MetricCard({ title, value, trend, icon: Icon, wide }) {
  return (
    <article className={`metric-card ${wide ? "wide" : ""}`}>
      <div>
        <span>{title}</span>
        <strong>{value}</strong>
        <p>↑ {trend}</p>
      </div>
      {wide ? <Sparkline /> : <Icon size={25} />}
    </article>
  );
}

function Sparkline() {
  return (
    <svg className="sparkline" viewBox="0 0 120 74" role="img" aria-label="Performance trend">
      <polyline points="4,64 14,61 24,57 34,45 44,49 54,35 64,31 74,18 84,29 94,10 106,20 116,17" />
    </svg>
  );
}

function EmployeeForm({ form, setForm, editingId, onSubmit, onCancel, loading }) {
  const [skillDraft, setSkillDraft] = useState("");

  function addSkill(skill) {
    const clean = skill.trim();
    if (!clean || form.skills.includes(clean)) return;
    setForm({ ...form, skills: [...form.skills, clean] });
    setSkillDraft("");
  }

  function removeSkill(skill) {
    setForm({ ...form, skills: form.skills.filter((item) => item !== skill) });
  }

  return (
    <section className="panel form-panel">
      <div className="panel-heading">
        <h2>{editingId ? "Add / Edit Employee" : "Add Employee"}</h2>
      </div>
      <form onSubmit={onSubmit}>
        <div className="form-grid">
          <label>
            Full Name <span>*</span>
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Aman Verma"
              required
            />
          </label>
          <label>
            Email <span>*</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="aman.verma@example.com"
              required
            />
          </label>
          <label>
            Department <span>*</span>
            <select
              value={form.department}
              onChange={(event) => setForm({ ...form, department: event.target.value })}
              required
            >
              {departments.map((department) => (
                <option key={department}>{department}</option>
              ))}
            </select>
          </label>
          <label>
            Experience (Years) <span>*</span>
            <input
              min="0"
              type="number"
              value={form.experience}
              onChange={(event) => setForm({ ...form, experience: event.target.value })}
              required
            />
          </label>
        </div>
        <div className="form-grid form-grid-bottom">
          <label className="skills-field">
            Skills <span>*</span>
            <div className="skill-input">
              {form.skills.map((skill) => (
                <button key={skill} onClick={() => removeSkill(skill)} type="button">
                  {skill}
                  <X size={13} />
                </button>
              ))}
              <input
                value={skillDraft}
                onBlur={() => addSkill(skillDraft)}
                onChange={(event) => setSkillDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === ",") {
                    event.preventDefault();
                    addSkill(skillDraft);
                  }
                }}
                placeholder="Add skill"
              />
            </div>
          </label>
          <label className="score-field">
            Performance Score (0-100) <span>*</span>
            <div className="score-control">
              <input
                max="100"
                min="0"
                type="range"
                value={form.performanceScore}
                onChange={(event) => setForm({ ...form, performanceScore: event.target.value })}
              />
              <input
                max="100"
                min="0"
                type="number"
                value={form.performanceScore}
                onChange={(event) => setForm({ ...form, performanceScore: event.target.value })}
                required
              />
            </div>
          </label>
        </div>
        <div className="form-actions">
          <button className="secondary-button" onClick={onCancel} type="button">
            Cancel
          </button>
          <button className="primary-button" disabled={loading} type="submit">
            {loading ? <Loader2 className="spin" size={16} /> : <CheckCircle2 size={16} />}
            Save Employee
          </button>
        </div>
      </form>
    </section>
  );
}

function Filters({ filters, setFilters, resetFilters }) {
  const selectedScore = scoreFilters.find((item) => item.label === filters.scorePreset) || scoreFilters[0];

  return (
    <section className="panel filter-panel">
      <label className="filter-search">
        <Search size={18} />
        <input
          placeholder="Search employees"
          value={filters.q}
          onChange={(event) => setFilters({ ...filters, q: event.target.value })}
        />
      </label>
      <label>
        Department
        <select
          value={filters.department}
          onChange={(event) => setFilters({ ...filters, department: event.target.value })}
        >
          <option>All</option>
          {departments.map((department) => (
            <option key={department}>{department}</option>
          ))}
        </select>
      </label>
      <label>
        Performance Score
        <select
          value={selectedScore.label}
          onChange={(event) => {
            const preset = scoreFilters.find((item) => item.label === event.target.value);
            setFilters({
              ...filters,
              scorePreset: preset.label,
              minScore: preset.minScore,
              maxScore: preset.maxScore
            });
          }}
        >
          {scoreFilters.map((option) => (
            <option key={option.label}>{option.label}</option>
          ))}
        </select>
      </label>
      <label>
        Experience
        <select
          value={filters.experience}
          onChange={(event) => setFilters({ ...filters, experience: event.target.value })}
        >
          {experienceFilters.map((years) => (
            <option key={years}>{years}</option>
          ))}
        </select>
      </label>
      <button className="text-button" onClick={resetFilters} type="button">
        <RefreshCcw size={15} />
        Reset Filters
      </button>
    </section>
  );
}

function EmployeeTable({ employees, selectedEmployee, onSelect, onEdit, onDelete }) {
  return (
    <section className="panel table-panel">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>
                <input aria-label="Select all employees" type="checkbox" />
              </th>
              <th>#</th>
              <th>Employee</th>
              <th>Email</th>
              <th>Department</th>
              <th>Skills</th>
              <th>Performance Score</th>
              <th>Experience (Years)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr
                className={selectedEmployee?._id === employee._id ? "selected" : ""}
                key={employee._id}
                onClick={() => onSelect(employee)}
              >
                <td>
                  <input
                    checked={selectedEmployee?._id === employee._id}
                    onChange={() => onSelect(employee)}
                    type="checkbox"
                  />
                </td>
                <td>{index + 1}</td>
                <td>
                  <div className="employee-cell">
                    <div className="avatar mini">{initials(employee.name)}</div>
                    <strong>{employee.name}</strong>
                  </div>
                </td>
                <td>{employee.email}</td>
                <td>
                  <span className={`department-tag ${employee.department.toLowerCase()}`}>{employee.department}</span>
                </td>
                <td>
                  <div className="skills-list">
                    {employee.skills.slice(0, 3).map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                    {employee.skills.length > 3 && <span>+{employee.skills.length - 3}</span>}
                  </div>
                </td>
                <td>
                  <div className="score-bar">
                    <strong>{employee.performanceScore}</strong>
                    <span className={scoreStatus(employee.performanceScore)}>
                      <i style={{ width: `${employee.performanceScore}%` }} />
                    </span>
                  </div>
                </td>
                <td>{employee.experience}</td>
                <td>
                  <div className="row-actions">
                    <button
                      aria-label={`Edit ${employee.name}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        onEdit(employee);
                      }}
                      type="button"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      aria-label={`Delete ${employee.name}`}
                      className="danger"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDelete(employee._id);
                      }}
                      type="button"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {employees.length === 0 && <div className="empty-state">No employees match the current filters.</div>}
      </div>
      <footer className="table-footer">
        <span>Showing 1 to {employees.length} employees</span>
        <div className="pagination">
          <button type="button">
            <ChevronsLeft size={15} />
          </button>
          <button type="button">1</button>
          <button className="active" type="button">
            2
          </button>
          <button type="button">3</button>
          <button type="button">
            <ChevronsRight size={15} />
          </button>
        </div>
      </footer>
    </section>
  );
}

function RecommendationPanel({ selectedEmployee, recommendation, loading, onGenerate }) {
  const training = recommendation?.trainingSuggestions || [];

  return (
    <aside className="recommendation-panel">
      <div className="panel-heading ai-heading">
        <div>
          <Sparkles size={22} />
          <h2>AI Recommendation</h2>
        </div>
        <button className="icon-button ghost" type="button">
          <X size={18} />
        </button>
      </div>
      {selectedEmployee ? (
        <>
          <div className="recommendation-profile">
            <div className="avatar large-avatar">{initials(selectedEmployee.name)}</div>
            <div>
              <h3>{selectedEmployee.name}</h3>
              <span className="status-pill">{scoreBand(selectedEmployee.performanceScore)}</span>
            </div>
          </div>
          <div className="profile-stats">
            <span>
              Department <strong>{selectedEmployee.department}</strong>
            </span>
            <span>
              Experience <strong>{selectedEmployee.experience} Years</strong>
            </span>
            <span>
              Performance Score <strong>{selectedEmployee.performanceScore} / 100</strong>
            </span>
          </div>
          <section className="ai-section">
            <h3>AI Insight</h3>
            <p>
              {recommendation?.feedback ||
                `${selectedEmployee.name} has a ${selectedEmployee.performanceScore}/100 performance score across ${selectedEmployee.skills.join(", ")}.`}
            </p>
          </section>
          <section className="ai-section">
            <h3>Recommendation</h3>
            <div className="recommendation-card promotion">
              <div>
                <TrendingUp size={22} />
                <strong>Promotion</strong>
                <span>{recommendation?.priority || "High Priority"}</span>
              </div>
              <p>
                {recommendation?.promotionRecommendation ||
                  "Generate an AI insight to assess promotion readiness based on performance and skills."}
              </p>
            </div>
            <div className="recommendation-card training">
              <div>
                <GraduationCap size={22} />
                <strong>Training</strong>
                <span>Medium Priority</span>
              </div>
              <p>{training.length ? training.join(", ") : "Recommended training suggestions will appear here."}</p>
            </div>
          </section>
          <button className="primary-button full ai-button" disabled={loading} onClick={onGenerate} type="button">
            {loading ? <Loader2 className="spin" size={16} /> : <Sparkles size={16} />}
            Generate AI Insight
          </button>
          <p className="generated-at">
            {recommendation?.generatedAt
              ? `Last generated: ${new Date(recommendation.generatedAt).toLocaleTimeString()}`
              : "Ready to generate"}
          </p>
        </>
      ) : (
        <div className="empty-state side">Select an employee to generate AI insight.</div>
      )}
    </aside>
  );
}

function scoreBand(score) {
  if (score >= 85) return "High Performer";
  if (score >= 70) return "Solid Performer";
  return "Needs Support";
}

function UtilityPage({ config, employees }) {
  const departmentCounts = useMemo(
    () =>
      employees.reduce((counts, employee) => {
        counts[employee.department] = (counts[employee.department] || 0) + 1;
        return counts;
      }, {}),
    [employees]
  );
  const items = config.items || Object.keys(departmentCounts);

  return (
    <section className="panel utility-panel">
      <div>
        <h2>{config.title}</h2>
        <p>{config.summary}</p>
      </div>
      <div className="utility-grid">
        {items.map((item) => (
          <article className="utility-card" key={item}>
            <strong>{item}</strong>
            <span>{departmentCounts[item] ? `${departmentCounts[item]} employees` : "Ready"}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function RankingPanel({ employees, rankings, loading, onGenerate }) {
  const source = rankings.length
    ? rankings
    : employees.slice(0, 5).map((employee, index) => ({
        rank: index + 1,
        employee: employee.name,
        performanceScore: employee.performanceScore,
        recommendation: `${employee.performanceScore}/100`
      }));

  return (
    <section className="panel ranking-panel">
      <div className="panel-heading">
        <h2>Ranking</h2>
        <button className="secondary-button" disabled={loading} onClick={onGenerate} type="button">
          {loading ? <Loader2 className="spin" size={16} /> : <Sparkles size={16} />}
          Generate AI Insight
        </button>
      </div>
      <div className="ranking-list">
        {source.map((item, index) => {
          const score = Number(item.performanceScore || 0);
          return (
            <div className="ranking-row" key={`${item.employee}-${index}`}>
              <strong>#{item.rank || index + 1}</strong>
              <span>{item.employee}</span>
              <em>{item.recommendation || `${score}/100`}</em>
              <div className={`ranking-progress ${scoreStatus(score)}`}>
                <i style={{ width: `${score}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function Dashboard({ user, logout, view = "dashboard" }) {
  const config = pageConfigs[view] || pageConfigs.dashboard;
  const isCoreView = ["dashboard", "employees", "performance", "ai"].includes(view);
  const showForm = ["dashboard", "employees"].includes(view);
  const showRankings = ["performance", "ai"].includes(view);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [form, setForm] = useState(emptyEmployee);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({
    q: "",
    department: "All",
    scorePreset: "All",
    minScore: "",
    maxScore: "",
    experience: "All"
  });
  const [globalSearch, setGlobalSearch] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState({ employees: true, form: false, ai: false, rankings: false });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const loadEmployees = useCallback(async () => {
    setLoading((state) => ({ ...state, employees: true }));
    setError("");
    try {
      const query = new URLSearchParams();
      if (filters.q || globalSearch) query.set("q", filters.q || globalSearch);
      if (filters.department !== "All") query.set("department", filters.department);
      if (filters.minScore) query.set("minScore", filters.minScore);
      if (filters.maxScore) query.set("maxScore", filters.maxScore);
      if (filters.experience !== "All") query.set("experience", filters.experience);

      const url = query.toString() ? `/employees/search?${query.toString()}` : "/employees";
      const { data } = await api.get(url);
      setEmployees(data);
      setSelectedEmployee((current) => {
        if (current && data.some((employee) => employee._id === current._id)) {
          return data.find((employee) => employee._id === current._id);
        }
        return data[0] || null;
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading((state) => ({ ...state, employees: false }));
    }
  }, [filters, globalSearch]);

  useEffect(() => {
    const timer = setTimeout(loadEmployees, 220);
    return () => clearTimeout(timer);
  }, [loadEmployees]);

  useEffect(() => {
    if (selectedEmployee && !editingId) {
      setForm({
        name: selectedEmployee.name,
        email: selectedEmployee.email,
        department: selectedEmployee.department,
        skills: selectedEmployee.skills,
        performanceScore: selectedEmployee.performanceScore,
        experience: selectedEmployee.experience
      });
      setEditingId(selectedEmployee._id);
    }
  }, [editingId, selectedEmployee]);

  const metrics = useMemo(() => {
    const total = employees.length;
    const average = total
      ? (employees.reduce((sum, employee) => sum + Number(employee.performanceScore), 0) / total).toFixed(1)
      : "0.0";
    const high = employees.filter((employee) => employee.performanceScore >= 85).length;
    return { total, average, high, highRate: total ? Math.round((high / total) * 100) : 0 };
  }, [employees]);

  async function handleEmployeeSubmit(event) {
    event.preventDefault();
    setLoading((state) => ({ ...state, form: true }));
    setError("");
    setNotice("");

    try {
      const payload = {
        ...form,
        performanceScore: Number(form.performanceScore),
        experience: Number(form.experience)
      };

      const { data } = editingId
        ? await api.patch(`/employees/${editingId}`, payload)
        : await api.post("/employees", payload);

      setNotice(editingId ? "Employee updated successfully" : "Employee saved successfully");
      setSelectedEmployee(data);
      setEditingId(data._id);
      await loadEmployees();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading((state) => ({ ...state, form: false }));
    }
  }

  function editEmployee(employee) {
    setSelectedEmployee(employee);
    setEditingId(employee._id);
    setForm({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      skills: employee.skills,
      performanceScore: employee.performanceScore,
      experience: employee.experience
    });
  }

  function clearForm() {
    setForm(emptyEmployee);
    setEditingId(null);
    setRecommendation(null);
  }

  async function deleteEmployee(id) {
    setError("");
    setNotice("");
    try {
      await api.delete(`/employees/${id}`);
      setNotice("Employee removed successfully");
      if (selectedEmployee?._id === id) {
        setSelectedEmployee(null);
        setRecommendation(null);
        clearForm();
      }
      await loadEmployees();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function generateRecommendation() {
    if (!selectedEmployee) return;
    setLoading((state) => ({ ...state, ai: true }));
    setError("");

    try {
      const { data } = await api.post("/ai/recommend", {
        mode: "employee",
        employeeId: selectedEmployee._id
      });
      setRecommendation(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading((state) => ({ ...state, ai: false }));
    }
  }

  async function generateRankings() {
    setLoading((state) => ({ ...state, rankings: true }));
    setError("");

    try {
      const { data } = await api.post("/ai/recommend", { mode: "rankings" });
      setRankings(data.ranking || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading((state) => ({ ...state, rankings: false }));
    }
  }

  function resetFilters() {
    setFilters({ q: "", department: "All", scorePreset: "All", minScore: "", maxScore: "", experience: "All" });
    setGlobalSearch("");
  }

  return (
    <div className="app-shell">
      <Sidebar logout={logout} user={user} />
      <main className="workspace">
        <Topbar globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} title={config.title} user={user} />
        <div className={`content-grid ${showRankings ? "ai-focus" : ""}`}>
          <div className="left-column">
            {error && <div className="alert error">{error}</div>}
            {notice && <div className="alert success">{notice}</div>}
            {showForm && (
              <EmployeeForm
                editingId={editingId}
                form={form}
                loading={loading.form}
                onCancel={clearForm}
                onSubmit={handleEmployeeSubmit}
                setForm={setForm}
              />
            )}
            {isCoreView ? (
              <>
                <Filters filters={filters} resetFilters={resetFilters} setFilters={setFilters} />
                {loading.employees ? (
                  <section className="panel loading-panel">
                    <Loader2 className="spin" size={22} />
                    Loading employees
                  </section>
                ) : (
                  <EmployeeTable
                    employees={employees}
                    onDelete={deleteEmployee}
                    onEdit={editEmployee}
                    onSelect={setSelectedEmployee}
                    selectedEmployee={selectedEmployee}
                  />
                )}
              </>
            ) : (
              <UtilityPage config={config} employees={employees} />
            )}
          </div>
          <div className="right-column">
            <section className="metrics-panel">
              <MetricCard title="Average Performance Score" trend="4.2 vs last month" value={metrics.average} wide />
              <MetricCard icon={Users} title="Employees" trend="3 new this month" value={metrics.total} />
              <MetricCard icon={Star} title="High Performers" trend="2 vs last month" value={`${metrics.high} (${metrics.highRate}%)`} />
            </section>
            {showRankings && (
              <RankingPanel employees={employees} loading={loading.rankings} onGenerate={generateRankings} rankings={rankings} />
            )}
            <RecommendationPanel
              loading={loading.ai}
              onGenerate={generateRecommendation}
              recommendation={recommendation}
              selectedEmployee={selectedEmployee}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
