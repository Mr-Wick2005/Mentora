import { useState, useEffect, useRef, useCallback } from "react";
import {
  Menu, X, ChevronLeft, ChevronRight, BookMarked, Bot, Wifi,
  Battery, Bell, GraduationCap, BookOpen, Shield, User, Hash,
  ArrowRight, AlertCircle, Home, Users, BarChart3, Settings, CircleCheck,
} from "lucide-react";
import { StudentSideMenu, StudentDashboard, SUBJECTS } from "./components/student-screens";
import { TeacherSideMenu, TeacherProfilePopup, TeacherDashboard } from "./components/teacher-screens";
import { AdminSideMenu, AdminProfilePopup, AdminDashboard } from "./components/admin-screens";
import type { Role, Page, LeftPanelMode, ChapterRef, StudentScreen, TeacherScreen, AdminScreen } from "./components/types";

// ─── AI Mentor Panel ─────────────────────────────────────────────────────────

interface ChatMsg { id: string; role: "user" | "ai"; content: string; }

const ROLE_SUGGESTIONS: Record<Role, { label: string; prompt: string }[]> = {
  student: [
    { label: "📚 Explain a concept",  prompt: "Explain Linear Equations in two variables simply." },
    { label: "📝 Homework help",       prompt: "Help me with my Science homework on Life Processes." },
    { label: "🧪 Quiz me",             prompt: "Quiz me on today's Mathematics chapter." },
    { label: "📅 Study plan",          prompt: "Help me create a revision plan for my unit test." },
  ],
  teacher: [
    { label: "📋 Lesson plan",         prompt: "Create a lesson plan for Linear Equations, Class 9." },
    { label: "❓ Question paper",       prompt: "Generate 10 MCQs on Chemical Reactions." },
    { label: "📊 Student insights",    prompt: "Common mistakes students make in Algebra?" },
    { label: "📝 Assignment ideas",    prompt: "Creative assignment ideas for English Chapter 2." },
  ],
  admin: [
    { label: "📊 School report",       prompt: "Summarise this month's academic activities." },
    { label: "📌 Draft a notice",      prompt: "Draft a Parent-Teacher Meeting notice." },
    { label: "📈 Key metrics",         prompt: "Which KPIs should I track for student performance?" },
    { label: "🗓 Exam timetable",      prompt: "Help plan the exam timetable for July 2025." },
  ],
};

const AI_REPLY: { kw: string[]; reply: string }[] = [
  { kw: ["hello","hi","hey"], reply: "Hello! Great to see you 😊 What would you like to work on today?" },
  { kw: ["linear equation","ax+by","linear"], reply: "A linear equation in two variables has the form **ax + by + c = 0**.\n\nSolutions to this equation form a **straight line** when graphed — that's where the name comes from!\n\nWould you like a worked example?" },
  { kw: ["life process","respiration","photosynthesis","nutrition"], reply: "Life processes keep organisms alive. The four key ones are:\n\n• **Nutrition** — obtaining food (plants use photosynthesis)\n• **Respiration** — releasing energy from food\n• **Transportation** — moving substances in the body\n• **Excretion** — removing waste products\n\nWhich one shall we explore first?" },
  { kw: ["mandela","freedom","chapter"], reply: "In 'Long Walk to Freedom', Mandela defines **courage** not as the absence of fear — but as the triumph over it.\n\nHe describes two obligations every man has: to his family, and to his people. Under apartheid, fulfilling both was nearly impossible.\n\nWould you like help with specific questions from this chapter?" },
  { kw: ["test","exam","prepare","revision","quiz"], reply: "Smart move to start early! Here's a quick strategy:\n\n1. **Review** class notes first\n2. **Identify** weak topics (check past test scores)\n3. **Practice** — especially questions you've got wrong before\n4. **Summarise** each chapter in 5 key points\n5. **Attempt** a practice test the day before\n\nWant me to quiz you on a specific subject?" },
  { kw: ["homework","help","assignment"], reply: "Of course! Tell me:\n\n1. Which **subject** is the homework for?\n2. What is the **specific question or topic**?\n\nI'll guide you step by step — making sure you understand it, not just complete it!" },
  { kw: ["thank","thanks","great","good","perfect"], reply: "You're welcome! 🎉 Every question you ask brings you closer to mastery. Keep it up — you're doing amazing. Anything else you'd like to explore?" },
  { kw: ["lesson plan","planning","class"], reply: "Here's a structure for an effective lesson plan:\n\n**1. Learning Objectives** (2–3 clear outcomes)\n**2. Warm-Up** (5 min — connect to prior knowledge)\n**3. Direct Instruction** (15 min — introduce concept)\n**4. Guided Practice** (10 min — work together)\n**5. Independent Practice** (10 min)\n**6. Exit Ticket** (5 min — check understanding)\n\nWant me to fill this out for a specific topic?" },
];

