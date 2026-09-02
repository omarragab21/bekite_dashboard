# 🚀 Bekite Dashboard (`bekite_dashboard`)

An enterprise-grade, modern Admin Management Dashboard & CMS built with **Vue 3**, **Vite**, and **Tailwind CSS**. Designed for managing digital ventures, products, services, portfolio projects, CRM leads, and multi-channel content.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Development Server](#development-server)
  - [Production Build](#production-build)
- [Modules & Routing](#-modules--routing)
- [API Configuration](#-api-configuration)
- [License](#-license)

---

## 🌟 Overview

**Bekite Dashboard** provides a centralized control panel for managing business operations, client inquiries, digital portfolio assets, marketing content, and team administration with an intuitive, responsive, and multilingual interface.

---

## ✨ Key Features

- 📊 **Executive Dashboard**: Real-time KPI summaries, interactive charts (Chart.js), and recent activity feeds.
- 📁 **Portfolio & Projects**: Showcase client work, project categories, case studies, and media galleries.
- 🛍️ **Digital Products & Platforms**: Manage software solutions, product catalogs, categories, and feature tiers.
- 💡 **Digital Solutions & Services**: Service offerings, capability matrix, and solutions showcase.
- 🏢 **Venture Brands & Investments**: Management of venture portfolio entities and brand profiles.
- 📬 **CRM & Lead Inquiries**: Centralized inbox for service requests, quotes, inquiries, and customer communication.
- 📰 **Content & CMS Suite**:
  - News, press releases, and company events
  - Careers & knowledge guides
  - Team members directory & biographies
  - Dynamic & legal pages editor
- 🔐 **Access Control & System Admin**:
  - Admin accounts & role management
  - Audit & activity logging
  - Profile customization & security settings
  - Real-time notification center
- 🌐 **Internationalization (i18n)**: Seamless multi-language support powered by `vue-i18n`.
- 🎨 **Responsive & Modern UI**: Tailored layouts built on Tailwind CSS with dark/light adaptability and mobile responsiveness.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **[Vue 3](https://vuejs.org/)** | Progressive JavaScript Framework (Composition API & `<script setup>`) |
| **[Vite](https://vitejs.dev/)** | Next-generation frontend tooling and fast HMR bundler |
| **[Vue Router 4](https://router.vuejs.org/)** | Official routing with authentication guards |
| **[Vue I18n 9](https://vue-i18n.intlify.dev/)** | Internationalization & multi-language engine |
| **[Tailwind CSS](https://tailwindcss.com/)** | Utility-first modern styling framework |
| **[Axios](https://axios-http.com/)** | Promise-based HTTP client with request/response interceptors |
| **[Chart.js](https://www.chartjs.org/)** | Data visualization and analytics charting |

---

## 📂 Project Structure

```text
bekite_dashboard/
├── public/                # Static assets, logos, brand files
├── src/
│   ├── assets/            # Global styles, fonts, images
│   ├── components/        # Reusable UI components & layouts
│   ├── composables/       # Vue 3 composables (state & hooks)
│   ├── config/            # Axios and app configurations
│   ├── core/              # Core domain interfaces & utilities
│   ├── domain/            # Domain models and business logic
│   ├── i18n/              # Translation dictionaries & localization
│   ├── infrastructure/    # API adapters and repository implementations
│   ├── mock/              # Mock data providers
│   ├── router/            # Vue Router definitions & auth guards
│   ├── services/          # Backend API services
│   ├── store/             # Global application state management
│   ├── views/             # Page views & admin modules
│   ├── App.vue            # Root Vue component
│   └── main.js            # App bootstrapping entry point
├── .env.example           # Example environment configuration
├── index.html             # Single Page Application HTML shell
├── package.json           # Project dependencies & scripts
├── tailwind.config.js     # Tailwind CSS configuration
└── vite.config.js         # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher (or `pnpm` / `yarn`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/omarragab21/bekite_dashboard.git
   cd bekite_dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

Configure your backend API base endpoint:
```env
VITE_API_BASE_URL=https://your-backend-api.com/api
```

### Development Server

Run the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173` (or the port indicated in your terminal).

### Production Build

To compile and minify the application for production:

```bash
npm run build
```

To preview the built production bundle locally:

```bash
npm run preview
```

---

## 🧭 Modules & Routing

| Path | Module | Description |
| :--- | :--- | :--- |
| `/admin/login` | **Authentication** | Secure admin login & authentication |
| `/admin/dashboard` | **Dashboard** | Overview metrics, KPI cards, and charts |
| `/admin/projects` | **Portfolio** | Project showcases and case studies |
| `/admin/project-categories` | **Categories** | Portfolio categorization |
| `/admin/products` | **Products** | Digital products & platform tiers |
| `/admin/services` | **Services** | Solutions and service offerings |
| `/admin/brands` | **Venture Brands** | Investment portfolio & brand entities |
| `/admin/service-requests` | **CRM Inquiries** | Client leads and service requests |
| `/admin/messages` | **Inbox** | Contact messages and communications |
| `/admin/news-events` | **News & Events** | Company announcements and articles |
| `/admin/careers` | **Careers** | Job opportunities and guides |
| `/admin/team-members` | **Team** | Team profiles and executive directory |
| `/admin/dynamic-pages` | **Pages** | Dynamic CMS & legal page management |
| `/admin/admins` | **Admin Management**| User access and administrative credentials |
| `/admin/activity-log` | **Audit Trail** | System activity and change logs |
| `/admin/settings` | **System Settings**| General portal configuration |

---

## 🔗 API Configuration

Network communication is orchestrated via a centralized Axios instance in [src/config/axios.js](file:///Users/omarragab/pfca_frontend_of_omar_syira/src/config/axios.js):
- Bearer Token injection from `localStorage`
- Automatic redirection on `401 Unauthorized` responses
- Environment-driven base URLs (`VITE_API_BASE_URL`)

---

## 📄 License

This project is proprietary and confidential. All rights reserved.
