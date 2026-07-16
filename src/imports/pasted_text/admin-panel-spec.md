# AI Smart Notebook – Admin Panel Product Specification

## Vision

The Admin Panel is the institutional management center of the AI Smart Notebook ecosystem.

Unlike Students, who focus on learning, and Teachers, who focus on teaching, the Admin focuses on monitoring, managing, assigning responsibilities, and maintaining the academic ecosystem.

The Admin should never perform teaching activities or student learning activities.

Instead, the Admin supervises the complete academic workflow of the institution.

The Admin Panel should provide complete visibility into teachers, students, classes, academic progress, reports, and communication while maintaining a clean, simple, and professional interface.

---

# System Hierarchy

The overall system architecture follows this hierarchy:

```text
Mentora Technologies
        │
Master Admin
(One per Institution)
        │
Institution Admins
(Primary Admin / Secondary Admin / Department Admin)
        │
Teachers
(Class Teachers & Subject Teachers)
        │
Students
```

Only the **Master Admin** can create Institution Admin accounts.

The Master Admin module is outside the scope of this prototype.

This specification focuses only on the Institution Admin Panel.

---

# Multiple Admin Architecture

A school or college may have multiple Admins.

Examples:

Primary Section Admin

Secondary Section Admin

Higher Secondary Admin

Department Admin

Each Admin should only have access to the teachers, students, classes, and academic records assigned to their section.

Example:

Primary Section Admin

Access:

* Grade 1–5
* Primary Teachers
* Primary Students

No access to secondary or higher secondary data.

Similarly,

Secondary Admin

Access:

* Grade 6–10
* Secondary Teachers
* Secondary Students

This role-based separation must be maintained throughout the application.

---

# Admin Dashboard

The Admin Dashboard should provide a high-level overview of the assigned institution or department.

Display:

* Total Teachers
* Total Students
* Total Classes
* Class Teachers
* Subject Teachers
* Active Classes
* Attendance Summary
* Assignment Completion Rate
* Homework Completion Rate
* Academic Performance Overview
* Recent Notices
* Upcoming Academic Events
* Pending Teacher Requests
* AI Recommendations

Provide attractive dashboard cards with charts and quick statistics.

---

# Quick Actions

Include simple, frequently used actions.

Examples:

* Register Teacher
* Assign Teacher
* Create Class
* Manage Students
* Publish Notice
* View Reports
* Generate Report
* Open AI Mentor

These should be displayed as quick-access cards on the dashboard.

---

# Teacher Management

Teacher Management is one of the primary responsibilities of the Admin.

The Admin should be able to:

* Register new teachers
* Edit teacher information
* Deactivate teacher accounts
* Activate teacher accounts
* Search teachers
* Filter teachers
* View teacher profiles

Each teacher profile should display:

* Name
* Employee ID
* Profile Photo
* Designation
* Subject
* Assigned Classes
* Role
* Experience
* Contact Information
* Joining Date
* Account Status

---

# Teacher Role Assignment

The Admin should assign each teacher's role.

Supported roles:

### Class Teacher

A Class Teacher can:

* Take attendance
* Manage one assigned class
* Monitor overall student progress
* Communicate with parents
* Upload notes
* Assign homework
* Conduct tests

Only one Class Teacher should be assigned to a class.

---

### Subject Teacher

A Subject Teacher teaches one or more subjects across multiple classes.

Example:

Physics Teacher

Assigned Classes:

* Grade 10 A
* Grade 10 B
* Grade 10 C

Subject Teachers should not have attendance permissions unless explicitly configured by the institution.

The Admin should assign:

* Subject
* Classes
* Permissions

---

# Class Management

The Admin should manage all classes within the assigned section.

Display:

* Grade
* Section
* Number of Students
* Class Teacher
* Subject Teachers
* Academic Year

The Admin should be able to:

* Create Classes
* Edit Classes
* Merge Classes
* Archive Classes
* Assign Class Teachers
* Assign Subject Teachers

---

# Student Management

The Admin should have complete visibility into students within the assigned section.

Display:

* Student Name
* Roll Number
* Class
* Attendance
* Homework Status
* Assignment Status
* Academic Progress
* Learning Analytics
* Parent Information
* Account Status

The Admin should be able to:

* Register Students
* Edit Student Information
* Transfer Students
* Deactivate Accounts
* Search Students
* Filter Students

---

# Teacher Monitoring

The Admin should monitor teacher performance.

Display:

* Classes Conducted
* Attendance Records
* Homework Assigned
* Assignments Created
* Tests Conducted
* Student Performance
* Student Feedback (optional)
* AI Teaching Insights

