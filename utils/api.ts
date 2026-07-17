import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "./supabase/info";

// ─── Supabase browser client ──────────────────────────────────────────────────

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
  { auth: { autoRefreshToken: true, persistSession: true } }
);

// ─── Server base URL ──────────────────────────────────────────────────────────

const BASE = `https://${projectId}.supabase.co/functions/v1/server/make-server-1d2d9e09`;

async function req<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data as T;
}

const getToken = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const auth = {
  async login(roleId: string, password: string) {
    // Get email from server
    const { email } = await req<{ email: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ role_id: roleId, password }),
    });
    // Sign in with Supabase auth
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async ensureAccount(roleId: string, fullName: string, role: string) {
    return req<{ email: string; exists: boolean; created?: boolean }>(
      "/auth/ensure-account",
      { method: "POST", body: JSON.stringify({ role_id: roleId, full_name: fullName, role }) }
    );
  },

  async getProfile() {
    const token = await getToken();
    if (!token) return null;
    return req<{ user: any; profile: any }>("/auth/profile", {}, token);
  },

  async logout() {
    await supabase.auth.signOut();
  },
};

// ─── Institutions ─────────────────────────────────────────────────────────────

export const institutions = {
  list: () => req<any[]>("/institutions"),
  create: (body: any) => req<any>("/institutions", { method: "POST", body: JSON.stringify(body) }),
};

// ─── Teachers ─────────────────────────────────────────────────────────────────

export const teachers = {
  list: () => req<any[]>("/teachers"),
  get: (id: string) => req<any>(`/teachers/${id}`),
  create: (body: any) => req<any>("/teachers", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: any) => req<any>(`/teachers/${id}`, { method: "PUT", body: JSON.stringify(body) }),
};

// ─── Students ─────────────────────────────────────────────────────────────────

export const students = {
  list: (classId?: string) => req<any[]>(`/students${classId ? `?class_id=${classId}` : ""}`),
  get: (id: string) => req<any>(`/students/${id}`),
  create: (body: any) => req<any>("/students", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: any) => req<any>(`/students/${id}`, { method: "PUT", body: JSON.stringify(body) }),
};

// ─── Classes ─────────────────────────────────────────────────────────────────

export const classes = {
  list: (teacherId?: string) => req<any[]>(`/classes${teacherId ? `?teacher_id=${teacherId}` : ""}`),
  create: (body: any) => req<any>("/classes", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: any) => req<any>(`/classes/${id}`, { method: "PUT", body: JSON.stringify(body) }),
};

// ─── Subjects ─────────────────────────────────────────────────────────────────

export const subjects = {
  list: () => req<any[]>("/subjects"),
  create: (body: any) => req<any>("/subjects", { method: "POST", body: JSON.stringify(body) }),
};

// ─── Attendance ───────────────────────────────────────────────────────────────

export const attendance = {
  list: (params: { class_id?: string; date?: string; student_id?: string }) => {
    const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]);
    return req<any[]>(`/attendance?${q}`);
  },
  save: (records: any | any[]) =>
    req<any[]>("/attendance", { method: "POST", body: JSON.stringify(records) }),
  update: (id: string, body: any) =>
    req<any>(`/attendance/${id}`, { method: "PUT", body: JSON.stringify(body) }),
};

// ─── Homework ─────────────────────────────────────────────────────────────────

export const homework = {
  list: (params: { teacher_id?: string; class_id?: string } = {}) => {
    const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]);
    return req<any[]>(`/homework?${q}`);
  },
  create: (body: any) => req<any>("/homework", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: any) => req<any>(`/homework/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete: (id: string) => req<any>(`/homework/${id}`, { method: "DELETE" }),
  getSubmissions: (id: string) => req<any[]>(`/homework/${id}/submissions`),
  submit: (id: string, body: any) =>
    req<any>(`/homework/${id}/submissions`, { method: "POST", body: JSON.stringify(body) }),
  gradeSubmission: (submissionId: string, body: any) =>
    req<any>(`/homework/submissions/${submissionId}`, { method: "PUT", body: JSON.stringify(body) }),
};

// ─── Assignments ──────────────────────────────────────────────────────────────

export const assignments = {
  list: (params: { teacher_id?: string; class_id?: string } = {}) => {
    const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]);
    return req<any[]>(`/assignments?${q}`);
  },
  create: (body: any) => req<any>("/assignments", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: any) => req<any>(`/assignments/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete: (id: string) => req<any>(`/assignments/${id}`, { method: "DELETE" }),
};

// ─── Tests ────────────────────────────────────────────────────────────────────

