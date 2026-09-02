<template>
  <div class="notifications-page">
    <div class="page-header">
      <div class="header-titles">
        <h2 class="page-title">الإشعارات</h2>
        <p class="page-subtitle">إدارة جميع الإشعارات الواردة</p>
      </div>
      <div class="header-actions">
        <button v-if="unreadCount > 0" class="btn-primary" @click="markAllAsRead">
          تحديد الكل كمقروء
        </button>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="filter-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="tab-btn"
        :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
        <span v-if="tab.value === 'unread' && unreadCount > 0" class="tab-badge">{{ unreadCount }}</span>
      </button>
    </div>

    <!-- Notifications List -->
    <div class="notif-list">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <span>جاري التحميل...</span>
      </div>

      <div v-else-if="filteredNotifications.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <p>{{ emptyMessage }}</p>
      </div>

      <div
        v-else
        v-for="notif in filteredNotifications"
        :key="notif.id"
        class="notif-card"
        :class="{ unread: !notif.is_read }"
      >
        <div class="notif-card-icon" :class="notif.type">
          <svg v-if="notif.type === 'order'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
          <svg v-else-if="notif.type === 'return'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
          <svg v-else-if="notif.type === 'message'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <svg v-else-if="notif.type === 'review'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <svg v-else-if="notif.type === 'wallet'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/><path d="M16 11h.01"/><path d="M1 10h22"/></svg>
          <svg v-else-if="notif.type === 'security'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </div>

        <div class="notif-card-content" @click="handleNotifClick(notif)">
          <div class="notif-card-header">
            <h4 class="notif-card-title">{{ notif.title }}</h4>
            <span class="notif-card-time">{{ formatDate(notif.created_at) }}</span>
          </div>
          <p class="notif-card-message">{{ notif.message }}</p>
        </div>

        <div class="notif-card-actions">
          <button
            v-if="!notif.is_read"
            class="action-btn read-btn"
            @click.stop="markAsRead(notif)"
            title="تحديد كمقروء"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
          <button
            class="action-btn delete-btn"
            @click.stop="deleteNotif(notif)"
            title="حذف"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../config/axios';

const router = useRouter();
const notifications = ref([]);
const loading = ref(false);
const activeTab = ref('all');
const unreadCount = ref(0);

const tabs = [
  { label: 'الكل', value: 'all' },
  { label: 'غير المقروء', value: 'unread' },
  { label: 'المقروء', value: 'read' },
];

const filteredNotifications = computed(() => {
  if (activeTab.value === 'unread') {
    return notifications.value.filter(n => !n.is_read);
  }
  if (activeTab.value === 'read') {
    return notifications.value.filter(n => n.is_read);
  }
  return notifications.value;
});

const emptyMessage = computed(() => {
  const messages = {
    all: 'لا توجد إشعارات',
    unread: 'لا توجد إشعارات غير مقروءة',
    read: 'لا توجد إشعارات مقروءة',
  };
  return messages[activeTab.value];
});

const fetchNotifications = async () => {
  loading.value = true;
  try {
    const res = await api.get('/dashboard/notifications?per_page=100');
    notifications.value = res.data.data || [];
  } catch (err) {
    console.error('Failed to fetch notifications', err);
  } finally {
    loading.value = false;
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

const markAsRead = async (notif) => {
  try {
    await api.post(`/dashboard/notifications/${notif.id}/read`);
    notif.is_read = true;
    unreadCount.value = Math.max(0, unreadCount.value - 1);
  } catch (err) {
    console.error('Failed to mark as read', err);
  }
};

const markAllAsRead = async () => {
  try {
    await api.post('/dashboard/notifications/read-all');
    notifications.value.forEach(n => n.is_read = true);
    unreadCount.value = 0;
  } catch (err) {
    console.error('Failed to mark all as read', err);
  }
};

const deleteNotif = async (notif) => {
  try {
    await api.delete(`/dashboard/notifications/${notif.id}`);
    notifications.value = notifications.value.filter(n => n.id !== notif.id);
    if (!notif.is_read) {
      unreadCount.value = Math.max(0, unreadCount.value - 1);
    }
  } catch (err) {
    console.error('Failed to delete notification', err);
  }
};

const handleNotifClick = (notif) => {
  if (!notif.is_read) {
    markAsRead(notif);
  }
  if (notif.action_url && notif.action_url.startsWith('/admin/')) {
    router.push(notif.action_url);
  }
};

const formatDate = (dateStr) => {
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

onMounted(() => {
  fetchNotifications();
  fetchUnreadCount();
});
</script>

<style scoped>
.notifications-page { padding: 1.5rem; }

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}
.page-title { font-size: 1.25rem; font-weight: 700; color: var(--text-main); }
.page-subtitle { font-size: 0.8rem; color: #6b7280; margin-top: 0.2rem; }

.btn-primary {
  background: #873260;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover { background: #6d264d; }

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}
.tab-btn {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  position: relative;
}
.tab-btn:hover { background: var(--bg-main); color: var(--text-main); }
.tab-btn.active {
  background: rgba(135, 50, 96, 0.1);
  color: #873260;
}
.tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  background: #dc2626;
  color: #fff;
  border-radius: 50%;
  font-size: 0.65rem;
  font-weight: 700;
  margin-right: 0.3rem;
}

.notif-list { display: flex; flex-direction: column; gap: 0.75rem; }

.notif-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  transition: all 0.2s;
}
.notif-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border-color: #e5e7eb;
}
.notif-card.unread {
  border-right: 3px solid #873260;
  background: rgba(135, 50, 96, 0.03);
}

.notif-card-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
}
.notif-card-icon.order { background: #3b82f6; }
.notif-card-icon.return { background: #f59e0b; }
.notif-card-icon.message { background: #10b981; }
.notif-card-icon.review { background: #8b5cf6; }
.notif-card-icon.wallet { background: #0ea5e9; }
.notif-card-icon.security { background: #ef4444; }
.notif-card-icon.general { background: #6b7280; }

.notif-card-content {
  flex: 1;
  cursor: pointer;
  min-width: 0;
}
.notif-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.3rem;
}
.notif-card-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-main);
}
.notif-card-time {
  font-size: 0.7rem;
  color: #9ca3af;
  flex-shrink: 0;
}
.notif-card-message {
  font-size: 0.78rem;
  color: #6b7280;
  line-height: 1.4;
  margin: 0;
}

.notif-card-actions {
  display: flex;
  gap: 0.3rem;
  flex-shrink: 0;
}
.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: var(--bg-main);
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.action-btn:hover { background: #e5e7eb; }
.read-btn:hover { color: #10b981; background: rgba(16, 185, 129, 0.1); }
.delete-btn:hover { color: #dc2626; background: #fef2f2; }

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
  color: #9ca3af;
}
.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #873260;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #9ca3af;
  gap: 1rem;
}
.empty-state p { font-size: 0.85rem; }
</style>