Provide performance graphs and monthly summaries.

---

# Student Monitoring

The Admin should monitor overall student performance.

Display:

* Attendance Trends
* Homework Completion
* Assignment Completion
* Test Performance
* Learning Progress
* Risk Indicators
* AI Learning Analytics

The Admin should quickly identify students requiring additional support.

---

# Timetable Management

The Admin should create and manage:

* Institution Timetable
* Class Timetables
* Teacher Timetables
* Subject Allocations

Support:

* Room Allocation
* Teacher Assignment
* Period Changes
* Timetable Updates
* Temporary Substitutions

Changes should automatically notify the relevant teachers and students.

---

# Academic Calendar

Provide a complete academic calendar.

Include:

* Holidays
* Examination Dates
* Parent Meetings
* Workshops
* Competitions
* School Events
* Academic Deadlines
* Semester Dates

The calendar should be editable by the Admin.

---

# Notice Management

The Admin is responsible for publishing official notices.

Categories:

* General Notices
* Academic Notices
* Examination Notices
* Holiday Notices
* Parent Notices
* Emergency Notices
* Teacher Notices
* Student Notices

Each notice should support:

* Priority
* Attachments
* Scheduling
* Target Audience
* Expiry Date

---

# Reports Center

Reporting is one of the Admin's primary responsibilities.

The Admin should generate reports for:

### Student Reports

* Attendance
* Academic Performance
* Homework
* Assignments
* Learning Progress

### Teacher Reports

* Attendance
* Teaching Activity
* Classes Conducted
* Homework
* Assignments
* Student Results

### Institution Reports

* Overall Attendance
* Academic Performance
* Department Performance
* Class Performance
* Examination Analysis

Every report should support:

* PDF Export
* Excel Export
* Printing
* Date Filters
* Class Filters
* Teacher Filters

---

# AI Mentor for Admin

The Admin AI Mentor acts as an institutional management assistant.

It should not function as a teaching assistant.

Capabilities include:

### Institution Analytics

* Summarize academic performance
* Identify weak-performing classes
* Detect attendance issues
* Generate institutional insights

### Teacher Management

* Recommend teacher assignments
* Highlight teacher workload
* Identify scheduling conflicts

### Student Insights

* Identify at-risk students
* Summarize attendance trends
* Highlight academic improvements
* Recommend interventions

### Report Generation

* Generate summaries
* Prepare institutional reports
* Create meeting reports
* Generate academic statistics

### Communication Assistance

* Draft notices
* Prepare circulars
* Generate announcements
* Create parent communications

The AI should understand only the Admin's assigned institution or department and provide context-aware recommendations.

---

# Communication Center

The Admin should communicate with:

* Teachers
* Students
* Parents

Support:

* Broadcast Messages
* Announcements
* Circulars
* Notifications
* Scheduled Messages

---

# Resource Monitoring

The Admin should monitor institutional resources.

View:

* Uploaded Notes
* Uploaded PDFs
* Teacher Resources
* Student Resources
* Learning Materials

The Admin may approve or remove inappropriate resources if required.

---

# Activity Logs

Maintain complete activity history.

Examples:

* Teacher Created
* Student Registered
* Timetable Updated
* Notice Published
* Class Assigned
* Report Generated

Provide:

* Search
* Filters
* Date Range

---

# Profile & Settings

Display:

* Admin Profile
* Institution Name
* Department
* Assigned Section
* Contact Information
* Notification Settings
* Language
* Theme
* Security Settings

---

# UI & UX Principles

The Admin Panel should feel calm, professional, and data-driven.

Follow the same design language established in the Student and Teacher Panels.

Design Goals:

* Clean interface
* Minimal visual clutter
* Large, readable typography
* Consistent navigation
* Simple terminology
* Dashboard-first approach
* Responsive layouts
* Fast workflows
* Smooth animations
* Reusable components

Avoid unnecessary complexity or excessive nested menus.

The Admin should be able to complete common administrative tasks in as few clicks as possible while maintaining full visibility into the academic operations of their assigned section.

---

# Important Notes

* The Master Admin module is **not** part of this prototype.
* Assume all Admin accounts are already created by the Master Admin.
* Every Admin only manages the teachers, students, and classes assigned to their own section or department.
* Maintain the same overall design system, branding, spacing, typography, color palette, and interaction patterns used throughout the Student and Teacher Panels.
* The final Admin Panel should act as the academic control center of the institution, focusing entirely on monitoring, management, reporting, communication, and educational oversight—not accounting, finance, or other non-academic operations.