export const tests = {
  list: (params: { teacher_id?: string; class_id?: string } = {}) => {
    const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]);
    return req<any[]>(`/tests?${q}`);
  },
  create: (body: any) => req<any>("/tests", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: any) => req<any>(`/tests/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete: (id: string) => req<any>(`/tests/${id}`, { method: "DELETE" }),
};

// ─── Marks ────────────────────────────────────────────────────────────────────

export const marks = {
  list: (params: { test_id?: string; student_id?: string } = {}) => {
    const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]);
    return req<any[]>(`/marks?${q}`);
  },
  save: (records: any | any[]) =>
    req<any[]>("/marks", { method: "POST", body: JSON.stringify(records) }),
};

// ─── Notes ────────────────────────────────────────────────────────────────────

export const notes = {
  list: async (params: { user_id?: string; chapter_key?: string } = {}) => {
    const token = await getToken();
    const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]);
    return req<any[]>(`/notes?${q}`, {}, token);
  },
  create: async (body: any) => {
    const token = await getToken();
    return req<any>("/notes", { method: "POST", body: JSON.stringify(body) }, token);
  },
  update: async (id: string, body: any) => {
    const token = await getToken();
    return req<any>(`/notes/${id}`, { method: "PUT", body: JSON.stringify(body) }, token);
  },
  delete: async (id: string) => {
    const token = await getToken();
    return req<any>(`/notes/${id}`, { method: "DELETE" }, token);
  },
};

// ─── Resources ────────────────────────────────────────────────────────────────

export const resources = {
  list: (params: { subject_id?: string; class_id?: string; is_approved?: boolean } = {}) => {
    const q = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    );
    return req<any[]>(`/resources?${q}`);
  },
  create: (body: any) => req<any>("/resources", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: any) => req<any>(`/resources/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete: (id: string) => req<any>(`/resources/${id}`, { method: "DELETE" }),
  getSignedUrl: async (path: string) => {
    const token = await getToken();
    return req<{ url: string }>(`/storage/signed-url?path=${encodeURIComponent(path)}`, {}, token);
  },
  listStorage: async (folder?: string) => {
    const token = await getToken();
    return req<any[]>(`/storage/list${folder ? `?folder=${folder}` : ""}`, {}, token);
  },
};

// ─── Notices ──────────────────────────────────────────────────────────────────

export const notices = {
  list: (audience?: string) =>
    req<any[]>(`/notices?is_published=true${audience ? `&audience=${audience}` : ""}`),
  listAll: () => req<any[]>("/notices"),
  create: (body: any) => req<any>("/notices", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: any) => req<any>(`/notices/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  delete: (id: string) => req<any>(`/notices/${id}`, { method: "DELETE" }),
};

// ─── Messages ─────────────────────────────────────────────────────────────────

export const messages = {
  inbox: async (userId: string) => {
    const token = await getToken();
    return req<any[]>(`/messages?user_id=${userId}`, {}, token);
  },
  sent: async (userId: string) => {
    const token = await getToken();
    return req<any[]>(`/messages?user_id=${userId}&type=sent`, {}, token);
  },
  send: async (body: any) => {
    const token = await getToken();
    return req<any>("/messages", { method: "POST", body: JSON.stringify(body) }, token);
  },
  markRead: async (id: string) => {
    const token = await getToken();
    return req<any>(`/messages/${id}/read`, { method: "PUT" }, token);
  },
};

// ─── Timetable ───────────────────────────────────────────────────────────────

export const timetable = {
  list: (params: { class_id?: string; teacher_id?: string } = {}) => {
    const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]);
    return req<any[]>(`/timetable?${q}`);
  },
  save: (body: any | any[]) =>
    req<any[]>("/timetable", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: any) =>
    req<any>(`/timetable/${id}`, { method: "PUT", body: JSON.stringify(body) }),
};

// ─── Calendar ────────────────────────────────────────────────────────────────

export const calendar = {
  list: (month?: number, year?: number) => {
    const q = month && year ? `?month=${month}&year=${year}` : "";
    return req<any[]>(`/calendar${q}`);
  },
  create: (body: any) => req<any>("/calendar", { method: "POST", body: JSON.stringify(body) }),
  delete: (id: string) => req<any>(`/calendar/${id}`, { method: "DELETE" }),
};

// ─── Analytics ───────────────────────────────────────────────────────────────

export const analytics = {
  institution: () => req<any>("/analytics/institution"),
  student: (id: string) => req<any>(`/analytics/student/${id}`),
};

// ─── Seed ─────────────────────────────────────────────────────────────────────

export const seed = () => req<any>("/seed", { method: "POST" });
