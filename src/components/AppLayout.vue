<template>
  <div class="app-layout" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
    <!-- ===== SIDEBAR ===== -->
    <aside class="sidebar" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- Logo -->
      <div class="sidebar-logo">
        <div class="logo-icon">
          <img
            :src="isDark ? '/brand/bekite-logo-horizontal-reversed.svg' : '/brand/bekite-logo-horizontal.svg'"
            alt="Be Kite"
            class="logo-img"
            @error="$event.target.src = '/bekite_kite_logo.svg'"
          />
        </div>
      </div>

      <!-- Nav -->
      <nav class="sidebar-nav">
        <template v-for="item in menuItems" :key="item.route || item.label">
          <!-- Single Link -->
          <router-link
            v-if="!item.children"
            :to="item.route"
            class="nav-item"
            :class="{ active: route.path === item.route || (item.route !== '/admin/dashboard' && route.path.startsWith(item.route + '/')) }"
          >
            <span class="nav-icon" v-html="item.icon"></span>
            <span class="nav-label" v-show="!sidebarCollapsed">{{ item.label }}</span>
            <span v-if="item.badge && !sidebarCollapsed" class="nav-badge">{{ item.badge }}</span>
          </router-link>

          <!-- Dropdown Group -->
          <div v-else class="nav-group" :class="{ expanded: isGroupExpanded(item), active: isGroupActive(item) }">
            <button class="nav-group-header" @click="toggleGroup(item.label)">
              <span class="nav-icon" v-html="item.icon"></span>
              <span class="nav-label" v-show="!sidebarCollapsed">{{ item.label }}</span>
              <svg
                v-show="!sidebarCollapsed"
                class="nav-chevron"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div v-show="isGroupExpanded(item) && !sidebarCollapsed" class="nav-group-children">
              <router-link
                v-for="child in item.children"
                :key="child.route"
                :to="child.route"
                class="nav-sub-item"
                :class="{ active: route.path === child.route || route.path.startsWith(child.route + '/') }"
              >
                <span class="nav-label">{{ child.label }}</span>
              </router-link>
            </div>
          </div>
        </template>
      </nav>
    </aside>

    <!-- ===== MAIN AREA ===== -->
    <div class="main-area">
      <!-- Topbar -->
      <header class="topbar">
        <!-- Left: Breadcrumb -->
        <div class="topbar-left">
          <nav class="breadcrumb">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
            <span class="breadcrumb-item home">{{ currentRouteName }}</span>
          </nav>
        </div>

        <!-- Right: Notifications & User -->
        <div class="topbar-right">
          <!-- Notification -->
          <div class="notification-wrapper" ref="notifWrapper">
            <button class="notification-btn" @click.stop="toggleNotifications" title="الإشعارات">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
            </button>

            <!-- Notification Dropdown -->
            <div v-if="notifOpen" class="notif-dropdown" @click.stop>
              <div class="notif-header">
                <span class="notif-title">الإشعارات والتنبيهات</span>
                <button v-if="unreadCount > 0" class="notif-mark-all" @click="markAllAsRead">تحديد الكل كمقروء</button>
              </div>
              <div class="notif-list">
                <div v-if="notifications.length === 0" class="notif-empty">لا توجد إشعارات جديدة</div>
                <div
                  v-for="notif in notifications.slice(0, 8)"
                  :key="notif.id"
                  class="notif-item"
                  :class="{ unread: !notif.is_read }"
                  @click="handleNotifClick(notif)"
                >
                  <div class="notif-icon" :class="notif.type || 'order'">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                  </div>
                  <div class="notif-content">
                    <span class="notif-item-title">{{ notif.title }}</span>
                    <span class="notif-item-msg">{{ notif.message }}</span>
                    <span class="notif-item-time">{{ formatNotifTime(notif.created_at) }}</span>
                  </div>
                </div>
              </div>
              <router-link to="/admin/notifications" class="notif-footer" @click="notifOpen = false">
                <span>عرض الكل</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </router-link>
            </div>
          </div>

          <!-- User Menu -->
          <div class="user-menu" @click="userMenuOpen = !userMenuOpen">
            <div class="user-avatar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span class="user-name">{{ adminName }}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>

            <!-- Dropdown -->
            <div v-if="userMenuOpen" class="user-dropdown" @click.stop>
              <div class="dropdown-header">
                <div class="user-info">
                  <span class="user-role">{{ adminName }}</span>
                  <span class="user-email">{{ adminEmail }}</span>
                  <span class="user-badge">{{ adminRole }}</span>
                </div>
                <div class="user-avatar-large">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
              </div>

              <div class="dropdown-divider"></div>

              <!-- Language -->
              <div class="dropdown-item split-item" @click="toggleLanguage">
                <span class="lang-text">{{ currentLang === 'ar' ? 'ع' : 'En' }}</span>
                <div class="lang-switch-container">
                  <span class="en-text">{{ currentLang === 'ar' ? 'English' : 'العربية' }}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M4 5h16M4 12h16M4 19h16"/>
                  </svg>
                </div>
              </div>

              <!-- Dark Mode -->
              <div class="dropdown-item split-item" @click="toggleTheme">
                <label class="toggle-switch" @click.stop>
                  <input type="checkbox" v-model="isDark" />
                  <span class="slider"></span>
                </label>
                <div class="theme-switch-container">
                  <span>الوضع الليلي</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                </div>
              </div>

              <div class="dropdown-divider"></div>

              <!-- Profile -->
              <router-link to="/admin/profile" class="dropdown-item" @click="userMenuOpen = false">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <span>الملف الشخصي</span>
              </router-link>

              <!-- Settings -->
              <router-link to="/admin/settings" class="dropdown-item" @click="userMenuOpen = false">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                <span>إعدادات المنصة</span>
              </router-link>

              <div class="dropdown-divider"></div>

              <!-- Logout -->
              <button @click="handleLogout" class="dropdown-item logout-item">
                <span>تسجيل الخروج</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="page-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import api from '../config/axios';
