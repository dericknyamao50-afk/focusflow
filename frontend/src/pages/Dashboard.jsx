// frontend/src/pages/Dashboard.jsx
import { Link, useNavigate } from "react-router-dom";


const priorities = [
  { id: 1, title: "Build the project dashboard", meta: "FocusFlow", status: "todo", dueDate: "2026-11-24" },
  { id: 2, title: "Connect task CRUD endpoints", meta: "FocusFlow", status: "todo", dueDate: "2026-11-25" },
  { id: 3, title: "Review database relationships", meta: "FocusFlow", status: "done", dueDate: "2026-11-23" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const getUserName = () => {

    const all = { ...localStorage, ...sessionStorage };
    for (const key of Object.keys(all)) {
      try {
        const val = JSON.parse(all[key]);
        const obj = val?.user || val?.data?.user || val?.data || val;
        const name = obj?.name || obj?.username || obj?.firstName || obj?.full_name;
        if (name) return name.split(" ")[0];
        if (obj?.email) return obj.email.split("@")[0];
      } catch {}
    }
    
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken") || sessionStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const name = payload.name || payload.username || payload.firstName || payload.email;
        if (name) return name.split("@")[0].split(" ")[0];
      } catch {}
    }
    return "there";
  };
  const userName = getUserName();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const today = new Date().toISOString().slice(0, 10);
const tasksToday = priorities.filter(p => p.dueDate === today || p.status !== "done").length;
const overdueTasks = priorities.filter(p => p.dueDate < today && p.status !== "done").length;
const activeProjects = new Set(priorities.map(p => p.meta)).size;
const completed7Days = priorities.filter(p => p.status === "done").length;

const stats = [
  { label: "Tasks today", value: String(tasksToday).padStart(2, "0"), sub: `${completed7Days} completed` },
  { label: "Overdue tasks", value: String(overdueTasks).padStart(2, "0"), sub: overdueTasks === 0 ? "All clear" : "Let's get these done" },
  { label: "Active projects", value: String(activeProjects).padStart(2, "0"), sub: `${activeProjects} project in progress` },
  { label: "Completed in 7 days", value: String(completed7Days).padStart(2, "0"), sub: "From your real tasks" },
];
const todayLabel = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

