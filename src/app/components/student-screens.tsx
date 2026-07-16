import { useState, useRef, useCallback, useEffect } from "react";
import {
  BookMarked, GraduationCap, BookOpen, ArrowRight, Home, Settings,
  BookText, CheckSquare, Trophy, Library, Download, BarChart3,
  Search, Clock, CircleCheck, Lock, FileDown, ChevronLeft,
  ChevronRight, ChevronDown, X, Save, FlaskConical, Calendar,
  ClipboardList, Target, BookOpenCheck, Zap, AlertTriangle,
  Megaphone, Eye, Share2, Trash2, SortAsc, Filter, FolderOpen,
  TrendingUp, FileText, FilePlus, Bot,
  ZoomIn, ZoomOut, RefreshCw, GripVertical,
} from "lucide-react";
import { NotebookEditorPanel } from "./notebook-editor";
import type { StudentScreen, LeftPanelMode, ChapterRef } from "./types";

export type { StudentScreen };

// ─── Static Data ──────────────────────────────────────────────────────────────

const SUBJECTS = [
  { name: "English", abbr: "Aa", color: "bg-blue-100 text-blue-700", border: "border-blue-200", progress: 62, chapters: 12, about: "Covers prose, poetry, grammar, and literature from diverse traditions." },
  { name: "Mathematics", abbr: "∑", color: "bg-purple-100 text-purple-700", border: "border-purple-200", progress: 48, chapters: 15, about: "Algebra, geometry, number theory, and problem solving." },
  { name: "Science", abbr: "⚗", color: "bg-green-100 text-green-700", border: "border-green-200", progress: 55, chapters: 18, about: "Physics, chemistry, and biology concepts with practical applications." },
  { name: "Social Science", abbr: "🌍", color: "bg-amber-100 text-amber-700", border: "border-amber-200", progress: 40, chapters: 10, about: "History, civics, geography, and economics." },
  { name: "Hindi", abbr: "ह", color: "bg-rose-100 text-rose-700", border: "border-rose-200", progress: 70, chapters: 11, about: "Hindi prose, poetry, grammar, and composition." },
];

const CHAPTERS: Record<string, { num: number; name: string; lessons: number }[]> = {
  "English":        [{ num: 1, name: "A Letter to God", lessons: 3 }, { num: 2, name: "Nelson Mandela — Long Walk to Freedom", lessons: 4 }, { num: 3, name: "Two Stories about Flying", lessons: 3 }, { num: 4, name: "From the Diary of Anne Frank", lessons: 4 }],
  "Mathematics":    [{ num: 1, name: "Real Numbers", lessons: 5 }, { num: 2, name: "Polynomials", lessons: 4 }, { num: 3, name: "Pair of Linear Equations", lessons: 6 }, { num: 4, name: "Quadratic Equations", lessons: 5 }],
  "Science":        [{ num: 1, name: "Chemical Reactions & Equations", lessons: 4 }, { num: 2, name: "Acids, Bases and Salts", lessons: 5 }, { num: 3, name: "Metals and Non-metals", lessons: 4 }, { num: 4, name: "Life Processes", lessons: 6 }],
  "Social Science": [{ num: 1, name: "The Rise of Nationalism in Europe", lessons: 5 }, { num: 2, name: "Nationalism in India", lessons: 4 }, { num: 3, name: "The Making of a Global World", lessons: 4 }, { num: 4, name: "Water Resources", lessons: 3 }],
  "Hindi":          [{ num: 1, name: "Surdas — Pad", lessons: 3 }, { num: 2, name: "Ram Lakshman Parshuram Samvad", lessons: 3 }, { num: 3, name: "Dev ke Savaiyen", lessons: 2 }, { num: 4, name: "Jai Shankar Prasad", lessons: 3 }],
};

