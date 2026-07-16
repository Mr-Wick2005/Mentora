export type Role = "student" | "teacher" | "admin";
export type Page = "role-select" | "login" | "dashboard";
export type LeftPanelMode = "pdf" | "ai-tutor";

export interface ChapterRef {
  subject: string;
  name: string;
  num: number;
  idx: number;
}

export type StudentScreen =
  | "dashboard" | "subjects" | "subject-detail" | "workspace"
  | "notebook" | "todays-task" | "test-score" | "achievements"
  | "notice-board" | "library" | "downloads" | "settings";

export type TeacherScreen =
  | "dashboard" | "my-classes" | "class-detail" | "attendance"
  | "timetable" | "lesson-planner" | "smart-notes" | "library"
  | "homework" | "assignments" | "tests" | "gradebook"
  | "student-analytics" | "communication" | "notice-board"
  | "reports" | "settings";

export type AdminScreen =
  | "dashboard" | "teacher-management" | "class-management" | "student-management"
  | "teacher-monitoring" | "student-monitoring" | "timetable" | "calendar"
  | "notice-management" | "reports" | "communication" | "resource-monitoring"
  | "activity-logs" | "settings";
