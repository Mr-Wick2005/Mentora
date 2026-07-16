# AI Smart Notebook — Master Prompt (v1: Foundation)

> Use this in Figma Make for the initial prototype, then carry it into Antigravity (code editor) for the real build.

---

## 1. Project Summary

AI Smart Notebook is a **desktop application** (not a website — design for laptop screen resolutions, e.g. 1440×900 / 1920×1080, not mobile breakpoints), packaged as a standalone **.exe**.

It is a role-based learning platform with a strict top-down access hierarchy.

---

## 2. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| UI Framework | **React** | Component-based, matches Figma Make export |
| Desktop Shell | **Tauri** | Wraps React app into a native .exe; lighter and faster than Electron |
| Styling | Tailwind CSS (recommended) | Fast iteration, easy to keep consistent border-radius/spacing tokens |
| State Management | React Context or Zustand | Lightweight, fine for role-based session state |
| Backend / DB | TBD (you'll define later) | Needed for: user auth by ID+Name, curriculum data by standard/year, role-based record creation |
| Auth | Custom (ID + Name lookup, no password mentioned yet) | Confirm later if a password/PIN layer is needed |

⚠️ Confirm: Tauri requires Rust installed in the build environment — that's fine for Antigravity/local dev, just flagging it's not a pure JS toolchain under the hood.

---

## 3. Role Hierarchy (Access Control)

```
Master Admin (1 — provided by Product Manager, not created in-app)
   │
   ├── creates → Admin (multiple)
   │                 │
   │                 ├── creates → Teacher (multiple)
   │                                   │
   │                                   ├── assigned to Class(es) (e.g. 5th, 6th, 9th)
   │                                   │
   │                                   └── creates → Student (multiple, scoped to assigned class)
```

**Rules:**
- Master Admin → can create Admin, Teacher, Student (full access, all levels).
- Admin → can create Teacher, Student. **Cannot** create another Admin or Master Admin.
- Teacher → can create Student (only within assigned class). **Cannot** create Teacher, Admin, or Master Admin.
- Student → cannot create anyone.
- Permissions only flow **downward**, never sideways or upward.
- Master Admin has a completely separate UI/UX (not part of the 3-role login screen) — to be detailed in a later prompt.

---

## 4. Page-Wise Flow

### Page 1 — Role Selection (App Launch Screen)
- Appears immediately on app open.
- Three options only: **Student / Teacher / Admin** (no Master Admin button here).
- UI: rounded buttons/cards — **no sharp corners anywhere**, generous border-radius throughout the app.
- Clean, minimal, centered layout (desktop scale, not mobile).

### Page 2 — Login (shared layout pattern for all 3 roles)
Same structure, role-specific labels:

| Role | Fields |
|---|---|
| Student | Student Name, Student ID / Roll Number |
| Teacher | Teacher Name, Teacher ID |
| Admin | Admin Name, Admin ID |

- On submit → fetch matching record from database.
- No separate Master Admin login screen (handled outside this flow).

### Page 3 — Home Dashboard (role-dependent content, shared header)

**Persistent Top Header — identical across every role and every screen:**
- Menu (hamburger/icon) — contents to be defined later
- AI Mentor option
- Wi-Fi signal indicator
- Battery indicator
- Clock/timestamp
- Back / Forward navigation arrows

This header never changes structure regardless of role or page — only the content below it changes.

**Below header, per role:**

- **Student** → Dashboard auto-populated based on fetched student data (e.g. Standard/Year, e.g. 9th grade → loads 9th-grade curriculum automatically). Dashboard contents (progress, subjects, etc.) to be detailed in a future prompt.
- **Teacher** → Dashboard shows assigned class(es) (e.g. 5th, 6th, 9th) and teacher-specific tools. Contents to be detailed later.
- **Admin** → Dashboard shows admin-level controls (creating teachers/students, oversight). Contents to be detailed later.

---

## 5. UI/UX Guidelines (this phase)

- **Border radius:** Apply consistently to all containers, buttons, cards, input fields — avoid any sharp/boxy elements.
- **Color palette:** Keep simple and clean at this stage — neutral base (whites/light greys) with one primary accent color and one secondary accent. Avoid overdesigning; this is a functional planning prototype, not a final visual identity.
- **Layout target:** Laptop/desktop screen sizes only — no mobile-first assumptions.
- **Consistency rule:** The header component should be built once and reused identically across all role dashboards and sub-pages.

---

## 6. What's Intentionally Left for Later Prompts
- Master Admin's separate UI/UX
- Menu option contents
- AI Mentor feature behavior
- Full Student/Teacher/Admin dashboard widgets and data
- Database schema for users, classes, curriculum
- Authentication security (password/PIN layer, if any)

---

*This is Prompt v1 — covers app shell, role hierarchy, login flow, and shared header only. Each dashboard will get its own dedicated prompt once you describe its contents.*