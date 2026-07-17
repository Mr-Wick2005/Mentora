import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono();
const PREFIX = "/make-server-1d2d9e09";

app.use("*", logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

// ─── Supabase clients ────────────────────────────────────────────────────────

const adminClient = () => createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const userClient = (token: string) => createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!,
  {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  }
);

const getToken = (c: any): string | null =>
  c.req.header("Authorization")?.replace("Bearer ", "") ?? null;

const err = (c: any, msg: string, status = 400) =>
  c.json({ error: msg }, status);

// ─── Health ──────────────────────────────────────────────────────────────────

app.get(`${PREFIX}/health`, (c) => c.json({ status: "ok", version: "2.0.0" }));

// ─── Seed demo data (idempotent) ─────────────────────────────────────────────

app.post(`${PREFIX}/seed`, async (c) => {
  const sb = adminClient();
  try {
    // Seed institution
    const { data: inst } = await sb.from("institutions").upsert({
      id: "00000000-0000-0000-0000-000000000001",
      name: "Sunrise International School",
      address: "Plot 15, Baner Road, Pune – 411045",
      phone: "+91 020 4567 8900",
      email: "info@sunriseschool.edu",
    }, { onConflict: "id" }).select().single();

    // Create demo auth users
    const demoUsers = [
      { email: "adm2024001@ainotebook.demo", password: "Demo@2024", name: "Ms. Priya Das", role: "admin", eid: "ADM-2024-001" },
      { email: "tch2024042@ainotebook.demo", password: "Demo@2024", name: "Mr. Rajan Mehta", role: "teacher", eid: "TCH-2024-042" },
      { email: "stu2024009@ainotebook.demo", password: "Demo@2024", name: "Aaravi Sharma", role: "student", eid: "STU-2024-009" },
      { email: "tch2024043@ainotebook.demo", password: "Demo@2024", name: "Ms. Neha Patel", role: "teacher", eid: "TCH-2024-043" },
      { email: "stu2024010@ainotebook.demo", password: "Demo@2024", name: "Rohan Mehta", role: "student", eid: "STU-2024-010" },
      { email: "stu2024011@ainotebook.demo", password: "Demo@2024", name: "Priya Patel", role: "student", eid: "STU-2024-011" },
    ];

    const userIds: Record<string, string> = {};
    for (const u of demoUsers) {
      const { data: existing } = await sb.auth.admin.listUsers();
      const found = existing?.users?.find(x => x.email === u.email);
      let uid: string;
      if (found) {
        uid = found.id;
      } else {
        const { data: created, error } = await sb.auth.admin.createUser({
          email: u.email, password: u.password,
          email_confirm: true,
          user_metadata: { full_name: u.name, role: u.role, employee_id: u.eid },
        });
        if (error) continue;
        uid = created.user.id;
      }
      userIds[u.eid] = uid;

      // Upsert profile
      await sb.from("profiles").upsert({
        id: uid,
        role: u.role,
        full_name: u.name,
        institution_id: "00000000-0000-0000-0000-000000000001",
        employee_id: ["admin", "teacher"].includes(u.role) ? u.eid : null,
        roll_number: u.role === "student" ? u.eid : null,
      }, { onConflict: "id" });
    }

    // Seed subjects
    const subjects = [
      { id: "10000000-0000-0000-0000-000000000001", name: "English", code: "ENG" },
      { id: "10000000-0000-0000-0000-000000000002", name: "Mathematics", code: "MAT" },
      { id: "10000000-0000-0000-0000-000000000003", name: "Science", code: "SCI" },
      { id: "10000000-0000-0000-0000-000000000004", name: "Social Science", code: "SSC" },
      { id: "10000000-0000-0000-0000-000000000005", name: "Hindi", code: "HIN" },
    ];
    for (const s of subjects) {
      await sb.from("subjects").upsert({ ...s, institution_id: "00000000-0000-0000-0000-000000000001" }, { onConflict: "id" });
    }

    // Seed class
    const teacherId = userIds["TCH-2024-042"];
    if (teacherId) {
      await sb.from("classes").upsert({
        id: "20000000-0000-0000-0000-000000000001",
        institution_id: "00000000-0000-0000-0000-000000000001",
        grade: "9th Grade", section: "B", teacher_id: teacherId, academic_year: "2024-25",
      }, { onConflict: "id" });

      // Seed timetable
      const days = [1, 2, 3, 4, 5, 6];
      const subjectIds = subjects.map(s => s.id);
      for (const day of days) {
        for (let p = 1; p <= 6; p++) {
          const subjectId = subjectIds[(day + p) % subjectIds.length];
          const startHour = 8 + p;
          await sb.from("timetable").upsert({
            id: `30000000-0000-0000-${String(day).padStart(4, "0")}-${String(p).padStart(12, "0")}`,
            class_id: "20000000-0000-0000-0000-000000000001",
            subject_id: subjectId,
            teacher_id: teacherId,
            day_of_week: day, period_number: p,
            start_time: `${startHour}:00`, end_time: `${startHour}:45`, room: `Room ${100 + p}`,
          }, { onConflict: "id" });
        }
      }
    }

    // Seed notices
    const adminId = userIds["ADM-2024-001"];
    if (adminId) {
      const notices = [
        { id: "40000000-0000-0000-0000-000000000001", title: "Unit Test 2 Schedule", content: "Unit Test 2 will be held from 15–20 July 2025. All students must carry their hall tickets.", category: "Examination", priority: "high" },
        { id: "40000000-0000-0000-0000-000000000002", title: "Parent-Teacher Meeting", content: "PTM scheduled for 28 July 2025 (Saturday) from 10 AM to 1 PM. Attendance mandatory.", category: "Meeting", priority: "medium" },
        { id: "40000000-0000-0000-0000-000000000003", title: "Sports Day 2025", content: "Annual Sports Day on 5 August 2025. Students may register for events by 25 July.", category: "Event", priority: "low" },
      ];
      for (const n of notices) {
        await sb.from("notices").upsert({ ...n, institution_id: "00000000-0000-0000-0000-000000000001", created_by: adminId, is_published: true }, { onConflict: "id" });
      }
    }

    return c.json({ ok: true, message: "Demo data seeded successfully" });
  } catch (e: any) {
    return err(c, e.message, 500);
  }
});

