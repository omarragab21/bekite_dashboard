import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import AppLayout from '../components/AppLayout.vue';

const routes = [
  // Redirect root to admin dashboard or login
  {
    path: '/',
    redirect: '/admin/dashboard',
  },

  // Admin Login
  {
    path: '/admin/login',
    name: 'Login',
    component: LoginView,
  },

  // Public Contact Us Page
  {
    path: '/contact',
    name: 'ContactUs',
    component: () => import('../views/website/ContactView.vue'),
  },

  // Admin Dashboard CMS Routes
  {
    path: '/admin',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard',
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/DashboardView.vue'),
      },
      // Portfolio & Projects
      {
        path: 'projects',
        name: 'Projects',
        component: () => import('../views/ProjectsView.vue'),
      },
      {
        path: 'project-categories',
        name: 'ProjectCategories',
        component: () => import('../views/ProjectCategoriesView.vue'),
      },

      // Digital Products & Platforms
      {
        path: 'products',
        name: 'Products',
        component: () => import('../views/ProductsView.vue'),
      },
      {
        path: 'categories',
        name: 'ProductCategoriesList',
        component: () => import('../views/CategoriesView.vue'),
      },

      // Digital Solutions & Services
      {
        path: 'solutions',
        name: 'Solutions',
        component: () => import('../views/ServicesView.vue'),
      },
      {
        path: 'services',
        name: 'Services',
        component: () => import('../views/ServicesView.vue'),
      },

      // Venture Brands & Investments
      {
        path: 'brands',
        name: 'Brands',
        component: () => import('../views/BrandsView.vue'),
      },

      // Strategic Technology Partners
      {
        path: 'partners',
        name: 'Partners',
        component: () => import('../views/PartnersView.vue'),
      },

      // CRM Inquiries & Leads
      {
        path: 'service-requests',
        name: 'ServiceRequests',
        component: () => import('../views/ServiceRequestsView.vue'),
      },
      {
        path: 'inquiries',
        redirect: '/admin/service-requests',
      },
      {
        path: 'messages',
        name: 'Messages',
        component: () => import('../views/MessagesView.vue'),
      },

      // Content & CMS
      {
        path: 'news-events',
        name: 'NewsEvents',
        component: () => import('../views/NewsEventsView.vue'),
      },
      {
        path: 'careers',
        name: 'Careers',
        component: () => import('../views/KnowledgeGuidesView.vue'),
      },
      {
        path: 'knowledge-guides',
        redirect: '/admin/careers',
      },
      {
        path: 'team-members',
        name: 'TeamMembers',
        component: () => import('../views/TeamMembersView.vue'),
      },
      {
        path: 'dynamic-pages',
        name: 'DynamicPages',
        component: () => import('../views/DynamicPagesView.vue'),
      },
      {
        path: 'legal',
        redirect: '/admin/dynamic-pages',
      },

      // System & Settings
      {
        path: 'about-us',
        name: 'AboutUs',
        component: () => import('../views/AboutUsView.vue'),
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/SettingsView.vue'),
      },
      {
        path: 'admins',
        name: 'Admins',
        component: () => import('../views/AdminsView.vue'),
      },
      {
        path: 'activity-log',
        name: 'ActivityLog',
        component: () => import('../views/ActivityLogsView.vue'),
      },
      {
        path: 'profile',
        name: 'AdminProfile',
        component: () => import('../views/AdminProfileView.vue'),
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: () => import('../views/NotificationsView.vue'),
      },
    ],
  },

  // Catch-all
  {
    path: '/:pathMatch(.*)*',
    redirect: '/admin/dashboard',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  },
});

// Auth Guard: Hardened session validation
router.beforeEach((to, from, next) => {
  const rawToken = localStorage.getItem('token');
  const hasValidToken = Boolean(
    rawToken &&
    rawToken !== 'null' &&
    rawToken !== 'undefined' &&
    rawToken.trim() !== ''
  );
  const isAdminPath = to.path.startsWith('/admin');

  if (isAdminPath && !hasValidToken && to.name !== 'Login') {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    localStorage.removeItem('user');
    next('/admin/login');
  } else if (to.name === 'Login' && hasValidToken) {
    next('/admin/dashboard');
  } else {
    next();
  }
});

export default router;
