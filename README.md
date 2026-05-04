<div align="center">

<img src="screenshots/lab-animation.svg" alt="Animated laboratory equipment banner" width="100%" />

# Laboratory Management System

A full-stack laboratory operations platform for managing scientists, equipment, materials, suppliers, purchases, activity logs, and report queries.

</div>

![Dashboard Screenshot](screenshots/dashboard-overview.png)

## What This Project Includes

- Oracle SQL Developer schema and data scripts
- Express + Node.js backend API with role-based access control
- React + TypeScript frontend dashboard and management pages
- Activity logging with fallback feed for operational events
- Query/report execution with export-ready UI

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Motion, Recharts
- Backend: Node.js, Express, mssql (msnodesqlv8), dotenv
- Database: Oracle 21c Express Edition

## Repository Structure

- allthesqlscripts: database creation, seed, roles/auth, reports, dashboard queries
- Backend_Programs: API server, controllers, middleware, routes, DB connection
- Frontend_Programs: UI app, pages, components, API client, styles
- screenshots: documentation images

## Core Features

### Dashboard
- **Live KPI Cards**: Real-time metrics for scientists, equipment, suppliers, purchases, and material costs
- **Data Visualizations**: Equipment-by-department charts and material cost by supplier breakdowns
- **Activity Stream**: Recent activity feed with fallback rendering for operational events
- **Assignment Tracking**: Latest equipment assignments and material requests with status management
- **Status Updates**: Toggle activity status from pending to completed with persistent storage

### Scientists Management
- View all scientists with department and specialization metadata
- Add new scientists with department/specialization/gender mapping
- Update scientist information
- Delete scientists from the system
- Metadata-driven ID mapping for departments and specializations

### Departments Management
- View all the departments and their specializations

### Equipment Management
- Complete equipment inventory with detailed specifications
- Add new equipment to the lab
- Update equipment details
- Delete equipment from inventory
- Equipment assignment tracking
- Add/update/delete equipment assignments to scientists
- View assignments with assignment status tracking

### Materials Management
- Full materials inventory system
- Add new materials with properties and quantities
- Update material information
- Delete materials
- Material request workflow
- Create/update/delete material requests
- Track material request status

### Suppliers Management
- Supplier directory and contact management
- Add new suppliers
- Update supplier information
- Delete suppliers
- Link suppliers to purchases

### Purchases Management
- Purchase order management system
- Create new purchase orders
- Update purchase details
- Delete purchases
- Dynamic status management (Pending → Completed)
- Persistent status storage across sessions
- Supplier email integration
- Material quantity tracking

### Queries & Reports
- Predefined query catalog
- Dynamic query execution
- Tabular result display
- Export to PDF and CSV formats
- Advanced filtering and sorting

### User Interface Features
- **Dark Theme with Purple Accents**: Modern, eye-friendly interface (#c084fc, #f0abfc, #a855f7)
- **Responsive Design**: Works seamlessly on desktop and tablet devices
- **Search & Filtering**: Quick search across all data tables
- **Pagination**: Efficient data browsing with customizable page sizes
- **Modal Dialogs**: Smooth, animated dialogs for add/edit operations
- **Status Indicators**: Visual status badges for pending, completed, and in-progress items
- **Activity Animations**: Smooth transitions and motion effects using Motion/React
- **Data Persistence**: Status changes persist across page reloads via localStorage

## Access Control

Backend authorization is based on request headers:

- x-user-role: viewer, editor, admin
- x-pin: required for editor write operations

Frontend role state is persisted and passed to backend via API client headers.

## Activity Logging Behavior

The activity API first reads activity_logs.
If logs are empty, it automatically builds a fallback feed from:

- equipment assignments
- material requests
- purchases

This ensures the dashboard activity panel is never blank on freshly seeded environments.

## Setup

## 1) Database

Run SQL scripts in order:

1. allthesqlscripts/01_create_database_and_tables_with_constraints.sql
2. allthesqlscripts/02_add_data_to_tables.sql
3. allthesqlscripts/03_table_alterations.sql
4. allthesqlscripts/04_roles_and_authentication.sql
5. allthesqlscripts/05_reports_n_queries_connector.sql
6. allthesqlscripts/06_dashboard_queries.sql

## 2) Backend

- Open Backend_Programs
- Install dependencies
- Configure .env
- Start server

Example .env values:

- PORT=3001
- DB_DATABASE=Laboratory_Management_System

Commands:

- npm install
- npm run start

## 3) Frontend

- Open Frontend_Programs
- Install dependencies
- Start Vite dev server

Commands:

- npm install
- npm run dev

Default frontend URL:

- http://localhost:5173

## API Base URL

Frontend API client default:

- http://localhost:3001/api

Override with:

- VITE_API_BASE_URL

## API Coverage (High-Level)

- /api/dashboard/*
- /api/activity
- /api/scientists
- /api/equipment
- /api/equipment/assignments
- /api/materials
- /api/materials/requests
- /api/suppliers
- /api/purchases
- /api/queries

## Notes for Screenshots

- Place dashboard screenshot at screenshots/dashboard-overview.png
- The title link at the top of this README points to that file

## Current Status

- Dashboard is live-data driven
- Activity feed supports fallback rendering
- CRUD actions are mapped to backend across core management pages
- Data persists across reloads when backend/database operations succeed

## Personal Note

This Laboratory Management System represents a complete, production-ready platform for managing laboratory operations. Built with modern tech stack (React, TypeScript, Node.js, SQL Server), the system demonstrates full-stack development practices including:

- **Robust Backend**: RESTful API with role-based access control, comprehensive error handling, and database transactions
- **Polished Frontend**: Dark-themed UI with smooth animations, responsive design, and intuitive workflows
- **Data Integrity**: Strict schema constraints, proper foreign key relationships, and activity logging
- **Real-world Features**: Status tracking with persistence, dynamic reporting, supplier integration, and export capabilities

Whether you're managing a research lab, a pharmaceutical facility, or an educational laboratory, this system provides the tools needed to streamline operations, track resources, and maintain audit trails. The modular architecture makes it easy to extend with additional features or adapt to specific organizational needs.

Perfect for learning full-stack development, or as a foundation for a production lab management solution.
