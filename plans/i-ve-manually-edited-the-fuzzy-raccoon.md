# Plan: Admin Panel — Full Implementation

## Context

The current `AdminDashboard` (line ~4073) is a single static component with gradient stat tiles and 4 quick-action cards — no routing, no sidebar, no multi-screen navigation. The spec (`admin-panel-spec.md`) defines a full institutional management center: teacher management, class management, student management, monitoring, timetable, calendar, notices, reports, communication, resource monitoring, activity logs, and settings.

This plan implements the complete Admin Panel following the **identical architectural pattern** as the Teacher Panel (already built): `AdminScreen` type → `AdminSideMenu` → `AdminDashboard` router → individual screen components → history navigation in root App.

---

## Architecture

### 1. New Type: `AdminScreen`

```ts
type AdminScreen =
  | "dashboard"
  | "teacher-management"
  | "class-management"
  | "student-management"
  | "teacher-monitoring"
  | "student-monitoring"
  | "timetable"
  | "calendar"
  | "notice-management"
  | "reports"
  | "communication"
  | "resource-monitoring"
  | "activity-logs"
  | "settings";
```

Add alongside `TeacherScreen` in the types block.

---

### 2. Admin Navigation History in Root App

Add parallel state to teacher history:

```ts
const [adminHistory, setAdminHistory] = useState<AdminScreen[]>(["dashboard"]);
const [adminHistoryIdx, setAdminHistoryIdx] = useState(0);
const adminScreen = adminHistory[adminHistoryIdx];

const navigateAdmin = useCallback((screen: AdminScreen) => { ... }, [adminHistoryIdx]);
```

Wire `goBack` / `goForward` to use `adminHistory` when `role === "admin"` (extend the existing role check in those functions).

Reset `adminHistory` to `["dashboard"]` in `handleLogin` and `handleLogout`.

---

### 3. Replace `GenericSideMenu` (admin) with `AdminSideMenu`

**Current**: Admin falls through to `GenericSideMenu` (line ~871) with 5 generic items.

**New**: When `role === "admin"` render `<AdminSideMenu>`, keep `<GenericSideMenu>` as a true fallback only.

**`AdminSideMenu` sections** (violet theme, mirrors `TeacherSideMenu` structure):

```
[Institution block — shows section name and role]

Dashboard (home)

─── Management ───
  Teacher Management
  Class Management
  Student Management

─── Monitoring ───
  Teacher Monitoring
  Student Monitoring

─── Academic ───
  Timetable
  Academic Calendar
  Notice Management

─── Reports & Data ───
  Reports Center
  Activity Logs

─── Communication ───
  Communication Center
  Resource Monitoring

Settings (bottom)
```

Active screen: `bg-primary/10 text-primary` (same pattern as teacher).

---

### 4. `AdminProfilePopup`

Mirrors `TeacherProfilePopup` (line ~2647) but with **violet** gradient and admin-specific fields:

| Field | Value |
|---|---|
| Admin Name | from `userName` |
| Admin ID | ADM-2024-001 |
| Role | Secondary Section Admin |
| Assigned Section | Grade 6–10 |
| Department | Academic Management |
| Institution | Sunrise International School |
| Email | admin@example.com |
| Contact | +91 98765 00111 |

Logout button (red) → `ConfirmDialog`.

Wire into `AppHeader` the same way `TeacherProfilePopup` is wired (line ~771).

---

### 5. `AdminDashboard` Router

Replace the static `AdminDashboard` with a router (same pattern as `TeacherDashboard`):

```tsx
function AdminDashboard({ userName, screen, onNavigate }) {
  switch (screen) {
    case "teacher-management":   return <TeacherManagementScreen />;
    case "class-management":     return <ClassManagementScreen />;
    case "student-management":   return <StudentManagementScreen />;
    case "teacher-monitoring":   return <TeacherMonitoringScreen />;
    case "student-monitoring":   return <StudentMonitoringScreen />;
    case "timetable":            return <AdminTimetableScreen />;
    case "calendar":             return <AcademicCalendarScreen />;
    case "notice-management":    return <AdminNoticeMgmtScreen />;
    case "reports":              return <AdminReportsScreen />;
    case "communication":        return <AdminCommunicationScreen />;
    case "resource-monitoring":  return <ResourceMonitoringScreen />;
    case "activity-logs":        return <ActivityLogsScreen />;
    case "settings":             return <AdminSettingsScreen userName={userName} />;
    default:                     return <AdminHome userName={userName} onNavigate={onNavigate} />;
  }
}
```

---

## Screen-by-Screen Implementation

### AdminHome (Dashboard)

**Stats row (4 tiles):** Teachers (18), Students (412), Classes (14), Active Today (287) — gradient cards

**Second row (3 tiles):** Attendance Rate (87%), Homework Rate (74%), Avg Academic Score (81%) — outline cards

**Left column:**
- Today's Activity timeline (5 recent actions: teacher logged in, notice published, etc.)
- Quick Actions grid (8 cards): Register Teacher, Assign Teacher, Create Class, Manage Students, Publish Notice, View Reports, Generate Report, Open AI Mentor
- Recent Notices strip (3 notices)

**Right column:**
- AI Recommendations card (3 bullet insights)
- Pending Tasks (4 items: pending approvals, unreviewed reports, unread messages)
- Upcoming Events (3 items from calendar)

---

### TeacherManagementScreen

**Header:** "Teacher Management" + "Register Teacher" button