import { useTheme } from '../composables/useTheme';

const { isDark, toggleTheme } = useTheme();

const router = useRouter();
const route = useRoute();
const adminName = ref('عمر رجب');
const adminEmail = ref('admin@bekite.com');
const adminRole = ref('مدير النظام (سوبر)');
const sidebarCollapsed = ref(false);
const userMenuOpen = ref(false);
const inquiriesCount = ref(0);
const expandedGroup = ref('');

// Notifications
const notifOpen = ref(false);
const notifications = ref([]);
const unreadCount = ref(0);
const notifWrapper = ref(null);
let notifPollInterval = null;

const currentRouteName = computed(() => {
  const map = {
    '/admin/dashboard': 'الصفحة الرئيسية',
    '/admin/solutions': 'دليل الحلول والخدمات',
    '/admin/projects': 'المشاريع والأعمال السابقة',
    '/admin/project-categories': 'أقسام وتصنيفات المشاريع',
    '/admin/products': 'المنتجات والأنظمة الرقمية',
    '/admin/categories': 'أقسام المنتجات الرقمية',
    '/admin/services': 'دليل الحلول والخدمات',
    '/admin/brands': 'علاماتنا والشركات التابعة (Venture Brands)',
    '/admin/service-requests': 'طلبات واستفسارات العملاء (CRM Leads)',
    '/admin/careers': 'الوظائف والفرص المتاحة (Careers)',
    '/admin/knowledge-guides': 'الوظائف والفرص المتاحة (Careers)',
    '/admin/messages': 'رسائل التواصل',
    '/admin/team-members': 'فريق العمل والقيادة',
    '/admin/dynamic-pages': 'الصفحات والسياسات',
    '/admin/settings': 'إعدادات المنصة',
    '/admin/admins': 'مدراء النظام والصلاحيات',
    '/admin/activity-log': 'سجل النشاطات',
    '/admin/profile': 'الملف الشخصي',
    '/admin/notifications': 'الإشعارات',
  };
  return map[route.path] || 'لوحة التحكم';
});

const toggleNotifications = () => {
  notifOpen.value = !notifOpen.value;
  if (notifOpen.value) {
    fetchNotifications();
    fetchUnreadCount();
  }
};