const handleLogout = async () => {
  try {
    await fetch("http://localhost:5000/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (e) {}
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login");
  window.location.reload();
};

  return (
    <div style={{ minHeight: "100vh", background: "#F4F4F0", color: "#111", fontFamily: "Arial, sans-serif", margin: 0 }}>
      
      {/* TOP NAV */}
      <header style={{ background: "#111", color: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <Link to="/dashboard" style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold", fontSize: "14px", color: "white", textDecoration: "none" }}>
              <span style={{ width: "10px", height: "10px", background: "#C6F24E", display: "inline-block" }} />
              FocusFlow
            </Link>
            <nav style={{ display: "flex", gap: "24px", fontSize: "12px" }}>
              <Link to="/dashboard" style={{ color: "white", textDecoration: "none", borderBottom: "2px solid #C6F24E", paddingBottom: "4px" }}>Overview</Link>
              <Link to="/projects" style={{ color: "#a1a1aa", textDecoration: "none" }}>Projects</Link>
              <Link to="/tasks" style={{ color: "#a1a1aa", textDecoration: "none" }}>Task board</Link>
              <Link to="/notes" style={{ color: "#a1a1aa", textDecoration: "none" }}>Personal workspace</Link>
              <Link to="/github-activity" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "14px", display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "8px", height: "8px", background: "#22c55e", borderRadius: "50%", display: "inline-block" }}></span>
                  GitHub
              </Link>
              <Link to="/analytics" style={{ color: "#a1a1aa", textDecoration: "none", fontSize: "14px", display: "flex", alignItems: "center", gap: "5px" }}>
               <span style={{ width: "8px", height: "8px", background: "#a78bfa", borderRadius: "50%", display: "inline-block" }}></span>
                Analytics
              </Link>
            </nav>
          </div>
         <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
  {!isLoggedIn ? (
    <>
      <Link to="/login" style={{ color: "#a1a1aa", textDecoration: "none" }}>Log in</Link>
      <Link to="/register" style={{ background: "white", color: "black", padding: "8px 16px", borderRadius: "8px", textDecoration: "none" }}>Create account</Link>
    </>
  ) : (
    <>
      <Link to="/profile" style={{ color: "#a1a1aa", textDecoration: "none" }}>{userName || "Profile"}</Link>
      <button onClick={handleLogout} style={{ background: "white", color: "black", padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer" }}>Log out</button>
    </>
  )}
     </div>
        </div>

        {/* HERO */}
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px 64px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: "10px", letterSpacing: "2px", color: "#71717a", textTransform: "uppercase", margin: 0 }}>{todayLabel}</p>
            <h1 style={{ fontSize: "48px", fontWeight: "bold", letterSpacing: "-1px", margin: "8px 0 0" }}>{greeting}, {userName}.</h1>
            <p style={{ color: "#a1a1aa", fontSize: "14px", marginTop: "8px" }}>A clear plan for a more focused day.</p>
          </div>
          <button onClick={() => navigate("/tasks?new=true")} style={{ background: "white", color: "black", fontSize: "12px", fontWeight: "600", padding: "8px 12px", border: "none", cursor: "pointer" }}>
            + New task
          </button>
        </div>
      </header>

      {/* STATS */}
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", marginTop: "-32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", background: "white", border: "1px solid #e4e4e7" }}>
          {stats.map((s) => (
            <div key={s.label} style={{ padding: "20px", background: s.active ? "#C6F24E" : "white", borderRight: "1px solid #e4e4e7" }}>
              <p style={{ fontSize: "11px", color: "#71717a", margin: 0 }}>{s.label}</p>
              <p style={{ fontSize: "30px", fontWeight: "bold", margin: "8px 0 0" }}>{s.value}</p>
              <p style={{ fontSize: "11px", color: "#71717a", margin: "4px 0 0" }}>{s.sub}</p>
            </div>
          ))}
        </div>
        

        {/* PRIORITIES + PROMO */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "24px", marginTop: "40px", paddingBottom: "64px" }}>
          <section>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "10px", letterSpacing: "2px", color: "#71717a", textTransform: "uppercase", margin: 0 }}>One thing at a time</p>
                <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: "4px 0 0" }}>Your priorities today</h2>
              </div>
              <Link to="/tasks" style={{ fontSize: "12px", fontWeight: "600", color: "#111", textDecoration: "none" }}>View all tasks →</Link>
            </div>

            <div style={{ marginTop: "16px", background: "white", border: "1px solid #e4e4e7" }}>
              {priorities.map((t) => (
                <div key={t.id} style={{ display: "grid", gridTemplateColumns: "1fr 90px 80px 20px", alignItems: "center", padding: "16px", borderBottom: "1px solid #e4e4e7" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <input type="checkbox" style={{ marginTop: "4px", width: "16px", height: "16px" }} />
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: "600", margin: 0 }}>{t.title}</p>
                      <p style={{ fontSize: "11px", color: "#a1a1aa", margin: "2px 0 0" }}>{t.meta}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "12px" }}>• {t.priority}</span>
                  <span style={{ fontSize: "12px", color: "#71717a" }}>{t.due}</span>
                  <button onClick={() => navigate(`/tasks/${t.id}`)} style={{ background: "none", border: "none", color: "#a1a1aa", cursor: "pointer", fontSize: "18px" }}>›</button>
                </div>
              ))}
            </div>
          </section>

          {/* PROMO CARD */}
          <aside style={{ background: "#111", color: "white", padding: "20px", minHeight: "220px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
            <div style={{ width: "32px", height: "32px", background: "#C6F24E", display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontWeight: "bold" }}>◎</div>
            <div style={{ marginTop: "40px" }}>
              <p style={{ fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#a1a1aa", margin: 0 }}>Keep the important things moving</p>
              <p style={{ fontWeight: "bold", fontSize: "18px", lineHeight: "1.3", marginTop: "8px" }}>Turn a task into 25 minutes of progress.</p>
            </div>
            <button onClick={() => navigate("/focusTimer")} style={{ marginTop: "16px", textAlign: "left", fontSize: "12px", background: "none", border: "none", color: "white", textDecoration: "underline", cursor: "pointer", padding: 0 }}>
              Start a focus session →
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}