**Filter bar:** Search input + Status filter (All / Active / Inactive) + Department filter

**Teacher table/grid:**
- Columns: Name, Employee ID, Designation, Subject(s), Assigned Classes, Role (Class/Subject), Status, Actions
- 6 mock teachers with realistic data
- Status badge (Active = emerald, Inactive = gray)
- Actions: View Profile | Edit | Deactivate/Activate

**Register Teacher drawer/form (inline expand or modal-like section):**
- Name, Employee ID, Email, Contact, Department, Designation, Subject(s), Role (Class/Subject Teacher), Assigned Classes

---

### ClassManagementScreen

**Header:** "Class Management" + "Create Class" button

**Class cards grid (3 columns):**
Each card shows: Grade + Section, Class Teacher name, Student count, Subject Teachers list, Academic year, status badge
Actions: Edit | View Students | Archive

**Create/Edit Class form (inline):**
Fields: Grade, Section, Academic Year, Assign Class Teacher (dropdown), Add Subject Teachers

---

### StudentManagementScreen

**Header:** "Student Management" + "Register Student" button

**Filters:** Search, Class filter, Status filter

**Student table:**
- Columns: Roll, Name, Class, Attendance %, Homework Status, Academic Score, Status, Actions
- 8 mock students (reuse `T_STUDENTS` pattern)
- Actions: View Profile | Edit | Transfer | Deactivate

---

### TeacherMonitoringScreen

**Summary strip:** 3 metrics — Avg Classes/Week, Avg Homework Assigned, Avg Student Score

**Teacher performance table:**
- Columns: Teacher, Classes Conducted, HW Assigned, Assignments, Tests, Avg Student Score, AI Score, Performance
- Color-coded performance bars per row
- Click row → expands detail with monthly chart placeholder

---

### StudentMonitoringScreen

**Top filters:** Class selector + Subject filter + Risk filter (All / At Risk / Good)

**Student monitoring cards:**
- Grid of student cards showing: Name, Class, Attendance %, Score, Risk indicator (dot), AI Learning Score
- Risk = red dot if attendance < 70% or score < 55%

**AI insights panel (right sidebar):**
- "X students are at risk this week"
- Attendance trend summary
- 3 specific recommendations

---

### AdminTimetableScreen

**Split layout (matching `TimetableScreen` in teacher panel):**

Left: Institution-wide weekly timetable grid
- Rows = periods (7), Columns = days (Mon–Sat)
- Each cell = "Subject · Teacher · Room"

Right: Recent Changes panel
- Substitutions this week
- Cancelled classes
- Room changes
- "Update Timetable" button

---

### AcademicCalendarScreen

**Month calendar view:**
- Full calendar grid (current month)
- Colored event dots on dates
- Event type legend (Exam, Holiday, Meeting, Event)

**Event list (right panel):**
- Upcoming events for next 30 days
- Add Event button + inline form (Title, Date, Type, Description, Target Audience)

---

### AdminNoticeMgmtScreen

**Tabs:** Published | Drafts | Scheduled

**Notice list** (similar to `TeacherNoticeBoardScreen` but with admin-level categories):
- All 8 notice categories from spec
- Priority (High/Medium/Low), Target Audience, Expiry Date, Status

**Create Notice form (prominent, always visible or sticky):**
- Title, Category, Priority, Target Audience (All / Teachers / Students / Parents), Description, Attachment placeholder, Schedule toggle, Expiry Date
- "Publish" / "Save as Draft" / "Schedule" buttons

---

### AdminReportsScreen

**Three tabs:** Student Reports | Teacher Reports | Institution Reports

Each tab shows report type cards with:
- Report name, description
- Filters: Class, Date Range, Teacher (where applicable)
- "Generate" button → shows preview table below
- Export PDF / Export Excel buttons

**Student Reports:** Attendance, Academic Performance, Homework, Assignments, Learning Progress

**Teacher Reports:** Teaching Activity, Classes Conducted, Student Results, Homework

**Institution Reports:** Overall Attendance, Department Performance, Class Performance, Exam Analysis

---

### AdminCommunicationScreen

**Tabs:** Broadcast | Announcements | Messages

**Broadcast:** Compose message to All Teachers / All Students / All Parents / Specific Class — textarea + send button

**Announcements:** List of sent announcements + create form

**Messages:** Inbox list (similar to teacher communication pattern)

---

### ResourceMonitoringScreen

**Tabs:** Teacher Resources | Student Resources | All

**Resource table/grid:**
- Columns: Title, Uploaded By (Teacher), Subject, Class, Type (Notes/PDF/Worksheet), Date, Status
- Actions: View | Approve | Remove
- Search + Type filter

---

### ActivityLogsScreen

**Filter bar:** Search + Date range picker + Action type filter (All / Teacher Created / Student Registered / Notice Published / etc.)

**Log list:**
- Each entry: Icon + Action description + Actor + Timestamp
- Color-coded by action type
- Paginated (show 20 per page with Load More)

Sample entries:
- "Teacher Rajan Mehta registered" — 28 Jun, 10:32 AM
- "Notice 'Unit Test 2' published" — 27 Jun, 3:15 PM
- "Student Arjun Singh transferred to 9th B" — 26 Jun, 2:00 PM

---

### AdminSettingsScreen

Same layout as `TeacherSettingsScreen` but admin-specific fields:
- Profile: Name, Admin ID, Role, Assigned Section, Department, Institution
- Notification preferences (toggle)
- Theme / Language
- Security: Change Password placeholder
- About