const fetchNotifications = async () => {
  try {
    const res = await api.get('/dashboard/notifications?per_page=20');
    notifications.value = res.data.data || [];
  } catch (err) {
    console.error('Failed to fetch notifications', err);
  }
};

const fetchUnreadCount = async () => {
  try {
    const res = await api.get('/dashboard/notifications/unread-count');
    unreadCount.value = res.data.count || 0;
  } catch (err) {
    console.error('Failed to fetch unread count', err);
  }
};

const fetchInquiriesCount = async () => {
  try {
    const res = await api.get('/dashboard/service-requests');
    inquiriesCount.value = (res.data.data || []).filter(i => i.status === 'new').length;
  } catch (err) {
    console.error('Failed to fetch leads count', err);
  }
};

const markAllAsRead = async () => {
  try {
    await api.post('/dashboard/notifications/read-all');
    notifications.value.forEach(n => (n.is_read = true));
    unreadCount.value = 0;
  } catch (err) {
    console.error('Failed to mark all as read', err);
  }
};

const handleNotifClick = async (notif) => {
  if (!notif.is_read) {
    try {
      await api.post(`/dashboard/notifications/${notif.id}/read`);
      notif.is_read = true;
      unreadCount.value = Math.max(0, unreadCount.value - 1);
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  }
  notifOpen.value = false;
  if (notif.action_url && notif.action_url.startsWith('/admin/')) {
    router.push(notif.action_url);
  }
};

const formatNotifTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'الآن';
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  if (diffDays < 7) return `منذ ${diffDays} يوم`;
  return date.toLocaleDateString('ar-SA');
};

const closeNotifDropdown = (e) => {
  if (notifWrapper.value && !notifWrapper.value.contains(e.target)) {
    notifOpen.value = false;
  }
};

const isGroupActive = (item) => {
  if (!item.children) return false;
  return item.children.some(child =>
    route.path === child.route || route.path.startsWith(child.route + '/')
  );
};

const isGroupExpanded = (item) => {
  if (expandedGroup.value === item.label) return true;
  if (expandedGroup.value === '' && isGroupActive(item)) return true;
  return false;
};

const toggleGroup = (label) => {
  if (expandedGroup.value === label || (expandedGroup.value === '' && isGroupActive({ label, children: [{ route: route.path }] }))) {
    expandedGroup.value = '__closed__';
  } else {
    expandedGroup.value = label;
  }
};

const { locale } = useI18n();
const currentLang = computed(() => locale.value || 'ar');

const toggleLanguage = () => {
  const newLang = locale.value === 'ar' ? 'en' : 'ar';
  locale.value = newLang;
  localStorage.setItem('lang', newLang);
  document.documentElement.lang = newLang;
  document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
};

const closeUserMenu = (e) => {
  if (!e.target.closest('.user-menu')) userMenuOpen.value = false;
};

const handleLogout = async () => {
  try {
    await api.post('/logout');
  } catch (err) {
    console.error(err);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    router.push('/admin/login');
  }
};

// Sidebar Menu Items configured per exact specifications
const menuItems = computed(() => [
  {
    route: '/admin/dashboard',
    label: 'الصفحة الرئيسية',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  },
  {
    route: '/admin/solutions',
    label: 'حلول',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>`,
  },
  {
    label: 'مشاريع',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    children: [
      { route: '/admin/projects', label: 'المشاريع' },
      { route: '/admin/project-categories', label: 'أقسام المشاريع' },
    ],
  },
  {
    label: 'منتجات',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    children: [
      { route: '/admin/products', label: 'المنتجات' },
      { route: '/admin/categories', label: 'أقسام المنتجات' },
    ],
  },
  {
    route: '/admin/brands',
    label: 'علاماتنا',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
  },
  {
    route: '/admin/careers',
    label: 'الوظائف',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><circle cx="12" cy="12" r="1"/></svg>`,
  },
  {
    label: 'الرسائل والطلبات',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    badge: (unreadCount.value + inquiriesCount.value) > 0 ? `${unreadCount.value + inquiriesCount.value}` : null,
    children: [
      { route: '/admin/messages', label: 'رسائل التواصل' },
      { route: '/admin/service-requests', label: 'طلبات العملاء (CRM)' },
    ],
  },
]);

