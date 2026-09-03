<template>
  <div class="dashboard" dir="rtl">

    <!-- ===== PAGE HEADER ===== -->
    <div class="dash-header">
      <div>
        <h1 class="dash-title">الصفحة الرئيسية</h1>
        <p class="dash-subtitle">نظرة عامة لحظية على منظومة بي كايت والأنظمة الرقمية — {{ formattedDate }}</p>
      </div>
      <button class="refresh-btn" @click="fetchAll" :disabled="loading" title="تحديث البيانات">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{ 'spin-icon': loading }">
          <polyline points="23 4 23 10 17 10"/>
          <polyline points="1 20 1 14 7 14"/>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
        </svg>
        تحديث لحظي
      </button>
    </div>

    <!-- ===== LOADING STATE ===== -->
    <div v-if="loading" class="dashboard-loading">
      <div class="spinner"></div>
      <p>جاري تحميل البيانات الحية...</p>
    </div>

    <!-- ===== ERROR STATE ===== -->
    <div v-else-if="error" class="error-alert">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <p>{{ error }}</p>
      <button @click="fetchAll" class="retry-btn">إعادة المحاولة</button>
    </div>

    <!-- ===== MAIN CONTENT ===== -->
    <template v-else>

      <!-- ===== ROW 1: STAT CARDS (6 Active Sections) ===== -->
      <div class="stats-grid">
        <router-link
          v-for="card in statCards"
          :key="card.key"
          :to="card.link"
          class="stat-card"
        >
          <div class="stat-top">
            <div class="stat-icon" :style="{ background: card.iconBg }">
              <span v-html="card.icon"></span>
            </div>
            <span v-if="card.pill" class="stat-pill" :class="card.pillClass">
              {{ card.pill }}
            </span>
          </div>
          <div class="stat-bottom">
            <div class="stat-value">{{ card.value }}</div>
            <div class="stat-label">{{ card.label }}</div>
          </div>
        </router-link>
      </div>

      <!-- ===== ROW 2: CHARTS ===== -->
      <div class="charts-row">

        <!-- Donut: System Distribution -->
        <div class="chart-card donut-card">
          <div class="chart-header">
            <h3 class="chart-title">توزيع العناصر في المنظومة</h3>
            <span class="chart-sub-tag">إجمالي: {{ totalSystemItems }} عنصر</span>
          </div>
          <div class="donut-body">
            <div class="donut-canvas-wrap">
              <canvas ref="donutCanvas" width="160" height="160"></canvas>
              <div class="donut-center-text">
                <span class="donut-total-num">{{ totalSystemItems }}</span>
                <span class="donut-total-lbl">إجمالي</span>
              </div>
            </div>
            <div class="donut-legend-grid">
              <div v-for="item in dynamicDistribution" :key="item.label" class="legend-row">
                <div class="legend-left-part">
                  <span class="legend-dot" :style="{ background: item.color }"></span>
                  <span class="legend-lbl">{{ item.label }}</span>
                </div>
                <span class="legend-count">{{ item.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Line: Activity Overview -->
        <div class="chart-card line-card">
          <div class="chart-header">
            <h3 class="chart-title">حالة التفاعل والطلبات والرسائل</h3>
            <div class="period-toggle">
              <span class="live-indicator">
                <span class="live-dot"></span>
                بيانات حية
              </span>
            </div>
          </div>
          <div class="activity-summary-grid">
            <div class="act-item">
              <span class="act-num text-purple">{{ newInquiriesCount }}</span>
              <span class="act-label">طلبات جديدة</span>
            </div>
            <div class="act-item">
              <span class="act-num text-amber">{{ inProgressInquiriesCount }}</span>
              <span class="act-label">طلبات قيد المتابعة</span>
            </div>
            <div class="act-item">
              <span class="act-num text-emerald">{{ convertedInquiriesCount }}</span>
              <span class="act-label">عقود منجزة</span>
            </div>
            <div class="act-item">
              <span class="act-num text-rose">{{ unreadMessagesCount }}</span>
              <span class="act-label">رسائل غير مقروءة</span>
            </div>
            <div class="act-item">
              <span class="act-num text-sky">{{ activeCareersCount }}</span>
              <span class="act-label">شواغر متاحة</span>
            </div>
          </div>
          <div class="line-wrapper">
            <canvas ref="lineCanvas"></canvas>
          </div>
        </div>
      </div>

      <!-- ===== ROW 3: RECENT INQUIRIES + MESSAGES ===== -->
      <div class="tables-row">

        <!-- Recent Inquiries -->
        <div class="section-card">
          <div class="section-header">
            <div class="section-title-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f008c" stroke-width="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
              <span class="section-title">أحدث طلبات واستفسارات الخدمات</span>
            </div>
            <router-link to="/admin/service-requests" class="view-all-link">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
              عرض الكل
            </router-link>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>العميل / الجهة</th>
                  <th>الخدمة المطلوبة</th>
                  <th>الميزانية</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="lead in recentInquiries" :key="lead.id">
                  <td>
                    <div class="client-info">
                      <span class="client-name">{{ lead.full_name }}</span>
                      <small v-if="lead.company" class="text-muted">{{ lead.company }}</small>
                    </div>
                  </td>
                  <td class="td-order-id">{{ lead.service_name || lead.service_type }}</td>
                  <td class="td-amount">{{ lead.budget_range || 'غير محدد' }}</td>
                  <td>
                    <span class="status-badge" :class="'status-' + lead.status">
                      {{ statusLabel(lead.status) }}
                    </span>
                  </td>
                </tr>
                <tr v-if="!recentInquiries.length">
                  <td colspan="4" class="td-empty">لا توجد طلبات جديدة حالياً</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent Contact Messages -->
        <div class="section-card">
          <div class="section-header">
            <div class="section-title-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffc700" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span class="section-title">أحدث رسائل التواصل الواردة</span>
            </div>
            <router-link to="/admin/messages" class="view-all-link">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
              عرض الكل
            </router-link>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>المرسل</th>
                  <th>الموضوع</th>
                  <th>التاريخ</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="msg in recentMessages" :key="msg.id">
                  <td>
                    <div class="client-info">
                      <span class="client-name">{{ msg.name || msg.sender_name }}</span>
                      <small class="text-muted ltr-text">{{ msg.email }}</small>
                    </div>
                  </td>
                  <td class="td-subject">{{ msg.subject || '-' }}</td>
                  <td class="td-date">{{ formatShortDate(msg.created_at) }}</td>
                  <td>
                    <span class="status-badge" :class="msg.status === 'read' || msg.is_read ? 'status-converted' : 'status-new'">
                      {{ (msg.status === 'read' || msg.is_read) ? 'مقروءة' : 'غير مقروءة' }}
                    </span>
                  </td>
                </tr>
                <tr v-if="!recentMessages.length">
                  <td colspan="4" class="td-empty">لا توجد رسائل واردة حالياً</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import { ProjectService, ProductService, SolutionService, InquiryService, ContentService } from '../services';
import api from '../config/axios';
import { useTheme } from '../composables/useTheme';

Chart.register(...registerables);

const { isDark } = useTheme();

// ─── Canvas refs ───────────────────────────────────────────────────────────────
const donutCanvas = ref(null);
const lineCanvas  = ref(null);
let donutChartInstance = null;
let lineChartInstance  = null;

// ─── State ─────────────────────────────────────────────────────────────────────
const loading   = ref(true);
const error     = ref(null);
const solutions = ref([]);
const projects  = ref([]);
const inquiries = ref([]);
const products  = ref([]);
const careers   = ref([]);
const messages  = ref([]);

const formattedDate = computed(() => {
  return new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
});

// Dynamic Counts
const newInquiriesCount = computed(() => inquiries.value.filter(i => i.status === 'new').length);
const inProgressInquiriesCount = computed(() => inquiries.value.filter(i => i.status === 'in_progress' || i.status === 'contacted').length);
const convertedInquiriesCount = computed(() => inquiries.value.filter(i => i.status === 'converted').length);
const unreadMessagesCount = computed(() => messages.value.filter(m => m.status === 'unread' || m.is_read === 0).length);
const activeCareersCount = computed(() => careers.value.filter(c => c.is_active === 1 || c.is_active === true).length);

const totalSystemItems = computed(() => {
  return (
    solutions.value.length +
    projects.value.length +
    inquiries.value.length +
    products.value.length +
    careers.value.length +
    messages.value.length
  );
});

// 6 Core Stat Cards directly linked to live database counts
const statCards = computed(() => [
  {
    key: 'solutions',
    label: 'حلول',
    value: String(solutions.value.length),
    pill: 'دليل الحلول',
    pillClass: 'pill-neutral',
    link: '/admin/solutions',
    iconBg: 'rgba(79, 0, 140, 0.1)',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f008c" stroke-width="1.8"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>`,
  },
  {
    key: 'projects',
    label: 'مشاريع',
    value: String(projects.value.length),
    pill: 'البورتفوليو',
    pillClass: 'pill-neutral',
    link: '/admin/projects',
    iconBg: 'rgba(8, 145, 178, 0.1)',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0891b2" stroke-width="1.8"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  },
  {
    key: 'services',
    label: 'خدمات (طلبات)',
    value: String(inquiries.value.length),
    pill: newInquiriesCount.value > 0 ? `${newInquiriesCount.value} جديد` : 'مكتمل',
    pillClass: newInquiriesCount.value > 0 ? 'pill-danger' : 'pill-success',
    link: '/admin/service-requests',
    iconBg: 'rgba(16, 185, 129, 0.1)',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="1.8"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  },
  {
    key: 'products',
    label: 'منتجات',
    value: String(products.value.length),
    pill: 'أنظمة رقمية',
    pillClass: 'pill-neutral',
    link: '/admin/products',
    iconBg: 'rgba(255, 199, 0, 0.15)',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e6b400" stroke-width="1.8"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  },
  {
    key: 'careers',
    label: 'الوظائف',
    value: String(careers.value.length),
    pill: `${activeCareersCount.value} شاغر متاح`,
    pillClass: 'pill-info',
    link: '/admin/careers',
    iconBg: 'rgba(124, 58, 237, 0.1)',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="1.8"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><circle cx="12" cy="12" r="1"/></svg>`,
  },
  {
    key: 'messages',
    label: 'الرسائل',
    value: String(messages.value.length),
    pill: unreadMessagesCount.value > 0 ? `${unreadMessagesCount.value} غير مقروء` : 'الكل مقروء',
    pillClass: unreadMessagesCount.value > 0 ? 'pill-danger' : 'pill-success',
    link: '/admin/messages',
    iconBg: 'rgba(244, 63, 94, 0.1)',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  },
]);

// Dynamic distribution for donut chart
const dynamicDistribution = computed(() => [
  { label: 'حلول', count: solutions.value.length, color: '#4f008c' },
  { label: 'مشاريع', count: projects.value.length, color: '#0891b2' },
  { label: 'خدمات', count: inquiries.value.length, color: '#10b981' },
  { label: 'منتجات', count: products.value.length, color: '#ffc700' },
  { label: 'الوظائف', count: careers.value.length, color: '#7c3aed' },
  { label: 'الرسائل', count: messages.value.length, color: '#f43f5e' },
]);

const recentInquiries = computed(() => inquiries.value.slice(0, 5));
const recentMessages = computed(() => messages.value.slice(0, 5));

const statusLabel = (status) => {
  const map = {
    new: 'جديد',
    contacted: 'تم التواصل',
    in_progress: 'قيد التنفيذ',
    converted: 'تم التحويل',
    archived: 'مؤرشف',
  };
  return map[status] || status;
};

const formatShortDate = (dateString) => {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return d.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
};

const fetchAll = async () => {
  loading.value = true;
  error.value = null;
  try {
    const [solData, projData, inqData, prodData, carData, msgRes] = await Promise.all([
      SolutionService.getAll().catch(() => []),
      ProjectService.getAll().catch(() => []),
      InquiryService.getAll().catch(() => []),
      ProductService.getAll().catch(() => []),
      ContentService.getCareers().catch(() => []),
      api.get('/dashboard/contact-messages').then(r => r.data?.data || []).catch(() => []),
    ]);

    solutions.value = solData || [];
    projects.value  = projData || [];
    inquiries.value = inqData || [];
    products.value  = prodData || [];
    careers.value   = carData || [];
    messages.value  = msgRes || [];

    await nextTick();
    renderDonutChart();
    renderBarChart();
  } catch (err) {
    console.error('Dashboard live data fetch error', err);
    error.value = 'تعذر تحميل بيانات لوحة القيادة';
  } finally {
    loading.value = false;
  }
};

const renderDonutChart = () => {
  if (!donutCanvas.value) return;
  if (donutChartInstance) donutChartInstance.destroy();

  const ctx = donutCanvas.value.getContext('2d');
  donutChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: dynamicDistribution.value.map(s => s.label),
      datasets: [
        {
          data: dynamicDistribution.value.map(s => s.count),
          backgroundColor: dynamicDistribution.value.map(s => s.color),
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: {
          rtl: true,
          callbacks: {
            label: (c) => ` ${c.label}: ${c.raw} عنصر`,
          },
        },
      },
    },
  });
};

const renderBarChart = () => {
  if (!lineCanvas.value) return;
  if (lineChartInstance) lineChartInstance.destroy();

  const ctx = lineCanvas.value.getContext('2d');
  const labels = ['حلول', 'مشاريع', 'خدمات', 'منتجات', 'الوظائف', 'الرسائل'];
  const counts = [
    solutions.value.length,
    projects.value.length,
    inquiries.value.length,
    products.value.length,
    careers.value.length,
    messages.value.length,
  ];

  lineChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'إجمالي العناصر المسجلة',
          data: counts,
          backgroundColor: ['#4f008c', '#0891b2', '#10b981', '#ffc700', '#7c3aed', '#f43f5e'],
          borderRadius: 8,
          barThickness: 28,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { rtl: true },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Cairo', size: 12 } },
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(150, 150, 150, 0.08)' },
          ticks: { precision: 0, font: { family: 'Cairo', size: 11 } },
        },
      },
    },
  });
};

watch(isDark, () => {
  nextTick(() => {
    renderDonutChart();
    renderBarChart();
  });
});

onMounted(fetchAll);
</script>

<style scoped>
.dashboard {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Page Header */
.dash-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dash-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 0.2rem;
}
.dash-subtitle {
  font-size: 0.82rem;
  color: var(--text-muted);
}
.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.9rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-main);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.refresh-btn:hover:not(:disabled) {
  background: rgba(79, 0, 140, 0.05);
  border-color: #4f008c;
  color: #4f008c;
}
.spin-icon {
  animation: spin 1s linear infinite;
}

/* Loading & Error */
.dashboard-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  gap: 0.75rem;
  color: var(--text-muted);
}
.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(79, 0, 140, 0.15);
  border-top-color: #4f008c;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.error-alert {
  background: #fef2f2;
  border: 1px solid #fee2e2;
  color: #dc2626;
  border-radius: 10px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.retry-btn {
  margin-inline-start: auto;
  background: #dc2626;
  color: #fff;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
}

/* Row 1: Stat Cards (6 Columns) */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
}
@media (max-width: 1300px) {
  .stats-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 768px) {
  .stats-grid { grid-template-columns: 1fr 1fr; }
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-decoration: none;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  transition: all 0.2s ease;
}
.stat-card:hover {
  transform: translateY(-2px);
  border-color: #4f008c44;
  box-shadow: 0 6px 16px rgba(0,0,0,0.04);
}
.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.stat-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stat-pill {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
}
.pill-neutral { background: var(--bg-main); color: var(--text-muted); }
.pill-danger { background: #fee2e2; color: #dc2626; }
.pill-success { background: #dcfce7; color: #16a34a; }
.pill-info { background: #ede9fe; color: #7c3aed; }

.stat-bottom {
  display: flex;
  flex-direction: column;
}
.stat-value {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-main);
  line-height: 1.1;
  font-family: 'Outfit', sans-serif;
}
.stat-label {
  font-size: 0.78rem;
  color: var(--text-muted);
  font-weight: 600;
  margin-top: 0.25rem;
}

/* Row 2: Charts */
.charts-row {
  display: grid;
  grid-template-columns: 1.1fr 2fr;
  gap: 1rem;
}
@media (max-width: 1024px) {
  .charts-row { grid-template-columns: 1fr; }
}

.chart-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}
.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.chart-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-main);
}
.chart-sub-tag {
  font-size: 0.75rem;
  color: var(--text-muted);
  background: var(--bg-main);
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
}
.live-indicator {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #10b981;
}
.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Donut */
.donut-body {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
}
@media (max-width: 480px) {
  .donut-body { flex-direction: column; }
}
.donut-canvas-wrap {
  position: relative;
  width: 140px;
  height: 140px;
  flex-shrink: 0;
}
.donut-center-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.donut-total-num {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--text-main);
  font-family: 'Outfit', sans-serif;
  line-height: 1;
}
.donut-total-lbl {
  font-size: 0.65rem;
  color: var(--text-muted);
  margin-top: 0.15rem;
}
.donut-legend-grid {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  flex: 1;
}
.legend-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.78rem;
}
.legend-left-part {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.legend-lbl {
  color: var(--text-muted);
}
.legend-count {
  font-weight: 700;
  color: var(--text-main);
  font-family: 'Outfit', sans-serif;
}

/* Activity Summary Grid */
.activity-summary-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  background: var(--bg-main);
  padding: 0.75rem;
  border-radius: 10px;
}
@media (max-width: 768px) {
  .activity-summary-grid { grid-template-columns: repeat(3, 1fr); }
}
.act-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.act-num {
  font-size: 1.25rem;
  font-weight: 800;
  font-family: 'Outfit', sans-serif;
  line-height: 1.1;
}
.act-label {
  font-size: 0.68rem;
  color: var(--text-muted);
  margin-top: 0.2rem;
}
.text-purple { color: #4f008c; }
.text-amber { color: #d97706; }
.text-emerald { color: #10b981; }
.text-rose { color: #f43f5e; }
.text-sky { color: #0284c7; }

.line-wrapper {
  height: 160px;
  width: 100%;
}

/* Row 3: Tables */
.tables-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
@media (max-width: 1024px) {
  .tables-row { grid-template-columns: 1fr; }
}

.section-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.section-title-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.section-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-main);
}
.view-all-link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #4f008c;
  text-decoration: none;
}
.dark .view-all-link { color: #ffc700; }

.table-wrap {
  overflow-x: auto;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
}
.data-table th {
  padding: 0.5rem 0.6rem;
  color: var(--text-muted);
  font-weight: 600;
  border-bottom: 1px solid var(--border-color);
  text-align: right;
}
.data-table td {
  padding: 0.65rem 0.6rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-main);
}
.data-table tr:last-child td {
  border-bottom: none;
}

.client-info {
  display: flex;
  flex-direction: column;
}
.client-name {
  font-weight: 600;
}
.td-order-id {
  font-weight: 500;
}
.td-amount {
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
}
.td-subject {
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.td-date {
  font-size: 0.72rem;
  color: var(--text-muted);
}
.td-empty {
  text-align: center;
  padding: 1.5rem;
  color: var(--text-muted);
}
.text-muted { color: var(--text-muted); }
.ltr-text { direction: ltr; text-align: left; }

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.68rem;
  font-weight: 800;
  white-space: nowrap !important;
}
.status-new { background: #fee2e2; color: #dc2626; }
.status-contacted { background: #fef3c7; color: #d97706; }
.status-in_progress { background: #ede9fe; color: #7c3aed; }
.status-converted { background: #dcfce7; color: #16a34a; }
.status-archived { background: var(--bg-main); color: var(--text-muted); }
</style>
