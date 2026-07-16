# AI Smart Notebook – Teacher Panel Product Specification (Updated)

## System Hierarchy

The AI Smart Notebook follows a hierarchical architecture similar to how schools and colleges operate in the real world.

```
Mentora Technologies
        │
Master Admin (One per Institution)
        │
Institution Administrators
(Principal / Vice Principal / HOD / Management)
        │
Teachers
(Class Teachers & Subject Teachers)
        │
Students
```

### Hierarchy Responsibilities

### Master Admin

* Created by Mentora Technologies.
* Only one Master Admin account per school or college.
* Manages institution setup.
* Creates Institution Administrators.
* Has complete system access.

### Institution Administrators

Examples:

* Principal
* Vice Principal
* Head of Department (HOD)
* Management Staff

Responsibilities:

* Create teacher accounts.
* Assign teachers to classes and subjects.
* Manage timetables.
* Configure academic calendars.
* Assign permissions.
* Publish notices.
* Monitor teachers and students.

Teachers should never create other teachers. Every teacher account is created and managed by the respective Institution Administrator.

---

# Teacher Panel Vision

The Teacher Panel is a dedicated workspace designed specifically for educators.

Its purpose is to simplify teaching, reduce administrative work, automate repetitive tasks, and provide intelligent insights into student learning.

The Teacher Panel should share the same design language as the Student Panel while providing a completely different interface optimized for teachers.

The UI should be:

* Simple
* Clean
* Professional
* Easy to navigate
* Minimal
* Productivity focused

Avoid overwhelming teachers with unnecessary information.

---

# Teacher Header

Display the teacher information at the top.

Example:

**Vedant Gali**

Class Teacher – Grade 10 A

or

**Vedant Gali**

Physics Teacher

This information should always be visible so the teacher immediately knows the active role.

---

# Teacher Workflow

A typical teacher's workflow should be:

Login

↓

View Dashboard

↓

Check Today's Timetable

↓

Take Attendance

↓

Open Assigned Class

↓

Teach Today's Lesson

↓

Upload Notes

↓

Assign Homework

↓

Answer Student Questions

↓

Create Assignments

↓

Create Tests

↓

Review Student Performance

↓

Generate Reports

↓

Logout

The UI should naturally guide the teacher through this workflow.

---

# Dashboard

The Teacher Dashboard should provide a quick overview of daily activities.

Include:

* Today's Classes
* Upcoming Classes
* Today's Schedule
* Pending Homework Reviews
* Pending Assignment Reviews
* Upcoming Tests
* Attendance Summary
* Recent Student Questions
* Recent Notices
* AI Recommendations
* Quick Calendar Preview
* Quick Actions

Quick Actions:

* Start Class
* Take Attendance
* Upload Notes
* Create Assignment
* Create Test
* Send Announcement
* Open AI Mentor

---

# Assigned Classes (New Module)

Every teacher should have an **Assigned Classes** section.

This is one of the primary navigation options.

The behavior depends on the teacher's role.

---

## Class Teacher

Example:

Vedant Gali

Class Teacher

Grade 10 A

Assigned Classes

* Grade 10 A

Opening the class should display:

* Total Students
* Student List
* Roll Numbers
* Attendance Summary
* Class Strength
* Academic Progress
* Homework Status
* Assignment Status

---

## Subject Teacher

Example:

Physics Teacher

Assigned Classes

* Grade 10 A
* Grade 10 B
* Grade 10 C

Selecting any class should display:

* Student List
* Roll Numbers
* Subject Progress
* Assignment Status
* Marks
* Attendance for that subject (if applicable)

This allows subject teachers to manage every class they teach while class teachers manage their own advisory class.

---

# Student Management

Within every assigned class, teachers should be able to view student information.

Each student card should display:

* Student Name
* Roll Number
* Profile Photo
* Attendance
* Homework Status
* Assignment Status
* Learning Progress
* AI Learning Score
* Risk Indicator

Clicking a student opens a detailed student profile.

---

# Attendance Management

Attendance should be fast and intuitive.

Features:

* Present
* Absent
* Late
* Leave

Support:

* Bulk Attendance
* Search Students
* Edit Attendance
* Attendance History
* Monthly Reports
* AI Attendance Insights

Attendance permissions should follow the institution's configuration. For example, class teachers may have full attendance privileges while subject teachers may have limited or subject-specific access.

---

# Timetable & Calendar (New Module)

Add a dedicated navigation option called **Timetable & Calendar**.

Layout:

### Left Side

Today's Timetable

Weekly Timetable

Upcoming Classes

Recent Timetable Changes

Substitution Classes

Cancelled Classes

Room Changes

Important schedule updates

---

### Right Side

Academic Calendar

Display:

