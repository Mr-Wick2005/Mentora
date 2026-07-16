import { useState } from "react";
import {
  X, ChevronLeft, ChevronRight, ChevronDown, BookMarked, GraduationCap,
  BookOpen, Shield, ArrowRight, Home, Settings, BarChart3, Users,
  PlusCircle, Search, CircleCheck, FileDown, Save, AlertCircle,
  FilePlus, Megaphone, FlaskConical, Calendar, CalendarDays, Send,
  UserCheck, PieChart, Table, TrendingUp, FileText, Pencil, Bot,
  Activity, UserPlus, ClipboardList, FolderOpen, Download, AlertTriangle,
} from "lucide-react";
import type { AdminScreen } from "./types";
import { T_STUDENTS, T_CLASSES, RISK_COLOR, PageWrap, H1 } from "./teacher-screens";

export type { AdminScreen };

// ─── Admin Side Menu ──────────────────────────────────────────────────────────

function AdminSideMenu({ open, activeScreen, onNavigate, onClose }: {
  open: boolean; activeScreen: AdminScreen;
  onNavigate: (s: AdminScreen) => void; onClose: () => void;
}) {
  const sections: { title: string; items: { id: AdminScreen; label: string; icon: React.ElementType }[] }[] = [
    { title: "Management", items: [
      { id: "teacher-management",  label: "Teacher Management",  icon: Users },
      { id: "class-management",    label: "Class Management",    icon: BookOpen },
      { id: "student-management",  label: "Student Management",  icon: GraduationCap },
    ]},
    { title: "Monitoring", items: [
      { id: "teacher-monitoring",  label: "Teacher Monitoring",  icon: BarChart3 },
      { id: "student-monitoring",  label: "Student Monitoring",  icon: Activity },
    ]},
    { title: "Academic", items: [
      { id: "timetable",           label: "Timetable",           icon: CalendarDays },
      { id: "calendar",            label: "Academic Calendar",   icon: Calendar },
      { id: "notice-management",   label: "Notice Management",   icon: Megaphone },
    ]},
    { title: "Reports & Data", items: [
      { id: "reports",             label: "Reports Center",      icon: FileText },
      { id: "activity-logs",       label: "Activity Logs",       icon: ClipboardList },
    ]},
    { title: "Communication", items: [
      { id: "communication",       label: "Communication",       icon: Send },
      { id: "resource-monitoring", label: "Resource Monitoring", icon: FolderOpen },
    ]},
  ];

  const nav = (s: AdminScreen) => { onNavigate(s); onClose(); };

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/20 z-20 backdrop-blur-[1px]" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-30 flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 border-b border-border flex items-center justify-between" style={{ height: 52 }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center"><Shield size={13} className="text-white" /></div>
            <span className="text-sm font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Admin Portal</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><X size={15} className="text-foreground/50" /></button>
        </div>

        {/* Institution block */}
        <div className="mx-3 mt-3 bg-violet-50 border border-violet-200 rounded-xl p-3">
          <p className="text-[10px] font-bold text-violet-700 uppercase tracking-wider mb-1">Institution</p>
          <p className="text-sm font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Sunrise International</p>
          <p className="text-xs text-muted-foreground">Secondary Section · Grade 6–10</p>
        </div>

        <div className="px-3 mt-2">
          <button onClick={() => nav("dashboard")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeScreen === "dashboard" ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted hover:text-foreground"}`}>
            <Home size={15} />Dashboard
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 mt-1 pb-2 space-y-3 hide-scrollbar">
          {sections.map(sec => (
            <div key={sec.title}>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 py-2">{sec.title}</p>
              <div className="space-y-0.5">
                {sec.items.map(item => (
                  <button key={item.id} onClick={() => nav(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeScreen === item.id ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted hover:text-foreground"}`}>
                    <item.icon size={15} />{item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <button onClick={() => nav("settings")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeScreen === "settings" ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted hover:text-foreground"}`}>
            <Settings size={15} />Settings
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Admin Profile Popup ──────────────────────────────────────────────────────

function AdminProfilePopup({ open, userName, onClose, onLogout }: {
  open: boolean; userName: string; onClose: () => void; onLogout: () => void;
}) {
  if (!open) return null;
  const fields = [
    { label: "Admin Name",        value: userName },
    { label: "Admin ID",          value: "ADM-2024-001" },
    { label: "Role",              value: "Secondary Section Admin" },
    { label: "Assigned Section",  value: "Grade 6–10" },
    { label: "Department",        value: "Academic Management" },
    { label: "Institution",       value: "Sunrise International School" },
    { label: "Email",             value: "admin@example.com" },
    { label: "Contact",           value: "+91 98765 00111" },
  ];
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-14 right-4 z-50 w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-violet-600 to-purple-600 px-5 py-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-lg font-bold">{userName.charAt(0).toUpperCase()}</div>
          <div>
            <div className="text-white font-bold text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{userName}</div>
            <div className="text-white/70 text-xs">Secondary Section Admin</div>
          </div>
          <button onClick={onClose} className="ml-auto p-1 rounded-lg hover:bg-white/20 transition-colors"><X size={16} className="text-white" /></button>
        </div>
        <div className="max-h-64 overflow-y-auto hide-scrollbar p-4 space-y-2">
          {fields.map((f, i) => (
            <div key={i} className="flex justify-between items-start gap-2 py-1.5 border-b border-border last:border-0">
              <span className="text-xs text-muted-foreground shrink-0">{f.label}</span>
              <span className="text-xs font-medium text-foreground text-right">{f.value}</span>
            </div>
          ))}
        </div>
        <div className="px-4 pb-4 pt-1">
          <button onClick={onLogout} className="w-full py-2.5 rounded-xl border-2 border-red-200 text-red-500 text-sm font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Admin Mock Data ──────────────────────────────────────────────────────────

const A_TEACHERS = [
  { name: "Mr. Rajan Mehta",    id: "TCH-001", desig: "Class Teacher",   subject: "Mathematics",  classes: "9th A",          exp: "8 yrs",  status: "active" },
  { name: "Mrs. Priya Sharma",  id: "TCH-002", desig: "Subject Teacher", subject: "Science",      classes: "6B, 9A, 9B",     exp: "5 yrs",  status: "active" },
  { name: "Ms. Anita Nair",     id: "TCH-003", desig: "Subject Teacher", subject: "English",      classes: "6B, 7A, 8B",     exp: "11 yrs", status: "active" },
  { name: "Mr. Suresh Verma",   id: "TCH-004", desig: "Class Teacher",   subject: "Social Sci.",  classes: "6th B",          exp: "6 yrs",  status: "active" },
  { name: "Ms. Deepa Kulkarni", id: "TCH-005", desig: "Subject Teacher", subject: "Hindi",        classes: "6A, 7A, 8A",     exp: "9 yrs",  status: "inactive" },
  { name: "Mr. Anil Joshi",     id: "TCH-006", desig: "Subject Teacher", subject: "Mathematics",  classes: "6A, 7B, 8B",     exp: "3 yrs",  status: "active" },
];

const A_CLASSES = [
  { grade: "6th", section: "A", students: 30, classTeacher: "Mr. Suresh Verma",   subjects: ["Maths","Science","English","Hindi"], year: "2024–25" },
  { grade: "6th", section: "B", students: 28, classTeacher: "Mr. Suresh Verma",   subjects: ["Maths","Science","English","S.Sc."], year: "2024–25" },
  { grade: "7th", section: "A", students: 32, classTeacher: "Ms. Anita Nair",     subjects: ["Maths","Science","English","Hindi"], year: "2024–25" },
  { grade: "8th", section: "B", students: 29, classTeacher: "Mrs. Priya Sharma",  subjects: ["Maths","Science","English","S.Sc."], year: "2024–25" },
  { grade: "9th", section: "A", students: 35, classTeacher: "Mr. Rajan Mehta",    subjects: ["Maths","Science","English","Hindi"], year: "2024–25" },
  { grade: "9th", section: "B", students: 33, classTeacher: "Mrs. Priya Sharma",  subjects: ["Maths","Science","English","S.Sc."], year: "2024–25" },
];

// ─── Admin Screens ────────────────────────────────────────────────────────────

// ── Admin Home ────────────────────────────────────────────────────────────────

function AdminHome({ userName, onNavigate }: { userName: string; onNavigate: (s: AdminScreen) => void }) {
  const stats1 = [
    { label: "Teachers",     val: "18",  gradient: "from-emerald-400 to-teal-500" },
    { label: "Students",     val: "412", gradient: "from-blue-400 to-indigo-500" },
    { label: "Classes",      val: "14",  gradient: "from-violet-400 to-purple-500" },
    { label: "Active Today", val: "287", gradient: "from-amber-400 to-orange-500" },
  ];
  const stats2 = [
    { label: "Attendance Rate",    val: "87%", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
    { label: "Homework Rate",      val: "74%", color: "bg-blue-50 border-blue-200 text-blue-700" },
    { label: "Avg Academic Score", val: "81%", color: "bg-violet-50 border-violet-200 text-violet-700" },
  ];
  const quickActions: { label: string; icon: React.ElementType; screen: AdminScreen; color: string }[] = [
    { label: "Register Teacher",  icon: UserPlus,     screen: "teacher-management",  color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { label: "Assign Teacher",    icon: Users,        screen: "class-management",    color: "bg-teal-50 text-teal-700 border-teal-200" },
    { label: "Create Class",      icon: BookOpen,     screen: "class-management",    color: "bg-blue-50 text-blue-700 border-blue-200" },
    { label: "Manage Students",   icon: GraduationCap,screen: "student-management",  color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    { label: "Publish Notice",    icon: Megaphone,    screen: "notice-management",   color: "bg-amber-50 text-amber-700 border-amber-200" },
    { label: "View Reports",      icon: FileText,     screen: "reports",             color: "bg-violet-50 text-violet-700 border-violet-200" },
    { label: "Generate Report",   icon: BarChart3,    screen: "reports",             color: "bg-purple-50 text-purple-700 border-purple-200" },
    { label: "Activity Logs",     icon: ClipboardList,screen: "activity-logs",       color: "bg-gray-50 text-gray-700 border-gray-200" },
  ];
  const activity = [
    { action: "Teacher Rajan Mehta logged in",              time: "10:42 AM", icon: UserCheck, color: "bg-emerald-100 text-emerald-600" },
    { action: "Notice 'Unit Test 2' published",             time: "09:30 AM", icon: Megaphone, color: "bg-amber-100 text-amber-600" },
    { action: "Class 9th A timetable updated",              time: "09:10 AM", icon: CalendarDays, color: "bg-blue-100 text-blue-600" },
    { action: "Student Arjun Singh transferred to 9th B",   time: "Yesterday", icon: Users, color: "bg-violet-100 text-violet-600" },
    { action: "Report 'June Attendance' generated",         time: "Yesterday", icon: FileText, color: "bg-gray-100 text-gray-600" },
  ];
  const pending = [
    { label: "Pending teacher approvals",   count: 2, color: "bg-amber-100 text-amber-700" },
    { label: "Unreviewed reports",           count: 3, color: "bg-red-100 text-red-600" },
    { label: "Unread messages",             count: 7, color: "bg-blue-100 text-blue-700" },
    { label: "Scheduled notices to publish",count: 1, color: "bg-violet-100 text-violet-700" },
  ];
  const upcoming = [
    { title: "Unit Test 2 — Mathematics",   date: "02 Jul", type: "exam" },
    { title: "Parent-Teacher Meeting",      date: "12 Jul", type: "meeting" },
    { title: "Annual Science Exhibition",   date: "15 Jul", type: "event" },
  ];

  return (
    <PageWrap>
      <div className="mb-6">
        <H1>Admin Dashboard 🛡️</H1>
        <p className="text-muted-foreground mt-1 text-sm">Secondary Section — Grade 6–10 &nbsp;·&nbsp; Sunrise International School</p>
      </div>

      {/* Gradient stats */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {stats1.map((s, i) => (
          <div key={i} className={`bg-gradient-to-br ${s.gradient} rounded-2xl p-5 text-white shadow-md`}>
            <div className="text-3xl font-extrabold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.val}</div>
            <div className="text-sm opacity-75 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      {/* Rate stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats2.map((s, i) => (
          <div key={i} className={`border rounded-2xl p-4 text-center shadow-sm ${s.color}`}>
            <p className="text-2xl font-extrabold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.val}</p>
            <p className="text-xs font-semibold mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-6">
        <div className="space-y-5">
          {/* Activity */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Recent Activity</h3>
              <button onClick={() => onNavigate("activity-logs")} className="text-xs text-primary font-semibold hover:underline">View All →</button>
            </div>
            <div className="space-y-2.5">
              {activity.map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${a.color}`}><a.icon size={13} /></div>
                  <p className="text-sm text-foreground flex-1">{a.action}</p>
                  <span className="text-xs text-muted-foreground shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Quick Actions</h3>
            <div className="grid grid-cols-4 gap-2.5">
              {quickActions.map((a, i) => (
                <button key={i} onClick={() => onNavigate(a.screen)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center hover:-translate-y-0.5 hover:shadow-sm transition-all ${a.color}`}>
                  <a.icon size={17} />
                  <span className="text-[11px] font-semibold leading-tight">{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* AI Recommendations */}
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3"><Bot size={14} className="text-violet-600" /><p className="text-xs font-bold text-violet-700">AI Recommendations</p></div>
            <div className="space-y-2">
              {[
                "3 students in 9th A have attendance below 70%. Recommend parent notifications.",
                "Teacher workload for Mrs. Sharma is high (3 classes). Consider rebalancing.",
                "Homework completion in 6th B dropped to 58% this week.",
              ].map((r, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 shrink-0" />
                  <p className="text-xs leading-relaxed text-foreground/80">{r}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pending */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Pending Tasks</h3>
            {pending.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-xs text-foreground">{p.label}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.color}`}>{p.count}</span>
              </div>
            ))}
          </div>

          {/* Upcoming */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Upcoming Events</h3>
            {upcoming.map((e, i) => (
              <div key={i} className="py-2 border-b border-border last:border-0">
                <p className="text-xs font-semibold text-foreground">{e.title}</p>
                <p className="text-[10px] text-muted-foreground">{e.date} · {e.type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrap>
  );
}

// ── Teacher Management ────────────────────────────────────────────────────────

function TeacherManagementScreen() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const filtered = A_TEACHERS.filter(t =>
    (statusFilter === "All" || t.status === statusFilter.toLowerCase()) &&
    (search === "" || t.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <PageWrap>
      <div className="flex items-center justify-between mb-6">
        <div><H1>Teacher Management</H1><p className="text-sm text-muted-foreground mt-1">Register, assign, and manage all teachers in your section.</p></div>
        <button onClick={() => setShowForm(o => !o)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
          <UserPlus size={15} /> Register Teacher
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-primary/20 rounded-2xl p-5 mb-5 shadow-sm">
          <h3 className="text-sm font-bold text-foreground mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Register New Teacher</h3>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[["Full Name","e.g. Mr. Rajan Mehta"],["Employee ID","e.g. TCH-007"],["Email","teacher@example.com"],["Contact","+91 98765 XXXXX"],["Subject","e.g. Mathematics"],["Experience","e.g. 5 Years"]].map(([l,p],i) => (
              <div key={i}><label className="block text-xs font-semibold mb-1">{l}</label><input placeholder={p} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div><label className="block text-xs font-semibold mb-1">Designation</label>
              <select className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none cursor-pointer">
                <option>Class Teacher</option><option>Subject Teacher</option>
              </select>
            </div>
            <div><label className="block text-xs font-semibold mb-1">Assigned Classes</label>
              <input placeholder="e.g. 9th A, 6th B" className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90">Register</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 bg-muted text-muted-foreground rounded-xl text-sm font-bold hover:bg-muted/80">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-xs"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teachers…" className="pl-9 pr-3 py-2 bg-card border border-border rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
        <div className="flex gap-1.5">{["All","Active","Inactive"].map(s => <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${statusFilter === s ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{s}</button>)}</div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/30">
            {["Name","Employee ID","Designation","Subject(s)","Assigned Classes","Experience","Status","Actions"].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map((t, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3.5 font-semibold text-foreground">{t.name}</td>
                <td className="px-4 py-3.5 text-muted-foreground text-xs font-mono">{t.id}</td>
                <td className="px-4 py-3.5 text-muted-foreground">{t.desig}</td>
                <td className="px-4 py-3.5 text-foreground">{t.subject}</td>
                <td className="px-4 py-3.5 text-muted-foreground text-xs">{t.classes}</td>
                <td className="px-4 py-3.5 text-muted-foreground">{t.exp}</td>
                <td className="px-4 py-3.5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>{t.status}</span></td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-1.5">
                    <button className="text-[10px] font-bold text-primary hover:underline">View</button>
                    <span className="text-muted-foreground">·</span>
                    <button className="text-[10px] font-bold text-muted-foreground hover:text-foreground">Edit</button>
                    <span className="text-muted-foreground">·</span>
                    <button className={`text-[10px] font-bold ${t.status === "active" ? "text-red-500 hover:text-red-600" : "text-emerald-600 hover:text-emerald-700"}`}>{t.status === "active" ? "Deactivate" : "Activate"}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageWrap>
  );
}

// ── Class Management ──────────────────────────────────────────────────────────

function ClassManagementScreen() {
  const [showForm, setShowForm] = useState(false);
  const dotColors = ["bg-blue-500","bg-indigo-500","bg-violet-500","bg-emerald-500","bg-teal-500","bg-amber-500"];

  return (
    <PageWrap>
      <div className="flex items-center justify-between mb-6">
        <div><H1>Class Management</H1><p className="text-sm text-muted-foreground mt-1">Create, edit, and manage all classes in your section.</p></div>
        <button onClick={() => setShowForm(o => !o)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
          <FilePlus size={15} /> Create Class
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-primary/20 rounded-2xl p-5 mb-5 shadow-sm">
          <h3 className="text-sm font-bold text-foreground mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Create New Class</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div><label className="block text-xs font-semibold mb-1">Grade</label><input placeholder="e.g. 10th" className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
            <div><label className="block text-xs font-semibold mb-1">Section</label><input placeholder="e.g. A" className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
            <div><label className="block text-xs font-semibold mb-1">Academic Year</label><input defaultValue="2024–25" className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
            <div><label className="block text-xs font-semibold mb-1">Class Teacher</label>
              <select className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none cursor-pointer">
                {A_TEACHERS.filter(t => t.desig === "Class Teacher").map(t => <option key={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90">Create Class</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 bg-muted text-muted-foreground rounded-xl text-sm font-bold hover:bg-muted/80">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {A_CLASSES.map((c, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-3 h-3 rounded-full ${dotColors[i % dotColors.length]}`} />
              <h3 className="text-base font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{c.grade} — {c.section}</h3>
              <span className="ml-auto text-xs text-muted-foreground">{c.year}</span>
            </div>
            <div className="space-y-1.5 mb-3 text-xs">
              <div className="flex items-center gap-2"><UserCheck size={12} className="text-muted-foreground shrink-0" /><span className="text-foreground">{c.classTeacher}</span></div>
              <div className="flex items-center gap-2"><GraduationCap size={12} className="text-muted-foreground shrink-0" /><span className="text-muted-foreground">{c.students} students</span></div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {c.subjects.map((s, j) => <span key={j} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-foreground/70">{s}</span>)}
            </div>
            <div className="flex gap-1.5">
              <button className="flex-1 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-xl hover:bg-primary/20 transition-colors">View Students</button>
              <button className="px-3 py-1.5 bg-muted text-muted-foreground text-xs font-bold rounded-xl hover:bg-muted/80 transition-colors">Edit</button>
              <button className="px-3 py-1.5 bg-muted text-muted-foreground text-xs font-bold rounded-xl hover:bg-muted/80 transition-colors">Archive</button>
            </div>
          </div>
        ))}
      </div>
    </PageWrap>
  );
}

// ── Student Management ────────────────────────────────────────────────────────

function AdminStudentManagementScreen() {
  const [search, setSearch] = useState("");
  const [clsFilter, setClsFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const filtered = T_STUDENTS.filter(s =>
    (search === "" || s.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <PageWrap>
      <div className="flex items-center justify-between mb-6">
        <div><H1>Student Management</H1><p className="text-sm text-muted-foreground mt-1">Register, transfer, and manage students across your section.</p></div>
        <button onClick={() => setShowForm(o => !o)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
          <UserPlus size={15} /> Register Student
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-primary/20 rounded-2xl p-5 mb-5 shadow-sm">
          <h3 className="text-sm font-bold text-foreground mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Register New Student</h3>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[["Full Name","e.g. Arjun Singh"],["Roll Number","e.g. 36"],["Class","e.g. 9th A"],["Date of Birth",""],["Parent Name","e.g. Mr. Harish Singh"],["Parent Contact","+91 XXXXX"]].map(([l,p],i) => (
              <div key={i}><label className="block text-xs font-semibold mb-1">{l}</label>
                {l === "Date of Birth" ? <input type="date" className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  : <input placeholder={p} className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30" />}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90">Register</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 bg-muted text-muted-foreground rounded-xl text-sm font-bold hover:bg-muted/80">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-xs"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students…" className="pl-9 pr-3 py-2 bg-card border border-border rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
        <div className="flex gap-1.5">
          {["All","9th A","6th B","5th A"].map(c => <button key={c} onClick={() => setClsFilter(c)} className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${clsFilter === c ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{c}</button>)}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/30">
            {["Roll","Name","Class","Attendance","Homework","Score","Status","Actions"].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 text-xs font-bold text-muted-foreground">{s.roll}</td>
                <td className="px-4 py-3 font-semibold text-foreground">{s.name}</td>
                <td className="px-4 py-3 text-muted-foreground">9th A</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5"><div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden"><div className={`h-full rounded-full ${s.attendance >= 85 ? "bg-emerald-500" : s.attendance >= 70 ? "bg-amber-400" : "bg-red-400"}`} style={{ width:`${s.attendance}%` }} /></div><span className="text-xs text-muted-foreground">{s.attendance}%</span></div>
                </td>
                <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.hw === "Completed" ? "bg-emerald-100 text-emerald-700" : s.hw === "Pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>{s.hw}</span></td>
                <td className="px-4 py-3 font-semibold text-foreground">{s.score}%</td>
                <td className="px-4 py-3"><span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Active</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <button className="text-[10px] font-bold text-primary hover:underline">View</button>
                    <span className="text-muted-foreground">·</span>
                    <button className="text-[10px] font-bold text-muted-foreground hover:text-foreground">Transfer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageWrap>
  );
}

// ── Teacher Monitoring ────────────────────────────────────────────────────────

function TeacherMonitoringScreen() {
  const data = A_TEACHERS.map((t, i) => ({
    ...t,
    classes: [4,3,5,4,2,5][i],
    hwAssigned: [8,6,10,7,3,9][i],
    assignments: [3,2,4,3,1,3][i],
    tests: [2,1,3,2,0,2][i],
    avgScore: [82,78,85,74,65,79][i],
  }));

  return (
    <PageWrap>
      <div className="mb-5">
        <H1>Teacher Monitoring</H1>
        <p className="text-sm text-muted-foreground mt-1">Monitor teacher performance and activity across your section.</p>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Avg Classes/Week", val: "3.8", color: "bg-blue-50 border-blue-200 text-blue-700" },
          { label: "Avg HW Assigned",  val: "7.2", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
          { label: "Avg Student Score",val: "77%", color: "bg-violet-50 border-violet-200 text-violet-700" },
        ].map((s,i) => (
          <div key={i} className={`border rounded-2xl p-4 text-center shadow-sm ${s.color}`}>
            <p className="text-2xl font-extrabold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.val}</p>
            <p className="text-xs font-semibold mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/30">
            {["Teacher","Classes/Wk","HW Assigned","Assignments","Tests","Avg Student Score","Performance"].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>)}
          </tr></thead>
          <tbody>
            {data.map((t, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3.5 font-semibold text-foreground">{t.name}</td>
                <td className="px-4 py-3.5 text-center text-foreground">{t.classes}</td>
                <td className="px-4 py-3.5 text-center text-foreground">{t.hwAssigned}</td>
                <td className="px-4 py-3.5 text-center text-foreground">{t.assignments}</td>
                <td className="px-4 py-3.5 text-center text-foreground">{t.tests}</td>
                <td className="px-4 py-3.5 text-center font-semibold text-foreground">{t.avgScore}%</td>
                <td className="px-4 py-3.5 w-28">
                  <div className="h-2 bg-muted rounded-full overflow-hidden"><div className={`h-full rounded-full ${t.avgScore >= 80 ? "bg-emerald-500" : t.avgScore >= 70 ? "bg-amber-400" : "bg-red-400"}`} style={{ width:`${t.avgScore}%` }} /></div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{t.avgScore >= 80 ? "Excellent" : t.avgScore >= 70 ? "Good" : "Needs Review"}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageWrap>
  );
}

// ── Student Monitoring ────────────────────────────────────────────────────────

function StudentMonitoringScreen() {
  const [risk, setRisk] = useState("All");
  const students = T_STUDENTS.map(s => ({ ...s, cls: "9th A", aiScore: Math.round(s.score * 0.9 + Math.random() * 5) }));
  const filtered = risk === "All" ? students : students.filter(s => s.risk === risk.toLowerCase());
  const atRisk = students.filter(s => s.risk !== "low").length;

  return (
    <PageWrap>
      <div className="flex items-center justify-between mb-5">
        <div><H1>Student Monitoring</H1><p className="text-sm text-muted-foreground mt-1">Track performance, attendance, and identify at-risk students.</p></div>
        <div className="flex gap-1.5">{["All","High","Medium","Low"].map(r => <button key={r} onClick={() => setRisk(r)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${risk === r ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{r}</button>)}</div>
      </div>

      {atRisk > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 mb-4 flex items-center gap-2">
          <AlertTriangle size={14} className="text-red-500 shrink-0" />
          <p className="text-sm text-red-700 font-medium">{atRisk} students require attention — review their profiles and consider interventions.</p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: "Avg Attendance", val: `${Math.round(students.reduce((a,s) => a+s.attendance,0)/students.length)}%`, color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
          { label: "HW Completion",  val: `${Math.round(students.filter(s => s.hw === "Completed").length / students.length * 100)}%`, color: "bg-blue-50 border-blue-200 text-blue-700" },
          { label: "Avg Score",      val: `${Math.round(students.reduce((a,s) => a+s.score,0)/students.length)}%`, color: "bg-violet-50 border-violet-200 text-violet-700" },
          { label: "At-Risk Students",val: `${atRisk}`, color: "bg-red-50 border-red-200 text-red-600" },
        ].map((s,i) => (
          <div key={i} className={`border rounded-2xl p-4 text-center shadow-sm ${s.color}`}>
            <p className="text-2xl font-extrabold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.val}</p>
            <p className="text-xs font-semibold mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filtered.map((s, i) => (
          <div key={i} className={`bg-card border rounded-2xl p-4 shadow-sm ${s.risk === "high" ? "border-red-200" : s.risk === "medium" ? "border-amber-200" : "border-border"}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">{s.roll}</div>
              <div className="flex-1"><p className="text-sm font-semibold text-foreground">{s.name}</p><p className="text-xs text-muted-foreground">{s.cls}</p></div>
              <div className={`w-2.5 h-2.5 rounded-full ${RISK_COLOR[s.risk]}`} title={`Risk: ${s.risk}`} />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[["Attendance",`${s.attendance}%`],["Score",`${s.score}%`],["AI Score",`${s.aiScore}`]].map(([l,v],j) => (
                <div key={j} className="bg-muted/50 rounded-lg p-1.5">
                  <p className="text-xs font-bold text-foreground">{v}</p>
                  <p className="text-[9px] text-muted-foreground">{l}</p>
                </div>
              ))}
            </div>
            {s.risk !== "low" && (
              <div className={`mt-2.5 text-[10px] px-2.5 py-1 rounded-lg font-semibold ${s.risk === "high" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"}`}>
                ⚠️ {s.risk === "high" ? "Urgent: Contact parent & assign remedial sessions" : "Monitor: Schedule check-in session"}
              </div>
            )}
          </div>
        ))}
      </div>
    </PageWrap>
  );
}

// ── Admin Timetable ───────────────────────────────────────────────────────────

function AdminTimetableScreen() {
  const periods = ["09:00","10:30","12:00","14:00","15:30","16:30","17:00"];
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat"];
  const grid: Record<string, Record<string, string>> = {
    "09:00": { Mon:"Maths·Mehta·R12", Tue:"Sci·Sharma·Lab2", Wed:"Eng·Nair·R8", Thu:"Hindi·DK·R3", Fri:"SSci·Verma·R5", Sat:"Free" },
    "10:30": { Mon:"Sci·Sharma·Lab1", Tue:"Maths·Mehta·R12", Wed:"Hindi·DK·R3", Thu:"Eng·Nair·R8", Fri:"Maths·Joshi·R10", Sat:"Maths·Mehta·R12" },
    "12:00": { Mon:"Free",            Tue:"SSci·Verma·R5",   Wed:"Maths·Joshi·R10", Thu:"Free",     Fri:"Sci·Sharma·Lab1", Sat:"Sci·Sharma·Lab2" },
    "14:00": { Mon:"Hindi·DK·R3",     Tue:"Free",            Wed:"SSci·Verma·R5", Thu:"Maths·Joshi·R10", Fri:"Free",     Sat:"Free" },
    "15:30": { Mon:"Eng·Nair·R8",     Tue:"Maths·Joshi·R10", Wed:"Free",         Thu:"Sci·Sharma·Lab2", Fri:"Eng·Nair·R8", Sat:"Free" },
    "16:30": { Mon:"Free",            Tue:"Free",            Wed:"Eng·Nair·R8", Thu:"Free",          Fri:"Free",         Sat:"Free" },
    "17:00": { Mon:"Free",            Tue:"Free",            Wed:"Free",         Thu:"Free",          Fri:"Free",         Sat:"Free" },
  };
  const changes = [
    { desc: "Mrs. Sharma on leave Tue 1 Jul — substituted by Mr. Joshi", type: "substitution", color: "bg-amber-50 text-amber-700 border-amber-200" },
    { desc: "Room 12 maintenance — moved to Room 14 (Wed)",               type: "room change",   color: "bg-blue-50 text-blue-700 border-blue-200" },
    { desc: "Hindi period cancelled — 28 Jun (9th A)",                    type: "cancelled",     color: "bg-red-50 text-red-600 border-red-200" },
  ];

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div><H1>Timetable Management</H1><p className="text-sm text-muted-foreground mt-1">Manage the institution timetable, substitutions, and room allocations.</p></div>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"><Pencil size={14} /> Update Timetable</button>
        </div>
        <div className="grid grid-cols-[1fr_260px] gap-5">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-border bg-muted/30"><h3 className="text-sm font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Weekly Timetable — 9th A</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-border">
                  <th className="text-left px-3 py-2.5 text-muted-foreground font-semibold w-14">Period</th>
                  {days.map(d => <th key={d} className="px-2 py-2.5 font-bold text-muted-foreground text-center">{d}</th>)}
                </tr></thead>
                <tbody>
                  {periods.map(p => (
                    <tr key={p} className="border-b border-border last:border-0">
                      <td className="px-3 py-2.5 text-muted-foreground font-mono text-[10px]">{p}</td>
                      {days.map(d => {
                        const cell = grid[p]?.[d] || "—";
                        const isFree = cell === "Free";
                        const parts = cell.split("·");
                        return (
                          <td key={d} className="px-2 py-2.5 text-center">
                            {isFree ? <span className="text-muted-foreground/40 text-[10px]">—</span> : (
                              <div>
                                <p className="text-[11px] font-bold text-foreground">{parts[0]}</p>
                                {parts[1] && <p className="text-[9px] text-muted-foreground">{parts[1]}</p>}
                                {parts[2] && <p className="text-[9px] text-muted-foreground/60">{parts[2]}</p>}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Recent Changes</h3>
              <div className="space-y-2">
                {changes.map((c, i) => (
                  <div key={i} className={`border rounded-xl p-2.5 text-xs ${c.color}`}>
                    <p className="font-semibold capitalize mb-0.5">{c.type}</p>
                    <p className="opacity-80 leading-snug">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Quick Actions</h3>
              {["Add Substitution","Change Room","Cancel Period","Update Schedule"].map((a,i) => (
                <button key={i} className="w-full text-left py-2 px-3 rounded-xl text-xs font-medium text-foreground hover:bg-muted transition-colors flex items-center gap-2 mb-0.5">
                  <Pencil size={11} className="text-primary" />{a}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Academic Calendar ─────────────────────────────────────────────────────────

function AcademicCalendarScreen() {
  const [showAddEvent, setShowAddEvent] = useState(false);
  const events = [
    { date: "02 Jul", title: "Unit Test 2 — Mathematics",    type: "exam",    color: "bg-red-100 text-red-700 border-red-200" },
    { date: "07 Jul", title: "Eid Al-Adha Holiday",          type: "holiday", color: "bg-amber-100 text-amber-700 border-amber-200" },
    { date: "12 Jul", title: "Parent-Teacher Meeting",       type: "meeting", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { date: "15 Jul", title: "Annual Science Exhibition",    type: "event",   color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    { date: "20 Jul", title: "Mid-Term Examinations Begin",  type: "exam",    color: "bg-red-100 text-red-700 border-red-200" },
    { date: "28 Jul", title: "Independence Day Holiday",     type: "holiday", color: "bg-amber-100 text-amber-700 border-amber-200" },
    { date: "01 Aug", title: "Second Term Begins",           type: "academic",color: "bg-violet-100 text-violet-700 border-violet-200" },
  ];

  // Simple calendar for July 2025
  const daysInJuly = 31;
  const startDay = 2; // July 1 is Tuesday (0=Sun)
  const eventDates = new Set(events.map(e => parseInt(e.date)));

  return (
    <PageWrap>
      <div className="flex items-center justify-between mb-6">
        <div><H1>Academic Calendar</H1><p className="text-sm text-muted-foreground mt-1">Manage holidays, exams, events, and academic milestones.</p></div>
        <button onClick={() => setShowAddEvent(o => !o)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
          <FilePlus size={14} /> Add Event
        </button>
      </div>

      {showAddEvent && (
        <div className="bg-card border border-primary/20 rounded-2xl p-5 mb-5 shadow-sm">
          <h3 className="text-sm font-bold text-foreground mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Add New Event</h3>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div><label className="block text-xs font-semibold mb-1">Title</label><input placeholder="Event title…" className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
            <div><label className="block text-xs font-semibold mb-1">Date</label><input type="date" className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
            <div><label className="block text-xs font-semibold mb-1">Type</label>
              <select className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none cursor-pointer">
                {["Exam","Holiday","Meeting","Event","Academic","Workshop"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="col-span-2"><label className="block text-xs font-semibold mb-1">Description</label><input placeholder="Brief description…" className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
            <div><label className="block text-xs font-semibold mb-1">Target Audience</label>
              <select className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none cursor-pointer">
                {["All","Students Only","Teachers Only","Parents"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90">Add Event</button>
            <button onClick={() => setShowAddEvent(false)} className="px-5 py-2 bg-muted text-muted-foreground rounded-xl text-sm font-bold hover:bg-muted/80">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-[1fr_280px] gap-5">
        {/* Calendar grid */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-foreground mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>July 2025</h3>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d} className="text-[10px] font-bold text-muted-foreground text-center py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {[...Array(startDay)].map((_, i) => <div key={`e${i}`} />)}
            {[...Array(daysInJuly)].map((_, i) => {
              const day = i + 1;
              const hasEvent = eventDates.has(day);
              const isToday = day === 5; // July 5
              return (
                <div key={day} className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm cursor-pointer transition-colors ${isToday ? "bg-primary text-white font-bold" : hasEvent ? "bg-primary/10 hover:bg-primary/20" : "hover:bg-muted"}`}>
                  <span className={`text-xs ${isToday ? "font-bold" : "text-foreground"}`}>{day}</span>
                  {hasEvent && !isToday && <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Events list */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Upcoming Events</h3>
          <div className="space-y-2">
            {events.map((e, i) => (
              <div key={i} className={`flex items-start gap-3 p-2.5 rounded-xl border ${e.color}`}>
                <div className="text-center shrink-0 w-8">
                  <p className="text-[10px] font-bold leading-tight">{e.date.split(" ")[0]}</p>
                  <p className="text-[9px] leading-tight">{e.date.split(" ")[1]}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold leading-snug">{e.title}</p>
                  <span className="text-[9px] capitalize opacity-70">{e.type}</span>
                </div>
                <button className="p-0.5 rounded hover:opacity-70 transition-opacity"><Pencil size={10} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrap>
  );
}

// ── Notice Management ─────────────────────────────────────────────────────────

function AdminNoticeMgmtScreen() {
  const [tab, setTab] = useState<"published"|"drafts"|"scheduled">("published");
  const [showCreate, setShowCreate] = useState(false);
  const notices = [
    { title: "Unit Test 2 Timetable",        category: "Examination", priority: "High",   date: "29 Jun", audience: "All",      status: "published" as const },
    { title: "Annual Science Exhibition",     category: "Events",      priority: "Medium", date: "28 Jun", audience: "Students", status: "published" as const },
    { title: "Fee Payment Reminder",          category: "Admin",       priority: "High",   date: "27 Jun", audience: "Parents",  status: "published" as const },
    { title: "Holiday Notice — Eid Al-Adha", category: "General",     priority: "Low",    date: "26 Jun", audience: "All",      status: "published" as const },
    { title: "Mid-Term Exam Notice",          category: "Examination", priority: "High",   date: "—",       audience: "All",      status: "scheduled" as const },
    { title: "Workshop Circular — Draft",     category: "Academic",    priority: "Low",    date: "—",       audience: "Teachers", status: "drafts" as const },
  ];
  const filtered = notices.filter(n => n.status === tab);
  const catColors: Record<string, string> = { Examination:"bg-red-100 text-red-700 border-red-200", Events:"bg-emerald-100 text-emerald-700 border-emerald-200", Admin:"bg-violet-100 text-violet-700 border-violet-200", General:"bg-gray-100 text-gray-600 border-gray-200", Academic:"bg-blue-100 text-blue-700 border-blue-200" };
  const priorityColor: Record<string, string> = { High:"bg-red-100 text-red-600", Medium:"bg-amber-100 text-amber-700", Low:"bg-gray-100 text-gray-500" };

  return (
    <PageWrap>
      <div className="flex items-center justify-between mb-5">
        <div><H1>Notice Management</H1><p className="text-sm text-muted-foreground mt-1">Publish official notices to teachers, students, and parents.</p></div>
        <button onClick={() => setShowCreate(o => !o)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
          <FilePlus size={14} /> Create Notice
        </button>
      </div>

      {showCreate && (
        <div className="bg-card border border-primary/20 rounded-2xl p-5 mb-5 shadow-sm">
          <h3 className="text-sm font-bold text-foreground mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Create New Notice</h3>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="col-span-2"><label className="block text-xs font-semibold mb-1">Title</label><input placeholder="Notice title…" className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
            <div><label className="block text-xs font-semibold mb-1">Category</label>
              <select className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none cursor-pointer">
                {["General","Academic","Examination","Holiday","Parent","Emergency","Teacher","Student"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-semibold mb-1">Priority</label>
              <select className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none cursor-pointer">
                {["High","Medium","Low"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-semibold mb-1">Target Audience</label>
              <select className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none cursor-pointer">
                {["All","Students Only","Teachers Only","Parents","Class 9th A"].map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-semibold mb-1">Expiry Date</label><input type="date" className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
            <div className="col-span-3"><label className="block text-xs font-semibold mb-1">Description</label><textarea rows={2} placeholder="Notice body…" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" /></div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90">Publish Now</button>
            <button className="px-4 py-2 bg-muted text-muted-foreground rounded-xl text-sm font-bold hover:bg-muted/80">Save Draft</button>
            <button className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-bold hover:opacity-90">Schedule</button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 bg-muted text-muted-foreground rounded-xl text-sm font-bold hover:bg-muted/80 ml-auto">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-5">
        {(["published","drafts","scheduled"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-colors ${tab === t ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {t} ({notices.filter(n => n.status === t).length})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((n, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-sm font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{n.title}</h3>
              <div className="flex gap-1.5 shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catColors[n.category] ?? "bg-muted text-muted-foreground"}`}>{n.category}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityColor[n.priority]}`}>{n.priority}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>📣 {n.audience}</span>
              {n.date !== "—" && <span>📅 {n.date} Jun 2025</span>}
              <div className="flex gap-2 ml-auto">
                <button className="text-primary font-semibold hover:underline">Edit</button>
                <span>·</span>
                <button className="text-red-500 font-semibold hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-muted-foreground"><Megaphone size={28} className="mx-auto mb-2 opacity-20" /><p className="text-sm">No {tab} notices</p></div>
        )}
      </div>
    </PageWrap>
  );
}

// ── Reports Center ────────────────────────────────────────────────────────────

function AdminReportsScreen() {
  const [tab, setTab] = useState<"student"|"teacher"|"institution">("student");
  const [generated, setGenerated] = useState<string | null>(null);

  const reportGroups = {
    student: [
      { name: "Attendance Report",         desc: "Monthly attendance summary per student",    color: "bg-emerald-50 border-emerald-200 text-emerald-700", icon: UserCheck },
      { name: "Academic Performance",       desc: "Test scores and grade distribution",        color: "bg-blue-50 border-blue-200 text-blue-700",      icon: BarChart3 },
      { name: "Homework & Assignments",     desc: "Completion rates and submission tracking",  color: "bg-violet-50 border-violet-200 text-violet-700", icon: FileText },
      { name: "Learning Progress",          desc: "Chapter-wise progress and AI learning score",color:"bg-amber-50 border-amber-200 text-amber-700",   icon: TrendingUp },
    ],
    teacher: [
      { name: "Teaching Activity",          desc: "Classes conducted, HW assigned, tests given",color:"bg-teal-50 border-teal-200 text-teal-700",      icon: BookOpen },
      { name: "Attendance Record",          desc: "Teacher punctuality and leave history",     color: "bg-blue-50 border-blue-200 text-blue-700",      icon: CalendarDays },
      { name: "Student Result Summary",     desc: "Student outcomes per teacher",              color: "bg-violet-50 border-violet-200 text-violet-700", icon: GraduationCap },
    ],
    institution: [
      { name: "Overall Attendance",         desc: "Section-wide attendance trends",            color: "bg-emerald-50 border-emerald-200 text-emerald-700", icon: Users },
      { name: "Department Performance",     desc: "Cross-class academic comparison",           color: "bg-blue-50 border-blue-200 text-blue-700",      icon: BarChart3 },
      { name: "Examination Analysis",       desc: "Test performance and grade distribution",   color: "bg-red-50 border-red-200 text-red-600",         icon: FlaskConical },
    ],
  };

  const currentReports = reportGroups[tab];

  return (
    <PageWrap>
      <div className="mb-5"><H1>Reports Center</H1><p className="text-sm text-muted-foreground mt-1">Generate, export, and print institutional reports.</p></div>
      <div className="flex gap-2 mb-5">
        {(["student","teacher","institution"] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setGenerated(null); }}
            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-colors ${tab === t ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {t === "student" ? "Student Reports" : t === "teacher" ? "Teacher Reports" : "Institution Reports"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        {currentReports.map((r, i) => (
          <div key={i} className={`border rounded-2xl p-5 shadow-sm hover:-translate-y-0.5 transition-all ${r.color}`}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center shrink-0"><r.icon size={18} /></div>
              <div><h3 className="text-sm font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{r.name}</h3><p className="text-xs mt-0.5 opacity-70">{r.desc}</p></div>
            </div>
            <div className="flex gap-2">
              <select className="flex-1 border border-current/20 rounded-xl px-2 py-1.5 text-xs bg-white/50 focus:outline-none cursor-pointer">
                {A_CLASSES.map(c => <option key={c.grade + c.section}>{c.grade} — {c.section}</option>)}
              </select>
              <button onClick={() => setGenerated(r.name)}
                className="px-3 py-1.5 bg-white/80 rounded-xl text-xs font-bold hover:bg-white transition-colors">Generate</button>
            </div>
          </div>
        ))}
      </div>

      {generated && (
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{generated} — Preview</h3>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2 bg-muted text-muted-foreground rounded-xl text-xs font-bold hover:bg-muted/80"><Download size={12} /> PDF</button>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-muted text-muted-foreground rounded-xl text-xs font-bold hover:bg-muted/80"><Download size={12} /> Excel</button>
            </div>
          </div>
          <table className="w-full text-xs">
            <thead><tr className="border-b border-border bg-muted/30">
              {["Student","Class","Metric","Value","Status"].map(h => <th key={h} className="text-left px-4 py-2.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>)}
            </tr></thead>
            <tbody>
              {T_STUDENTS.slice(0,5).map((s,i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3 font-semibold text-foreground">{s.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">9th A</td>
                  <td className="px-4 py-3 text-muted-foreground">{generated.split(" ")[0]}</td>
                  <td className="px-4 py-3 font-bold text-foreground">{s.score}%</td>
                  <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.score>=80?"bg-emerald-100 text-emerald-700":s.score>=60?"bg-amber-100 text-amber-700":"bg-red-100 text-red-600"}`}>{s.score>=80?"Good":s.score>=60?"Average":"Needs Help"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageWrap>
  );
}

// ── Communication ─────────────────────────────────────────────────────────────

function AdminCommunicationScreen() {
  const [tab, setTab] = useState<"broadcast"|"announcements"|"messages">("broadcast");
  const [msg, setMsg] = useState("");
  const announcements = [
    { title: "Reminder: Submit lesson plans by Friday",  audience: "All Teachers",   date: "29 Jun", sent: true },
    { title: "Unit Test 2 schedule published",           audience: "All Students",   date: "28 Jun", sent: true },
    { title: "Fee reminder — Q2 deadline 30 Jun",        audience: "All Parents",    date: "27 Jun", sent: true },
  ];
  const messages = [
    { from: "Mr. Rajan Mehta",    preview: "Can I get a substitute for Thursday?",         time: "11:00 AM", read: false },
    { from: "Aaravi's Parent",    preview: "Is it possible to reschedule the PTM?",        time: "09:45 AM", read: false },
    { from: "Principal Office",   preview: "Please submit section report by end of day.",  time: "Yesterday",  read: true },
  ];

  return (
    <PageWrap>
      <H1>Communication Center</H1>
      <p className="text-sm text-muted-foreground mt-1 mb-5">Broadcast messages, publish announcements, and manage communications.</p>
      <div className="flex gap-2 mb-5">
        {(["broadcast","announcements","messages"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-colors ${tab === t ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {t}
            {t === "messages" && <span className="ml-1.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">2</span>}
          </button>
        ))}
      </div>

      {tab === "broadcast" && (
        <div className="grid grid-cols-[1fr_280px] gap-5">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Send Broadcast Message</h3>
            <div className="space-y-3">
              <div><label className="block text-xs font-semibold mb-1.5">Target Audience</label>
                <select className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-card focus:outline-none cursor-pointer">
                  {["All Teachers & Students","All Teachers Only","All Students Only","All Parents","Specific Class — 9th A","Section-wide"].map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-semibold mb-1.5">Subject</label><input placeholder="Message subject…" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
              <div><label className="block text-xs font-semibold mb-1.5">Message</label><textarea value={msg} onChange={e => setMsg(e.target.value)} rows={4} placeholder="Type your broadcast message…" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" /></div>
              <button className="w-full py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 flex items-center justify-center gap-2">
                <Send size={14} /> Send Broadcast
              </button>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Broadcast Stats</h3>
            {[["Messages Sent This Week","12"],["Total Recipients","447"],["Open Rate","68%"],["Last Broadcast","Today 09:30"]].map(([l,v],i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-xs text-muted-foreground">{l}</span>
                <span className="text-xs font-bold text-foreground">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "announcements" && (
        <div className="space-y-3">
          {announcements.map((a, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><Send size={14} className="text-primary" /></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{a.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">→ {a.audience} · {a.date}</p>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Sent</span>
            </div>
          ))}
        </div>
      )}

      {tab === "messages" && (
        <div className="space-y-2.5">
          {messages.map((m, i) => (
            <div key={i} className={`bg-card border rounded-2xl p-4 shadow-sm flex items-start gap-3 ${!m.read ? "border-primary/25 bg-primary/[0.02]" : "border-border"}`}>
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary">{m.from.charAt(0)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{m.from}</p>
                  <span className="text-xs text-muted-foreground">{m.time}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{m.preview}</p>
              </div>
              {!m.read && <div className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />}
            </div>
          ))}
        </div>
      )}
    </PageWrap>
  );
}

// ── Resource Monitoring ───────────────────────────────────────────────────────

function ResourceMonitoringScreen() {
  const [tab, setTab] = useState<"teacher"|"student"|"all">("all");
  const resources = [
    { title: "Quadratic Equations Notes",    by: "Mr. Rajan Mehta",    subject: "Maths",   cls: "9th A", type: "Notes",     date: "28 Jun", status: "approved" },
    { title: "Science Lab Worksheets",       by: "Mrs. Priya Sharma",  subject: "Science", cls: "6th B", type: "Worksheet", date: "26 Jun", status: "approved" },
    { title: "English Grammar PDF",          by: "Ms. Anita Nair",     subject: "English", cls: "7th A", type: "PDF",       date: "25 Jun", status: "pending" },
    { title: "My Maths Notes — Chapter 3",   by: "Aaravi Sharma",      subject: "Maths",   cls: "9th A", type: "Notes",     date: "24 Jun", status: "student" },
    { title: "Science Diagram Notes",        by: "Priya Patel",        subject: "Science", cls: "9th A", type: "Notes",     date: "22 Jun", status: "student" },
    { title: "Previous Year Papers 2024",    by: "Admin Upload",       subject: "All",     cls: "All",   type: "Papers",    date: "20 Jun", status: "approved" },
  ];

  const filtered = resources.filter(r => tab === "all" || (tab === "teacher" ? !["student"].includes(r.status) : r.status === "student"));
  const typeColor: Record<string, string> = { Notes:"bg-blue-100 text-blue-700", PDF:"bg-red-100 text-red-600", Worksheet:"bg-amber-100 text-amber-700", Papers:"bg-violet-100 text-violet-700" };

  return (
    <PageWrap>
      <H1>Resource Monitoring</H1>
      <p className="text-sm text-muted-foreground mt-1 mb-5">Monitor, approve, and manage all uploaded learning resources.</p>
      <div className="flex gap-2 mb-5">
        {(["all","teacher","student"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-colors ${tab === t ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {t === "all" ? "All Resources" : t === "teacher" ? "Teacher Uploads" : "Student Files"}
          </button>
        ))}
      </div>
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/30">
            {["Title","Uploaded By","Subject","Class","Type","Date","Status","Actions"].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20">
                <td className="px-4 py-3 font-semibold text-foreground">{r.title}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{r.by}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.subject}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.cls}</td>
                <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${typeColor[r.type] ?? "bg-muted text-muted-foreground"}`}>{r.type}</span></td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{r.date}</td>
                <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.status === "approved" ? "bg-emerald-100 text-emerald-700" : r.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>{r.status}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <button className="text-[10px] font-bold text-primary hover:underline">View</button>
                    {r.status === "pending" && <><span className="text-muted-foreground">·</span><button className="text-[10px] font-bold text-emerald-600 hover:underline">Approve</button></>}
                    <span className="text-muted-foreground">·</span>
                    <button className="text-[10px] font-bold text-red-500 hover:underline">Remove</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageWrap>
  );
}

// ── Activity Logs ─────────────────────────────────────────────────────────────

function ActivityLogsScreen() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const logs = [
    { action: "Teacher Registered",     actor: "Admin",                desc: "Mr. Anil Joshi registered as Subject Teacher",    time: "29 Jun, 11:15 AM", type: "teacher" },
    { action: "Notice Published",        actor: "Admin",                desc: "Unit Test 2 timetable notice published",          time: "29 Jun, 10:30 AM", type: "notice" },
    { action: "Class Updated",           actor: "Admin",                desc: "9th A class teacher changed to Mr. Rajan Mehta", time: "28 Jun, 03:15 PM", type: "class" },
    { action: "Student Registered",      actor: "Admin",                desc: "Tanvi Kulkarni enrolled in 9th A",                time: "28 Jun, 01:00 PM", type: "student" },
    { action: "Report Generated",        actor: "Admin",                desc: "June attendance report exported as PDF",          time: "27 Jun, 04:45 PM", type: "report" },
    { action: "Timetable Updated",       actor: "Admin",                desc: "9th A Tuesday schedule revised",                  time: "27 Jun, 11:00 AM", type: "timetable" },
    { action: "Student Transferred",     actor: "Admin",                desc: "Arjun Singh transferred from 9th A to 9th B",    time: "26 Jun, 02:30 PM", type: "student" },
    { action: "Teacher Deactivated",     actor: "Admin",                desc: "Ms. Deepa Kulkarni account deactivated",          time: "25 Jun, 10:00 AM", type: "teacher" },
    { action: "Calendar Event Added",    actor: "Admin",                desc: "Parent-Teacher Meeting added for 12 Jul",         time: "24 Jun, 09:30 AM", type: "calendar" },
    { action: "Resource Approved",       actor: "Admin",                desc: "Science Lab Worksheets by Mrs. Sharma approved",  time: "23 Jun, 03:00 PM", type: "resource" },
  ];
  const actionTypes = ["All","Teacher","Student","Notice","Class","Report","Timetable","Calendar","Resource"];
  const typeIcon: Record<string, React.ElementType> = { teacher:Users, student:GraduationCap, notice:Megaphone, class:BookOpen, report:FileText, timetable:CalendarDays, calendar:Calendar, resource:FolderOpen };
  const typeColor: Record<string, string> = { teacher:"bg-emerald-100 text-emerald-600", student:"bg-blue-100 text-blue-600", notice:"bg-amber-100 text-amber-600", class:"bg-violet-100 text-violet-600", report:"bg-gray-100 text-gray-600", timetable:"bg-teal-100 text-teal-600", calendar:"bg-indigo-100 text-indigo-600", resource:"bg-orange-100 text-orange-600" };

  const filtered = logs.filter(l =>
    (actionFilter === "All" || l.type === actionFilter.toLowerCase()) &&
    (search === "" || l.desc.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <PageWrap>
      <div className="flex items-center justify-between mb-5">
        <div><H1>Activity Logs</H1><p className="text-sm text-muted-foreground mt-1">Complete audit trail of all administrative actions.</p></div>
        <div className="relative"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search logs…" className="pl-9 pr-3 py-2 bg-card border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 w-48" /></div>
      </div>
      <div className="flex gap-1.5 flex-wrap mb-5">
        {actionTypes.map(t => <button key={t} onClick={() => setActionFilter(t)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${actionFilter === t ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{t}</button>)}
      </div>
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm divide-y divide-border">
        {filtered.map((l, i) => {
          const Icon = typeIcon[l.type] ?? FileText;
          return (
            <div key={i} className="flex items-start gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${typeColor[l.type] ?? "bg-muted text-muted-foreground"}`}><Icon size={14} /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{l.action}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{l.desc}</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">{l.time}</span>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-muted-foreground"><ClipboardList size={28} className="mx-auto mb-2 opacity-20" /><p className="text-sm">No logs found</p></div>
        )}
      </div>
    </PageWrap>
  );
}

// ── Admin Settings ────────────────────────────────────────────────────────────

function AdminSettingsScreen({ userName }: { userName: string }) {
  const [notifs, setNotifs] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState("English");
  const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`relative w-11 h-6 rounded-full transition-colors ${on ? "bg-primary" : "bg-muted"}`}>
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
  return (
    <PageWrap>
      <H1>Settings</H1>
      <p className="text-sm text-muted-foreground mt-1 mb-6">Manage your admin profile and preferences.</p>
      <div className="max-w-xl space-y-4">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Admin Profile</h3>
          <div className="space-y-2">
            {[["Name",userName],["Admin ID","ADM-2024-001"],["Role","Secondary Section Admin"],["Assigned Section","Grade 6–10"],["Department","Academic Management"],["Institution","Sunrise International School"]].map(([k,v],i) => (
              <div key={i} className="flex justify-between py-1.5 border-b border-border last:border-0">
                <span className="text-xs text-muted-foreground">{k}</span>
                <span className="text-xs font-medium text-foreground">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Preferences</h3>
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-semibold text-foreground">Notifications</p><p className="text-xs text-muted-foreground">Teacher requests, notices, and system alerts</p></div>
            <Toggle on={notifs} onChange={() => setNotifs(o => !o)} />
          </div>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div><p className="text-sm font-semibold text-foreground">Dark Mode</p></div>
            <Toggle on={darkMode} onChange={() => setDarkMode(o => !o)} />
          </div>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div><p className="text-sm font-semibold text-foreground">Language</p></div>
            <div className="relative">
              <select value={lang} onChange={e => setLang(e.target.value)} className="appearance-none bg-muted border border-border rounded-xl px-3 py-1.5 pr-7 text-sm font-medium text-foreground focus:outline-none cursor-pointer">
                {["English","Hindi","Marathi"].map(l => <option key={l}>{l}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Security</h3>
          <button className="px-4 py-2 bg-muted text-muted-foreground rounded-xl text-sm font-semibold hover:bg-muted/80 transition-colors">Change Password</button>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">About</h3>
          <div className="space-y-1.5 text-sm">
            {[["Version","1.0.0"],["Role","Admin"],["Section","Secondary · Grade 6–10"],["Institution","Sunrise International School"]].map(([k,v],i) => (
              <div key={i} className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-semibold text-foreground">{v}</span></div>
            ))}
          </div>
        </div>
      </div>
    </PageWrap>
  );
}

// ─── Admin Dashboard Router ────────────────────────────────────────────────────

function AdminDashboard({
  userName, screen, onNavigate,
}: {
  userName: string; screen: AdminScreen; onNavigate: (s: AdminScreen) => void;
}) {
  switch (screen) {
    case "teacher-management":  return <TeacherManagementScreen />;
    case "class-management":    return <ClassManagementScreen />;
    case "student-management":  return <AdminStudentManagementScreen />;
    case "teacher-monitoring":  return <TeacherMonitoringScreen />;
    case "student-monitoring":  return <StudentMonitoringScreen />;
    case "timetable":           return <AdminTimetableScreen />;
    case "calendar":            return <AcademicCalendarScreen />;
    case "notice-management":   return <AdminNoticeMgmtScreen />;
    case "reports":             return <AdminReportsScreen />;
    case "communication":       return <AdminCommunicationScreen />;
    case "resource-monitoring": return <ResourceMonitoringScreen />;
    case "activity-logs":       return <ActivityLogsScreen />;
    case "settings":            return <AdminSettingsScreen userName={userName} />;
    default:                    return <AdminHome userName={userName} onNavigate={onNavigate} />;
  }
}

export { AdminSideMenu, AdminProfilePopup, AdminDashboard };
