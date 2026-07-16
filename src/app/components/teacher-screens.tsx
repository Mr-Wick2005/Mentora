import { useState } from "react";
import {
  X, ChevronLeft, ChevronRight, ChevronDown, BookMarked, GraduationCap,
  BookOpen, Shield, ArrowRight, Home, Settings, BookText, CheckSquare,
  Trophy, Library, Download, BarChart3, Users, PlusCircle, Search,
  Clock, CircleCheck, Lock, FileDown, Save, AlertCircle, FilePlus,
  Megaphone, FlaskConical, Calendar, CalendarDays, Layers, Upload,
  Send, UserCheck, PieChart, Table, TrendingUp, FileText, Pencil,
  Bot, Eraser, Star, RefreshCw, ClipboardList,
} from "lucide-react";
import { NotebookEditorPanel } from "./notebook-editor";
import type { TeacherScreen } from "./types";

export type { TeacherScreen };

// ─── Teacher Data ─────────────────────────────────────────────────────────────

const T_CLASSES = [
  { grade: "9th Grade", section: "A", students: 35, subjects: ["Mathematics", "Science"], dot: "bg-violet-500", color: "border-violet-200" },
  { grade: "6th Grade", section: "B", students: 28, subjects: ["Science", "Social Science"], dot: "bg-emerald-500", color: "border-emerald-200" },
  { grade: "5th Grade", section: "A", students: 32, subjects: ["English", "Mathematics"], dot: "bg-blue-500", color: "border-blue-200" },
];

const T_STUDENTS = [
  { name: "Aaravi Sharma",   roll: "01", attendance: 92, hw: "Completed",  assign: "Submitted", score: 88, risk: "low" },
  { name: "Rohan Mehta",     roll: "02", attendance: 78, hw: "Pending",    assign: "Pending",   score: 64, risk: "medium" },
  { name: "Priya Patel",     roll: "03", attendance: 95, hw: "Completed",  assign: "Submitted", score: 94, risk: "low" },
  { name: "Arjun Singh",     roll: "04", attendance: 60, hw: "Missing",    assign: "Missing",   score: 51, risk: "high" },
  { name: "Sneha Joshi",     roll: "05", attendance: 88, hw: "Completed",  assign: "Submitted", score: 79, risk: "low" },
  { name: "Karan Verma",     roll: "06", attendance: 73, hw: "Pending",    assign: "Submitted", score: 68, risk: "medium" },
  { name: "Tanvi Kulkarni",  roll: "07", attendance: 97, hw: "Completed",  assign: "Submitted", score: 96, risk: "low" },
  { name: "Dev Nair",        roll: "08", attendance: 55, hw: "Missing",    assign: "Missing",   score: 45, risk: "high" },
];

const RISK_COLOR: Record<string, string> = { low: "bg-emerald-500", medium: "bg-amber-400", high: "bg-red-500" };

// ─── Teacher Side Menu ────────────────────────────────────────────────────────