onMounted(() => {
  const adminInner = JSON.parse(localStorage.getItem('admin') || '{}');
  if (adminInner?.name) adminName.value = adminInner.name;
  if (adminInner?.email) adminEmail.value = adminInner.email;
  if (adminInner?.is_super_admin) adminRole.value = 'مدير النظام (سوبر)';
  else if (adminInner?.role) adminRole.value = adminInner.role;

  document.addEventListener('click', closeUserMenu);
  document.addEventListener('click', closeNotifDropdown);
  fetchInquiriesCount();
  fetchUnreadCount();

  notifPollInterval = setInterval(() => {
    fetchUnreadCount();
    fetchInquiriesCount();
  }, 30000);
});

onUnmounted(() => {
  document.removeEventListener('click', closeUserMenu);
  document.removeEventListener('click', closeNotifDropdown);
  if (notifPollInterval) clearInterval(notifPollInterval);
});
</script>

<style scoped>
/* ===== LAYOUT ===== */
.app-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg-main);
  direction: rtl;
}

[dir="ltr"] .app-layout {
  direction: ltr;
}

/* ===== SIDEBAR ===== */
.sidebar {
  width: 240px;
  background: var(--bg-sidebar);
  border-left: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: auto;
  transition: width 0.2s ease;
  flex-shrink: 0;
  z-index: 40;
}

[dir="ltr"] .sidebar {
  border-left: none;
  border-right: 1px solid var(--border-color);
}

.sidebar::-webkit-scrollbar { display: none; }
.sidebar-collapsed { width: 64px; }

/* Logo */
.sidebar-logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 170px;
  height: 38px;
}

.logo-img {
  max-height: 36px;
  width: auto;
  object-fit: contain;
}

/* Nav */
.sidebar-nav {
  padding: 0.75rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: var(--bg-main);
  color: var(--text-main);
}

.nav-item.active {
  background: rgba(79, 0, 140, 0.08);
  color: #4f008c;
  font-weight: 700;
}

.dark .nav-item.active {
  background: rgba(255, 199, 0, 0.12);
  color: #ffc700;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-badge {
  background: #ffc700;
  color: #150522;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.1rem 0.45rem;
  border-radius: 9999px;
  margin-inline-start: auto;
}

/* Nav Group */
.nav-group {
  display: flex;
  flex-direction: column;
}

.nav-group-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  background: none;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: right;
}

[dir="ltr"] .nav-group-header {
  text-align: left;
}

.nav-group-header:hover {
  background: var(--bg-main);
  color: var(--text-main);
}

.nav-group.active .nav-group-header {
  background: rgba(79, 0, 140, 0.08);
  color: #4f008c;
  font-weight: 700;
}

.dark .nav-group.active .nav-group-header {
  background: rgba(255, 199, 0, 0.12);
  color: #ffc700;
}

.nav-chevron {
  transition: transform 0.2s ease;
  flex-shrink: 0;
  margin-inline-start: auto;
}

.nav-group.expanded .nav-chevron {
  transform: rotate(180deg);
}

.nav-group-children {
  display: flex;
  flex-direction: column;
  padding-inline-start: 2.2rem;
  gap: 0.15rem;
}

.nav-sub-item {
  display: flex;
  align-items: center;
  padding: 0.45rem 0.75rem;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-sub-item:hover {
  background: var(--bg-main);
  color: var(--text-main);
}

.nav-sub-item.active {
  background: rgba(79, 0, 140, 0.08);
  color: #4f008c;
  font-weight: 700;
}

.dark .nav-sub-item.active {
  background: rgba(255, 199, 0, 0.12);
  color: #ffc700;
}

/* ===== MAIN AREA ===== */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* ===== TOPBAR ===== */
.topbar {
  height: 56px;
  background: var(--bg-topbar);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  position: sticky;
  top: 0;
  z-index: 50;
  flex-shrink: 0;
}

.topbar-right {
  display: flex;
  align-items: center;
}

.topbar-left {
  display: flex;
  align-items: center;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: var(--text-muted);
}

.breadcrumb-item {
  color: var(--text-main);
  font-weight: 600;
}

.breadcrumb svg {
  color: var(--text-muted);
  transform: rotate(180deg);
}
[dir="ltr"] .breadcrumb svg {
  transform: none;
}

/* Notification */
.notification-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  transition: all 0.2s;
  margin-inline-end: 0.5rem;
}