---

## Files to Modify

| File | Changes |
|---|---|
| `src/app/App.tsx` | All changes — single file (consistent with existing pattern) |

---

## Root App Changes Summary

```ts
// Add after teacher history state (line ~4157):
const [adminHistory, setAdminHistory]       = useState<AdminScreen[]>(["dashboard"]);
const [adminHistoryIdx, setAdminHistoryIdx] = useState(0);
const adminScreen = adminHistory[adminHistoryIdx];

const navigateAdmin = useCallback((screen: AdminScreen) => { ... }, [adminHistoryIdx]);

// Extend goBack/goForward (line ~4204):
// add role === "admin" branch using adminHistory/adminHistoryIdx

// Extend handleLogin / handleLogout to reset adminHistory
```

Update sidebar render (currently at line ~4266):
```tsx
{role === "admin" && (
  <AdminSideMenu open={menuOpen} activeScreen={adminScreen}
    onNavigate={navigateAdmin} onClose={() => setMenuOpen(false)} />
)}
```

Update content render (line ~4297):
```tsx
{role === "admin" && (
  <AdminDashboard
    userName={userName} screen={adminScreen}
    onNavigate={navigateAdmin}
  />
)}
```

Update `AppHeader` avatar (line ~762):
```tsx
role === "admin" ? "bg-violet-600" : role === "teacher" ? "bg-emerald-600" : "bg-primary"
```

Add `AdminProfilePopup` in `AppHeader` alongside teacher popup.

---

## Reuse Existing Code

| Existing | Reuse In |
|---|---|
| `TeacherSideMenu` structure (line ~2550) | AdminSideMenu — exact same pattern |
| `TeacherProfilePopup` (line ~2647) | AdminProfilePopup — same layout, violet gradient |
| `T_STUDENTS` data (line ~2527) | StudentManagementScreen, StudentMonitoringScreen |
| `T_CLASSES` data (line ~2513) | ClassManagementScreen, TeacherManagementScreen |
| `TeacherNoticeBoardScreen` (line ~3832) | AdminNoticeMgmtScreen — extend with admin categories |
| `TeacherReportsScreen` (line ~3899) | AdminReportsScreen — expand to 3 tabs |
| `TimetableScreen` pattern (line ~3295) | AdminTimetableScreen — same split layout |
| `PageWrap` + `H1` helpers (line ~2756) | All admin screens |
| `ConfirmDialog` (line ~596) | AdminProfilePopup logout |
| Violet/purple gradient tokens | Admin theme throughout |

---

## Verification

1. Login as **Admin** → verify `AdminSideMenu` appears with all sections
2. Every sidebar item navigates to the correct screen
3. Back/Forward header buttons navigate admin history correctly
4. **Teacher Management** → table shows 6 teachers → "Register Teacher" reveals form
5. **Class Management** → 3 class cards → "Create Class" reveals form
6. **Student Management** → table with filters working
7. **Timetable** → weekly grid visible + changes panel
8. **Calendar** → monthly calendar + add event form
9. **Notice Management** → tabs working, create form visible
10. **Reports** → 3 tabs, generate button shows preview table
11. **Activity Logs** → list with filters
12. **Profile popup** → avatar click → violet popup with admin fields → logout → confirm dialog
13. **AI Mentor** → panel opens with admin-specific suggestion chips (already wired via `ROLE_SUGGESTIONS.admin`)

---

# Plan: Teacher Panel — Full Implementation

## Context

The Teacher Panel currently exists as a single static component (`TeacherDashboard`, line 2515) with hardcoded class cards and no navigation. The spec (`teacher-panel-spec.md`) defines a full multi-screen productivity workspace for educators — covering attendance, timetables, lesson plans, homework, assignments, tests, gradebooks, analytics, communication, and more.

This plan implements the complete Teacher Panel following the same architectural pattern as the Student Panel (type-safe screen union → sidebar with sections → router component → individual screen components → history-based navigation).

---

## Architecture

### 1. New Type: `TeacherScreen`

```ts
type TeacherScreen =
  | "dashboard"
  | "my-classes"
  | "class-detail"
  | "attendance"
  | "timetable"
  | "lesson-planner"
  | "smart-notes"
  | "library"
  | "homework"
  | "assignments"
  | "tests"
  | "gradebook"
  | "student-analytics"
  | "communication"
  | "notice-board"
  | "reports"
  | "settings";
```

Add alongside `StudentScreen` in the types block (~line 29 of `src/app/App.tsx`).

---

### 2. Teacher Navigation History in Root App

Add parallel state to the existing student history (lines 2633–2641):

```ts
const [teacherHistory, setTeacherHistory] = useState<TeacherScreen[]>(["dashboard"]);
const [teacherHistoryIdx, setTeacherHistoryIdx] = useState(0);
const teacherScreen = teacherHistory[teacherHistoryIdx];

// + navigateTeacher(), goTeacherBack(), goTeacherForward()
const [selectedClass, setSelectedClass] = useState("");
```

Wire `goTeacherBack` / `goTeacherForward` into the existing `canGoBack` / `canGoForward` / `onGoBack` / `onGoForward` props in `AppHeader` — shared for both roles.

---

### 3. Replace `GenericSideMenu` with `TeacherSideMenu` for Teacher Role

**Current** (line 2721): `<GenericSideMenu open={menuOpen} role={role!} .../>` for non-student roles.

**New**: When `role === "teacher"` render `<TeacherSideMenu>`, keep `<GenericSideMenu>` only for admin.