const TUTOR_LESSONS: Record<string, Record<string, { intro: string; steps: string[]; question: string; hint: string; summary: string[] }>> = {
  Mathematics: {
    "Linear Equations in Two Variables": {
      intro: "Let's learn about **Linear Equations in Two Variables** — a foundational concept that connects algebra to geometry!",
      steps: [
        "**What is it?** A linear equation in two variables is written as **ax + by + c = 0**, where a, b, c are real numbers and a, b are not both zero.",
        "**Visualising it:** Every solution (x, y) that satisfies the equation is a point. Together, all solutions form a perfect **straight line** on a graph. That's the geometric meaning!",
        "**Example:** Take **2x + 3y = 12**. If x = 0 → y = 4. If x = 3 → y = 2. If x = 6 → y = 0. Plot these three points and they fall on a straight line.",
        "**Key insight:** A linear equation in two variables has **infinitely many solutions**. There's no single answer — every point on the line is a valid solution.",
      ],
      question: "Now it's your turn! In the equation **2x + 3y = 12**, what is the value of y when x = 6?",
      hint: "Substitute x = 6: **2(6) + 3y = 12** → **12 + 3y = 12** → **3y = 0** → y = ?",
      summary: ["A linear equation in two variables: ax + by + c = 0", "Solutions form a straight line when graphed", "Every linear equation has infinitely many solutions", "Substitute one variable to find the other"],
    },
    "Real Numbers": {
      intro: "Let's explore **Real Numbers** — the complete number system that forms the backbone of all mathematics!",
      steps: [
        "**Real numbers (ℝ)** include every number you can place on a number line — both rational and irrational numbers.",
        "**Rational numbers** can be written as p/q (q ≠ 0). Examples: 3/4, 0.5, -7, 0. Their decimal form either terminates (0.25) or repeats (0.333...).",
        "**Irrational numbers** cannot be expressed as p/q. Examples: √2 = 1.41421..., π = 3.14159... Their decimals never terminate or repeat.",
        "**Euclid's Division Lemma:** For any two positive integers a, b: **a = bq + r** where 0 ≤ r < b. This powerful result lets us find the HCF of any two numbers.",
      ],
      question: "Can you tell me: is √9 a rational or irrational number? Give a reason.",
      hint: "Try simplifying √9 first. Can you write it as a fraction p/q?",
      summary: ["ℝ = Rational + Irrational numbers", "Rational: expressible as p/q", "Irrational: non-terminating, non-repeating decimals", "Euclid's Lemma: a = bq + r underpins the HCF algorithm"],
    },
  },
  Science: {
    "Chemical Reactions & Equations": {
      intro: "Welcome to **Chemical Reactions & Equations** — chemistry in action! Let's discover how matter transforms.",
      steps: [
        "A **chemical reaction** occurs when one or more substances (reactants) are converted into new substances (products) with different properties.",
        "We represent reactions using **chemical equations**. Reactants go on the left, products on the right, separated by an arrow (→). Example: **Mg + O₂ → MgO**",
        "The **Law of Conservation of Mass** states: atoms are neither created nor destroyed in a chemical reaction — they are only rearranged. This is why we must **balance** equations.",
        "Balancing **2Mg + O₂ → 2MgO**: count atoms on both sides — 2 Mg and 2 O on each side. ✓ Balanced!",
      ],
      question: "Why do we need to balance chemical equations? Which law requires this?",
      hint: "Think: what happens to atoms during a reaction? Are any created or destroyed?",
      summary: ["Chemical reactions convert reactants → products", "Represented using balanced chemical equations", "Law of Conservation of Mass: atoms are rearranged, not created/destroyed", "Always count atoms on both sides to verify balance"],
    },
    "Life Processes": {
      intro: "Let's explore **Life Processes** — the essential functions that keep every living organism alive!",
      steps: [
        "The essential life processes are: **Nutrition, Respiration, Transportation, and Excretion**. Every living organism performs all four.",
        "**Nutrition:** Plants make food by **photosynthesis**: 6CO₂ + 6H₂O + sunlight → C₆H₁₂O₆ + 6O₂. Animals obtain nutrients by consuming food.",
        "**Respiration:** Aerobic — uses oxygen, produces CO₂ + H₂O + energy. Anaerobic — no oxygen, produces lactic acid or alcohol. Both release ATP (energy).",
        "**Transportation** in plants: Water moves up via xylem. Food moves down via phloem. In humans, blood carries oxygen and nutrients throughout the body.",
      ],
      question: "What is the key difference between aerobic and anaerobic respiration?",
      hint: "The difference is in whether **oxygen** is used or not. What gas is released in each?",
      summary: ["4 life processes: Nutrition, Respiration, Transportation, Excretion", "Photosynthesis equation: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂", "Aerobic uses O₂; anaerobic does not", "Xylem transports water; phloem transports food"],
    },
  },
  English: {
    "Nelson Mandela — Long Walk to Freedom": {
      intro: "Let's dive into **Nelson Mandela: Long Walk to Freedom** — a powerful account of courage, sacrifice, and freedom.",
      steps: [
        "This is an excerpt from Mandela's autobiography, describing his **inauguration as South Africa's first democratically elected President** on 10 May 1994.",
        "Mandela describes **two obligations** every man has: to his family and to his people. Under apartheid, fulfilling both simultaneously was nearly impossible.",
        "**Courage**, for Mandela, is not the absence of fear. It is **the triumph over fear** — he was afraid many times, but always acted despite his fear.",
        "The chapter ends with a vision: the oppressor and the oppressed must both be liberated. Freedom is meaningless unless shared by all.",
      ],
      question: "In your own words, how does Mandela define courage? And why is this definition important?",
      hint: "Look for the phrase about fear. He says courage is NOT the absence of something — what is it then?",
      summary: ["Inauguration as South Africa's first democratic President", "Mandela's two obligations: to family and to his people", "Courage = triumph over fear, not absence of it", "True freedom means liberating both the oppressed and the oppressor"],
    },
  },
};

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const key = i;
    if (line.trim() === "") return <div key={key} className="h-2" />;
    const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const formatted = bold.replace(/_(.*?)_/g, '<em>$1</em>');
    if (line.startsWith("• ")) return (
      <div key={key} className="flex items-start gap-1.5 my-0.5">
        <div className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
        <span className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted.slice(2) }} />
      </div>
    );
    if (/^\d+\.\s/.test(line)) return (
      <div key={key} className="flex items-start gap-2 my-0.5">
        <span className="text-xs font-bold text-primary/70 mt-0.5 shrink-0 w-4">{line.match(/^(\d+)/)?.[1]}.</span>
        <span className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted.replace(/^\d+\.\s/, '') }} />
      </div>
    );
    return <p key={key} className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />;
  });
}