// ─── Auth ─────────────────────────────────────────────────────────────────────

// Convert role-specific ID to demo email
const idToEmail = (id: string) =>
  `${id.toLowerCase().replace(/[^a-z0-9]/g, "")}@ainotebook.demo`;

app.post(`${PREFIX}/auth/login`, async (c) => {
  const { role_id, password } = await c.req.json();
  if (!role_id) return err(c, "role_id required");
  const email = idToEmail(role_id);
  const sb = adminClient();

  // Find user by email via admin API
  const { data: users } = await sb.auth.admin.listUsers();
  const user = users?.users?.find(u => u.email === email);
  if (!user) return err(c, "Account not found. Please contact your administrator.", 404);

  // Return sign-in URL hint for frontend to use signInWithPassword
  return c.json({ email, hint: "use_client_auth" });
});

app.post(`${PREFIX}/auth/ensure-account`, async (c) => {
  // Auto-provision demo account if it doesn't exist (demo mode only)
  const { role_id, full_name, role } = await c.req.json();
  if (!role_id || !role) return err(c, "role_id and role required");
  const email = idToEmail(role_id);
  const sb = adminClient();

  const { data: existing } = await sb.auth.admin.listUsers();
  const found = existing?.users?.find(u => u.email === email);
  if (found) return c.json({ email, exists: true });

  // Create new demo account
  const { data, error } = await sb.auth.admin.createUser({
    email, password: "Demo@2024", email_confirm: true,
    user_metadata: { full_name: full_name || role_id, role, employee_id: role_id },
  });
  if (error) return err(c, error.message);

  // Create profile
  await sb.from("profiles").upsert({
    id: data.user.id, role, full_name: full_name || role_id,
    institution_id: "00000000-0000-0000-0000-000000000001",
    employee_id: role !== "student" ? role_id : null,
    roll_number: role === "student" ? role_id : null,
  }, { onConflict: "id" });

  return c.json({ email, exists: false, created: true });
});