**`TeacherSideMenu` sections:**

```
[My Classes block — shows assigned class(es) and role]

Dashboard (home)

─── Teaching ───
  Timetable & Calendar
  Lesson Planner

─── Content ───
  Smart Notes
  Digital Library

─── Assessments ───
  Homework
  Assignments
  Tests & Exams
  Gradebook

─── Insights ───
  Student Analytics
  Reports

─── Communication ───
  Communication Center
  Notice Board

Settings (bottom)
```

Active screen highlighted with `bg-primary/10 text-primary` (same as `StudentSideMenu` pattern).

---

### 4. Teacher Profile Popup

Currently non-student roles get a minimal popup (lines 759–769). Replace with a teacher-specific popup containing:
- Teacher Name (from `userName`)
- Teacher ID: `TCH-2024-042`
- Role: Class Teacher / Subject Teacher
- Assigned Classes: 5th, 6th, 9th Grade
- Department: Science
- Experience: 8 years
- School: Sunrise International School
- Contact: teacher@example.com
- Logout button (red, with confirm dialog)

---

### 5. `TeacherDashboard` Router

Replace the existing `TeacherDashboard` monolith (lines 2515–2552) with a router (like `StudentDashboard`):

```tsx
function TeacherDashboard({ userName, screen, selectedClass, onNavigate, onSelectClass }) {
  switch (screen) {
    case "my-classes":         return <MyClassesScreen ... />;
    case "class-detail":       return <ClassDetailScreen ... />;
    case "attendance":         return <AttendanceScreen ... />;
    case "timetable":          return <TimetableScreen />;
    case "lesson-planner":     return <LessonPlannerScreen />;
    case "smart-notes":        return <SmartNotesScreen />;
    case "library":            return <TeacherLibraryScreen />;
    case "homework":           return <HomeworkScreen />;
    case "assignments":        return <AssignmentsScreen />;
    case "tests":              return <TestsScreen />;
    case "gradebook":          return <GradebookScreen selectedClass={selectedClass} />;
    case "student-analytics":  return <StudentAnalyticsScreen />;
    case "communication":      return <CommunicationScreen />;
    case "notice-board":       return <TeacherNoticeBoardScreen />;
    case "reports":            return <ReportsScreen />;
    case "settings":           return <TeacherSettingsScreen userName={userName} />;
    default:                   return <TeacherHome userName={userName} onNavigate={onNavigate} />;
  }
}
```

---

## Screen-by-Screen Implementation

### TeacherHome (Dashboard)

**Left column:**
- Greeting: "Good Morning, [FirstName]! 👋" + role sub-line "Class Teacher — 9th B"
- Today's Schedule: timeline of classes (time, subject, grade, room)
- Pending Reviews row: Homework pending (3), Assignments pending (2), Questions (5)

**Right column:**
- Quick Actions grid (6 cards): Start Class, Take Attendance, Upload Notes, Create Assignment, Create Test, Send Announcement
- AI Recommendations card (2 bullet suggestions from AI Mentor)
- Recent Notice strip

---

### MyClassesScreen

Grid of assigned class cards. Each card shows:
- Grade + section badge
- Subject(s)
- Student count
- Attendance % today
- "Open Class →" button → sets `selectedClass` + navigates to `class-detail`

---

### ClassDetailScreen

Tabs: **Overview | Students | Attendance | Progress**

- **Overview**: stats (total students, avg attendance %, homework rate, top scorer)
- **Students**: searchable list table — Name, Roll No., Attendance %, Homework Status, AI Score, Risk (green/amber/red dot)
- **Attendance**: today's attendance grid — each student row with Present / Absent / Late / Leave buttons + bulk actions
- **Progress**: subject progress bars per student (sparkline style)

---

### AttendanceScreen

Full attendance management:
- Date picker + class selector
- Student grid with P / A / L / Leave radio buttons
- Bulk mark all present
- Search students
- Save + History tab showing monthly calendar heat map

---

### TimetableScreen

**Split layout (left | right):**

Left — Today's Timetable (timeline) + Weekly grid (Mon–Fri × periods)

Right — Academic Calendar:
- Monthly mini-calendar
- Event list: exams, holidays, meetings, workshops
- Highlighted event types with color dots

---

### LessonPlannerScreen

Tabs: **Weekly | Monthly | Chapter**

Each plan entry: Subject, Class, Chapter/Topic, Learning Objectives (textarea), Resources needed, Homework plan, Teaching notes. CRUD: add / edit / delete plan entries.

---

### SmartNotesScreen

Two panels:
- Left: list of created notes (subject, title, date, shared status)
- Right: Tiptap editor (reuse existing `NotebookEditorPanel` component — already built at line ~370) for creating/editing notes, with subject label + "Share with Class" toggle + "Schedule Publish" option

---

### TeacherLibraryScreen

Same structure as student `LibraryScreen` but teacher-specific:
- Subject-wise collections
- "Upload Resource" button per section
- Teacher-only items (answer keys, manuals) visible

---

### HomeworkScreen

Tabs: **Assigned | Pending Review | Graded**

- **Assigned**: list of homework tasks (subject, class, due date, submission count/total, status)
- **Pending Review**: cards showing student submissions with "Review" button → inline expand with student name, submission text/file reference, mark input, feedback textarea, "Return" button
- Create Homework form: Subject, Class(es), Title, Description, Attachment (placeholder), Due Date, Max Marks

---