function AIMentorPanel({ userName, role, onClose }: {
  userName: string; role: Role; onClose: () => void;
}) {
  const [mode, setMode] = useState<"assistant" | "tutor">("assistant");
  const [messages, setMessages] = useState<ChatMsg[]>([{
    id: "0", role: "ai",
    content: `Hello, ${userName.split(" ")[0]}! 👋\n\nI'm your AI Mentor — here to help you learn, understand concepts, and grow every day.\n\nHow can I assist you today?`,
  }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Tutor state
  const [tutorStep, setTutorStep] = useState<"select-subject" | "select-chapter" | "lesson">("select-subject");
  const [tutorSubject, setTutorSubject] = useState("");
  const [tutorChapter, setTutorChapter] = useState("");
  const [lessonPhase, setLessonPhase] = useState<"teaching" | "question" | "done">("teaching");
  const [stepIdx, setStepIdx] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const getReply = (msg: string) => {
    const low = msg.toLowerCase();
    for (const { kw, reply } of AI_REPLY) {
      if (kw.some(k => low.includes(k))) return reply;
    }
    return "That's a great question! Could you give me a bit more context?\n\n• Which **subject** is this about?\n• Is it related to a specific **chapter** or concept?\n\nWith more details, I can give you a much more helpful and tailored answer!";
  };

  const sendMessage = (text = input) => {
    if (!text.trim()) return;
    setMessages(p => [...p, { id: Date.now().toString(), role: "user", content: text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(p => [...p, { id: (Date.now() + 1).toString(), role: "ai", content: getReply(text) }]);
    }, 900 + Math.random() * 700);
  };

  const switchToTutor = () => {
    setMode("tutor");
    setTutorStep("select-subject");
    setTutorSubject(""); setTutorChapter("");
    setLessonPhase("teaching"); setStepIdx(0); setShowHint(false); setUserAnswer("");
  };

  const switchToAssistant = () => {
    setMode("assistant");
    setMessages([{ id: "0", role: "ai", content: `Welcome back, ${userName.split(" ")[0]}! 😊 We're back in assistant mode. What would you like help with?` }]);
  };

  const lesson = tutorSubject && tutorChapter ? TUTOR_LESSONS[tutorSubject]?.[tutorChapter] : null;
  const subjects = Object.keys(TUTOR_LESSONS);
  const chapters = tutorSubject ? Object.keys(TUTOR_LESSONS[tutorSubject] || {}) : [];

  const SuggestionChips = () => (
    <div className="px-3 pb-3 flex flex-wrap gap-1.5">
      {ROLE_SUGGESTIONS[role].map((s, i) => (
        <button key={i} onClick={() => sendMessage(s.prompt)}
          className="text-[11px] bg-primary/8 hover:bg-primary/15 text-primary border border-primary/20 px-2.5 py-1 rounded-full font-medium transition-colors">
          {s.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0 bg-gradient-to-r from-primary/5 to-indigo-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm shrink-0">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Mentor</p>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <p className="text-[10px] text-muted-foreground capitalize">{role} · Online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Mode toggle */}
          <div className="flex items-center bg-muted rounded-xl p-1 gap-0.5">
            <button onClick={switchToAssistant}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${mode === "assistant" ? "bg-white shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              Assistant
            </button>
            <button onClick={switchToTutor}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${mode === "tutor" ? "bg-primary text-white shadow" : "text-muted-foreground hover:text-foreground"}`}>
              Tutor
            </button>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X size={15} className="text-foreground/50" />
          </button>
        </div>
      </div>

      {/* ── ASSISTANT MODE ── */}
      {mode === "assistant" && (
        <>
          <div className="flex-1 overflow-y-auto hide-scrollbar px-3 py-3 space-y-3">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
                {m.role === "ai" && (
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={12} className="text-primary" />
                  </div>
                )}
                <div className={`max-w-[85%] px-3 py-2.5 rounded-2xl text-sm ${
                  m.role === "user"
                    ? "bg-primary text-white rounded-tr-sm"
                    : "bg-muted/60 text-foreground rounded-tl-sm"
                }`}>
                  {m.role === "ai" ? <div className="space-y-1">{renderMarkdown(m.content)}</div> : m.content}
                </div>
                {m.role === "user" && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5 text-white text-[10px] font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="flex gap-2 items-start">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot size={12} className="text-primary" />
                </div>
                <div className="bg-muted/60 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                  {[0, 150, 300].map(d => (
                    <div key={d} className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length <= 2 && <SuggestionChips />}

          {/* Input */}
          <div className="px-3 pb-3 shrink-0">
            <div className="flex items-end gap-2 bg-muted/40 border border-border rounded-2xl px-3 py-2.5">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Ask anything…"
                rows={1}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none resize-none max-h-24 hide-scrollbar"
                style={{ lineHeight: "1.5" }}
              />
              <button onClick={() => sendMessage()}
                disabled={!input.trim() || typing}
                className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity disabled:opacity-40">
                <ArrowRight size={14} className="text-white" />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground/50 text-center mt-1.5">AI Mentor · Powered by AI Smart Notebook</p>
          </div>
        </>
      )}

      {/* ── TUTOR MODE ── */}
      {mode === "tutor" && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {tutorStep === "select-subject" && (
            <div className="flex-1 overflow-y-auto hide-scrollbar p-4">
              <div className="text-center mb-5 pt-2">
                <div className="text-3xl mb-2">🎓</div>
                <h3 className="text-base font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>What would you like to study?</h3>
                <p className="text-xs text-muted-foreground mt-1">Select a subject to begin your lesson</p>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {subjects.map(s => {
                  const sub = SUBJECTS.find(x => x.name === s);
                  return (
                    <button key={s} onClick={() => { setTutorSubject(s); setTutorStep("select-chapter"); }}
                      className="flex items-center gap-3 p-3.5 bg-card border border-border rounded-xl hover:border-primary/30 hover:bg-primary/3 hover:shadow-sm transition-all text-left">
                      <div className={`w-9 h-9 rounded-xl ${sub?.color ?? "bg-primary/10 text-primary"} flex items-center justify-center text-base font-bold shrink-0`}>
                        {sub?.abbr ?? s[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{s}</p>
                        <p className="text-[10px] text-muted-foreground">{Object.keys(TUTOR_LESSONS[s] || {}).length} lessons available</p>
                      </div>
                      <ChevronRight size={14} className="ml-auto text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {tutorStep === "select-chapter" && (
            <div className="flex-1 overflow-y-auto hide-scrollbar p-4">
              <button onClick={() => setTutorStep("select-subject")}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors">
                <ChevronLeft size={13} /> Back to subjects
              </button>
              <h3 className="text-sm font-bold text-foreground mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{tutorSubject}</h3>
              <p className="text-xs text-muted-foreground mb-4">Choose a chapter to begin</p>
              <div className="space-y-2">
                {chapters.map((ch, i) => (
                  <button key={ch} onClick={() => { setTutorChapter(ch); setTutorStep("lesson"); setLessonPhase("teaching"); setStepIdx(0); setShowHint(false); setUserAnswer(""); }}
                    className="w-full flex items-center gap-3 p-3.5 bg-card border border-border rounded-xl hover:border-primary/30 hover:bg-primary/3 hover:shadow-sm transition-all text-left">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">{i + 1}</div>
                    <span className="text-sm font-semibold text-foreground flex-1">{ch}</span>
                    <ChevronRight size={13} className="text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {tutorStep === "lesson" && lesson && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Lesson header */}
              <div className="px-4 py-3 border-b border-border shrink-0">
                <button onClick={() => setTutorStep("select-chapter")}
                  className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors mb-1">
                  <ChevronLeft size={11} /> {tutorSubject}
                </button>
                <h3 className="text-sm font-bold text-foreground leading-snug" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{lesson.title}</h3>
                {/* Progress dots */}
                <div className="flex items-center gap-1.5 mt-2">
                  {lesson.steps.map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all ${i < stepIdx ? "bg-primary w-4" : i === stepIdx && lessonPhase === "teaching" ? "bg-primary w-6" : "bg-muted w-3"}`} />
                  ))}
                  <div className={`h-1 rounded-full transition-all ${lessonPhase === "question" || lessonPhase === "done" ? "bg-amber-400 w-4" : "bg-muted w-3"}`} />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-4">
                {/* Intro */}
                <div className="bg-primary/5 border border-primary/15 rounded-xl p-3.5">
                  <div className="space-y-1">{renderMarkdown(lesson.intro)}</div>
                </div>

                {/* Current step */}
                {lessonPhase === "teaching" && (
                  <div className="space-y-3">
                    <div className="bg-card border border-border rounded-xl p-3.5 shadow-sm">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">Step {stepIdx + 1} of {lesson.steps.length}</p>
                      <div className="space-y-1">{renderMarkdown(lesson.steps[stepIdx])}</div>
                    </div>
                    <div className="flex gap-2">
                      {stepIdx > 0 && (
                        <button onClick={() => setStepIdx(i => i - 1)}
                          className="flex-1 py-2 border border-border rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors">
                          ← Previous
                        </button>
                      )}
                      {stepIdx < lesson.steps.length - 1 ? (
                        <button onClick={() => setStepIdx(i => i + 1)}
                          className="flex-1 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity">
                          Next →
                        </button>
                      ) : (
                        <button onClick={() => setLessonPhase("question")}
                          className="flex-1 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity">
                          Test my understanding →
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Check-in question */}
                {lessonPhase === "question" && (
                  <div className="space-y-3">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
                      <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-2">Your Turn! 🎯</p>
                      <div className="space-y-1">{renderMarkdown(lesson.question)}</div>
                    </div>
                    {!showHint && (
                      <button onClick={() => setShowHint(true)}
                        className="w-full py-2 border border-amber-200 text-amber-700 rounded-xl text-xs font-semibold hover:bg-amber-50 transition-colors">
                        💡 Show Hint
                      </button>
                    )}
                    {showHint && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                        <p className="text-[10px] font-bold text-yellow-700 mb-1">Hint</p>
                        <div className="space-y-1">{renderMarkdown(lesson.hint)}</div>
                      </div>
                    )}
                    <div className="flex gap-2 items-end">
                      <textarea value={userAnswer} onChange={e => setUserAnswer(e.target.value)} placeholder="Type your answer here…"
                        rows={2} className="flex-1 bg-muted/40 border border-border rounded-xl p-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none hide-scrollbar" />
                      <button onClick={() => setLessonPhase("done")} disabled={!userAnswer.trim()}
                        className="px-3 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0">Submit</button>
                    </div>
                  </div>
                )}

                {/* Lesson summary */}
                {lessonPhase === "done" && (
                  <div className="space-y-3">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
                      <p className="text-sm font-bold text-emerald-700 mb-1">Great effort, {userName.split(" ")[0]}! 🎉</p>
                      <p className="text-xs text-emerald-600">Here's what you've covered today:</p>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-3.5 shadow-sm">
                      <p className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-2.5">📝 Key Takeaways</p>
                      <div className="space-y-2">
                        {lesson.summary.map((s, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CircleCheck size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-foreground leading-snug">{s}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => { setLessonPhase("teaching"); setStepIdx(0); setShowHint(false); setUserAnswer(""); }}
                        className="py-2.5 border border-border rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors">
                        🔁 Review Lesson
                      </button>
                      <button onClick={() => setTutorStep("select-chapter")}
                        className="py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity">
                        Next Chapter →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick ask in tutor mode */}
              <div className="px-3 pb-3 shrink-0 border-t border-border pt-2">
                <div className="flex items-center gap-2 bg-muted/40 rounded-xl px-3 py-2 border border-border">
                  <input value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { setMode("assistant"); sendMessage(); } }}
                    placeholder="Ask a quick question…" className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none" />
                  <button onClick={() => { setMode("assistant"); sendMessage(); }} className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center hover:opacity-90">
                    <ArrowRight size={11} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

function ConfirmDialog({ open, message, onConfirm, onCancel }: {
  open: boolean; message: string; onConfirm: () => void; onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onCancel} />
      <div className="relative bg-card border border-border rounded-2xl p-7 shadow-2xl w-80 text-center z-10">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={22} className="text-red-500" />
        </div>
        <h3 className="text-base font-bold text-foreground mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Confirm Logout</h3>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors">No, Stay</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors">Yes, Logout</button>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Popup ────────────────────────────────────────────────────────────

function ProfilePopup({ open, userName, onClose, onLogout }: {
  open: boolean; userName: string; onClose: () => void; onLogout: () => void;
}) {
  if (!open) return null;
  const fields = [
    { label: "Student Name", value: userName },
    { label: "Student ID", value: "STU-2024-009" },
    { label: "Standard", value: "9th B" },
    { label: "School / College", value: "Sunrise International School" },
    { label: "Date of Birth", value: "12 March 2010" },
    { label: "Year of Studying", value: "2024–25" },
    { label: "GR Number", value: "GR-7821" },
    { label: "Home Address", value: "42, Shanti Nagar, Pune – 411001" },
    { label: "Parent's Email", value: "parent@example.com" },
    { label: "Parent's Contact", value: "+91 98765 43210" },
    { label: "Student Email", value: "aaravi@example.com" },
    { label: "School Address", value: "Plot 15, Baner Road, Pune – 411045" },
  ];
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-14 right-4 z-50 w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-primary to-indigo-600 px-5 py-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-lg font-bold">{userName.charAt(0).toUpperCase()}</div>
          <div><div className="text-white font-bold text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{userName}</div><div className="text-white/70 text-xs">Student · 9th B</div></div>
          <button onClick={onClose} className="ml-auto p-1 rounded-lg hover:bg-white/20 transition-colors"><X size={16} className="text-white" /></button>
        </div>
        <div className="max-h-72 overflow-y-auto hide-scrollbar p-4 space-y-2">
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

// ─── App Header ───────────────────────────────────────────────────────────────

function AppHeader({
  role, userName, menuOpen, onMenuToggle, onLogout,
  canGoBack, canGoForward, onGoBack, onGoForward,
  aiMentorOpen, onAIMentorToggle,
  isWorkspace, leftPanelMode,
}: {
  role: Role; userName: string; menuOpen: boolean; onMenuToggle: () => void; onLogout: () => void;
  canGoBack: boolean; canGoForward: boolean; onGoBack: () => void; onGoForward: () => void;
  aiMentorOpen: boolean; onAIMentorToggle: () => void;
  isWorkspace: boolean; leftPanelMode: LeftPanelMode;
}) {
  const [time, setTime] = useState(new Date());
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const fmt = (d: Date) => d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const fmtDate = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });

  const roleBadge: Record<Role, string> = {
    student: "bg-blue-100 text-blue-700",
    teacher: "bg-emerald-100 text-emerald-700",
    admin: "bg-violet-100 text-violet-700",
  };

  const aiMentorActive = aiMentorOpen;

  return (
    <>
      <header className="bg-white border-b border-border flex items-center justify-between px-6 shrink-0 z-10 relative" style={{ height: 52 }}>
        {/* Left */}
        <div className="flex items-center gap-3">
          <button onClick={onMenuToggle} className="p-2 rounded-xl hover:bg-muted transition-colors">
            {menuOpen ? <X size={17} className="text-foreground/60" /> : <Menu size={17} className="text-foreground/60" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <BookMarked size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Smart Notebook</span>
          </div>
          <div className="w-px h-5 bg-border mx-1" />
          <button
            onClick={onAIMentorToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              aiMentorActive ? "bg-primary text-white" : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            <Bot size={13} />
            {aiMentorActive ? "Close AI" : "AI Mentor"}
          </button>
        </div>

        {/* Center — back/forward */}
        <div className="flex items-center gap-1">
          <button
            onClick={onGoBack}
            disabled={!canGoBack}
            title="Go back"
            className={`p-1.5 rounded-lg transition-colors ${canGoBack ? "hover:bg-muted cursor-pointer" : "opacity-30 cursor-not-allowed"}`}
          >
            <ChevronLeft size={16} className="text-foreground/60" />
          </button>
          <button
            onClick={onGoForward}
            disabled={!canGoForward}
            title="Go forward"
            className={`p-1.5 rounded-lg transition-colors ${canGoForward ? "hover:bg-muted cursor-pointer" : "opacity-30 cursor-not-allowed"}`}
          >
            <ChevronRight size={16} className="text-foreground/60" />
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${roleBadge[role]}`}>{role}</span>
          <div className="text-xs text-muted-foreground hidden lg:block">{fmtDate(time)}</div>
          <span className="text-sm font-semibold text-foreground tabular-nums">{fmt(time)}</span>
          <div className="w-px h-4 bg-border" />
          <Wifi size={15} className="text-foreground/50" />
          <Battery size={15} className="text-foreground/50" />
          <button className="relative p-1.5 rounded-lg hover:bg-muted transition-colors">
            <Bell size={15} className="text-foreground/50" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>
          <div className="relative">
            <button
              onClick={() => setProfileOpen(o => !o)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity ${role === "teacher" ? "bg-emerald-600" : role === "admin" ? "bg-violet-600" : "bg-primary"}`}
            >
              {userName.charAt(0).toUpperCase()}
            </button>
            {role === "student" && (
              <ProfilePopup open={profileOpen} userName={userName} onClose={() => setProfileOpen(false)}
                onLogout={() => { setProfileOpen(false); setLogoutConfirm(true); }} />
            )}
            {role === "teacher" && (
              <TeacherProfilePopup open={profileOpen} userName={userName} onClose={() => setProfileOpen(false)}
                onLogout={() => { setProfileOpen(false); setLogoutConfirm(true); }} />
            )}
            {role === "admin" && (
              <AdminProfilePopup open={profileOpen} userName={userName} onClose={() => setProfileOpen(false)}
                onLogout={() => { setProfileOpen(false); setLogoutConfirm(true); }} />
            )}
          </div>
        </div>
      </header>
      <ConfirmDialog open={logoutConfirm} message="Are you sure you want to log out?"
        onConfirm={() => { setLogoutConfirm(false); onLogout(); }}
        onCancel={() => setLogoutConfirm(false)} />
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



// ─── Root App ─────────────────────────────────────────────────────────────────

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("role-select");
  const [role, setRole] = useState<Role | null>(null);
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // Student navigation history
  const [navHistory, setNavHistory] = useState<StudentScreen[]>(["dashboard"]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const studentScreen = navHistory[historyIdx];

  // Teacher navigation history
  const [teacherHistory, setTeacherHistory] = useState<TeacherScreen[]>(["dashboard"]);
  const [teacherHistoryIdx, setTeacherHistoryIdx] = useState(0);
  const teacherScreen = teacherHistory[teacherHistoryIdx];
  const [selectedClass, setSelectedClass] = useState("");

  // Admin navigation history
  const [adminHistory, setAdminHistory] = useState<AdminScreen[]>(["dashboard"]);
  const [adminHistoryIdx, setAdminHistoryIdx] = useState(0);
  const adminScreen = adminHistory[adminHistoryIdx];

  // Workspace state
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState<ChapterRef | null>(null);
  const [leftPanelMode, setLeftPanelMode] = useState<LeftPanelMode>("pdf");
  const [notebookNotes, setNotebookNotes] = useState<Record<string, string>>({});

  // AI Mentor panel
  const [aiMentorOpen, setAiMentorOpen] = useState(false);
  const [aiMentorWidth, setAiMentorWidth] = useState(380);
  const aiMentorDragging = useRef(false);
  const aiMentorContainerRef = useRef<HTMLDivElement>(null);

  const startAiMentorResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    aiMentorDragging.current = true;
    const onMove = (ev: MouseEvent) => {
      if (!aiMentorDragging.current || !aiMentorContainerRef.current) return;
      const rect = aiMentorContainerRef.current.getBoundingClientRect();
      const newWidth = rect.right - ev.clientX;
      setAiMentorWidth(Math.min(640, Math.max(300, newWidth)));
    };
    const onUp = () => { aiMentorDragging.current = false; document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, []);

  const navigateTo = useCallback((screen: StudentScreen) => {
    setNavHistory(prev => {
      const trimmed = prev.slice(0, historyIdx + 1);
      return [...trimmed, screen];
    });
    setHistoryIdx(i => i + 1);
  }, [historyIdx]);

  const navigateTeacher = useCallback((screen: TeacherScreen) => {
    setTeacherHistory(prev => {
      const trimmed = prev.slice(0, teacherHistoryIdx + 1);
      return [...trimmed, screen];
    });
    setTeacherHistoryIdx(i => i + 1);
  }, [teacherHistoryIdx]);

  const navigateAdmin = useCallback((screen: AdminScreen) => {
    setAdminHistory(prev => {
      const trimmed = prev.slice(0, adminHistoryIdx + 1);
      return [...trimmed, screen];
    });
    setAdminHistoryIdx(i => i + 1);
  }, [adminHistoryIdx]);

  const goBack = () => {
    if (role === "teacher") { if (teacherHistoryIdx > 0) setTeacherHistoryIdx(i => i - 1); }
    else if (role === "admin") { if (adminHistoryIdx > 0) setAdminHistoryIdx(i => i - 1); }
    else { if (historyIdx > 0) setHistoryIdx(i => i - 1); }
  };

  const goForward = () => {
    if (role === "teacher") { if (teacherHistoryIdx < teacherHistory.length - 1) setTeacherHistoryIdx(i => i + 1); }
    else if (role === "admin") { if (adminHistoryIdx < adminHistory.length - 1) setAdminHistoryIdx(i => i + 1); }
    else { if (historyIdx < navHistory.length - 1) setHistoryIdx(i => i + 1); }
  };

  const handleOpenChapter = (ch: ChapterRef) => {
    setSelectedChapter(ch);
    setLeftPanelMode("pdf");
    navigateTo("workspace");
  };

  const handleAIMentorToggle = () => setAiMentorOpen(o => !o);

  const handleLogin = (name: string) => {
    setUserName(name);
    setNavHistory(["dashboard"]);
    setHistoryIdx(0);
    setTeacherHistory(["dashboard"]);
    setTeacherHistoryIdx(0);
    setAdminHistory(["dashboard"]);
    setAdminHistoryIdx(0);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setPage("role-select");
    setRole(null);
    setUserName("");
    setNavHistory(["dashboard"]);
    setHistoryIdx(0);
    setTeacherHistory(["dashboard"]);
    setTeacherHistoryIdx(0);
    setAdminHistory(["dashboard"]);
    setAdminHistoryIdx(0);
    setMenuOpen(false);
  };

  const handleNotesChange = (key: string, html: string) => {
    setNotebookNotes(prev => ({ ...prev, [key]: html }));
  };

  if (page === "role-select") return <RoleSelectPage onSelect={r => { setRole(r); setPage("login"); }} />;
  if (page === "login" && role) return <LoginPage role={role} onBack={() => { setRole(null); setPage("role-select"); }} onLogin={handleLogin} />;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <AppHeader
        role={role!} userName={userName} menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen(o => !o)} onLogout={handleLogout}
        canGoBack={role === "teacher" ? teacherHistoryIdx > 0 : role === "admin" ? adminHistoryIdx > 0 : historyIdx > 0}
        canGoForward={role === "teacher" ? teacherHistoryIdx < teacherHistory.length - 1 : role === "admin" ? adminHistoryIdx < adminHistory.length - 1 : historyIdx < navHistory.length - 1}
        onGoBack={goBack} onGoForward={goForward}
        aiMentorOpen={aiMentorOpen}
        isWorkspace={false} leftPanelMode={leftPanelMode} onAIMentorToggle={handleAIMentorToggle}
      />

      {role === "student" && (
        <StudentSideMenu open={menuOpen} activeScreen={studentScreen}
          onNavigate={navigateTo} onClose={() => setMenuOpen(false)} />
      )}
      {role === "teacher" && (
        <TeacherSideMenu open={menuOpen} activeScreen={teacherScreen}
          onNavigate={navigateTeacher} onClose={() => setMenuOpen(false)} />
      )}
      {role === "admin" && (
        <AdminSideMenu open={menuOpen} activeScreen={adminScreen}
          onNavigate={navigateAdmin} onClose={() => setMenuOpen(false)} />
      )}

      {/* Main content + AI Mentor side panel */}
      <div ref={aiMentorContainerRef} className="flex-1 flex overflow-hidden">
        {/* Current screen */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {role === "student" && (
            <StudentDashboard
              userName={userName} screen={studentScreen}
              selectedSubject={selectedSubject} selectedChapter={selectedChapter}
              leftPanelMode={leftPanelMode} notebookNotes={notebookNotes}
              onNotesChange={handleNotesChange}
              onNavigate={navigateTo}
              onSelectSubject={setSelectedSubject}
              onOpenChapter={handleOpenChapter}
            />
          )}
          {role === "teacher" && (
            <TeacherDashboard
              userName={userName} screen={teacherScreen}
              selectedClass={selectedClass} notebookNotes={notebookNotes}
              onNotesChange={handleNotesChange}
              onNavigate={navigateTeacher}
              onSelectClass={setSelectedClass}
            />
          )}
          {role === "admin" && (
            <AdminDashboard userName={userName} screen={adminScreen} onNavigate={navigateAdmin} />
          )}
        </div>

        {/* AI Mentor resizable right panel */}
        {aiMentorOpen && (
          <>
            {/* Drag handle */}
            <div
              className="w-1.5 shrink-0 bg-border hover:bg-primary/50 active:bg-primary cursor-col-resize transition-colors flex items-center justify-center group"
              onMouseDown={startAiMentorResize}
            >
              <div className="w-0.5 h-8 bg-border group-hover:bg-primary/40 rounded-full transition-colors" />
            </div>
            {/* Panel */}
            <div
              className="flex flex-col border-l border-border overflow-hidden shrink-0"
              style={{ width: aiMentorWidth, transition: aiMentorDragging.current ? "none" : "width 0.15s ease" }}
            >
              <AIMentorPanel userName={userName} role={role!} onClose={() => setAiMentorOpen(false)} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
