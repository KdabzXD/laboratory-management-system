# Laboratory Management System

![Dashboard Screenshot](screenshots/dashboard-overview.png)

A full-stack laboratory operations platform for managing scientists, equipment, materials, suppliers, purchases, activity logs, and report queries.

## What This Project Includes

- SQL Server schema and data scripts
- Express + Node.js backend API with role-based access control
- React + TypeScript frontend dashboard and management pages
- Activity logging with fallback feed for operational events
- Query/report execution with export-ready UI

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Motion, Recharts
- Backend: Node.js, Express, mssql (msnodesqlv8), dotenv
- Database: Microsoft SQL Server

## Repository Structure

- allthesqlscripts: database creation, seed, roles/auth, reports, dashboard queries
- Backend_Programs: API server, controllers, middleware, routes, DB connection
- Frontend_Programs: UI app, pages, components, API client, styles
- screenshots: documentation images

## Core Features

### Dashboard

- Live KPI cards for scientists, equipment, suppliers, purchases, and material cost
- Equipment-by-department visualization
- Material cost by supplier visualization
- Recent activity stream
- Latest equipment assignments and material requests

### Scientists

- Load scientists from database
- Add scientist
- Update scientist
- Delete scientist
- Metadata-driven mapping for department/specialization/gender IDs

### Equipment

- Load equipment inventory from database
- Add equipment
- Update equipment
- Delete equipment
- Load assignments from database
- Add assignment
- Update assignment
- Delete assignment

### Materials

- Load materials inventory from database
- Add material
- Update material
- Delete material
- Load material requests from database
- Add material request
- Update material request
- Delete material request

### Suppliers

- Load suppliers
- Add supplier
- Update supplier
- Delete supplier

### Purchases

- Load purchases
- Add purchase
- Update purchase
- Delete purchase
- Toggle purchase status

### Queries & Reports

- Load predefined query catalog from backend
- Execute query by ID
- Display tabular results
- Export to PDF and CSV

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