app.get(`${PREFIX}/auth/profile`, async (c) => {
  const token = getToken(c);
  if (!token) return err(c, "Unauthorized", 401);
  const sb = userClient(token);
  const { data: { user }, error } = await sb.auth.getUser();
  if (error || !user) return err(c, "Unauthorized", 401);

  const { data: profile } = await adminClient()
    .from("profiles").select("*, institutions(*)").eq("id", user.id).single();
  return c.json({ user, profile });
});

// ─── Institutions ─────────────────────────────────────────────────────────────

app.get(`${PREFIX}/institutions`, async (c) => {
  const { data, error } = await adminClient().from("institutions").select("*").order("name");
  if (error) return err(c, error.message);
  return c.json(data);
});

app.post(`${PREFIX}/institutions`, async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("institutions").insert(body).select().single();
  if (error) return err(c, error.message);
  return c.json(data, 201);
});

// ─── Profiles ─────────────────────────────────────────────────────────────────

app.get(`${PREFIX}/teachers`, async (c) => {
  const { data, error } = await adminClient()
    .from("profiles").select("*, institutions(name)").eq("role", "teacher").order("full_name");
  if (error) return err(c, error.message);
  return c.json(data);
});

app.get(`${PREFIX}/teachers/:id`, async (c) => {
  const { data, error } = await adminClient()
    .from("profiles").select("*").eq("id", c.req.param("id")).eq("role", "teacher").single();
  if (error) return err(c, error.message, 404);
  return c.json(data);
});

app.post(`${PREFIX}/teachers`, async (c) => {
  const { email, password = "Demo@2024", full_name, employee_id, department, subjects, ...rest } = await c.req.json();
  const sb = adminClient();
  const { data, error } = await sb.auth.admin.createUser({
    email, password, email_confirm: true,
    user_metadata: { full_name, role: "teacher", employee_id },
  });
  if (error) return err(c, error.message);
  await sb.from("profiles").insert({
    id: data.user.id, role: "teacher", full_name, employee_id,
    institution_id: rest.institution_id || "00000000-0000-0000-0000-000000000001",
    department, ...rest,
  });
  return c.json({ id: data.user.id, email, full_name }, 201);
});

app.put(`${PREFIX}/teachers/:id`, async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient()
    .from("profiles").update(body).eq("id", c.req.param("id")).select().single();
  if (error) return err(c, error.message);
  return c.json(data);
});

app.get(`${PREFIX}/students`, async (c) => {
  const classId = c.req.query("class_id");
  let query = adminClient()
    .from("profiles").select("*, enrollments(class_id, classes(grade, section))").eq("role", "student").order("full_name");
  if (classId) {
    query = adminClient()
      .from("profiles").select("*, enrollments!inner(class_id, classes(grade, section))")
      .eq("role", "student").eq("enrollments.class_id", classId).order("full_name");
  }
  const { data, error } = await query;
  if (error) return err(c, error.message);
  return c.json(data);
});

app.get(`${PREFIX}/students/:id`, async (c) => {
  const { data, error } = await adminClient()
    .from("profiles").select("*").eq("id", c.req.param("id")).eq("role", "student").single();
  if (error) return err(c, error.message, 404);
  return c.json(data);
});