### AssignmentsScreen

Same pattern as Homework but with: Group/Individual toggle, Rubric field, richer grading view.

---

### TestsScreen

Tabs: **Upcoming | Past | Create**

- **Upcoming**: cards with subject, class, date, time, marks, syllabus, countdown
- **Past**: results table — test name, class, avg score, highest, lowest, grade distribution mini-bar
- **Create**: form — title, type (Unit/Chapter/Mid-term/Final/Practice/Mock), subject, class(es), date, time, max marks, syllabus, AI Question Generator toggle (placeholder button)

---

### GradebookScreen

Class selector dropdown. Table:
- Rows = students
- Columns = assessments (HW1, HW2, A1, T1, T2, Practical, Total, Grade)
- Color-coded grades (A+ green → D red)
- "Export PDF" / "Export Excel" buttons (placeholder toasts)
- Overall class average row at bottom

---

### StudentAnalyticsScreen

Student selector dropdown or search. Selected student shows:
- Stats row: Attendance %, Homework Rate, Avg Test Score, AI Score
- Radial progress chart for subject-wise performance (using `recharts`)
- Strength/Weak area pills
- Recent test scores timeline
- AI insight card with 2 recommendations

---

### CommunicationScreen

Tabs: **Announcements | Messages**

- **Announcements**: list of sent announcements + "New Announcement" form (class selector, title, message, schedule toggle)
- **Messages**: simple inbox-style list showing sender name, preview, timestamp (read/unread)

---

### TeacherNoticeBoardScreen

Reuse student `NoticeBoardScreen` UI pattern but add "Create Notice" button that opens an inline form (title, category, priority, description, target class, date).

---

### ReportsScreen

Cards for 4 report types: Attendance Report, Homework Report, Assignment Report, Progress Report.

Each card: class selector, date range, "Generate" button → shows a preview table below.

---

### TeacherSettingsScreen

Same layout as student `SettingsScreen` but with teacher-specific fields:
- Profile section (name, ID, department, subjects, classes)
- Notification preferences
- Theme / Language
- About

---

## Files to Modify

| File | Changes |
|---|---|
| `src/app/App.tsx` | All changes — single file (consistent with existing pattern) |

---

## Root App Changes Summary

```ts
// Add alongside student history state (~line 2633):
const [teacherHistory, setTeacherHistory] = useState<TeacherScreen[]>(["dashboard"]);
const [teacherHistoryIdx, setTeacherHistoryIdx] = useState(0);
const teacherScreen = teacherHistory[teacherHistoryIdx];
const [selectedClass, setSelectedClass] = useState("");

const navigateTeacher = (s: TeacherScreen) => { ... };
const goTeacherBack = () => { ... };
const goTeacherForward = () => { ... };
```

Update `canGoBack` / `canGoForward` / `onGoBack` / `onGoForward` in AppHeader call to use teacher history when `role === "teacher"`.

Update role-based sidebar:
```tsx
{role === "student" && <StudentSideMenu ... />}
{role === "teacher" && <TeacherSideMenu ... />}
{role === "admin"   && <GenericSideMenu ... />}
```

Update content area:
```tsx
{role === "teacher" && (
  <TeacherDashboard
    userName={userName} screen={teacherScreen}
    selectedClass={selectedClass}
    onNavigate={navigateTeacher}
    onSelectClass={setSelectedClass}
  />
)}
```

---

## Reuse Existing Code

| Existing Component | Reuse In |
|---|---|
| `NotebookEditorPanel` (line ~370) | SmartNotesScreen — rich text note creation |
| `ConfirmDialog` (line ~583) | Logout from teacher profile popup |
| Student `NoticeBoardScreen` pattern | TeacherNoticeBoardScreen (add create form) |
| Student `LibraryScreen` pattern | TeacherLibraryScreen |
| Student `SettingsScreen` pattern | TeacherSettingsScreen |
| `recharts` (already a dep) | StudentAnalyticsScreen charts |
| `AIMentorPanel` | Already works for teacher role via `ROLE_SUGGESTIONS.teacher` |

---

## Verification

1. Login as **Teacher** → verify TeacherSideMenu shows all sections
2. Click each sidebar item → correct screen renders
3. Back/Forward buttons in header navigate teacher history correctly
4. **My Classes** → click "Open Class" → Class Detail screen loads with student list
5. **Attendance** → mark students P/A/L → save shows confirmation
6. **Timetable** → left timetable + right academic calendar visible in split layout
7. **Smart Notes** → Tiptap editor opens, can write and format text
8. **Homework** → create a task, see it appear in Assigned tab
9. **Tests** → Create tab form → fill and submit → appears in Upcoming tab
10. **Gradebook** → class selector → table with student grades
11. **Student Analytics** → select student → charts and AI insights visible
12. **Communication** → send announcement → appears in list
13. **AI Mentor** button → panel opens with teacher-specific suggestion chips
14. **Profile popup** → avatar click → teacher fields shown → logout with confirmation

---

# Plan: Professional Notebook Editor + Split Workspace Overhaul

## Context

**Previous plan** covered the full student panel UI overhaul (role select, sidebar, profile popup, multi-screen navigation, all sub-screens). That is complete and merged.

**This plan** covers the second major update: a professional rich-text notebook editor with highlight/formatting tools, a full-screen split-workspace replacing the current subject detail layout, draggable resizer, functional back/forward navigation, and a left-panel architecture that can toggle between PDF viewer and AI Tutor.