.notification-btn:hover {
  background: var(--bg-main);
  color: var(--text-main);
}

.notification-badge {
  position: absolute;
  top: 4px;
  right: 6px;
  min-width: 18px;
  height: 18px;
  background: #dc2626;
  color: #fff;
  border-radius: 50%;
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--bg-topbar);
  padding: 0 3px;
}

.notification-wrapper { position: relative; }

.notif-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  width: 340px;
  max-height: 450px;
  z-index: 100;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
[dir="ltr"] .notif-dropdown {
  left: auto;
  right: 0;
}

.notif-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

.notif-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-main);
}

.notif-mark-all {
  background: none;
  border: none;
  color: #4f008c;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
}
.dark .notif-mark-all { color: #ffc700; }

.notif-list {
  overflow-y: auto;
  max-height: 320px;
}

.notif-empty {
  padding: 2rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.8rem;
}

.notif-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background 0.15s;
}
.notif-item:hover { background: var(--bg-main); }
.notif-item.unread { background: rgba(79, 0, 140, 0.05); }

.notif-icon {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(79, 0, 140, 0.12);
  color: #4f008c;
}
.dark .notif-icon {
  background: rgba(255, 199, 0, 0.15);
  color: #ffc700;
}

.notif-content {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
  min-width: 0;
}

.notif-item-title {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-main);
}

.notif-item-msg {
  font-size: 0.72rem;
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notif-item-time {
  font-size: 0.65rem;
  color: var(--text-muted);
}

.notif-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.65rem;
  border-top: 1px solid var(--border-color);
  color: #4f008c;
  font-size: 0.78rem;
  font-weight: 700;
  text-decoration: none;
}
.dark .notif-footer { color: #ffc700; }
.notif-footer:hover { background: var(--bg-main); }

/* User Menu */
.user-menu {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  position: relative;
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  transition: background 0.2s;
}
.user-menu:hover { background: var(--bg-main); }

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(79, 0, 140, 0.1);
  color: #4f008c;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.dark .user-avatar {
  background: rgba(255, 199, 0, 0.15);
  color: #ffc700;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-main);
}

.user-menu > svg { color: var(--text-muted); }

/* Dropdown */
.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  min-width: 240px;
  z-index: 100;
  padding: 0.5rem;
  cursor: default;
}
[dir="ltr"] .user-dropdown {
  left: auto;
  right: 0;
}

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  text-align: right;
}
[dir="ltr"] .user-info { text-align: left; }

.user-role {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-main);
}

.user-email {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.user-badge {
  font-size: 0.65rem;
  color: #4f008c;
  font-weight: 700;
  margin-top: 0.1rem;
}
.dark .user-badge { color: #ffc700; }

.user-avatar-large {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(79, 0, 140, 0.1);
  color: #4f008c;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.dark .user-avatar-large {
  background: rgba(255, 199, 0, 0.15);
  color: #ffc700;
}

.dropdown-divider {
  height: 1px;
  background: var(--border-color);
  margin: 0.25rem 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.65rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  text-decoration: none;
}
.dropdown-item:hover {
  background: var(--bg-main);
  color: var(--text-main);
}

.split-item {
  justify-content: space-between;
}

.lang-text {
  color: var(--text-muted);
  font-weight: 600;
}

.lang-switch-container, .theme-switch-container {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--text-main);
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 18px;
}
.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: var(--border-color);
  transition: .3s;
  border-radius: 34px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #4f008c;
}
.dark input:checked + .slider {
  background-color: #ffc700;
}
input:checked + .slider:before {
  transform: translateX(14px);
}

.logout-item { color: #dc2626; }
.logout-item:hover { background: #fef2f2; color: #dc2626; }

/* ===== PAGE CONTENT ===== */
.page-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}
</style>