app.post(`${PREFIX}/students`, async (c) => {
  const { email, password = "Demo@2024", full_name, roll_number, grade, section, institution_id, ...rest } = await c.req.json();
  const sb = adminClient();
  const { data, error } = await sb.auth.admin.createUser({
    email: email || idToEmail(roll_number),
    password, email_confirm: true,
    user_metadata: { full_name, role: "student", roll_number },
  });
  if (error) return err(c, error.message);
  await sb.from("profiles").insert({
    id: data.user.id, role: "student", full_name, roll_number, grade, section,
    institution_id: institution_id || "00000000-0000-0000-0000-000000000001", ...rest,
  });
  return c.json({ id: data.user.id, full_name }, 201);
});

app.put(`${PREFIX}/students/:id`, async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient()
    .from("profiles").update(body).eq("id", c.req.param("id")).select().single();
  if (error) return err(c, error.message);
  return c.json(data);
});

// ─── Classes ──────────────────────────────────────────────────────────────────

app.get(`${PREFIX}/classes`, async (c) => {
  const teacherId = c.req.query("teacher_id");
  let query = adminClient().from("classes").select("*, profiles!classes_teacher_id_fkey(full_name), enrollments(count)").order("grade");
  if (teacherId) query = query.eq("teacher_id", teacherId);
  const { data, error } = await query;
  if (error) return err(c, error.message);
  return c.json(data);
});

app.post(`${PREFIX}/classes`, async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("classes").insert({
    ...body, institution_id: body.institution_id || "00000000-0000-0000-0000-000000000001"
  }).select().single();
  if (error) return err(c, error.message);
  return c.json(data, 201);
});

app.put(`${PREFIX}/classes/:id`, async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("classes").update(body).eq("id", c.req.param("id")).select().single();
  if (error) return err(c, error.message);
  return c.json(data);
});

// ─── Subjects ─────────────────────────────────────────────────────────────────

app.get(`${PREFIX}/subjects`, async (c) => {
  const { data, error } = await adminClient().from("subjects").select("*").order("name");
  if (error) return err(c, error.message);
  return c.json(data);
});

app.post(`${PREFIX}/subjects`, async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("subjects").insert({
    ...body, institution_id: body.institution_id || "00000000-0000-0000-0000-000000000001"
  }).select().single();
  if (error) return err(c, error.message);
  return c.json(data, 201);
});

// ─── Attendance ───────────────────────────────────────────────────────────────

app.get(`${PREFIX}/attendance`, async (c) => {
  const { class_id, date, student_id } = c.req.query();
  let query = adminClient().from("attendance").select("*, profiles!attendance_student_id_fkey(full_name, roll_number)");
  if (class_id) query = query.eq("class_id", class_id);
  if (date) query = query.eq("date", date);
  if (student_id) query = query.eq("student_id", student_id);
  const { data, error } = await query.order("date", { ascending: false });
  if (error) return err(c, error.message);
  return c.json(data);
});

app.post(`${PREFIX}/attendance`, async (c) => {
  const body = await c.req.json();
  // body can be array or single record
  const records = Array.isArray(body) ? body : [body];
  const { data, error } = await adminClient().from("attendance")
    .upsert(records, { onConflict: "student_id,class_id,date" }).select();
  if (error) return err(c, error.message);
  return c.json(data, 201);
});

app.put(`${PREFIX}/attendance/:id`, async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("attendance").update(body).eq("id", c.req.param("id")).select().single();
  if (error) return err(c, error.message);
  return c.json(data);
});

// ─── Homework ─────────────────────────────────────────────────────────────────

app.get(`${PREFIX}/homework`, async (c) => {
  const { teacher_id, class_id, student_id } = c.req.query();
  let query = adminClient().from("homework").select("*, subjects(name), classes(grade, section), profiles!homework_teacher_id_fkey(full_name)");
  if (teacher_id) query = query.eq("teacher_id", teacher_id);
  if (class_id) query = query.eq("class_id", class_id);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return err(c, error.message);
  return c.json(data);
});