Triggered by two inputs:
- User message: "the notebook must be editable like for writing and highlighting also in the textbook also that editor can be done for a professional notemaking options for students"
- Attached spec `ai-notebook-update.md` which specifies: header nav fix, full-screen split workspace, PDF viewer, rich notebook, draggable divider, future-proof left panel, AI Tutor toggle prep, screen space optimization.

---

## NEW CHANGES (This Plan)

### A. Install Rich Text Editor Library

Install Tiptap and required extensions:
```
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit \
  @tiptap/extension-highlight @tiptap/extension-underline \
  @tiptap/extension-text-style @tiptap/extension-color \
  @tiptap/extension-text-align @tiptap/extension-task-list \
  @tiptap/extension-task-item
```

Tiptap is ProseMirror-based, React-friendly, and supports all required formatting without deprecated `execCommand`. It's the industry standard for rich editors in React.

---

### B. Functional Header Back / Forward Navigation

**Current state:** The `<ChevronLeft>` and `<ChevronRight>` buttons in `AppHeader` are decorative — they do nothing.

**Implementation:**
- Add a navigation history system in the root `App` component:
  ```ts
  const [history, setHistory] = useState<StudentScreen[]>(["dashboard"]);
  const [historyIdx, setHistoryIdx] = useState(0);
  ```
- `navigateTo(screen)` pushes to history, slices forward history, increments index.
- `goBack()` decrements index and sets screen.
- `goForward()` increments index and sets screen.
- Pass `canGoBack`, `canGoForward`, `onBack`, `onForward` as props to `AppHeader`.
- Buttons are visually disabled (`opacity-40 cursor-not-allowed`) when unavailable.

---

### C. Always-On Split Workspace (replaces SubjectDetailScreen)

**Current state:** `SubjectDetailScreen` shows chapter list on the left and teacher tasks on the right. The notebook only opens when the user manually clicks "Open Notebook", toggling a split view.

**New behavior:**
- When any chapter is clicked in the Subject Detail view, navigate to a new `WorkspaceScreen`.
- `WorkspaceScreen` fills the **entire area below the header** with no outer padding.
- Layout: `[Left Panel] [Drag Handle] [Right Panel]`
- Both panels are always visible — no toggle needed.
- The subject/chapter context is passed as props.

**State additions in root `App`:**
```ts
const [selectedChapter, setSelectedChapter] = useState<{subject: string; chapterName: string; chapterNum: number} | null>(null);
const [leftPanelMode, setLeftPanelMode] = useState<"pdf" | "ai-tutor">("pdf");
const [splitRatio, setSplitRatio] = useState(50); // percentage for left panel
```

Add `"workspace"` to `StudentScreen` type.

When the AI Mentor button in the header is clicked **while on the workspace screen**, toggle `leftPanelMode` between `"pdf"` and `"ai-tutor"`.

---

### D. Draggable Split Resizer

A thin vertical divider between the two panels:
- `onMouseDown` on the divider starts a resize drag.
- `onMouseMove` on `document` calculates new ratio based on cursor X position relative to workspace container.
- `onMouseUp` stops drag.
- Clamp ratio between 25% and 75% (minimum panel widths).
- Divider shows a hover highlight and a drag cursor.
- Session ratio is preserved in state (not localStorage — session only as spec requires).
- Use `useRef` for drag state to avoid re-renders during mouse move.

```tsx
// Divider component
<div
  className="w-1.5 bg-border hover:bg-primary/40 cursor-col-resize transition-colors shrink-0"
  onMouseDown={startDrag}
/>
```

---

### E. Left Panel — PDF Viewer

Since no actual PDF files exist in the app, render a **realistic mock PDF viewer** for the selected chapter:

**Toolbar (top of left panel):**
- Subject + chapter title breadcrumb
- Zoom controls: `−` / `+` / percentage display (50%–200%, default 100%)
- Page indicator: `◀ Page 2 of 8 ▶`
- Back to Subject list button

**Content area:**
- A scrollable `div` styled as a white document page with drop shadow.
- Contains realistic chapter content: heading, subheadings, paragraph text, a figure placeholder.
- Scaled by zoom level using `transform: scale(zoom)` with `transform-origin: top center`.
- The viewer background is a medium grey (`bg-gray-200`) like a real PDF viewer chrome.

**Future extensibility:**
- Wrap the left panel content in a `<LeftPanelContent mode={leftPanelMode} />` component.
- When `mode === "ai-tutor"`, render an AI chat placeholder instead.

---

### F. Right Panel — Rich Text Notebook Editor

Replace the current `<textarea>` with a **Tiptap** rich text editor.

**Notebook Toolbar (top of right panel):**

Row 1 — Formatting:
| Control | Action |
|---|---|
| **B** | Bold |
| *I* | Italic |
| <u>U</u> | Underline |
| `S` | Strikethrough |
| H1 / H2 / H3 | Heading levels |
| `¶` | Normal paragraph |

Row 2 — Lists & Align:
| Control | Action |
|---|---|
| `≡` | Bullet list |
| `1.` | Ordered list |
| `☑` | Task / checklist |
| Align L/C/R | Text alignment |

Row 3 — Highlight colors:
5 color swatches: Yellow `#FEF08A`, Green `#BBF7D0`, Blue `#BAE6FD`, Pink `#FBCFE8`, Orange `#FED7AA`  
Clicking a swatch applies `Highlight` with that background color.  
An "eraser" button clears highlight.