const CHAPTER_TEXT: Record<string, { quote: string; body: string[] }> = {
  "English-1": {
    quote: "Education is the most powerful weapon which you can use to change the world.",
    body: [
      "Nelson Mandela was born on 18 July 1918 in the village of Mvezo in Umtata, then part of South Africa's Cape Province. Growing up in a rural area, he was exposed from an early age to the deeply unequal society shaped by apartheid — a government policy that enforced strict racial segregation and denied Black South Africans their basic rights.",
      "Despite these barriers, Mandela pursued education with fierce determination. He attended the University of Fort Hare and later studied law by correspondence from his prison cell. He became the first member of his family to attend school — a fact that both humbled and motivated him throughout his life.",
      "Mandela's teacher always reminded him: the chains of poverty are not inevitable; the shackles of oppression can be broken by the courageous act of learning. This belief guided Mandela through 27 years of imprisonment on Robben Island, from where he emerged not with bitterness, but with a vision for a united, democratic South Africa.",
      "On 10 May 1994, Mandela was inaugurated as South Africa's first democratically elected President. In his speech, he paid tribute to those who had sacrificed so much in the struggle for freedom. 'The time for the healing of wounds has come,' he declared. 'Never, never, and never again shall this beautiful land experience the oppression of one by another.'",
    ],
  },
  "English-0": {
    quote: "A man's character is his fate.",
    body: [
      "Lencho was a hardworking farmer who lived with his family near a valley. His cornfield was the only livelihood he had. One year, a massive hailstorm destroyed his entire crop just before the harvest, leaving his family without food for the whole year.",
      "Desperate but full of faith, Lencho wrote a letter addressed to God, asking for one hundred pesos to sow his field again. When the postmaster saw the letter, he was deeply moved. He collected money from his friends and employees and sent it to Lencho.",
      "However, he could only gather seventy pesos. Lencho was furious upon receiving only seventy pesos — he believed that God would never make a mistake. He wrote a second letter to God, asking for the rest of the money and calling the post office employees a 'bunch of crooks'.",
    ],
  },
  "Mathematics-0": {
    quote: "Pure mathematics is, in its way, the poetry of logical ideas.",
    body: [
      "A real number is any value on the continuous number line. Real numbers include all rational numbers — such as integers, fractions, and terminating or repeating decimals — as well as all irrational numbers such as √2, π, and e.",
      "Euclid's Division Lemma: For any two positive integers a and b, there exist unique integers q and r such that a = bq + r, where 0 ≤ r < b. This fundamental result forms the basis of the Euclidean Algorithm, which is used to find the Highest Common Factor (HCF) of two numbers.",
      "The Fundamental Theorem of Arithmetic states that every composite number can be expressed as a product of primes, and this factorisation is unique apart from the order in which the prime factors appear. This theorem is crucial in proving the irrationality of numbers like √2 and √3.",
    ],
  },
  "Science-0": {
    quote: "Science is the key to our future, and if you don't believe in science, then you're holding everybody back.",
    body: [
      "A chemical reaction is a process in which one or more substances are converted into one or more different substances. The substances that combine in a chemical reaction are called reactants, and the new substances formed are called products.",
      "In a chemical equation, reactants are written on the left side and products on the right side, separated by an arrow (→). The arrow represents the direction of the reaction. For example: Magnesium + Oxygen → Magnesium Oxide, or in symbols: 2Mg + O₂ → 2MgO.",
      "The Law of Conservation of Mass states that in any chemical reaction, the total mass of reactants equals the total mass of products. This means atoms are neither created nor destroyed — they are simply rearranged. This principle is the reason we must balance chemical equations.",
    ],
  },
  "Social Science-0": {
    quote: "Nationalism is not a flower that blooms overnight; it is the slow, deliberate unfolding of a people's shared consciousness.",
    body: [
      "Nationalism as an idea emerged in Europe towards the end of the 18th century. Before this period, people did not think of themselves primarily as 'French' or 'German' — they identified more with their region, religion, or ruler. The concept of the nation-state — a sovereign political entity built around a shared culture, history, and language — was a revolutionary idea.",
      "The French Revolution (1789) was a watershed moment. It introduced the idea that sovereignty resided not in the king, but in the people. The ideals of liberty, equality, and fraternity spread across Europe. Napoleon's armies, as they swept across the continent, carried with them the Napoleonic Code — a legal system that dismantled feudal privileges and established equality before the law.",
      "After Napoleon's defeat, the conservative powers of Europe — Austria, Prussia, Russia, and Britain — met at the Congress of Vienna (1815) to restore the old order. Prince Metternich of Austria famously said: 'When France sneezes, Europe catches cold.' Despite conservative efforts, the spirit of nationalism could not be extinguished.",
    ],
  },
};
function StudentSideMenu({ open, activeScreen, onNavigate, onClose }: {
  open: boolean; activeScreen: StudentScreen;
  onNavigate: (s: StudentScreen) => void; onClose: () => void;
}) {
  const sections = [
    { title: "Learning", items: [
      { id: "subjects" as StudentScreen,    label: "Subjects",      icon: BookOpen },
      { id: "notebook" as StudentScreen,    label: "Notebook",      icon: BookText },
      { id: "todays-task" as StudentScreen, label: "Today's Task",  icon: CheckSquare },
    ]},
    { title: "Progress", items: [
      { id: "test-score" as StudentScreen,  label: "Test & Score",  icon: BarChart3 },
      { id: "achievements" as StudentScreen,label: "Achievements",  icon: Trophy },
    ]},
    { title: "School", items: [
      { id: "notice-board" as StudentScreen,label: "Notice Board",  icon: Megaphone },
    ]},
    { title: "Resources", items: [
      { id: "library" as StudentScreen,     label: "Library",       icon: Library },
      { id: "downloads" as StudentScreen,   label: "Downloads",     icon: Download },
    ]},
  ];

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/20 z-20 backdrop-blur-[1px]" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-30 flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 border-b border-border flex items-center justify-between" style={{ height: 52 }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center"><BookMarked size={13} className="text-white" /></div>
            <span className="text-sm font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Smart Notebook</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><X size={15} className="text-foreground/50" /></button>
        </div>
        {/* My Class */}
        <div className="mx-3 mt-3 bg-primary/5 border border-primary/15 rounded-xl p-3">
          <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">My Class</p>
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>9th B</p><p className="text-xs text-muted-foreground">Mr. Ramesh Patil</p></div>
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center"><GraduationCap size={16} className="text-primary" /></div>
          </div>
        </div>
        {/* Dashboard */}
        <div className="px-3 mt-2">
          <button onClick={() => { onNavigate("dashboard"); onClose(); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeScreen === "dashboard" ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted hover:text-foreground"}`}>
            <Home size={15} />Dashboard
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 mt-1 pb-2 space-y-3 hide-scrollbar">
          {sections.map(section => (
            <div key={section.title}>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 py-2">{section.title}</p>
              <div className="space-y-0.5">
                {section.items.map(item => (
                  <button key={item.id} onClick={() => { onNavigate(item.id); onClose(); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeScreen === item.id || (activeScreen === "workspace" && item.id === "subjects") || (activeScreen === "subject-detail" && item.id === "subjects") ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted hover:text-foreground"}`}>
                    <item.icon size={15} />{item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <button onClick={() => { onNavigate("settings"); onClose(); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeScreen === "settings" ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted hover:text-foreground"}`}>
            <Settings size={15} />Settings
          </button>
        </div>
      </aside>
    </>
  );
}

function GenericSideMenu({ open, role, onClose }: { open: boolean; role: Role; onClose: () => void }) {
  const items = [{ icon: Home, label: "Dashboard" }, { icon: BookOpen, label: "My Subjects" }, { icon: Users, label: "Team" }, { icon: BarChart3, label: "Reports" }, { icon: Settings, label: "Settings" }];
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/20 z-20 backdrop-blur-[1px]" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-30 flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 border-b border-border flex items-center gap-3" style={{ height: 52 }}>
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center"><BookMarked size={13} className="text-white" /></div>
          <span className="text-sm font-bold text-foreground capitalize" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{role} Portal</span>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {items.map((item, i) => (
            <button key={i} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${i === 0 ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted hover:text-foreground"}`}>
              <item.icon size={15} />{item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

// ─── Role Select ──────────────────────────────────────────────────────────────

function RoleSelectPage({ onSelect }: { onSelect: (r: Role) => void }) {
  const roles: { id: Role; emoji: string; label: string; gradient: string; ring: string }[] = [
    { id: "student", emoji: "🎓", label: "Student", gradient: "from-blue-500 to-indigo-600", ring: "hover:ring-blue-200" },
    { id: "teacher", emoji: "📚", label: "Teacher", gradient: "from-emerald-500 to-teal-600", ring: "hover:ring-emerald-200" },
    { id: "admin",   emoji: "🛡️", label: "Admin",   gradient: "from-violet-500 to-purple-600", ring: "hover:ring-violet-200" },
  ];
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-10">
      <div className="mb-14 text-center">
        <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-primary/25">
          <BookMarked size={34} className="text-white" />
        </div>
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Smart Notebook</h1>
        <p className="text-muted-foreground mt-2 text-sm">Your intelligent learning companion</p>
      </div>
      <div className="flex gap-7">
        {roles.map(r => (
          <button key={r.id} onClick={() => onSelect(r.id)}
            className={`group bg-card border-2 border-border rounded-3xl w-44 h-44 flex flex-col items-center justify-center gap-3 hover:border-transparent hover:ring-4 ${r.ring} hover:shadow-2xl hover:-translate-y-2 transition-all duration-200 cursor-pointer focus:outline-none`}>
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${r.gradient} flex items-center justify-center shadow-md text-3xl`}>{r.emoji}</div>
            <span className="text-base font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{r.label}</span>
          </button>
        ))}
      </div>
      <p className="mt-12 text-xs text-muted-foreground/40">AI Smart Notebook v1.0 — Desktop Edition</p>
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────

function LoginPage({ role, onBack, onLogin }: { role: Role; onBack: () => void; onLogin: (name: string) => void }) {
  const [name, setName] = useState(""); const [id, setId] = useState(""); const [loading, setLoading] = useState(false);
  const configs = {
    student: { label: "Student", namePlaceholder: "e.g. Aaravi Sharma", idLabel: "Student ID / Roll No.", idPlaceholder: "e.g. STU-2024-009", gradient: "from-blue-500 to-indigo-600", icon: GraduationCap },
    teacher: { label: "Teacher", namePlaceholder: "e.g. Mr. Rajan Mehta", idLabel: "Teacher ID", idPlaceholder: "e.g. TCH-2024-042", gradient: "from-emerald-500 to-teal-600", icon: BookOpen },
    admin:   { label: "Admin",   namePlaceholder: "e.g. Ms. Priya Das",   idLabel: "Admin ID",   idPlaceholder: "e.g. ADM-2024-001", gradient: "from-violet-500 to-purple-600", icon: Shield },
  };
  const cfg = configs[role];
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!name.trim() || !id.trim()) return; setLoading(true); setTimeout(() => { setLoading(false); onLogin(name.trim()); }, 900); };
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-10">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"><ChevronLeft size={16} /> Back to role selection</button>
        <div className="bg-card border border-border rounded-3xl p-10 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shadow-lg`}><cfg.icon size={26} className="text-white" /></div>
            <div><h2 className="text-2xl font-extrabold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{cfg.label} Login</h2><p className="text-sm text-muted-foreground mt-0.5">Enter your credentials to continue</p></div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><label className="block text-sm font-semibold text-foreground mb-2">{cfg.label} Name</label>
              <div className="relative"><User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={cfg.namePlaceholder}
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all" /></div></div>
            <div><label className="block text-sm font-semibold text-foreground mb-2">{cfg.idLabel}</label>
              <div className="relative"><Hash size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input type="text" value={id} onChange={e => setId(e.target.value)} placeholder={cfg.idPlaceholder}
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all" /></div></div>
            <button type="submit" disabled={!name.trim() || !id.trim() || loading}
              className="w-full py-3.5 mt-1 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Sign In</span><ArrowRight size={15} /></>}
            </button>
          </form>
          <p className="mt-5 text-center text-xs text-muted-foreground/50">Trouble signing in? Contact your institution administrator.</p>
        </div>
      </div>
    </div>
  );
}

// ─── Student Screens ──────────────────────────────────────────────────────────

function StudentHome({ userName, onNavigate }: { userName: string; onNavigate: (s: StudentScreen) => void }) {
  const subjects = [
    { abbr: "Aa", name: "English",        lesson: "Indigo Mansions — A Long Walk to Freedom", time: "09:00 AM", bg: "bg-blue-100 text-blue-700" },
    { abbr: "∑",  name: "Mathematics",    lesson: "Linear Equations in Two Variables — Exercise 2.3", time: "10:30 AM", bg: "bg-purple-100 text-purple-700" },
    { abbr: "⚗",  name: "Science",        lesson: "Principles of Living Organisms", time: "12:00 PM", bg: "bg-green-100 text-green-700" },
    { abbr: "🌍", name: "Social Science",  lesson: "Sustainable Development — Chapter 4", time: "02:00 PM", bg: "bg-amber-100 text-amber-700" },
    { abbr: "ह",  name: "Hindi",          lesson: "Surdas — Pad (Poem Analysis)", time: "03:30 PM", bg: "bg-rose-100 text-rose-700" },
  ];
  const r = 42, circ = 2 * Math.PI * r, dash = circ * 0.25;
  return (
    <div className="flex-1 overflow-y-auto p-7 hide-scrollbar">
      <div className="max-w-5xl mx-auto">
        <div className="mb-7">
          <h1 className="text-3xl font-extrabold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Good Morning, {userName.split(" ")[0]}! 👋</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">Every step is a story towards your success. <span className="text-foreground/70 font-medium">Stay curious, keep learning!</span></p>
        </div>
        <div className="grid grid-cols-[1fr_300px] gap-6">
          <div className="space-y-5">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Today&apos;s Learning</h2>
                <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">Your teacher shared today&apos;s content</span>
              </div>
              <div className="space-y-2">
                {subjects.map((s, i) => (
                  <div key={i} onClick={() => onNavigate("subjects")} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/70 transition-colors cursor-pointer">
                    <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center text-sm font-bold shrink-0`}>{s.abbr}</div>
                    <div className="flex-1 min-w-0"><div className="text-sm font-semibold text-foreground">{s.name}</div><div className="text-xs text-muted-foreground truncate">{s.lesson}</div></div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground/60 shrink-0"><Clock size={11} />{s.time}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <button onClick={() => onNavigate("todays-task")} className="text-sm text-primary font-semibold flex items-center gap-1.5 hover:gap-2.5 transition-all">View Full Today&apos;s Plan <ArrowRight size={13} /></button>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3.5 shadow-sm">
              <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center shrink-0 text-base">💡</div>
              <p className="text-sm text-muted-foreground"><span className="text-foreground font-semibold">Learning a little every day leads to big achievements.</span>{" "}You&apos;ve got this!</p>
            </div>
          </div>
          <div className="space-y-5">
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="text-5xl text-primary/20 font-serif leading-none mb-2 select-none">"</div>
              <p className="text-sm text-foreground/80 leading-relaxed italic">The beautiful thing about learning is that no one can take it away from you.</p>
              <p className="text-xs text-muted-foreground mt-3 font-semibold">— B.B. King</p>
            </div>
            <div className="bg-gradient-to-br from-primary/5 via-indigo-50 to-blue-50 border border-primary/15 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-foreground mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Keep Going! 🎯</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">Consistency is the key. <span className="text-primary font-semibold">You&apos;re doing great!</span></p>
              <div className="flex items-center gap-1.5">{[...Array(5)].map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-full ${i < 4 ? "bg-primary" : "bg-border"}`} />)}</div>
              <p className="text-xs text-muted-foreground mt-2">4 of 5 subjects attended today</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-foreground mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Progress</h3>
              <div className="flex items-center gap-4">
                <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90 shrink-0">
                  <circle cx="48" cy="48" r={r} fill="none" stroke="var(--muted)" strokeWidth="9" />
                  <circle cx="48" cy="48" r={r} fill="none" stroke="var(--primary)" strokeWidth="9" strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1.2s ease" }} />
                </svg>
                <div>
                  <div className="text-3xl font-extrabold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>75%</div>
                  <div className="text-xs text-muted-foreground mt-1 leading-relaxed">Weekly Goal<br /><span className="text-emerald-600 font-semibold">75% Completed</span></div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex items-center gap-1.5 text-xs text-muted-foreground">
                <CircleCheck size={13} className="text-emerald-500" />Started: 24 May 2025
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubjectsScreen({ onSelect }: { onSelect: (name: string) => void }) {
  return (
    <div className="flex-1 overflow-y-auto p-7 hide-scrollbar">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-extrabold text-foreground mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>My Subjects</h2>
        <p className="text-sm text-muted-foreground mb-7">Select a subject to view chapters and open the study workspace.</p>
        <div className="grid grid-cols-3 gap-5">
          {SUBJECTS.map(s => (
            <button key={s.name} onClick={() => onSelect(s.name)}
              className={`bg-card border-2 ${s.border} rounded-2xl p-5 text-left hover:-translate-y-1 hover:shadow-lg transition-all duration-200 shadow-sm`}>
              <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center text-xl font-bold mb-3`}>{s.abbr}</div>
              <h3 className="text-base font-bold text-foreground mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{s.chapters} chapters</p>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${s.progress}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">{s.progress}% complete</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SubjectDetailScreen({ subjectName, onBack, onOpenChapter }: {
  subjectName: string; onBack: () => void; onOpenChapter: (chapter: ChapterRef) => void;
}) {
  const subject = SUBJECTS.find(s => s.name === subjectName)!;
  const chapters = CHAPTERS[subjectName] ?? [];
  const subjectTasks = [
    { name: "Read Chapter 2 and answer Q1–Q5", due: "28 Jun 2025", status: "Pending" as const },
    { name: "Write a summary (150 words)", due: "30 Jun 2025", status: "Pending" as const },
    { name: "Chapter 1 worksheet", due: "24 Jun 2025", status: "Completed" as const },
  ];
  return (
    <div className="flex-1 overflow-y-auto p-7 hide-scrollbar">
      <div className="max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5">
          <ChevronLeft size={16} /> Back to Subjects
        </button>
        <div className="grid grid-cols-[1fr_280px] gap-6">
          <div className="space-y-5">
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl ${subject.color} flex items-center justify-center text-2xl font-bold shrink-0`}>{subject.abbr}</div>
              <div className="flex-1">
                <h2 className="text-xl font-extrabold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{subject.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{subject.about}</p>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1"><span>Progress</span><span className="font-semibold text-primary">{subject.progress}%</span></div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${subject.progress}%` }} /></div>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-foreground mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Chapters ({chapters.length})</h3>
              <p className="text-xs text-muted-foreground mb-4">Click any chapter to open the split study workspace.</p>
              <div className="space-y-2">
                {chapters.map((ch, i) => (
                  <button key={i} onClick={() => onOpenChapter({ subject: subjectName, name: ch.name, num: ch.num, idx: i })}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all text-left group">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">{ch.num}</div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{ch.name}</div>
                      <div className="text-xs text-muted-foreground">{ch.lessons} lessons</div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-primary/60 font-medium group-hover:text-primary transition-colors shrink-0">
                      <BookText size={12} />Open
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm h-fit">
            <h3 className="text-sm font-bold text-foreground mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Tasks from Teacher</h3>
            <div className="space-y-3">
              {subjectTasks.map((t, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                  <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${t.status === "Completed" ? "bg-emerald-500" : "bg-amber-400"}`} />
                  <div className="flex-1"><p className="text-sm font-medium text-foreground">{t.name}</p><p className="text-xs text-muted-foreground mt-0.5">Due: {t.due}</p></div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.status === "Completed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{t.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StandaloneNotebookScreen({ notebookNotes, onNotesChange }: {
  notebookNotes: Record<string, string>; onNotesChange: (key: string, html: string) => void;
}) {
  const [selectedSubject, setSelectedSubject] = useState("");
  const options = ["Rough Notebook", ...SUBJECTS.map(s => s.name)];
  const key = selectedSubject ? `standalone-${selectedSubject}` : "";
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Subject selector bar */}
      <div className="px-5 py-3 bg-white border-b border-border flex items-center gap-3 shrink-0">
        <BookText size={16} className="text-primary shrink-0" />
        <span className="text-sm font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Notebook</span>
        <div className="relative ml-2">
          <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}
            className="appearance-none bg-muted border border-border rounded-xl px-3 py-2 pr-8 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer">
            <option value="">— Select Subject —</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
      </div>
      {selectedSubject ? (
        <NotebookEditorPanel
          chapterKey={key}
          subject={selectedSubject}
          initialContent={notebookNotes[key] || ""}
          onContentChange={onNotesChange}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center text-muted-foreground">
            <BookText size={40} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">Select a subject above to open your notebook</p>
            <p className="text-xs mt-1 opacity-60">Your notes are saved automatically</p>
          </div>
        </div>
      )}
    </div>
  );
}

const ALL_TASKS = [
  { subject: "English",        name: "Read Chapter 2 and answer Q1–Q5",    due: "28 Jun", status: "Pending" as const },
  { subject: "English",        name: "Write a 150-word summary",            due: "30 Jun", status: "Pending" as const },
  { subject: "Mathematics",    name: "Exercise 3.2 — all sums",             due: "28 Jun", status: "Pending" as const },
  { subject: "Science",        name: "Life Processes diagram",              due: "29 Jun", status: "Completed" as const },
  { subject: "Science",        name: "Chapter 2 worksheet",                 due: "25 Jun", status: "Completed" as const },
  { subject: "Social Science", name: "Map marking — water resources",       due: "01 Jul", status: "Pending" as const },
  { subject: "Hindi",          name: "Surdas Pad — memorisation + meaning", due: "27 Jun", status: "Completed" as const },
];

// ─── Today's Task — Full Productivity Dashboard ───────────────────────────────

function TodaysTaskScreen() {
  const [tab, setTab] = useState<"today" | "week" | "overdue">("today");

  const completedTasks = [
    { subject: "Science",       topic: "Life Processes diagram",              teacher: "Mrs. Sharma",  pct: 100 },
    { subject: "Science",       topic: "Chapter 2 worksheet",                 teacher: "Mrs. Sharma",  pct: 100 },
    { subject: "Hindi",         topic: "Surdas Pad memorisation",             teacher: "Mr. Kulkarni", pct: 100 },
  ];
  const inProgressTasks = [
    { subject: "English",       topic: "Read Chapter 2 & answer Q1–Q5",      teacher: "Ms. Nair",     due: "28 Jun", pct: 60 },
    { subject: "Mathematics",   topic: "Exercise 3.2 — all sums",             teacher: "Mr. Joshi",    due: "28 Jun", pct: 40 },
  ];
  const notStartedTasks = [
    { subject: "English",       topic: "Write a 150-word summary",            teacher: "Ms. Nair",     due: "30 Jun", pct: 0 },
    { subject: "Social Science",topic: "Map marking — water resources",       teacher: "Mr. Verma",    due: "01 Jul", pct: 0 },
  ];
  const overdueTasks = [
    { subject: "Mathematics",   topic: "Chapter 1 — Extra practice sums",     teacher: "Mr. Joshi",    due: "22 Jun", type: "Homework" },
    { subject: "English",       topic: "Grammar worksheet — tenses",          teacher: "Ms. Nair",     due: "20 Jun", type: "Assignment" },
    { subject: "Science",       topic: "Lab observation notes",               teacher: "Mrs. Sharma",  due: "18 Jun", type: "Notes" },
  ];
  const weekPlan = [
    { day: "Mon", date: "30 Jun", items: ["Mathematics — Polynomials", "Science — Metals & Non-metals"] },
    { day: "Tue", date: "01 Jul", items: ["English — Flying Stories", "Social Science — Quiz"] },
    { day: "Wed", date: "02 Jul", items: ["Hindi — Dev ke Savaiyen", "Mathematics — Unit Test"] },
    { day: "Thu", date: "03 Jul", items: ["Science — Practical", "English — Writing"] },
    { day: "Fri", date: "04 Jul", items: ["All subjects revision", "Weekly summary"] },
  ];
  const upcoming = [
    { subject: "Mathematics",   chapter: "Quadratic Equations",  date: "01 Jul", teacher: "Mr. Joshi",    readTime: "45 min" },
    { subject: "Science",       chapter: "Metals and Non-metals", date: "30 Jun", teacher: "Mrs. Sharma",  readTime: "30 min" },
    { subject: "English",       chapter: "Two Stories About Flying",date:"02 Jul",teacher: "Ms. Nair",     readTime: "25 min" },
    { subject: "Social Science",chapter: "Making of a Global World",date:"03 Jul",teacher: "Mr. Verma",   readTime: "35 min" },
  ];
  const quotes = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain", tip: "Break big tasks into small steps." },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela", tip: "Start with just 5 minutes of focused study." },
  ];
  const quote = quotes[0];

  const TaskCard = ({ task, status }: { task: { subject: string; topic: string; teacher: string; due?: string; pct: number }; status: "completed" | "in-progress" | "not-started" }) => {
    const colors = { completed: "border-emerald-200 bg-emerald-50/40", "in-progress": "border-amber-200 bg-amber-50/40", "not-started": "border-border bg-card" };
    const dot = { completed: "bg-emerald-500", "in-progress": "bg-amber-400", "not-started": "bg-gray-300" };
    const label = { completed: "bg-emerald-100 text-emerald-700", "in-progress": "bg-amber-100 text-amber-700", "not-started": "bg-gray-100 text-gray-500" };
    const labelText = { completed: "Completed", "in-progress": "In Progress", "not-started": "Not Started" };
    return (
      <div className={`border rounded-xl p-4 shadow-sm ${colors[status]}`}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-start gap-2">
            <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${dot[status]}`} />
            <div>
              <p className="text-sm font-semibold text-foreground leading-snug">{task.topic}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{task.subject} · {task.teacher}{task.due ? ` · Due: ${task.due}` : ""}</p>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${label[status]}`}>{labelText[status]}</span>
        </div>
        {task.pct > 0 && (
          <div className="ml-4 mt-2">
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1"><span>Progress</span><span>{task.pct}%</span></div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className={`h-full rounded-full ${status === "completed" ? "bg-emerald-500" : "bg-amber-400"}`} style={{ width: `${task.pct}%` }} /></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-extrabold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Learning Progress</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Stay on top of your tasks, goals, and daily schedule.</p>
          </div>
          <div className="flex gap-2">
            {(["today","week","overdue"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${tab === t ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                {t === "today" ? "Today" : t === "week" ? "This Week" : "Overdue"}
              </button>
            ))}
          </div>
        </div>

        {tab === "today" && (
          <div className="grid grid-cols-[1fr_300px] gap-5">
            <div className="space-y-5">
              {/* Summary strip */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Completed", val: completedTasks.length, color: "bg-emerald-50 border-emerald-200 text-emerald-700", icon: CircleCheck },
                  { label: "In Progress", val: inProgressTasks.length, color: "bg-amber-50 border-amber-200 text-amber-700", icon: Target },
                  { label: "Not Started", val: notStartedTasks.length, color: "bg-gray-50 border-border text-gray-500", icon: ClipboardList },
                  { label: "Overdue", val: overdueTasks.length, color: "bg-red-50 border-red-200 text-red-600", icon: AlertTriangle },
                ].map((s, i) => (
                  <div key={i} className={`border rounded-xl p-3 flex items-center gap-3 shadow-sm ${s.color}`}>
                    <s.icon size={18} />
                    <div><p className="text-xl font-extrabold leading-none" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.val}</p><p className="text-[10px] font-semibold mt-0.5">{s.label}</p></div>
                  </div>
                ))}
              </div>

              {/* Completed */}
              <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <CircleCheck size={15} className="text-emerald-500" /> Completed ({completedTasks.length})
                </h3>
                <div className="space-y-2">{completedTasks.map((t,i) => <TaskCard key={i} task={t} status="completed" />)}</div>
              </div>

              {/* In Progress */}
              <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <Target size={15} className="text-amber-500" /> In Progress ({inProgressTasks.length})
                </h3>
                <div className="space-y-2">{inProgressTasks.map((t,i) => <TaskCard key={i} task={t} status="in-progress" />)}</div>
              </div>

              {/* Not Started */}
              <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <ClipboardList size={15} className="text-gray-400" /> Not Started ({notStartedTasks.length})
                </h3>
                <div className="space-y-2">{notStartedTasks.map((t,i) => <TaskCard key={i} task={t} status="not-started" />)}</div>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="space-y-4">
              {/* Motivational quote */}
              <div className="bg-gradient-to-br from-primary to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
                <div className="text-3xl font-serif opacity-30 leading-none mb-2">"</div>
                <p className="text-sm leading-relaxed font-medium italic">{quote.text}</p>
                <p className="text-xs opacity-70 mt-2">— {quote.author}</p>
                <div className="mt-3 pt-3 border-t border-white/20">
                  <p className="text-[11px] opacity-80">💡 <span className="font-semibold">Study Tip:</span> {quote.tip}</p>
                </div>
              </div>

              {/* Upcoming topics */}
              <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Upcoming Topics</h3>
                <div className="space-y-2.5">
                  {upcoming.map((u, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-muted/60 transition-colors">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <BookOpenCheck size={13} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{u.chapter}</p>
                        <p className="text-[10px] text-muted-foreground">{u.subject} · {u.date}</p>
                        <p className="text-[10px] text-muted-foreground/70">{u.teacher} · {u.readTime}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily challenge */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} className="text-amber-600" />
                  <h3 className="text-xs font-bold text-amber-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Daily Challenge</h3>
                </div>
                <p className="text-xs text-amber-700 leading-relaxed">Solve 3 Mathematics problems without looking at the solution first. Build your problem-solving confidence!</p>
                <button className="mt-3 w-full py-2 bg-amber-500 text-white text-xs font-bold rounded-xl hover:bg-amber-600 transition-colors">Accept Challenge</button>
              </div>
            </div>
          </div>
        )}

        {tab === "week" && (
          <div className="grid grid-cols-[1fr_280px] gap-5">
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-foreground mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Weekly Class Schedule</h3>
                <div className="space-y-3">
                  {weekPlan.map((d, i) => (
                    <div key={i} className={`flex gap-4 p-3 rounded-xl ${i === 0 ? "bg-primary/5 border border-primary/15" : "hover:bg-muted/50"} transition-colors`}>
                      <div className="text-center shrink-0 w-12">
                        <p className={`text-xs font-bold ${i === 0 ? "text-primary" : "text-muted-foreground"}`}>{d.day}</p>
                        <p className={`text-lg font-extrabold leading-tight ${i === 0 ? "text-primary" : "text-foreground"}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{d.date.split(" ")[0]}</p>
                        <p className="text-[9px] text-muted-foreground">{d.date.split(" ")[1]}</p>
                      </div>
                      <div className="flex-1">
                        {d.items.map((item, j) => (
                          <div key={j} className="flex items-center gap-2 py-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                            <p className="text-xs text-foreground">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Weekly Goals</h3>
                {[
                  { label: "Chapters to complete", val: "4", total: "6", color: "bg-primary" },
                  { label: "Homework tasks", val: "5", total: "7", color: "bg-emerald-500" },
                  { label: "Revision sessions", val: "2", total: "5", color: "bg-amber-500" },
                ].map((g, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{g.label}</span><span className="font-semibold text-foreground">{g.val}/{g.total}</span></div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden"><div className={`h-full rounded-full ${g.color}`} style={{ width: `${(parseInt(g.val)/parseInt(g.total))*100}%` }} /></div>
                  </div>
                ))}
              </div>
              <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Upcoming Tests</h3>
                {[
                  { subject: "Mathematics", type: "Unit Test", date: "02 Jul", days: 3 },
                  { subject: "Science",     type: "Weekly Quiz",date: "30 Jun", days: 1 },
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${i === 0 ? "bg-purple-100" : "bg-blue-100"}`}>
                      <FlaskConical size={14} className={i === 0 ? "text-purple-600" : "text-blue-600"} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-foreground">{t.subject}</p>
                      <p className="text-[10px] text-muted-foreground">{t.type} · {t.date}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.days <= 1 ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"}`}>{t.days}d left</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "overdue" && (
          <div className="space-y-3">
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3">
              <AlertTriangle size={16} className="text-red-500 shrink-0" />
              <p className="text-sm text-red-700 font-medium">You have {overdueTasks.length} overdue items. Complete them as soon as possible to stay on track.</p>
            </div>
            {overdueTasks.map((t, i) => (
              <div key={i} className="bg-card border border-red-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0"><AlertTriangle size={16} className="text-red-500" /></div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.topic}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{t.subject} · {t.teacher}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 shrink-0">{t.type}</span>
                  </div>
                  <p className="text-xs text-red-500 mt-2 font-medium">⏰ Was due: {t.due}</p>
                </div>
                <button className="shrink-0 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity">Start Now</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Test & Score ─────────────────────────────────────────────────────────────

function TestScoreScreen() {
  const [tab, setTab] = useState<"completed" | "upcoming" | "practice">("completed");

  const completedTests = [
    { name: "Unit Test 1",    subject: "Mathematics",    date: "10 Jun 2025", score: 47, max: 50,  grade: "A+", rank: "2nd" },
    { name: "Weekly Quiz",    subject: "Science",        date: "15 Jun 2025", score: 18, max: 20,  grade: "A",  rank: "5th" },
    { name: "Surprise Test",  subject: "English",        date: "18 Jun 2025", score: 23, max: 25,  grade: "A",  rank: "3rd" },
    { name: "Unit Test 1",    subject: "Social Science", date: "20 Jun 2025", score: 36, max: 50,  grade: "B+", rank: "8th" },
    { name: "Oral Test",      subject: "Hindi",          date: "22 Jun 2025", score: 9,  max: 10,  grade: "A+", rank: "1st" },
  ];
  const upcomingTests = [
    { name: "Unit Test 2",   subject: "Mathematics",   date: "02 Jul 2025", time: "10:00 AM", max: 50, syllabus: "Ch 3–4: Linear & Quadratic Equations", days: 3, readiness: 82, expected: 41 },
    { name: "Weekly Quiz",   subject: "Science",       date: "30 Jun 2025", time: "11:30 AM", max: 20, syllabus: "Ch 3: Metals and Non-metals", days: 1, readiness: 65, expected: 13 },
    { name: "Class Test",    subject: "English",       date: "05 Jul 2025", time: "09:00 AM", max: 25, syllabus: "Ch 2–3: Prose & Grammar", days: 6, readiness: 90, expected: 22 },
  ];
  const practiceTests = [
    { name: "Chapter Test",      subject: "Mathematics",   difficulty: "Medium", questions: 20, time: "30 min", marks: 40 },
    { name: "Unit Quiz",         subject: "Science",       difficulty: "Easy",   questions: 15, time: "20 min", marks: 30 },
    { name: "Grammar Practice",  subject: "English",       difficulty: "Medium", questions: 25, time: "25 min", marks: 25 },
    { name: "Mock Exam",         subject: "All Subjects",  difficulty: "Hard",   questions: 50, time: "90 min", marks: 100 },
    { name: "Mid-Term Practice", subject: "Mathematics",   difficulty: "Hard",   questions: 40, time: "60 min", marks: 80 },
    { name: "Practice Quiz",     subject: "Hindi",         difficulty: "Easy",   questions: 10, time: "15 min", marks: 20 },
  ];
  const diffColor: Record<string, string> = { Easy: "bg-emerald-100 text-emerald-700", Medium: "bg-amber-100 text-amber-700", Hard: "bg-red-100 text-red-600" };
  const gradeColor = (g: string) => g.startsWith("A") ? "bg-emerald-100 text-emerald-700" : g === "B+" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700";

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-extrabold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Test &amp; Score</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Track your performance and prepare for upcoming assessments.</p>
          </div>
          <div className="flex gap-2">
            {(["completed","upcoming","practice"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${tab === t ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                {t === "completed" ? "Completed" : t === "upcoming" ? "Upcoming" : "Practice"}
              </button>
            ))}
          </div>
        </div>

        {tab === "completed" && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/30">
                {["Test Name","Subject","Date","Score","Grade","Rank","Performance"].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>)}
              </tr></thead>
              <tbody>
                {completedTests.map((t, i) => {
                  const pct = Math.round((t.score/t.max)*100);
                  return (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3.5 font-semibold text-foreground">{t.name}</td>
                      <td className="px-4 py-3.5 text-muted-foreground">{t.subject}</td>
                      <td className="px-4 py-3.5 text-muted-foreground text-xs">{t.date}</td>
                      <td className="px-4 py-3.5 font-bold text-foreground">{t.score}/{t.max}</td>
                      <td className="px-4 py-3.5"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${gradeColor(t.grade)}`}>{t.grade}</span></td>
                      <td className="px-4 py-3.5 text-xs font-semibold text-primary">{t.rank}</td>
                      <td className="px-4 py-3.5 w-32">
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className={`h-full rounded-full ${pct>=80?"bg-emerald-500":pct>=60?"bg-amber-400":"bg-red-400"}`} style={{ width:`${pct}%` }} /></div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{pct}%</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === "upcoming" && (
          <div className="space-y-4">
            {upcomingTests.map((t, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <div className="grid grid-cols-[1fr_200px] gap-4">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-base font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.name}</h3>
                        <p className="text-sm text-muted-foreground">{t.subject}</p>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${t.days <= 1 ? "bg-red-100 text-red-600" : t.days <= 3 ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>{t.days} day{t.days !== 1 ? "s" : ""} left</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground mt-3">
                      <div className="flex items-center gap-1.5"><Calendar size={12} />{t.date}</div>
                      <div className="flex items-center gap-1.5"><Clock size={12} />{t.time}</div>
                      <div className="flex items-center gap-1.5"><FileText size={12} />{t.max} marks</div>
                    </div>
                    <div className="mt-3 p-2.5 bg-muted/50 rounded-xl">
                      <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Syllabus:</span> {t.syllabus}</p>
                    </div>
                  </div>
                  <div className="border-l border-border pl-4 flex flex-col justify-center gap-3">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">Est. Readiness</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden"><div className={`h-full rounded-full ${t.readiness>=80?"bg-emerald-500":t.readiness>=60?"bg-amber-400":"bg-red-400"}`} style={{ width:`${t.readiness}%` }} /></div>
                        <span className="text-sm font-extrabold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.readiness}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">Expected Score</p>
                      <p className="text-lg font-extrabold text-primary" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.expected} <span className="text-sm text-muted-foreground font-normal">/ {t.max}</span></p>
                    </div>
                    <button className="w-full py-2 bg-primary/10 text-primary text-xs font-bold rounded-xl hover:bg-primary/20 transition-colors">Start Revision</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "practice" && (
          <div className="grid grid-cols-3 gap-4">
            {practiceTests.map((t, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><FlaskConical size={18} className="text-primary" /></div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diffColor[t.difficulty]}`}>{t.difficulty}</span>
                </div>
                <h3 className="text-sm font-bold text-foreground mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{t.subject}</p>
                <div className="grid grid-cols-3 gap-1 text-center mb-4">
                  <div className="bg-muted rounded-lg p-1.5"><p className="text-xs font-bold text-foreground">{t.questions}</p><p className="text-[9px] text-muted-foreground">Questions</p></div>
                  <div className="bg-muted rounded-lg p-1.5"><p className="text-xs font-bold text-foreground">{t.time}</p><p className="text-[9px] text-muted-foreground">Duration</p></div>
                  <div className="bg-muted rounded-lg p-1.5"><p className="text-xs font-bold text-foreground">{t.marks}</p><p className="text-[9px] text-muted-foreground">Marks</p></div>
                </div>
                <button className="w-full py-2 bg-primary text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity">Start Practice</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Achievements ─────────────────────────────────────────────────────────────

function AchievementsScreen() {
  const [tab, setTab] = useState<"academic" | "school" | "sports" | "extra">("academic");

  const categories = {
    academic: {
      label: "Academic", icon: "🎓",
      items: [
        { name: "First Quiz Ace",        emoji: "🏆", desc: "Scored 100% in Unit Test 1",      date: "10 Jun 2025", unlocked: true },
        { name: "Bookworm",              emoji: "📖", desc: "Read 10 chapters this month",      date: "20 Jun 2025", unlocked: true },
        { name: "Streak Starter",        emoji: "🔥", desc: "7-day learning streak",            date: "15 Jun 2025", unlocked: true },
        { name: "Homework Hero",         emoji: "✅", desc: "5-day homework completion streak", date: "18 Jun 2025", unlocked: true },
        { name: "Math Wizard",           emoji: "✨", desc: "Complete all Math exercises",      date: "",            unlocked: false },
        { name: "Perfect Attendee",      emoji: "⭐", desc: "100% attendance this month",      date: "",            unlocked: false },
      ],
    },
    school: {
      label: "School", icon: "🏫",
      items: [
        { name: "Quiz Champion",         emoji: "🥇", desc: "Won school-level quiz contest",   date: "05 Jun 2025", unlocked: true },
        { name: "Science Fair Star",     emoji: "🔬", desc: "Top 3 in Science Fair 2025",      date: "12 Jun 2025", unlocked: true },
        { name: "Olympiad Participant",  emoji: "🌍", desc: "Participated in Math Olympiad",    date: "01 Jun 2025", unlocked: true },
        { name: "Hackathon Hero",        emoji: "💻", desc: "Complete school hackathon",        date: "",            unlocked: false },
        { name: "Debate Champion",       emoji: "🗣️", desc: "Win inter-school debate",          date: "",            unlocked: false },
        { name: "Cultural Star",         emoji: "🎭", desc: "Participate in annual function",   date: "",            unlocked: false },
      ],
    },
    sports: {
      label: "Sports", icon: "⚽",
      items: [
        { name: "Sprint Champion",       emoji: "🏃", desc: "1st in 100m race — Sports Day",   date: "08 Jun 2025", unlocked: true },
        { name: "Team Player",           emoji: "🤝", desc: "Part of school cricket team",     date: "10 Jun 2025", unlocked: true },
        { name: "Gold Medallist",        emoji: "🥇", desc: "Win a gold medal in any sport",   date: "",            unlocked: false },
        { name: "Tournament Victor",     emoji: "🏆", desc: "Win inter-school tournament",     date: "",            unlocked: false },
      ],
    },
    extra: {
      label: "Extra", icon: "🎨",
      items: [
        { name: "Art Exhibition",        emoji: "🖌️", desc: "Displayed artwork at school expo", date: "14 Jun 2025", unlocked: true },
        { name: "Music Performer",       emoji: "🎵", desc: "Performed at school annual event", date: "09 Jun 2025", unlocked: true },
        { name: "Volunteer Badge",       emoji: "💚", desc: "10 hours of community service",    date: "",            unlocked: false },
        { name: "Leadership Award",      emoji: "👑", desc: "Elected class representative",     date: "",            unlocked: false },
        { name: "Dance Performer",       emoji: "💃", desc: "Perform in school cultural event", date: "",            unlocked: false },
      ],
    },
  };

  const cat = categories[tab];
  const earned = cat.items.filter(i => i.unlocked).length;

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-extrabold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Achievements 🏆</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Celebrate your milestones across all areas.</p>
          </div>
          <div className="flex gap-2">
            {(Object.keys(categories) as Array<keyof typeof categories>).map(k => (
              <button key={k} onClick={() => setTab(k)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${tab === k ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                {categories[k].icon} {categories[k].label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div className="flex gap-3 mb-5">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 flex items-center gap-2">
            <Trophy size={14} className="text-amber-600" />
            <span className="text-sm font-bold text-amber-700">{earned} Earned</span>
          </div>
          <div className="bg-muted border border-border rounded-xl px-4 py-2 flex items-center gap-2">
            <Lock size={14} className="text-muted-foreground" />
            <span className="text-sm font-bold text-muted-foreground">{cat.items.length - earned} Locked</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {cat.items.map((b, i) => (
            <div key={i} className={`bg-card border rounded-2xl p-5 shadow-sm transition-all ${b.unlocked ? "border-amber-200 hover:-translate-y-0.5 hover:shadow-md" : "border-border opacity-55"}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{b.unlocked ? b.emoji : <Lock size={28} className="text-muted-foreground/40" />}</div>
                {b.unlocked && <div className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Earned</div>}
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{b.name}</h3>
              <p className="text-xs text-muted-foreground leading-snug">{b.desc}</p>
              {b.unlocked && b.date && <p className="text-[10px] text-muted-foreground/60 mt-2">🗓 {b.date}</p>}
              {!b.unlocked && <p className="text-[10px] text-muted-foreground/50 mt-2 italic">Not yet unlocked</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Notice Board ─────────────────────────────────────────────────────────────

function NoticeBoardScreen() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const categories = ["All", "Academic", "Administration", "Events", "Examinations", "Parents", "General"];
  const catColors: Record<string, string> = {
    Academic: "bg-blue-100 text-blue-700 border-blue-200",
    Administration: "bg-violet-100 text-violet-700 border-violet-200",
    Events: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Examinations: "bg-red-100 text-red-600 border-red-200",
    Parents: "bg-amber-100 text-amber-700 border-amber-200",
    General: "bg-gray-100 text-gray-600 border-gray-200",
  };
  const priorityColor: Record<string, string> = {
    High: "bg-red-100 text-red-600", Medium: "bg-amber-100 text-amber-700", Low: "bg-gray-100 text-gray-500",
  };

  const notices = [
    { title: "Unit Test 2 Timetable Released", category: "Examinations", date: "29 Jun 2025", priority: "High", unread: true, desc: "Unit Test 2 for all subjects will be held from 2nd July to 5th July 2025. Students are advised to check the subject-wise schedule on the school portal." },
    { title: "Annual Science Exhibition — Registrations Open", category: "Events", date: "28 Jun 2025", priority: "Medium", unread: true, desc: "The Annual Science Exhibition will be held on 15th July. Students from all standards are encouraged to participate. Register with your science teacher by 5th July." },
    { title: "Fee Payment Reminder — Q2 Fees Due", category: "Administration", date: "27 Jun 2025", priority: "High", unread: true, desc: "Second quarter fees are due by 30th June 2025. Parents are requested to submit fees online or at the school office. Late fee charges apply post due date." },
    { title: "Holiday Notice — Eid Al-Adha", category: "General", date: "26 Jun 2025", priority: "Low", unread: false, desc: "The school will remain closed on 7th July 2025 on account of Eid Al-Adha. Regular classes will resume on 8th July." },
    { title: "Parent-Teacher Meeting — 9th Standard", category: "Parents", date: "25 Jun 2025", priority: "Medium", unread: false, desc: "Parent-Teacher Meeting for 9th Standard students is scheduled for 12th July 2025 from 9:00 AM to 12:00 PM. Attendance is compulsory." },
    { title: "Mathematics Olympiad — School Selection Round", category: "Academic", date: "24 Jun 2025", priority: "Medium", unread: false, desc: "The school selection round for the Inter-School Mathematics Olympiad will be conducted on 3rd July. Interested students must submit their names to the Mathematics department by 1st July." },
    { title: "Library — New Books Added", category: "Academic", date: "23 Jun 2025", priority: "Low", unread: false, desc: "New reference books and NCERT supplements have been added to the school library. Students can issue books from Monday onwards. Limit: 2 books per student." },
  ];

  const filtered = notices.filter(n =>
    (activeCategory === "All" || n.category === activeCategory) &&
    (search === "" || n.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-extrabold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Notice Board 📌</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Official communications from your institution.</p>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notices…"
              className="pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-52" />
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-5">
          {categories.map(c => (
            <button key={c} onClick={() => setActiveCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeCategory === c ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{c}</button>
          ))}
        </div>

        {/* Unread count */}
        {filtered.filter(n => n.unread).length > 0 && (
          <div className="bg-primary/5 border border-primary/15 rounded-xl px-4 py-2.5 mb-4 flex items-center gap-2">
            <Bell size={14} className="text-primary" />
            <p className="text-xs font-semibold text-primary">{filtered.filter(n => n.unread).length} unread notice{filtered.filter(n => n.unread).length > 1 ? "s" : ""}</p>
          </div>
        )}

        {/* Notices list */}
        <div className="space-y-3">
          {filtered.map((n, i) => (
            <div key={i} className={`bg-card border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all ${n.unread ? "border-primary/25 bg-primary/[0.02]" : "border-border"}`}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {n.unread && <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />}
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-foreground leading-snug" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{n.title}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catColors[n.category] ?? "bg-muted text-muted-foreground"}`}>{n.category}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${priorityColor[n.priority]}`}>{n.priority} Priority</span>
                      <span className="text-[10px] text-muted-foreground">{n.date}</span>
                    </div>
                  </div>
                </div>
                {n.unread && <span className="shrink-0 text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full">NEW</span>}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2">{n.desc}</p>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Megaphone size={32} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">No notices found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Library ──────────────────────────────────────────────────────────────────

function LibraryScreen() {
  const [search, setSearch] = useState("");
  const [activeSubject, setActiveSubject] = useState("All");

  const subjectLib: Record<string, { title: string; type: string; pages: number }[]> = {
    English:        [{ title: "NCERT Textbook — First Flight", type: "Textbook",    pages: 180 }, { title: "English Grammar & Composition", type: "Workbook",    pages: 240 }, { title: "Teacher Notes — Prose", type: "Teacher Notes", pages: 45 }],
    Mathematics:    [{ title: "NCERT Mathematics",             type: "Textbook",    pages: 360 }, { title: "RD Sharma Class 9",            type: "Practice",     pages: 540 }, { title: "Formula Handbook",      type: "Reference",    pages: 60 }],
    Science:        [{ title: "NCERT Science",                 type: "Textbook",    pages: 280 }, { title: "Science Lab Manual",           type: "Lab Manual",   pages: 120 }, { title: "NCERT Exemplar",        type: "Exemplar",     pages: 220 }],
    "Social Science":[{ title: "NCERT History — India & World",type: "Textbook",    pages: 200 }, { title: "Geography",                    type: "Textbook",     pages: 160 }, { title: "Map Practice Book",     type: "Workbook",     pages: 80 }],
    Hindi:          [{ title: "Kshitij — Hindi Textbook",      type: "Textbook",    pages: 192 }, { title: "Hindi Vyakaran",               type: "Grammar",      pages: 210 }, { title: "Teacher Notes",         type: "Teacher Notes", pages: 38 }],
  };

  const teacherUploads = [
    { title: "Class Test Practice Set",  subject: "Mathematics",  type: "Question Bank", date: "28 Jun" },
    { title: "Essay Writing Samples",    subject: "English",      type: "Extra Notes",   date: "25 Jun" },
    { title: "Previous Year Papers 2024",subject: "All",          type: "Past Papers",   date: "22 Jun" },
    { title: "Science Diagram Sheets",   subject: "Science",      type: "Worksheets",    date: "20 Jun" },
    { title: "Sample Paper — Mid-Term",  subject: "All",          type: "Sample Paper",  date: "18 Jun" },
  ];

  const typeColor: Record<string, string> = {
    Textbook: "bg-blue-100 text-blue-700", Workbook: "bg-purple-100 text-purple-700",
    "Teacher Notes": "bg-amber-100 text-amber-700", Practice: "bg-green-100 text-green-700",
    "Lab Manual": "bg-teal-100 text-teal-700", Exemplar: "bg-indigo-100 text-indigo-700",
    Reference: "bg-pink-100 text-pink-700", Grammar: "bg-rose-100 text-rose-700",
    "Question Bank": "bg-orange-100 text-orange-700", "Extra Notes": "bg-cyan-100 text-cyan-700",
    "Past Papers": "bg-red-100 text-red-600", Worksheets: "bg-lime-100 text-lime-700",
    "Sample Paper": "bg-violet-100 text-violet-700",
  };

  const subjects = ["All", ...Object.keys(subjectLib)];

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-extrabold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Library 📚</h2>
            <p className="text-sm text-muted-foreground mt-0.5">All textbooks, resources, and teacher-uploaded materials.</p>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search books…"
              className="pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-48" />
          </div>
        </div>

        {/* Subject filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {subjects.map(s => (
            <button key={s} onClick={() => setActiveSubject(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeSubject === s ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{s}</button>
          ))}
        </div>

        {/* Subject collections */}
        {(activeSubject === "All" ? Object.keys(subjectLib) : [activeSubject].filter(s => subjectLib[s])).map(subj => (
          <div key={subj} className="mb-6">
            <h3 className="text-sm font-bold text-foreground mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{subj}</h3>
            <div className="grid grid-cols-3 gap-3">
              {subjectLib[subj]
                .filter(b => search === "" || b.title.toLowerCase().includes(search.toLowerCase()))
                .map((b, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Library size={16} className="text-primary" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground leading-snug" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{b.title}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${typeColor[b.type] ?? "bg-muted text-muted-foreground"}`}>{b.type}</span>
                        <span className="text-[10px] text-muted-foreground">{b.pages}p</span>
                      </div>
                      <button className="mt-2 text-[10px] text-primary font-semibold hover:underline flex items-center gap-1"><Eye size={10} /> Open</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        {/* Teacher uploads */}
        <div className="mt-4">
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <GraduationCap size={15} className="text-primary" /> Teacher Uploaded Resources
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {teacherUploads.filter(f => activeSubject === "All" || f.subject === activeSubject || f.subject === "All").map((f, i) => (
              <div key={i} className="bg-gradient-to-br from-primary/5 to-indigo-50 border border-primary/15 rounded-xl p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0"><FileText size={15} className="text-primary" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground leading-snug" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.title}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${typeColor[f.type] ?? "bg-muted text-muted-foreground"}`}>{f.type}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">{f.subject} · Added {f.date}</p>
                    <button className="mt-1.5 text-[10px] text-primary font-semibold hover:underline flex items-center gap-1"><Download size={10} /> Download</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Downloads — File Manager ─────────────────────────────────────────────────

function DownloadsScreen() {
  const [tab, setTab] = useState<"all" | "downloaded" | "uploaded" | "shared">("all");
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date");
  const [search, setSearch] = useState("");

  const allFiles = [
    { name: "My English Notes — Ch2",    ext: "txt", subject: "English",     size: "12 KB",  date: "24 Jun 2025", type: "downloaded", teacher: "Self" },
    { name: "Math Formulas Summary",     ext: "txt", subject: "Mathematics", size: "8 KB",   date: "22 Jun 2025", type: "uploaded",   teacher: "Self" },
    { name: "Science Diagrams Notes",    ext: "txt", subject: "Science",     size: "15 KB",  date: "20 Jun 2025", type: "downloaded", teacher: "Self" },
    { name: "NCERT Science Exemplar",    ext: "pdf", subject: "Science",     size: "2.1 MB", date: "18 Jun 2025", type: "shared",     teacher: "Mrs. Sharma" },
    { name: "Hindi Pad — Surdas Notes",  ext: "txt", subject: "Hindi",       size: "6 KB",   date: "17 Jun 2025", type: "downloaded", teacher: "Self" },
    { name: "Class Test Practice Set",   ext: "pdf", subject: "Mathematics", size: "1.2 MB", date: "28 Jun 2025", type: "shared",     teacher: "Mr. Joshi" },
    { name: "Essay Writing Samples",     ext: "pdf", subject: "English",     size: "850 KB", date: "25 Jun 2025", type: "shared",     teacher: "Ms. Nair" },
    { name: "Science Lab Report",        ext: "pdf", subject: "Science",     size: "340 KB", date: "19 Jun 2025", type: "uploaded",   teacher: "Self" },
  ];

  const extColor: Record<string, string> = { pdf: "bg-red-100 text-red-600", txt: "bg-blue-100 text-blue-700", docx: "bg-blue-100 text-blue-700" };
  const typeIcon: Record<string, React.ReactNode> = {
    downloaded: <Download size={11} className="text-emerald-600" />,
    uploaded: <ArrowRight size={11} className="text-primary" />,
    shared: <Share2 size={11} className="text-amber-600" />,
  };

  const filtered = allFiles
    .filter(f => (tab === "all" || f.type === tab) && (search === "" || f.name.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => sortBy === "name" ? a.name.localeCompare(b.name) : sortBy === "size" ? parseFloat(b.size) - parseFloat(a.size) : b.date.localeCompare(a.date));

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-extrabold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Downloads</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Your personal file manager — notes, downloads, and shared files.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files…"
                className="pl-8 pr-3 py-2 bg-card border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 w-44" />
            </div>
            <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
              {(["date","name","size"] as const).map(s => (
                <button key={s} onClick={() => setSortBy(s)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-colors ${sortBy === s ? "bg-white shadow text-foreground" : "text-muted-foreground"}`}>{s}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-5">
          {([["all","All Files"],["downloaded","Downloaded"],["uploaded","Uploaded"],["shared","Shared"]] as const).map(([id,label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${tab === id ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>{label}</button>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-x-4 px-4 py-2.5 border-b border-border bg-muted/30 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            <span>Type</span><span>Name</span><span>Subject</span><span>Size</span><span>Date</span><span>Actions</span>
          </div>
          {filtered.map((f, i) => (
            <div key={i} className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-x-4 items-center px-4 py-3 border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
              <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${extColor[f.ext] ?? "bg-gray-100 text-gray-500"}`}>{f.ext}</div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{f.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">{typeIcon[f.type]}<p className="text-[10px] text-muted-foreground capitalize">{f.type} · {f.teacher}</p></div>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{f.subject}</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{f.size}</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{f.date.split(" ").slice(0,2).join(" ")}</span>
              <div className="flex items-center gap-1">
                <button title="Open" className="w-6 h-6 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"><Eye size={12} className="text-muted-foreground" /></button>
                <button title="Share" className="w-6 h-6 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"><Share2 size={12} className="text-muted-foreground" /></button>
                <button title="Delete" className="w-6 h-6 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors"><Trash2 size={12} className="text-muted-foreground hover:text-red-500" /></button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground"><FileDown size={32} className="mx-auto mb-2 opacity-20" /><p className="text-sm">No files found</p></div>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsScreen() {
  const [notifs, setNotifs] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState("English");
  const Toggle = ({ on, onChange }: { on: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`relative w-11 h-6 rounded-full transition-colors ${on ? "bg-primary" : "bg-muted"}`}>
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
  return (
    <div className="flex-1 overflow-y-auto p-7 hide-scrollbar">
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-extrabold text-foreground mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Settings</h2>
        <p className="text-sm text-muted-foreground mb-7">Manage your app preferences.</p>
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Profile</h3>
            <p className="text-sm text-foreground">To edit your profile details, click the profile icon in the top-right corner of the header.</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Preferences</h3>
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-semibold text-foreground">Notifications</p><p className="text-xs text-muted-foreground">Task reminders and teacher messages</p></div>
              <Toggle on={notifs} onChange={() => setNotifs(o => !o)} />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div><p className="text-sm font-semibold text-foreground">Dark Mode</p><p className="text-xs text-muted-foreground">Switch to a darker interface</p></div>
              <Toggle on={darkMode} onChange={() => setDarkMode(o => !o)} />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div><p className="text-sm font-semibold text-foreground">Language</p><p className="text-xs text-muted-foreground">Interface display language</p></div>
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
              <div className="flex justify-between"><span className="text-muted-foreground">Version</span><span className="font-semibold text-foreground">1.0.0</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Edition</span><span className="font-semibold text-foreground">Desktop (Tauri)</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Build</span><span className="font-semibold text-foreground">June 2025</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// ─── Student Dashboard Router ─────────────────────────────────────────────────

function StudentDashboard({
  userName, screen, selectedSubject, selectedChapter, leftPanelMode,
  notebookNotes, onNotesChange, onNavigate, onSelectSubject, onOpenChapter,
}: {
  userName: string; screen: StudentScreen; selectedSubject: string;
  selectedChapter: ChapterRef | null; leftPanelMode: LeftPanelMode;
  notebookNotes: Record<string, string>;
  onNotesChange: (key: string, html: string) => void;
  onNavigate: (s: StudentScreen) => void;
  onSelectSubject: (name: string) => void;
  onOpenChapter: (ch: ChapterRef) => void;
}) {
  switch (screen) {
    case "subjects":       return <SubjectsScreen onSelect={name => { onSelectSubject(name); onNavigate("subject-detail"); }} />;
    case "subject-detail": return <SubjectDetailScreen subjectName={selectedSubject} onBack={() => onNavigate("subjects")} onOpenChapter={onOpenChapter} />;
    case "workspace":      return selectedChapter ? (
      <WorkspaceScreen chapter={selectedChapter} leftPanelMode={leftPanelMode} notebookNotes={notebookNotes} onNotesChange={onNotesChange} onBackToSubject={() => onNavigate("subject-detail")} />
    ) : null;
    case "notebook":       return <StandaloneNotebookScreen notebookNotes={notebookNotes} onNotesChange={onNotesChange} />;
    case "todays-task":    return <TodaysTaskScreen />;
    case "test-score":     return <TestScoreScreen />;
    case "achievements":   return <AchievementsScreen />;
    case "notice-board":   return <NoticeBoardScreen />;
    case "library":        return <LibraryScreen />;
    case "downloads":      return <DownloadsScreen />;
    case "settings":       return <SettingsScreen />;
    default:               return <StudentHome userName={userName} onNavigate={onNavigate} />;
  }
}


// ─── PDF Viewer Panel ────────────────────────────────────────────────────────

function PDFViewerPanel({ subject, chapter }: { subject: string; chapter: ChapterRef }) {
  const [zoom, setZoom] = useState(100);
  const [page, setPage] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);
  const key = `${subject}-${chapter.idx}`;
  const data = CHAPTER_TEXT[key] || CHAPTER_TEXT[`${subject}-0`] || {
    quote: "Knowledge is the foundation of all progress.",
    body: [
      `This chapter covers ${chapter.name} in ${subject}. The content explores core concepts, definitions, and their real-world applications.`,
      "Students are encouraged to read carefully, annotate key passages, and take detailed notes in the notebook panel on the right.",
      "Pay attention to highlighted terms, examples, and exercises. Each concept builds on the previous one, forming a comprehensive understanding of the subject.",
    ],
  };
  const totalPages = Math.max(1, data.body.length);
  const changeZoom = (delta: number) => setZoom(z => Math.min(200, Math.max(60, z + delta)));
  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-border shrink-0 gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-5 h-5 rounded bg-red-500 flex items-center justify-center shrink-0">
            <FileText size={10} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-foreground truncate leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {subject} — Ch. {chapter.num}
            </p>
            <p className="text-[10px] text-muted-foreground truncate leading-tight">{chapter.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors disabled:opacity-30">
            <ChevronLeft size={13} />
          </button>
          <span className="text-[11px] text-muted-foreground font-medium w-16 text-center">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors disabled:opacity-30">
            <ChevronRight size={13} />
          </button>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => changeZoom(-10)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors"><ZoomOut size={12} /></button>
          <span className="text-[11px] font-semibold text-foreground w-10 text-center">{zoom}%</span>
          <button onClick={() => changeZoom(10)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors"><ZoomIn size={12} /></button>
          <button onClick={() => setZoom(100)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors"><RefreshCw size={11} className="text-muted-foreground" /></button>
        </div>
      </div>
      <div ref={contentRef} className="flex-1 overflow-y-auto hide-scrollbar px-6 py-6 flex justify-center">
        <div className="bg-white shadow-xl rounded origin-top transition-all duration-150"
          style={{ width: `${zoom}%`, maxWidth: `${zoom * 6}px`, minWidth: 280, padding: "40px 48px",
            transform: zoom > 100 ? `scale(${zoom / 100})` : "none", transformOrigin: "top center" }}>
          <div className="mb-6 pb-4 border-b-2 border-gray-200">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Chapter {chapter.num}</p>
            <h1 className="text-xl font-extrabold text-gray-900 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{chapter.name}</h1>
          </div>
          <blockquote className="border-l-4 border-primary/40 pl-4 mb-6 bg-primary/3 py-2 rounded-r">
            <p className="text-sm italic text-gray-600 leading-relaxed">"{data.quote}"</p>
          </blockquote>
          <div className="space-y-4 text-sm text-gray-800 leading-relaxed">
            {data.body.slice((page - 1) * 2, page * 2 + 1).map((para, i) => (
              <p key={i} className="text-justify indent-6">{para}</p>
            ))}
          </div>
          <div className="mt-8 pt-4 border-t border-gray-200 flex items-center justify-between text-[10px] text-gray-400">
            <span>{subject} — Class 9</span>
            <span>Page {((page - 1) * 3) + 1}</span>
            <span>NCERT</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AITutorPlaceholder({ subject, chapter }: { subject: string; chapter: ChapterRef }) {
  const [input, setInput] = useState("");
  const messages = [
    { role: "ai", text: `Hi! I'm your AI Mentor. I'm here to help you understand **${chapter.name}** in ${subject}.` },
    { role: "ai", text: "Ask me any question about this chapter — definitions, explanations, examples, or practice problems!" },
  ];
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-gradient-to-r from-primary/5 to-indigo-50 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm"><Bot size={16} className="text-white" /></div>
        <div>
          <p className="text-xs font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Mentor</p>
          <p className="text-[10px] text-muted-foreground">{subject} · {chapter.name}</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] text-emerald-600 font-medium">Online</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className="flex justify-start">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 shrink-0 mt-0.5"><Bot size={12} className="text-primary" /></div>
            <div className="max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed bg-gray-100 text-foreground rounded-tl-none">{m.text}</div>
          </div>
        ))}
      </div>
      <div className="mx-3 mb-3 px-3 py-2 bg-primary/5 border border-primary/15 rounded-xl">
        <p className="text-[10px] text-primary font-semibold text-center">🚀 Full AI Tutor coming soon — layout ready</p>
      </div>
      <div className="px-3 pb-3 shrink-0">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 border border-border">
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask AI Mentor anything…"
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none" />
          <button className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity">
            <ArrowRight size={11} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function LeftPanelContent({ mode, subject, chapter }: { mode: LeftPanelMode; subject: string; chapter: ChapterRef }) {
  return mode === "ai-tutor"
    ? <AITutorPlaceholder subject={subject} chapter={chapter} />
    : <PDFViewerPanel subject={subject} chapter={chapter} />;
}

export function WorkspaceScreen({
  chapter, leftPanelMode, notebookNotes, onNotesChange, onBackToSubject,
}: {
  chapter: ChapterRef | null;
  leftPanelMode: LeftPanelMode;
  notebookNotes: Record<string, string>;
  onNotesChange: (key: string, html: string) => void;
  onBackToSubject: () => void;
}) {
  const [splitRatio, setSplitRatio] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setSplitRatio(Math.min(72, Math.max(28, ((e.clientX - rect.left) / rect.width) * 100)));
  }, []);
  const handleMouseUp = useCallback(() => { isDragging.current = false; }, []);
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);
  if (!chapter) return null;
  const chapterKey = `${chapter.subject}-ch${chapter.num}`;
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-border shrink-0">
        <button onClick={onBackToSubject} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft size={14} /> {chapter.subject}
        </button>
        <div className="w-px h-4 bg-border" />
        <span className="text-xs font-semibold text-foreground truncate">Ch. {chapter.num} — {chapter.name}</span>
        <div className="ml-auto flex items-center gap-2 text-[10px] text-muted-foreground">
          <GripVertical size={12} /><span>Drag divider to resize</span>
        </div>
      </div>
      <div ref={containerRef} className="flex-1 flex overflow-hidden select-none">
        <div className="flex flex-col overflow-hidden" style={{ width: `${splitRatio}%` }}>
          <LeftPanelContent mode={leftPanelMode} subject={chapter.subject} chapter={chapter} />
        </div>
        <div className="w-1.5 shrink-0 bg-border hover:bg-primary/50 active:bg-primary cursor-col-resize transition-colors flex items-center justify-center group"
          onMouseDown={() => { isDragging.current = true; }}>
          <div className="w-0.5 h-8 bg-border group-hover:bg-primary/40 rounded-full transition-colors" />
        </div>
        <div className="flex flex-col overflow-hidden" style={{ width: `${100 - splitRatio - 0.4}%` }}>
          <NotebookEditorPanel chapterKey={chapterKey} subject={chapter.subject} chapterName={chapter.name}
            initialContent={notebookNotes[chapterKey] || ""} onContentChange={onNotesChange} />
        </div>
      </div>
    </div>
  );
}

export { StudentSideMenu, StudentDashboard, CHAPTER_TEXT, SUBJECTS, CHAPTERS };