app.post(`${PREFIX}/homework`, async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("homework").insert(body).select().single();
  if (error) return err(c, error.message);
  return c.json(data, 201);
});

app.put(`${PREFIX}/homework/:id`, async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("homework").update(body).eq("id", c.req.param("id")).select().single();
  if (error) return err(c, error.message);
  return c.json(data);
});

app.delete(`${PREFIX}/homework/:id`, async (c) => {
  const { error } = await adminClient().from("homework").delete().eq("id", c.req.param("id"));
  if (error) return err(c, error.message);
  return c.json({ ok: true });
});

// Homework submissions
app.get(`${PREFIX}/homework/:id/submissions`, async (c) => {
  const { data, error } = await adminClient().from("homework_submissions")
    .select("*, profiles!homework_submissions_student_id_fkey(full_name, roll_number)")
    .eq("homework_id", c.req.param("id"));
  if (error) return err(c, error.message);
  return c.json(data);
});

app.post(`${PREFIX}/homework/:id/submissions`, async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("homework_submissions")
    .upsert({ ...body, homework_id: c.req.param("id") }, { onConflict: "homework_id,student_id" }).select().single();
  if (error) return err(c, error.message);
  return c.json(data, 201);
});

app.put(`${PREFIX}/homework/submissions/:id`, async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("homework_submissions").update(body).eq("id", c.req.param("id")).select().single();
  if (error) return err(c, error.message);
  return c.json(data);
});

// ─── Assignments ──────────────────────────────────────────────────────────────

app.get(`${PREFIX}/assignments`, async (c) => {
  const { teacher_id, class_id } = c.req.query();
  let query = adminClient().from("assignments").select("*, subjects(name), classes(grade, section), profiles!assignments_teacher_id_fkey(full_name)");
  if (teacher_id) query = query.eq("teacher_id", teacher_id);
  if (class_id) query = query.eq("class_id", class_id);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return err(c, error.message);
  return c.json(data);
});

app.post(`${PREFIX}/assignments`, async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("assignments").insert(body).select().single();
  if (error) return err(c, error.message);
  return c.json(data, 201);
});

app.put(`${PREFIX}/assignments/:id`, async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("assignments").update(body).eq("id", c.req.param("id")).select().single();
  if (error) return err(c, error.message);
  return c.json(data);
});

app.delete(`${PREFIX}/assignments/:id`, async (c) => {
  const { error } = await adminClient().from("assignments").delete().eq("id", c.req.param("id"));
  if (error) return err(c, error.message);
  return c.json({ ok: true });
});

// ─── Tests ────────────────────────────────────────────────────────────────────

app.get(`${PREFIX}/tests`, async (c) => {
  const { teacher_id, class_id } = c.req.query();
  let query = adminClient().from("tests").select("*, subjects(name), classes(grade, section), profiles!tests_teacher_id_fkey(full_name)");
  if (teacher_id) query = query.eq("teacher_id", teacher_id);
  if (class_id) query = query.eq("class_id", class_id);
  const { data, error } = await query.order("date", { ascending: false });
  if (error) return err(c, error.message);
  return c.json(data);
});

app.post(`${PREFIX}/tests`, async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("tests").insert(body).select().single();
  if (error) return err(c, error.message);
  return c.json(data, 201);
});

app.put(`${PREFIX}/tests/:id`, async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("tests").update(body).eq("id", c.req.param("id")).select().single();
  if (error) return err(c, error.message);
  return c.json(data);
});

app.delete(`${PREFIX}/tests/:id`, async (c) => {
  const { error } = await adminClient().from("tests").delete().eq("id", c.req.param("id"));
  if (error) return err(c, error.message);
  return c.json({ ok: true });
});

// ─── Marks ────────────────────────────────────────────────────────────────────