function TeacherSideMenu({ open, activeScreen, onNavigate, onClose }: {
  open: boolean; activeScreen: TeacherScreen;
  onNavigate: (s: TeacherScreen) => void; onClose: () => void;
}) {
  const sections: { title: string; items: { id: TeacherScreen; label: string; icon: React.ElementType }[] }[] = [
    { title: "Teaching", items: [
      { id: "timetable",      label: "Timetable & Calendar", icon: CalendarDays },
      { id: "lesson-planner", label: "Lesson Planner",       icon: Layers },
    ]},
    { title: "Content", items: [
      { id: "smart-notes",    label: "Smart Notes",          icon: BookText },
      { id: "library",        label: "Digital Library",      icon: Library },
    ]},
    { title: "Assessments", items: [
      { id: "homework",       label: "Homework",             icon: BookOpen },
      { id: "assignments",    label: "Assignments",          icon: FileText },
      { id: "tests",          label: "Tests & Exams",        icon: FlaskConical },
      { id: "gradebook",      label: "Gradebook",            icon: Table },
    ]},
    { title: "Insights", items: [
      { id: "student-analytics", label: "Student Analytics", icon: PieChart },
      { id: "reports",           label: "Reports",           icon: BarChart3 },
    ]},
    { title: "Communication", items: [
      { id: "communication",  label: "Communication",        icon: Send },
      { id: "notice-board",   label: "Notice Board",         icon: Megaphone },
    ]},
  ];

  const nav = (s: TeacherScreen) => { onNavigate(s); onClose(); };

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/20 z-20 backdrop-blur-[1px]" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-30 flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 border-b border-border flex items-center justify-between" style={{ height: 52 }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center"><BookOpen size={13} className="text-white" /></div>
            <span className="text-sm font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Teacher Portal</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><X size={15} className="text-foreground/50" /></button>
        </div>

        {/* My Classes block */}
        <div className="mx-3 mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
          <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-2">My Classes</p>
          <div className="space-y-1">
            {T_CLASSES.map((c, i) => (
              <button key={i} onClick={() => nav("my-classes")}
                className="w-full flex items-center gap-2 hover:bg-emerald-100 rounded-lg px-1.5 py-1 transition-colors text-left">
                <div className={`w-2 h-2 rounded-full ${c.dot} shrink-0`} />
                <span className="text-xs font-semibold text-foreground">{c.grade} — {c.section}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-3 mt-2">
          <button onClick={() => nav("dashboard")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeScreen === "dashboard" ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted hover:text-foreground"}`}>
            <Home size={15} />Dashboard
          </button>
          <button onClick={() => nav("my-classes")}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${["my-classes","class-detail","attendance"].includes(activeScreen) ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted hover:text-foreground"}`}>
            <GraduationCap size={15} />My Classes
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

// ─── Teacher Profile Popup ────────────────────────────────────────────────────

function TeacherProfilePopup({ open, userName, onClose, onLogout }: {
  open: boolean; userName: string; onClose: () => void; onLogout: () => void;
}) {
  if (!open) return null;
  const fields = [
    { label: "Teacher Name",     value: userName },
    { label: "Teacher ID",       value: "TCH-2024-042" },
    { label: "Role",             value: "Class Teacher" },
    { label: "Assigned Classes", value: "5th A, 6th B, 9th A" },
    { label: "Department",       value: "Science & Mathematics" },
    { label: "Experience",       value: "8 Years" },
    { label: "Qualification",    value: "M.Sc., B.Ed." },
    { label: "School",           value: "Sunrise International School" },
    { label: "Email",            value: "teacher@example.com" },
    { label: "Contact",          value: "+91 98765 11223" },
  ];
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-14 right-4 z-50 w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 px-5 py-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-lg font-bold">{userName.charAt(0).toUpperCase()}</div>
          <div>
            <div className="text-white font-bold text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{userName}</div>
            <div className="text-white/70 text-xs">Class Teacher · Science Dept.</div>
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

// ─── Teacher Screens ──────────────────────────────────────────────────────────

// helpers
const H1 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-extrabold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{children}</h2>
);
const PageWrap = ({ children }: { children: React.ReactNode }) => (
  <div className="flex-1 overflow-y-auto hide-scrollbar p-6"><div className="max-w-5xl mx-auto">{children}</div></div>
);

// ── Teacher Home ──────────────────────────────────────────────────────────────

function TeacherHome({ userName, onNavigate }: { userName: string; onNavigate: (s: TeacherScreen) => void }) {
  const schedule = [
    { time: "09:00", subject: "Mathematics", grade: "9th A", room: "Room 12", status: "now" },
    { time: "10:30", subject: "Science",     grade: "6th B", room: "Lab 2",   status: "next" },
    { time: "12:00", subject: "Mathematics", grade: "5th A", room: "Room 7",  status: "upcoming" },
    { time: "14:00", subject: "Science",     grade: "9th A", room: "Lab 1",   status: "upcoming" },
  ];
  const quickActions = [
    { label: "Start Class",       icon: BookOpen,    screen: "my-classes" as TeacherScreen,   color: "bg-blue-50 text-blue-700 border-blue-200" },
    { label: "Take Attendance",   icon: UserCheck,   screen: "attendance" as TeacherScreen,   color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { label: "Upload Notes",      icon: Upload,      screen: "smart-notes" as TeacherScreen,  color: "bg-violet-50 text-violet-700 border-violet-200" },
    { label: "Create Assignment", icon: FilePlus,    screen: "assignments" as TeacherScreen,  color: "bg-amber-50 text-amber-700 border-amber-200" },
    { label: "Create Test",       icon: FlaskConical,screen: "tests" as TeacherScreen,        color: "bg-red-50 text-red-700 border-red-200" },
    { label: "Send Announcement", icon: Send,        screen: "communication" as TeacherScreen,color: "bg-teal-50 text-teal-700 border-teal-200" },
  ];
  const pending = [
    { label: "Homework Reviews",   count: 3, color: "bg-amber-100 text-amber-700" },
    { label: "Assignment Grading", count: 7, color: "bg-red-100 text-red-600" },
    { label: "Student Questions",  count: 5, color: "bg-blue-100 text-blue-700" },
  ];
  const firstName = userName.split(" ")[0];

  return (
    <PageWrap>
      {/* Greeting */}
      <div className="mb-6">
        <H1>Good Morning, {firstName}! 📚</H1>
        <p className="text-muted-foreground mt-1 text-sm">Class Teacher — 9th A &nbsp;·&nbsp; Science & Mathematics</p>
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-6">
        <div className="space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Students", val: "95",  icon: GraduationCap, color: "bg-blue-50 text-blue-600" },
              { label: "Classes Today",  val: "4",   icon: BookOpen,      color: "bg-emerald-50 text-emerald-600" },
              { label: "Pending Tasks",  val: "15",  icon: ClipboardList, color: "bg-amber-50 text-amber-600" },
            ].map((s, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center shrink-0`}><s.icon size={18} /></div>
                <div>
                  <div className="text-xl font-extrabold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.val}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Today's Schedule */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Today&apos;s Schedule</h3>
              <button onClick={() => onNavigate("timetable")} className="text-xs text-primary font-semibold hover:underline">Full Timetable →</button>
            </div>
            <div className="space-y-2">
              {schedule.map((s, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${s.status === "now" ? "bg-primary/5 border-primary/20" : "border-border hover:bg-muted/40"}`}>
                  <div className="text-xs font-bold text-muted-foreground w-12 shrink-0">{s.time}</div>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${s.status === "now" ? "bg-primary animate-pulse" : s.status === "next" ? "bg-amber-400" : "bg-muted-foreground/30"}`} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{s.subject}</p>
                    <p className="text-xs text-muted-foreground">{s.grade} · {s.room}</p>
                  </div>
                  {s.status === "now" && <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full">NOW</span>}
                  {s.status === "next" && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">NEXT</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Quick Actions</h3>
            <div className="grid grid-cols-3 gap-2.5">
              {quickActions.map((a, i) => (
                <button key={i} onClick={() => onNavigate(a.screen)}
                  className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border text-center hover:-translate-y-0.5 hover:shadow-sm transition-all ${a.color}`}>
                  <a.icon size={18} />
                  <span className="text-xs font-semibold leading-tight">{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Pending */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Pending Reviews</h3>
            {pending.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-xs text-foreground">{p.label}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.color}`}>{p.count}</span>
              </div>
            ))}
          </div>

          {/* AI Recommendations */}
          <div className="bg-gradient-to-br from-primary/5 to-indigo-50 border border-primary/15 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Bot size={14} className="text-primary" />
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">AI Recommendations</h3>
            </div>
            <div className="space-y-2">
              {[
                "3 students in 9th A are falling behind in Mathematics — consider a revision session.",
                "Rohan Mehta's attendance has dropped to 78%. Consider a parent communication.",
              ].map((r, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <p className="text-xs text-foreground/80 leading-relaxed">{r}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent notices */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Recent Notices</h3>
            {[
              { title: "PTM scheduled for 12 Jul", tag: "Parents" },
              { title: "Unit Test 2 — 02 Jul", tag: "Exam" },
            ].map((n, i) => (
              <div key={i} className="py-2 border-b border-border last:border-0">
                <p className="text-xs font-semibold text-foreground">{n.title}</p>
                <span className="text-[10px] text-muted-foreground">{n.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrap>
  );
}

// ── My Classes ────────────────────────────────────────────────────────────────

function MyClassesScreen({ onSelectClass, onNavigate }: {
  onSelectClass: (g: string) => void; onNavigate: (s: TeacherScreen) => void;
}) {
  return (
    <PageWrap>
      <H1>My Classes</H1>
      <p className="text-sm text-muted-foreground mt-1 mb-6">Select a class to view students, attendance, and progress.</p>
      <div className="grid grid-cols-3 gap-5">
        {T_CLASSES.map((c, i) => (
          <div key={i} className={`bg-card border-2 ${c.color} rounded-2xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer`}
            onClick={() => { onSelectClass(c.grade + " " + c.section); onNavigate("class-detail"); }}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-3 h-3 rounded-full ${c.dot}`} />
              <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{c.grade} — {c.section}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{c.students} students enrolled</p>
            <div className="flex flex-wrap gap-1.5 mb-4">{c.subjects.map((s, j) => <span key={j} className="text-[11px] bg-muted px-2.5 py-1 rounded-full text-foreground/70">{s}</span>)}</div>
            <div className="grid grid-cols-2 gap-2 mb-4 text-center">
              <div className="bg-muted rounded-xl p-2"><p className="text-sm font-bold text-foreground">93%</p><p className="text-[10px] text-muted-foreground">Attendance</p></div>
              <div className="bg-muted rounded-xl p-2"><p className="text-sm font-bold text-foreground">78%</p><p className="text-[10px] text-muted-foreground">HW Rate</p></div>
            </div>
            <button className="w-full py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5">
              Open Class <ArrowRight size={13} />
            </button>
          </div>
        ))}
      </div>
    </PageWrap>
  );
}

// ── Class Detail ──────────────────────────────────────────────────────────────

function ClassDetailScreen({ selectedClass, onNavigate }: { selectedClass: string; onNavigate: (s: TeacherScreen) => void }) {
  const [tab, setTab] = useState<"overview"|"students"|"attendance"|"progress">("overview");
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState<Record<string, string>>(
    Object.fromEntries(T_STUDENTS.map(s => [s.roll, "present"]))
  );

  const filtered = T_STUDENTS.filter(s => search === "" || s.name.toLowerCase().includes(search.toLowerCase()));

  const tabBtn = (id: typeof tab, label: string) => (
    <button onClick={() => setTab(id)}
      className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${tab === id ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
      {label}
    </button>
  );

  return (
    <PageWrap>
      <button onClick={() => onNavigate("my-classes")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
        <ChevronLeft size={15} /> My Classes
      </button>
      <div className="flex items-center justify-between mb-5">
        <H1>{selectedClass || "Class Detail"}</H1>
        <button onClick={() => onNavigate("attendance")}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
          <UserCheck size={15} /> Take Attendance
        </button>
      </div>
      <div className="flex gap-2 mb-5">{tabBtn("overview","Overview")}{tabBtn("students","Students")}{tabBtn("attendance","Attendance")}{tabBtn("progress","Progress")}</div>

      {tab === "overview" && (
        <div className="grid grid-cols-4 gap-4 mb-5">
          {[
            { label: "Total Students", val: "35",  color: "bg-blue-50 text-blue-700" },
            { label: "Avg Attendance", val: "87%", color: "bg-emerald-50 text-emerald-700" },
            { label: "HW Completed",   val: "72%", color: "bg-amber-50 text-amber-700" },
            { label: "Top Score",       val: "96%", color: "bg-violet-50 text-violet-700" },
          ].map((s, i) => (
            <div key={i} className={`${s.color} border rounded-2xl p-4 text-center shadow-sm`}>
              <p className="text-2xl font-extrabold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.val}</p>
              <p className="text-xs mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {(tab === "students" || tab === "overview") && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {tab === "students" && (
            <div className="p-3 border-b border-border flex items-center gap-2">
              <Search size={14} className="text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students…"
                className="flex-1 bg-transparent text-sm focus:outline-none text-foreground placeholder:text-muted-foreground/50" />
            </div>
          )}
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/30">
              {["Roll","Name","Attendance","Homework","Assignment","Score","Risk"].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {(tab === "overview" ? T_STUDENTS.slice(0,5) : filtered).map((s, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-xs font-bold text-muted-foreground">{s.roll}</td>
                  <td className="px-4 py-3 font-semibold text-foreground">{s.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${s.attendance >= 85 ? "bg-emerald-500" : s.attendance >= 70 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${s.attendance}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{s.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.hw === "Completed" ? "bg-emerald-100 text-emerald-700" : s.hw === "Pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>{s.hw}</span></td>
                  <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.assign === "Submitted" ? "bg-emerald-100 text-emerald-700" : s.assign === "Pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>{s.assign}</span></td>
                  <td className="px-4 py-3 font-semibold text-foreground">{s.score}%</td>
                  <td className="px-4 py-3"><div className={`w-2.5 h-2.5 rounded-full ${RISK_COLOR[s.risk]}`} title={s.risk} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "attendance" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Mark attendance for today — {new Date().toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })}</p>
            <button onClick={() => setAttendance(Object.fromEntries(T_STUDENTS.map(s => [s.roll, "present"])))}
              className="text-xs text-primary font-semibold hover:underline">Mark All Present</button>
          </div>
          {T_STUDENTS.map(s => (
            <div key={s.roll} className="bg-card border border-border rounded-xl p-3.5 flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">{s.roll}</div>
              <p className="text-sm font-semibold text-foreground flex-1">{s.name}</p>
              {(["present","absent","late","leave"] as const).map(status => (
                <button key={status} onClick={() => setAttendance(p => ({ ...p, [s.roll]: status }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${attendance[s.roll] === status
                    ? status === "present" ? "bg-emerald-500 text-white" : status === "absent" ? "bg-red-500 text-white" : status === "late" ? "bg-amber-400 text-white" : "bg-blue-400 text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                  {status}
                </button>
              ))}
            </div>
          ))}
          <button className="w-full mt-2 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <Save size={15} /> Save Attendance
          </button>
        </div>
      )}

      {tab === "progress" && (
        <div className="grid grid-cols-2 gap-4">
          {T_STUDENTS.slice(0, 6).map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{s.roll}</div>
                <div><p className="text-sm font-semibold text-foreground">{s.name}</p><p className="text-[10px] text-muted-foreground">AI Score: {s.score}</p></div>
                <div className={`ml-auto w-2.5 h-2.5 rounded-full ${RISK_COLOR[s.risk]}`} />
              </div>
              {["Maths","Science","English"].map((subj, j) => {
                const pct = Math.max(40, Math.min(99, s.score + (j === 0 ? 0 : j === 1 ? -8 : 5)));
                return (
                  <div key={j} className="mb-1.5">
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5"><span>{subj}</span><span>{pct}%</span></div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className={`h-full rounded-full ${pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </PageWrap>
  );
}

// ── Attendance ────────────────────────────────────────────────────────────────

function AttendanceScreen() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [cls, setCls] = useState("9th Grade A");
  const [att, setAtt] = useState<Record<string, string>>(Object.fromEntries(T_STUDENTS.map(s => [s.roll, "present"])));
  const [tab, setTab] = useState<"mark"|"history">("mark");

  const counts = { present: Object.values(att).filter(v => v === "present").length, absent: Object.values(att).filter(v => v === "absent").length, late: Object.values(att).filter(v => v === "late").length };

  return (
    <PageWrap>
      <H1>Attendance Management</H1>
      <p className="text-sm text-muted-foreground mt-1 mb-5">Record and track student attendance efficiently.</p>

      <div className="flex gap-2 mb-5">
        {(["mark","history"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-colors ${tab === t ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {t === "mark" ? "Mark Attendance" : "History"}
          </button>
        ))}
      </div>

      {tab === "mark" && (
        <>
          <div className="flex gap-4 mb-5">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-muted-foreground">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-muted-foreground">Class</label>
              <select value={cls} onChange={e => setCls(e.target.value)}
                className="border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none cursor-pointer">
                {T_CLASSES.map(c => <option key={c.grade}>{c.grade} {c.section}</option>)}
              </select>
            </div>
            <button onClick={() => setAtt(Object.fromEntries(T_STUDENTS.map(s => [s.roll, "present"])))}
              className="ml-auto px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors">
              Mark All Present
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { label: "Present", val: counts.present, color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
              { label: "Absent",  val: counts.absent,  color: "bg-red-50 border-red-200 text-red-600" },
              { label: "Late",    val: counts.late,    color: "bg-amber-50 border-amber-200 text-amber-700" },
              { label: "Total",   val: T_STUDENTS.length, color: "bg-muted border-border text-foreground" },
            ].map((s, i) => (
              <div key={i} className={`border rounded-xl p-3 text-center shadow-sm ${s.color}`}>
                <p className="text-xl font-extrabold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.val}</p>
                <p className="text-xs font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2.5">
            {T_STUDENTS.map(s => (
              <div key={s.roll} className="bg-card border border-border rounded-xl p-3.5 flex items-center gap-4 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">{s.roll}</div>
                <p className="text-sm font-semibold text-foreground flex-1">{s.name}</p>
                <div className="flex gap-1.5">
                  {(["present","absent","late","leave"] as const).map(status => (
                    <button key={status} onClick={() => setAtt(p => ({ ...p, [s.roll]: status }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${att[s.roll] === status
                        ? status === "present" ? "bg-emerald-500 text-white" : status === "absent" ? "bg-red-500 text-white" : status === "late" ? "bg-amber-400 text-white" : "bg-blue-400 text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <Save size={15} /> Save Attendance Record
          </button>
        </>
      )}

      {tab === "history" && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/30">
              {["Date","Class","Present","Absent","Late","Attendance %"].map(h => <th key={h} className="text-left px-5 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>)}
            </tr></thead>
            <tbody>
              {[
                { date: "28 Jun", cls: "9th A", p: 33, a: 1, l: 1, pct: 94 },
                { date: "27 Jun", cls: "9th A", p: 30, a: 3, l: 2, pct: 86 },
                { date: "26 Jun", cls: "9th A", p: 35, a: 0, l: 0, pct: 100 },
                { date: "25 Jun", cls: "6th B", p: 25, a: 2, l: 1, pct: 89 },
              ].map((r, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-5 py-3 text-muted-foreground">{r.date} 2025</td>
                  <td className="px-5 py-3 font-semibold text-foreground">{r.cls}</td>
                  <td className="px-5 py-3 text-emerald-600 font-semibold">{r.p}</td>
                  <td className="px-5 py-3 text-red-500 font-semibold">{r.a}</td>
                  <td className="px-5 py-3 text-amber-600 font-semibold">{r.l}</td>
                  <td className="px-5 py-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${r.pct >= 90 ? "bg-emerald-100 text-emerald-700" : r.pct >= 75 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>{r.pct}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageWrap>
  );
}

// ── Timetable & Calendar ──────────────────────────────────────────────────────

function TimetableScreen() {
  const days = ["Mon","Tue","Wed","Thu","Fri"];
  const periods = ["09:00","10:30","12:00","14:00","15:30"];
  const grid: Record<string, Record<string, string>> = {
    "09:00": { Mon: "Math 9A",    Tue: "Science 6B", Wed: "Math 5A",    Thu: "Science 9A", Fri: "Math 9A" },
    "10:30": { Mon: "Science 9A", Tue: "Math 9A",    Wed: "Science 6B", Thu: "Math 6B",    Fri: "Science 5A" },
    "12:00": { Mon: "Free",       Tue: "Science 5A", Wed: "Math 9A",    Thu: "Free",        Fri: "Lab 9A" },
    "14:00": { Mon: "Lab 6B",     Tue: "Free",       Wed: "Lab 9A",     Thu: "Science 6B", Fri: "Free" },
    "15:30": { Mon: "Math 6B",    Tue: "Lab 5A",     Wed: "Free",       Thu: "Math 5A",    Fri: "Science 9A" },
  };
  const events = [
    { date: "02 Jul", title: "Unit Test 2 — Mathematics",     type: "exam",     color: "bg-red-100 text-red-700" },
    { date: "05 Jul", title: "Class Test — Science",          type: "exam",     color: "bg-red-100 text-red-700" },
    { date: "07 Jul", title: "Eid Al-Adha Holiday",           type: "holiday",  color: "bg-amber-100 text-amber-700" },
    { date: "12 Jul", title: "Parent-Teacher Meeting",        type: "meeting",  color: "bg-blue-100 text-blue-700" },
    { date: "15 Jul", title: "Annual Science Exhibition",     type: "event",    color: "bg-emerald-100 text-emerald-700" },
    { date: "20 Jul", title: "Mid-Term Examinations Begin",   type: "exam",     color: "bg-red-100 text-red-700" },
  ];
  const today = new Date().getDay(); // 0=Sun

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar p-6">
      <div className="max-w-6xl mx-auto">
        <H1>Timetable &amp; Calendar</H1>
        <p className="text-sm text-muted-foreground mt-1 mb-6">Your weekly schedule and upcoming academic events.</p>

        <div className="grid grid-cols-[1fr_280px] gap-6">
          {/* Left — Timetable */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3 border-b border-border bg-muted/30">
              <h3 className="text-sm font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Weekly Timetable</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-2.5 text-muted-foreground font-semibold w-16">Period</th>
                    {days.map((d, i) => (
                      <th key={d} className={`px-3 py-2.5 font-bold text-center ${i + 1 === today ? "text-primary" : "text-muted-foreground"}`}>{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {periods.map((p, pi) => (
                    <tr key={p} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 text-muted-foreground font-mono text-[10px]">{p}</td>
                      {days.map((d, di) => {
                        const cell = grid[p]?.[d] || "—";
                        const isActive = di + 1 === today;
                        const isFree = cell === "Free";
                        return (
                          <td key={d} className={`px-3 py-3 text-center ${isActive ? "bg-primary/5" : ""}`}>
                            <span className={`text-[11px] font-semibold ${isFree ? "text-muted-foreground/50" : "text-foreground"}`}>{cell}</span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right — Calendar events */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-foreground mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Upcoming Events</h3>
              <div className="space-y-2.5">
                {events.map((e, i) => (
                  <div key={i} className={`flex items-start gap-3 p-2.5 rounded-xl ${e.color}`}>
                    <div className="text-center shrink-0 w-10">
                      <p className="text-[10px] font-bold leading-tight">{e.date.split(" ")[0]}</p>
                      <p className="text-[9px] leading-tight">{e.date.split(" ")[1]}</p>
                    </div>
                    <p className="text-xs font-semibold flex-1 leading-snug">{e.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Lesson Planner ────────────────────────────────────────────────────────────

function LessonPlannerScreen() {
  const [tab, setTab] = useState<"weekly"|"chapter">("weekly");
  const plans = [
    { day: "Mon 30 Jun", subject: "Mathematics", grade: "9th A", topic: "Quadratic Equations — Introduction", objectives: "Understand standard form ax²+bx+c=0", hw: "Ex 4.1 Q1–5", status: "planned" },
    { day: "Tue 01 Jul", subject: "Science",     grade: "6th B", topic: "Metals and Non-metals",              objectives: "Differentiate physical & chemical properties", hw: "Lab diagram",   status: "planned" },
    { day: "Wed 02 Jul", subject: "Mathematics", grade: "9th A", topic: "Unit Test 2",                        objectives: "Assessment — Ch 3 & 4",                hw: "—",           status: "test" },
    { day: "Thu 03 Jul", subject: "Science",     grade: "9th A", topic: "Life Processes — Revision",         objectives: "Review all 4 life processes",           hw: "Summary notes", status: "revision" },
  ];
  const statusColor: Record<string, string> = { planned: "bg-blue-100 text-blue-700", test: "bg-red-100 text-red-600", revision: "bg-amber-100 text-amber-700" };
  return (
    <PageWrap>
      <div className="flex items-center justify-between mb-5">
        <div><H1>Lesson Planner</H1><p className="text-sm text-muted-foreground mt-1">Plan and track your lessons, objectives, and homework.</p></div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
          <FilePlus size={15} /> Add Lesson
        </button>
      </div>
      <div className="flex gap-2 mb-5">
        {(["weekly","chapter"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-colors ${tab === t ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {t === "weekly" ? "Weekly View" : "Chapter View"}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {plans.map((p, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-muted-foreground">{p.day}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[p.status]}`}>{p.status}</span>
                </div>
                <h3 className="text-base font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{p.topic}</h3>
                <p className="text-xs text-muted-foreground">{p.subject} · {p.grade}</p>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-muted transition-colors"><Pencil size={13} className="text-muted-foreground" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/40 rounded-xl p-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Learning Objectives</p>
                <p className="text-xs text-foreground">{p.objectives}</p>
              </div>
              <div className="bg-muted/40 rounded-xl p-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Homework Plan</p>
                <p className="text-xs text-foreground">{p.hw}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageWrap>
  );
}

// ── Smart Notes ───────────────────────────────────────────────────────────────

function SmartNotesScreen({ notebookNotes, onNotesChange }: {
  notebookNotes: Record<string, string>; onNotesChange: (k: string, v: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const notes = [
    { key: "tnote-math-quad",  title: "Quadratic Equations — Notes",    subject: "Mathematics", date: "28 Jun", shared: true },
    { key: "tnote-sci-metals", title: "Metals & Non-metals — Summary",   subject: "Science",     date: "26 Jun", shared: false },
    { key: "tnote-eng-prose",  title: "English Prose Teaching Notes",    subject: "English",     date: "24 Jun", shared: true },
  ];
  const active = notes.find(n => n.key === selected);
  return (
    <div className="flex-1 flex overflow-hidden">
      {/* List */}
      <div className="w-64 shrink-0 border-r border-border flex flex-col bg-white">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Smart Notes</h3>
          <button className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
            <FilePlus size={14} className="text-primary" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto hide-scrollbar p-2 space-y-1">
          {notes.map(n => (
            <button key={n.key} onClick={() => setSelected(n.key)}
              className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors ${selected === n.key ? "bg-primary/10 border border-primary/20" : "hover:bg-muted border border-transparent"}`}>
              <p className="text-xs font-semibold text-foreground truncate">{n.title}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-muted-foreground">{n.subject}</span>
                {n.shared && <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 rounded-full font-bold">Shared</span>}
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        {active ? (
          <NotebookEditorPanel
            chapterKey={active.key}
            subject={active.subject}
            chapterName={active.title}
            initialContent={notebookNotes[active.key] || ""}
            onContentChange={onNotesChange}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground h-full">
            <div className="text-center"><BookText size={36} className="mx-auto mb-3 opacity-20" /><p className="text-sm">Select a note to edit</p></div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Teacher Library ───────────────────────────────────────────────────────────

function TeacherLibraryScreen() {
  const lib: Record<string, { title: string; type: string }[]> = {
    Mathematics:    [{ title: "NCERT Textbook",        type: "Textbook" },    { title: "Teacher Manual",      type: "Manual" },      { title: "Question Bank",       type: "Question Bank" }],
    Science:        [{ title: "NCERT Science",         type: "Textbook" },    { title: "Lab Manual",          type: "Lab Manual" },   { title: "Previous Year Papers",type: "Past Papers" }],
    English:        [{ title: "First Flight",          type: "Textbook" },    { title: "Grammar Reference",   type: "Reference" },    { title: "Sample Papers",       type: "Sample Paper" }],
    "Social Science":[{ title: "NCERT History",        type: "Textbook" },    { title: "Map Practice",        type: "Workbook" },     { title: "Answer Key 2024",     type: "Answer Key" }],
  };
  const typeColor: Record<string, string> = { Textbook: "bg-blue-100 text-blue-700", Manual: "bg-violet-100 text-violet-700", "Question Bank": "bg-amber-100 text-amber-700", "Lab Manual": "bg-teal-100 text-teal-700", "Past Papers": "bg-red-100 text-red-600", Reference: "bg-pink-100 text-pink-700", "Sample Paper": "bg-purple-100 text-purple-700", "Answer Key": "bg-emerald-100 text-emerald-700", Workbook: "bg-orange-100 text-orange-700" };
  return (
    <PageWrap>
      <div className="flex items-center justify-between mb-6">
        <div><H1>Digital Library</H1><p className="text-sm text-muted-foreground mt-1">Textbooks, manuals, and resources organised by subject.</p></div>
        <button className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/20 transition-colors">
          <Upload size={14} /> Upload Resource
        </button>
      </div>
      {Object.entries(lib).map(([subj, items]) => (
        <div key={subj} className="mb-6">
          <h3 className="text-sm font-bold text-foreground mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{subj}</h3>
          <div className="grid grid-cols-3 gap-3">
            {items.map((b, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Library size={15} className="text-primary" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{b.title}</p>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-1 inline-block ${typeColor[b.type] ?? "bg-muted text-muted-foreground"}`}>{b.type}</span>
                  <button className="mt-1.5 block text-[10px] text-primary font-semibold hover:underline">Open</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </PageWrap>
  );
}

// ── Homework ──────────────────────────────────────────────────────────────────

function TeacherHomeworkScreen() {
  const [tab, setTab] = useState<"assigned"|"review"|"create">("assigned");
  const hw = [
    { title: "Exercise 4.1 Q1–5",        subject: "Mathematics", grade: "9th A", due: "30 Jun", submitted: "28/35", status: "open" },
    { title: "Lab Diagram — Metals",     subject: "Science",     grade: "6th B", due: "29 Jun", submitted: "25/28", status: "open" },
    { title: "Chapter 2 Summary Essay",  subject: "English",     grade: "5th A", due: "28 Jun", submitted: "32/32", status: "closed" },
  ];
  const pending = T_STUDENTS.slice(0,3).map(s => ({ ...s, submission: "Answered Ex 4.1 correctly. Showed full working." }));
  return (
    <PageWrap>
      <div className="flex items-center justify-between mb-5">
        <div><H1>Homework</H1><p className="text-sm text-muted-foreground mt-1">Create, assign, and review student homework.</p></div>
      </div>
      <div className="flex gap-2 mb-5">
        {(["assigned","review","create"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-colors ${tab === t ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {t === "assigned" ? "Assigned" : t === "review" ? "Pending Review" : "Create New"}
          </button>
        ))}
      </div>

      {tab === "assigned" && (
        <div className="space-y-3">
          {hw.map((h, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><BookOpen size={17} className="text-primary" /></div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div><h3 className="text-sm font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{h.title}</h3><p className="text-xs text-muted-foreground">{h.subject} · {h.grade} · Due: {h.due}</p></div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${h.status === "open" ? "bg-blue-100 text-blue-700" : "bg-muted text-muted-foreground"}`}>{h.status}</span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${Math.round(parseInt(h.submitted.split("/")[0])/parseInt(h.submitted.split("/")[1])*100)}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{h.submitted} submitted</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "review" && (
        <div className="space-y-3">
          {pending.map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{s.roll}</div>
                <p className="text-sm font-semibold text-foreground">{s.name}</p>
                <span className="ml-auto text-xs text-muted-foreground">Exercise 4.1</span>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 mb-3">
                <p className="text-xs text-foreground">{s.submission}</p>
              </div>
              <div className="flex gap-2">
                <input placeholder="Marks (e.g. 8/10)" className="flex-1 border border-border rounded-xl px-3 py-2 text-xs bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <input placeholder="Feedback…" className="flex-1 border border-border rounded-xl px-3 py-2 text-xs bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <button className="px-3 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity">Return</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "create" && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm max-w-xl">
          <h3 className="text-sm font-bold text-foreground mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>New Homework</h3>
          <div className="space-y-4">
            {[
              { label: "Title",       type: "text",     placeholder: "e.g. Exercise 4.2 Q1–8" },
              { label: "Description", type: "textarea", placeholder: "Instructions for students…" },
            ].map((f, i) => (
              <div key={i}>
                <label className="block text-xs font-semibold text-foreground mb-1.5">{f.label}</label>
                {f.type === "textarea"
                  ? <textarea placeholder={f.placeholder} rows={3} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                  : <input type="text" placeholder={f.placeholder} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                }
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Subject</label>
                <select className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-card focus:outline-none cursor-pointer">
                  {["Mathematics","Science","English","Social Science","Hindi"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Due Date</label>
                <input type="date" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <button className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">Assign Homework</button>
          </div>
        </div>
      )}
    </PageWrap>
  );
}

// ── Assignments ───────────────────────────────────────────────────────────────

function TeacherAssignmentsScreen() {
  const assignments = [
    { title: "Science Model — Life Processes",  subject: "Science",     grade: "9th A", due: "05 Jul", max: 20, submitted: "30/35", status: "open" },
    { title: "Essay — Environmental Issues",    subject: "English",     grade: "5th A", due: "03 Jul", max: 15, submitted: "28/32", status: "open" },
    { title: "Algebra Project",                 subject: "Mathematics", grade: "6th B", due: "01 Jul", max: 25, submitted: "28/28", status: "grading" },
  ];
  return (
    <PageWrap>
      <div className="flex items-center justify-between mb-6">
        <div><H1>Assignments</H1><p className="text-sm text-muted-foreground mt-1">Create and grade assignments with rubrics and feedback.</p></div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
          <FilePlus size={15} /> New Assignment
        </button>
      </div>
      <div className="space-y-4">
        {assignments.map((a, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="text-base font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{a.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{a.subject} · {a.grade} · Max Marks: {a.max} · Due: {a.due}</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${a.status === "open" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>{a.status}</span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${Math.round(parseInt(a.submitted.split("/")[0])/parseInt(a.submitted.split("/")[1])*100)}%` }} />
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{a.submitted} submitted</span>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary/20 transition-colors">Review Submissions</button>
              <button className="px-4 py-2 bg-muted text-muted-foreground rounded-xl text-xs font-bold hover:bg-muted/80 transition-colors">View Rubric</button>
              <button className="px-4 py-2 bg-muted text-muted-foreground rounded-xl text-xs font-bold hover:bg-muted/80 transition-colors">Export Grades</button>
            </div>
          </div>
        ))}
      </div>
    </PageWrap>
  );
}

// ── Tests & Exams ─────────────────────────────────────────────────────────────

function TeacherTestsScreen() {
  const [tab, setTab] = useState<"upcoming"|"past"|"create">("upcoming");
  const upcoming = [
    { name: "Unit Test 2",  subject: "Mathematics", grade: "9th A", date: "02 Jul", time: "10:00", max: 50, syllabus: "Ch 3–4: Linear & Quadratic Equations", days: 3 },
    { name: "Class Quiz",   subject: "Science",     grade: "6th B", date: "30 Jun", time: "11:30", max: 20, syllabus: "Ch 3: Metals and Non-metals", days: 1 },
  ];
  const past = [
    { name: "Unit Test 1",  subject: "Mathematics", grade: "9th A", date: "10 Jun", avg: 82, high: 96, low: 48, total: 50 },
    { name: "Weekly Quiz",  subject: "Science",     grade: "6th B", date: "15 Jun", avg: 74, high: 95, low: 40, total: 20 },
    { name: "Surprise Test",subject: "English",     grade: "5th A", date: "18 Jun", avg: 78, high: 96, low: 52, total: 25 },
  ];
  return (
    <PageWrap>
      <div className="flex items-center justify-between mb-5">
        <div><H1>Tests &amp; Exams</H1><p className="text-sm text-muted-foreground mt-1">Schedule, create, and review assessments.</p></div>
      </div>
      <div className="flex gap-2 mb-5">
        {(["upcoming","past","create"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-colors ${tab === t ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {t === "upcoming" ? "Upcoming" : t === "past" ? "Past Results" : "Create Test"}
          </button>
        ))}
      </div>

      {tab === "upcoming" && (
        <div className="space-y-4">
          {upcoming.map((t, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div><h3 className="text-base font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.name}</h3><p className="text-xs text-muted-foreground">{t.subject} · {t.grade}</p></div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${t.days <= 1 ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"}`}>{t.days}d left</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground mt-3">
                <span className="flex items-center gap-1"><Calendar size={11} />{t.date}</span>
                <span className="flex items-center gap-1"><Clock size={11} />{t.time}</span>
                <span className="flex items-center gap-1"><FileText size={11} />{t.max} marks</span>
              </div>
              <div className="mt-3 p-2.5 bg-muted/50 rounded-xl"><p className="text-xs"><span className="font-semibold text-foreground">Syllabus:</span> {t.syllabus}</p></div>
            </div>
          ))}
        </div>
      )}

      {tab === "past" && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/30">
              {["Test","Subject","Grade","Date","Avg","Highest","Lowest","Total"].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>)}
            </tr></thead>
            <tbody>
              {past.map((t, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3.5 font-semibold text-foreground">{t.name}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">{t.subject}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">{t.grade}</td>
                  <td className="px-4 py-3.5 text-muted-foreground text-xs">{t.date}</td>
                  <td className="px-4 py-3.5 font-bold text-foreground">{t.avg}%</td>
                  <td className="px-4 py-3.5 text-emerald-600 font-semibold">{t.high}</td>
                  <td className="px-4 py-3.5 text-red-500 font-semibold">{t.low}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">{t.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "create" && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm max-w-2xl">
          <h3 className="text-sm font-bold text-foreground mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Create New Test</h3>
          <div className="grid grid-cols-2 gap-4">
            {[{ label:"Test Title", placeholder:"e.g. Unit Test 2" }, { label:"Subject", placeholder:"Mathematics" }].map((f,i) => (
              <div key={i}><label className="block text-xs font-semibold text-foreground mb-1.5">{f.label}</label><input placeholder={f.placeholder} className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
            ))}
            <div><label className="block text-xs font-semibold text-foreground mb-1.5">Test Type</label>
              <select className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-card focus:outline-none cursor-pointer">
                {["Unit Test","Chapter Test","Quiz","Mid-Term","Final Exam","Mock"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-semibold text-foreground mb-1.5">Class</label>
              <select className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-card focus:outline-none cursor-pointer">
                {T_CLASSES.map(c => <option key={c.grade}>{c.grade} {c.section}</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-semibold text-foreground mb-1.5">Date</label><input type="date" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
            <div><label className="block text-xs font-semibold text-foreground mb-1.5">Max Marks</label><input type="number" placeholder="50" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
          </div>
          <div className="mt-4"><label className="block text-xs font-semibold text-foreground mb-1.5">Syllabus</label><textarea rows={2} placeholder="Chapters / topics covered in this test…" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" /></div>
          <div className="mt-4 flex items-center gap-2 p-3 bg-primary/5 border border-primary/15 rounded-xl">
            <Bot size={15} className="text-primary shrink-0" />
            <p className="text-xs text-foreground flex-1">Use AI to automatically generate questions based on the syllabus.</p>
            <button className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:opacity-90 transition-opacity shrink-0">AI Generate</button>
          </div>
          <button className="w-full mt-4 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">Create Test</button>
        </div>
      )}
    </PageWrap>
  );
}

// ── Gradebook ─────────────────────────────────────────────────────────────────

function GradebookScreen() {
  const [cls, setCls] = useState("9th Grade A");
  const cols = ["HW1","HW2","A1","Test1","Test2","Practical","Total","Grade"];
  const gradeOf = (score: number) => score >= 90 ? "A+" : score >= 80 ? "A" : score >= 70 ? "B+" : score >= 60 ? "B" : score >= 50 ? "C" : "D";
  const gc = (g: string) => g.startsWith("A") ? "bg-emerald-100 text-emerald-700" : g === "B+" ? "bg-blue-100 text-blue-700" : g === "B" ? "bg-blue-50 text-blue-600" : "bg-amber-100 text-amber-700";

  const rows = T_STUDENTS.map(s => {
    const vals = [Math.min(10, Math.round(s.score/10)), Math.min(10, Math.round(s.score/10)-1), Math.min(20, Math.round(s.score/5)), Math.min(50, Math.round(s.score/2)), Math.min(50, Math.round(s.score/2)+3), Math.min(10, Math.round(s.score/10))];
    const total = Math.min(100, Math.round(vals.reduce((a,b) => a+b, 0) * 0.65));
    return { ...s, vals, total, grade: gradeOf(total) };
  });
  const classAvg = Math.round(rows.reduce((a, r) => a + r.total, 0) / rows.length);

  return (
    <PageWrap>
      <div className="flex items-center justify-between mb-5">
        <div><H1>Gradebook</H1><p className="text-sm text-muted-foreground mt-1">Complete marks and grade record for your classes.</p></div>
        <div className="flex items-center gap-3">
          <select value={cls} onChange={e => setCls(e.target.value)} className="border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none cursor-pointer">
            {T_CLASSES.map(c => <option key={c.grade}>{c.grade} {c.section}</option>)}
          </select>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-muted text-muted-foreground rounded-xl text-xs font-bold hover:bg-muted/80 transition-colors"><Download size={13} /> Export PDF</button>
        </div>
      </div>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 mb-4 flex items-center gap-3">
        <p className="text-sm font-semibold text-emerald-700">Class Average: {classAvg}% — {gradeOf(classAvg)}</p>
      </div>
      <div className="bg-card border border-border rounded-2xl overflow-auto shadow-sm">
        <table className="w-full text-xs">
          <thead><tr className="border-b border-border bg-muted/30">
            <th className="text-left px-4 py-3 font-bold text-muted-foreground uppercase tracking-wider sticky left-0 bg-muted/30">Student</th>
            {cols.map(c => <th key={c} className="px-3 py-3 font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{c}</th>)}
          </tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20">
                <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap sticky left-0 bg-card">{r.roll}. {r.name}</td>
                {r.vals.map((v, j) => <td key={j} className="px-3 py-3 text-center text-foreground">{v}</td>)}
                <td className="px-3 py-3 text-center font-bold text-foreground">{r.total}</td>
                <td className="px-3 py-3 text-center"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${gc(r.grade)}`}>{r.grade}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageWrap>
  );
}

// ── Student Analytics ─────────────────────────────────────────────────────────

function TeacherStudentAnalyticsScreen() {
  const [selected, setSelected] = useState(T_STUDENTS[0].name);
  const student = T_STUDENTS.find(s => s.name === selected) ?? T_STUDENTS[0];
  const subjects = ["Maths","Science","English","Soc. Sci.","Hindi"];
  const scores = subjects.map((_, i) => Math.max(40, Math.min(99, student.score + [-2, -8, 5, -5, 3][i])));

  return (
    <PageWrap>
      <div className="flex items-center justify-between mb-5">
        <div><H1>Student Analytics</H1><p className="text-sm text-muted-foreground mt-1">Deep insights into individual student performance.</p></div>
        <select value={selected} onChange={e => setSelected(e.target.value)}
          className="border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none cursor-pointer">
          {T_STUDENTS.map(s => <option key={s.roll}>{s.name}</option>)}
        </select>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: "Attendance",    val: `${student.attendance}%`, color: student.attendance >= 85 ? "text-emerald-600" : "text-amber-600" },
          { label: "Homework Rate", val: student.hw,               color: student.hw === "Completed" ? "text-emerald-600" : "text-amber-600" },
          { label: "Avg Score",     val: `${student.score}%`,      color: student.score >= 80 ? "text-emerald-600" : student.score >= 60 ? "text-amber-600" : "text-red-500" },
          { label: "Risk Level",    val: student.risk.toUpperCase(), color: student.risk === "low" ? "text-emerald-600" : student.risk === "medium" ? "text-amber-600" : "text-red-500" },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-4 text-center shadow-sm">
            <p className={`text-xl font-extrabold ${s.color}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.val}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-5">
        {/* Subject performance */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-foreground mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Subject-wise Performance</h3>
          <div className="space-y-3">
            {subjects.map((subj, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-foreground">{subj}</span>
                  <span className={`font-bold ${scores[i] >= 80 ? "text-emerald-600" : scores[i] >= 60 ? "text-amber-600" : "text-red-500"}`}>{scores[i]}%</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${scores[i] >= 80 ? "bg-emerald-500" : scores[i] >= 60 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${scores[i]}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-border grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">Strengths</p>
              <p className="text-xs text-foreground">{subjects[scores.indexOf(Math.max(...scores))]}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-1">Needs Attention</p>
              <p className="text-xs text-foreground">{subjects[scores.indexOf(Math.min(...scores))]}</p>
            </div>
          </div>
        </div>

        {/* AI insight */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-primary/5 to-indigo-50 border border-primary/15 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3"><Bot size={14} className="text-primary" /><p className="text-xs font-bold text-primary">AI Insights</p></div>
            <div className="space-y-2">
              {[
                `${student.name.split(" ")[0]} shows strong performance in ${subjects[scores.indexOf(Math.max(...scores))]}. Consider advanced exercises.`,
                student.attendance < 80 ? `Attendance is critically low at ${student.attendance}%. Recommend parent communication.` : `Attendance is good. Keep encouraging consistency.`,
              ].map((r, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <p className="text-xs leading-relaxed text-foreground/80">{r}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent tests */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Recent Tests</h3>
            {[
              { test: "Unit Test 1", score: student.score, max: 50 },
              { test: "Weekly Quiz", score: Math.round(student.score * 0.38), max: 20 },
              { test: "Oral Test",   score: Math.round(student.score * 0.1),  max: 10 },
            ].map((t, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <p className="text-xs text-foreground">{t.test}</p>
                <span className="text-xs font-bold text-foreground">{t.score}/{t.max}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrap>
  );
}

// ── Communication ─────────────────────────────────────────────────────────────

function TeacherCommunicationScreen() {
  const [tab, setTab] = useState<"announcements"|"messages">("announcements");
  const [msg, setMsg] = useState("");
  const announcements = [
    { title: "Unit Test 2 tomorrow — bring calculator",        class: "9th A",     date: "29 Jun", sent: true },
    { title: "Lab session postponed to Thursday",             class: "6th B",     date: "28 Jun", sent: true },
    { title: "Submit project by Friday without fail",          class: "All Classes",date: "27 Jun", sent: true },
  ];
  const messages = [
    { from: "Aaravi's Parent",  preview: "Can you share the syllabus for Unit Test 2?", time: "10:30 AM", read: false },
    { from: "Rohan Mehta",      preview: "Ma'am, I didn't understand Exercise 4.2 Q5", time: "09:15 AM", read: false },
    { from: "Admin Office",     preview: "Please submit attendance before 4 PM today", time: "Yesterday",  read: true },
  ];
  return (
    <PageWrap>
      <H1>Communication Center</H1>
      <p className="text-sm text-muted-foreground mt-1 mb-5">Send announcements and manage messages.</p>
      <div className="flex gap-2 mb-5">
        {(["announcements","messages"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-colors ${tab === t ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            {t === "announcements" ? `Announcements` : "Messages"}
            {t === "messages" && <span className="ml-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">2</span>}
          </button>
        ))}
      </div>

      {tab === "announcements" && (
        <div className="grid grid-cols-[1fr_320px] gap-5">
          <div className="space-y-3">
            {announcements.map((a, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><Send size={14} className="text-primary" /></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.class} · {a.date}</p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Sent</span>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>New Announcement</h3>
            <div className="space-y-3">
              <div><label className="block text-xs font-semibold mb-1.5">Message</label>
                <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={4} placeholder="Type your announcement…"
                  className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              <div><label className="block text-xs font-semibold mb-1.5">Target Class</label>
                <select className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-card focus:outline-none cursor-pointer">
                  <option>All Classes</option>
                  {T_CLASSES.map(c => <option key={c.grade}>{c.grade} {c.section}</option>)}
                </select>
              </div>
              <button className="w-full py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <Send size={14} /> Send Announcement
              </button>
            </div>
          </div>
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

// ── Notice Board (Teacher) ────────────────────────────────────────────────────

function TeacherNoticeBoardScreen() {
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All","Academic","Examination","Events","General"];
  const notices = [
    { title: "Unit Test 2 Timetable Released",          category: "Examination", date: "29 Jun", priority: "High",   unread: true,  desc: "Unit Test 2 for all subjects from 2nd–5th July 2025." },
    { title: "Annual Science Exhibition — Register Now", category: "Events",      date: "28 Jun", priority: "Medium", unread: true,  desc: "Registrations open till 5th July. Contact science department." },
    { title: "Holiday Notice — Eid Al-Adha",            category: "General",     date: "26 Jun", priority: "Low",    unread: false, desc: "School closed on 7th July 2025." },
    { title: "Submit Lesson Plans by Friday",           category: "Academic",    date: "25 Jun", priority: "Medium", unread: false, desc: "All teachers must submit weekly lesson plans to HOD by Friday 5 PM." },
  ];
  const filtered = notices.filter(n => (activeCategory === "All" || n.category === activeCategory) && (search === "" || n.title.toLowerCase().includes(search.toLowerCase())));
  const catColors: Record<string, string> = { Academic: "bg-blue-100 text-blue-700 border-blue-200", Examination: "bg-red-100 text-red-600 border-red-200", Events: "bg-emerald-100 text-emerald-700 border-emerald-200", General: "bg-gray-100 text-gray-600 border-gray-200" };
  const priorityColor: Record<string, string> = { High: "bg-red-100 text-red-600", Medium: "bg-amber-100 text-amber-700", Low: "bg-gray-100 text-gray-500" };

  return (
    <PageWrap>
      <div className="flex items-center justify-between mb-5">
        <div><H1>Notice Board</H1><p className="text-sm text-muted-foreground mt-1">Institutional notices and announcements.</p></div>
        <div className="flex items-center gap-2">
          <div className="relative"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" className="pl-9 pr-3 py-2 bg-card border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 w-40" /></div>
          <button onClick={() => setShowCreate(o => !o)} className="flex items-center gap-1.5 bg-primary text-white px-3 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"><FilePlus size={13} /> Create</button>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap mb-5">{categories.map(c => <button key={c} onClick={() => setActiveCategory(c)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeCategory === c ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{c}</button>)}</div>

      {showCreate && (
        <div className="bg-card border border-primary/20 rounded-2xl p-5 shadow-sm mb-5">
          <h3 className="text-sm font-bold text-foreground mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Create Notice</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div><label className="block text-xs font-semibold mb-1.5">Title</label><input placeholder="Notice title…" className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
            <div><label className="block text-xs font-semibold mb-1.5">Category</label><select className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-card focus:outline-none cursor-pointer">{categories.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}</select></div>
          </div>
          <div className="mb-3"><label className="block text-xs font-semibold mb-1.5">Description</label><textarea rows={2} placeholder="Notice details…" className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" /></div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity">Publish</button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 bg-muted text-muted-foreground rounded-xl text-xs font-bold hover:bg-muted/80 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((n, i) => (
          <div key={i} className={`bg-card border rounded-2xl p-5 shadow-sm ${n.unread ? "border-primary/25" : "border-border"}`}>
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <div className="flex items-start gap-2">
                {n.unread && <div className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />}
                <h3 className="text-sm font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{n.title}</h3>
              </div>
              {n.unread && <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full shrink-0">NEW</span>}
            </div>
            <div className="flex items-center gap-2 mb-2 flex-wrap ml-4">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catColors[n.category] ?? ""}`}>{n.category}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityColor[n.priority]}`}>{n.priority} Priority</span>
              <span className="text-[10px] text-muted-foreground">{n.date}</span>
            </div>
            <p className="text-xs text-muted-foreground ml-4">{n.desc}</p>
          </div>
        ))}
      </div>
    </PageWrap>
  );
}

// ── Reports ───────────────────────────────────────────────────────────────────

function TeacherReportsScreen() {
  const [generated, setGenerated] = useState<string | null>(null);
  const reports = [
    { title: "Attendance Report",   icon: UserCheck,  desc: "Monthly class-wise attendance summary",           color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { title: "Homework Report",     icon: BookOpen,   desc: "Completion rates and submission stats",           color: "bg-blue-50 text-blue-700 border-blue-200" },
    { title: "Assignment Report",   icon: FileText,   desc: "Grades, feedback, and submission analysis",      color: "bg-violet-50 text-violet-700 border-violet-200" },
    { title: "Student Progress",    icon: TrendingUp, desc: "Holistic academic progress per student",         color: "bg-amber-50 text-amber-700 border-amber-200" },
  ];
  return (
    <PageWrap>
      <H1>Reports</H1>
      <p className="text-sm text-muted-foreground mt-1 mb-6">Generate and export class and student reports.</p>
      <div className="grid grid-cols-2 gap-5 mb-6">
        {reports.map((r, i) => (
          <div key={i} className={`border rounded-2xl p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all ${r.color}`}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center shrink-0"><r.icon size={18} /></div>
              <div><h3 className="text-sm font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{r.title}</h3><p className="text-xs mt-0.5 opacity-80">{r.desc}</p></div>
            </div>
            <div className="flex gap-2">
              <select className="flex-1 border border-current/20 rounded-xl px-2 py-1.5 text-xs bg-white/50 focus:outline-none cursor-pointer">
                {T_CLASSES.map(c => <option key={c.grade}>{c.grade} {c.section}</option>)}
              </select>
              <button onClick={() => setGenerated(r.title)}
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
              <button className="flex items-center gap-1.5 px-3 py-2 bg-muted text-muted-foreground rounded-xl text-xs font-bold hover:bg-muted/80 transition-colors"><Download size={12} /> Export PDF</button>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-muted text-muted-foreground rounded-xl text-xs font-bold hover:bg-muted/80 transition-colors"><Download size={12} /> Export Excel</button>
            </div>
          </div>
          <table className="w-full text-xs">
            <thead><tr className="border-b border-border bg-muted/30">{["Student","Class","Metric","Value","Status"].map(h => <th key={h} className="text-left px-4 py-2.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody>
              {T_STUDENTS.slice(0,5).map((s, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3 font-semibold text-foreground">{s.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">9th A</td>
                  <td className="px-4 py-3 text-muted-foreground">{generated.split(" ")[0]}</td>
                  <td className="px-4 py-3 font-bold text-foreground">{s.score}%</td>
                  <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.score >= 80 ? "bg-emerald-100 text-emerald-700" : s.score >= 60 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>{s.score >= 80 ? "Good" : s.score >= 60 ? "Average" : "Needs Help"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageWrap>
  );
}

// ── Teacher Settings ──────────────────────────────────────────────────────────

function TeacherSettingsScreen({ userName }: { userName: string }) {
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
      <p className="text-sm text-muted-foreground mt-1 mb-6">Manage your profile and preferences.</p>
      <div className="max-w-xl space-y-4">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Profile</h3>
          <div className="space-y-2">
            {[["Name", userName],["ID","TCH-2024-042"],["Department","Science & Mathematics"],["Assigned Classes","5th A, 6th B, 9th A"],["Qualification","M.Sc., B.Ed."],["Experience","8 Years"]].map(([k,v],i) => (
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
            <div><p className="text-sm font-semibold text-foreground">Notifications</p><p className="text-xs text-muted-foreground">Homework, attendance, and student alerts</p></div>
            <Toggle on={notifs} onChange={() => setNotifs(o => !o)} />
          </div>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div><p className="text-sm font-semibold text-foreground">Dark Mode</p><p className="text-xs text-muted-foreground">Switch interface theme</p></div>
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
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">About</h3>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Version</span><span className="font-semibold">1.0.0</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Role</span><span className="font-semibold">Teacher</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Institution</span><span className="font-semibold">Sunrise International School</span></div>
          </div>
        </div>
      </div>
    </PageWrap>
  );
}

// ─── Teacher Dashboard Router ─────────────────────────────────────────────────

function TeacherDashboard({
  userName, screen, selectedClass, notebookNotes, onNotesChange, onNavigate, onSelectClass,
}: {
  userName: string; screen: TeacherScreen; selectedClass: string;
  notebookNotes: Record<string, string>; onNotesChange: (k: string, v: string) => void;
  onNavigate: (s: TeacherScreen) => void; onSelectClass: (c: string) => void;
}) {
  switch (screen) {
    case "my-classes":        return <MyClassesScreen onSelectClass={onSelectClass} onNavigate={onNavigate} />;
    case "class-detail":      return <ClassDetailScreen selectedClass={selectedClass} onNavigate={onNavigate} />;
    case "attendance":        return <AttendanceScreen />;
    case "timetable":         return <TimetableScreen />;
    case "lesson-planner":    return <LessonPlannerScreen />;
    case "smart-notes":       return <SmartNotesScreen notebookNotes={notebookNotes} onNotesChange={onNotesChange} />;
    case "library":           return <TeacherLibraryScreen />;
    case "homework":          return <TeacherHomeworkScreen />;
    case "assignments":       return <TeacherAssignmentsScreen />;
    case "tests":             return <TeacherTestsScreen />;
    case "gradebook":         return <GradebookScreen />;
    case "student-analytics": return <TeacherStudentAnalyticsScreen />;
    case "communication":     return <TeacherCommunicationScreen />;
    case "notice-board":      return <TeacherNoticeBoardScreen />;
    case "reports":           return <TeacherReportsScreen />;
    case "settings":          return <TeacherSettingsScreen userName={userName} />;
    default:                  return <TeacherHome userName={userName} onNavigate={onNavigate} />;
  }
}


export { TeacherSideMenu, TeacherProfilePopup, TeacherDashboard, T_STUDENTS, T_CLASSES, RISK_COLOR };
export { PageWrap, H1 };