* Monthly calendar
* Academic events
* Holidays
* Examination dates
* Parent meetings
* Workshops
* School functions
* Important institutional events

The calendar should visually highlight upcoming events.

This screen should become the teacher's daily planning workspace.

---

# Lesson Planner

Teachers should be able to create and manage lesson plans.

Include:

* Weekly Planner
* Monthly Planner
* Chapter Planner
* Learning Objectives
* Required Resources
* Homework Plan
* Teaching Notes
* Progress Tracking

---

# Digital Library

Teachers should access:

* Official Textbooks
* Reference Books
* Teacher Manuals
* Presentation Slides
* Worksheets
* Question Banks
* Previous Year Papers
* Sample Papers

Everything should be organized subject-wise.

---

# Smart Notes

Teachers should:

* Create Notes
* Edit Notes
* Upload PDFs
* Upload PPTs
* Upload Videos
* Upload Worksheets
* Share Notes
* Schedule Publishing
* Maintain Version History

---

# Homework Management

Teachers should:

* Create Homework
* Attach Files
* Set Deadlines
* Assign to Individual Classes
* Assign to Multiple Classes
* Schedule Homework
* Review Student Submissions
* Mark Homework
* Return Feedback
* Track Late Submissions

---

# Assignment Management

Teachers should create:

* Individual Assignments
* Group Assignments

Each assignment should support:

* Title
* Description
* Attachments
* Rubrics
* Due Date
* Maximum Marks
* Submission Type

Teachers should:

* Review Work
* Annotate PDFs
* Grade Assignments
* Add Feedback
* Generate Performance Reports

---

# Test & Examination

Teachers can create:

* Practice Tests
* Unit Tests
* Chapter Tests
* Mid-Term Exams
* Final Exams
* Objective Tests
* Subjective Tests
* Mixed Papers

Features:

* AI Question Generator
* Question Bank
* Random Paper Generation
* Difficulty Selection
* Automatic Evaluation (Objective)
* Manual Evaluation (Subjective)
* Result Publishing
* Performance Analytics

---

# Gradebook

Display:

* Homework
* Assignments
* Tests
* Projects
* Practicals
* Attendance
* Overall Grade

Provide:

* Charts
* Performance Trends
* Export to PDF
* Export to Excel

---

# Student Analytics

Every student should have an analytics dashboard showing:

* Learning Progress
* Strengths
* Weak Areas
* Homework Completion
* Attendance Trend
* Test Performance
* Revision Progress
* AI Learning Insights
* Personalized Recommendations

---

# Communication Center

Teachers should communicate with:

* Students
* Parents
* Administrators

Support:

* Announcements
* Messages
* Homework Notifications
* Exam Notices
* Parent Communication
* Broadcast Messages
* Scheduled Messages

---

# Notice Management

Teachers can create:

* Class Notices
* Homework Notices
* Activity Notices
* General Announcements

Support:

* Scheduling
* Attachments
* Target Class Selection

---

# AI Mentor for Teachers

The Teacher AI Mentor acts as an intelligent teaching assistant.

Capabilities include:

### Lesson Planning

* Generate Lesson Plans
* Suggest Classroom Activities
* Explain Difficult Topics
* Generate Presentations

### Assessment

* Generate Homework
* Generate Assignments
* Generate Question Papers
* Generate Quizzes
* Create Answer Keys
* Generate Rubrics

### Student Insights

* Identify Struggling Students
* Recommend Interventions
* Suggest Personalized Learning Paths
* Summarize Class Performance

### Content Creation

* Generate Notes
* Generate Flashcards
* Generate Diagrams
* Generate Revision Material

### Administration

* Draft Notices
* Write Emails
* Prepare Reports
* Create Parent Communication

The AI Mentor should understand the teacher's assigned classes, subjects, timetable, syllabus, and academic schedule to provide context-aware assistance.

---

# Reports

Teachers should generate:

* Attendance Reports
* Homework Reports
* Assignment Reports
* Test Reports
* Student Reports
* Class Reports
* Parent Reports
* Progress Reports

Export formats:

* PDF
* Excel

---

# Profile & Settings

Display:

* Personal Details
* Assigned Subjects
* Assigned Classes
* Qualifications
* Experience
* Teaching Preferences
* Notification Settings
* Privacy Settings
* Theme
* Language
* Connected Devices

---

# UI/UX Principles

The Teacher Panel should feel like a professional productivity workspace.

Design Goals:

* Minimal and clean interface
* Simple navigation
* Easy-to-understand terminology
* Large readable typography
* Consistent spacing
* Minimal clicks to complete tasks
* Responsive across supported devices
* Fast and intuitive workflows

Avoid clutter, excessive menus, or overly technical terminology.

The interface should help teachers complete their daily work efficiently while keeping the experience calm, organized, and easy to use.