app.get(`${PREFIX}/marks`, async (c) => {
  const { test_id, student_id } = c.req.query();
  let query = adminClient().from("marks").select("*, profiles!marks_student_id_fkey(full_name, roll_number), tests(title, max_marks, subjects(name))");
  if (test_id) query = query.eq("test_id", test_id);
  if (student_id) query = query.eq("student_id", student_id);
  const { data, error } = await query;
  if (error) return err(c, error.message);
  return c.json(data);
});

app.post(`${PREFIX}/marks`, async (c) => {
  const body = await c.req.json();
  const records = Array.isArray(body) ? body : [body];
  const { data, error } = await adminClient().from("marks")
    .upsert(records, { onConflict: "test_id,student_id" }).select();
  if (error) return err(c, error.message);
  return c.json(data, 201);
});

// ─── Notes ────────────────────────────────────────────────────────────────────

app.get(`${PREFIX}/notes`, async (c) => {
  const token = getToken(c);
  if (!token) return err(c, "Unauthorized", 401);
  const { user_id, chapter_key } = c.req.query();
  let query = adminClient().from("notes").select("*, subjects(name)");
  if (user_id) query = query.eq("user_id", user_id);
  if (chapter_key) query = query.eq("chapter_key", chapter_key);
  const { data, error } = await query.order("updated_at", { ascending: false });
  if (error) return err(c, error.message);
  return c.json(data);
});

app.post(`${PREFIX}/notes`, async (c) => {
  const token = getToken(c);
  if (!token) return err(c, "Unauthorized", 401);
  const body = await c.req.json();
  const { data, error } = await adminClient().from("notes").insert(body).select().single();
  if (error) return err(c, error.message);
  return c.json(data, 201);
});

app.put(`${PREFIX}/notes/:id`, async (c) => {
  const token = getToken(c);
  if (!token) return err(c, "Unauthorized", 401);
  const body = await c.req.json();
  const { data, error } = await adminClient().from("notes")
    .update({ ...body, updated_at: new Date().toISOString() }).eq("id", c.req.param("id")).select().single();
  if (error) return err(c, error.message);
  return c.json(data);
});

app.delete(`${PREFIX}/notes/:id`, async (c) => {
  const { error } = await adminClient().from("notes").delete().eq("id", c.req.param("id"));
  if (error) return err(c, error.message);
  return c.json({ ok: true });
});

// ─── Resources ────────────────────────────────────────────────────────────────

app.get(`${PREFIX}/resources`, async (c) => {
  const { subject_id, class_id, is_approved } = c.req.query();
  let query = adminClient().from("resources").select("*, subjects(name), profiles!resources_uploaded_by_fkey(full_name)");
  if (subject_id) query = query.eq("subject_id", subject_id);
  if (class_id) query = query.eq("class_id", class_id);
  if (is_approved !== undefined) query = query.eq("is_approved", is_approved === "true");
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return err(c, error.message);
  return c.json(data);
});

app.post(`${PREFIX}/resources`, async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("resources").insert({
    ...body, institution_id: body.institution_id || "00000000-0000-0000-0000-000000000001"
  }).select().single();
  if (error) return err(c, error.message);
  return c.json(data, 201);
});

app.put(`${PREFIX}/resources/:id`, async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("resources").update(body).eq("id", c.req.param("id")).select().single();
  if (error) return err(c, error.message);
  return c.json(data);
});

app.delete(`${PREFIX}/resources/:id`, async (c) => {
  const { error } = await adminClient().from("resources").delete().eq("id", c.req.param("id"));
  if (error) return err(c, error.message);
  return c.json({ ok: true });
});

// ─── Notices ──────────────────────────────────────────────────────────────────