Row 4 — Text color:
6 color dots: Black, Blue, Red, Green, Purple, Orange — applies `Color` extension.

**Editor area:**
- `EditorContent` from Tiptap fills the remaining height.
- Lined background via CSS repeating-gradient (matching existing notebook aesthetic).
- Font: Inter, 15px.
- Padding: 20px.
- Placeholder text: "Start writing your notes here…"

**Subject label header:** Subject name + chapter title shown above toolbar as a small chip.

**Save button:** top-right of notebook panel header, triggers auto-save toast (using `sonner`'s `toast.success`).

---

### G. Notebook Screen (standalone — from sidebar menu)

The standalone `NotebookScreen` (accessed from the sidebar, not from a chapter) also gets the same Tiptap editor replacing the `<textarea>`. Subject selector stays. Same toolbar. Same lined background.

---

### H. Subject Detail Screen — Chapter List Only

The `SubjectDetailScreen` is simplified. It no longer shows the split notebook inline.

- Shows: subject header (about, progress bar) + chapter list.
- Clicking a chapter → `navigateTo("workspace")` + sets `selectedChapter`.
- Teacher tasks section remains below or in a collapsible panel.
- "Open Notebook" toggle button is removed.

---

### I. Screen Space & Layout

- `WorkspaceScreen` has **zero outer padding** — it fills `flex-1` fully.
- Left and right panels each have their own internal padding (12px–16px).
- The notebook toolbar is compact (32px tall per row) to maximize writing area.
- PDF viewer toolbar is a single 40px strip.

---

## Files to Modify

| File | Changes |
|---|---|
| `src/app/App.tsx` | All changes — add WorkspaceScreen, rich editor, history nav, left panel system |

**New package installs (run before coding):**
```
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-highlight @tiptap/extension-underline @tiptap/extension-text-style @tiptap/extension-color @tiptap/extension-text-align @tiptap/extension-task-list @tiptap/extension-task-item
```

---

## New State in Root App

```ts
// Navigation history
const [navHistory, setNavHistory] = useState<StudentScreen[]>(["dashboard"]);
const [historyIdx, setHistoryIdx] = useState(0);

// Workspace
const [selectedChapter, setSelectedChapter] = useState<{ subject: string; name: string; num: number } | null>(null);
const [leftPanelMode, setLeftPanelMode] = useState<"pdf" | "ai-tutor">("pdf");
const [splitRatio, setSplitRatio] = useState(50);
```

Add `"workspace"` to `StudentScreen` type.

---

## Verification

1. **Back/Forward nav**: Login as student → open Subjects → open a subject → open a chapter → click Back → returns to subject → click Forward → returns to workspace. Buttons are disabled at boundaries.
2. **Split workspace**: Clicking a chapter immediately shows split view (no button needed). Both panels visible simultaneously.
3. **Draggable divider**: Click and drag divider — both panels resize smoothly. Stops at 25%/75% limits.
4. **Notebook editor**: In the workspace right panel, type text → apply Bold / Italic / Underline → apply yellow highlight → apply heading H2 → create bullet list → create task checklist. All formatting visible.
5. **Highlight colors**: Click each of the 5 color swatches → highlighted text shows correct background color.
6. **AI Tutor toggle**: While on workspace screen, click "AI Mentor" button in header → left panel switches from PDF viewer to AI Tutor placeholder.
7. **Standalone Notebook**: Sidebar → Notebook → select subject → same Tiptap editor with full toolbar.
8. **Save toast**: Click Save in notebook panel → `sonner` toast appears "Notes saved ✓".

---

## PREVIOUS CHANGES (Already Implemented)

---

## 1. Role Selection Screen — Simplify Cards

**Change:** Remove all descriptive text and CTA ("Sign in as…") from the three role cards. Each card shows only:
- A large emoji/icon
- The role label (Student / Teacher / Admin)

No description, no arrow link.

**File:** `src/app/App.tsx` — `RoleSelectPage` component  
Remove: `desc` field from roles array, `<p>` description element, `ArrowRight` CTA div.  
Keep: gradient icon, role label `<h3>`, hover ring effects.

---

## 2. Logout — Move from Menu to Profile Popup

### 2a. Remove Logout from SideMenu
In `SideMenu` component, remove the bottom `<div>` containing the Sign Out button and `border-t` separator.

### 2b. Add Confirmation Dialog (shared utility)
Add a reusable `ConfirmDialog` component:
```
<ConfirmDialog
  open={boolean}
  message="Are you sure you want to log out?"
  onConfirm={() => { ... }}
  onCancel={() => { ... }}
/>
```
Renders a small centered modal overlay with Yes (red) / No (gray) buttons.

### 2c. Profile Popup (top-right avatar click)
In `AppHeader`, add `profileOpen: boolean` state triggered by clicking the user avatar circle.

The popup is a **medium-sized card** (not full-page), positioned below the avatar, containing:

| Field | Placeholder value |
|---|---|
| Student Name | from `userName` |
| Student ID | STU-2024-009 |
| Standard | 9th B |
| School / College Name | Sunrise International School |
| Date of Birth | 12 March 2010 |
| Year of Studying | 2024–25 |
| GR Number | GR-7821 |
| Home Address | 42, Shanti Nagar, Pune – 411001 |
| Parent's Email | parent@example.com |
| Parent's Contact | +91 98765 43210 |
| Student Email | aaravi@example.com |
| School Address | Plot 15, Baner Road, Pune – 411045 |

Logout button at the bottom — red text, full-width, triggers `ConfirmDialog`.

The popup closes when clicking outside (backdrop div).

---

## 3. Student Sidebar Menu — Restructure

Replace existing 5-item flat list in `SideMenu` with role-aware content.  
When `role === "student"`, render:

**Top block — "My Class"**
- Label: `My Class`
- Standard: `9th B`
- Class Teacher: `Mr. Ramesh Patil`

**Section 1 — Learning**
- Subjects
- Notebook
- Today's Task

**Section 2 — Progress**
- Achievements
- Tasks & Scores
- Assignments

**Section 3 — Resources**
- Library
- Downloads

**Bottom — standalone**
- Settings

Each item is clickable and sets `activeScreen` in the root `App` state.  
Active item is highlighted with `bg-primary/10 text-primary`.

For Teacher and Admin roles, the menu keeps the current generic items (no change to their menus in this phase).

---

## 4. Student Panel — Multi-Screen Navigation

Add `studentScreen` state to root `App`:
```ts
type StudentScreen =
  | "dashboard"
  | "subjects"
  | "subject-detail"
  | "notebook"
  | "todays-task"
  | "achievements"
  | "task-scores"
  | "assignments"
  | "library"
  | "downloads"
  | "settings";
```

`StudentDashboard` becomes a **router** — renders the correct sub-screen based on `studentScreen`.  
The `SideMenu` calls `setStudentScreen(...)` on each item click and closes the menu.

---

## 5. Subjects Screen

**Route:** `studentScreen === "subjects"`

Shows a grid of subject cards (all subjects in the student's curriculum):
- English, Mathematics, Science, Social Science, Hindi
- Each card: subject icon/color, name, short tagline, chapter count, % complete progress bar

Clicking a subject → `studentScreen = "subject-detail"` + stores selected subject in state.

---

## 6. Subject Detail Screen

**Route:** `studentScreen === "subject-detail"`

Layout: Two sections
- **Left / Top half:**
  - Subject name + about (2-3 sentence description)
  - Progress bar (e.g. 40% complete)
  - Chapter list: chapter number, chapter name, lesson count
  - Clicking a chapter opens a PDF viewer placeholder (grey area with chapter title + "Textbook PDF will load here" message)
  - When PDF is open: Left = PDF viewer, Right = Notebook panel (split view)

- **Right / Bottom half:**
  - Tasks assigned by teacher for this subject
  - Each task: name, due date, status (Pending / Completed)

Back button returns to Subjects list.

---

## 7. Notebook Screen

**Route:** `studentScreen === "notebook"`

Flow:
1. First: Subject selector dropdown (all subjects + "Rough Notebook" option)
2. After selection: Full notebook area appears on the right side
   - Simple `<textarea>` styled as a lined notebook page
   - Subject label at the top
3. Back button / navigation away triggers an auto-save toast: green tick + "Saved automatically"

When accessed from Subject Detail (PDF open), the screen is split:
- Left: PDF viewer
- Right: Notebook

---

## 8. Today's Task Screen

**Route:** `studentScreen === "todays-task"`

Shows all subjects' homework/tasks in one list:
- Grouped by subject
- Each task: task name, assigned by, due date, status badge (Pending = amber, Completed = green)
- Filter tabs: All / Pending / Completed

---

## 9. Progress Screens

### Achievements (`studentScreen === "achievements"`)
Grid of achievement badges (placeholder: 6 badges, some locked/unlocked).

### Tasks & Scores (`studentScreen === "task-scores"`)
Table: Test name, subject, date, score, max marks.

### Assignments (`studentScreen === "assignments"`)
List: Assignment name, subject, submitted date, teacher feedback, grade.

---

## 10. Resources Screens

### Library (`studentScreen === "library"`)
Grid of PDF/book cards — additional materials provided by the teacher. Each card: title, subject tag, file type icon, "Open" button.

### Downloads (`studentScreen === "downloads"`)
Grid of saved notes and downloaded files. Each item: filename, size, date saved, preview icon.

---

## 11. Settings Screen

**Route:** `studentScreen === "settings"`

Simple settings page with sections:
- Profile (view only — points to profile popup)
- Notifications (toggle on/off)
- Language preference
- App theme (Light / Dark — toggle only, visual not wired)
- About

---

## Files to Modify

| File | Changes |
|---|---|
| `src/app/App.tsx` | All changes — single file build |

All new screens and components are added within `App.tsx` as new function components, consistent with the existing pattern.

---

## New State in Root `App`

```ts
const [studentScreen, setStudentScreen] = useState<StudentScreen>("dashboard");
const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
const [profileOpen, setProfileOpen] = useState(false);
const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
```

Reset `studentScreen` to `"dashboard"` on logout/new login.

---

## Verification

1. **Role Select**: Open app → verify 3 plain cards with only icon + label, no description
2. **Sidebar**: Log in as Student → open menu → verify "My Class" block + 3 sections + Settings; no logout button
3. **Profile Popup**: Click avatar → verify popup with all student fields + red logout button → click logout → confirm dialog appears → Cancel keeps user logged in, Yes returns to role select
4. **Subjects Flow**: Menu → Subjects → click any subject → subject detail screen with chapters, progress, tasks
5. **Notebook**: Menu → Notebook → select subject → textarea appears → navigate away → auto-save toast
6. **Today's Task**: Menu → Today's Task → all subjects' tasks in one view
7. **Progress/Resources/Settings**: Navigate to each screen via menu — verify correct screen renders
