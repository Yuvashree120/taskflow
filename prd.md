# 📄 Product Requirements Document (PRD)
## 🧩 Project: Taskflow – Project Management App (MERN)

---

## 1. 📌 Overview
Taskflow is a web-based project management application built using the MERN stack (MongoDB, Express, React, Node.js). It helps teams manage projects, tasks, and collaboration in a centralized platform.

---

## 2. 🎯 Objectives
- Provide an easy way to manage projects and tasks
- Enable team collaboration
- Track task progress and deadlines
- Improve productivity and organization

---

## 3. 👥 Target Users
- Students (mini/major projects)
- Small teams
- Freelancers
- Startup teams

---

## 4. 🧱 Features & Modules

### 4.1 🔐 Authentication Module
- User Signup
- User Login
- JWT-based authentication
- Password encryption

---

### 4.2 👤 User Management
- View user profile
- Update profile details
- Assign users to projects

---

### 4.3 📁 Project Management
- Create project
- Edit project
- Delete project
- View project list

**Fields:**
- Project Name
- Description
- Start Date
- End Date
- Status (Active / Completed)

---

### 4.4 ✅ Task Management
- Create task under a project
- Assign task to users
- Update task status

**Fields:**
- Task Title
- Description
- Assigned User
- Deadline
- Status (To Do / In Progress / Done)

---

### 4.5 📊 Dashboard
- Overview of:
  - Total projects
  - Completed tasks
  - Pending tasks

---

### 4.6 💬 Comments & Activity
- Add comments to tasks
- Track activity history

---

### 4.7 🔍 Search & Filter
- Search projects/tasks
- Filter by:
  - Status
  - User
  - Date

---

### 4.8 🔔 Notifications (Optional)
- Task assignment alerts
- Deadline reminders

---

### 4.9 📂 File Upload (Optional)
- Upload files to tasks/projects

---

## 5. 🖥️ UI Pages

- Login Page
- Signup Page
- Dashboard
- Projects Page
- Project Details Page
- Task Board Page
- Team Page
- Profile Page

---

## 6. ⚙️ Technical Stack

### Frontend
- React.js
- React Router
- Tailwind CSS / Bootstrap
- Axios

### Backend
- Node.js
- Express.js
- JWT Authentication

### Database
- MongoDB

---

## 7. 🗂️ Database Schema

### Users
- name
- email
- password
- role

### Projects
- title
- description
- createdBy
- teamMembers[]
- startDate
- endDate
- status

### Tasks
- title
- description
- projectId
- assignedTo
- deadline
- status

---

## 8. 🔄 User Flow

1. User signs up / logs in  
2. User accesses dashboard  
3. User creates a project  
4. User adds tasks to project  
5. User assigns tasks to team members  
6. User tracks progress  

---

## 9. 🚀 Future Enhancements
- Real-time updates (Socket.io)
- Drag-and-drop task board (Kanban)
- Role-based access control
- Dark mode
- Mobile responsive UI

---

## 10. 📊 Success Metrics
- Number of active users
- Tasks completed per user
- User engagement (daily usage)

---

## 11. ⚠️ Constraints
- Internet required
- Basic authentication security
- Limited scalability (initial version)

---

## 12. 📅 Timeline (Suggested)

| Phase | Duration |
|------|--------|
| Planning | 2 days |
| Frontend Setup | 5 days |
| Backend Setup | 5 days |
| Integration | 4 days |
| Testing | 3 days |

---

## ✅ Conclusion
Taskflow aims to simplify project and task management using a clean UI and efficient backend, making it ideal for students and small teams.