app.get(`${PREFIX}/notices`, async (c) => {
  const { audience, is_published } = c.req.query();
  let query = adminClient().from("notices")
    .select("*, profiles!notices_created_by_fkey(full_name)")
    .order("created_at", { ascending: false });
  if (audience && audience !== "all") query = query.or(`target_audience.eq.all,target_audience.eq.${audience}`);
  if (is_published !== undefined) query = query.eq("is_published", is_published === "true");
  const { data, error } = await query;
  if (error) return err(c, error.message);
  return c.json(data);
});

app.post(`${PREFIX}/notices`, async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("notices").insert({
    ...body, institution_id: body.institution_id || "00000000-0000-0000-0000-000000000001"
  }).select().single();
  if (error) return err(c, error.message);
  return c.json(data, 201);
});

app.put(`${PREFIX}/notices/:id`, async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("notices").update(body).eq("id", c.req.param("id")).select().single();
  if (error) return err(c, error.message);
  return c.json(data);
});

app.delete(`${PREFIX}/notices/:id`, async (c) => {
  const { error } = await adminClient().from("notices").delete().eq("id", c.req.param("id"));
  if (error) return err(c, error.message);
  return c.json({ ok: true });
});

// ─── Messages ─────────────────────────────────────────────────────────────────

app.get(`${PREFIX}/messages`, async (c) => {
  const token = getToken(c);
  if (!token) return err(c, "Unauthorized", 401);
  const { user_id, type } = c.req.query();
  let query = adminClient().from("messages")
    .select("*, sender:profiles!messages_sender_id_fkey(full_name, role), recipient:profiles!messages_recipient_id_fkey(full_name, role)");
  if (user_id) {
    if (type === "sent") query = query.eq("sender_id", user_id);
    else query = query.eq("recipient_id", user_id);
  }
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return err(c, error.message);
  return c.json(data);
});

app.post(`${PREFIX}/messages`, async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("messages").insert(body).select().single();
  if (error) return err(c, error.message);
  return c.json(data, 201);
});

app.put(`${PREFIX}/messages/:id/read`, async (c) => {
  const { data, error } = await adminClient().from("messages").update({ is_read: true }).eq("id", c.req.param("id")).select().single();
  if (error) return err(c, error.message);
  return c.json(data);
});

// ─── Timetable ────────────────────────────────────────────────────────────────

app.get(`${PREFIX}/timetable`, async (c) => {
  const { class_id, teacher_id } = c.req.query();
  let query = adminClient().from("timetable")
    .select("*, subjects(name, code), classes(grade, section), profiles!timetable_teacher_id_fkey(full_name)");
  if (class_id) query = query.eq("class_id", class_id);
  if (teacher_id) query = query.eq("teacher_id", teacher_id);
  const { data, error } = await query.order("day_of_week").order("period_number");
  if (error) return err(c, error.message);
  return c.json(data);
});

app.post(`${PREFIX}/timetable`, async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("timetable")
    .upsert(body, { onConflict: "class_id,day_of_week,period_number" }).select();
  if (error) return err(c, error.message);
  return c.json(data, 201);
});

app.put(`${PREFIX}/timetable/:id`, async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("timetable").update(body).eq("id", c.req.param("id")).select().single();
  if (error) return err(c, error.message);
  return c.json(data);
});

// ─── Calendar Events ──────────────────────────────────────────────────────────

app.get(`${PREFIX}/calendar`, async (c) => {
  const { month, year } = c.req.query();
  let query = adminClient().from("calendar_events")
    .select("*, profiles!calendar_events_created_by_fkey(full_name)").order("event_date");
  if (month && year) {
    const start = `${year}-${month.padStart(2, "0")}-01`;
    const nextMonth = parseInt(month) === 12 ? `${parseInt(year) + 1}-01-01` : `${year}-${String(parseInt(month) + 1).padStart(2, "0")}-01`;
    query = query.gte("event_date", start).lt("event_date", nextMonth);
  }
  const { data, error } = await query;
  if (error) return err(c, error.message);
  return c.json(data);
});

app.post(`${PREFIX}/calendar`, async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("calendar_events").insert({
    ...body, institution_id: body.institution_id || "00000000-0000-0000-0000-000000000001"
  }).select().single();
  if (error) return err(c, error.message);
  return c.json(data, 201);
});

app.delete(`${PREFIX}/calendar/:id`, async (c) => {
  const { error } = await adminClient().from("calendar_events").delete().eq("id", c.req.param("id"));
  if (error) return err(c, error.message);
  return c.json({ ok: true });
});

// ─── Achievements ─────────────────────────────────────────────────────────────

app.get(`${PREFIX}/achievements`, async (c) => {
  const { student_id } = c.req.query();
  let query = adminClient().from("achievements").select("*");
  if (student_id) query = query.eq("student_id", student_id);
  const { data, error } = await query.order("earned_at", { ascending: false });
  if (error) return err(c, error.message);
  return c.json(data);
});

app.post(`${PREFIX}/achievements`, async (c) => {
  const body = await c.req.json();
  const { data, error } = await adminClient().from("achievements").insert(body).select().single();
  if (error) return err(c, error.message);
  return c.json(data, 201);
});

// ─── Storage — NCERT PDFs ─────────────────────────────────────────────────────

app.get(`${PREFIX}/storage/signed-url`, async (c) => {
  const token = getToken(c);
  if (!token) return err(c, "Unauthorized", 401);
  const path = c.req.query("path");
  if (!path) return err(c, "path required");
  const { data, error } = await adminClient().storage.from("ncert-pdfs").createSignedUrl(path, 3600);
  if (error) return err(c, error.message);
  return c.json({ url: data.signedUrl });
});

app.get(`${PREFIX}/storage/list`, async (c) => {
  const token = getToken(c);
  if (!token) return err(c, "Unauthorized", 401);
  const folder = c.req.query("folder") || "";
  const { data, error } = await adminClient().storage.from("ncert-pdfs").list(folder);
  if (error) return err(c, error.message);
  return c.json(data);
});

// ─── Analytics ────────────────────────────────────────────────────────────────

app.get(`${PREFIX}/analytics/institution`, async (c) => {
  const sb = adminClient();
  const [teachers, students, classes, notices] = await Promise.all([
    sb.from("profiles").select("id", { count: "exact" }).eq("role", "teacher"),
    sb.from("profiles").select("id", { count: "exact" }).eq("role", "student"),
    sb.from("classes").select("id", { count: "exact" }),
    sb.from("notices").select("id", { count: "exact" }).eq("is_published", true),
  ]);
  return c.json({
    teacher_count: teachers.count ?? 0,
    student_count: students.count ?? 0,
    class_count: classes.count ?? 0,
    notice_count: notices.count ?? 0,
  });
});

app.get(`${PREFIX}/analytics/student/:id`, async (c) => {
  const id = c.req.param("id");
  const sb = adminClient();
  const today = new Date().toISOString().split("T")[0];
  const monthStart = today.substring(0, 7) + "-01";

  const [attendance, marks, homework] = await Promise.all([
    sb.from("attendance").select("status", { count: "exact" }).eq("student_id", id).gte("date", monthStart),
    sb.from("marks").select("marks_obtained, tests(max_marks)").eq("student_id", id),
    sb.from("homework_submissions").select("status", { count: "exact" }).eq("student_id", id),
  ]);

  const attended = attendance.data?.filter(a => a.status === "present").length ?? 0;
  const total = attendance.count ?? 1;
  const avgScore = marks.data?.length
    ? Math.round(marks.data.reduce((sum, m) => sum + ((m.marks_obtained / ((m.tests as any)?.max_marks || 100)) * 100), 0) / marks.data.length)
    : 0;

  return c.json({
    attendance_pct: Math.round((attended / Math.max(total, 1)) * 100),
    avg_score: avgScore,
    homework_submitted: homework.count ?? 0,
  });
});

Deno.serve(app.fetch);
